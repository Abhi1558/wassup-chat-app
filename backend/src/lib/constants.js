export const STATUS_CODES = {
  // ✅ Success
  OK: 200, // Request successful
  CREATED: 201, // Resource created
  ACCEPTED: 202, // Request accepted (processing later)
  NO_CONTENT: 204, // Success but no response body

  // ⚠️ Client Errors
  BAD_REQUEST: 400, // Invalid input
  UNAUTHORIZED: 401, // Not logged in / invalid token
  FORBIDDEN: 403, // No permission
  NOT_FOUND: 404, // Resource not found
  METHOD_NOT_ALLOWED: 405, // Wrong HTTP method
  CONFLICT: 409, // Duplicate / conflict (e.g., email exists)
  TOO_MANY_REQUESTS: 429, // Rate limiting (OTP spam)

  // 💥 Server Errors
  INTERNAL_SERVER_ERROR: 500, // Generic server error
  NOT_IMPLEMENTED: 501, // Feature not built
  BAD_GATEWAY: 502, // Server received invalid response
  SERVICE_UNAVAILABLE: 503, // Server down / overloaded
};



