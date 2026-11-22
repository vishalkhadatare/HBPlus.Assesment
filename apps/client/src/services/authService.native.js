import { GoogleAuthProvider, signInWithCredential, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../config/firebase.js';

/**
 * Native Google Sign-In Adapter for iOS and Android.
 * Integrates native Google Sign-In SDK with Firebase Authentication.
 * 
 * Uses @react-native-google-signin/google-signin when running in native runtime.
 */
let GoogleSignin = null;
try {
  // Dynamically load native module if available in runtime
  const nativeModule = await import('@react-native-google-signin/google-signin');
  GoogleSignin = nativeModule.GoogleSignin;
} catch (e) {
  // Native module not installed in web bundle; handled gracefully
}

export async function configureNativeGoogleSignIn(webClientId) {
  if (GoogleSignin) {
    GoogleSignin.configure({
      webClientId: webClientId || '',
      offlineAccess: true
    });
  }
}

export async function signInWithGoogle() {
  if (!GoogleSignin) {
    throw new Error('Native Google Sign-In is only supported on Android and iOS devices.');
  }

  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const response = await GoogleSignin.signIn();
  const idToken = response.data?.idToken || response.idToken;

  if (!idToken) {
    throw new Error('Failed to retrieve native Google ID token.');
  }

  const credential = GoogleAuthProvider.credential(idToken);
  const result = await signInWithCredential(auth, credential);
  const firebaseIdToken = await result.user.getIdToken();

  return {
    user: result.user,
    idToken: firebaseIdToken
  };
}

export async function signOut() {
  try {
    if (GoogleSignin) {
      await GoogleSignin.signOut();
    }
  } catch (err) {
    console.warn('[authService.native] GoogleSignin.signOut error:', err);
  }
  await firebaseSignOut(auth);
}

export default {
  signInWithGoogle,
  signOut,
  configureNativeGoogleSignIn
};
