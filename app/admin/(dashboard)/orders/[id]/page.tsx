import { notFound } from "next/navigation";
import { getDocument } from "@/sanity/lib/adminCrud";
import { deleteOrderAction } from "@/lib/admin/workflow-actions";
import { OrderDetailForm } from "@/components/admin/order-detail-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { PageHeader, Card } from "@/components/admin/ui";

interface OrderDoc {
  _id: string;
  _type: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  projectType?: string;
  budget?: string;
  details?: string;
  status: string;
  internalNotes?: string;
  submittedAt: string;
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = (await getDocument(id)) as OrderDoc | null;
  if (!order || order._type !== "order") notFound();

  return (
    <div>
      <PageHeader
        title={order.clientName}
        description={new Date(order.submittedAt).toLocaleString()}
        action={<DeleteButton action={deleteOrderAction.bind(null, id)} itemLabel={order.clientName} />}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <Card className="space-y-3 p-5">
          <DetailRow label="Email" value={order.clientEmail} />
          <DetailRow label="Phone" value={order.clientPhone} />
          <DetailRow label="Project type" value={order.projectType} />
          <DetailRow label="Budget" value={order.budget} />
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-parchment/50">Project details</p>
            <p className="whitespace-pre-wrap text-sm text-parchment/80">{order.details || "—"}</p>
          </div>
        </Card>

        <Card className="p-5">
          <OrderDetailForm id={id} order={{ status: order.status, internalNotes: order.internalNotes }} />
        </Card>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-parchment/50">{label}</p>
      <p className="text-sm text-parchment/85">{value || "—"}</p>
    </div>
  );
}
