import { errorResponse } from '../utils/apiResponse.js';

/**
 * 404 Unknown Route Handler
 */
export function notFound(req, res) {
  res.status(404).json(
    errorResponse(`Route not found: ${req.method} ${req.originalUrl}`, 'NOT_FOUND')
  );
}

export default notFound;
