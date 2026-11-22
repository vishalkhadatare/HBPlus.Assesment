import { Router } from 'express';
import { successResponse } from '../utils/apiResponse.js';
import config from '../config/environment.js';

const router = Router();

/**
 * GET /api/health
 * Public health check endpoint.
 */
router.get('/', (req, res) => {
  res.status(200).json(
    successResponse('HBPlus Secure Access API is operational', {
      status: 'UP',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: config.NODE_ENV,
      enforcedDomain: config.ALLOWED_EMAIL_DOMAIN
    })
  );
});

export default router;
