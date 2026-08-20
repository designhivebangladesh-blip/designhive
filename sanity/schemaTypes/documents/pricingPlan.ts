import { defineField, defineType } from "sanity";

export const pricingPlan = defineType({
  name: "pricingPlan",
  title: "Pricing Plan",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Plan name",
      description: 'e.g. "Starter", "Growth", "Enterprise"',
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "price",
      title: "Price",
      description: 'e.g. "$1,200" or "Custom" — kept as text for flexibility.',
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "priceSuffix",
      title: "Price suffix",
      description: 'e.g. "/mo", "/project". Leave empty for one-off or "Custom" pricing.',
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "features",
      title: "Included features",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "highlighted",
      title: "Highlight this plan",
      description: 'e.g. shows a "Most popular" ribbon.',
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "badge",
      title: "Badge / Ribbon text",
      description: 'e.g. "Most Popular", "Best Value", "Bespoke"',
      type: "string",
    }),
    defineField({
      name: "cta",
      title: "Button",
      type: "ctaButton",
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
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
    select: { title: "name", subtitle: "price" },
  },
});
