import { Platform } from 'react-native';
import * as webAuth from './authService.web.js';
import apiClient from './apiClient.js';

/**
 * Cross-Platform Authentication Service
 * Automatically selects the appropriate platform adapter.
 */

export async function signInWithGooglePlatform() {
  if (Platform.OS === 'web') {
    return await webAuth.signInWithGoogle();
  }
  // Dynamic import on native devices
  const nativeAuth = await import('./authService.native.js');
  return await nativeAuth.signInWithGoogle();
}

/**
 * Verifies the user's ID token with the Node.js/Express backend.
 */
export async function verifyWithBackend(token) {
  const response = await apiClient.post(
    '/auth/verify',
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`
      },
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
  verifyWithBackend,
  fetchCurrentProfile,
  signOutPlatform
};
