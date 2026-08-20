import type { StructureResolver } from "sanity/structure";

/**
 * Editorial boundary:
 * Sanity Studio is the content editor only. Business operations and global
 * site settings are intentionally handled by the authenticated /admin UI.
 */
export const STUDIO_CONTENT_TYPES = new Set([
  "homepage",
  "service",
  "serviceCategory",
  "project",
  "portfolioCategory",
  "blogPost",
  "blogCategory",
  "author",
  "testimonial",
  "faq",
]);

// Singletons exposed through the Studio are content singletons only.
export const SINGLETON_TYPES = new Set(["homepage"]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Homepage")
        .id("homepage")
        .child(S.document().schemaType("homepage").documentId("homepage")),

      S.divider(),

      S.listItem()
        .title("Services")
        .child(S.documentTypeList("service").title("Services")),
      S.listItem()
        .title("Service Categories")
        .child(S.documentTypeList("serviceCategory").title("Service Categories")),

      S.divider(),

      S.listItem()
        .title("Portfolio Projects")
        .child(S.documentTypeList("project").title("Portfolio Projects")),
      S.listItem()
        .title("Portfolio Categories")
        .child(S.documentTypeList("portfolioCategory").title("Portfolio Categories")),

      S.divider(),

      S.listItem()
        .title("Blog Posts")
        .child(S.documentTypeList("blogPost").title("Blog Posts")),
      S.listItem()
        .title("Blog Categories")
        .child(S.documentTypeList("blogCategory").title("Blog Categories")),
      S.listItem()
        .title("Authors")
        .child(S.documentTypeList("author").title("Authors")),

      S.divider(),

      S.listItem()
        .title("Testimonials")
        .child(S.documentTypeList("testimonial").title("Testimonials")),
      S.listItem()
        .title("FAQs")
        .child(S.documentTypeList("faq").title("FAQs")),
    ]);
