/**
 * Generic, config-driven admin CRUD engine.
 *
 * Rather than hand-building a bespoke list/create/edit/delete UI for each
 * of the 14+ Sanity document types, every collection is described once as
 * data (see `collections.ts`) and rendered by shared components
 * (`components/admin/collection-list.tsx`, `record-form.tsx`). Adding a
 * new field to an existing collection, or a new collection entirely, is a
 * config change — not a new set of pages.
 *
 * This does not replace Sanity Studio (`/studio`), which remains the
 * full-fidelity editor (rich text marks, Cloudinary Media Library browsing,
 * document history, etc). This engine covers the day-to-day CRUD that the
 * marketing team needs from a dedicated `/admin` area.
 */

export type FieldType =
  | "string"
  | "text"
  | "slug"
  | "number"
  | "boolean"
  | "url"
  | "email"
  | "datetime"
  | "select"
  | "tags"
  | "reference"
  | "referenceArray"
  | "image"
  | "imageArray"
  | "richtext"
  | "socialLinks"
  | "group";

export interface SelectOption {
  title: string;
  value: string;
}

export interface FieldConfig {
  /** Sanity field name. Dot paths (e.g. "seo.metaTitle") are used for
   * fields nested inside a "group" field and are re-nested into an
   * object automatically on save. */
  name: string;
  title: string;
  type: FieldType;
  description?: string;
  required?: boolean;
  /** For "select" fields. */
  options?: SelectOption[];
  /** For "reference" / "referenceArray": which collection key (see
   * collections.ts) supplies the option list, and which field on that
   * document is shown as the label. */
  referenceTo?: string;
  referenceLabelField?: string;
  /** For "slug": which field's value to derive the slug from when the
   * "Generate" button is pressed. */
  slugSource?: string;
  /** For "group": nested fields, rendered inline together. */
  fields?: FieldConfig[];
  /** Textarea row count for "text" fields. */
  rows?: number;
  /** Show this field only for image/video (resource_type) — informational
   * hint passed to the uploader, not enforced server-side. */
  accept?: "image" | "video" | "any";
  maxLength?: number;
}

export interface CollectionConfig {
  /** Sanity `_type`. */
  type: string;
  /** URL path segments under /admin, e.g. ["services"] or
   * ["blog", "categories"]. */
  path: string[];
  label: string;
  pluralLabel: string;
  /** True when this document type is editable through the custom /admin UI. */
  adminManaged?: boolean;
  /** True for documents that only ever have one instance (e.g. siteSettings). */
  singleton?: boolean;
  fields: FieldConfig[];
  /** Columns shown in the list table — evaluated against the raw document. */
  listColumns: { key: string; label: string }[];
  /** Field(s) matched against the search box (client-side substring match). */
  searchFields: string[];
  /** GROQ order clause, e.g. "order asc" or "_createdAt desc". */
  orderBy: string;
  /** Field used as the human-readable title in delete confirmations etc. */
  titleField: string;
}
