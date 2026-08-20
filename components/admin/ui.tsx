import type { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-gold-400/15 bg-ink-soft/60 ${className}`}>
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-semibold text-parchment">{title}</h1>
        {description ? <p className="mt-1 text-sm text-parchment/60">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function PrimaryButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`inline-flex items-center gap-2 rounded-full bg-gold-gradient px-4 py-2 text-xs font-semibold text-ink shadow-gold transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60 ${props.className ?? ""}`}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`inline-flex items-center gap-2 rounded-full border border-gold-400/25 px-4 py-2 text-xs font-semibold text-parchment/80 transition hover:text-parchment disabled:cursor-not-allowed disabled:opacity-60 ${props.className ?? ""}`}
    >
      {children}
    </button>
  );
}

export function LinkButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 rounded-full bg-gold-gradient px-4 py-2 text-xs font-semibold text-ink shadow-gold transition hover:brightness-105"
    >
      {children}
    </a>
  );
}

export function ErrorBanner({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <div className="mb-4 rounded-xl border border-red-500/30 bg-red-950/40 px-4 py-3 text-sm text-red-200">
      {message}
    </div>
  );
}

export function SuccessBanner({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <div className="mb-4 rounded-xl border border-green-500/30 bg-green-950/40 px-4 py-3 text-sm text-green-200">
      {message}
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-gold-400/20 px-6 py-16 text-center">
      <p className="font-display text-lg text-parchment/80">{title}</p>
      {description ? <p className="text-sm text-parchment/50">{description}</p> : null}
    </div>
  );
}

export function Badge({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "gold" | "muted" }) {
  const toneClasses = {
    default: "border-gold-400/25 text-parchment/80",
    gold: "border-gold-400/40 bg-gold-400/10 text-gold-200",
    muted: "border-parchment-line/20 text-parchment/40",
  }[tone];
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${toneClasses}`}>
      {children}
    </span>
  );
}

export const inputClass =
  "w-full rounded-lg border border-gold-400/20 bg-ink px-3 py-2 text-sm text-parchment placeholder:text-parchment/30 focus:border-gold-400/50 focus:outline-none";

export const labelClass = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-parchment/60";
