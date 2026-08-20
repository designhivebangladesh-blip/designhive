import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Portfolio from "@/components/Portfolio";
import { sanityFetch } from "@/sanity/lib/client";
import { cloudinaryUrl } from "@/sanity/lib/image";
import {
  allProjectsQuery,
  portfolioCategoriesQuery,
  siteSettingsQuery,
  type ProjectCardResult,
  type PortfolioCategoryResult,
  type SiteSettingsResult,
} from "@/sanity/lib/queries";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

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
  const title = "Selected Work & Case Studies — Designhive";
  const description =
    "Browse every UI/UX, web design, and product engineering case study delivered by Designhive for ambitious brands worldwide.";
  const canonical = `${SITE_URL}/${safeLocale}/portfolio`;

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical,
      languages: Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}/portfolio`])),
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
  const [projects, categories, siteSettings] = await Promise.all([
    sanityFetch<ProjectCardResult[]>({ query: allProjectsQuery, tags: ["project"] }).catch(
      () => []
    ),
    sanityFetch<PortfolioCategoryResult[]>({
      query: portfolioCategoriesQuery,
      tags: ["portfolioCategory"],
    }).catch(() => []),
    sanityFetch<SiteSettingsResult | null>({
      query: siteSettingsQuery,
      tags: ["siteSettings"],
    }).catch(() => null),
  ]);
  return { projects, categories, siteSettings };
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale: Locale = isLocale(locale) ? locale : "bn";
  const messages = getMessages(safeLocale);

  const { projects, categories, siteSettings } = await getData();

  const logoUrl = siteSettings?.logoIcon
    ? cloudinaryUrl(siteSettings.logoIcon, { width: 72, height: 72, crop: "fill" })
    : "/logo-icon.png";
  const siteName = siteSettings?.siteName ?? "Designhive";

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/${safeLocale}` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Portfolio",
        item: `${SITE_URL}/${safeLocale}/portfolio`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Skip to main */}
      <a
        href="#portfolio-main"
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
      <main id="portfolio-main" className="min-h-screen bg-ink text-parchment">
        {/* Page intro header */}
        <section className="relative overflow-hidden pb-4 pt-36">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -top-24 flex items-center justify-center"
          >
            <div className="h-[50rem] w-[50rem] rounded-full bg-gold-500/8 blur-[180px]" />
          </div>
          <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
            <Link
              href={`/${safeLocale}`}
              className="hover-zoom-sm inline-flex items-center gap-2 text-xs font-medium text-parchment/50 hover:text-gold-300"
            >
              &larr; Back to Home
            </Link>
            <div className="mt-6 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gold-400/30 bg-gold-400/10">
                <Sparkles className="h-4 w-4 text-gold-300" aria-hidden="true" />
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-gold-300">
                Full Portfolio
              </span>
            </div>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-parchment sm:text-6xl lg:text-7xl">
              Every project,
              <br />
              <span className="bg-gold-gradient bg-clip-text text-transparent">
                every case study
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-parchment/60">
              A complete look at the UI/UX, web development, and brand experiences Designhive
              has shipped for ambitious businesses across the globe.
            </p>
          </div>
        </section>

        <Portfolio
          heading={{
            eyebrow: "All Case Studies",
            title: "Filter by discipline to explore the full body of work",
            description:
              "Every engagement is backed by strategic UX research, solid engineering, and measurable business outcomes.",
          }}
          projects={projects}
          categories={categories}
          locale={safeLocale}
          showAll
        />
      </main>
      <Footer locale={safeLocale} messages={messages} />
    </>
  );
}
