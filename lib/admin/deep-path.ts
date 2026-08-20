/**
 * Deliberately dependency-free (no Node core modules) so this can be
 * imported directly by Client Components (record-form.tsx, data-table.tsx
 * both read pre-filled/list values via `getDeep`) as well as server code,
 * without pulling anything Node-only into the browser bundle.
 */

export function setDeep(target: Record<string, unknown>, path: string, value: unknown) {
  const parts = path.split(".");
  let cursor = target;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    if (typeof cursor[key] !== "object" || cursor[key] === null || Array.isArray(cursor[key])) {
      cursor[key] = {};
    }
    cursor = cursor[key] as Record<string, unknown>;
  }
  cursor[parts[parts.length - 1]] = value;
}

/** Reads a (possibly dot-pathed) value back out of a raw Sanity document,
 * for pre-filling the edit form. */
export function getDeep(source: Record<string, unknown> | undefined, path: string): unknown {
  if (!source) return undefined;
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, source);
}
