"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import type {
  ApiErrorResponse,
  BudgetRange,
  FieldError,
  PreferredContactMethod,
  QuoteRequestPayload,
} from "@/lib/types";

type FormState = Partial<QuoteRequestPayload>;

const BUDGET_OPTIONS: { value: BudgetRange; label: string }[] = [
  { value: "under_10k", label: "Under $10k" },
  { value: "10k_50k", label: "$10k – $50k" },
  { value: "50k_100k", label: "$50k – $100k" },
  { value: "100k_plus", label: "$100k+" },
];

const CONTACT_OPTIONS: { value: PreferredContactMethod; label: string }[] = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "whatsapp", label: "WhatsApp" },
];

function fieldClasses(hasError: boolean) {
  return `min-h-[44px] w-full rounded-xl border bg-white/5 px-4 py-2.5 text-sm text-parchment placeholder:text-parchment/30 outline-none transition-all focus:scale-[1.01] focus:shadow-gold ${
    hasError ? "border-red-400" : "border-gold-400/25 focus:border-gold-400"
  }`;
}

interface QuoteFormProps {
  /** Compact styling for use inside the popup modal (tighter padding, no outer card chrome). */
  compact?: boolean;
  /** Called after a successful submission — used by the modal to auto-close. */
  onSuccess?: () => void;
}

export default function QuoteForm({ compact = false, onSuccess }: QuoteFormProps) {
  const [form, setForm] = useState<FormState>({});
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function errorFor(field: string) {
    return errors.find((e) => e.field === field)?.message;
  }

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    const stepErrors: FieldError[] = [];
    if (!form.name?.trim()) stepErrors.push({ field: "name", message: "Name is required." });
    if (!form.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      stepErrors.push({ field: "email", message: "A valid email address is required." });
    }
    if (!form.country?.trim()) stepErrors.push({ field: "country", message: "Country is required." });
    if (!form.budgetRange) stepErrors.push({ field: "budgetRange", message: "Please select a budget range." });
    if (!form.preferredContact) {
      stepErrors.push({ field: "preferredContact", message: "Please select a preferred contact method." });
    }
    if (!form.message || form.message.trim().length < 10) {
      stepErrors.push({ field: "message", message: "Please add a short message (at least 10 characters)." });
    }

    setErrors(stepErrors);
    if (stepErrors.length > 0) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const body = (await res.json()) as ApiErrorResponse;
        if (body.error.details) setErrors(body.error.details);
        setSubmitError(body.error.message);
        return;
      }

      setSubmitted(true);
      onSuccess?.();
    } catch {
      setSubmitError("We couldn't reach the server. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center rounded-3xl border border-gold-400/25 bg-ink px-8 py-14 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-gradient text-ink">
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <h2 className="mt-6 font-display text-2xl font-semibold text-parchment">Request received</h2>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-parchment/60">
          Thanks, {form.name}. Our team reviews every request personally and will reach out via{" "}
          {CONTACT_OPTIONS.find((c) => c.value === form.preferredContact)?.label ?? "email"} within one
          business day.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={
        compact
          ? "space-y-4"
          : "hex-border rounded-3xl border border-gold-400/20 bg-ink p-8 shadow-gold-lg sm:p-10 space-y-5"
      }
    >
      {!compact && (
        <div>
          <h2 className="font-display text-2xl font-semibold text-parchment">Start Your Project</h2>
          <p className="mt-1 text-sm text-parchment/50">
            Tell us the basics — we&apos;ll follow up within one business day.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-parchment/70">Name</label>
          <input
            className={fieldClasses(!!errorFor("name"))}
            value={form.name ?? ""}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Alex Chen"
            autoComplete="name"
          />
          {errorFor("name") && <p className="mt-1 text-xs text-red-400">{errorFor("name")}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-parchment/70">Email</label>
          <input
            type="email"
            className={fieldClasses(!!errorFor("email"))}
            value={form.email ?? ""}
            onChange={(e) => update("email", e.target.value)}
            placeholder="alex@company.co"
            autoComplete="email"
          />
          {errorFor("email") && <p className="mt-1 text-xs text-red-400">{errorFor("email")}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-parchment/70">Phone / WhatsApp</label>
          <input
            className={fieldClasses(false)}
            value={form.phone ?? ""}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+1 234 567 890"
            autoComplete="tel"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-parchment/70">Company / Brand</label>
          <input
            className={fieldClasses(false)}
            value={form.companyName ?? ""}
            onChange={(e) => update("companyName", e.target.value)}
            placeholder="Acme Co."
            autoComplete="organization"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-parchment/70">Country</label>
          <input
            className={fieldClasses(!!errorFor("country"))}
            value={form.country ?? ""}
            onChange={(e) => update("country", e.target.value)}
            placeholder="Bangladesh"
            autoComplete="country-name"
          />
          {errorFor("country") && <p className="mt-1 text-xs text-red-400">{errorFor("country")}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-parchment/70">Budget Range</label>
          <select
            className={fieldClasses(!!errorFor("budgetRange"))}
            value={form.budgetRange ?? ""}
            onChange={(e) => update("budgetRange", e.target.value as BudgetRange)}
          >
            <option value="" disabled>
              Select a range
            </option>
            {BUDGET_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {errorFor("budgetRange") && <p className="mt-1 text-xs text-red-400">{errorFor("budgetRange")}</p>}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-parchment/70">Preferred Contact Method</label>
        <div className="flex flex-wrap gap-2">
          {CONTACT_OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => update("preferredContact", o.value)}
              className={`min-h-[44px] rounded-full border px-4 text-sm font-medium transition-colors ${
                form.preferredContact === o.value
                  ? "border-gold-400 bg-gold-400/15 text-gold-200"
                  : "border-gold-400/25 text-parchment/70 hover:border-gold-400/50"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
        {errorFor("preferredContact") && (
          <p className="mt-1 text-xs text-red-400">{errorFor("preferredContact")}</p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-parchment/70">Short Message</label>
        <textarea
          rows={compact ? 3 : 4}
          className={fieldClasses(!!errorFor("message"))}
          value={form.message ?? ""}
          onChange={(e) => update("message", e.target.value)}
          placeholder="What are you trying to build?"
        />
        {errorFor("message") && <p className="mt-1 text-xs text-red-400">{errorFor("message")}</p>}
      </div>

      {submitError && (
        <p className="rounded-lg border border-red-400/40 bg-red-400/10 px-3 py-2 text-xs text-red-300">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="hover-zoom group flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-gold-gradient px-6 py-3 text-sm font-semibold text-ink shadow-gold disabled:opacity-60"
      >
        {submitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            Submit Request
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </button>
    </form>
  );
}
