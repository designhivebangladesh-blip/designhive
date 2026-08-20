"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { inputClass, labelClass } from "./ui";

interface SocialLink {
  platform: string;
  url: string;
}

const PLATFORMS = [
  { title: "Twitter / X", value: "twitter" },
  { title: "Instagram", value: "instagram" },
  { title: "LinkedIn", value: "linkedin" },
  { title: "Facebook", value: "facebook" },
  { title: "YouTube", value: "youtube" },
  { title: "Behance", value: "behance" },
  { title: "Dribbble", value: "dribbble" },
];

export function SocialLinksField({
  name,
  label,
  initialValue = [],
}: {
  name: string;
  label: string;
  initialValue?: SocialLink[];
}) {
  const [links, setLinks] = useState<SocialLink[]>(initialValue.length ? initialValue : []);

  function update(index: number, patch: Partial<SocialLink>) {
    setLinks((prev) => prev.map((l, i) => (i === index ? { ...l, ...patch } : l)));
  }

  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input type="hidden" name={name} value={JSON.stringify(links.filter((l) => l.platform && l.url))} />

      <div className="space-y-2">
        {links.map((link, i) => (
          <div key={i} className="flex items-center gap-2">
            <select
              className={`${inputClass} w-40`}
              value={link.platform}
              onChange={(e) => update(i, { platform: e.target.value })}
            >
              <option value="">Platform…</option>
              {PLATFORMS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.title}
                </option>
              ))}
            </select>
            <input
              className={inputClass}
              placeholder="https://…"
              value={link.url}
              onChange={(e) => update(i, { url: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setLinks((prev) => prev.filter((_, idx) => idx !== i))}
              className="shrink-0 rounded-full p-1.5 text-parchment/50 hover:bg-white/10 hover:text-parchment"
              aria-label="Remove"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setLinks((prev) => [...prev, { platform: "", url: "" }])}
        className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-gold-300 hover:text-gold-200"
      >
        <Plus className="h-3.5 w-3.5" /> Add social link
      </button>
    </div>
  );
}
