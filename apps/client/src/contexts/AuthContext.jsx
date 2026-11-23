import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase.js';
import {
  signInWithGooglePlatform,
  verifyWithBackend,
  signOutPlatform,
  checkRedirectResultPlatform
} from '../services/authService.js';
import { formatAuthError, EXACT_RESTRICTION_MESSAGE } from '../utils/errorFormatter.js';
import { isAllowedEmailDomain } from '../utils/domainValidator.js';
import config from '../config/environment.js';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Firebase user
  const [profile, setProfile] = useState(null); // Backend authorized profile
  const [role, setRole] = useState(null); // 'Admin' | 'User'
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [error, setError] = useState(null);
  const [errorCode, setErrorCode] = useState(null);

  const isVerifyingRef = useRef(false);

  /**
   * Clears all session data in memory.
   */
  const clearSession = useCallback(() => {
    setUser(null);
    setProfile(null);
    setRole(null);
  }, []);

  /**
   * Verifies the user's authorization against the strict @hbplus.fit domain.
   * If domain is not @hbplus.fit, immediately revokes access, signs out from Firebase,
   * clears session, and keeps the user on the Login page with the exact restriction message.
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
        const rawEmail = firebaseUser.email || '';
        const normalizedEmail = rawEmail.trim().toLowerCase();

        // 1. Strict Domain Check: email MUST end with @hbplus.fit
        const isDomainValid =
          normalizedEmail.endsWith('@hbplus.fit') &&
          isAllowedEmailDomain(normalizedEmail, config.ALLOWED_EMAIL_DOMAIN);

        if (!isDomainValid) {
          // Immediately revoke session, sign out of Firebase, and display exact error banner
          await signOutPlatform().catch(() => {});
          clearSession();
          setErrorCode('DOMAIN_NOT_ALLOWED');
          setError(EXACT_RESTRICTION_MESSAGE);
          setIsLoading(false);
          setIsAuthorizing(false);
          isVerifyingRef.current = false;
          return false;
        }

        // 2. Retrieve cryptographic ID token
        const idToken = await firebaseUser.getIdToken();

        // 3. Verify independently with backend (also provisions user in Firestore)
        const authorizedProfile = await verifyWithBackend(idToken);

        const normalizedRole =
          (authorizedProfile?.role || 'user').toLowerCase() === 'admin' ? 'Admin' : 'User';

        setUser(firebaseUser);
        setProfile(authorizedProfile);
        setRole(normalizedRole);
        setError(null);
        setErrorCode(null);
        setIsLoading(false);
        setIsAuthorizing(false);
        isVerifyingRef.current = false;
        return true;
      } catch (err) {
        console.error('[AuthContext] Verification failed:', err);

        // Always sign out on error to prevent any unauthorized session
        await signOutPlatform().catch(() => {});
        clearSession();

        const formattedErr = formatAuthError(err);
        setError(formattedErr || EXACT_RESTRICTION_MESSAGE);
        setErrorCode(err.code || 'AUTH_ERROR');
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

    // Check for redirect result on web first
    checkRedirectResultPlatform()
      .then((res) => {
        if (isMounted && res?.user) {
          verifyAuthorization(res.user);
        }
      })
      .catch((e) => console.warn('[AuthContext] Redirect check:', e));

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!isMounted) return;

      if (firebaseUser) {
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
   * Google Sign-In action
   */
  const signInWithGoogle = useCallback(async () => {
    if (isVerifyingRef.current || isAuthorizing) return;

    setError(null);
    setErrorCode(null);
    setIsAuthorizing(true);

    try {
      const authResult = await signInWithGooglePlatform();
      if (!authResult || !authResult.user) {
        setIsAuthorizing(false);
        return;
      }

      const verified = await verifyAuthorization(authResult.user);
      return verified;
    } catch (err) {
      console.error('[AuthContext] Google Sign-In error:', err);
      // Immediately ensure signed out
      await signOutPlatform().catch(() => {});
      clearSession();

      const formatted = formatAuthError(err);
      setError(formatted || EXACT_RESTRICTION_MESSAGE);
      setErrorCode(err.code || 'SIGN_IN_ERROR');
      setIsAuthorizing(false);
    }
  }, [isAuthorizing, verifyAuthorization, clearSession]);

  /**
   * Sign-Out action
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

  const value = {
    user,
    profile,
    role, // 'Admin' | 'User'
    isLoading,
    isAuthorizing,
    isAuthenticated: Boolean(user),
    isAuthorized: Boolean(user && profile && (user.email || '').toLowerCase().endsWith('@hbplus.fit')),
    error,
    errorCode,
    signInWithGoogle,
    signOut,
    clearError: () => {
      setError(null);
      setErrorCode(null);
    }
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
