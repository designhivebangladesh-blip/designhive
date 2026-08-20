import { defineField, defineType } from "sanity";

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({
      name: "metaTitle",
      title: "Meta title",
      type: "string",
      description: "Falls back to the page/document title if left empty.",
      validation: (Rule) => Rule.max(60).warning("Titles over ~60 characters get truncated in search results."),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta description",
      type: "text",
      rows: 3,
      validation: (Rule) =>
        Rule.max(160).warning("Descriptions over ~160 characters get truncated in search results."),
    }),
    defineField({
      name: "ogImage",
      title: "Social share image",
      description: "Used for Open Graph / Twitter Card previews. Recommended 1200×630.",
      type: "cloudinary.asset",
    }),
    defineField({
      name: "noIndex",
      title: "Hide from search engines",
      type: "boolean",
      initialValue: false,
    }),
  ],
  options: {
    collapsible: true,
    collapsed: true,
  },
});
