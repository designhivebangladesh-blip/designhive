import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { localizeHref } from "@/lib/i18n/href";
import type { Locale } from "@/lib/i18n/config";
import type { CtaBandResult } from "@/sanity/lib/queries";

const FALLBACK = {
  title: "Ready to build a website that looks premium and converts better?",
  description:
    "Tell us where you want to go. We'll reply within one business day with next steps and a straight-talking quote — no obligation, no pressure.",
  cta: { label: "Book a Free Strategy Call", href: "/quote" },
  secondaryCta: { label: "View Selected Projects", href: "/portfolio" },
};

const FALLBACK_EMAIL = "designhivebangladesh@gmail.com";

interface CtaBandProps {
  data?: CtaBandResult;
  locale?: Locale;
  email?: string;
}

export default function CtaBand({ data, locale = "bn", email }: CtaBandProps) {
  const title = data?.title || FALLBACK.title;
  const description = data?.description || FALLBACK.description;
  const ctaLabel = data?.cta?.label || FALLBACK.cta.label;
  const ctaHref = localizeHref(data?.cta?.href || FALLBACK.cta.href, locale);
  const secondaryHref = localizeHref(FALLBACK.secondaryCta.href, locale);
  const contactEmail = email || FALLBACK_EMAIL;

  return (
    <section
      id="get-started"
      className="honeycomb-outline relative overflow-hidden bg-ink py-24"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/10 blur-[120px]" />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-parchment sm:text-4xl">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-parchment/65">
          {description}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={ctaHref}
            className="hover-zoom group inline-flex items-center gap-2 rounded-full bg-gold-gradient px-8 py-3.5 text-sm font-semibold text-ink shadow-gold"
          >
            {ctaLabel}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href={secondaryHref}
            className="hover-zoom group inline-flex items-center gap-2 rounded-full border border-gold-400/40 px-8 py-3.5 text-sm font-semibold text-parchment transition-all hover:bg-gold-400/10"
          >
            {FALLBACK.secondaryCta.label}
          </Link>
        </div>
        <a
          href={`mailto:${contactEmail}`}
          className="hover-zoom-sm mt-6 inline-flex items-center gap-2 text-sm font-medium text-gold-300/90 hover:text-gold-200"
        >
          <Mail className="h-4 w-4" aria-hidden="true" />
          {contactEmail}
        </a>
      </div>
    </section>
  );
}
