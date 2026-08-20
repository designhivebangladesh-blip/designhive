import Image from "next/image";
import Link from "next/link";
import {
  Twitter,
  Instagram,
  Linkedin,
  Facebook,
  Youtube,
  Github,
  Globe,
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { sanityFetch } from "@/sanity/lib/client";
import { cloudinaryUrl } from "@/sanity/lib/image";
import {
  contactInfoQuery,
  siteSettingsQuery,
  type ContactInfoResult,
  type SiteSettingsResult,
} from "@/sanity/lib/queries";
import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/messages";

const SOCIAL_ICON_MAP: Record<string, LucideIcon> = {
  twitter: Twitter,
  x: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  facebook: Facebook,
  youtube: Youtube,
  github: Github,
  website: Globe,
};

const FALLBACK_CONTACT: ContactInfoResult = {
  email: "designhivebangladesh@gmail.com",
  phone: "+8801408388029",
  location: "Dhaka, Bangladesh",
  socialLinks: [
    { platform: "twitter", url: "https://twitter.com" },
    { platform: "instagram", url: "https://instagram.com" },
    { platform: "linkedin", url: "https://linkedin.com" },
  ],
};

const DEFAULT_FOOTER_COLUMNS = [
  {
    title: "Studio",
    links: [
      { label: "Services", href: "#services" },
      { label: "Portfolio", href: "#portfolio" },
      { label: "Pricing", href: "#pricing" },
      { label: "Blog", href: "#blog" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#about" },
      { label: "Testimonials", href: "#testimonials" },
      { label: "FAQ", href: "#faq" },
      { label: "Get a Quote", href: "/quote" },
    ],
  },
];

const DEFAULT_LEGAL_LINKS = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
];

async function getFooterData() {
  try {
    const [contactInfo, siteSettings] = await Promise.all([
      sanityFetch<ContactInfoResult | null>({
        query: contactInfoQuery,
        tags: ["contactInfo"],
      }),
      sanityFetch<SiteSettingsResult | null>({
        query: siteSettingsQuery,
        tags: ["siteSettings"],
      }),
    ]);
    return { contactInfo, siteSettings };
  } catch (error) {
    console.error("[footer_fetch_error]", error);
    return { contactInfo: null, siteSettings: null };
  }
}

interface FooterProps {
  locale: Locale;
  messages: Messages;
}

export default async function Footer({ locale, messages: _messages }: FooterProps) {
  const { contactInfo, siteSettings } = await getFooterData();

  const email = contactInfo?.email ?? FALLBACK_CONTACT.email;
  const phone = contactInfo?.phone ?? FALLBACK_CONTACT.phone;
  const location = contactInfo?.location ?? FALLBACK_CONTACT.location;
  const address = contactInfo?.address;
  const socialLinks = contactInfo?.socialLinks?.length
    ? contactInfo.socialLinks
    : FALLBACK_CONTACT.socialLinks!;

  const logoUrl = siteSettings?.logoIcon
    ? cloudinaryUrl(siteSettings.logoIcon, { width: 80, height: 80, crop: "fill" })
    : "/logo-icon.png";
  const siteName = siteSettings?.siteName ?? "Designhive";
  const tagline = siteSettings?.tagline ?? "Digital Design & Development Studio";
  const footerStatement =
    siteSettings?.footerStatement ??
    "We craft high-performance digital experiences for ambitious founders — where design meets strategy, and brand meets code.";
  const copyrightText = siteSettings?.copyrightText ?? "All rights reserved.";
  const navColumns = siteSettings?.footerNavigation?.length
    ? siteSettings.footerNavigation
    : DEFAULT_FOOTER_COLUMNS;
  const legalLinks = siteSettings?.legalLinks?.length
    ? siteSettings.legalLinks
    : DEFAULT_LEGAL_LINKS;

  const year = new Date().getFullYear();

  return (
    <footer
      id="footer"
      aria-label="Site footer"
      className="relative overflow-hidden border-t border-gold-400/10 bg-ink pb-8 pt-24"
    >
      {/* Ambient background glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-15%] top-0 h-[40rem] w-[40rem] rounded-full bg-gold-500/5 blur-[160px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-10%] bottom-0 h-[30rem] w-[30rem] rounded-full bg-gold-300/5 blur-[130px]"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">

        {/* ── Top Row: Brand Block + Nav Columns + Contact ── */}
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1.6fr_repeat(2,1fr)_1.2fr]">

          {/* Brand Block */}
          <div>
            {/* Logo */}
            <Link
              href={`/${locale}`}
              aria-label={`${siteName} — Home`}
              className="group inline-flex items-center gap-3 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gold-400/20 bg-ink-soft shadow-gold">
                <Image
                  src={logoUrl}
                  alt=""
                  aria-hidden="true"
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain"
                />
              </div>
              <div>
                <span className="block font-display text-lg font-semibold leading-none text-parchment">
                  {siteName}
                </span>
                <span className="block font-mono text-[10px] uppercase tracking-widest text-gold-400/70">
                  {tagline}
                </span>
              </div>
            </Link>

            {/* Brand statement */}
            <p className="mt-6 max-w-[300px] text-sm leading-relaxed text-parchment/55">
              {footerStatement}
            </p>

            {/* Social Icons */}
            <div className="mt-8 flex flex-wrap items-center gap-3" role="list" aria-label="Social media links">
              {socialLinks.map((social) => {
                const Icon = SOCIAL_ICON_MAP[social.platform.toLowerCase()] ?? Globe;
                const label = `Visit our ${social.platform} page (opens in new tab)`;
                return (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    role="listitem"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-gold-400/20 bg-ink-soft text-gold-300 transition-all duration-300 hover:border-gold-400/60 hover:bg-gold-400/10 hover:text-gold-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Dynamic Navigation Columns */}
          {navColumns.map((col) => (
            <nav key={col.title} aria-label={`${col.title} links`}>
              <h3 className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-gold-400">
                {col.title}
              </h3>
              <ul className="mt-5 space-y-3" role="list">
                {col.links.map((link) => (
                  <li key={link.label} role="listitem">
                    <Link
                      href={link.href.startsWith("/") && !link.href.startsWith(`/${locale}`)
                        ? `/${locale}${link.href}`
                        : link.href}
                      className="group inline-flex items-center gap-1 text-sm text-parchment/55 transition-colors duration-300 hover:text-gold-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink rounded-sm"
                    >
                      <span>{link.label}</span>
                      {link.href.startsWith("http") && (
                        <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-300 group-hover:opacity-100" aria-hidden="true" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Contact Column */}
          <div>
            <h3 className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-gold-400">
              Contact
            </h3>
            <ul className="mt-5 space-y-4" role="list">
              <li role="listitem">
                <a
                  href={`mailto:${email}`}
                  className="group flex items-start gap-2.5 text-sm text-parchment/55 transition-colors duration-300 hover:text-gold-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink rounded-sm"
                  aria-label={`Send email to ${email}`}
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-400/60 transition-colors group-hover:text-gold-300" aria-hidden="true" />
                  <span className="break-all">{email}</span>
                </a>
              </li>
              <li role="listitem">
                <a
                  href={`tel:${phone}`}
                  className="group flex items-start gap-2.5 text-sm text-parchment/55 transition-colors duration-300 hover:text-gold-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink rounded-sm"
                  aria-label={`Call us at ${phone}`}
                >
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-400/60 transition-colors group-hover:text-gold-300" aria-hidden="true" />
                  <span>{phone}</span>
                </a>
              </li>
              <li role="listitem">
                <div className="flex items-start gap-2.5 text-sm text-parchment/55">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400/60" aria-hidden="true" />
                  <span>{address ?? location}</span>
                </div>
              </li>
              {contactInfo?.openingHours?.map((oh) => (
                <li key={oh.days} role="listitem" className="pl-6 text-xs text-parchment/35">
                  <span className="text-parchment/50">{oh.days}:</span>{" "}
                  <span>{oh.hours}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="mt-16 border-t border-gold-400/10" />

        {/* ── Bottom Bar: Copyright + Legal ── */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-parchment/35">
            &copy; {year}{" "}
            <span className="text-parchment/50">{siteName}</span>.{" "}
            {copyrightText}
          </p>

          <nav aria-label="Legal links">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2" role="list">
              {legalLinks.map((link) => (
                <li key={link.label} role="listitem">
                  <Link
                    href={link.href}
                    className="text-xs text-parchment/35 transition-colors duration-300 hover:text-gold-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink rounded-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* ── Watermark ── */}
        <p className="mt-8 text-center font-display text-[10px] uppercase tracking-[0.35em] text-parchment/15">
          Crafted with care · {siteName} Studio · Dhaka, Bangladesh
        </p>
      </div>
    </footer>
  );
}
