import { defineField, defineType } from "sanity";

export const statBadge = defineType({
  name: "statBadge",
  title: "Stat badge",
  type: "object",
  fields: [
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      options: {
        list: [
          { title: "Sparkles", value: "sparkles" },
          { title: "Rocket", value: "rocket" },
          { title: "Users", value: "users" },
          { title: "Award", value: "award" },
          { title: "Trending up", value: "trending-up" },
          { title: "Star", value: "star" },
        ],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "value",
      title: "Value",
      description: 'e.g. "98%", "250+", "10+"',
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "label",
      title: "Label",
      description: 'e.g. "Client satisfaction"',
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "value", subtitle: "label" },
  },
});
