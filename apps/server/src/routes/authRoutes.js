import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

/**
 * POST /api/auth/verify
 * Cryptographically verifies Firebase ID token and provisions/verifies domain authorization.
 */
router.post('/verify', authLimiter, authenticate, AuthController.verify);

/**
 * GET /api/auth/me
 * Returns current authenticated user's authorization session.
 */
router.get('/me', authenticate, AuthController.getMe);

export default router;
