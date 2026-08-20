import "server-only";
import { cookies } from "next/headers";
import { verifyAdminSessionToken, ADMIN_SESSION_COOKIE } from "@/lib/api/admin-auth";
import type { AuthenticatedUser } from "@/lib/api/auth";

/**
 * Server Actions are callable directly (they're POST endpoints under the
 * hood) even when the page that renders their <form> sits behind an
 * auth-gated layout — a layout only runs while rendering a route, not
 * when a client hits the action's endpoint directly. Every admin
 * mutation must therefore re-check the session itself; never rely on the
 * page-level redirect in app/admin/(dashboard)/layout.tsx alone.
 */
export async function requireAdminSession(): Promise<AuthenticatedUser> {
  const cookieStore = await cookies();
  const session = await verifyAdminSessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
  if (!session) {
    throw new Error("Your session has expired. Please sign in again.");
  }
  return session;
}
