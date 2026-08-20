import { groq } from "next-sanity";
import type { CloudinaryAsset } from "@/sanity/lib/image";

// --- Common Types -----------------------------------------------------

export interface CtaButtonResult {
  label: string;
  href: string;
}

export interface StatBadgeResult {
  icon: string;
  value: string;
  label: string;
}

export interface SectionHeadingResult {
  eyebrow?: string;
  title: string;
  description?: string;
}

export interface SeoResult {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: CloudinaryAsset;
  noIndex?: boolean;
}

export interface FeatureCardResult {
  icon: string;
  title: string;
  description: string;
}

export interface OpeningHoursResult {
  days: string;
  hours: string;
}

// --- Site Settings ----------------------------------------------------

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0]{
    siteName,
    tagline,
    logoIcon,
    logoFull,
    navigation[]{ label, href },
    headerCta{ label, href },
    footerStatement,
    footerNavigation[]{
      title,
      links[]{ label, href }
    },
    legalLinks[]{ label, href },
    copyrightText,
    seo
  }
`;

export interface NavItemResult {
  label: string;
  href: string;
}

export interface FooterColumnResult {
  title: string;
  links: { label: string; href: string }[];
}

export interface SiteSettingsResult {
  siteName: string;
  tagline?: string;
  logoIcon?: CloudinaryAsset;
  logoFull?: CloudinaryAsset;
  navigation?: NavItemResult[];
  headerCta?: CtaButtonResult;
  footerStatement?: string;
  footerNavigation?: FooterColumnResult[];
  legalLinks?: { label: string; href: string }[];
  copyrightText?: string;
  seo?: SeoResult;
}

// --- Contact Information ------------------------------------------------

export const contactInfoQuery = groq`
  *[_type == "contactInfo"][0]{
    email,
    phone,
    whatsapp,
    location,
    address,
    openingHours[]{ days, hours },
    socialLinks[]{ platform, url }
  }
`;

export interface ContactInfoResult {
  email: string;
  phone: string;
  whatsapp?: string;
  location: string;
  address?: string;
  openingHours?: OpeningHoursResult[];
  socialLinks?: { platform: string; url: string }[];
}

// --- Homepage & Hero -----------------------------------------------------

export const homepageQuery = groq`
  *[_type == "homepage"][0]{
    hero{
      eyebrow,
      headlineLine,
      headlineHighlight,
      description,
      primaryCta,
      secondaryCta,
      trustLine,
      brandMarks,
      video,
      videoPoster,
      founderNote,
      founderName,
      founderRole,
      founderAvatar,
      heroImage,
      statBadges[]{ icon, value, label }
    },
    aboutSection{
      eyebrow,
      headlineLine,
      headlineHighlight,
      body,
      cta,
      featureCards[]{ icon, title, description }
    },
    servicesSection,
    portfolioSection,
    portfolioCta,
    pricingSection{ heading },
    testimonialsSection{
      heading,
      founderCredibility{
        founderName,
        founderRole,
        founderBio,
        founderQuote,
        founderAvatar,
        credentials
      }
    },
    blogSection{ heading },
    faqSection{ heading },
    ctaBand{
      title,
      description,
      cta
    },
    seo
  }
`;

export interface HeroResult {
  eyebrow?: string;
  headlineLine: string;
  headlineHighlight: string;
  description?: string;
  primaryCta?: CtaButtonResult;
  secondaryCta?: CtaButtonResult;
  trustLine?: string;
  brandMarks?: string[];
  video?: CloudinaryAsset;
  videoPoster?: CloudinaryAsset;
  founderNote?: string;
  founderName?: string;
  founderRole?: string;
  founderAvatar?: CloudinaryAsset;
  heroImage?: CloudinaryAsset;
  statBadges?: StatBadgeResult[];
}

export interface AboutSectionResult {
  eyebrow?: string;
  headlineLine?: string;
  headlineHighlight?: string;
  body?: string;
  cta?: CtaButtonResult;
  featureCards?: FeatureCardResult[];
}

export interface FounderCredibilityResult {
  founderName?: string;
  founderRole?: string;
  founderBio?: string;
  founderQuote?: string;
  founderAvatar?: CloudinaryAsset;
  credentials?: string[];
}

export interface CtaBandResult {
  title?: string;
  description?: string;
  cta?: CtaButtonResult;
}

export interface HomepageResult {
  hero?: HeroResult;
  aboutSection?: AboutSectionResult;
  servicesSection?: SectionHeadingResult;
  portfolioSection?: SectionHeadingResult;
  portfolioCta?: CtaButtonResult;
  pricingSection?: { heading?: SectionHeadingResult };
  testimonialsSection?: {
    heading?: SectionHeadingResult;
    founderCredibility?: FounderCredibilityResult;
  };
  blogSection?: { heading?: SectionHeadingResult };
  faqSection?: { heading?: SectionHeadingResult };
  ctaBand?: CtaBandResult;
  seo?: SeoResult;
}

// --- Services (featured) -------------------------------------------------

export const featuredServicesQuery = groq`
  *[_type == "service" && featured == true] | order(order asc){
    title,
    "slug": slug.current,
    icon,
    description,
    deliverables,
    startingPrice,
    cta{ label, href }
  }
