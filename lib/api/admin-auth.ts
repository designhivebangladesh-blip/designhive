import { scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { SignJWT, jwtVerify } from "jose";

import { getEnv } from "@/lib/env";
import type { AuthenticatedUser } from "@/lib/api/auth";

const scryptAsync = promisify(scrypt);

export const ADMIN_SESSION_COOKIE = "designhive_admin_session";
const SESSION_DURATION = "8h";

/**
 * ADMIN_PASSWORD_HASH is stored as "<saltHex>:<hashHex>", generated with:
 *
 *   node -e "const c=require('crypto');const s=c.randomBytes(16).toString('hex');
 *   c.scrypt(process.argv[1], s, 64, (e,k) => console.log(s+':'+k.toString('hex')));" "your-password"
 *
 * Run that locally — never paste a real password into chat or a repo.
 */
export async function verifyAdminCredentials(
  username: string,
  password: string
): Promise<boolean> {
  const env = getEnv();

  // Compare username with a fixed-time check too, so response timing
  // doesn't leak whether the username alone was correct.
  const usernameMatches =
    username.length === env.ADMIN_USERNAME.length &&
    timingSafeEqual(Buffer.from(username), Buffer.from(env.ADMIN_USERNAME));

  const [salt, storedHash] = env.ADMIN_PASSWORD_HASH.split(":");
  if (!salt || !storedHash) return false;

  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  const storedKey = Buffer.from(storedHash, "hex");

  const passwordMatches =
    derivedKey.length === storedKey.length &&
    timingSafeEqual(derivedKey, storedKey);

  return usernameMatches && passwordMatches;
}

export async function createAdminSessionToken(username: string): Promise<string> {
  const { JWT_SECRET } = getEnv();
  const secretKey = new TextEncoder().encode(JWT_SECRET);

  return new SignJWT({ role: "admin" } satisfies Pick<AuthenticatedUser, "role">)
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(username)
    .setIssuedAt()
    .setExpirationTime(SESSION_DURATION)
    .sign(secretKey);
}

export async function verifyAdminSessionToken(
  token: string | undefined
): Promise<AuthenticatedUser | null> {
  if (!token) return null;

  try {
    const { JWT_SECRET } = getEnv();
    const secretKey = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secretKey);
    if (payload.role !== "admin") return null;
    return payload as AuthenticatedUser;
  } catch {
    return null;
  }
}
