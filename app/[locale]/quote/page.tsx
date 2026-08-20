import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import QuoteForm from "@/components/QuoteForm";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

export default async function QuotePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale: Locale = isLocale(locale) ? locale : "bn";
  const messages = getMessages(safeLocale);

  return (
    <main className="honeycomb-field min-h-screen bg-parchment-dim py-16">
      <div className="mx-auto max-w-2xl px-6">
        <div className="mb-10 flex items-center justify-between">
          <Link
            href={`/${safeLocale}`}
            className="hover-zoom-sm flex items-center gap-2 text-sm font-medium text-ink/60 hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" />
            {messages.quotePage.back}
          </Link>
          <div className="flex items-center gap-2.5">
            <span className="hex-clip flex h-8 w-8 items-center justify-center bg-gold-gradient">
              <span className="hex-clip flex h-6 w-6 items-center justify-center bg-ink text-[11px] font-display font-semibold text-gold-300">
                D
              </span>
            </span>
            <div className="leading-tight">
              <p className="font-display text-base font-semibold text-ink">Designhive</p>
              <p className="text-[11px] uppercase tracking-[0.15em] text-ink/45">
                {messages.quotePage.tagline}
              </p>
            </div>
          </div>
        </div>

        <QuoteForm />
      </div>
    </main>
  );
}
