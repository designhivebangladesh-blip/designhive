import { CollectionListPage } from "@/components/admin/collection-list-page";
import { findCollectionByType } from "@/lib/admin/collections";

export default function Page() {
  const config = findCollectionByType("service")!;
  return <CollectionListPage config={config} />;
}
