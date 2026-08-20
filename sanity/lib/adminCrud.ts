import "server-only";

import { writeClient } from "@/sanity/lib/writeClient";
import type { CollectionConfig } from "@/lib/admin/types";
import type { SanityDocumentStub } from "next-sanity";

/**
 * Generic reads/writes for the /admin CRUD engine, built on top of
 * `writeClient` (already used by the Orders/Messages admin views — see
 * that file's docstring for why it's safe to use server-side here).
 *
 * `config.type` and `config.orderBy` are always sourced from
 * `lib/admin/collections.ts`, a file only developers edit — never from
 * user input — so building GROQ strings with them via template literals
 * is safe. Anything that *does* come from the request (ids, search terms)
 * is always passed as a $param, never interpolated.
 */

export async function listDocuments(
  config: CollectionConfig
): Promise<Record<string, unknown>[]> {
  // Build an explicit projection (rather than `...`) so single-reference
  // fields shown in the list table (e.g. blogPost.author, service.category)
  // resolve to a readable label instead of a raw { _ref } object.
  const projectionParts = ["_id", "_updatedAt"];
  const seen = new Set(projectionParts);

  for (const field of config.fields) {
    if (seen.has(field.name)) continue;
    seen.add(field.name);

    if (field.type === "reference" && field.referenceTo) {
      projectionParts.push(
        `"${field.name}": ${field.name}->${
          field.referenceLabelField ?? "title"
        }`
      );
    } else if (field.type !== "group") {
      projectionParts.push(field.name);
    }
  }

  const query = `*[_type == $type] | order(${config.orderBy}) { ${projectionParts.join(
    ", "
  )} }`;

  return writeClient.fetch(query, { type: config.type });
}

export async function getDocument(
  id: string
): Promise<Record<string, unknown> | null> {
  return writeClient.fetch(`*[_id == $id][0]`, { id });
}

export async function getSingleton(
  type: string
): Promise<Record<string, unknown> | null> {
  return writeClient.fetch(`*[_type == $type][0]`, { type });
}

export async function createDocument(
  type: string,
  data: Record<string, unknown>
): Promise<{ _id: string }> {
  return writeClient.create({
    _type: type,
    ...data,
  } as SanityDocumentStub);
}

export async function patchDocument(
  id: string,
  data: Record<string, unknown>
): Promise<{ _id: string }> {
  return writeClient.patch(id).set(data).commit();
}

export async function deleteDocument(id: string): Promise<void> {
  await writeClient.delete(id);
}

/**
 * For reference / referenceArray field option lists — id + display label
 * for every document of a given type.
 */
export async function listReferenceOptions(
  type: string,
  labelField: string
): Promise<{ id: string; label: string }[]> {
  const docs = await writeClient.fetch<
    { _id: string; label: string }[]
  >(
    `*[_type == $type]{ _id, "label": ${labelField} } | order(label asc)`,
    { type }
  );

  return docs.map((d) => ({
    id: d._id,
    label: d.label || "(untitled)",
  }));
}

/**
 * Checks whether any *other* document references the given id, across a
 * known set of reference field paths — used to warn before deleting
 * something like a category that a service/project still points to.
 */
export async function countReferencingDocuments(
  targetId: string
): Promise<number> {
  return writeClient.fetch(`count(*[references($targetId)])`, {
    targetId,
  });
}