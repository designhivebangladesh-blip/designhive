import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Tag,
  Twitter,
  Instagram,
  Linkedin,
  Globe,
  type LucideIcon,
} from "lucide-react";
import { sanityFetch } from "@/sanity/lib/client";
import { client } from "@/sanity/lib/client";
import { cloudinaryUrl } from "@/sanity/lib/image";
import { groq } from "next-sanity";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  singleBlogPostQuery,
  relatedBlogPostsQuery,
  siteSettingsQuery,
  type SingleBlogPostResult,
  type BlogPostCardResult,
  type SiteSettingsResult,
} from "@/sanity/lib/queries";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { readingTimeLabel } from "@/lib/utils/readingTime";
import { PortableText } from "@portabletext/react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://designhivebangladesh.com";

const SOCIAL_ICON_MAP: Record<string, LucideIcon> = {
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  website: Globe,
};

/* ── Static params ────────────────────────────────────────────────── */
export async function generateStaticParams() {
  const slugsQuery = groq`*[_type == "blogPost" && defined(slug.current)].slug.current`;
  let slugs: string[] = [];
  try {
    slugs = await client.fetch<string[]>(slugsQuery);
  } catch (_err) {
    slugs = [];
  }
  return locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  );
}

/* ── Metadata ─────────────────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const safeLocale: Locale = isLocale(locale) ? locale : "bn";

  let post: SingleBlogPostResult | null = null;
  try {
    post = await sanityFetch<SingleBlogPostResult | null>({
      query: singleBlogPostQuery,
      params: { slug },
      tags: ["blogPost"],
    });
  } catch (_err) {
    post = null;
  }

  if (!post) {
    return { title: "Post Not Found — Designhive" };
  }

  const title = post.seo?.metaTitle ?? `${post.title} — Designhive`;
  const description = post.seo?.metaDescription ?? post.excerpt;
  const ogImageUrl = post.seo?.ogImage
    ? cloudinaryUrl(post.seo.ogImage, { width: 1200, height: 630 })
    : post.coverImage
      ? cloudinaryUrl(post.coverImage, { width: 1200, height: 630, crop: "fill" })
      : undefined;
  const canonical = `${SITE_URL}/${safeLocale}/blog/${slug}`;

  // BlogPosting JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: post.author
      ? { "@type": "Person", name: post.author.name }
      : undefined,
    image: ogImageUrl,
    url: canonical,
    publisher: {
      "@type": "Organization",
      name: "Designhive",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo-full.png` },
    },
  };

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical,
      languages: Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}/blog/${slug}`])),
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Designhive",
      type: "article",
      publishedTime: post.publishedAt,
      images: ogImageUrl ? [{ url: ogImageUrl, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImageUrl ? [ogImageUrl] : undefined,
    },
    other: {
      "application/ld+json": JSON.stringify(jsonLd),
    },
  };
}

/* ── Portable Text components ─────────────────────────────────────── */
const portableTextComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="my-6 text-base leading-relaxed text-parchment/75">{children}</p>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="mb-4 mt-12 font-display text-3xl font-semibold text-parchment">{children}</h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="mb-3 mt-8 font-display text-2xl font-semibold text-parchment">{children}</h3>
    ),
    h4: ({ children }: { children?: React.ReactNode }) => (
      <h4 className="mb-2 mt-6 font-display text-xl font-semibold text-parchment">{children}</h4>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="my-8 border-l-4 border-gold-400 pl-6 text-lg italic text-parchment/65">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-semibold text-parchment">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="italic text-parchment/80">{children}</em>
    ),
    code: ({ children }: { children?: React.ReactNode }) => (
      <code className="rounded bg-ink-line px-1.5 py-0.5 font-mono text-sm text-gold-300">
        {children}
      </code>
    ),
    link: ({ value, children }: { value?: { href?: string }; children?: React.ReactNode }) => (
      <a
        href={value?.href ?? "#"}
        target={value?.href?.startsWith("http") ? "_blank" : undefined}
        rel={value?.href?.startsWith("http") ? "noopener noreferrer" : undefined}
        className="text-gold-300 underline underline-offset-4 transition-colors hover:text-gold-200"
      >
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="my-6 list-disc space-y-2 pl-6 text-parchment/70">{children}</ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol className="my-6 list-decimal space-y-2 pl-6 text-parchment/70">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <li className="leading-relaxed">{children}</li>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <li className="leading-relaxed">{children}</li>
    ),
  },
  types: {
    "cloudinary.asset": ({ value }: { value?: { public_id?: string; secure_url?: string; width?: number; height?: number } }) => {
      if (!value?.secure_url) return null;
      return (
        <figure className="my-10">
          <div className="relative overflow-hidden rounded-xl border border-gold-400/15">
            <Image
              src={value.secure_url}
              alt=""
              width={value.width ?? 1200}
              height={value.height ?? 675}
              className="w-full object-cover"
            />
          </div>
        </figure>
      );
    },
  },
};

