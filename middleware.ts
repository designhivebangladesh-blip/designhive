import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale, type Locale } from "@/lib/i18n/config";

/**
 * Runs on every request before it reaches a route/page. Owns two
 * things: locale routing (redirect "/" and any un-prefixed path to
 * "/<locale>/...") and the cross-cutting security response headers
 * that used to be this file's only job. Auth and rate-limiting for
 * individual routes still live in `lib/api/*`, composed inside their
 * own handlers — not here.
 */

const LOCALE_COOKIE = "NEXT_LOCALE";

// Routes that must never be locale-prefixed: the admin dashboard,
// Sanity Studio, and API routes all live outside app/[locale] and
// keep their own root layouts, auth flows, and response shapes.
function isExcludedPath(pathname: string): boolean {
  return (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/studio") ||
    pathname.startsWith("/api") ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    /\.[^/]+$/.test(pathname) // any other static asset (images, fonts, etc.)
  );
}

function pathnameHasLocale(pathname: string): boolean {
  return locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
}

function detectLocale(request: NextRequest): Locale {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookieLocale && (locales as readonly string[]).includes(cookieLocale)) {
    return cookieLocale as Locale;
  }

  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage) {
    const preferred = acceptLanguage
      .split(",")
      .map((part) => part.split(";")[0]?.trim().toLowerCase())
      .filter(Boolean);

    for (const lang of preferred) {
      const match = locales.find((locale) => lang === locale || lang?.startsWith(`${locale}-`));
      if (match) return match;
    }
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let response: NextResponse;

  if (isExcludedPath(pathname) || pathnameHasLocale(pathname)) {
    response = NextResponse.next();
  } else {
    // "/" -> "/bn" (or the detected/preferred locale); any other
    // un-prefixed path (e.g. "/quote") -> "/<locale>/quote", so every
    // existing route keeps working, just under a locale prefix.
    const locale = detectLocale(request);
    const suffix = pathname === "/" ? "" : pathname;
    const url = new URL(`/${locale}${suffix}${request.nextUrl.search}`, request.url);
    response = NextResponse.redirect(url);
  }

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  return response;
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
