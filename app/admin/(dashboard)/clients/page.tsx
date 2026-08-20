import { CollectionListPage } from "@/components/admin/collection-list-page";
import { findCollectionByType } from "@/lib/admin/collections";

export default function Page() {
  const config = findCollectionByType("client")!;
  return <CollectionListPage config={config} />;
}
