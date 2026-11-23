import { AuthService } from '../services/authService.js';
import { UserService } from '../services/userService.js';
import { adminAuth } from '../config/firebaseAdmin.js';
import config from '../config/environment.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

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

  /**
   * POST /api/auth/demo-login
   * Development-only helper: Mints a valid Firebase custom token for a test @hbplus.fit account
   * and saves/updates the record into live Cloud Firestore.
   */
  static async demoLogin(req, res, next) {
    try {
      if (config.isProduction) {
        return res.status(403).json(
          errorResponse('Demo login is disabled in production.', 'FORBIDDEN')
        );
      }

      const requestedEmail = (req.body.email || 'employee@hbplus.fit').trim().toLowerCase();
      const isAdmin = config.ADMIN_EMAILS.includes(requestedEmail) || req.body.role === 'Admin';
      const role = isAdmin ? 'Admin' : 'User';
      const displayName = req.body.displayName || (isAdmin ? 'Demo Administrator' : 'Demo Employee');

      // 1. Get or create Firebase Auth user
      let firebaseUser;
      if (adminAuth) {
        try {
          firebaseUser = await adminAuth.getUserByEmail(requestedEmail);
        } catch (err) {
          if (err.code === 'auth/user-not-found') {
            firebaseUser = await adminAuth.createUser({
              email: requestedEmail,
              emailVerified: true,
              displayName
            });
          } else {
            throw err;
          }
        }
      } else {
        firebaseUser = {
          uid: 'demo-' + requestedEmail.replace(/[^a-z0-9]/g, '-'),
          email: requestedEmail,
          displayName
        };
      }

      // 2. Mint real custom token
      let customToken = 'mock-custom-token';
      if (adminAuth) {
        customToken = await adminAuth.createCustomToken(firebaseUser.uid, { role });
      }

      // 3. Provision / update directly in Cloud Firestore
      const userProfile = await UserService.provisionOrUpdateUser({
        uid: firebaseUser.uid,
        email: requestedEmail,
        name: displayName,
        picture: ''
      });

      return res.status(200).json(
        successResponse('Demo login successful', {
          customToken,
          profile: userProfile,
          firebaseUser: {
            uid: firebaseUser.uid,
            email: requestedEmail,
            displayName: userProfile.displayName,
            role: userProfile.role
          }
        })
      );
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
