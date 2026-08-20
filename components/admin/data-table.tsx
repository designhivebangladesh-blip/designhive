"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import type { CollectionConfig } from "@/lib/admin/types";
import { getDeep } from "@/lib/admin/deep-path";
import { EmptyState, inputClass } from "./ui";

interface DataTableProps {
  config: CollectionConfig;
  documents: Record<string, unknown>[];
  hasFeaturedFilter: boolean;
}

function displayValue(doc: Record<string, unknown>, key: string): string {
  const value = getDeep(doc, key);
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object" && "current" in (value as Record<string, unknown>)) {
    return String((value as { current?: string }).current ?? "—");
  }
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  }
  if (typeof value === "object") return "—"; // e.g. unresolved reference — raw doc has only { _ref }
  return String(value);
}

export function DataTable({ config, documents, hasFeaturedFilter }: DataTableProps) {
  const [search, setSearch] = useState("");
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const filtered = useMemo(() => {
    let list = documents;
    if (featuredOnly) {
      list = list.filter((doc) => doc.featured === true);
    }
    if (search.trim()) {
      const term = search.trim().toLowerCase();
      list = list.filter((doc) =>
        config.searchFields.some((field) => {
          const value = getDeep(doc, field);
          return typeof value === "string" && value.toLowerCase().includes(term);
        })
      );
    }
    return list;
  }, [documents, search, featuredOnly, config.searchFields]);

  const basePath = `/admin/${config.path.join("/")}`;

  return (
    <div>
      {(config.searchFields.length > 0 || hasFeaturedFilter) && (
        <div className="mb-4 flex flex-wrap items-center gap-3">
          {config.searchFields.length > 0 && (
            <div className="relative w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-parchment/30" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search…"
                className={`${inputClass} pl-9`}
              />
            </div>
          )}
          {hasFeaturedFilter && (
            <label className="flex items-center gap-2 text-xs text-parchment/60">
              <input
                type="checkbox"
                checked={featuredOnly}
                onChange={(e) => setFeaturedOnly(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-gold-400/30 bg-ink text-gold-400"
              />
              Featured only
            </label>
          )}
          <span className="text-xs text-parchment/35">
            {filtered.length} of {documents.length}
          </span>
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          title={documents.length === 0 ? `No ${config.pluralLabel.toLowerCase()} yet` : "No matches"}
          description={documents.length === 0 ? `Create your first one to get started.` : "Try a different search term."}
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gold-400/15">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gold-400/15 bg-white/[0.02] text-xs uppercase tracking-wide text-parchment/40">
                {config.listColumns.map((col) => (
                  <th key={col.key} className="px-4 py-3 font-medium">
                    {col.label}
                  </th>
                ))}
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc) => (
                <tr key={doc._id as string} className="border-b border-gold-400/[0.06] last:border-0 hover:bg-white/[0.02]">
                  {config.listColumns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-parchment/80">
                      {displayValue(doc, col.key)}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <Link href={`${basePath}/${doc._id}`} className="text-xs font-semibold text-gold-300 hover:text-gold-200">
                      Edit →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
