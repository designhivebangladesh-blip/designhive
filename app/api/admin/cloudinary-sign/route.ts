import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { cookies } from "next/headers";
import { ApiError, toErrorResponse } from "@/lib/api/errors";
import { assertWithinRateLimit, getClientIdentifier } from "@/lib/api/rate-limit";
import { verifyAdminSessionToken, ADMIN_SESSION_COOKIE } from "@/lib/api/admin-auth";

/**
 * Signs direct-to-Cloudinary uploads for the custom /admin CRUD engine.
 *
 * Deliberately a separate endpoint from /api/cloudinary/sign (which Sanity
 * Studio's Cloudinary widget uses, gated only by Studio's own project
 * membership + an origin check). This one is gated by an actual admin
 * session check, since it's only ever called from authenticated /admin
 * pages — tighter validation than the Studio route, and doesn't touch or
 * risk that already-working code path.
 */

const UPLOAD_ROOT_FOLDER = "designhive";
const ALLOWED_RESOURCE_TYPES = new Set(["image", "video"]);

function signParams(params: Record<string, string | number>, apiSecret: string): string {
  const sorted = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return createHash("sha1").update(sorted + apiSecret).digest("hex");
}

interface SignRequestBody {
  resource_type?: string;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const identifier = `${getClientIdentifier(request)}:admin-cloudinary-sign`;
    assertWithinRateLimit(identifier);

    const cookieStore = await cookies();
    const session = await verifyAdminSessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
    if (!session) {
      throw ApiError.unauthorized("Please sign in to the admin dashboard again.");
    }

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
      throw new ApiError(422, "INVALID_RESOURCE_TYPE", "Only image and video uploads are allowed.");
    }

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
  return toErrorResponse(new ApiError(405, "METHOD_NOT_ALLOWED", "Use POST to request an upload signature."));
}
