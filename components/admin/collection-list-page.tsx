import { notFound } from "next/navigation";
import type { CollectionConfig } from "@/lib/admin/types";
import { listDocuments } from "@/sanity/lib/adminCrud";
import { DataTable } from "./data-table";
import { PageHeader, LinkButton } from "./ui";

export async function CollectionListPage({ config }: { config: CollectionConfig }) {
  if (!config.adminManaged) notFound();
  const documents = await listDocuments(config);
  const basePath = `/admin/${config.path.join("/")}`;
  const hasFeaturedFilter = config.fields.some((f) => f.name === "featured" && f.type === "boolean");

  return (
    <div>
      <PageHeader
        title={config.pluralLabel}
        description={`${documents.length} ${documents.length === 1 ? "item" : "items"}`}
        action={<LinkButton href={`${basePath}/new`}>+ New {config.label}</LinkButton>}
      />
      <DataTable config={config} documents={documents} hasFeaturedFilter={hasFeaturedFilter} />
    </div>
  );
}
