"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronDown, ArrowRight, Menu, X, Globe } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/messages";
import type { NavItemResult, CtaButtonResult } from "@/sanity/lib/queries";
import { useQuoteModal } from "./QuoteModalProvider";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface HeaderProps {
  logoUrl?: string;
  siteName?: string;
  locale: Locale;
  messages: Messages;
  /** Sanity-managed nav links. Falls back to i18n messages when absent. */
  navigation?: NavItemResult[];
  /** Sanity-managed header CTA. Falls back to i18n "Get Quote" when absent. */
  headerCta?: CtaButtonResult;
}

// Maps an anchor href (e.g. "#services") to the section id used by the
// IntersectionObserver so active highlighting works regardless of source.
function hrefToSectionId(href: string): string {
  return href.startsWith("#") ? href.slice(1) : href;
}

// Determine which anchors reveal a sub-menu.
const DROPDOWN_ANCHORS = new Set(["#services"]);

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function Header({
  logoUrl = "/logo-icon.png",
  siteName = "Designhive",
  locale,
  messages,
  navigation,
  headerCta,
}: HeaderProps) {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("home");
  const [scrolled, setScrolled] = useState(false);

  const mobileNavRef = useRef<HTMLDivElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const otherLocale: Locale = locale === "bn" ? "en" : "bn";
  const { open: openQuoteModal } = useQuoteModal();

  // ---------------------------------------------------------------------------
  // Locale-aware anchor resolution — fixes the Portfolio/Work nav bug.
  // On the homepage, section anchors like "#work" scroll in place. On any
  // other route (blog, portfolio, quote, etc.) there is no matching element
  // on the page, so a bare "#work" href was a silent no-op. Off the
  // homepage we now route through `/{locale}#work`, which Next.js
  // navigates to and then scrolls to the target section once mounted.
  // ---------------------------------------------------------------------------
  const pathname = usePathname();
  const isHomePage = pathname === `/${locale}` || pathname === `/${locale}/`;

  function resolveHref(href: string): string {
    if (!href.startsWith("#")) return href;
    return isHomePage ? href : `/${locale}${href}`;
  }

  // ---------------------------------------------------------------------------
  // Build nav links — prefer Sanity data, fall back to i18n messages
  // ---------------------------------------------------------------------------

  const defaultNavLinks: NavItemResult[] = [
    { label: messages.nav.home, href: "#home" },
    { label: messages.nav.work, href: "#work" },
    { label: messages.nav.services, href: "#services" },
    { label: messages.nav.pricing, href: "#pricing" },
    { label: messages.nav.about, href: "#about" },
    { label: messages.nav.blog, href: "#blog" },
    { label: messages.nav.contact, href: "#contact" },
  ];

  const navLinks: NavItemResult[] =
    navigation && navigation.length > 0 ? navigation : defaultNavLinks;

  const ctaLabel = headerCta?.label || messages.nav.getQuote;

  // ---------------------------------------------------------------------------
  // Scroll shadow
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ---------------------------------------------------------------------------
  // Active section via IntersectionObserver
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const sectionIds = navLinks.map((l) => hrefToSectionId(l.href));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -50% 0px", threshold: 0 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navLinks.length]);

  // ---------------------------------------------------------------------------
  // Mobile drawer — close on Escape & trap focus
  // ---------------------------------------------------------------------------

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    // Return focus to toggle after drawer closes
    setTimeout(() => mobileToggleRef.current?.focus(), 50);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobile();

      // Focus trap
      if (e.key === "Tab" && mobileNavRef.current) {
        const focusable = Array.from(
          mobileNavRef.current.querySelectorAll<HTMLElement>(
            'a[href], button, [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => !el.hasAttribute("disabled"));

        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    // Move focus into drawer
    const firstFocusable = mobileNavRef.current?.querySelector<HTMLElement>(
      "a, button"
    );
    firstFocusable?.focus();

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen, closeMobile]);

  // Prevent body scroll while mobile nav is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Close services dropdown when clicking outside
  useEffect(() => {
    if (!servicesOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [servicesOpen]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b border-gold-400/15 bg-ink/80 backdrop-blur-md transition-shadow duration-300 ${
          scrolled ? "shadow-[0_4px_24px_rgba(0,0,0,0.45)]" : ""
        }`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
          {/* ---- Logo ---- */}
          <Link
            href={resolveHref("#home")}
            className="hover-zoom-sm flex items-center gap-2.5"
            aria-label={`${siteName} – go to homepage`}
          >
            <Image
              src={logoUrl}
              alt={`${siteName} logo`}
              width={36}
              height={36}
              priority
              className="h-9 w-9 shrink-0"
            />
            <span className="font-display text-xl font-semibold tracking-tight text-parchment">
              {siteName}
            </span>
          </Link>

          {/* ---- Desktop Navigation ---- */}
          <nav
            className="hidden items-center gap-8 lg:flex"
            aria-label="Primary navigation"
          >
            {navLinks.map((link) => {
              const sectionId = hrefToSectionId(link.href);
              const isActive = activeSection === sectionId;
              const hasDropdown = DROPDOWN_ANCHORS.has(link.href);

              if (hasDropdown) {
                return (
                  <div
                    key={link.href}
                    className="relative"
                    ref={dropdownRef}
                    onMouseEnter={() => setServicesOpen(true)}
                    onMouseLeave={() => setServicesOpen(false)}
                  >
                    <Link
                      href={resolveHref(link.href)}
                      className={`hover-zoom-sm flex items-center gap-1 text-sm font-medium transition-colors ${
                        isActive
                          ? "font-semibold text-gold-300"
                          : "text-parchment/85 hover:text-gold-300"
                      }`}
                      aria-expanded={servicesOpen}
                      aria-haspopup="listbox"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setServicesOpen((v) => !v);
                        }
                        if (e.key === "Escape") setServicesOpen(false);
                      }}
                    >
                      {link.label}
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform duration-200 ${
                          servicesOpen ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                      />
                    </Link>

                    {/* Services Dropdown */}
                    <div
                      role="listbox"
                      aria-label="Services"
                      className={`absolute left-1/2 top-full w-56 -translate-x-1/2 pt-3 transition-all duration-200 ${
                        servicesOpen
                          ? "pointer-events-auto translate-y-0 opacity-100"
                          : "pointer-events-none -translate-y-1 opacity-0"
                      }`}
                    >
                      <div className="rounded-2xl border border-gold-400/20 bg-ink-soft/95 p-2 shadow-gold-lg backdrop-blur-md">
                        {messages.serviceLinks.map((s) => (
                          <Link
                            key={s}
                            href={resolveHref("#services")}
                            role="option"
                            aria-selected="false"
                            className="hover-zoom-sm block rounded-xl px-3 py-2 text-sm text-parchment/80 hover:bg-gold-400/10 hover:text-gold-200 focus:outline-none focus:ring-1 focus:ring-gold-400/40"
                          >
                            {s}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={resolveHref(link.href)}
                  className={`hover-zoom-sm text-sm font-medium transition-colors ${
                    isActive
                      ? "border-b-2 border-gold-400/60 pb-0.5 font-semibold text-gold-300"
                      : "text-parchment/85 hover:text-gold-300"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* ---- Desktop Actions ---- */}
          <div className="hidden items-center gap-3 lg:flex">
            {/* Language switcher */}
            <Link
              href={`/${otherLocale}`}
              aria-label={messages.language.switchTo}
              title={messages.language.switchTo}
              className="hover-zoom-sm flex h-9 items-center gap-1.5 rounded-full border border-gold-400/25 px-3 text-xs font-semibold text-gold-300 transition-colors hover:border-gold-400/50"
            >
              <Globe className="h-3.5 w-3.5" aria-hidden="true" />
              {otherLocale.toUpperCase()}
            </Link>

            {/* Primary CTA — opens the project inquiry modal instead of navigating to /quote */}
            <button
              type="button"
              onClick={openQuoteModal}
              className="hover-zoom-sm group flex items-center gap-2 rounded-full bg-gold-gradient px-5 py-2.5 text-sm font-semibold text-ink shadow-gold"
            >
              {ctaLabel}
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </button>
          </div>

          {/* ---- Mobile Toggle ---- */}
          <button
            ref={mobileToggleRef}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gold-400/25 text-gold-300 transition-colors hover:border-gold-400/50 lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
          >
            {mobileOpen ? (
              <X className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Menu className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </header>

      {/* ---- Mobile Slide-over Overlay ---- */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-ink/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
        onClick={closeMobile}
      />

      {/* Drawer panel */}
      <div
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        ref={mobileNavRef}
        className={`fixed inset-y-0 right-0 z-50 flex w-80 flex-col border-l border-gold-400/15 bg-ink shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex h-20 items-center justify-between border-b border-gold-400/10 px-6">
          <span className="font-display text-base font-semibold text-parchment">
            {siteName}
          </span>
          <button
            onClick={closeMobile}
            aria-label="Close navigation menu"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gold-400/25 text-gold-300 hover:border-gold-400/50"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Nav links */}
        <nav
          className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-6"
          aria-label="Mobile navigation links"
        >
          {navLinks.map((link) => {
            const sectionId = hrefToSectionId(link.href);
            const isActive = activeSection === sectionId;

            return (
              <Link
                key={link.href}
                href={resolveHref(link.href)}
                className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-gold-400/15 font-semibold text-gold-300"
                    : "text-parchment/85 hover:bg-gold-400/8 hover:text-gold-300"
                }`}
                onClick={closeMobile}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Divider */}
          <div className="my-3 border-t border-gold-400/10" />

          {/* Language switcher */}
          <Link
            href={`/${otherLocale}`}
            className="flex items-center justify-center gap-2 rounded-xl border border-gold-400/25 px-5 py-2.5 text-sm font-semibold text-gold-300 transition-colors hover:border-gold-400/50"
            onClick={closeMobile}
          >
            <Globe className="h-3.5 w-3.5" aria-hidden="true" />
            {messages.language.switchTo}
          </Link>

          {/* Primary CTA — opens the project inquiry modal instead of navigating to /quote */}
          <button
            type="button"
            onClick={() => {
              closeMobile();
              openQuoteModal();
            }}
            className="mt-2 flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-gold-gradient px-5 py-3 text-sm font-semibold text-ink shadow-gold"
          >
            {ctaLabel}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </nav>
      </div>
    </>
  );
}
