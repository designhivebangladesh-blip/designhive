import { groq } from "next-sanity";
import type { OrderListItem, OrderStatusCounts, MessageListItem, DashboardCounts } from "./orderMessageTypes";
import { ORDER_STATUSES } from "./orderMessageTypes";

// Re-exported so existing server-side imports of these from
// "@/sanity/lib/adminQueries" keep working unchanged — the three Client
// Components that only need the status list/types import
// "@/sanity/lib/orderMessageTypes" directly instead (see that file's
// docstring for why: this module also imports "next-sanity" for `groq`,
// which isn't safe to pull into a browser bundle).
export type { OrderListItem, OrderStatusCounts, MessageListItem, DashboardCounts };
export { ORDER_STATUSES };

export const recentOrdersQuery = groq`
  *[_type == "order"] | order(submittedAt desc) [0...20]{
    _id,
    clientName,
    clientEmail,
    projectType,
    budget,
    status,
    submittedAt
  }
`;

export const orderStatusCountsQuery = groq`
  {
    "new": count(*[_type == "order" && status == "new"]),
    "in_review": count(*[_type == "order" && status == "in_review"]),
    "in_progress": count(*[_type == "order" && status == "in_progress"]),
    "awaiting_client": count(*[_type == "order" && status == "awaiting_client"]),
    "completed": count(*[_type == "order" && status == "completed"]),
    "archived": count(*[_type == "order" && status == "archived"])
  }
`;

export const recentMessagesQuery = groq`
  *[_type == "message"] | order(submittedAt desc) [0...10]{
    _id,
    name,
    email,
    subject,
    read,
    submittedAt
  }
`;

// --- Full list views for /admin/orders and /admin/messages (recentX above
// power the dashboard summary only, capped at 20/10). ---------------------

export const allOrdersQuery = groq`
  *[_type == "order"] | order(submittedAt desc){
    _id,
    clientName,
    clientEmail,
    clientPhone,
    projectType,
    budget,
    status,
    submittedAt
  }
`;

export const allMessagesQuery = groq`
  *[_type == "message"] | order(submittedAt desc){
    _id,
    name,
    email,
    subject,
    read,
    submittedAt
  }
`;

// --- Dashboard metrics (Phase 6) ------------------------------------------

export const dashboardCountsQuery = groq`
  {
    "totalPricingPlans": count(*[_type == "pricingPlan"]),
    "totalClients": count(*[_type == "client"]),
    "totalTeamMembers": count(*[_type == "teamMember"]),
    "totalOrders": count(*[_type == "order"]),
    "newOrders": count(*[_type == "order" && status == "new"]),
    "unreadMessages": count(*[_type == "message" && read != true])
  }
`;
