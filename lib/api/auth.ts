import { jwtVerify, type JWTPayload } from "jose";
import { ApiError } from "@/lib/api/errors";
import { getEnv } from "@/lib/env";

export interface AuthenticatedUser extends JWTPayload {
  sub: string;
  role: "admin" | "editor";
}

/**
 * Verifies the bearer token on an incoming request and returns the
 * decoded payload, or throws an ApiError(401). Keep this isolated from
 * route handlers so any protected route (e.g. an internal /admin API
 * for reviewing quote requests) can compose it the same way:
 *
 *   export async function GET(request: Request) {
 *     try {
 *       const user = await requireAuth(request);
 *       if (user.role !== "admin") throw ApiError.forbidden();
 *       ...
 *     } catch (error) {
 *       return toErrorResponse(error);
 *     }
 *   }
 */
export async function requireAuth(request: Request): Promise<AuthenticatedUser> {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) {
    throw ApiError.unauthorized("Missing or malformed Authorization header.");
  }

  const token = header.slice("Bearer ".length);

  try {
    const { JWT_SECRET } = getEnv();
    const secretKey = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secretKey);
    return payload as AuthenticatedUser;
  } catch {
    throw ApiError.unauthorized("Your session has expired. Please sign in again.");
  }
}
