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
   * Stores fields: name, email, photoURL, role ("Admin" | "User"), lastLogin
   * 
   * @param {object} decodedToken - Verified Firebase ID token
   * @returns {Promise<object>} User profile
   */
  static async provisionOrUpdateUser(decodedToken) {
    const { uid, email, name, picture, phone, countryCode } = decodedToken;
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
      const currentTimestamp = admin.firestore
        ? admin.firestore.FieldValue.serverTimestamp()
        : new Date().toISOString();

      const updateData = {
        name: name || existingUser.name || existingUser.displayName || normalizedEmail.split('@')[0],
        displayName: name || existingUser.displayName || existingUser.name || normalizedEmail.split('@')[0],
        photoURL: picture || existingUser.photoURL || '',
        phone: phone || existingUser.phone || '',
        countryCode: countryCode || existingUser.countryCode || '',
        lastLogin: currentTimestamp,
        lastLoginAt: currentTimestamp
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
        lastLogin: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };
      inMemoryUsers.set(uid, updatedProfile);
      return updatedProfile;
    }

    // New User Provisioning: Role is "Admin" or "User"
    const isInitialAdmin = config.ADMIN_EMAILS.includes(normalizedEmail);
    const assignedRole = isInitialAdmin ? 'Admin' : 'User';
    const currentTimestamp = admin.firestore
      ? admin.firestore.FieldValue.serverTimestamp()
      : new Date().toISOString();

    const newProfile = {
      uid,
      name: name || normalizedEmail.split('@')[0] || 'User',
      displayName: name || normalizedEmail.split('@')[0] || 'User',
      email: normalizedEmail,
      photoURL: picture || '',
      phone: phone || '',
      countryCode: countryCode || '',
      role: assignedRole,
      isActive: true,
      lastLogin: currentTimestamp,
      lastLoginAt: currentTimestamp,
      createdAt: currentTimestamp
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
      lastLogin: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };
    inMemoryUsers.set(uid, savedProfile);
    return savedProfile;
  }

  /**
   * Updates non-sensitive user profile fields.
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
    if (typeof displayName === 'string') {
      updates.displayName = displayName.trim();
      updates.name = displayName.trim();
    }
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
