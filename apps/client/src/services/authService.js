import { Platform } from 'react-native';
import * as webAuth from './authService.web.js';
import apiClient from './apiClient.js';

/**
 * Cross-Platform Authentication Service (Google OAuth)
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

/**
 * Verifies the user's ID token with the Node.js/Express backend.
 */
export async function verifyWithBackend(token, allowOverride = false) {
  const headers = {
    Authorization: `Bearer ${token}`
  };
  if (allowOverride) {
    headers['x-dev-allow-any'] = 'true';
  }
  const response = await apiClient.post(
    '/auth/verify',
    {},
    {
      headers,
      skipAuth: true
    }
  );
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
    } catch (e) {
      // Fallback
    }
  }
}

export default {
  signInWithGooglePlatform,
  checkRedirectResultPlatform,
  verifyWithBackend,
  fetchCurrentProfile,
  signOutPlatform
};
