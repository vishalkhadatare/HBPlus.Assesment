/**
 * Standardized API response helpers to ensure uniform JSON responses across all endpoints.
 */

/**
 * Creates a success response object.
 * @param {string} message 
 * @param {any} [data=null] 
 * @returns {object}
 */
export function successResponse(message, data = null) {
  const response = {
    success: true,
    message
  };
  if (data !== null && data !== undefined) {
    response.data = data;
  }
  return response;
}

/**
 * Creates an error response object.
 * @param {string} message 
 * @param {string} [code] 
 * @param {any} [details=null] 
 * @returns {object}
 */
export function errorResponse(message, code = undefined, details = null) {
  const response = {
    success: false,
    message
  };
  if (code) {
    response.code = code;
  }
  if (details !== null && details !== undefined && process.env.NODE_ENV !== 'production') {
    response.details = details;
  }
  return response;
}
