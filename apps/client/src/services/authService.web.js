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
    const user = result.user;
    const normalizedEmail = (user.email || '').trim().toLowerCase();

    // Persist user record to Cloud Firestore database directly upon login if allowed domain
    if (normalizedEmail.endsWith('@hbplus.fit')) {
      try {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          name: user.displayName || normalizedEmail.split('@')[0],
          displayName: user.displayName || normalizedEmail.split('@')[0],
          email: normalizedEmail,
          photoURL: user.photoURL || '',
          role: 'User',
          roleKey: 'user',
          isActive: true,
          emailVerified: true,
          updatedAt: serverTimestamp(),
          lastLoginAt: serverTimestamp()
        }, { merge: true });
      } catch (err) {
        console.warn('[authService.web] Direct profile sync notice:', err.message);
      }
    }

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
 * Direct account creation without verification requirement.
 */
export async function signUpWithEmail({ email, password, fullName, phone, countryCode }) {
  const normalizedEmail = (email || '').trim().toLowerCase();
  const result = await createUserWithEmailAndPassword(auth, normalizedEmail, password);

  if (fullName?.trim()) {
    await updateProfile(result.user, { displayName: fullName.trim() });
  }

  // Save profile directly to Cloud Firestore database
  try {
    await setDoc(doc(db, 'users', result.user.uid), {
      uid: result.user.uid,
      name: (fullName || '').trim() || normalizedEmail.split('@')[0],
      displayName: (fullName || '').trim() || normalizedEmail.split('@')[0],
      email: normalizedEmail,
      phone: (phone || '').trim(),
      countryCode: (countryCode || '').trim(),
      role: 'User',
      roleKey: 'user',
      isActive: true,
      emailVerified: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLoginAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.warn('[authService.web] Direct profile write notice:', error.message);
  }

  const idToken = await result.user.getIdToken();

  return {
    user: result.user,
    idToken,
    verificationRequired: false
  };
}

/**
 * Sends a password reset email via Firebase Auth.
 */
export async function sendPasswordReset(email) {
  const cleanEmail = (email || '').trim().toLowerCase();
  try {
    await sendPasswordResetEmail(auth, cleanEmail);
    return { success: true, email: cleanEmail };
  } catch (err) {
    if (err.code === 'auth/user-not-found') {
      return { success: true, email: cleanEmail, notice: 'If an account exists, a reset link was dispatched.' };
    }
    throw err;
  }
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
