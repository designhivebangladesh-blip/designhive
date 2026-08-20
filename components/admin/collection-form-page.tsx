import { notFound } from "next/navigation";
import type { CollectionConfig } from "@/lib/admin/types";
import { collectReferenceTypes } from "@/lib/admin/collections";
import { getDocument, getSingleton, listReferenceOptions } from "@/sanity/lib/adminCrud";
import { createRecordAction, updateRecordAction, upsertSingletonAction, deleteRecordAction } from "@/lib/admin/actions";
import { DeleteButton } from "./delete-button";
import { RecordForm, type ReferenceOption } from "./record-form";
import { PageHeader } from "./ui";

async function loadReferenceOptions(config: CollectionConfig): Promise<Record<string, ReferenceOption[]>> {
  const refTypes = collectReferenceTypes(config.fields);
  const entries = await Promise.all(
    refTypes.map(async ({ type, labelField }) => [type, await listReferenceOptions(type, labelField)] as const)
  );
  return Object.fromEntries(entries);
}

export async function CollectionFormPage({
  config,
  id,
  created,
}: {
  config: CollectionConfig;
  /** Present when editing an existing document; absent for "new". */
  id?: string;
  created?: boolean;
}) {
  if (!config.adminManaged) notFound();
  const basePath = `/admin/${config.path.join("/")}`;
  const referenceOptions = await loadReferenceOptions(config);

  if (config.singleton) {
    const doc = await getSingleton(config.type);
    return (
      <div>
        <PageHeader title={config.label} />
        <RecordForm
          fields={config.fields}
          initialDoc={doc ?? {}}
          referenceOptions={referenceOptions}
          action={upsertSingletonAction.bind(null, config.type)}
          submitLabel="Save"
          cancelHref={basePath}
        />
      </div>
    );
  }

  if (id) {
    const doc = await getDocument(id);
    if (!doc || doc._type !== config.type) notFound();

    return (
      <div>
        <PageHeader
          title={`Edit ${config.label}`}
          action={<DeleteButton action={deleteWithType(config.type, id)} itemLabel={String(doc[config.titleField] ?? "this item")} />}
        />
        {created ? (
          <p className="mb-4 rounded-xl border border-green-500/25 bg-green-950/30 px-4 py-3 text-sm text-green-200">
            {config.label} created.
          </p>
        ) : null}
        <RecordForm
          fields={config.fields}
          initialDoc={doc}
          referenceOptions={referenceOptions}
          action={updateWithType(config.type, id)}
          submitLabel="Save changes"
          cancelHref={basePath}
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={`New ${config.label}`} />
      <RecordForm
        fields={config.fields}
        referenceOptions={referenceOptions}
        action={createRecordAction.bind(null, config.type)}
        submitLabel="Create"
        cancelHref={basePath}
      />
    </div>
  );
}

// Small named wrappers purely so the bound server actions read clearly
// at the call site above.
function updateWithType(type: string, id: string) {
  return updateRecordAction.bind(null, type, id);
}
function deleteWithType(type: string, id: string) {
  return deleteRecordAction.bind(null, type, id);
}
