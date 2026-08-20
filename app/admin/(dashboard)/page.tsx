import Link from "next/link";
import { writeClient } from "@/sanity/lib/writeClient";
import {
  recentOrdersQuery,
  orderStatusCountsQuery,
  recentMessagesQuery,
  dashboardCountsQuery,
  ORDER_STATUSES,
  type OrderListItem,
  type OrderStatusCounts,
  type MessageListItem,
  type DashboardCounts,
} from "@/sanity/lib/adminQueries";
import { Badge, Card } from "@/components/admin/ui";

const STATUS_LABELS = Object.fromEntries(ORDER_STATUSES.map((s) => [s.value, s.label]));

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const METRIC_TILES: { key: keyof DashboardCounts; label: string; href: string }[] = [
  { key: "totalPricingPlans", label: "Pricing plans", href: "/admin/pricing" },
  { key: "totalClients", label: "Clients & brands", href: "/admin/clients" },
  { key: "totalTeamMembers", label: "Team members", href: "/admin/team" },
  { key: "totalOrders", label: "Orders", href: "/admin/orders" },
  { key: "newOrders", label: "New orders", href: "/admin/orders" },
  { key: "unreadMessages", label: "Unread messages", href: "/admin/messages" },
];

export default async function AdminDashboardPage() {
  const [orders, statusCounts, messages, counts] = await Promise.all([
    writeClient.fetch<OrderListItem[]>(recentOrdersQuery),
    writeClient.fetch<OrderStatusCounts>(orderStatusCountsQuery),
    writeClient.fetch<MessageListItem[]>(recentMessagesQuery),
    writeClient.fetch<DashboardCounts>(dashboardCountsQuery),
  ]);

  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-parchment/50">Overview</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {METRIC_TILES.map((tile) => (
            <Link key={tile.key} href={tile.href}>
              <Card className="px-4 py-3 transition hover:border-gold-400/35">
                <p className="text-2xl font-semibold text-gold-200">{counts[tile.key]}</p>
                <p className="mt-1 text-xs text-parchment/50">{tile.label}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-parchment/50">Order pipeline</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {ORDER_STATUSES.map((status) => (
            <div key={status.value} className="rounded-xl border border-gold-400/15 bg-ink-soft px-4 py-3">
              <p className="text-2xl font-semibold text-gold-200">
                {statusCounts[status.value as keyof OrderStatusCounts] ?? 0}
              </p>
              <p className="mt-1 text-xs text-parchment/50">{status.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-parchment/50">Recent orders</h2>
          <Link href="/admin/orders" className="text-xs font-semibold text-gold-300 hover:text-gold-200">
            View all →
          </Link>
        </div>
        {orders.length === 0 ? (
          <p className="mt-4 text-sm text-parchment/50">
            No orders yet — they&apos;ll appear here as quote requests come in.
          </p>
        ) : (
          <div className="mt-4 overflow-hidden rounded-xl border border-gold-400/15">
            <table className="w-full text-left text-sm">
              <thead className="bg-ink-soft text-xs uppercase tracking-wide text-parchment/50">
                <tr>
                  <th className="px-4 py-3 font-medium">Client</th>
                  <th className="px-4 py-3 font-medium">Project</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-400/10">
                {orders.map((order) => (
                  <tr key={order._id} className="cursor-pointer hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <Link href={`/admin/orders/${order._id}`} className="block">
                        <p className="text-parchment">{order.clientName}</p>
                        <p className="text-xs text-parchment/50">{order.clientEmail}</p>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-parchment/70">{order.projectType || "—"}</td>
                    <td className="px-4 py-3">
                      <Badge tone="gold">{STATUS_LABELS[order.status] ?? order.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-parchment/50">{formatDate(order.submittedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-parchment/50">Recent messages</h2>
          <Link href="/admin/messages" className="text-xs font-semibold text-gold-300 hover:text-gold-200">
            View all →
          </Link>
        </div>
        {messages.length === 0 ? (
          <p className="mt-4 text-sm text-parchment/50">No messages yet.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {messages.map((message) => (
              <li key={message._id}>
                <Link
                  href={`/admin/messages/${message._id}`}
                  className="flex items-center justify-between rounded-xl border border-gold-400/15 bg-ink-soft px-4 py-3 hover:border-gold-400/30"
                >
                  <div>
                    <p className="flex items-center gap-2 text-parchment">
                      {message.name}
                      {!message.read && <Badge tone="gold">New</Badge>}
                    </p>
                    <p className="text-xs text-parchment/50">{message.subject || message.email}</p>
                  </div>
                  <span className="text-xs text-parchment/40">{formatDate(message.submittedAt)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
