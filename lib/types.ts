/**
 * Domain types for the "Start a Project" lead-capture flow.
 * Keeping these in one place gives the client form, the API route,
 * and any future persistence layer a single source of truth.
 */

export type BudgetRange =
  | "under_10k"
  | "10k_50k"
  | "50k_100k"
  | "100k_plus";

export type PreferredContactMethod = "email" | "phone" | "whatsapp";

/** The full payload the client sends to POST /api/quote. */
export interface QuoteRequestPayload {
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  country: string;
  budgetRange: BudgetRange;
  preferredContact: PreferredContactMethod;
  message: string;
}

/** What the server returns for a successful submission. */
export interface QuoteRequestRecord extends QuoteRequestPayload {
  id: string;
  createdAt: string;
  status: "new" | "reviewing" | "closed";
}

/** Standard field-level validation error shape. */
export interface FieldError {
  field: string;
  message: string;
}

/** Standard API error envelope returned on 4xx/5xx responses. */
export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: FieldError[];
  };
}

/** Standard API success envelope for the quote endpoint. */
export interface ApiSuccessResponse<T> {
  data: T;
}
