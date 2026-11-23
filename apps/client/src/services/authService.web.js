import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { auth } from '../config/firebase.js';

const googleProvider = new GoogleAuthProvider();
// Note: hd is only a UI hint to pre-filter Google account chooser, NEVER trusted for security
googleProvider.setCustomParameters({
  hd: 'hbplus.fit',
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
 * Email/Password authentication.
 */
export async function signInWithEmail(email, password) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  const idToken = await result.user.getIdToken();
  return { user: result.user, idToken };
}

/**
 * Sends a password reset email via Firebase Auth.
 */
export async function sendPasswordReset(email) {
  await sendPasswordResetEmail(auth, email);
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
  signInWithEmail,
  sendPasswordReset,
  signOut
};
