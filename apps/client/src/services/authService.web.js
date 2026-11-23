import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { auth } from '../config/firebase.js';

const googleProvider = new GoogleAuthProvider();
// Prompt user to select account (enables easy account switching)
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

/**
 * Web Google Sign-In implementation using Firebase Auth Popup / Redirect.
 */
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();
    return {
      user: result.user,
      idToken
    };
  } catch (error) {
    if (error.code === 'auth/popup-blocked') {
      console.warn('[authService.web] Popup blocked, attempting redirect sign-in...');
      await signInWithRedirect(auth, googleProvider);
      return null;
    }
    throw error;
  }
}

/**
 * Checks for any pending redirect result on web page load.
 */
export async function checkRedirectResult() {
  try {
    const result = await getRedirectResult(auth);
    if (result && result.user) {
      const idToken = await result.user.getIdToken();
      return { user: result.user, idToken };
    }
  } catch (error) {
    console.error('[authService.web] Error reading redirect result:', error);
    throw error;
  }
  return null;
}

/**
 * Signs out the current Firebase user.
 */
export async function signOut() {
  await firebaseSignOut(auth);
}

export default {
  signInWithGoogle,
  checkRedirectResult,
  signOut
};
