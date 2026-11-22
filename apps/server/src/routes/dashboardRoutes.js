import { Router } from 'express';
import { DashboardController } from '../controllers/dashboardController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

/**
 * GET /api/dashboard
 * Protected dashboard statistics and corporate resource links.
 */
router.get('/', authenticate, DashboardController.getDashboard);

export default router;
