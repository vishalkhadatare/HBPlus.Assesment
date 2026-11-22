import rateLimit from 'express-rate-limit';
import { errorResponse } from '../utils/apiResponse.js';
import config from '../config/environment.js';

/**
 * Global rate limiter to mitigate denial-of-service and brute force requests.
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: config.isTest ? 10000 : 300, // Limit each IP to 300 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: errorResponse('Too many requests from this IP, please try again later.', 'RATE_LIMIT_EXCEEDED')
});

/**
 * Stricter rate limiter for authentication verification endpoints.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: config.isTest ? 10000 : 50, // Limit authentication attempts to 50 per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: errorResponse('Too many authentication attempts, please try again later.', 'AUTH_RATE_LIMIT_EXCEEDED')
});

export default {
  globalLimiter,
  authLimiter
};
