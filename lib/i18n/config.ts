/**
 * Single source of truth for supported locales. Import `locales` and
 * `Locale` instead of hardcoding "bn"/"en" strings anywhere else —
 * middleware.ts, app/[locale]/layout.tsx, and lib/i18n/messages.ts all
 * key off this file.
 */

export const locales = ["bn", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "bn";

export const localeNames: Record<Locale, string> = {
  bn: "বাংলা",
  en: "English",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
