"use client";

import { useActionState, useState } from "react";
import { Trash2 } from "lucide-react";
import type { ActionState } from "@/lib/admin/actions";
import { ErrorBanner } from "./ui";

export function DeleteButton({
  action,
  itemLabel,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  itemLabel: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, {});

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 px-3 py-1.5 text-xs font-semibold text-red-300/80 hover:border-red-500/40 hover:text-red-300"
      >
        <Trash2 className="h-3.5 w-3.5" /> Delete
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-red-500/25 bg-red-950/20 p-3">
      <ErrorBanner message={state.error} />
      <p className="mb-2 text-xs text-red-200">Delete &ldquo;{itemLabel}&rdquo;? This can&apos;t be undone.</p>
      <form action={formAction} className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-red-500/90 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-500 disabled:opacity-60"
        >
          {pending ? "Deleting…" : "Confirm delete"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="rounded-full border border-gold-400/20 px-3 py-1.5 text-xs text-parchment/70"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
