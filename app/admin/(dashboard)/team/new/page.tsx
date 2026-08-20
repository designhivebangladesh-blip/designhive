import { CollectionFormPage } from "@/components/admin/collection-form-page";
import { findCollectionByType } from "@/lib/admin/collections";

export default function Page() {
  const config = findCollectionByType("teamMember")!;
  return <CollectionFormPage config={config} />;
}
