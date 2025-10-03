/**
 * Utility functions for error handling and API responses
 */

/**
 * Custom application error class for structured error handling
 */
export class AppError extends Error {
  public statusCode: number;
  public code?: string;
  public details?: unknown;

  constructor(
    message: string,
    statusCode: number = 500,
    code?: string,
    details?: unknown
  ) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    
    // Maintains proper stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Common error types for consistency across the API
 */
export const AppErrors = {
  unauthorized: () => new AppError("Unauthorized access", 401, "UNAUTHORIZED"),
  forbidden: () => new AppError("Access forbidden", 403, "FORBIDDEN"),
  notFound: (resource = "Resource") => 
    new AppError(`${resource} not found`, 404, "NOT_FOUND"),
  validation: (message: string, details?: unknown) => 
    new AppError(message, 400, "VALIDATION_ERROR", details),
  conflict: (message: string) => new AppError(message, 409, "CONFLICT"),
  rateLimit: () => 
    new AppError("Too many requests", 429, "RATE_LIMIT_EXCEEDED"),
  internal: (message = "Internal server error") => 
    new AppError(message, 500, "INTERNAL_ERROR"),
};

/**
 * Error response interface
 */
export interface ErrorResponse {
  error: string;
  statusCode: number;
  code?: string;
  details?: unknown;
}

/**
 * Handle various error types and return a standardized response
 * @param error - Error object to handle
 * @param includeDetails - Whether to include error details (for development)
 * @returns Standardized error response
 */
export function handleApiError(
  error: unknown,
  includeDetails: boolean = process.env.NODE_ENV === "development"
): ErrorResponse {
  // Log error for debugging
  console.error("[API Error]:", error);

  // Handle custom AppError
  if (error instanceof AppError) {
    const response: ErrorResponse = {
      error: error.message,
      code: error.code,
      statusCode: error.statusCode,
    };
    
    if (includeDetails && error.details) {
      response.details = error.details;
    }
    
    return response;
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    return {
      error: error.message,
      statusCode: 500,
      code: "INTERNAL_ERROR",
      ...(includeDetails && { details: error.stack }),
    };
  }

  // Handle unknown error types
  return {
    error: "An unexpected error occurred",
    statusCode: 500,
    code: "UNKNOWN_ERROR",
    ...(includeDetails && { details: error }),
  };
}

/**
 * Validate required fields in a request body
 * @param data - Request data to validate
 * @param requiredFields - Array of required field names
 * @returns Array of missing field names
 */
export function validateRequiredFields(
  data: Record<string, unknown>,
  requiredFields: string[]
): string[] {
  const missing: string[] = [];

  for (const field of requiredFields) {
    const value = data[field];
    
    // Check if field is missing, null, undefined, or empty string
    if (
      value === null ||
      value === undefined ||
      (typeof value === "string" && !value.trim())
    ) {
      missing.push(field);
    }
  }

  return missing;
}

/**
 * Check if an error is a specific type
 * @param error - Error to check
 * @param code - Error code to match
 * @returns True if error matches the code
 */
export function isErrorCode(error: unknown, code: string): error is AppError {
  return error instanceof AppError && error.code === code;
}
