import { ApiError } from "@/lib/api/errors";

/**
 * Minimal fixed-window rate limiter suitable for a single serverless
 * instance / edge region. For multi-instance production deployments,
 * swap this Map for Redis (e.g. Upstash) behind the same interface —
 * callers only depend on `assertWithinRateLimit`.
 */

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 10;

interface Bucket {
  count: number;
  windowStartedAt: number;
}

const buckets = new Map<string, Bucket>();

export function assertWithinRateLimit(identifier: string): void {
  const now = Date.now();
  const bucket = buckets.get(identifier);

  if (!bucket || now - bucket.windowStartedAt > WINDOW_MS) {
    buckets.set(identifier, { count: 1, windowStartedAt: now });
    return;
  }

  if (bucket.count >= MAX_REQUESTS_PER_WINDOW) {
    throw new ApiError(429, "TOO_MANY_REQUESTS", "Too many requests. Please try again in a minute.");
  }

  bucket.count += 1;
}

export function getClientIdentifier(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() ?? "unknown";
}
