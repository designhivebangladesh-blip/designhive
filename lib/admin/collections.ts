import type { CollectionConfig } from "./types";

/**
 * One entry per Sanity document type managed through the generic
 * /admin CRUD engine. Orders and Messages are intentionally NOT here —
 * they have bespoke workflow (status transitions, read/unread, internal
 * notes) and get their own hand-built pages under app/admin/(dashboard)/orders
 * and .../messages instead of the generic list/form.
 *
 * `serviceCategory` and `portfolioCategory` aren't in the prompt's route
 * list, but `service.category` / `project.category` are references to
 * them — without somewhere to create one, those dropdowns would always be
 * empty. They're exposed as lightweight nested routes (mirroring the
 * blog/categories pattern the prompt itself specifies) rather than a
 * top-level nav item.
 */

/**
 * The custom /admin area owns business operations and site settings.
 * Editorial/content documents stay in Sanity Studio so editors get the
 * full-fidelity Portable Text, media, history and publishing workflow.
 */
export const CUSTOM_ADMIN_TYPES = new Set([
  "pricingPlan",
  "client",
  "teamMember",
  "contactInfo",
  "siteSettings",
]);

export const STUDIO_CONTENT_TYPES = new Set([
  "homepage",
  "serviceCategory",
  "service",
  "portfolioCategory",
  "project",
  "blogCategory",
  "author",
  "blogPost",
  "testimonial",
  "faq",
]);

