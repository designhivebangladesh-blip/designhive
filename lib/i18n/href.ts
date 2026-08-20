import { locales, type Locale } from "@/lib/i18n/config";

/**
 * Prefixes an internal, root-relative link (e.g. "/quote", possibly
 * CMS-supplied via Sanity) with the current locale, so links keep
 * working after adding locale-prefixed routing. Leaves anchors
 * ("#work"), external URLs, and already-prefixed paths untouched.
 */
export function localizeHref(href: string, locale: Locale): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  if (locales.some((l) => href === `/${l}` || href.startsWith(`/${l}/`))) return href;
  return `/${locale}${href}`;
}
