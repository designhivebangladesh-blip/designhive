import { defineField, defineType } from "sanity";

export const homepage = defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  fields: [
    defineField({
      name: "hero",
      title: "Hero section",
      type: "heroSection",
    }),
    defineField({
      name: "aboutSection",
      title: "About section",
      description: "Controls the About section headline, intro paragraph, and feature cards.",
      type: "aboutSection",
    }),
    defineField({
      name: "servicesSection",
      title: "Services section heading",
      description: "The intro copy above the Services grid. The service cards themselves are managed under Services.",
      type: "sectionHeading",
    }),
    defineField({
      name: "portfolioSection",
      title: "Portfolio section heading",
      description: "The intro copy above the Portfolio grid. The project cards themselves are managed under Portfolio Projects.",
      type: "sectionHeading",
    }),
    defineField({
      name: "portfolioCta",
      title: "Portfolio section button",
      type: "ctaButton",
    }),
    defineField({
      name: "pricingSection",
      title: "Pricing section heading",
      description: "The intro copy above the Pricing Plans grid. The plans themselves are managed under Pricing Plans.",
      type: "pricingSection",
    }),
    defineField({
      name: "testimonialsSection",
      title: "Testimonials section heading",
      type: "testimonialsSection",
    }),
    defineField({
      name: "blogSection",
      title: "Blog section heading",
      description: "The intro copy above the Blog post cards. Posts are managed under Blog Posts.",
      type: "blogSection",
    }),
    defineField({
      name: "faqSection",
      title: "FAQ section heading",
      type: "faqSection",
    }),
    defineField({
      name: "ctaBand",
      title: "CTA band",
      description: "The closing 'Have a project in mind?' band before the footer.",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
        defineField({ name: "cta", title: "Button", type: "ctaButton" }),
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Homepage" }),
  },
});
