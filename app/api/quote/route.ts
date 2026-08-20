import { NextResponse } from "next/server";
import { ApiError, toErrorResponse } from "@/lib/api/errors";
import { validateQuotePayload } from "@/lib/api/validate-quote";
import { assertWithinRateLimit, getClientIdentifier } from "@/lib/api/rate-limit";
import { writeClient } from "@/sanity/lib/writeClient";
import type { ApiSuccessResponse, QuoteRequestRecord } from "@/lib/types";

// Route guards run first and stay separate from the business logic below.
function applyRouteGuards(request: Request): void {
  const identifier = getClientIdentifier(request);
  assertWithinRateLimit(identifier);
}

const CONTACT_METHOD_LABELS: Record<string, string> = {
  email: "Email",
  phone: "Phone",
  whatsapp: "WhatsApp",
};

function composeDetails(
  payload: Omit<QuoteRequestRecord, "id" | "createdAt" | "status">
): string {
  const lines = [
    payload.companyName ? `Company / Brand: ${payload.companyName}` : null,
    `Country: ${payload.country}`,
    `Preferred contact method: ${CONTACT_METHOD_LABELS[payload.preferredContact] ?? payload.preferredContact}`,
    "",
    payload.message,
  ];
  return lines.filter((line) => line !== null).join("\n");
}

// Persists the lead as a Sanity `order` document, visible in the admin
// dashboard and Studio. Uses the server-only writeClient — never the
// public read client, since this data includes customer PII.
async function createQuoteRequest(
  payload: Omit<QuoteRequestRecord, "id" | "createdAt" | "status">
): Promise<QuoteRequestRecord> {
  const createdAt = new Date().toISOString();

  const doc = await writeClient.create({
    _type: "order",
    clientName: payload.name,
    clientEmail: payload.email,
    clientPhone: payload.phone,
    budget: payload.budgetRange,
    details: composeDetails(payload),
    status: "new",
    submittedAt: createdAt,
  });

  return {
    ...payload,
    id: doc._id,
    createdAt,
    status: "new",
  };
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    applyRouteGuards(request);

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      throw new ApiError(422, "INVALID_JSON", "Request body must be valid JSON.");
    }

    const result = validateQuotePayload(body);
    if (!result.valid) {
      throw ApiError.unprocessable(result.errors);
    }

    const record = await createQuoteRequest(result.data);

    const response: ApiSuccessResponse<QuoteRequestRecord> = { data: record };
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}

// Any other method on this route is explicitly rejected with 405,
// rather than falling through to a default Next.js response.
export async function GET(): Promise<NextResponse> {
  return toErrorResponse(new ApiError(405, "METHOD_NOT_ALLOWED", "Use POST to submit a quote request."));
}
