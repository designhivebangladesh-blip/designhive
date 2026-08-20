"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import type { OrderListItem } from "@/sanity/lib/orderMessageTypes";
import { ORDER_STATUSES } from "@/sanity/lib/orderMessageTypes";
import { EmptyState, inputClass, Badge } from "./ui";

const STATUS_LABEL = Object.fromEntries(ORDER_STATUSES.map((s) => [s.value, s.label]));

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function OrdersTable({ orders }: { orders: OrderListItem[] }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const filtered = useMemo(() => {
    let list = orders;
    if (status) list = list.filter((o) => o.status === status);
    if (search.trim()) {
      const term = search.trim().toLowerCase();
      list = list.filter(
        (o) =>
          o.clientName.toLowerCase().includes(term) ||
          o.clientEmail.toLowerCase().includes(term) ||
          (o.projectType ?? "").toLowerCase().includes(term)
      );
    }
    return list;
  }, [orders, search, status]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-parchment/30" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search client, email, project…" className={`${inputClass} pl-9`} />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={`${inputClass} w-48`}>
          <option value="">All statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <span className="text-xs text-parchment/35">
          {filtered.length} of {orders.length}
        </span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No orders match" description="Try clearing the search or status filter." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gold-400/15">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gold-400/15 bg-white/[0.02] text-xs uppercase tracking-wide text-parchment/40">
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Project</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Submitted</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order._id} className="border-b border-gold-400/[0.06] last:border-0 hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <p className="text-parchment">{order.clientName}</p>
                    <p className="text-xs text-parchment/50">{order.clientEmail}</p>
                  </td>
                  <td className="px-4 py-3 text-parchment/70">{order.projectType || "—"}</td>
                  <td className="px-4 py-3">
                    <Badge tone="gold">{STATUS_LABEL[order.status] ?? order.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-parchment/50">{formatDate(order.submittedAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/orders/${order._id}`} className="text-xs font-semibold text-gold-300 hover:text-gold-200">
                      Open →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
