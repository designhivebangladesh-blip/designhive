"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/admin/require-session";
import { patchDocument, deleteDocument } from "@/sanity/lib/adminCrud";
import { ORDER_STATUSES } from "@/sanity/lib/adminQueries";
import type { ActionState } from "@/lib/admin/actions";

const VALID_STATUSES = new Set(ORDER_STATUSES.map((s) => s.value));

export async function updateOrderAction(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdminSession();

  const status = formData.get("status");
  if (typeof status !== "string" || !VALID_STATUSES.has(status)) {
    return { error: "Invalid status." };
  }
  const internalNotes = formData.get("internalNotes");

  try {
    await patchDocument(id, {
      status,
      internalNotes: typeof internalNotes === "string" ? internalNotes : "",
    });
  } catch (err) {
    console.error(`[admin_order_update_failed:${id}]`, err);
    return { error: "Could not save — please try again." };
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteOrderAction(
  id: string,
  _prevState: ActionState,
  _formData: FormData
): Promise<ActionState> {
  await requireAdminSession();
  try {
    await deleteDocument(id);
  } catch (err) {
    console.error(`[admin_order_delete_failed:${id}]`, err);
    return { error: "Could not delete — please try again." };
  }
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  redirect("/admin/orders");
}

export async function setMessageReadAction(id: string, read: boolean): Promise<void> {
  await requireAdminSession();
  await patchDocument(id, { read });
  revalidatePath("/admin/messages");
  revalidatePath(`/admin/messages/${id}`);
  revalidatePath("/admin");
}

export async function deleteMessageAction(
  id: string,
  _prevState: ActionState,
  _formData: FormData
): Promise<ActionState> {
  await requireAdminSession();
  try {
    await deleteDocument(id);
  } catch (err) {
    console.error(`[admin_message_delete_failed:${id}]`, err);
    return { error: "Could not delete — please try again." };
  }
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
  redirect("/admin/messages");
}
