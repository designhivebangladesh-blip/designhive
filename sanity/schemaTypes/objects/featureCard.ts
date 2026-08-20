import { defineField, defineType } from "sanity";

// Individual feature/value-prop card used inside the aboutSection array.
// Stored as a separate object schema so Sanity's array preview works cleanly.
export const featureCard = defineType({
  name: "featureCard",
  title: "Feature card",
  type: "object",
  fields: [
    defineField({
      name: "icon",
      title: "Icon",
      description: "Lucide icon identifier displayed in the hexagon accent.",
      type: "string",
      options: {
        list: [
          { title: "Target / Precision", value: "target" },
          { title: "Zap / Performance", value: "zap" },
          { title: "Shield Check / Quality", value: "shield-check" },
          { title: "Sparkles / Innovation", value: "sparkles" },
          { title: "Layers / Design", value: "layers" },
          { title: "Globe / Global", value: "globe" },
        ],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Card title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Card description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().max(200),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "description" },
  },
});
