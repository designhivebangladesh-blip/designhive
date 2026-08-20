import { defineField, defineType } from "sanity";

export const pricingSection = defineType({
  name: "pricingSection",
  title: "Pricing section heading",
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
