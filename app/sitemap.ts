import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { locales } from "@/lib/i18n/config";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://designhivebangladesh.com";

const slugsQuery = groq`{
  "posts": *[_type == "blogPost" && defined(slug.current)].slug.current
}`;

interface SlugsResult {
  posts: string[];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = locales.flatMap((locale) => [
    { url: `${SITE_URL}/${locale}`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/${locale}/portfolio`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/${locale}/quote`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/${locale}/blog`, changeFrequency: "weekly", priority: 0.7 },
  ]);

  try {
    const { posts } = await client.fetch<SlugsResult>(slugsQuery);

    const postRoutes: MetadataRoute.Sitemap = locales.flatMap((locale) =>
      posts.map((slug) => ({
        url: `${SITE_URL}/${locale}/blog/${slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }))
    );

    // NOTE: individual project case studies are rendered as an in-page modal
    // on /[locale]/portfolio rather than dedicated detail routes, so they are
    // intentionally not listed here (a `/work/[slug]` route never existed —
    // linking to it would have produced soft-404s in search results).
    return [...staticRoutes, ...postRoutes];
  } catch (error) {
    // Sanity unreachable — still serve a valid sitemap of static routes
    // rather than a 500 for the whole file.
    console.error("[sitemap_fetch_error]", error);
    return staticRoutes;
  }
}
