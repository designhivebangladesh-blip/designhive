import { defineField, defineType } from "sanity";

export const contactInfo = defineType({
  name: "contactInfo",
  title: "Contact Information",
  type: "document",
  fields: [
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) =>
        Rule.required().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
          name: "email",
          invert: false,
        }),
    }),
    defineField({
      name: "phone",
      title: "Phone",
      description: 'Include the country code, e.g. "+8801408388029". Used directly in tel: links.',
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "whatsapp",
      title: "WhatsApp Number or Direct Link",
      description: 'e.g. "+8801408388029" or "https://wa.me/8801408388029"',
      type: "string",
    }),
    defineField({
      name: "location",
      title: "Location / City",
      description: 'e.g. "Dhaka, Bangladesh". Displayed as short location text.',
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "address",
      title: "Full street address",
      description: "Detailed street address for contact section/footer.",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "openingHours",
      title: "Opening hours",
      description: "Business operating hours shown on contact/footer.",
      type: "array",
      of: [{ type: "openingHours" }],
    }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "array",
      of: [{ type: "socialLink" }],
      validation: (Rule) => Rule.unique(),
    }),
  ],
  preview: {
    select: { title: "email", subtitle: "location" },
  },
});
