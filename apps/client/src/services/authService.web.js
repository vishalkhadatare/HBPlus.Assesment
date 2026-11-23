import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase.js';

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
 * Creates an employee account and stores the employee registration profile.
 */
export async function signUpWithEmail({ email, password, fullName, phone, countryCode }) {
  const normalizedEmail = (email || '').trim().toLowerCase();
  const result = await createUserWithEmailAndPassword(auth, normalizedEmail, password);

  await updateProfile(result.user, { displayName: (fullName || '').trim() });
  try {
    await setDoc(doc(db, 'users', result.user.uid), {
      uid: result.user.uid,
      name: (fullName || '').trim(),
      displayName: (fullName || '').trim(),
      email: normalizedEmail,
      phone: (phone || '').trim(),
      countryCode: (countryCode || '').trim(),
      role: 'User',
      roleKey: 'user',
      isActive: true,
      emailVerified: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLoginAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.warn('[authService.web] Direct profile write requires deployed user rules; server provisioning will be used.', error.message);
  }

  await sendEmailVerification(result.user);
  const idToken = await result.user.getIdToken();

  return {
    user: result.user,
    idToken,
    verificationRequired: true
  };
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
  signUpWithEmail,
  sendPasswordReset,
  signOut
};
