/**
 * Sanity connection config, read once and validated here so every other
 * file (`sanity.config.ts`, the Studio route, `lib/sanity/client.ts`)
 * imports these constants instead of touching `process.env` directly.
 *
 * All three are intentionally `NEXT_PUBLIC_` — Sanity Studio is a
 * client-side React app even when embedded in a Next.js route, so it
 * needs these inlined into the browser bundle. None of them are secrets:
 * a project ID and dataset name identify the project but grant no access
 * on their own (dataset read/write rules and Studio login handle auth).
 */

function required(name: string, value: string | undefined): string {
  if (!value || value.trim().length === 0) {
    throw new Error(
      `Missing required environment variable: ${name}. Check .env.local against .env.example.`
    );
  }
  return value;
}

export const projectId = required(
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
);

export const dataset = required(
  "NEXT_PUBLIC_SANITY_DATASET",
  process.env.NEXT_PUBLIC_SANITY_DATASET
);

/**
 * Locked to a fixed date (not "latest") so the GROQ/API response shape
 * never changes underneath the app without an explicit, intentional bump.
 * https://www.sanity.io/docs/api-versioning
 */
export const apiVersion = required(
  "NEXT_PUBLIC_SANITY_API_VERSION",
  process.env.NEXT_PUBLIC_SANITY_API_VERSION
);