`;

export interface ServiceCardResult {
  title: string;
  slug: string;
  icon: string;
  description: string;
  deliverables?: string[];
  startingPrice?: string;
  cta?: CtaButtonResult;
}

// --- Portfolio Projects & Categories -------------------------------------

export const featuredProjectsQuery = groq`
  *[_type == "project" && featured == true] | order(order asc){
    title,
    "slug": slug.current,
    subtitle,
    icon,
    coverImage,
    gallery,
    "category": category->{ title, "slug": slug.current },
    challenge,
    solution,
    result,
    liveUrl,
    featured
  }
`;

export const allProjectsQuery = groq`
  *[_type == "project"] | order(featured desc, order asc){
    title,
    "slug": slug.current,
    subtitle,
    icon,
    coverImage,
    gallery,
    "category": category->{ title, "slug": slug.current },
    challenge,
    solution,
    result,
    liveUrl,
    featured
  }
`;

export const portfolioCategoriesQuery = groq`
  *[_type == "portfolioCategory"] | order(title asc){
    _id,
    title,
    "slug": slug.current
  }
`;

export interface PortfolioCategoryResult {
  _id: string;
  title: string;
  slug: string;
}

export interface ProjectCardResult {
  title: string;
  slug: string;
  subtitle: string;
  icon?: string;
  coverImage?: CloudinaryAsset;
  gallery?: CloudinaryAsset[];
  category?: { title: string; slug: string };
  challenge?: string;
  solution?: string;
  result?: string;
  liveUrl?: string;
  featured?: boolean;
}

// --- Pricing Plans -------------------------------------------------------

export const pricingPlansQuery = groq`
  *[_type == "pricingPlan"] | order(order asc){
    _id,
    name,
    price,
    priceSuffix,
    description,
    features,
    highlighted,
    badge,
    cta{ label, href }
  }
`;

export interface PricingPlanResult {
  _id: string;
  name: string;
  price: string;
  priceSuffix?: string;
  description?: string;
  features?: string[];
  highlighted?: boolean;
  badge?: string;
  cta?: CtaButtonResult;
}

// --- Blog Posts (latest) -------------------------------------------------

export const latestBlogPostsQuery = groq`
  *[_type == "blogPost"] | order(publishedAt desc)[0..2]{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "category": categories[0]->title,
    publishedAt,
    coverImage
  }
`;

export interface BlogPostCardResult {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  category?: string;
  publishedAt: string;
  coverImage?: CloudinaryAsset;
}

// --- Blog Posts (all — for /blog index page) ----------------------------

export const allBlogPostsQuery = groq`
  *[_type == "blogPost"] | order(publishedAt desc){
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "categories": categories[]->title,
    "category": categories[0]->title,
    publishedAt,
    coverImage,
    body,
    "author": author->{ name, role, avatar, "slug": slug.current }
  }
`;

export interface BlogPostListResult {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  categories?: string[];
  category?: string;
  publishedAt: string;
  coverImage?: CloudinaryAsset;
  body?: unknown[];
  author?: {
    name: string;
    role?: string;
    avatar?: CloudinaryAsset;
    slug: string;
  };
}

export const allBlogCategoriesQuery = groq`
  *[_type == "blogCategory"] | order(title asc){
    _id,
    title,
    "slug": slug.current
  }
`;

export interface BlogCategoryResult {
  _id: string;
  title: string;
  slug: string;
}

// --- Single Blog Post (for /blog/[slug]) ---------------------------------

export const singleBlogPostQuery = groq`
  *[_type == "blogPost" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "categories": categories[]->title,
    "category": categories[0]->title,
    publishedAt,
    coverImage,
    body,
    seo,
    "author": author->{
      name,
      role,
      bio,
      avatar,
      "slug": slug.current,
      socialLinks[]{ platform, url }
    }
  }
`;

export interface SingleBlogPostResult {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  categories?: string[];
  category?: string;
  publishedAt: string;
  coverImage?: CloudinaryAsset;
  body?: unknown[];
  seo?: SeoResult;
  author?: {
    name: string;
    role?: string;
    bio?: string;
    avatar?: CloudinaryAsset;
    slug: string;
    socialLinks?: { platform: string; url: string }[];
  };
}

export const relatedBlogPostsQuery = groq`
  *[_type == "blogPost" && slug.current != $slug && count((categories[]->title)[@ in $categories]) > 0] | order(publishedAt desc)[0..2]{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "category": categories[0]->title,
    publishedAt,
    coverImage
  }
`;

// --- Testimonials & Clients ---------------------------------------------

export const clientsQuery = groq`
  *[_type == "client"] | order(order asc){
    _id,
    name,
    logo,
    website
  }
`;

export interface ClientLogoResult {
  _id: string;
  name: string;
  logo?: CloudinaryAsset;
  website?: string;
}

export const featuredTestimonialsQuery = groq`
  *[_type == "testimonial" && featured == true] | order(order asc){
    _id,
    quote,
    authorName,
    authorRole,
    avatar,
    "client": client->name,
    "clientLogo": client->logo,
    rating
  }
`;

export interface TestimonialResult {
  _id: string;
  quote: string;
  authorName: string;
  authorRole?: string;
  avatar?: CloudinaryAsset;
  client?: string;
  clientLogo?: CloudinaryAsset;
  rating?: number;
}

// --- FAQs ---------------------------------------------------------------

export const faqsQuery = groq`
  *[_type == "faq"] | order(order asc){
    _id,
    question,
    answer,
    category
  }
`;

export interface FaqResult {
  _id: string;
  question: string;
  answer?: any;
  category?: string;
}
