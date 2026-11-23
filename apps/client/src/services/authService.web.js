import { Capacitor } from '@capacitor/core';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithCredential,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase.js';

const googleProvider = new GoogleAuthProvider();
// Prompt to select from all logged-in Google accounts on the device/browser
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

/**
 * Cross-platform Google Sign-In implementation.
 * Uses native Google Play Services on Android/iOS via Capacitor plugin,
 * and standard OAuth popup on Web.
 */
export async function signInWithGoogle() {
  if (Capacitor.isNativePlatform()) {
    try {
      const result = await FirebaseAuthentication.signInWithGoogle();
      if (!result || !result.user) {
        throw new Error('Sign-in was cancelled.');
      }

      const nativeUser = result.user;
      const normalizedEmail = (nativeUser.email || '').trim().toLowerCase();
      let idToken = result.credential?.idToken || '';

      // Sync credential with webview Firebase Auth instance if token available
      if (idToken) {
        try {
          const credential = GoogleAuthProvider.credential(idToken);
          await signInWithCredential(auth, credential);
        } catch (credErr) {
          console.warn('[authService.web] Native credential sync notice:', credErr.message);
        }
      }

      if (normalizedEmail.endsWith('@hbplus.fit')) {
        try {
          await setDoc(doc(db, 'users', nativeUser.uid), {
            uid: nativeUser.uid,
            name: nativeUser.displayName || normalizedEmail.split('@')[0],
            displayName: nativeUser.displayName || normalizedEmail.split('@')[0],
            email: normalizedEmail,
            photoURL: nativeUser.photoUrl || '',
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

      const userObj = {
        uid: nativeUser.uid,
        email: nativeUser.email,
        displayName: nativeUser.displayName || normalizedEmail.split('@')[0],
        photoURL: nativeUser.photoUrl || '',
        getIdToken: async () => idToken,
        getIdTokenResult: async () => ({
          token: idToken,
          claims: { role: 'user' }
        })
      };

      return {
        user: userObj,
        idToken
      };
    } catch (error) {
      if (error.message?.includes('cancel') || error.code === '12501' || error.message?.includes('12501')) {
        throw new Error('Sign-in was cancelled.');
      }
      throw error;
    }
  }

  // Web Browser Flow
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
      throw new Error('Popup blocked by browser. Please enable popups or tap Continue with Google again.');
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
      department: 'Engineering Systems',
      designation: 'Enterprise Specialist',
      employeeId: `HBP-${result.user.uid.slice(-4).toUpperCase()}`,
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
 * Fetches user profile document directly from Cloud Firestore.
 */
export async function fetchUserProfile(uid) {
  if (!uid) return null;
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      return snap.data();
    }
  } catch (err) {
    console.warn('[authService.web] fetchUserProfile:', err.message);
  }
  return null;
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
  if (Capacitor.isNativePlatform()) {
    try {
      await FirebaseAuthentication.signOut();
    } catch (_) {}
  }
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
