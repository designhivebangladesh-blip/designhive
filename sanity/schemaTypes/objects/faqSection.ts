import { defineField, defineType } from "sanity";

export const faqSection = defineType({
  name: "faqSection",
  title: "FAQ section",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Section heading",
      type: "sectionHeading",
    }),
  ],
  options: { collapsible: true, collapsed: true },
});
