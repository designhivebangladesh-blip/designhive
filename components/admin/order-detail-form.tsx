"use client";

import { useActionState } from "react";
import { updateOrderAction } from "@/lib/admin/workflow-actions";
import { ORDER_STATUSES } from "@/sanity/lib/orderMessageTypes";
import { ErrorBanner, SuccessBanner, PrimaryButton, inputClass, labelClass } from "./ui";

interface OrderDoc {
  status: string;
  internalNotes?: string;
}

export function OrderDetailForm({ id, order }: { id: string; order: OrderDoc }) {
  const action = updateOrderAction.bind(null, id);
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-4">
      <ErrorBanner message={state.error} />
      <SuccessBanner message={state.success ? "Saved." : undefined} />

      <div>
        <label className={labelClass}>Status</label>
        <select name="status" defaultValue={order.status} className={inputClass}>
          {ORDER_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>Internal notes</label>
        <p className="mb-1.5 text-xs text-parchment/40">Not shown to the client — team-only.</p>
        <textarea name="internalNotes" defaultValue={order.internalNotes ?? ""} rows={5} className={inputClass} />
      </div>

      <PrimaryButton type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save"}
      </PrimaryButton>
    </form>
  );
}
