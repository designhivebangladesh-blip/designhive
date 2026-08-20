import { defineField, defineType } from "sanity";

export const blogSection = defineType({
  name: "blogSection",
  title: "Blog section heading",
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
