"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { findCollectionByType } from "@/lib/admin/collections";
import { formDataToDocument } from "@/lib/admin/serialize";
import { requireAdminSession } from "@/lib/admin/require-session";
import {
  createDocument,
  patchDocument,
  deleteDocument,
  getDocument,
  getSingleton,
  countReferencingDocuments,
} from "@/sanity/lib/adminCrud";

export interface ActionState {
  error?: string;
  success?: boolean;
}

function adminBasePath(config: { path: string[] }): string {
  return `/admin/${config.path.join("/")}`;
}

function validateRequired(config: ReturnType<typeof findCollectionByType>, formData: FormData): string | null {
  if (!config) return "Unknown collection.";
  for (const field of config.fields.flatMap((f) => (f.type === "group" ? f.fields ?? [] : [f]))) {
    if (!field.required) continue;
    // image/reference/etc required-ness is best-effort here — the Sanity
    // schema itself remains the source of truth for validation, this is
    // just fast feedback in the admin form before round-tripping.
    const value = formData.get(field.name);
    if (value === null || (typeof value === "string" && value.trim() === "")) {
      return `"${field.title}" is required.`;
    }
  }
  return null;
}

export async function createRecordAction(
  typeKey: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdminSession();
  const config = findCollectionByType(typeKey);
  if (!config) return { error: "Unknown collection." };
  if (!config.adminManaged) return { error: "This content is managed in Sanity Studio." };

  const validationError = validateRequired(config, formData);
  if (validationError) return { error: validationError };

  let created: { _id: string };
  try {
    const doc = formDataToDocument(config, formData);
    created = await createDocument(config.type, doc);
  } catch (err) {
    console.error(`[admin_create_failed:${config.type}]`, err);
    return { error: "Could not save — please try again." };
  }

  revalidatePath(adminBasePath(config));
  redirect(`${adminBasePath(config)}/${created._id}?created=1`);
}

export async function updateRecordAction(
  typeKey: string,
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdminSession();
  const config = findCollectionByType(typeKey);
  if (!config) return { error: "Unknown collection." };
  if (!config.adminManaged) return { error: "This content is managed in Sanity Studio." };

  const validationError = validateRequired(config, formData);
  if (validationError) return { error: validationError };

  try {
    const original = await getDocument(id);
    const doc = formDataToDocument(config, formData, original ?? undefined);
    await patchDocument(id, doc);
  } catch (err) {
    console.error(`[admin_update_failed:${config.type}:${id}]`, err);
    return { error: "Could not save — please try again." };
  }

  revalidatePath(adminBasePath(config));
  revalidatePath(`${adminBasePath(config)}/${id}`);
  return { success: true };
}

export async function deleteRecordAction(
  typeKey: string,
  id: string,
  _prevState: ActionState,
  _formData: FormData
): Promise<ActionState> {
  await requireAdminSession();
  const config = findCollectionByType(typeKey);
  if (!config) return { error: "Unknown collection." };
  if (!config.adminManaged) return { error: "This content is managed in Sanity Studio." };

  const referenceCount = await countReferencingDocuments(id);
  if (referenceCount > 0) {
    return {
      error: `Can't delete — ${referenceCount} other document${referenceCount === 1 ? "" : "s"} still reference${
        referenceCount === 1 ? "s" : ""
      } this. Remove those references first (in Sanity Studio, for full reference visibility).`,
    };
  }

  try {
    await deleteDocument(id);
  } catch (err) {
    console.error(`[admin_delete_failed:${config.type}:${id}]`, err);
    return { error: "Could not delete — please try again." };
  }

  revalidatePath(adminBasePath(config));
  redirect(adminBasePath(config));
}

/** Singletons (siteSettings, contactInfo) don't have a list/delete flow —
 * just one document that's created on first save if it doesn't exist yet. */
export async function upsertSingletonAction(
  typeKey: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdminSession();
  const config = findCollectionByType(typeKey);
  if (!config) return { error: "Unknown collection." };
  if (!config.adminManaged) return { error: "This content is managed in Sanity Studio." };

  const validationError = validateRequired(config, formData);
  if (validationError) return { error: validationError };

  try {
    const existing = await getSingleton(config.type);
    const doc = formDataToDocument(config, formData, existing ?? undefined);
    if (existing) {
      await patchDocument(existing._id as string, doc);
    } else {
      await createDocument(config.type, doc);
    }
  } catch (err) {
    console.error(`[admin_singleton_save_failed:${config.type}]`, err);
    return { error: "Could not save — please try again." };
  }

  revalidatePath(adminBasePath(config));
  return { success: true };
}
