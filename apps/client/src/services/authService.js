import { Platform } from 'react-native';
import * as webAuth from './authService.web.js';
import apiClient from './apiClient.js';

/**
 * Cross-Platform Authentication Service (Google OAuth + Email/Password)
 */

export async function signInWithGooglePlatform() {
  if (Platform.OS === 'web') {
    return await webAuth.signInWithGoogle();
  }
  // Native Android & iOS Google Sign-In
  const nativeAuth = await import('./authService.native.js');
  return await nativeAuth.signInWithGoogle();
}

export async function checkRedirectResultPlatform() {
  if (Platform.OS === 'web') {
    return await webAuth.checkRedirectResult();
  }
  return null;
}

export async function signInWithEmailPlatform(email, password) {
  return await webAuth.signInWithEmail(email, password);
}

export async function signUpWithEmailPlatform(registration) {
  if (Platform.OS === 'web') {
    return await webAuth.signUpWithEmail(registration);
  }
  const nativeAuth = await import('./authService.native.js');
  return await nativeAuth.signUpWithEmailPassword(
    registration.email,
    registration.password,
    registration.fullName
  );
}

export async function sendPasswordResetPlatform(email) {
  return await webAuth.sendPasswordReset(email);
}

export async function fetchUserProfilePlatform(uid) {
  return await webAuth.fetchUserProfile(uid);
}

/**
 * Calls backend to provision verified user and set claims.
 */
export async function provisionWithBackend(token, profile = {}) {
  const response = await apiClient.post(
    '/auth/provision',
    profile,
    {
      headers: { Authorization: `Bearer ${token}` },
      skipAuth: true
    }
  );
  return response.data;
}

/**
 * Verifies the user's ID token with the Node.js/Express backend.
 */
export async function verifyWithBackend(token) {
  const response = await apiClient.post(
    '/auth/verify',
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
      skipAuth: true
    }
  );
  return response.data;
}

/**
 * Promotes, demotes, or updates a user role (Admin only).
 */
export async function setUserRoleWithBackend(targetUid, role, isActive) {
  const response = await apiClient.post('/auth/set-role', { targetUid, role, isActive });
  return response.data;
}

/**
 * Fetches the currently authenticated profile from backend.
 */
export async function fetchCurrentProfile() {
  const response = await apiClient.get('/auth/me');
  return response.data;
}

/**
 * Signs out from Firebase and platform identity providers.
 */
export async function signOutPlatform() {
  if (Platform.OS === 'web') {
    await webAuth.signOut();
  } else {
    try {
      const nativeAuth = await import('./authService.native.js');
      await nativeAuth.signOut();
    } catch {
      await webAuth.signOut();
    }
  }
}

export default {
  signInWithGooglePlatform,
  checkRedirectResultPlatform,
  signInWithEmailPlatform,
  signUpWithEmailPlatform,
  sendPasswordResetPlatform,
  provisionWithBackend,
  verifyWithBackend,
  setUserRoleWithBackend,
  fetchCurrentProfile,
  signOutPlatform
};
