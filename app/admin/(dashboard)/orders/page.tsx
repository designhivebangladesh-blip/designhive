import { writeClient } from "@/sanity/lib/writeClient";
import { allOrdersQuery, type OrderListItem } from "@/sanity/lib/adminQueries";
import { OrdersTable } from "@/components/admin/orders-table";
import { PageHeader } from "@/components/admin/ui";

export default async function OrdersPage() {
  const orders = await writeClient.fetch<OrderListItem[]>(allOrdersQuery);

  return (
    <div>
      <PageHeader title="Orders" description={`${orders.length} ${orders.length === 1 ? "order" : "orders"}`} />
      <OrdersTable orders={orders} />
    </div>
  );
}
