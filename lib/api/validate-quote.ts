import type { BudgetRange, FieldError, PreferredContactMethod, QuoteRequestPayload } from "@/lib/types";

const BUDGETS: BudgetRange[] = ["under_10k", "10k_50k", "50k_100k", "100k_plus"];
const CONTACT_METHODS: PreferredContactMethod[] = ["email", "phone", "whatsapp"];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Validates an unknown request body against the simplified
 * QuoteRequestPayload shape. Returns a typed, narrowed payload on
 * success or a list of field errors on failure — callers decide how
 * to surface the errors (here: HTTP 422).
 */
export function validateQuotePayload(
  body: unknown
): { valid: true; data: QuoteRequestPayload } | { valid: false; errors: FieldError[] } {
  const errors: FieldError[] = [];

  if (typeof body !== "object" || body === null) {
    return {
      valid: false,
      errors: [{ field: "body", message: "Request body must be a JSON object." }],
    };
  }

  const b = body as Record<string, unknown>;

  if (!isNonEmptyString(b.name)) {
    errors.push({ field: "name", message: "Name is required." });
  }
  if (!isNonEmptyString(b.email) || !EMAIL_PATTERN.test(String(b.email))) {
    errors.push({ field: "email", message: "A valid email address is required." });
  }
  if (!isNonEmptyString(b.country)) {
    errors.push({ field: "country", message: "Country is required." });
  }
  if (!isNonEmptyString(b.budgetRange) || !BUDGETS.includes(b.budgetRange as BudgetRange)) {
    errors.push({ field: "budgetRange", message: "Please select a budget range." });
  }
  if (
    !isNonEmptyString(b.preferredContact) ||
    !CONTACT_METHODS.includes(b.preferredContact as PreferredContactMethod)
  ) {
    errors.push({ field: "preferredContact", message: "Please select a preferred contact method." });
  }
  if (!isNonEmptyString(b.message) || String(b.message).trim().length < 10) {
    errors.push({ field: "message", message: "Please add a short message (at least 10 characters)." });
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      name: String(b.name).trim(),
      email: String(b.email).trim().toLowerCase(),
      phone: isNonEmptyString(b.phone) ? String(b.phone).trim() : undefined,
      companyName: isNonEmptyString(b.companyName) ? String(b.companyName).trim() : undefined,
      country: String(b.country).trim(),
      budgetRange: b.budgetRange as BudgetRange,
      preferredContact: b.preferredContact as PreferredContactMethod,
      message: String(b.message).trim(),
    },
  };
}
