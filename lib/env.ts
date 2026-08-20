/**
 * Central environment schema. Import `env` instead of reading
 * `process.env` directly anywhere else in the codebase — this keeps
 * every required variable declared in one place and fails fast on boot
 * (or on first import in serverless) if something is missing.
 *
 * See `.env.example` for the variables this expects.
 */

interface Env {
  // Reserved/unused for now — Orders and Messages are stored in Sanity,
  // not Postgres. Kept optional rather than deleted in case a future
  // feature genuinely needs relational storage.
  DATABASE_URL?: string;
  JWT_SECRET: string;
  QUOTE_NOTIFY_WEBHOOK_URL?: string;
  NODE_ENV: "development" | "production" | "test";
  // Admin dashboard credentials (single shared account for the internal
  // team, per current requirements — see lib/api/admin-auth.ts).
  ADMIN_USERNAME: string;
  ADMIN_PASSWORD_HASH: string;
}

function required(name: string): string {
  const value = process.env[name];
  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function loadEnv(): Env {
  return {
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: required("JWT_SECRET"),
    QUOTE_NOTIFY_WEBHOOK_URL: process.env.QUOTE_NOTIFY_WEBHOOK_URL,
    NODE_ENV: (process.env.NODE_ENV as Env["NODE_ENV"]) ?? "development",
    ADMIN_USERNAME: required("ADMIN_USERNAME"),
    ADMIN_PASSWORD_HASH: required("ADMIN_PASSWORD_HASH"),
  };
}

// Lazily validated so `next build` / linting doesn't require secrets,
// but any real request path that touches `env` will throw immediately
// if the deployment is misconfigured.
let cached: Env | undefined;

export function getEnv(): Env {
  if (!cached) {
    cached = loadEnv();
  }
  return cached;
}
