"use client";

import { useActionState } from "react";
import type { FieldConfig } from "@/lib/admin/types";
import type { ActionState } from "@/lib/admin/actions";
import { getDeep } from "@/lib/admin/deep-path";
import { portableTextToPlainText } from "@/lib/admin/portable-text";
import { ImageUploadField, ImageGalleryField } from "./media-fields";
import { SocialLinksField } from "./social-links-field";
import { ErrorBanner, SuccessBanner, PrimaryButton, SecondaryButton, inputClass, labelClass } from "./ui";

export interface ReferenceOption {
  id: string;
  label: string;
}

interface RecordFormProps {
  fields: FieldConfig[];
  initialDoc?: Record<string, unknown>;
  referenceOptions: Record<string, ReferenceOption[]>;
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  submitLabel: string;
  cancelHref: string;
}

function toDateTimeLocal(value: unknown): string {
  if (typeof value !== "string" || !value) return "";
  // "2024-01-01T09:00:00.000Z" -> "2024-01-01T09:00"
  return value.slice(0, 16);
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 96);
}

export function RecordForm({
  fields,
  initialDoc = {},
  referenceOptions,
  action,
  submitLabel,
  cancelHref,
}: RecordFormProps) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, {});

  return (
    <form action={formAction} className="space-y-6">
      <ErrorBanner message={state.error} />
      <SuccessBanner message={state.success ? "Saved." : undefined} />

      {fields.map((field) => (
        <FieldRenderer key={field.name} field={field} initialDoc={initialDoc} referenceOptions={referenceOptions} />
      ))}

      <div className="flex items-center gap-3 border-t border-gold-400/10 pt-5">
        <PrimaryButton type="submit" disabled={pending}>
          {pending ? "Saving…" : submitLabel}
        </PrimaryButton>
        <SecondaryButton type="button" onClick={() => (window.location.href = cancelHref)}>
          Cancel
        </SecondaryButton>
      </div>
    </form>
  );
}