/* ── Page ─────────────────────────────────────────────────────────── */
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const safeLocale: Locale = isLocale(locale) ? locale : "bn";
  const messages = getMessages(safeLocale);

  const [post, siteSettings] = await Promise.all([
    sanityFetch<SingleBlogPostResult | null>({
      query: singleBlogPostQuery,
      params: { slug },
      tags: ["blogPost"],
    }).catch(() => null),
    sanityFetch<SiteSettingsResult | null>({
      query: siteSettingsQuery,
      tags: ["siteSettings"],
    }).catch(() => null),
  ]);

  if (!post) {
    notFound();
  }

  const logoUrl = siteSettings?.logoIcon
    ? cloudinaryUrl(siteSettings.logoIcon, { width: 72, height: 72, crop: "fill" })
    : "/logo-icon.png";
  const siteName = siteSettings?.siteName ?? "Designhive";

  const coverUrl = post.coverImage
    ? cloudinaryUrl(post.coverImage, { width: 1400, height: 700, crop: "fill" })
    : undefined;
  const readLabel = readingTimeLabel(post.body ?? []);

  // Fetch related posts
  let relatedPosts: BlogPostCardResult[] = [];
  if (post.categories && post.categories.length > 0) {
    try {
      relatedPosts = await sanityFetch<BlogPostCardResult[]>({
        query: relatedBlogPostsQuery,
        params: { slug, categories: post.categories },
        tags: ["blogPost"],
      });
    } catch (_err) {
      relatedPosts = [];
    }
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  return (
    <>
      {/* Skip to main */}
      <a
        href="#article-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[999] focus:rounded-md focus:bg-gold-400 focus:px-4 focus:py-2 focus:font-semibold focus:text-ink"
      >
        Skip to main content
      </a>
      <Header
        logoUrl={logoUrl}
        siteName={siteName}
        locale={safeLocale}
        messages={messages}
        navigation={siteSettings?.navigation}
        headerCta={siteSettings?.headerCta}
      />
      <main id="article-main" className="bg-ink text-parchment">
        {/* ── Breadcrumb + Meta ── */}
        <section className="relative overflow-hidden pb-0 pt-32">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-start justify-center"
          >
            <div className="h-[40rem] w-[50rem] rounded-full bg-gold-500/6 blur-[160px]" />
          </div>

          <div className="relative mx-auto max-w-4xl px-6 lg:px-10">
            {/* Back link */}
            <Link
              href={`/${safeLocale}/blog`}
              className="inline-flex items-center gap-2 text-sm text-parchment/50 transition-colors hover:text-gold-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink rounded-sm"
              aria-label="Back to blog index"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to Blog
            </Link>

            {/* Category & Reading Time */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {post.category && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/30 bg-gold-400/10 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-gold-300">
                  <Tag className="h-3 w-3" aria-hidden="true" />
                  {post.category}
                </span>
              )}
              <span className="flex items-center gap-1.5 rounded-full border border-parchment/10 px-3 py-1 font-mono text-[11px] text-parchment/40">
                <Clock className="h-3 w-3" aria-hidden="true" />
                {readLabel}
              </span>
            </div>

            {/* Title */}
            <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-parchment sm:text-5xl lg:text-6xl">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="mt-6 text-xl leading-relaxed text-parchment/60">{post.excerpt}</p>

            {/* Author + Date */}
            <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-gold-400/10 pt-6">
              {post.author && (
                <div className="flex items-center gap-3">
                  {post.author.avatar && (
                    <div className="relative h-10 w-10 overflow-hidden rounded-full border border-gold-400/25">
                      <Image
                        src={cloudinaryUrl(post.author.avatar, { width: 80, height: 80, crop: "fill" })}
                        alt=""
                        aria-hidden="true"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-parchment/90">{post.author.name}</p>
                    {post.author.role && (
                      <p className="text-xs text-parchment/40">{post.author.role}</p>
                    )}
                  </div>
                </div>
              )}
              <time
                dateTime={post.publishedAt}
                className="ml-auto text-sm text-parchment/40"
              >
                {formatDate(post.publishedAt)}
              </time>
            </div>
          </div>
        </section>

        {/* ── Cover Image ── */}
        {coverUrl && (
          <div className="mx-auto mt-12 max-w-6xl px-6 lg:px-10">
            <div className="relative h-72 overflow-hidden rounded-2xl border border-gold-400/15 sm:h-96 lg:h-[28rem]">
              <Image
                src={coverUrl}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="(min-width: 1280px) 1200px, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/30 to-transparent" />
            </div>
          </div>
        )}

        {/* ── Article Body ── */}
        <div className="mx-auto mt-16 max-w-4xl px-6 lg:px-10">
          <article className="prose-lg">
            {post.body && (
              // @ts-expect-error – PortableText accepts unknown[] at runtime
              <PortableText value={post.body} components={portableTextComponents} />
            )}
          </article>

          {/* ── Author Card ── */}
          {post.author && (
            <aside
              className="mt-20 rounded-2xl border border-gold-400/20 bg-ink-soft/60 p-8 backdrop-blur-sm"
              aria-label="About the author"
            >
              <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.2em] text-gold-400">
                About the Author
              </p>
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                {post.author.avatar && (
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-full border-2 border-gold-400/25">
                    <Image
                      src={cloudinaryUrl(post.author.avatar, { width: 160, height: 160, crop: "fill" })}
                      alt=""
                      aria-hidden="true"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="font-display text-xl font-semibold text-parchment">
                    {post.author.name}
                  </h2>
                  {post.author.role && (
                    <p className="mt-1 text-sm font-medium text-gold-400">{post.author.role}</p>
                  )}
                  {post.author.bio && (
                    <p className="mt-3 text-sm leading-relaxed text-parchment/60">{post.author.bio}</p>
                  )}
                  {post.author.socialLinks && post.author.socialLinks.length > 0 && (
                    <div className="mt-4 flex items-center gap-3" role="list" aria-label="Author social media links">
                      {post.author.socialLinks.map((social) => {
                        const Icon = SOCIAL_ICON_MAP[social.platform.toLowerCase()] ?? Globe;
                        return (
                          <a
                            key={social.platform}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            role="listitem"
                            aria-label={`${post.author!.name} on ${social.platform} (opens in new tab)`}
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-gold-400/20 bg-ink text-gold-300 transition-all hover:border-gold-400/50 hover:bg-gold-400/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                          >
                            <Icon className="h-4 w-4" aria-hidden="true" />
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </aside>
          )}
        </div>

        {/* ── Related Posts ── */}
        {relatedPosts.length > 0 && (
          <section
            className="mx-auto mt-24 max-w-7xl px-6 pb-32 lg:px-10"
            aria-label="Related posts"
          >
            <h2 className="font-display text-3xl font-semibold text-parchment">
              Related Articles
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((related) => {
                const relCoverUrl = related.coverImage
                  ? cloudinaryUrl(related.coverImage, { width: 480, height: 280, crop: "fill" })
                  : undefined;
                return (
                  <article
                    key={related._id}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-gold-400/15 bg-ink-soft/60 transition-all duration-300 hover:border-gold-400/35"
                  >
                    <div className="relative h-44 overflow-hidden bg-ink-line">
                      {relCoverUrl ? (
                        <Image
                          src={relCoverUrl}
                          alt={related.title}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-gold-500/10 to-ink/80" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
                      {related.category && (
                        <span className="absolute left-4 top-4 rounded-full border border-gold-400/25 bg-ink/75 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-gold-300 backdrop-blur-sm">
                          {related.category}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <time
                        dateTime={related.publishedAt}
                        className="mb-3 text-xs text-parchment/35"
                      >
                        {formatDate(related.publishedAt)}
                      </time>
                      <h3 className="font-display text-lg font-semibold leading-snug text-parchment transition-colors group-hover:text-gold-200">
                        <Link
                          href={`/${safeLocale}/blog/${related.slug}`}
                          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink rounded-sm"
                        >
                          {related.title}
                        </Link>
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-parchment/50 line-clamp-2">
                        {related.excerpt}
                      </p>
                      <Link
                        href={`/${safeLocale}/blog/${related.slug}`}
                        aria-label={`Read: ${related.title}`}
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-300 transition-colors hover:text-gold-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink rounded-sm"
                      >
                        Read Article
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </main>
      <Footer locale={safeLocale} messages={messages} />
    </>
  );
}
