import { defineField, defineType } from "sanity";

export const openingHours = defineType({
  name: "openingHours",
  title: "Opening hours row",
  type: "object",
  fields: [
    defineField({
      name: "days",
      title: "Days",
      description: 'e.g. "Mon – Fri", "Weekends"',
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "hours",
      title: "Hours",
      description: 'e.g. "9 AM – 6 PM BST"',
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "days", subtitle: "hours" },
  },
});
