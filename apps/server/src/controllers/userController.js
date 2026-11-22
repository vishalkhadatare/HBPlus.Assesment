import { UserService } from '../services/userService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export class UserController {
  /**
   * GET /api/users/me
   * Returns current user's full Firestore profile.
   */
  static async getMe(req, res, next) {
    try {
      const profile = await UserService.getUserProfile(req.user.uid);
      if (!profile) {
        return res.status(404).json(
          errorResponse('User profile not found in directory.', 'USER_NOT_FOUND')
        );
      }

      // Restrict returned fields to safe attributes
      const safeProfile = {
        uid: profile.uid,
        email: profile.email,
        displayName: profile.displayName,
        photoURL: profile.photoURL,
        role: profile.role,
        isActive: profile.isActive,
        createdAt: profile.createdAt,
        lastLoginAt: profile.lastLoginAt
      };

      return res.status(200).json(
        successResponse('Profile retrieved successfully', safeProfile)
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/users/me
   * Allows updating only safe profile fields.
   */
  static async updateMe(req, res, next) {
    try {
      const { displayName, photoURL } = req.body;
      const updated = await UserService.updateSafeProfile(req.user.uid, { displayName, photoURL });
      return res.status(200).json(
        successResponse('Profile updated successfully', updated)
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/users
   * Admin-only user directory endpoint.
   */
  static async listUsers(req, res, next) {
    try {
      const users = await UserService.getAllUsers();
      return res.status(200).json(
        successResponse('User directory retrieved successfully', { users, total: users.length })
      );
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
