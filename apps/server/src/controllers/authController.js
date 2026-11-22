import { AuthService } from '../services/authService.js';
import { successResponse } from '../utils/apiResponse.js';

export class AuthController {
  /**
   * POST /api/auth/verify
   * Verifies the ID token and returns the authorized profile.
   */
  static async verify(req, res, next) {
    try {
      const authorizedProfile = AuthService.getAuthorizedProfile(req.user);
      return res.status(200).json(
        successResponse('Authentication successful', authorizedProfile)
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/auth/me
   * Returns current authenticated user's authorization summary.
   */
  static async getMe(req, res, next) {
    try {
      const authorizedProfile = AuthService.getAuthorizedProfile(req.user);
      return res.status(200).json(
        successResponse('User profile retrieved successfully', authorizedProfile)
      );
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
