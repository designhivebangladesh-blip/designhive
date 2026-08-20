import { defineField, defineType } from "sanity";

// Reusable "About section" object — embedded directly inside the homepage
// singleton so editors don't need to navigate away to edit it. No migration
// required: adding new fields to a singleton that has never been published
// simply means those fields start empty and fall back to the component's
// FALLBACK constants until an editor fills them in.
export const aboutSection = defineType({
  name: "aboutSection",
  title: "About section",
  type: "object",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow badge text",
      description: 'e.g. "About Designhive"',
      type: "string",
    }),
    defineField({
      name: "headlineLine",
      title: "Headline (plain part)",
      description: 'e.g. "Where vision meets"',
      type: "string",
    }),
    defineField({
      name: "headlineHighlight",
      title: "Headline (highlighted part)",
      description: 'e.g. "digital mastery" — rendered with shimmer effect.',
      type: "string",
    }),
    defineField({
      name: "body",
      title: "Intro paragraph",
      description: "Short paragraph shown below the headline.",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "cta",
      title: "Button",
      type: "ctaButton",
    }),
    defineField({
      name: "featureCards",
      title: "Feature cards",
      description: "The three value-prop cards shown in the grid. Supports up to 3.",
      type: "array",
      of: [{ type: "featureCard" }],
      validation: (Rule) => Rule.max(3),
    }),
  ],
  options: { collapsible: true, collapsed: false },
});
