import "server-only";
import { createClient } from "next-sanity";

import { projectId, dataset, apiVersion } from "@/sanity/env";

const token = process.env.SANITY_API_WRITE_TOKEN;

if (!token) {
  throw new Error(
    "Missing SANITY_API_WRITE_TOKEN. Generate one at manage.sanity.io -> your project -> API -> Tokens (Editor permission is enough), then add it to .env.local. Never prefix it with NEXT_PUBLIC_."
  );
}

/**
 * Authenticated client for server-only code paths: writing Order/Message
 * documents from the quote form, and reading them back for the admin
 * dashboard. Deliberately NOT exported from anywhere a client component
 * could import it — importing "server-only" makes any accidental
 * client-side import a build error rather than a silent token leak.
 */
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
  perspective: "published",
});
