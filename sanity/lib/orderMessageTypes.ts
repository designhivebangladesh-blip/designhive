/**
 * Pulled out of adminQueries.ts deliberately: that file imports `groq`
 * from "next-sanity" to tag its query strings, and gets imported (for
 * just the pieces below) by Client Components — orders-table.tsx,
 * messages-inbox.tsx, order-detail-form.tsx. Bundling the full
 * `next-sanity` module graph into the browser for the sake of an array
 * of status labels would be wasteful at best; this file has zero
 * dependencies so there's nothing for the client bundler to worry about.
 */

export interface OrderListItem {
  _id: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  projectType?: string;
  budget?: string;
  status: string;
  submittedAt: string;
}

export interface OrderStatusCounts {
  new: number;
  in_review: number;
  in_progress: number;
  awaiting_client: number;
  completed: number;
  archived: number;
}

export interface MessageListItem {
  _id: string;
  name: string;
  email: string;
  subject?: string;
  read: boolean;
  submittedAt: string;
}

export interface DashboardCounts {
  totalPricingPlans: number;
  totalClients: number;
  totalTeamMembers: number;
  totalOrders: number;
  newOrders: number;
  unreadMessages: number;
}

/** Every status value the `order.status` schema field actually allows.
 * Note this is "archived", not "cancelled" — see the admin upgrade's
 * analysis notes for why that wasn't renamed. */
export const ORDER_STATUSES: { value: string; label: string }[] = [
  { value: "new", label: "New" },
  { value: "in_review", label: "In review" },
  { value: "in_progress", label: "In progress" },
  { value: "awaiting_client", label: "Awaiting client" },
  { value: "completed", label: "Completed" },
  { value: "archived", label: "Archived" },
];
