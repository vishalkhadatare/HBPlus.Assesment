import { errorResponse } from '../utils/apiResponse.js';
import config from '../config/environment.js';

/**
 * Centralized Error Handling Middleware
 */
export function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error occurred.';
  const code = err.code || 'INTERNAL_SERVER_ERROR';

  // Do not expose stack traces in production
  const details = config.isProduction ? null : err.stack;

  // Log non-4xx errors on server console safely (without bearer tokens)
  if (status >= 500) {
    console.error(`[Unhandled Server Error] ${req.method} ${req.originalUrl}:`, err.message);
  }

  res.status(status).json(errorResponse(message, code, details));
}

export default errorHandler;
