import { createError, parseError } from "evlog";

/** Error codes for structured error handling */
export const ErrorCodes = {
  CUSTOM_TRANSFORMS_NOT_ALLOWED: "CUSTOM_TRANSFORMS_NOT_ALLOWED",
  INVALID_IMAGE: "INVALID_IMAGE",
  IMAGE_TOO_LARGE: "IMAGE_TOO_LARGE",
  FETCH_FAILED: "FETCH_FAILED",
  REQUEST_TIMEOUT: "REQUEST_TIMEOUT",
  UNSUPPORTED_FORMAT: "UNSUPPORTED_FORMAT",
  MISSING_PARAMS: "MISSING_PARAMS",
  HOSTNAME_NOT_ALLOWED: "HOSTNAME_NOT_ALLOWED",
  ORIGINAL_DISABLED: "ORIGINAL_DISABLED",
  WIDTH_EXCEEDED: "WIDTH_EXCEEDED",
  HEIGHT_EXCEEDED: "HEIGHT_EXCEEDED",
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

/** Error response shape for API responses */
export interface ErrorResponse {
  code?: string;
  message: string;
  why?: string;
  fix?: string;
  link?: string;
}

/** API-facing error codes (snake_case) */
const API_CODES: Record<ErrorCode, string> = {
  [ErrorCodes.CUSTOM_TRANSFORMS_NOT_ALLOWED]: "custom_transforms_not_allowed",
  [ErrorCodes.INVALID_IMAGE]: "invalid_image",
  [ErrorCodes.IMAGE_TOO_LARGE]: "image_too_large",
  [ErrorCodes.FETCH_FAILED]: "source_not_found",
  [ErrorCodes.REQUEST_TIMEOUT]: "request_timeout",
  [ErrorCodes.UNSUPPORTED_FORMAT]: "unsupported_format",
  [ErrorCodes.MISSING_PARAMS]: "missing_params",
  [ErrorCodes.HOSTNAME_NOT_ALLOWED]: "hostname_not_allowed",
  [ErrorCodes.ORIGINAL_DISABLED]: "original_disabled",
  [ErrorCodes.WIDTH_EXCEEDED]: "width_exceeded",
  [ErrorCodes.HEIGHT_EXCEEDED]: "height_exceeded",
};

/** Map error code to HTTP response (for legacy Error messages before full migration) */
const CODE_RESPONSES: Record<ErrorCode, { message: string; status: number }> = {
  [ErrorCodes.CUSTOM_TRANSFORMS_NOT_ALLOWED]: {
    message: "Custom transformations not allowed",
    status: 403,
  },
  [ErrorCodes.INVALID_IMAGE]: {
    message: "Invalid image format or corrupted image",
    status: 400,
  },
  [ErrorCodes.IMAGE_TOO_LARGE]: {
    message: "Image dimensions exceed maximum allowed size",
    status: 413,
  },
  [ErrorCodes.FETCH_FAILED]: {
    message: "Source not found",
    status: 404,
  },
  [ErrorCodes.REQUEST_TIMEOUT]: {
    message: "Request timeout while fetching image",
    status: 408,
  },
  [ErrorCodes.UNSUPPORTED_FORMAT]: {
    message: "Unsupported image format",
    status: 400,
  },
  [ErrorCodes.MISSING_PARAMS]: {
    message: "Missing transform parameters or image path",
    status: 400,
  },
  [ErrorCodes.HOSTNAME_NOT_ALLOWED]: {
    message: "Invalid source",
    status: 403,
  },
  [ErrorCodes.ORIGINAL_DISABLED]: {
    message: "Original image serving is disabled",
    status: 403,
  },
  [ErrorCodes.WIDTH_EXCEEDED]: {
    message: "Width exceeds maximum allowed",
    status: 400,
  },
  [ErrorCodes.HEIGHT_EXCEEDED]: {
    message: "Height exceeds maximum allowed",
    status: 400,
  },
};

/** Check if error has a known Repix error code (from message prefix) */
export function getErrorCode(err: Error): ErrorCode | null {
  const msg = err.message;
  if (msg.includes("Custom transformations not allowed"))
    return ErrorCodes.CUSTOM_TRANSFORMS_NOT_ALLOWED;
  if (msg.includes("Invalid image")) return ErrorCodes.INVALID_IMAGE;
  if (msg.includes("Image too large")) return ErrorCodes.IMAGE_TOO_LARGE;
  if (msg.includes("Hostname not allowed") || msg.includes("Invalid source"))
    return ErrorCodes.HOSTNAME_NOT_ALLOWED;
  if (
    msg.includes("Fetch failed") ||
    msg.includes("Could not fetch source image") ||
    msg.includes("Source not found") ||
    msg.includes("ENOTFOUND")
  )
    return ErrorCodes.FETCH_FAILED;
  if (msg.includes("timeout")) return ErrorCodes.REQUEST_TIMEOUT;
  if (msg.startsWith("Unsupported format:"))
    return ErrorCodes.UNSUPPORTED_FORMAT;
  return null;
}

/** Resolve error to a structured response - use in error handler */
export function resolveError(err: Error): {
  response: ErrorResponse;
  status: number;
} {
  const code = getErrorCode(err);
  if (code) {
    const { message: defaultMessage, status } = CODE_RESPONSES[code];
    // Pass through original message when it adds context (e.g. presets list)
    const message =
      err.message.length > defaultMessage.length ? err.message : defaultMessage;
    return {
      response: { code: API_CODES[code], message },
      status,
    };
  }

  // Evlog createError or unknown - use parseError
  const parsed = parseError(err);
  return {
    response: {
      message: parsed.message,
      why: parsed.why,
      fix: parsed.fix,
      link: parsed.link,
    },
    status: parsed.status ?? 500,
  };
}

/** Create structured errors using evlog - use these when throwing */
export const RepixErrors = {
  customTransformsNotAllowed: (presets: string[]) =>
    createError({
      message: `Custom transformations not allowed. Available presets: ${presets.join(", ")}`,
      status: 403,
    }),

  invalidImage: (detail?: string) =>
    createError({
      message: detail ?? "Invalid image format or corrupted image",
      status: 400,
    }),

  imageTooLarge: () =>
    createError({
      message: "Image dimensions exceed maximum allowed size",
      status: 413,
    }),

  fetchFailed: (status?: number) =>
    createError({
      message: status ? `Source not found: ${status}` : "Source not found",
      status: 404,
    }),

  requestTimeout: () =>
    createError({
      message: "Request timeout while fetching image",
      status: 408,
    }),

  unsupportedFormat: (format: string) =>
    createError({
      message: `Unsupported format: ${format}`,
      status: 400,
    }),

  missingParams: () =>
    createError({
      message: "Missing transform parameters or image path",
      status: 400,
    }),

  hostnameNotAllowed: () =>
    createError({
      message: "Invalid source",
      status: 403,
    }),

  originalDisabled: () =>
    createError({
      message: "Original image serving is disabled",
      status: 403,
    }),

  widthExceeded: (max: number) =>
    createError({
      message: `Width exceeds maximum of ${max}px`,
      status: 400,
    }),

  heightExceeded: (max: number) =>
    createError({
      message: `Height exceeds maximum of ${max}px`,
      status: 400,
    }),
};
