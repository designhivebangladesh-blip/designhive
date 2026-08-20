import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BookOpen, Clock, Tag, Rss } from "lucide-react";
import { sanityFetch } from "@/sanity/lib/client";
import { cloudinaryUrl } from "@/sanity/lib/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  allBlogPostsQuery,
  allBlogCategoriesQuery,
  siteSettingsQuery,
  type BlogPostListResult,
  type BlogCategoryResult,
  type SiteSettingsResult,
} from "@/sanity/lib/queries";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { readingTimeLabel } from "@/lib/utils/readingTime";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://designhivebangladesh.com";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale: Locale = isLocale(locale) ? locale : "bn";
  const title = "Blog — Designhive Digital Studio";
  const description =
    "Expert insights on design systems, web development, branding, and digital strategy from the Designhive team.";
  const canonical = `${SITE_URL}/${safeLocale}/blog`;
  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical,
      languages: Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}/blog`])),
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Designhive",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

async function getData() {
  const [posts, categories, siteSettings] = await Promise.all([
    sanityFetch<BlogPostListResult[]>({ query: allBlogPostsQuery, tags: ["blogPost"] }).catch(() => []),
    sanityFetch<BlogCategoryResult[]>({ query: allBlogCategoriesQuery, tags: ["blogCategory"] }).catch(() => []),
    sanityFetch<SiteSettingsResult | null>({ query: siteSettingsQuery, tags: ["siteSettings"] }).catch(() => null),
  ]);
  return { posts, categories, siteSettings };
}

export default async function BlogIndexPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  const { category: selectedCategory } = await searchParams;
  const safeLocale: Locale = isLocale(locale) ? locale : "bn";
  const messages = getMessages(safeLocale);

  const { posts, categories, siteSettings } = await getData();

  const logoUrl = siteSettings?.logoIcon
    ? cloudinaryUrl(siteSettings.logoIcon, { width: 72, height: 72, crop: "fill" })
    : "/logo-icon.png";
  const siteName = siteSettings?.siteName ?? "Designhive";

  const filteredPosts = selectedCategory
    ? posts.filter((p) => p.categories?.some((c) => c.toLowerCase() === selectedCategory.toLowerCase()))
    : posts;

  const [featured, ...rest] = filteredPosts;

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <>
      {/* Skip to main */}
      <a
        href="#blog-main"
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
      <main id="blog-main" className="min-h-screen bg-ink text-parchment">
        {/* ── Hero Header ── */}
        <section className="relative overflow-hidden pb-16 pt-36">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -top-24 flex items-center justify-center"
          >
            <div className="h-[50rem] w-[50rem] rounded-full bg-gold-500/8 blur-[180px]" />
          </div>
          <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gold-400/30 bg-gold-400/10">
                <Rss className="h-4 w-4 text-gold-300" aria-hidden="true" />
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-gold-300">
                Latest Insights
              </span>
            </div>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-parchment sm:text-6xl lg:text-7xl">
              Thought leadership
              <br />
              <span className="bg-gold-gradient bg-clip-text text-transparent">from the hive</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-parchment/60">
              Expert articles, deep dives, and creative perspectives on digital strategy, design systems, and web craft.
            </p>

            {/* Category filter chips */}
            {categories.length > 0 && (
              <div className="mt-10 flex flex-wrap items-center gap-3" role="navigation" aria-label="Filter posts by category">
                <Link
                  href={`/${safeLocale}/blog`}
                  aria-label="Show all posts"
                  aria-current={!selectedCategory ? "page" : undefined}
                  className={`rounded-full border px-4 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink ${
                    !selectedCategory
                      ? "border-gold-400 bg-gold-400/15 text-gold-200"
                      : "border-gold-400/25 text-gold-400/60 hover:border-gold-400/50 hover:text-gold-300"
                  }`}
                >
                  All
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat._id}
                    href={`/${safeLocale}/blog?category=${encodeURIComponent(cat.title)}`}
                    aria-label={`Filter by ${cat.title}`}
                    aria-current={selectedCategory === cat.title ? "page" : undefined}
                    className={`rounded-full border px-4 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink ${
                      selectedCategory === cat.title
                        ? "border-gold-400 bg-gold-400/15 text-gold-200"
                        : "border-gold-400/25 text-gold-400/60 hover:border-gold-400/50 hover:text-gold-300"
                    }`}
                  >
                    {cat.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-32 lg:px-10">
          {filteredPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
              <BookOpen className="h-12 w-12 text-gold-400/30" aria-hidden="true" />
              <h2 className="font-display text-2xl font-semibold text-parchment/50">No posts found</h2>
              <p className="text-parchment/40">Try clearing the category filter.</p>
              <Link
                href={`/${safeLocale}/blog`}
                className="mt-2 rounded-full border border-gold-400/30 px-6 py-2 text-sm text-gold-300 transition-colors hover:bg-gold-400/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                View all posts
              </Link>
            </div>
          ) : (
            <>
              {/* ── Featured Post ── */}
              {featured && (
                <article
                  aria-label={`Featured post: ${featured.title}`}
                  className="group relative mb-16 grid overflow-hidden rounded-3xl border border-gold-400/20 bg-ink-soft/60 backdrop-blur-sm transition-all duration-300 hover:border-gold-400/40 lg:grid-cols-2"
                >
                  {/* Image */}
                  <div className="relative h-72 overflow-hidden bg-ink-line lg:h-auto">
                    {featured.coverImage ? (
                      <Image
                        src={cloudinaryUrl(featured.coverImage, { width: 800, height: 600, crop: "fill" })}
                        alt={featured.title}
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        priority
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gold-500/20 via-ink to-ink/80">
                        <BookOpen className="h-16 w-16 text-gold-400/30" aria-hidden="true" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-ink/30 lg:to-ink/60" />
                    {/* Featured badge */}
                    <span className="absolute left-5 top-5 rounded-full border border-gold-400/40 bg-ink/80 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-gold-300 backdrop-blur-sm">
                      Featured
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col justify-center p-8 lg:p-12">
                    {featured.category && (
                      <span className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-gold-400/25 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-gold-300">
                        <Tag className="h-3 w-3" aria-hidden="true" />
                        {featured.category}
                      </span>
                    )}
                    <h2 className="font-display text-3xl font-semibold leading-snug text-parchment transition-colors duration-300 group-hover:text-gold-200 lg:text-4xl">
                      <Link
                        href={`/${safeLocale}/blog/${featured.slug}`}
                        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink rounded-sm"
                      >
                        {featured.title}
                      </Link>
                    </h2>
                    <p className="mt-4 text-base leading-relaxed text-parchment/60">{featured.excerpt}</p>
                    <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-parchment/40">
                      {featured.author && (
                        <span className="font-medium text-parchment/60">{featured.author.name}</span>
                      )}
                      <span aria-hidden="true">·</span>
                      <time dateTime={featured.publishedAt}>{formatDate(featured.publishedAt)}</time>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" aria-hidden="true" />
                        {readingTimeLabel(featured.body ?? [])}
                      </span>
                    </div>
                    <Link
                      href={`/${safeLocale}/blog/${featured.slug}`}
                      aria-label={`Read full article: ${featured.title}`}
                      className="mt-8 inline-flex w-fit items-center gap-2 rounded-full border border-gold-400/40 bg-gold-400/10 px-5 py-2.5 text-sm font-semibold text-gold-300 transition-all duration-300 hover:border-gold-400 hover:bg-gold-400/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                    >
                      <span>Read Article</span>
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              )}

              {/* ── Post Grid ── */}
              {rest.length > 0 && (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {rest.map((post) => {
                    const coverUrl = post.coverImage
                      ? cloudinaryUrl(post.coverImage, { width: 600, height: 380, crop: "fill" })
                      : undefined;
                    return (
                      <article
                        key={post._id}
                        className="group flex flex-col overflow-hidden rounded-2xl border border-gold-400/15 bg-ink-soft/60 backdrop-blur-sm transition-all duration-300 hover:border-gold-400/40"
                      >
                        {/* Cover */}
                        <div className="relative h-52 overflow-hidden bg-ink-line">
                          {coverUrl ? (
                            <Image
                              src={coverUrl}
                              alt={post.title}
                              fill
                              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gold-500/10 to-ink/80">
                              <BookOpen className="h-10 w-10 text-gold-400/25" aria-hidden="true" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                          {post.category && (
                            <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full border border-gold-400/25 bg-ink/75 px-3 py-0.5 font-mono text-[10px] uppercase tracking-wider text-gold-300 backdrop-blur-sm">
                              <Tag className="h-3 w-3" aria-hidden="true" />
                              {post.category}
                            </span>
                          )}
                        </div>

                        {/* Body */}
                        <div className="flex flex-1 flex-col p-6">
                          <div className="mb-3 flex items-center gap-3 text-xs text-parchment/40">
                            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                            <span aria-hidden="true">·</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" aria-hidden="true" />
                              {readingTimeLabel(post.body ?? [])}
                            </span>
                          </div>
                          <h2 className="font-display text-xl font-semibold leading-snug text-parchment transition-colors duration-300 group-hover:text-gold-200">
                            <Link
                              href={`/${safeLocale}/blog/${post.slug}`}
                              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink rounded-sm"
                            >
                              {post.title}
                            </Link>
                          </h2>
                          <p className="mt-3 flex-1 text-sm leading-relaxed text-parchment/55">
                            {post.excerpt}
                          </p>
                          {post.author && (
                            <div className="mt-5 flex items-center gap-2.5 border-t border-gold-400/10 pt-4">
                              {post.author.avatar && (
                                <div className="relative h-7 w-7 flex-shrink-0 overflow-hidden rounded-full border border-gold-400/20">
                                  <Image
                                    src={cloudinaryUrl(post.author.avatar, { width: 56, height: 56, crop: "fill" })}
                                    alt=""
                                    aria-hidden="true"
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              )}
                              <span className="text-xs text-parchment/50">{post.author.name}</span>
                            </div>
                          )}
                          <Link
                            href={`/${safeLocale}/blog/${post.slug}`}
                            aria-label={`Read: ${post.title}`}
                            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-300 transition-all duration-300 hover:text-gold-200 hover:translate-x-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink rounded-sm"
                          >
                            Read Article
                            <ArrowRight className="h-4 w-4" aria-hidden="true" />
                          </Link>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </section>
      </main>
      <Footer locale={safeLocale} messages={messages} />
    </>
  );
}
