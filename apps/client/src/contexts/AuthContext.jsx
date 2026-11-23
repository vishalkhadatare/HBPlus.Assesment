import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase.js';
import {
  signInWithGooglePlatform,
  signInWithEmailPlatform,
  signUpWithEmailPlatform,
  sendPasswordResetPlatform,
  provisionWithBackend,
  verifyWithBackend,
  signOutPlatform,
  checkRedirectResultPlatform
} from '../services/authService.js';
import { isAllowedEmail } from '../utils/domainValidator.js';
import { ROUTES } from '../navigation/navigationConfig.js';

export const EXACT_RESTRICTION_MESSAGE = 'Access restricted. Please login using your official domain email.';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Firebase user
  const [profile, setProfile] = useState(null); // Firestore profile
  const [role, setRole] = useState(null); // 'admin' | 'user' | null
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [error, setError] = useState(null);
  const [rejectedEmail, setRejectedEmail] = useState('');
  const [denialReason, setDenialReason] = useState('');

  // Routing State for cross-platform navigation
  const [currentRoute, setCurrentRoute] = useState(() => {
    if (typeof window !== 'undefined' && window.location.pathname) {
      const p = window.location.pathname;
      if (p === '/login/admin') return ROUTES.LOGIN_ADMIN;
      if (p === '/login/user') return ROUTES.LOGIN_USER;
      if (p === '/access-denied') return ROUTES.ACCESS_DENIED;
      if (p.startsWith('/(admin)') || p.startsWith('/admin')) return ROUTES.ADMIN_DASHBOARD;
      if (p.startsWith('/(user)') || p.startsWith('/user') || p === '/dashboard') return ROUTES.USER_DASHBOARD;
      return ROUTES.ROLE_SELECT;
    }
    return ROUTES.ROLE_SELECT;
  });

  const navigate = useCallback((targetRoute) => {
    setCurrentRoute(targetRoute);
    if (typeof window !== 'undefined' && window.history) {
      try {
        const webPath = targetRoute === ROUTES.ADMIN_DASHBOARD
          ? '/admin/dashboard'
          : targetRoute === ROUTES.USER_DASHBOARD
          ? '/user/dashboard'
          : targetRoute;
        if (window.location.pathname !== webPath) {
          window.history.pushState({}, '', webPath);
        }
      } catch (err) {
        // Suppress pushState restrictions in native Capacitor/WebView
      }
    }
  }, []);

  const clearSession = useCallback(() => {
    setUser(null);
    setProfile(null);
    setRole(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Triggers full-screen Access Denied state
   */
  const triggerAccessDenied = useCallback((rawEmail = '', reason = EXACT_RESTRICTION_MESSAGE) => {
    // Mask email for display: e.g. "ex****@gmail.com"
    let masked = '';
    if (rawEmail && rawEmail.includes('@')) {
      const [local, dom] = rawEmail.split('@');
      masked = local.length > 2
        ? `${local.slice(0, 2)}${'*'.repeat(Math.max(2, local.length - 2))}@${dom}`
        : `${local[0]}*@${dom}`;
    }

    setRejectedEmail(masked || rawEmail);
    setDenialReason(reason);
    clearSession();
    navigate(ROUTES.ACCESS_DENIED);
  }, [clearSession, navigate]);

  /**
   * ADMIN LOGIN (Email + Password only. Section 2.3)
   */
  const signInAdmin = useCallback(async (email, password) => {
    setError(null);
    setIsAuthorizing(true);

    try {
      const normalizedEmail = (email || '').trim().toLowerCase();

      // 1. Client-side Domain Validation
      if (!isAllowedEmail(normalizedEmail)) {
        triggerAccessDenied(normalizedEmail, EXACT_RESTRICTION_MESSAGE);
        throw new Error(EXACT_RESTRICTION_MESSAGE);
      }

      if (!password || password.length < 8) {
        throw new Error('Password must be at least 8 characters long.');
      }

      // 2. Firebase Authentication
      const { user: firebaseUser } = await signInWithEmailPlatform(normalizedEmail, password);

      // 3. Force-refresh token and check custom claim
      const idTokenResult = await firebaseUser.getIdTokenResult(true);
      const userClaimRole = (idTokenResult.claims.role || '').toLowerCase();

      if (userClaimRole !== 'admin') {
        // Sign out immediately and show denied message
        await signOutPlatform().catch(() => {});
        triggerAccessDenied(normalizedEmail, 'This account does not have administrator access.');
        throw new Error('This account does not have administrator access.');
      }

      // 4. Verify independently with backend
      const backendRes = await verifyWithBackend(idTokenResult.token);
      const userProfile = backendRes?.data || backendRes;

      setUser(firebaseUser);
      setProfile(userProfile);
      setRole('admin');
      navigate(ROUTES.ADMIN_DASHBOARD);
      return true;
    } catch (err) {
      console.error('[AuthContext] Admin Login Error:', err.message);
      if (err.message.includes('administrator access') || err.message === EXACT_RESTRICTION_MESSAGE) {
        throw err;
      }
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        throw new Error('Incorrect email or password.');
      }
      if (err.code === 'auth/too-many-requests') {
        throw new Error('Too many attempts. Try again in a few minutes.');
      }
      throw new Error(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsAuthorizing(false);
    }
  }, [navigate, triggerAccessDenied]);

  /**
   * USER GOOGLE LOGIN (Continue with Google. Section 2.3)
   */
  const signInUserWithGoogle = useCallback(async () => {
    setError(null);
    setIsAuthorizing(true);

    try {
      const authResult = await signInWithGooglePlatform();
      if (!authResult || !authResult.user) {
        setIsAuthorizing(false);
        return;
      }

      const { user: firebaseUser, idToken } = authResult;
      const normalizedEmail = (firebaseUser.email || '').trim().toLowerCase();

      // 1. Immediate client-side domain check
      if (!isAllowedEmail(normalizedEmail)) {
        await signOutPlatform().catch(() => {});
        triggerAccessDenied(normalizedEmail, EXACT_RESTRICTION_MESSAGE);
        throw new Error(EXACT_RESTRICTION_MESSAGE);
      }

      // 2. Re-verify on server and provision profile (sets claims, creates/updates users/{uid})
      let userProfile;
      try {
        const provisionRes = await provisionWithBackend(idToken);
        userProfile = provisionRes?.data || provisionRes;
      } catch (backendErr) {
        console.error('[AuthContext] Provision error:', backendErr.message);
        await signOutPlatform().catch(() => {});
        triggerAccessDenied(normalizedEmail, EXACT_RESTRICTION_MESSAGE);
        throw new Error(EXACT_RESTRICTION_MESSAGE);
      }

      // 3. Force-refresh token to read fresh custom claims
      const freshTokenResult = await firebaseUser.getIdTokenResult(true);

      setUser(firebaseUser);
      setProfile(userProfile);
      setRole('user');
      navigate(ROUTES.USER_DASHBOARD);
      return true;
    } catch (err) {
      console.error('[AuthContext] Google Sign-In Error:', err.message);
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        throw new Error('Sign-in was cancelled.');
      }
      if (err.code === 'auth/network-request-failed') {
        throw new Error('Cannot reach the server. Check your connection.');
      }
      throw err;
    } finally {
      setIsAuthorizing(false);
    }
  }, [navigate, triggerAccessDenied]);

  /**
   * USER EMAIL LOGIN (Email + Password. Section 2.3)
   */
  const signInUserWithPassword = useCallback(async (email, password) => {
    setError(null);
    setIsAuthorizing(true);

    try {
      const normalizedEmail = (email || '').trim().toLowerCase();

      // 1. Client-side Domain Validation
      if (!isAllowedEmail(normalizedEmail)) {
        triggerAccessDenied(normalizedEmail, EXACT_RESTRICTION_MESSAGE);
        throw new Error(EXACT_RESTRICTION_MESSAGE);
      }

      if (!password || password.length < 8) {
        throw new Error('Password must be at least 8 characters long.');
      }

      // 2. Firebase Authentication
      const { user: firebaseUser } = await signInWithEmailPlatform(normalizedEmail, password);

      if (!firebaseUser.emailVerified) {
        await signOutPlatform().catch(() => {});
        throw new Error('Please verify your employee email before signing in. Check your inbox for the verification link.');
      }

      // 3. Verify user claim
      const idTokenResult = await firebaseUser.getIdTokenResult(true);
      const userClaimRole = (idTokenResult.claims.role || '').toLowerCase();

      if (userClaimRole === 'admin') {
        // An admin trying User page is directed to the Admin page
        await signOutPlatform().catch(() => {});
        throw new Error('This account is an Administrator. Please use the Admin sign in page.');
      }

      // 4. Provision & verify with backend
      const provisionRes = await provisionWithBackend(idTokenResult.token);
      const userProfile = provisionRes?.data || provisionRes;

      setUser(firebaseUser);
      setProfile(userProfile);
      setRole('user');
      navigate(ROUTES.USER_DASHBOARD);
      return true;
    } catch (err) {
      console.error('[AuthContext] User Password Login Error:', err.message);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        throw new Error('Incorrect email or password.');
      }
      if (err.code === 'auth/too-many-requests') {
        throw new Error('Too many attempts. Try again in a few minutes.');
      }
      throw err;
    } finally {
      setIsAuthorizing(false);
    }
  }, [navigate, triggerAccessDenied]);

  /**
   * EMPLOYEE SIGN UP
   * Creates Firebase credentials and writes the employee profile to Firestore.
   */
  const signUpEmployee = useCallback(async ({ fullName, emailLocal, phone, countryCode, password }) => {
    setError(null);
    setIsAuthorizing(true);

    try {
      const normalizedName = (fullName || '').trim();
      const normalizedLocal = (emailLocal || '').trim().toLowerCase();
      const normalizedPhone = (phone || '').trim();
      const normalizedPassword = password || '';

      if (!normalizedName) throw new Error('Please enter the employee name.');
      if (!normalizedLocal) throw new Error('Please enter the email name.');
      if (!/^[a-z0-9._-]+$/.test(normalizedLocal)) {
        throw new Error('Email name may contain only letters, numbers, dots, hyphens and underscores.');
      }
      if (!normalizedPhone) throw new Error('Please enter the mobile number.');
      if (normalizedPassword.length < 8) {
        throw new Error('Password must be at least 8 characters long.');
      }

      const normalizedEmail = `${normalizedLocal}@hbplus.fit`;
      const result = await signUpWithEmailPlatform({
        email: normalizedEmail,
        password: normalizedPassword,
        fullName: normalizedName,
        phone: normalizedPhone,
        countryCode
      });

      if (result?.idToken) {
        await provisionWithBackend(result.idToken, {
          fullName: normalizedName,
          phone: `${countryCode} ${normalizedPhone}`,
          countryCode
        }).catch((profileError) => {
          console.warn('[AuthContext] Signup server profile provisioning fallback:', profileError.message);
        });
      }
      await signOutPlatform().catch(() => {});

      if (result?.verificationRequired) {
        return { verificationRequired: true, email: normalizedEmail };
      }
      return { verificationRequired: false, email: normalizedEmail };
    } catch (err) {
      console.error('[AuthContext] Employee Sign-Up Error:', err.message);
      if (err.code === 'auth/email-already-in-use') {
        throw new Error('This employee email is already registered.');
      }
      if (err.code === 'auth/weak-password') {
        throw new Error('Password must be at least 8 characters long.');
      }
      if (err.code === 'auth/invalid-email') {
        throw new Error('Please enter a valid employee email name.');
      }
      throw err;
    } finally {
      setIsAuthorizing(false);
    }
  }, []);

  /**
   * FORGOT PASSWORD (Domain-checked. Section 2.3)
   */
  const sendPasswordReset = useCallback(async (email) => {
    const normalizedEmail = (email || '').trim().toLowerCase();
    if (!isAllowedEmail(normalizedEmail)) {
      throw new Error(EXACT_RESTRICTION_MESSAGE);
    }
    await sendPasswordResetPlatform(normalizedEmail);
  }, []);

  /**
   * LOGOUT (Section 2.4)
   * Signs out, clears tokens, replaces navigation stack to role select.
   */
  const signOutAccount = useCallback(async () => {
    try {
      await signOutPlatform();
    } catch (err) {
      console.warn('[AuthContext] Sign out warning:', err.message);
    } finally {
      clearSession();
      setRejectedEmail('');
      setDenialReason('');
      navigate(ROUTES.ROLE_SELECT);
    }
  }, [clearSession, navigate]);

  /**
   * Listen to Firebase Auth state on mount for session restoration
   */
  useEffect(() => {
    let isMounted = true;

    // Check pending redirect result from web OAuth
    checkRedirectResultPlatform()
      .then(async (res) => {
        if (isMounted && res?.user) {
          const email = (res.user.email || '').trim().toLowerCase();
          if (!isAllowedEmail(email)) {
            await signOutPlatform().catch(() => {});
            triggerAccessDenied(email, EXACT_RESTRICTION_MESSAGE);
            return;
          }
          await provisionWithBackend(res.idToken).catch(() => {});
          const freshResult = await res.user.getIdTokenResult(true);
          const r = freshResult.claims.role === 'admin' ? 'admin' : 'user';
          setUser(res.user);
          setRole(r);
          navigate(r === 'admin' ? ROUTES.ADMIN_DASHBOARD : ROUTES.USER_DASHBOARD);
        }
      })
      .catch((e) => console.warn('[AuthContext] Redirect check:', e));

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!isMounted) return;

      if (firebaseUser) {
        const email = (firebaseUser.email || '').trim().toLowerCase();
        if (!isAllowedEmail(email)) {
          await signOutPlatform().catch(() => {});
          triggerAccessDenied(email, EXACT_RESTRICTION_MESSAGE);
          setIsLoading(false);
          return;
        }

        if (!firebaseUser.emailVerified) {
          await signOutPlatform().catch(() => {});
          clearSession();
          setIsLoading(false);
          return;
        }

        try {
          const tokenResult = await firebaseUser.getIdTokenResult();
          const r = tokenResult.claims.role === 'admin' ? 'admin' : 'user';
          const meRes = await verifyWithBackend(tokenResult.token).catch(() => null);

          setUser(firebaseUser);
          setProfile(meRes?.data || meRes);
          setRole(r);
          setIsLoading(false);
        } catch {
          clearSession();
          setIsLoading(false);
        }
      } else {
        clearSession();
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [clearSession, navigate, triggerAccessDenied]);

  /**
   * IDLE TIMEOUT (Section 2.4: 30 min for admin, 8 hours for user)
   */
  const timeoutRef = useRef(null);
  const resetIdleTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (!user) return;

    // 30 min (1,800,000 ms) for admin; 8 hours (28,800,000 ms) for user
    const idleLimitMs = role === 'admin' ? 30 * 60 * 1000 : 8 * 60 * 60 * 1000;

    timeoutRef.current = setTimeout(() => {
      console.warn(`[AuthContext] Idle timeout reached for role: ${role}`);
      signOutPlatform().catch(() => {});
      triggerAccessDenied(user.email || '', 'Your session has expired due to inactivity. Please sign in again.');
    }, idleLimitMs);
  }, [user, role, triggerAccessDenied]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach((evt) => window.addEventListener(evt, resetIdleTimer, { passive: true }));
    resetIdleTimer();

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, resetIdleTimer));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [resetIdleTimer]);

  const value = {
    user,
    profile,
    role,
    isAuthorized: !!user,
    isAdmin: role === 'admin',
    isLoading,
    isAuthorizing,
    error,
    rejectedEmail,
    denialReason,
    currentRoute,
    navigate,
    signInAdmin,
    signInUserWithGoogle,
    signInUserWithPassword,
    signUpEmployee,
    sendPasswordReset,
    signOut: signOutAccount,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
