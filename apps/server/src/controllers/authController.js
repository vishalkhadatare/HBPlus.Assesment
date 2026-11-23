import { AuthService } from '../services/authService.js';
import { UserService } from '../services/userService.js';
import { adminAuth, adminDb } from '../config/firebaseAdmin.js';
import { isAllowedEmail } from '../utils/domainValidator.js';
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
   * POST /api/auth/provision
   * Server-side user provisioning after Google / email login.
   * Re-verifies domain on server. If domain is invalid, deletes the intruder account immediately!
   */
  static async provision(req, res, next) {
    try {
      const { user } = req;
      const email = (user.email || '').trim().toLowerCase();

      // 1. Strict server-side domain verification
      if (!isAllowedEmail(email)) {
        if (adminAuth && user.uid) {
          console.warn(`[Security Alert] Deleting unauthorized outsider account: ${email} (${user.uid})`);
          await adminAuth.deleteUser(user.uid).catch((err) =>
            console.error('[Security] Failed to delete unauthorized user:', err.message)
          );
        }

        return res.status(403).json(
          errorResponse('Access restricted. Please login using your official domain email.', 'DOMAIN_NOT_ALLOWED')
        );
      }

      // 2. User Google and email sign-in can never produce role: 'admin'
      // Only keep existing role if user is already an admin
      const existingProfile = await UserService.getUserProfile(user.uid);
      const role = existingProfile?.role === 'admin' ? 'admin' : 'user';

      // Set custom claim if not already set
      if (adminAuth) {
        await adminAuth.setCustomUserClaims(user.uid, { role });
      }

      // Provision or update user document in Cloud Firestore
      const userProfile = await UserService.provisionOrUpdateUser({
        ...user.token,
        role,
        name: req.body?.fullName || user.token.name,
        phone: req.body?.phone,
        countryCode: req.body?.countryCode
      });

      return res.status(200).json(
        successResponse('User provisioned successfully', userProfile)
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/set-role
   * Admin-only role management (promote, demote, disable, enable)
   * Writes immutable entry to auditLogs
   */
  static async setUserRole(req, res, next) {
    try {
      const { targetUid, role, isActive } = req.body;
      if (!targetUid) {
        return res.status(400).json(errorResponse('targetUid is required.', 'MISSING_PARAM'));
      }

      const normalizedRole = role ? role.toLowerCase() : undefined;
      if (normalizedRole && !['admin', 'user'].includes(normalizedRole)) {
        return res.status(400).json(errorResponse('Invalid role. Must be admin or user.', 'INVALID_ROLE'));
      }

      // 1. Update Custom Claims in Firebase Auth
      if (adminAuth) {
        const claims = {};
        if (normalizedRole) claims.role = normalizedRole;
        await adminAuth.setCustomUserClaims(targetUid, claims);
        if (typeof isActive === 'boolean') {
          await adminAuth.updateUser(targetUid, { disabled: !isActive });
        }
      }

      // 2. Update Firestore Document
      const now = new Date().toISOString();
      const updateData = { updatedAt: now };
      if (normalizedRole) updateData.role = normalizedRole;
      if (typeof isActive === 'boolean') updateData.isActive = isActive;

      if (adminDb) {
        await adminDb.collection('users').doc(targetUid).update(updateData);

        // 3. Write immutable audit log
        const auditRef = adminDb.collection('auditLogs').doc();
        await auditRef.set({
          id: auditRef.id,
          action: 'SET_USER_ROLE',
          performedByUid: req.user.uid,
          performedByEmail: req.user.email,
          targetUid,
          updatedFields: updateData,
          timestamp: now
        });
      }

      return res.status(200).json(
        successResponse('User role updated successfully', { targetUid, role: normalizedRole, isActive })
      );
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