export const collections: CollectionConfig[] = [
  {
    type: "service",
    path: ["services"],
    label: "Service",
    pluralLabel: "Services",
    titleField: "title",
    orderBy: "order asc",
    searchFields: ["title", "description"],
    listColumns: [
      { key: "title", label: "Title" },
      { key: "category", label: "Category" },
      { key: "featured", label: "Featured" },
      { key: "order", label: "Order" },
    ],
    fields: [
      { name: "title", title: "Title", type: "string", required: true },
      { name: "slug", title: "Slug", type: "slug", slugSource: "title", required: true },
      {
        name: "icon",
        title: "Icon",
        type: "select",
        required: true,
        options: [
          { title: "Layout / UX-UI", value: "layout-template" },
          { title: "Code / Development", value: "code-2" },
          { title: "Award / Branding", value: "award" },
          { title: "Compass / Strategy", value: "compass" },
          { title: "Megaphone / Marketing", value: "megaphone" },
          { title: "Users / Team", value: "users-2" },
        ],
      },
      { name: "description", title: "Card description", type: "text", rows: 2, required: true, maxLength: 160 },
      { name: "body", title: "Full description", type: "richtext", description: "Rich text isn't fully preserved by this editor — for advanced formatting use Sanity Studio." },
      { name: "category", title: "Category", type: "reference", referenceTo: "serviceCategory", referenceLabelField: "title" },
      { name: "order", title: "Display order", type: "number", description: "Lower numbers show first." },
      { name: "featured", title: "Featured on homepage", type: "boolean" },
      ...seoGroup(),
    ],
  },
  {
    type: "serviceCategory",
    path: ["services", "categories"],
    label: "Service Category",
    pluralLabel: "Service Categories",
    titleField: "title",
    orderBy: "title asc",
    searchFields: ["title"],
    listColumns: [{ key: "title", label: "Title" }],
    fields: [
      { name: "title", title: "Title", type: "string", required: true },
      { name: "slug", title: "Slug", type: "slug", slugSource: "title", required: true },
    ],
  },
  {
    type: "project",
    path: ["projects"],
    label: "Project",
    pluralLabel: "Portfolio Projects",
    titleField: "title",
    orderBy: "order asc",
    searchFields: ["title", "subtitle"],
    listColumns: [
      { key: "title", label: "Title" },
      { key: "subtitle", label: "Subtitle" },
      { key: "featured", label: "Featured" },
      { key: "order", label: "Order" },
    ],
    fields: [
      { name: "title", title: "Title", type: "string", required: true },
      { name: "slug", title: "Slug", type: "slug", slugSource: "title", required: true },
      { name: "subtitle", title: "Subtitle", type: "string", required: true },
      {
        name: "icon",
        title: "Icon",
        type: "select",
        description: "Used while no cover image is set.",
        options: [
          { title: "Line chart", value: "line-chart" },
          { title: "Palette", value: "palette" },
          { title: "Box", value: "box" },
          { title: "Smartphone", value: "smartphone" },
          { title: "Bar chart", value: "bar-chart-3" },
          { title: "Sparkles", value: "sparkles" },
        ],
      },
      { name: "coverImage", title: "Cover image", type: "image", accept: "image" },
      { name: "gallery", title: "Gallery", type: "imageArray", accept: "image" },
      { name: "category", title: "Category", type: "reference", referenceTo: "portfolioCategory", referenceLabelField: "title" },
      { name: "client", title: "Client", type: "reference", referenceTo: "client", referenceLabelField: "name" },
      { name: "servicesUsed", title: "Services used", type: "referenceArray", referenceTo: "service", referenceLabelField: "title" },
      { name: "body", title: "Case study", type: "richtext" },
      { name: "featured", title: "Featured on homepage", type: "boolean" },
      { name: "order", title: "Display order", type: "number" },
      ...seoGroup(),
    ],
  },
  {
    type: "portfolioCategory",
    path: ["projects", "categories"],
    label: "Portfolio Category",
    pluralLabel: "Portfolio Categories",
    titleField: "title",
    orderBy: "title asc",
    searchFields: ["title"],
    listColumns: [{ key: "title", label: "Title" }],
    fields: [
      { name: "title", title: "Title", type: "string", required: true },
      { name: "slug", title: "Slug", type: "slug", slugSource: "title", required: true },
    ],
  },
  {
    type: "blogPost",
    path: ["blog"],
    label: "Blog Post",
    pluralLabel: "Blog Posts",
    titleField: "title",
    orderBy: "publishedAt desc",
    searchFields: ["title", "excerpt"],
    listColumns: [
      { key: "title", label: "Title" },
      { key: "author", label: "Author" },
      { key: "publishedAt", label: "Published" },
    ],
    fields: [
      { name: "title", title: "Title", type: "string", required: true },
      { name: "slug", title: "Slug", type: "slug", slugSource: "title", required: true },
      { name: "excerpt", title: "Excerpt", type: "text", rows: 3, required: true, maxLength: 200 },
      { name: "coverImage", title: "Cover image", type: "image", required: true, accept: "image" },
      { name: "author", title: "Author", type: "reference", referenceTo: "author", referenceLabelField: "name", required: true },
      { name: "categories", title: "Categories", type: "referenceArray", referenceTo: "blogCategory", referenceLabelField: "title" },
      { name: "tags", title: "Tags", type: "tags" },
      { name: "publishedAt", title: "Published at", type: "datetime", required: true },
      { name: "featured", title: "Featured", type: "boolean" },
      { name: "body", title: "Body", type: "richtext", required: true, description: "Plain-text paragraphs only — embedded images and rich formatting aren't supported here. Use Sanity Studio for those." },
      ...seoGroup(),
    ],
  },
  {
    type: "blogCategory",
    path: ["blog", "categories"],
    label: "Blog Category",
    pluralLabel: "Blog Categories",
    titleField: "title",
    orderBy: "title asc",
    searchFields: ["title"],
    listColumns: [{ key: "title", label: "Title" }],
    fields: [
      { name: "title", title: "Title", type: "string", required: true },
      { name: "slug", title: "Slug", type: "slug", slugSource: "title", required: true },
    ],
  },
  {
    type: "author",
    path: ["authors"],
    label: "Author",
    pluralLabel: "Authors",
    titleField: "name",
    orderBy: "name asc",
    searchFields: ["name", "role"],
    listColumns: [
      { key: "name", label: "Name" },
      { key: "role", label: "Role" },
    ],
    fields: [
      { name: "name", title: "Name", type: "string", required: true },
      { name: "slug", title: "Slug", type: "slug", slugSource: "name", required: true },
      { name: "avatar", title: "Avatar", type: "image", accept: "image" },
      { name: "role", title: "Role", type: "string" },
      { name: "bio", title: "Bio", type: "text", rows: 3 },
      { name: "socialLinks", title: "Social links", type: "socialLinks" },
    ],
  },
  {
    type: "teamMember",
    path: ["team"],
    label: "Team Member",
    pluralLabel: "Team",
    titleField: "name",
    orderBy: "order asc",
    searchFields: ["name", "role"],
    listColumns: [
      { key: "name", label: "Name" },
      { key: "role", label: "Role" },
      { key: "order", label: "Order" },
    ],
    fields: [
      { name: "name", title: "Name", type: "string", required: true },
      { name: "role", title: "Role", type: "string", required: true },
      { name: "photo", title: "Photo", type: "image", required: true, accept: "image" },
      { name: "bio", title: "Bio", type: "text", rows: 3 },
      { name: "socialLinks", title: "Social links", type: "socialLinks" },
      { name: "order", title: "Display order", type: "number" },
    ],
  },
  {
    type: "testimonial",
    path: ["testimonials"],
    label: "Testimonial",
    pluralLabel: "Testimonials",
    titleField: "authorName",
    orderBy: "order asc",
    searchFields: ["authorName", "quote"],
    listColumns: [
      { key: "authorName", label: "Author" },
      { key: "rating", label: "Rating" },
      { key: "featured", label: "Featured" },
    ],
    fields: [
      { name: "quote", title: "Quote", type: "text", rows: 4, required: true },
      { name: "authorName", title: "Author name", type: "string", required: true },
      { name: "authorRole", title: "Author role", type: "string" },
      { name: "avatar", title: "Avatar", type: "image", accept: "image" },
      { name: "client", title: "Client / company", type: "reference", referenceTo: "client", referenceLabelField: "name" },
      { name: "rating", title: "Rating (1-5)", type: "number" },
      { name: "featured", title: "Featured on homepage", type: "boolean" },
      { name: "order", title: "Display order", type: "number" },
    ],
  },
  {
    type: "client",
    path: ["clients"],
    label: "Client",
    pluralLabel: "Clients",
    titleField: "name",
    orderBy: "order asc",
    searchFields: ["name"],
    listColumns: [
      { key: "name", label: "Name" },
      { key: "website", label: "Website" },
      { key: "order", label: "Order" },
    ],
    fields: [
      { name: "name", title: "Name", type: "string", required: true },
      { name: "logo", title: "Logo", type: "image", required: true, accept: "image" },
      { name: "website", title: "Website", type: "url" },
      { name: "order", title: "Display order", type: "number" },
    ],
  },
  {
    type: "pricingPlan",
    path: ["pricing"],
    label: "Pricing Plan",
    pluralLabel: "Pricing Plans",
    titleField: "name",
    orderBy: "order asc",
    searchFields: ["name"],
    listColumns: [
      { key: "name", label: "Plan" },
      { key: "price", label: "Price" },
      { key: "highlighted", label: "Highlighted" },
      { key: "order", label: "Order" },
    ],
    fields: [
      { name: "name", title: "Plan name", type: "string", required: true },
      { name: "price", title: "Price", type: "string", required: true, description: 'e.g. "$1,200" or "Custom".' },
      { name: "priceSuffix", title: "Price suffix", type: "string", description: 'e.g. "/mo", "/project".' },
      { name: "description", title: "Description", type: "text", rows: 2 },
      { name: "features", title: "Included features", type: "tags", description: "Press Enter after each feature." },
      { name: "highlighted", title: "Highlight this plan", type: "boolean" },
      {
        name: "cta",
        title: "Button",
        type: "group",
        fields: [
          { name: "cta.label", title: "Button label", type: "string" },
          { name: "cta.href", title: "Button link", type: "string", description: 'An in-page anchor (e.g. "#work") or a full URL.' },
        ],
      },
      { name: "order", title: "Display order", type: "number" },
    ],
  },
  {
    type: "faq",
    path: ["faq"],
    label: "FAQ",
    pluralLabel: "FAQs",
    titleField: "question",
    orderBy: "order asc",
    searchFields: ["question", "category"],
    listColumns: [
      { key: "question", label: "Question" },
      { key: "category", label: "Category" },
      { key: "order", label: "Order" },
    ],
    fields: [
      { name: "question", title: "Question", type: "string", required: true },
      { name: "answer", title: "Answer", type: "richtext", required: true },
      { name: "category", title: "Category", type: "string", description: 'Optional grouping label, e.g. "Pricing", "Process".' },
      { name: "order", title: "Display order", type: "number" },
    ],
  },
  {
    type: "contactInfo",
    path: ["contact"],
    label: "Contact Information",
    pluralLabel: "Contact Information",
    singleton: true,
    titleField: "email",
    orderBy: "_createdAt asc",
    searchFields: [],
    listColumns: [],
    fields: [
      { name: "email", title: "Email", type: "email", required: true },
      { name: "phone", title: "Phone", type: "string", required: true, description: 'Include the country code, e.g. "+8801408388029".' },
      { name: "location", title: "Location", type: "string", required: true },
      { name: "socialLinks", title: "Social links", type: "socialLinks" },
    ],
  },
  {
    type: "siteSettings",
    path: ["settings"],
    label: "Site Settings",
    pluralLabel: "Site Settings",
    singleton: true,
    titleField: "siteName",
    orderBy: "_createdAt asc",
    searchFields: [],
    listColumns: [],
    fields: [
      { name: "siteName", title: "Site name", type: "string", required: true },
      { name: "tagline", title: "Tagline", type: "string" },
      { name: "logoIcon", title: "Logo (icon mark)", type: "image", accept: "image" },
      { name: "logoFull", title: "Logo (full lockup)", type: "image", accept: "image" },
      ...seoGroup("Default SEO"),
    ],
  },
];

