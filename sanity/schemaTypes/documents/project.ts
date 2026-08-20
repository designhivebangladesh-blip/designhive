import { defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Portfolio Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 60 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      description: 'e.g. "Fintech dashboard UI" — shown under the title on the grid card.',
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "icon",
      title: "Icon",
      description: "Used for the current icon-only card design (matches lucide-react icons already used in Portfolio.tsx). Optional once a cover image is set.",
      type: "string",
      options: {
        list: [
          { title: "Line chart", value: "line-chart" },
          { title: "Palette", value: "palette" },
          { title: "Box", value: "box" },
          { title: "Smartphone", value: "smartphone" },
          { title: "Bar chart", value: "bar-chart-3" },
          { title: "Sparkles", value: "sparkles" },
        ],
        layout: "dropdown",
      },
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      description: "Real project photography — when set, can replace the icon placeholder on the card.",
      type: "cloudinary.asset",
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      description: "Additional images for a future case-study detail page.",
      type: "array",
      of: [{ type: "cloudinary.asset" }],
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "portfolioCategory" }],
    }),
    defineField({
      name: "client",
      title: "Client",
      type: "reference",
      to: [{ type: "client" }],
      options: { disableNew: true },
    }),
    defineField({
      name: "servicesUsed",
      title: "Services used",
      type: "array",
      of: [{ type: "reference", to: [{ type: "service" }] }],
    }),
    defineField({
      name: "liveUrl",
      title: "Live URL",
      description: "External URL to the live site/product.",
      type: "url",
    }),
    defineField({
      name: "challenge",
      title: "The Challenge",
      description: "Brief overview of the problem statement and client goals.",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "solution",
      title: "The Solution",
      description: "How Designhive solved the challenge.",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "result",
      title: "The Result",
      description: "Impact, conversion lift, performance gains, or launch success.",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "body",
      title: "Case study",
      description: "Rich text for a future individual project detail page.",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "featured",
      title: "Featured on homepage",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],
  orderings: [
    {
      title: "Display order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "subtitle" },
  },
});
