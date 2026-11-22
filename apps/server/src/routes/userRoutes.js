import { Router } from 'express';
import { UserController } from '../controllers/userController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';

const router = Router();

/**
 * GET /api/users/me
 * Retrieves current authenticated user's profile.
 */
router.get('/me', authenticate, UserController.getMe);

/**
 * PATCH /api/users/me
 * Updates allowed non-sensitive profile fields.
 */
router.patch('/me', authenticate, UserController.updateMe);

/**
 * GET /api/admin/users
 * Administrator only: list corporate users directory.
 */
router.get('/admin/all', authenticate, authorize(['admin']), UserController.listUsers);

export default router;
