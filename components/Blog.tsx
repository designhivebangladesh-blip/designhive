import Image from "next/image";
import { ArrowRight, BookOpen, Clock, Tag } from "lucide-react";
import Link from "next/link";
import { cloudinaryUrl } from "@/sanity/lib/image";
import type { SectionHeadingResult, BlogPostCardResult } from "@/sanity/lib/queries";
import type { Locale } from "@/lib/i18n/config";

const FALLBACK_HEADING = {
  eyebrow: "Latest Insights",
  title: "Thought leadership from the hive",
  description:
    "Explore our latest articles, technical deep-dives, and creative perspectives on digital strategy and web craft.",
};

const FALLBACK_POSTS: BlogPostCardResult[] = [
  {
    _id: "post-1",
    title: "Designing for Impact: Building High-Converting Digital Experiences",
    slug: "designing-for-impact",
    excerpt:
      "Discover the foundational principles behind creating intuitive user interfaces that capture attention and drive business results.",
    category: "Design Systems",
    publishedAt: "2026-08-02T00:00:00.000Z",
  },
  {
    _id: "post-2",
    title: "The Architecture of Next.js 15: Server Components & Performance",
    slug: "architecture-of-nextjs-15",
    excerpt:
      "A deep dive into modern full-stack web development, optimizing Core Web Vitals, and leveraging App Router caching models.",
    category: "Engineering",
    publishedAt: "2026-07-26T00:00:00.000Z",
  },
  {
    _id: "post-3",
    title: "Crafting a Brand Identity That Scales Across Global Touchpoints",
    slug: "crafting-scalable-brand-identity",
    excerpt:
      "How strategic brand positioning, consistent typography, and visual systems empower startups to scale into category leaders.",
    category: "Brand Strategy",
    publishedAt: "2026-07-18T00:00:00.000Z",
  },
];

interface BlogProps {
  heading?: SectionHeadingResult;
  posts?: BlogPostCardResult[];
  locale?: Locale;
}

export default function Blog({ heading, posts, locale = "bn" }: BlogProps) {
  const eyebrow = heading?.eyebrow || FALLBACK_HEADING.eyebrow;
  const title = heading?.title || FALLBACK_HEADING.title;
  const description = heading?.description || FALLBACK_HEADING.description;
  const activePosts = posts?.length ? posts : FALLBACK_POSTS;

  return (
    <section
      id="blog"
      className="honeycomb-outline relative overflow-hidden bg-ink py-28 text-parchment lg:py-36"
    >
      {/* Ambient Glow Effects */}
      <div
        className="pointer-events-none absolute right-[-10%] top-1/4 h-[32rem] w-[32rem] rounded-full bg-gold-500/10 blur-[140px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-[-10%] bottom-10 h-[28rem] w-[28rem] rounded-full bg-gold-300/10 blur-[120px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="hover-zoom-sm inline-flex items-center gap-2 rounded-full border border-gold-400/30 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.25em] text-gold-300">
            {eyebrow}
          </span>
          <h2 className="mt-6 font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            {title}
          </h2>
          <p className="mt-6 text-base leading-relaxed text-parchment/70 sm:text-lg lg:text-xl">
            {description}
          </p>
        </div>

        {/* Blog Cards Grid */}
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {activePosts.map((post) => {
            const coverUrl = post.coverImage
              ? cloudinaryUrl(post.coverImage, { width: 480, height: 280, crop: "fill" })
              : undefined;
            const formattedDate = post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })
              : "Aug 2026";

            return (
              <article
                key={post._id}
                className="hover-zoom group relative flex flex-col overflow-hidden rounded-2xl border border-gold-400/20 bg-ink-soft/80 shadow-gold backdrop-blur-md transition-all duration-300 hover:border-gold-400/50"
              >
                {/* Image Placeholder or Cloudinary Image Area */}
                <div className="honeycomb-field relative flex h-48 w-full items-center justify-center overflow-hidden bg-ink-line text-gold-300">
                  {coverUrl ? (
                    <Image
                      src={coverUrl}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-gold-500/15 via-transparent to-ink/90" />
                      <div className="relative flex flex-col items-center gap-2 transition-transform duration-500 group-hover:scale-110">
                        <div className="hex-clip flex h-12 w-12 items-center justify-center bg-gold-gradient text-ink shadow-gold">
                          <BookOpen className="h-5 w-5" aria-hidden="true" />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Top Category Badge */}
                  {post.category && (
                    <div className="absolute left-4 top-4 z-10">
                      <span className="inline-flex items-center gap-1 rounded-full border border-gold-400/30 bg-ink/80 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-gold-300 backdrop-blur-sm">
                        <Tag className="h-3 w-3" aria-hidden="true" />
                        {post.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
                  <div>
                    {/* Meta Date & Read Time */}
                    <div className="flex items-center gap-4 text-xs text-parchment/50">
                      <time dateTime={post.publishedAt}>{formattedDate}</time>
                      <span aria-hidden="true">•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" aria-hidden="true" />
                        5 min read
                      </span>
                    </div>

                    {/* Article Title */}
                    <h3 className="mt-4 font-display text-xl font-semibold leading-snug text-parchment transition-colors duration-300 group-hover:text-gold-300">
                      <Link
                        href={`/${locale}/blog/${post.slug}`}
                        aria-label={`Read article: ${post.title}`}
                      >
                        {post.title}
                      </Link>
                    </h3>

                    {/* Article Excerpt */}
                    <p className="mt-3 text-sm leading-relaxed text-parchment/65">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Read More Link */}
                  <div className="mt-6 pt-4 border-t border-gold-400/10">
                    <Link
                      href={`/${locale}/blog/${post.slug}`}
                      aria-label={`Read more about ${post.title}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-gold-300 transition-all duration-300 group-hover:text-gold-200 group-hover:translate-x-1 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 focus:ring-offset-ink rounded-sm"
                    >
                      <span>Read Full Article</span>
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
