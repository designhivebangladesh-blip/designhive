"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { Search, Circle, CircleCheck } from "lucide-react";
import type { MessageListItem } from "@/sanity/lib/orderMessageTypes";
import { setMessageReadAction } from "@/lib/admin/workflow-actions";
import { EmptyState, inputClass, Badge } from "./ui";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function MessagesInbox({ messages }: { messages: MessageListItem[] }) {
  const [search, setSearch] = useState("");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    let list = messages;
    if (unreadOnly) list = list.filter((m) => !m.read);
    if (search.trim()) {
      const term = search.trim().toLowerCase();
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(term) ||
          m.email.toLowerCase().includes(term) ||
          (m.subject ?? "").toLowerCase().includes(term)
      );
    }
    return list;
  }, [messages, search, unreadOnly]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-parchment/30" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email, subject…" className={`${inputClass} pl-9`} />
        </div>
        <label className="flex items-center gap-2 text-xs text-parchment/60">
          <input type="checkbox" checked={unreadOnly} onChange={(e) => setUnreadOnly(e.target.checked)} className="h-3.5 w-3.5 rounded border-gold-400/30 bg-ink text-gold-400" />
          Unread only
        </label>
        <span className="text-xs text-parchment/35">
          {filtered.length} of {messages.length}
        </span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No messages match" description="Try clearing the search or filter." />
      ) : (
        <ul className="space-y-2">
          {filtered.map((message) => (
            <li
              key={message._id}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
                message.read ? "border-gold-400/10 bg-ink-soft/40" : "border-gold-400/25 bg-ink-soft"
              }`}
            >
              <button
                type="button"
                disabled={pending}
                onClick={() => startTransition(() => setMessageReadAction(message._id, !message.read))}
                aria-label={message.read ? "Mark unread" : "Mark read"}
                className="shrink-0 text-parchment/50 hover:text-gold-300 disabled:opacity-50"
              >
                {message.read ? <CircleCheck className="h-4 w-4" /> : <Circle className="h-4 w-4 text-gold-400" />}
              </button>

              <Link href={`/admin/messages/${message._id}`} className="min-w-0 flex-1">
                <p className="flex items-center gap-2 text-parchment">
                  {message.name}
                  {!message.read && <Badge tone="gold">New</Badge>}
                </p>
                <p className="truncate text-xs text-parchment/50">{message.subject || message.email}</p>
              </Link>

              <span className="shrink-0 text-xs text-parchment/40">{formatDate(message.submittedAt)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
