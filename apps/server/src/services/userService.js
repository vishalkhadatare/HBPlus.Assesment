import admin, { adminDb } from '../config/firebaseAdmin.js';
import config from '../config/environment.js';

// In-memory user store for mock/test runs or when Firestore is offline/uninitialized
const inMemoryUsers = new Map();

/**
 * Service for Firestore User profile management and role assignment.
 */
export class UserService {
  /**
   * Retrieves a user profile by UID.
   * @param {string} uid 
   * @returns {Promise<object|null>}
   */
  static async getUserProfile(uid) {
    if (!uid) return null;

    const shouldUseFirestore = adminDb && (!config.isTest || process.env.FIRESTORE_EMULATOR_HOST);

    if (shouldUseFirestore) {
      try {
        const docRef = adminDb.collection('users').doc(uid);
        const docSnap = await docRef.get();
        if (docSnap.exists) {
          return { uid, ...docSnap.data() };
        }
      } catch (err) {
        if (!config.isTest && !config.isDevelopment) {
          throw err;
        }
        console.warn(`[UserService] Firestore read failed (${err.message}). Using in-memory fallback.`);
      }
    }

    return inMemoryUsers.get(uid) || null;
  }

  /**
   * Provisions a new user profile or updates last login time for an existing profile.
   * Enforces trusted role assignment:
   * - Default role is 'user'
   * - Accounts listed in ADMIN_EMAILS receive 'admin' role upon initial provisioning
   * - Existing roles and isActive flags cannot be overwritten by client data.
   * 
   * @param {object} decodedToken - Verified Firebase ID token
   * @returns {Promise<object>} User profile
   */
  static async provisionOrUpdateUser(decodedToken) {
    const { uid, email, name, picture } = decodedToken;
    const normalizedEmail = (email || '').trim().toLowerCase();

    const existingUser = await this.getUserProfile(uid);

    // If user exists, check if account is active
    if (existingUser) {
      if (existingUser.isActive === false) {
        const error = new Error('Your account has been deactivated. Please contact support.');
        error.code = 'ACCOUNT_DISABLED';
        error.status = 403;
        throw error;
      }

      // Safe update: update login timestamp and profile metadata if changed
      const updateData = {
        lastLoginAt: admin.firestore ? admin.firestore.FieldValue.serverTimestamp() : new Date().toISOString(),
        displayName: name || existingUser.displayName || '',
        photoURL: picture || existingUser.photoURL || ''
      };

      if (adminDb && (!config.isTest || process.env.FIRESTORE_EMULATOR_HOST)) {
        try {
          await adminDb.collection('users').doc(uid).set(updateData, { merge: true });
        } catch (err) {
          if (!config.isTest && !config.isDevelopment) {
            throw err;
          }
        }
      }

      const updatedProfile = {
        ...existingUser,
        ...updateData,
        lastLoginAt: new Date().toISOString()
      };
      inMemoryUsers.set(uid, updatedProfile);
      return updatedProfile;
    }

    // New User Provisioning
    const isInitialAdmin = config.ADMIN_EMAILS.includes(normalizedEmail);
    const assignedRole = isInitialAdmin ? 'admin' : 'user';

    const newProfile = {
      uid,
      email: normalizedEmail,
      displayName: name || normalizedEmail.split('@')[0] || 'User',
      photoURL: picture || '',
      role: assignedRole,
      isActive: true,
      createdAt: admin.firestore ? admin.firestore.FieldValue.serverTimestamp() : new Date().toISOString(),
      lastLoginAt: admin.firestore ? admin.firestore.FieldValue.serverTimestamp() : new Date().toISOString()
    };

    if (adminDb && (!config.isTest || process.env.FIRESTORE_EMULATOR_HOST)) {
      try {
        await adminDb.collection('users').doc(uid).set(newProfile);
      } catch (err) {
        if (!config.isTest && !config.isDevelopment) {
          throw err;
        }
      }
    }

    const savedProfile = {
      ...newProfile,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };
    inMemoryUsers.set(uid, savedProfile);
    return savedProfile;
  }

  /**
   * Updates non-sensitive user profile fields.
   * @param {string} uid 
   * @param {object} fields { displayName, photoURL }
   * @returns {Promise<object>}
   */
  static async updateSafeProfile(uid, { displayName, photoURL }) {
    const existing = await this.getUserProfile(uid);
    if (!existing) {
      const error = new Error('User profile not found.');
      error.code = 'USER_NOT_FOUND';
      error.status = 404;
      throw error;
    }

    const updates = {};
    if (typeof displayName === 'string') updates.displayName = displayName.trim();
    if (typeof photoURL === 'string') updates.photoURL = photoURL.trim();

    if (adminDb && (!config.isTest || process.env.FIRESTORE_EMULATOR_HOST)) {
      try {
        await adminDb.collection('users').doc(uid).set(updates, { merge: true });
      } catch (err) {
        if (!config.isTest && !config.isDevelopment) throw err;
      }
    }

    const updated = { ...existing, ...updates };
    inMemoryUsers.set(uid, updated);
    return updated;
  }

  /**
   * Retrieves all users (Admin only).
   * @returns {Promise<Array<object>>}
   */
  static async getAllUsers() {
    if (adminDb && (!config.isTest || process.env.FIRESTORE_EMULATOR_HOST)) {
      try {
        const snapshot = await adminDb.collection('users').get();
        return snapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));
      } catch (err) {
        if (!config.isTest && !config.isDevelopment) throw err;
      }
    }

    return Array.from(inMemoryUsers.values());
  }

  /**
   * Reset in-memory users (for testing).
   */
  static _resetInMemory() {
    inMemoryUsers.clear();
  }
}

export default UserService;
