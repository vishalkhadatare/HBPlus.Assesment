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
        displayName: profile.displayName || profile.name || profile.email?.split('@')[0],
        photoURL: profile.photoURL || '',
        phone: profile.phone || '',
        countryCode: profile.countryCode || '',
        department: profile.department || 'Engineering Systems',
        designation: profile.designation || (profile.role === 'Admin' ? 'System Administrator' : 'Staff Engineer'),
        bio: profile.bio || 'Engineering & Operations member at HBPlus Fitness & Health International.',
        emergencyContact: profile.emergencyContact || '',
        notificationsEnabled: profile.notificationsEnabled !== false,
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
      const {
        displayName,
        photoURL,
        phone,
        countryCode,
        department,
        designation,
        bio,
        emergencyContact,
        notificationsEnabled
      } = req.body;

      const updated = await UserService.updateSafeProfile(req.user.uid, {
        displayName,
        photoURL,
        phone,
        countryCode,
        department,
        designation,
        bio,
        emergencyContact,
        notificationsEnabled
      });

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
