import type { SchemaTypeDefinition } from "sanity";

import { seo } from "./objects/seo";
import { socialLink } from "./objects/socialLink";
import { ctaButton } from "./objects/ctaButton";
import { statBadge } from "./objects/statBadge";
import { heroSection } from "./objects/heroSection";
import { sectionHeading } from "./objects/sectionHeading";
import { openingHours } from "./objects/openingHours";
import { featureCard } from "./objects/featureCard";
import { aboutSection } from "./objects/aboutSection";
import { pricingSection } from "./objects/pricingSection";
import { testimonialsSection } from "./objects/testimonialsSection";
import { blogSection } from "./objects/blogSection";
import { faqSection } from "./objects/faqSection";

import { siteSettings } from "./documents/siteSettings";
import { contactInfo } from "./documents/contactInfo";
import { homepage } from "./documents/homepage";
import { serviceCategory } from "./documents/serviceCategory";
import { service } from "./documents/service";
import { pricingPlan } from "./documents/pricingPlan";
import { portfolioCategory } from "./documents/portfolioCategory";
import { project } from "./documents/project";
import { client } from "./documents/client";
import { testimonial } from "./documents/testimonial";
import { blogCategory } from "./documents/blogCategory";
import { author } from "./documents/author";
import { blogPost } from "./documents/blogPost";
import { teamMember } from "./documents/teamMember";
import { faq } from "./documents/faq";
import { order } from "./documents/order";
import { message } from "./documents/message";

const allSchemaTypes: SchemaTypeDefinition[] = [
  // objects
  seo,
  socialLink,
  ctaButton,
  statBadge,
  heroSection,
  sectionHeading,
  openingHours,
  featureCard,
  aboutSection,
  pricingSection,
  testimonialsSection,
  blogSection,
  faqSection,
  // documents
  siteSettings,
  contactInfo,
  homepage,
  serviceCategory,
  service,
  pricingPlan,
  portfolioCategory,
  project,
  client,
  testimonial,
  blogCategory,
  author,
  blogPost,
  teamMember,
  faq,
  order,
  message,
];


const STUDIO_READ_ONLY_TYPES = new Set([
  "siteSettings",
  "contactInfo",
  "pricingPlan",
  "client",
  "teamMember",
  "order",
  "message",
]);

/**
 * These documents remain registered because content documents reference some
 * of them (for example project -> client). They are deliberately read-only
 * in Studio; mutations belong to the authenticated custom /admin UI.
 */
export const schemaTypes: SchemaTypeDefinition[] = allSchemaTypes.map((schemaType) =>
  schemaType.type === "document" && STUDIO_READ_ONLY_TYPES.has(schemaType.name)
    ? { ...schemaType, readOnly: true }
    : schemaType
);
