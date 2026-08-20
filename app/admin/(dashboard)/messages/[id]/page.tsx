import { notFound } from "next/navigation";
import { getDocument } from "@/sanity/lib/adminCrud";
import { deleteMessageAction } from "@/lib/admin/workflow-actions";
import { DeleteButton } from "@/components/admin/delete-button";
import { MarkAsReadOnView } from "@/components/admin/mark-as-read-on-view";
import { PageHeader, Card, LinkButton } from "@/components/admin/ui";

interface MessageDoc {
  _id: string;
  _type: string;
  name: string;
  email: string;
  subject?: string;
  body: string;
  read: boolean;
  submittedAt: string;
}

export default async function MessageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const message = (await getDocument(id)) as MessageDoc | null;
  if (!message || message._type !== "message") notFound();

  // Marking read happens client-side on actual view (see MarkAsReadOnView)
  // rather than as a side effect of this Server Component's render, since
  // Next.js may prefetch this route from the inbox list before the user
  // really opens it.

  return (
    <div>
      <MarkAsReadOnView id={id} alreadyRead={message.read} />
      <PageHeader
        title={message.subject || `Message from ${message.name}`}
        description={new Date(message.submittedAt).toLocaleString()}
        action={<DeleteButton action={deleteMessageAction.bind(null, id)} itemLabel={message.subject || message.name} />}
      />

      <Card className="space-y-4 p-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-parchment/50">From</p>
          <p className="text-sm text-parchment/85">
            {message.name} &lt;{message.email}&gt;
          </p>
        </div>
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-parchment/50">Message</p>
          <p className="whitespace-pre-wrap text-sm text-parchment/80">{message.body}</p>
        </div>
        <LinkButton href={`mailto:${message.email}${message.subject ? `?subject=${encodeURIComponent(`Re: ${message.subject}`)}` : ""}`}>
          Reply by email
        </LinkButton>
      </Card>
    </div>
  );
}
