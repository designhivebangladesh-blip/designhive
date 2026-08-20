import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ClientLogos from "@/components/ClientLogos";
import Metrics from "@/components/Metrics";
import About from "@/components/About";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import Process from "@/components/Process";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import Blog from "@/components/Blog";
import FaqContact from "@/components/FaqContact";
import CtaBand from "@/components/CtaBand";
import Footer from "@/components/Footer";
import { sanityFetch } from "@/sanity/lib/client";
import { cloudinaryUrl } from "@/sanity/lib/image";
import {
  siteSettingsQuery,
  contactInfoQuery,
  homepageQuery,
  featuredServicesQuery,
  featuredProjectsQuery,
  portfolioCategoriesQuery,
  featuredTestimonialsQuery,
  clientsQuery,
  pricingPlansQuery,
  latestBlogPostsQuery,
  faqsQuery,
  type SiteSettingsResult,
  type ContactInfoResult,
  type HomepageResult,
  type ServiceCardResult,
  type ProjectCardResult,
  type PortfolioCategoryResult,
  type TestimonialResult,
  type ClientLogoResult,
  type PricingPlanResult,
  type BlogPostCardResult,
  type FaqResult,
} from "@/sanity/lib/queries";
import type { Metadata } from "next";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://designhivebangladesh.com";

async function getSiteSettings() {
  try {
    return await sanityFetch<SiteSettingsResult | null>({
      query: siteSettingsQuery,
      tags: ["siteSettings"],
    });
  } catch (error) {
    console.error("[site_settings_fetch_error]", error);
    return null;
  }
}

async function getContactInfo() {
  try {
    return await sanityFetch<ContactInfoResult | null>({
      query: contactInfoQuery,
      tags: ["contactInfo"],
    });
  } catch (error) {
    console.error("[contact_info_fetch_error]", error);
    return null;
  }
}

async function getHomepageData() {
  try {
    return await sanityFetch<HomepageResult | null>({
      query: homepageQuery,
      tags: ["homepage"],
    });
  } catch (error) {
    console.error("[homepage_fetch_error]", error);
    return null;
  }
}

async function getServicesData() {
  try {
    return await sanityFetch<ServiceCardResult[]>({
      query: featuredServicesQuery,
      tags: ["service"],
    });
  } catch (error) {
    console.error("[services_fetch_error]", error);
    return [];
  }
}

async function getProjectsData() {
  try {
    return await sanityFetch<ProjectCardResult[]>({
      query: featuredProjectsQuery,
      tags: ["project"],
    });
  } catch (error) {
    console.error("[projects_fetch_error]", error);
    return [];
  }
}

async function getCategoriesData() {
  try {
    return await sanityFetch<PortfolioCategoryResult[]>({
      query: portfolioCategoriesQuery,
      tags: ["portfolioCategory"],
    });
  } catch (error) {
    console.error("[categories_fetch_error]", error);
    return [];
  }
}

async function getTestimonialsData() {
  try {
    return await sanityFetch<TestimonialResult[]>({
      query: featuredTestimonialsQuery,
      tags: ["testimonial"],
    });
  } catch (error) {
    console.error("[testimonials_fetch_error]", error);
    return [];
  }
}

async function getClientsData() {
  try {
    return await sanityFetch<ClientLogoResult[]>({
      query: clientsQuery,
      tags: ["client"],
    });
  } catch (error) {
    console.error("[clients_fetch_error]", error);
    return [];
  }
}

async function getPricingData() {
  try {
    return await sanityFetch<PricingPlanResult[]>({
      query: pricingPlansQuery,
      tags: ["pricingPlan"],
    });
  } catch (error) {
    console.error("[pricing_fetch_error]", error);
    return [];
  }
}

async function getBlogData() {
  try {
    return await sanityFetch<BlogPostCardResult[]>({
      query: latestBlogPostsQuery,
      tags: ["blogPost"],
    });
  } catch (error) {
    console.error("[blog_fetch_error]", error);
    return [];
  }
}

