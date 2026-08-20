import { defineField, defineType } from "sanity";

export const service = defineType({
  name: "service",
  title: "Service",
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
      name: "icon",
      title: "Icon",
      description: "Matches the lucide-react icons already used in Services.tsx.",
      type: "string",
      options: {
        list: [
          { title: "Layout / UX-UI", value: "layout-template" },
          { title: "Code / Development", value: "code-2" },
          { title: "Award / Branding", value: "award" },
          { title: "Compass / Strategy", value: "compass" },
          { title: "Megaphone / Marketing", value: "megaphone" },
          { title: "Users / Team", value: "users-2" },
        ],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Card description",
      description: "Short summary shown on the Services grid card.",
      type: "text",
      rows: 2,
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({
      name: "deliverables",
      title: "Deliverables preview",
      description: "List of key deliverables/tags shown on the card, e.g. Design system, Wireframes, Figma source.",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "startingPrice",
      title: "Starting price",
      description: 'e.g. "Starting at $1,499" or "$1,499"',
      type: "string",
    }),
    defineField({
      name: "cta",
      title: "Card CTA button",
      description: "Custom label & link for this specific service.",
      type: "ctaButton",
    }),
    defineField({
      name: "body",
      title: "Full description",
      description: "Rich text for an individual service detail page (future).",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "serviceCategory" }],
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      description: "Lower numbers show first.",
    }),
    defineField({
      name: "featured",
      title: "Featured on homepage",
      type: "boolean",
      initialValue: true,
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
    select: { title: "title", subtitle: "description" },
  },
});