function FieldRenderer({
  field,
  initialDoc,
  referenceOptions,
}: {
  field: FieldConfig;
  initialDoc: Record<string, unknown>;
  referenceOptions: Record<string, ReferenceOption[]>;
}) {
  const value = getDeep(initialDoc, field.name);

  if (field.type === "group") {
    return (
      <fieldset className="rounded-xl border border-gold-400/10 p-4">
        <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-parchment/60">{field.title}</legend>
        <div className="space-y-4 pt-1">
          {(field.fields ?? []).map((sub) => (
            <FieldRenderer key={sub.name} field={sub} initialDoc={initialDoc} referenceOptions={referenceOptions} />
          ))}
        </div>
      </fieldset>
    );
  }

  const fieldId = `field-${field.name}`;
  const sourceId = field.slugSource ? `field-${field.slugSource}` : undefined;

  switch (field.type) {
    case "string":
    case "email":
      return (
        <div>
          <FieldLabel field={field} />
          <input
            id={fieldId}
            type={field.type === "email" ? "email" : "text"}
            name={field.name}
            defaultValue={typeof value === "string" ? value : ""}
            required={field.required}
            maxLength={field.maxLength}
            className={inputClass}
          />
        </div>
      );

    case "url":
      return (
        <div>
          <FieldLabel field={field} />
          <input
            type="url"
            name={field.name}
            defaultValue={typeof value === "string" ? value : ""}
            required={field.required}
            placeholder="https://"
            className={inputClass}
          />
        </div>
      );

    case "text":
      return (
        <div>
          <FieldLabel field={field} />
          <textarea
            name={field.name}
            defaultValue={typeof value === "string" ? value : ""}
            required={field.required}
            maxLength={field.maxLength}
            rows={field.rows ?? 3}
            className={inputClass}
          />
        </div>
      );

    case "richtext":
      return (
        <div>
          <FieldLabel field={field} />
          <textarea
            name={field.name}
            defaultValue={portableTextToPlainText(value)}
            required={field.required}
            rows={8}
            className={inputClass}
            placeholder="One paragraph per blank line."
          />
        </div>
      );

    case "number":
      return (
        <div>
          <FieldLabel field={field} />
          <input
            type="number"
            name={field.name}
            defaultValue={typeof value === "number" ? value : undefined}
            required={field.required}
            className={inputClass}
          />
        </div>
      );

    case "boolean":
      return (
        <label className="flex items-center gap-2 text-sm text-parchment/80">
          <input type="checkbox" name={field.name} defaultChecked={value === true} className="h-4 w-4 rounded border-gold-400/30 bg-ink text-gold-400" />
          {field.title}
        </label>
      );

    case "datetime":
      return (
        <div>
          <FieldLabel field={field} />
          <input
            type="datetime-local"
            name={field.name}
            defaultValue={toDateTimeLocal(value)}
            required={field.required}
            className={inputClass}
          />
        </div>
      );

    case "select":
      return (
        <div>
          <FieldLabel field={field} />
          <select name={field.name} defaultValue={typeof value === "string" ? value : ""} required={field.required} className={inputClass}>
            <option value="">Select…</option>
            {(field.options ?? []).map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.title}
              </option>
            ))}
          </select>
        </div>
      );

    case "tags":
      return (
        <div>
          <FieldLabel field={field} />
          <textarea
            name={field.name}
            defaultValue={Array.isArray(value) ? (value as string[]).join("\n") : ""}
            rows={3}
            placeholder="One per line"
            className={inputClass}
          />
        </div>
      );

    case "slug": {
      const current = value && typeof value === "object" ? (value as { current?: string }).current : "";
      return (
        <div>
          <FieldLabel field={field} />
          <div className="flex gap-2">
            <input
              id={fieldId}
              type="text"
              name={field.name}
              defaultValue={current ?? ""}
              required={field.required}
              className={inputClass}
            />
            {sourceId ? (
              <SecondaryButton
                type="button"
                className="shrink-0"
                onClick={() => {
                  const source = document.getElementById(sourceId) as HTMLInputElement | null;
                  const target = document.getElementById(fieldId) as HTMLInputElement | null;
                  if (source && target) target.value = slugify(source.value);
                }}
              >
                Generate
              </SecondaryButton>
            ) : null}
          </div>
        </div>
      );
    }

    case "reference": {
      const options = referenceOptions[field.referenceTo ?? ""] ?? [];
      const ref = value && typeof value === "object" ? (value as { _ref?: string })._ref : undefined;
      return (
        <div>
          <FieldLabel field={field} />
          <select name={field.name} defaultValue={ref ?? ""} required={field.required} className={inputClass}>
            <option value="">None</option>
            {options.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      );
    }

    case "referenceArray": {
      const options = referenceOptions[field.referenceTo ?? ""] ?? [];
      const refs = Array.isArray(value) ? (value as { _ref?: string }[]).map((r) => r._ref) : [];
      return (
        <div>
          <FieldLabel field={field} />
          <div className="flex max-h-48 flex-col gap-1 overflow-y-auto rounded-lg border border-gold-400/15 p-3">
            {options.length === 0 ? (
              <p className="text-xs text-parchment/40">Nothing to select yet.</p>
            ) : (
              options.map((opt) => (
                <label key={opt.id} className="flex items-center gap-2 text-sm text-parchment/80">
                  <input
                    type="checkbox"
                    name={field.name}
                    value={opt.id}
                    defaultChecked={refs.includes(opt.id)}
                    className="h-4 w-4 rounded border-gold-400/30 bg-ink text-gold-400"
                  />
                  {opt.label}
                </label>
              ))
            )}
          </div>
        </div>
      );
    }

    case "image":
      return (
        <ImageUploadField
          name={field.name}
          label={field.title}
          description={field.description}
          required={field.required}
          accept={field.accept}
          initialValue={value as never}
        />
      );

    case "imageArray":
      return (
        <ImageGalleryField
          name={field.name}
          label={field.title}
          description={field.description}
          initialValue={value as never}
        />
      );

    case "socialLinks":
      return <SocialLinksField name={field.name} label={field.title} initialValue={value as never} />;

    default:
      return null;
  }
}

function FieldLabel({ field }: { field: FieldConfig }) {
  return (
    <label htmlFor={`field-${field.name}`} className={labelClass}>
      {field.title}
      {field.required ? <span className="text-gold-400"> *</span> : null}
      {field.description ? <span className="ml-2 font-normal normal-case text-parchment/35">{field.description}</span> : null}
    </label>
  );
}
