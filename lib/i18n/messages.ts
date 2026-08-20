import "server-only";
import type { Locale } from "@/lib/i18n/config";
import en from "@/messages/en.json";
import bn from "@/messages/bn.json";

const dictionaries = { en, bn } satisfies Record<Locale, typeof en>;

export type Messages = typeof en;

/**
 * Loads the static message dictionary for a locale. Both files are
 * bundled at build time (no runtime fetch), so this stays a plain,
 * synchronous lookup rather than the dynamic-import pattern used by
 * larger i18n setups — fine at this catalog's size and avoids an
 * extra async hop in every server component that calls it.
 */
export function getMessages(locale: Locale): Messages {
  return dictionaries[locale] ?? dictionaries[Object.keys(dictionaries)[0] as Locale];
}
