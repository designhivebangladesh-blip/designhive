import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { ApiError, toErrorResponse } from "@/lib/api/errors";
import { assertWithinRateLimit, getClientIdentifier } from "@/lib/api/rate-limit";

// All Studio uploads are locked under this single folder — the client
// (Studio's Cloudinary asset source) can never redirect an upload
// elsewhere in the account, since `folder` below is server-decided,
// not read from the request body.
const UPLOAD_ROOT_FOLDER = "designhive";
const ALLOWED_RESOURCE_TYPES = new Set(["image", "video"]);

// Separate rate-limit namespace from other routes (e.g. /api/quote) so a
// burst of one doesn't consume the other's budget — same shared limiter,
// distinct bucket key.
function applyRouteGuards(request: Request): void {
  const identifier = `${getClientIdentifier(request)}:cloudinary-sign`;
  assertWithinRateLimit(identifier);

  // Best-effort origin check. This narrows who can casually call the
  // endpoint but is NOT a substitute for verifying the caller is a
  // logged-in Sanity Studio admin — Studio access itself is gated by
  // Sanity project membership; this endpoint alone is not.
  const allowedOrigin = process.env.NEXT_PUBLIC_SITE_URL;
  if (allowedOrigin) {
    const origin = request.headers.get("origin") ?? request.headers.get("referer");
    if (!origin || !origin.startsWith(allowedOrigin)) {
      throw ApiError.forbidden("Requests must originate from the Designhive Studio.");
    }
  }
}

interface SignRequestBody {
  resource_type?: string;
}

function signParams(params: Record<string, string | number>, apiSecret: string): string {
  const sorted = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return createHash("sha1").update(sorted + apiSecret).digest("hex");
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    applyRouteGuards(request);

    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!apiSecret || !apiKey || !cloudName) {
      throw ApiError.internal("Cloudinary is not configured on the server.");
    }

    let body: SignRequestBody = {};
    try {
      const raw = await request.text();
      body = raw ? (JSON.parse(raw) as SignRequestBody) : {};
    } catch {
      throw new ApiError(422, "INVALID_JSON", "Request body must be valid JSON.");
    }

    if (body.resource_type && !ALLOWED_RESOURCE_TYPES.has(body.resource_type)) {
      throw new ApiError(
        422,
        "INVALID_RESOURCE_TYPE",
        "Only image and video uploads are allowed."
      );
    }

    // Everything signed here is server-decided — the client cannot
    // override folder, timestamp, or any other signed parameter.
    const paramsToSign: Record<string, string | number> = {
      timestamp: Math.floor(Date.now() / 1000),
      folder: UPLOAD_ROOT_FOLDER,
    };

    const signature = signParams(paramsToSign, apiSecret);

    return NextResponse.json({
      data: {
        signature,
        timestamp: paramsToSign.timestamp,
        folder: paramsToSign.folder,
        apiKey,
        cloudName,
      },
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function GET(): Promise<NextResponse> {
  return toErrorResponse(
    new ApiError(405, "METHOD_NOT_ALLOWED", "Use POST to request an upload signature.")
  );
}
