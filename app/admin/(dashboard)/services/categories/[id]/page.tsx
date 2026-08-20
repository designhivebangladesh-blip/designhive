import { CollectionFormPage } from "@/components/admin/collection-form-page";
import { findCollectionByType } from "@/lib/admin/collections";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const { id } = await params;
  const { created } = await searchParams;
  const config = findCollectionByType("serviceCategory")!;
  return <CollectionFormPage config={config} id={id} created={created === "1"} />;
}
