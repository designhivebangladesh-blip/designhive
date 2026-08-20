import { NextResponse } from "next/server";
import { ApiError, toErrorResponse } from "@/lib/api/errors";
import { assertWithinRateLimit, getClientIdentifier } from "@/lib/api/rate-limit";
import {
  verifyAdminCredentials,
  createAdminSessionToken,
  ADMIN_SESSION_COOKIE,
} from "@/lib/api/admin-auth";

interface LoginBody {
  username?: string;
  password?: string;
}

function applyRouteGuards(request: Request): void {
  // Separate bucket from other routes, and deliberately strict — this
  // endpoint is a credential-guessing target.
  const identifier = `${getClientIdentifier(request)}:admin-login`;
  assertWithinRateLimit(identifier);
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    applyRouteGuards(request);

    let body: LoginBody;
    try {
      body = (await request.json()) as LoginBody;
    } catch {
      throw new ApiError(422, "INVALID_JSON", "Request body must be valid JSON.");
    }

    const { username, password } = body;
    if (!username || !password) {
      throw new ApiError(422, "MISSING_CREDENTIALS", "Username and password are required.");
    }

    const isValid = await verifyAdminCredentials(username, password);
    if (!isValid) {
      throw ApiError.unauthorized("Incorrect username or password.");
    }

    const token = await createAdminSessionToken(username);

    const response = NextResponse.json({ data: { ok: true } });
    response.cookies.set(ADMIN_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8, // 8h, matches the JWT's own expiration
    });

    return response;
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function GET(): Promise<NextResponse> {
  return toErrorResponse(
    new ApiError(405, "METHOD_NOT_ALLOWED", "Use POST to log in.")
  );
}
