import { defineField, defineType } from "sanity";

// Inline testimonials section config, embedded on the homepage singleton.
// The actual testimonial content lives in the `testimonial` collection;
// this object only controls the section heading and which reviews are featured.
export const testimonialsSection = defineType({
  name: "testimonialsSection",
  title: "Testimonials section",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Section heading",
      type: "sectionHeading",
    }),
    defineField({
      name: "founderCredibility",
      title: "Founder credibility block",
      type: "object",
      fields: [
        defineField({ name: "founderName", title: "Founder Name", type: "string" }),
        defineField({ name: "founderRole", title: "Founder Role", type: "string" }),
        defineField({ name: "founderBio", title: "Founder Bio", type: "text", rows: 3 }),
        defineField({ name: "founderQuote", title: "Founder Personal Quote", type: "text", rows: 2 }),
        defineField({ name: "founderAvatar", title: "Founder Image/Avatar", type: "cloudinary.asset" }),
        defineField({
          name: "credentials",
          title: "Credibility Badges / Highlights",
          type: "array",
          of: [{ type: "string" }],
          description: 'e.g. ["10+ Years Experience", "100+ Projects Completed", "Ex-Lead Designer"]',
        }),
      ],
    }),
  ],
  options: { collapsible: true, collapsed: true },
});
