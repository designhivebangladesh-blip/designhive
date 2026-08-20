import { NextResponse } from "next/server";
import type { ApiErrorResponse, FieldError } from "@/lib/types";

/**
 * Thrown anywhere inside a route handler or service function.
 * `statusCode` maps directly to the HTTP response status,
 * keeping business logic decoupled from the transport layer.
 */
export class ApiError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly details?: FieldError[];

  constructor(statusCode: number, code: string, message: string, details?: FieldError[]) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }

  static unauthorized(message = "Authentication is required for this request.") {
    return new ApiError(401, "UNAUTHORIZED", message);
  }

  static forbidden(message = "You do not have permission to perform this action.") {
    return new ApiError(403, "FORBIDDEN", message);
  }

  static notFound(message = "The requested resource could not be found.") {
    return new ApiError(404, "NOT_FOUND", message);
  }

  static unprocessable(details: FieldError[], message = "One or more fields are invalid.") {
    return new ApiError(422, "UNPROCESSABLE_ENTITY", message, details);
  }

  static internal(message = "Something went wrong on our end. Please try again.") {
    return new ApiError(500, "INTERNAL_SERVER_ERROR", message);
  }
}

/**
 * Global error handler for Route Handlers. Wrap the body of every
 * route in try/catch and pass the caught error here so responses
 * stay consistent and internals never leak to the client.
 */
export function toErrorResponse(error: unknown): NextResponse<ApiErrorResponse> {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: { code: error.code, message: error.message, details: error.details } },
      { status: error.statusCode }
    );
  }

  // Unknown/unexpected error — never leak stack traces or internals.
  console.error("[unhandled_api_error]", error);
  return NextResponse.json(
    { error: { code: "INTERNAL_SERVER_ERROR", message: "Something went wrong on our end. Please try again." } },
    { status: 500 }
  );
}
