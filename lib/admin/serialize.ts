import "server-only";
import type { CollectionConfig, FieldConfig } from "./types";
import { plainTextToPortableText } from "./portable-text";
import { getDeep, setDeep } from "./deep-path";

/** Flattens group fields into a single leaf-field list, keyed by their
 * (possibly dot-pathed) `name`. */
function leafFields(fields: FieldConfig[]): FieldConfig[] {
  return fields.flatMap((f) => (f.type === "group" ? leafFields(f.fields ?? []) : [f]));
}

/**
 * Converts a submitted <form>'s FormData into a partial Sanity document
 * ready to be passed to `client.create` / `patch().set`.
 *
 * `originalDoc`, when editing, lets "richtext" fields that mix `block`
 * with other array item types (blogPost.body allows embedded
 * `cloudinary.asset` items alongside text) preserve those non-text items
 * instead of silently dropping them — this plain-text editor only
 * understands paragraphs, so anything else from the original document is
 * carried through unchanged rather than lost on save.
 */
export function formDataToDocument(
  config: CollectionConfig,
  formData: FormData,
  originalDoc?: Record<string, unknown>
): Record<string, unknown> {
  const doc: Record<string, unknown> = {};

  for (const field of leafFields(config.fields)) {
    const raw = formData.get(field.name);

    switch (field.type) {
      case "boolean": {
        setDeep(doc, field.name, formData.get(field.name) === "on");
        break;
      }
      case "number": {
        if (raw === null || raw === "") break;
        const num = Number(raw);
        if (!Number.isNaN(num)) setDeep(doc, field.name, num);
        break;
      }
      case "slug": {
        if (typeof raw === "string" && raw.trim()) {
          setDeep(doc, field.name, { _type: "slug", current: slugify(raw) });
        }
        break;
      }
      case "reference": {
        if (typeof raw === "string" && raw) {
          setDeep(doc, field.name, { _type: "reference", _ref: raw });
        } else {
          setDeep(doc, field.name, undefined);
        }
        break;
      }
      case "referenceArray": {
        const values = formData.getAll(field.name).filter((v): v is string => typeof v === "string" && v.length > 0);
        setDeep(
          doc,
          field.name,
          values.map((v) => ({ _type: "reference", _ref: v, _key: crypto.randomUUID().slice(0, 12) }))
        );
        break;
      }
      case "tags": {
        if (typeof raw === "string") {
          const items = raw
            .split(/[\n,]/)
            .map((s) => s.trim())
            .filter(Boolean);
          setDeep(doc, field.name, items);
        }
        break;
      }
      case "richtext": {
        if (typeof raw === "string") {
          const newBlocks = plainTextToPortableText(raw);
          const existing = getDeep(originalDoc, field.name);
          const preservedNonTextItems = Array.isArray(existing)
            ? existing.filter((item) => (item as { _type?: string })?._type !== "block")
            : [];
          setDeep(doc, field.name, [...newBlocks, ...preservedNonTextItems]);
        }
        break;
      }
      case "image": {
        if (typeof raw === "string" && raw.trim()) {
          try {
            const asset = JSON.parse(raw);
            setDeep(doc, field.name, { _type: "cloudinary.asset", ...asset });
          } catch {
            // no image selected / cleared — leave unset
          }
        } else {
          setDeep(doc, field.name, undefined);
        }
        break;
      }
      case "imageArray": {
        if (typeof raw === "string" && raw.trim()) {
          try {
            const assets = JSON.parse(raw) as Record<string, unknown>[];
            setDeep(
              doc,
              field.name,
              assets.map((asset) => ({ _type: "cloudinary.asset", _key: crypto.randomUUID().slice(0, 12), ...asset }))
            );
          } catch {
            // ignore malformed payload
          }
        }
        break;
      }
      case "socialLinks": {
        if (typeof raw === "string" && raw.trim()) {
          try {
            const links = JSON.parse(raw) as { platform: string; url: string }[];
            setDeep(
              doc,
              field.name,
              links
                .filter((l) => l.platform && l.url)
                .map((l) => ({ _type: "socialLink", _key: crypto.randomUUID().slice(0, 12), ...l }))
            );
          } catch {
            // ignore malformed payload
          }
        }
        break;
      }
      default: {
        if (typeof raw === "string") {
          setDeep(doc, field.name, raw);
        }
      }
    }
  }

  return doc;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 96);
}
