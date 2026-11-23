import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useAuth } from '../hooks/useAuth.js';
import { ROUTES } from './navigationConfig.js';
import SplashScreen from '../screens/SplashScreen.jsx';
import RoleSelectScreen from '../screens/RoleSelectScreen.jsx';
import AdminLoginScreen from '../screens/AdminLoginScreen.jsx';
import UserLoginScreen from '../screens/UserLoginScreen.jsx';
import AccessDeniedScreen from '../screens/AccessDeniedScreen.jsx';
import DashboardScreen from '../screens/DashboardScreen.jsx';
import ErrorBoundary from '../components/common/ErrorBoundary.jsx';

/**
 * Cross-Platform AuthGate & Protected Route Navigator (Section 2.5 & Section 1)
 *
 * Enforces role guards:
 * - Silent background session restoration with ZERO full-screen loading delay
 * - Signed-out users landing on protected dashboards are routed to RoleSelect (/)
 * - Non-admin users visiting admin routes are blocked
 * - Authenticated users landing on login pages are redirected to their dashboard
 * - Protected by ErrorBoundary to prevent blank/black screens on errors
 */
export function RootNavigator() {
  const { isAuthorized, isAdmin, isLoading, currentRoute, navigate } = useAuth();
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  // Route Guard Effect: enforces access rules on state change
  useEffect(() => {
    if (isLoading) return;

    if (!isAuthorized) {
      // Signed out: protect dashboard URLs
      if (
        currentRoute === ROUTES.ADMIN_DASHBOARD ||
        currentRoute === ROUTES.USER_DASHBOARD ||
        currentRoute === '/dashboard'
      ) {
        navigate(ROUTES.ROLE_SELECT);
      }
    } else {
      // Signed in: redirect away from login screens
      if (
        currentRoute === ROUTES.ROLE_SELECT ||
        currentRoute === ROUTES.LOGIN_ADMIN ||
        currentRoute === ROUTES.LOGIN_USER
      ) {
        navigate(isAdmin ? ROUTES.ADMIN_DASHBOARD : ROUTES.USER_DASHBOARD);
      } else if (currentRoute === ROUTES.ADMIN_DASHBOARD && !isAdmin) {
        navigate(ROUTES.USER_DASHBOARD);
      } else if (currentRoute === ROUTES.USER_DASHBOARD && isAdmin) {
        navigate(ROUTES.ADMIN_DASHBOARD);
      }
    }
  }, [isAuthorized, isAdmin, isLoading, currentRoute, navigate]);

  // Handle browser back/forward buttons on Web safely
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePopState = () => {
      try {
        const p = window.location.pathname || '';
        if (p === '/login/admin') navigate(ROUTES.LOGIN_ADMIN);
        else if (p === '/login/user') navigate(ROUTES.LOGIN_USER);
        else if (p === '/access-denied') navigate(ROUTES.ACCESS_DENIED);
        else if (p.startsWith('/admin')) navigate(ROUTES.ADMIN_DASHBOARD);
        else if (p.startsWith('/user') || p === '/dashboard') navigate(ROUTES.USER_DASHBOARD);
        else navigate(ROUTES.ROLE_SELECT);
      } catch (e) {
        // Safe fallback
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigate]);

  const renderCurrentScreen = () => {
    // 1. Signed In: Render Protected Dashboard (Admin or User)
    if (isAuthorized) {
      return <DashboardScreen />;
    }

    // 2. Signed Out: Route according to current public route
    if (currentRoute === ROUTES.LOGIN_ADMIN) {
      return <AdminLoginScreen />;
    }

    if (currentRoute === ROUTES.LOGIN_USER) {
      return <UserLoginScreen />;
    }

    if (currentRoute === ROUTES.ACCESS_DENIED) {
      return <AccessDeniedScreen />;
    }

    // Default: First Page is Role Select (/)
    return <RoleSelectScreen />;
  };

  return (
    <ErrorBoundary>
      <View style={styles.root}>
        {renderCurrentScreen()}
        {isSplashVisible && (
          <SplashScreen onFinish={() => setIsSplashVisible(false)} />
        )}
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F7FBFA'
  }
});

export default RootNavigator;
