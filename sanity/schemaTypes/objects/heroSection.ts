import { defineField, defineType } from "sanity";

export const heroSection = defineType({
  name: "heroSection",
  title: "Hero section",
  type: "object",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow badge text",
      description: 'e.g. "Creative · Strategic · Results"',
      type: "string",
    }),
    defineField({
      name: "headlineLine",
      title: "Headline (plain part)",
      description: 'e.g. "We craft" — rendered before the highlighted part.',
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "headlineHighlight",
      title: "Headline (highlighted part)",
      description: 'e.g. "digital excellence" — rendered with the shimmer effect.',
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "primaryCta",
      title: "Primary button",
      type: "ctaButton",
    }),
    defineField({
      name: "secondaryCta",
      title: "Secondary button",
      type: "ctaButton",
    }),
    defineField({
      name: "trustLine",
      title: "Trust line",
      description: 'e.g. "Trusted by 100+ brands worldwide"',
      type: "string",
    }),
    defineField({
      name: "brandMarks",
      title: "Brand marks",
      description: "Client/brand names shown as text wordmarks under the trust line.",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "video",
      title: "Showreel video",
      description: "Cloudinary video asset, replaces the placeholder in HeroVideo.",
      type: "cloudinary.asset",
    }),
    defineField({
      name: "videoPoster",
      title: "Video poster frame",
      type: "cloudinary.asset",
    }),
    defineField({
      name: "founderNote",
      title: "Founder note / quote",
      description: 'e.g. "Personalized design direction on every brand project."',
      type: "string",
    }),
    defineField({
      name: "founderName",
      title: "Founder name",
      type: "string",
    }),
    defineField({
      name: "founderRole",
      title: "Founder role",
      type: "string",
    }),
    defineField({
      name: "founderAvatar",
      title: "Founder avatar",
      type: "cloudinary.asset",
    }),
    defineField({
      name: "heroImage",
      title: "Hero fallback image",
      description: "Cloudinary image asset used if showreel video is not provided.",
      type: "cloudinary.asset",
    }),
    defineField({
      name: "statBadges",
      title: "Floating stat badges",
      type: "array",
      of: [{ type: "statBadge" }],
      validation: (Rule) => Rule.max(3),
    }),
  ],
});