// Keep the registry complete for schema compatibility, but expose only the
// business/settings subset through the generic custom admin engine.
for (const collection of collections) {
  collection.adminManaged = CUSTOM_ADMIN_TYPES.has(collection.type);
}

function seoGroup(title = "SEO"): [import("./types").FieldConfig] {
  return [
    {
      name: "seo",
      title,
      type: "group",
      fields: [
        { name: "seo.metaTitle", title: "Meta title", type: "string", maxLength: 60 },
        { name: "seo.metaDescription", title: "Meta description", type: "text", rows: 3, maxLength: 160 },
        { name: "seo.ogImage", title: "Social share image", type: "image", accept: "image" },
        { name: "seo.noIndex", title: "Hide from search engines", type: "boolean" },
      ],
    },
  ];
}

export function findCollectionByPath(segments: string[]): CollectionConfig | undefined {
  return collections.find(
    (c) => c.path.length === segments.length && c.path.every((seg, i) => seg === segments[i])
  );
}

export function findCollectionByType(type: string): CollectionConfig | undefined {
  return collections.find((c) => c.type === type);
}

/** All distinct `referenceTo` collection types used by a set of fields
 * (including inside "group" fields), for pre-fetching option lists. */
export function collectReferenceTypes(fields: CollectionConfig["fields"]): { type: string; labelField: string }[] {
  const seen = new Map<string, string>();
  const walk = (list: CollectionConfig["fields"]) => {
    for (const field of list) {
      if ((field.type === "reference" || field.type === "referenceArray") && field.referenceTo) {
        seen.set(field.referenceTo, field.referenceLabelField ?? "title");
      }
      if (field.type === "group" && field.fields) walk(field.fields);
    }
  };
  walk(fields);
  return Array.from(seen.entries()).map(([type, labelField]) => ({ type, labelField }));
}
