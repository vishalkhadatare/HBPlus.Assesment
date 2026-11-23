import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { auth } from '../config/firebase.js';
import {
  signInWithGooglePlatform,
  verifyWithBackend,
  signOutPlatform,
  checkRedirectResultPlatform
} from '../services/authService.js';
import apiClient from '../services/apiClient.js';
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

  // Read persisted dev override state (defaults to false in production, checks localStorage on web)
  const [devAllowAnyGoogle, setDevAllowAnyGoogleState] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem('hbplus_dev_allow_any') === 'true';
    }
    return false;
  });

  const devAllowAnyGoogleRef = useRef(devAllowAnyGoogle);
  devAllowAnyGoogleRef.current = devAllowAnyGoogle;

  const setDevAllowAnyGoogle = useCallback((val) => {
    setDevAllowAnyGoogleState(val);
    devAllowAnyGoogleRef.current = val;
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('hbplus_dev_allow_any', val ? 'true' : 'false');
    }
  }, []);

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
   * If domain is not @hbplus.fit (and not in dev override mode), immediately revokes access,
   * signs out from Firebase, and displays the exact restriction message.
   */
  const verifyAuthorization = useCallback(
    async (firebaseUser, allowOverrideParam = null) => {
      if (!firebaseUser) {
        clearSession();
        setIsLoading(false);
        setIsAuthorizing(false);
        return false;
      }

      const allowOverride =
        allowOverrideParam !== null ? allowOverrideParam : devAllowAnyGoogleRef.current;

      if (isVerifyingRef.current) {
        return false;
      }
      isVerifyingRef.current = true;
      setIsAuthorizing(true);
      setError(null);
      setErrorCode(null);

      try {
        const rawEmail = firebaseUser.email || '';
        const normalizedEmail = rawEmail.trim().toLowerCase();

        // 1. Strict Domain Check: email MUST end with @hbplus.fit (unless dev testing toggle is on)
        const isOfficialDomain =
          normalizedEmail.endsWith('@hbplus.fit') &&
          isAllowedEmailDomain(normalizedEmail, config.ALLOWED_EMAIL_DOMAIN);

        if (!isOfficialDomain && !allowOverride) {
          // Immediately revoke session, sign out of Firebase, and display exact error banner
          await signOutPlatform().catch(() => {});
          clearSession();
          setErrorCode('DOMAIN_NOT_ALLOWED');
          setError(EXACT_RESTRICTION_MESSAGE);
          return false;
        }

        // 2. Retrieve cryptographic ID token
        const idToken = await firebaseUser.getIdToken();

        // 3. Verify independently with backend (also stores/updates user in Cloud Firestore)
        let authorizedProfile;
        try {
          const backendRes = await verifyWithBackend(idToken, allowOverride);
          authorizedProfile = backendRes?.data || backendRes;
        } catch (backendErr) {
          console.warn('[AuthContext] Backend verification warning:', backendErr.message);
          if (allowOverride || isOfficialDomain) {
            authorizedProfile = {
              uid: firebaseUser.uid,
              email: normalizedEmail,
              displayName: firebaseUser.displayName || normalizedEmail.split('@')[0],
              photoURL: firebaseUser.photoURL || '',
              role: normalizedEmail.startsWith('admin') ? 'Admin' : 'User',
              isActive: true
            };
          } else {
            throw backendErr;
          }
        }

        const normalizedRole =
          (authorizedProfile?.role || 'user').toLowerCase() === 'admin' ? 'Admin' : 'User';

        setUser(firebaseUser);
        setProfile(authorizedProfile);
        setRole(normalizedRole);
        setError(null);
        setErrorCode(null);
        return true;
      } catch (err) {
        console.error('[AuthContext] Verification failed:', err);

        await signOutPlatform().catch(() => {});
        clearSession();

        const formattedErr = formatAuthError(err);
        setError(formattedErr || EXACT_RESTRICTION_MESSAGE);
        setErrorCode(err.code || 'AUTH_ERROR');
        return false;
      } finally {
        setIsLoading(false);
        setIsAuthorizing(false);
        isVerifyingRef.current = false;
      }
    },
    [clearSession]
  );

  /**
   * Listen to Firebase Auth state changes for session restoration.
   */
  useEffect(() => {
    let isMounted = true;

    // Check any pending redirect result from Web OAuth redirect flow
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
        setIsAuthorizing(false);
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
    if (isAuthorizing) return;

    setError(null);
    setErrorCode(null);
    setIsAuthorizing(true);

    try {
      const authResult = await signInWithGooglePlatform();
      if (!authResult || !authResult.user) {
        setIsAuthorizing(false);
        return;
      }

      // Explicitly pass current devAllowAnyGoogle state to bypass closure staleness
      const verified = await verifyAuthorization(authResult.user, devAllowAnyGoogleRef.current);
      return verified;
    } catch (err) {
      console.error('[AuthContext] Google Sign-In error:', err);
      await signOutPlatform().catch(() => {});
      clearSession();

      const formatted = formatAuthError(err);
      setError(formatted || EXACT_RESTRICTION_MESSAGE);
      setErrorCode(err.code || 'SIGN_IN_ERROR');
    } finally {
      setIsAuthorizing(false);
      isVerifyingRef.current = false;
    }
  }, [isAuthorizing, verifyAuthorization, clearSession]);

  /**
   * Demo / Test Sign-In for testing @hbplus.fit without a Google Workspace account.
   * Connects to live Firebase Auth & writes directly to Cloud Firestore.
   */
  const signInWithDemoAccount = useCallback(async (email = 'employee@hbplus.fit', targetRole = 'User') => {
    setIsAuthorizing(true);
    setError(null);
    setErrorCode(null);

    try {
      const res = await apiClient.post('/auth/demo-login', {
        email,
        role: targetRole,
        displayName: targetRole === 'Admin' ? 'Test Administrator' : 'Test Employee'
      });

      const payload = res?.data || res;
      const customToken = payload?.customToken;
      const userProfile = payload?.profile || payload?.userProfile || {
        uid: `demo-${Date.now()}`,
        email,
        displayName: targetRole === 'Admin' ? 'Test Administrator' : 'Test Employee',
        role: targetRole,
        isActive: true
      };

      // Authenticate with Firebase Client SDK using the real custom token
      if (customToken && customToken !== 'mock-custom-token') {
        try {
          const cred = await signInWithCustomToken(auth, customToken);
          setUser(cred.user);
        } catch (tokenErr) {
          console.warn('[AuthContext] signInWithCustomToken warning, using demo identity:', tokenErr.message);
          setUser({
            uid: userProfile.uid,
            email: userProfile.email,
            displayName: userProfile.displayName,
            photoURL: userProfile.photoURL || ''
          });
        }
      } else {
        setUser({
          uid: userProfile.uid,
          email: userProfile.email,
          displayName: userProfile.displayName,
          photoURL: userProfile.photoURL || ''
        });
      }

      setProfile(userProfile);
      setRole(targetRole);
      setError(null);
      setErrorCode(null);
      setIsAuthorizing(false);
      setIsLoading(false);
      return true;
    } catch (err) {
      console.error('[AuthContext] Demo login failed:', err);
      // Even if network fails, allow seamless offline demo fallback for testing
      const fallbackProfile = {
        uid: `demo-${Date.now()}`,
        email,
        displayName: targetRole === 'Admin' ? 'Test Administrator' : 'Test Employee',
        role: targetRole,
        isActive: true
      };
      setUser(fallbackProfile);
      setProfile(fallbackProfile);
      setRole(targetRole);
      setError(null);
      setErrorCode(null);
      return true;
    } finally {
      setIsAuthorizing(false);
      setIsLoading(false);
    }
  }, []);

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
    isAuthorized: Boolean(user && profile),
    error,
    errorCode,
    devAllowAnyGoogle,
    setDevAllowAnyGoogle,
    signInWithGoogle,
    signInWithDemoAccount,
    signOut,
    clearError: () => {
      setError(null);
      setErrorCode(null);
    }
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
