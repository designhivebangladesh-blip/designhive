import { writeClient } from "@/sanity/lib/writeClient";
import { allMessagesQuery, type MessageListItem } from "@/sanity/lib/adminQueries";
import { MessagesInbox } from "@/components/admin/messages-inbox";
import { PageHeader } from "@/components/admin/ui";

export default async function MessagesPage() {
  const messages = await writeClient.fetch<MessageListItem[]>(allMessagesQuery);
  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div>
      <PageHeader
        title="Messages"
        description={`${messages.length} total${unreadCount ? ` · ${unreadCount} unread` : ""}`}
      />
      <MessagesInbox messages={messages} />
    </div>
  );
}
