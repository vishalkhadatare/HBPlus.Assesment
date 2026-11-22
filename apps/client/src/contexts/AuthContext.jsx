import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase.js';
import {
  signInWithGooglePlatform,
  verifyWithBackend,
  signOutPlatform
} from '../services/authService.js';
import { formatAuthError, EXACT_RESTRICTION_MESSAGE } from '../utils/errorFormatter.js';
import { isAllowedEmailDomain } from '../utils/domainValidator.js';
import config from '../config/environment.js';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Firebase user
  const [profile, setProfile] = useState(null); // Backend authorized profile
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [error, setError] = useState(null);
  const [errorCode, setErrorCode] = useState(null);

  // Track ongoing authorization requests to prevent duplicate submissions or race conditions
  const isVerifyingRef = useRef(false);

  /**
   * Clears all authentication and authorization state in memory.
   */
  const clearSession = useCallback(() => {
    setUser(null);
    setProfile(null);
    setRole(null);
  }, []);

  /**
   * Verifies the user's authorization against the backend.
   * If domain is invalid or backend rejects, signs out user and displays restriction message.
   */
  const verifyAuthorization = useCallback(
    async (firebaseUser) => {
      if (!firebaseUser) {
        clearSession();
        setIsLoading(false);
        return false;
      }

      if (isVerifyingRef.current) return false;
      isVerifyingRef.current = true;
      setIsAuthorizing(true);
      setError(null);
      setErrorCode(null);

      try {
        const email = firebaseUser.email;

        // Immediate client-side validation check
        if (!isAllowedEmailDomain(email, config.ALLOWED_EMAIL_DOMAIN)) {
          setErrorCode('DOMAIN_NOT_ALLOWED');
          setError(EXACT_RESTRICTION_MESSAGE);
          // Sign out unauthorized Firebase user
          await signOutPlatform().catch(() => {});
          clearSession();
          setIsLoading(false);
          setIsAuthorizing(false);
          isVerifyingRef.current = false;
          return false;
        }

        // Retrieve cryptographic ID token
        const idToken = await firebaseUser.getIdToken();

        // Independent backend token & domain verification
        const authorizedProfile = await verifyWithBackend(idToken);

        setUser(firebaseUser);
        setProfile(authorizedProfile);
        setRole(authorizedProfile.role || 'user');
        setError(null);
        setErrorCode(null);
        setIsLoading(false);
        setIsAuthorizing(false);
        isVerifyingRef.current = false;
        return true;
      } catch (err) {
        console.error('[AuthContext] Authorization failed:', err);

        const formattedErr = formatAuthError(err);
        setError(formattedErr);
        setErrorCode(err.code || 'AUTH_ERROR');

        // Immediately revoke and sign out unauthorized user from Firebase client
        await signOutPlatform().catch(() => {});
        clearSession();
        setIsLoading(false);
        setIsAuthorizing(false);
        isVerifyingRef.current = false;
        return false;
      }
    },
    [clearSession]
  );

  /**
   * Listen to Firebase Auth state changes for session restoration.
   */
  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!isMounted) return;

      if (firebaseUser) {
        // Session restoration: verify backend authorization before displaying dashboard
        await verifyAuthorization(firebaseUser);
      } else {
        clearSession();
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [verifyAuthorization, clearSession]);

  /**
   * Trigger Google Sign-In flow
   */
  const signInWithGoogle = useCallback(async () => {
    if (isVerifyingRef.current || isAuthorizing) return;

    setError(null);
    setErrorCode(null);
    setIsAuthorizing(true);

    try {
      const authResult = await signInWithGooglePlatform();
      if (!authResult || !authResult.user) {
        // Redirect initiated or popup closed without error
        setIsAuthorizing(false);
        return;
      }

      const verified = await verifyAuthorization(authResult.user);
      return verified;
    } catch (err) {
      console.error('[AuthContext] Google Sign-in error:', err);
      const formatted = formatAuthError(err);
      setError(formatted);
      setErrorCode(err.code || 'SIGN_IN_ERROR');
      setIsAuthorizing(false);
      clearSession();
    }
  }, [isAuthorizing, verifyAuthorization, clearSession]);

  /**
   * User Sign-Out
   */
  const signOut = useCallback(async () => {
    setIsLoading(true);
    try {
      await signOutPlatform();
    } catch (err) {
      console.warn('[AuthContext] Sign out error:', err);
    } finally {
      clearSession();
      setError(null);
      setErrorCode(null);
      setIsLoading(false);
      setIsAuthorizing(false);
    }
  }, [clearSession]);

  /**
   * Refresh current profile
   */
  const refreshUserProfile = useCallback(async () => {
    if (auth.currentUser) {
      await verifyAuthorization(auth.currentUser);
    }
  }, [verifyAuthorization]);

  const value = {
    user,
    profile,
    role,
    isLoading,
    isAuthorizing,
    isAuthenticated: Boolean(user),
    isAuthorized: Boolean(user && profile && profile.role),
    error,
    errorCode,
    signInWithGoogle,
    verifyAuthorization,
    refreshUserProfile,
    signOut,
    clearError: () => {
      setError(null);
      setErrorCode(null);
    }
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