async function getFaqsData() {
  try {
    return await sanityFetch<FaqResult[]>({
      query: faqsQuery,
      tags: ["faq"],
    });
  } catch (error) {
    console.error("[faqs_fetch_error]", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale: Locale = isLocale(locale) ? locale : "bn";
  const messages = getMessages(safeLocale);

  const siteSettings = await getSiteSettings();
  const seo = siteSettings?.seo;

  const title =
    seo?.metaTitle || `${siteSettings?.siteName || "Designhive"} — ${messages.metadata.title}`;
  const description = seo?.metaDescription || messages.metadata.description;
  const ogImageUrl = seo?.ogImage ? cloudinaryUrl(seo.ogImage, { width: 1200, height: 630 }) : undefined;
  const canonicalUrl = `${SITE_URL}/${safeLocale}`;

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
      languages: Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}`])),
    },
    robots: seo?.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: siteSettings?.siteName || "Designhive",
      images: ogImageUrl ? [{ url: ogImageUrl, width: 1200, height: 630 }] : undefined,
      type: "website",
      locale: safeLocale,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImageUrl ? [ogImageUrl] : undefined,
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale: Locale = isLocale(locale) ? locale : "bn";
  const messages = getMessages(safeLocale);

  const [
    siteSettings,
    contactInfo,
    homepage,
    services,
    projects,
    categories,
    testimonials,
    clients,
    pricingPlans,
    blogPosts,
    faqs,
  ] = await Promise.all([
    getSiteSettings(),
    getContactInfo(),
    getHomepageData(),
    getServicesData(),
    getProjectsData(),
    getCategoriesData(),
    getTestimonialsData(),
    getClientsData(),
    getPricingData(),
    getBlogData(),
    getFaqsData(),
  ]);

  const logoUrl = siteSettings?.logoIcon
    ? cloudinaryUrl(siteSettings.logoIcon, { width: 72, height: 72, crop: "fill" })
    : "/logo-icon.png";
  const siteName = siteSettings?.siteName || "Designhive";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: SITE_URL,
    logo: siteSettings?.logoFull
      ? cloudinaryUrl(siteSettings.logoFull, { width: 512 })
      : `${SITE_URL}/logo-full.png`,
    ...(contactInfo && {
      contactPoint: {
        "@type": "ContactPoint",
        telephone: contactInfo.phone,
        email: contactInfo.email,
        contactType: "customer service",
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: contactInfo.location,
      },
    }),
    ...(contactInfo?.socialLinks?.length && {
      sameAs: contactInfo.socialLinks.map((link) => link.url),
    }),
  };

  function faqAnswerToText(answer: FaqResult["answer"]): string {
    if (typeof answer === "string") return answer;
    if (Array.isArray(answer)) {
      return answer
        .map((block: { children?: { text?: string }[] }) =>
          block?.children?.map((c) => c.text ?? "").join("")
        )
        .filter(Boolean)
        .join(" ");
    }
    return "";
  }

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: SITE_URL,
    inLanguage: safeLocale,
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "UI/UX Design, Web Design, Web Development, Branding, SEO & Product Design",
    provider: { "@type": "Organization", name: siteName, url: SITE_URL },
    areaServed: "Worldwide",
    ...(services.length && {
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Designhive Services",
        itemListElement: services.map((s) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: s.title, description: s.description },
        })),
      },
    }),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/${safeLocale}` },
    ],
  };

  const faqJsonLd =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faqAnswerToText(f.answer),
            },
          })),
        }
      : null;

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <Header
        logoUrl={logoUrl}
        siteName={siteName}
        locale={safeLocale}
        messages={messages}
        navigation={siteSettings?.navigation}
        headerCta={siteSettings?.headerCta}
      />
      {/* 1. HERO — headline, value prop, primary/secondary CTA, trust metrics */}
      <Hero data={homepage?.hero} />

      {/* Visual portfolio wall — intentionally follows the hero like the reference experience. */}
      <Portfolio
        heading={homepage?.portfolioSection}
        cta={homepage?.portfolioCta}
        projects={projects}
        categories={categories}
        locale={safeLocale}
      />

      <ClientLogos clients={clients} />
      <Metrics metrics={homepage?.hero?.statBadges} />

      {/* 3. SERVICES & OFFERINGS */}
      <Services heading={homepage?.servicesSection} services={services} />
      <WhyChooseUs />

      {/* 4. OUR PROCESS (HOW WE WORK) */}
      <Process />

      {/* 5. PRICING & ENGAGEMENT MODELS */}
      <Pricing heading={homepage?.pricingSection?.heading} plans={pricingPlans} />

      {/* 6. TESTIMONIALS & CASE STUDIES (includes founder credibility metric) */}
      <Testimonials
        heading={homepage?.testimonialsSection?.heading}
        testimonials={testimonials}
        clients={clients}
        founderCredibility={homepage?.testimonialsSection?.founderCredibility}
      />
      <Blog heading={homepage?.blogSection?.heading} posts={blogPosts} locale={safeLocale} />

      {/* 7. ABOUT US / FOUNDER'S NOTE */}
      <About data={homepage?.aboutSection} />

      {/* 8. FAQ SECTION (+ direct contact / quote form, anchored at #contact) */}
      <FaqContact
        faqHeading={homepage?.faqSection?.heading}
        faqs={faqs}
        contactInfo={contactInfo}
        messages={messages}
      />

      {/* 9. FINAL HIGH-CONVERSION CTA */}
      <CtaBand data={homepage?.ctaBand} locale={safeLocale} email={contactInfo?.email} />

      {/* 10. FOOTER */}
      <Footer locale={safeLocale} messages={messages} />
    </main>
  );
}
