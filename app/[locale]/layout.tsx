import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import "../globals.css";
import { locales, isLocale, type Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { sanityFetch } from "@/sanity/lib/client";
import { cloudinaryUrl } from "@/sanity/lib/image";
import { siteSettingsQuery, contactInfoQuery, type SiteSettingsResult, type ContactInfoResult } from "@/sanity/lib/queries";
import Chatbot from "@/components/Chatbot";
import QuoteModalProvider from "@/components/QuoteModalProvider";
import ProjectInquiryModal from "@/components/ProjectInquiryModal";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://designhivebangladesh.com";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz", "SOFT", "WONK"],
  // A variable font loaded with `axes` must use weight: "variable" —
  // Next.js 15's next/font now validates this combination and fails
  // the build on an explicit weight array like the one this had before.
  weight: "variable",
  display: "swap",
  preload: true,
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
  display: "swap",
  preload: true,
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
  preload: false,
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale: Locale = isLocale(locale) ? locale : "bn";
  const { metadata } = getMessages(safeLocale);

  // Fetch SEO from Sanity for default metadata
  let siteSettings: SiteSettingsResult | null = null;
  try {
    siteSettings = await sanityFetch<SiteSettingsResult | null>({
      query: siteSettingsQuery,
      tags: ["siteSettings"],
    });
  } catch (_err) {}

  const title = siteSettings?.seo?.metaTitle ?? metadata.title;
  const description = siteSettings?.seo?.metaDescription ?? metadata.description;
  const ogImageUrl = siteSettings?.seo?.ogImage
    ? cloudinaryUrl(siteSettings.seo.ogImage, { width: 1200, height: 630 })
    : undefined;

  return {
    title: {
      default: title,
      template: `%s — ${siteSettings?.siteName ?? "Designhive"}`,
    },
    description,
    metadataBase: new URL(SITE_URL),
    keywords: [
      "UI UX agency",
      "web design agency",
      "web development agency",
      "branding agency",
      "SEO agency",
      "product design agency",
      "Bangladesh web agency",
      "global digital agency",
      "Sanity CMS",
      "digital design studio",
      "web development Bangladesh",
      "branding agency Dhaka",
      "Designhive",
    ],
    authors: [{ name: siteSettings?.siteName ?? "Designhive" }],
    robots: siteSettings?.seo?.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}`])),
    },
    openGraph: {
      siteName: siteSettings?.siteName ?? "Designhive",
      type: "website",
      locale: safeLocale,
      images: ogImageUrl ? [{ url: ogImageUrl, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      site: "@designhive",
      images: ogImageUrl ? [ogImageUrl] : undefined,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  // Build Organization JSON-LD for the whole site
  let orgJsonLd: Record<string, unknown> | null = null;
  try {
    const [siteSettings, contactInfo] = await Promise.all([
      sanityFetch<SiteSettingsResult | null>({ query: siteSettingsQuery, tags: ["siteSettings"] }),
      sanityFetch<ContactInfoResult | null>({ query: contactInfoQuery, tags: ["contactInfo"] }),
    ]);

    const logoUrl = siteSettings?.logoFull
      ? cloudinaryUrl(siteSettings.logoFull, { width: 512 })
      : `${SITE_URL}/logo-full.png`;

    orgJsonLd = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: siteSettings?.siteName ?? "Designhive",
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: logoUrl },
      description:
        siteSettings?.seo?.metaDescription ??
        "Designhive is a boutique digital studio crafting branding, product design, and web experiences for ambitious teams.",
      ...(contactInfo && {
        contactPoint: {
          "@type": "ContactPoint",
          telephone: contactInfo.phone,
          email: contactInfo.email,
          contactType: "customer service",
          areaServed: "BD",
          availableLanguage: ["Bengali", "English"],
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: contactInfo.location,
          addressCountry: "BD",
        },
      }),
      ...(contactInfo?.socialLinks?.length && {
        sameAs: contactInfo.socialLinks.map((l) => l.url),
      }),
    };
  } catch (_err) {}

  return (
    <html lang={locale} className={`${fraunces.variable} ${inter.variable} ${plexMono.variable}`}>
      <head>
        {orgJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
          />
        )}
      </head>
      <body className="font-body antialiased">
        {/* ── Global skip-to-content link for keyboard users ── */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[999] focus:rounded-md focus:bg-gold-400 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink focus:shadow-lg focus:outline-none"
        >
          Skip to main content
        </a>
        <QuoteModalProvider>
          {children}
          <Chatbot />
          <ProjectInquiryModal />
        </QuoteModalProvider>
      </body>
    </html>
  );
}
