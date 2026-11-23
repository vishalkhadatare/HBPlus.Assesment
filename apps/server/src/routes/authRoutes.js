import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

/**
 * POST /api/auth/verify
 * Cryptographically verifies Firebase ID token and domain authorization.
 */
router.post('/verify', authLimiter, authenticate, AuthController.verify);

/**
 * POST /api/auth/provision
 * Provision user after Google OAuth or email sign-in.
 * Enforces server-side domain verification and deletes intruder accounts.
 */
router.post('/provision', authLimiter, authenticate, AuthController.provision);

/**
 * POST /api/auth/reset-password
 * Triggers official password reset workflow for @hbplus.fit domain accounts.
 */
router.post('/reset-password', authLimiter, AuthController.requestPasswordReset);

/**
 * POST /api/auth/set-role
 * Admin-only: promotes, demotes, or disables users and records audit logs.
 */
router.post('/set-role', authenticate, authorize(['admin']), AuthController.setUserRole);

/**
 * GET /api/auth/me
 * Returns current authenticated user's profile summary.
 */
router.get('/me', authenticate, AuthController.getMe);

export default router;
