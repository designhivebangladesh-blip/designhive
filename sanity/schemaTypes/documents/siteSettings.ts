import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "siteName",
      title: "Site name",
      type: "string",
      initialValue: "Designhive",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      description: 'e.g. "Digital Agency" — shown under the wordmark where used.',
    }),
    defineField({
      name: "logoIcon",
      title: "Logo (icon mark)",
      description: "Square icon-only mark, used at small sizes (header/footer).",
      type: "cloudinary.asset",
    }),
    defineField({
      name: "logoFull",
      title: "Logo (full lockup)",
      description: "Icon + wordmark + tagline, for larger standalone placements.",
      type: "cloudinary.asset",
    }),
    defineField({
      name: "navigation",
      title: "Header navigation menu",
      description: "Manage header menu links. If empty, standard section anchors are used.",
      type: "array",
      of: [
        {
          type: "object",
          name: "navItem",
          title: "Menu item",
          fields: [
            defineField({ name: "label", title: "Label", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "href", title: "Link / Anchor", type: "string", validation: (Rule) => Rule.required() }),
          ],
          preview: {
            select: { title: "label", subtitle: "href" },
          },
        },
      ],
    }),
    defineField({
      name: "headerCta",
      title: "Header primary CTA button",
      description: "Controls the main CTA button in the header.",
      type: "ctaButton",
    }),
    defineField({
      name: "footerStatement",
      title: "Footer brand statement",
      description: "Short brand statement displayed under the logo in the footer.",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "footerNavigation",
      title: "Footer navigation columns",
      description: "Custom columns for footer links. If empty, standard navigation is used.",
      type: "array",
      of: [
        {
          type: "object",
          name: "footerColumn",
          title: "Column",
          fields: [
            defineField({ name: "title", title: "Column Title", type: "string", validation: (Rule) => Rule.required() }),
            defineField({
              name: "links",
              title: "Links",
              type: "array",
              of: [
                {
                  type: "object",
                  name: "footerLink",
                  title: "Link",
                  fields: [
                    defineField({ name: "label", title: "Label", type: "string", validation: (Rule) => Rule.required() }),
                    defineField({ name: "href", title: "Href / URL", type: "string", validation: (Rule) => Rule.required() }),
                  ],
                },
              ],
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "legalLinks",
      title: "Legal Links",
      description: "Footer bottom legal links (e.g. Privacy Policy, Terms of Service).",
      type: "array",
      of: [
        {
          type: "object",
          name: "legalLink",
          title: "Legal Link",
          fields: [
            defineField({ name: "label", title: "Label", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "href", title: "Href / URL", type: "string", validation: (Rule) => Rule.required() }),
          ],
        },
      ],
    }),
    defineField({
      name: "copyrightText",
      title: "Copyright text",
      description: 'e.g. "All rights reserved." Shown after copyright year & site name.',
      type: "string",
    }),
    defineField({
      name: "seo",
      title: "Default SEO",
      description: "Used as a fallback for any page that doesn't set its own SEO fields.",
      type: "seo",
    }),
  ],
  preview: {
    select: { title: "siteName" },
  },
});
