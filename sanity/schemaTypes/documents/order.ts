import { defineField, defineType } from "sanity";

export const order = defineType({
  name: "order",
  title: "Order",
  type: "document",
  fields: [
    defineField({
      name: "clientName",
      title: "Client name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "clientEmail",
      title: "Client email",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "clientPhone",
      title: "Client phone",
      type: "string",
    }),
    defineField({
      name: "projectType",
      title: "Project type",
      type: "string",
    }),
    defineField({
      name: "budget",
      title: "Budget range",
      type: "string",
    }),
    defineField({
      name: "details",
      title: "Project details",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "In review", value: "in_review" },
          { title: "In progress", value: "in_progress" },
          { title: "Awaiting client", value: "awaiting_client" },
          { title: "Completed", value: "completed" },
          { title: "Archived", value: "archived" },
        ],
        layout: "dropdown",
      },
      initialValue: "new",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted at",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "internalNotes",
      title: "Internal notes",
      description: "Not shown to the client — team-only.",
      type: "text",
      rows: 3,
    }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "submittedAtDesc",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "clientName", subtitle: "status" },
  },
});
