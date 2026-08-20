import { createClient, type QueryParams } from "next-sanity";

import { projectId, dataset, apiVersion } from "@/sanity/env";

/**
 * `useCdn: true` + `perspective: "published"` — fast, cached reads of only
 * published content, appropriate for a public marketing site. If/when a
 * "preview drafts" mode is added for editors, that path should use a
 * separate client with a read token and `perspective: "previewDrafts"`
 * rather than changing this one.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});

interface SanityFetchOptions<QueryString extends string> {
  query: QueryString;
  params?: QueryParams;
  /**
   * Cache tags for Next.js's fetch cache. Pass the same tag(s) to
   * `revalidateTag()` (e.g. from a Sanity webhook route) to invalidate
   * only the queries that depend on the content that changed.
   */
  tags?: string[];
}

export async function sanityFetch<QueryResponse, QueryString extends string = string>({
  query,
  params = {},
  tags,
}: SanityFetchOptions<QueryString>): Promise<QueryResponse> {
  return client.fetch<QueryResponse>(query, params, {
    next: { tags },
  });
}
