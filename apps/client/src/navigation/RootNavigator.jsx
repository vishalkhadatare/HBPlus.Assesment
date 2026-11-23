import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useAuth } from '../hooks/useAuth.js';
import { ROUTES } from './navigationConfig.js';
import RoleSelectScreen from '../screens/RoleSelectScreen.jsx';
import AdminLoginScreen from '../screens/AdminLoginScreen.jsx';
import UserLoginScreen from '../screens/UserLoginScreen.jsx';
import AccessDeniedScreen from '../screens/AccessDeniedScreen.jsx';
import DashboardScreen from '../screens/DashboardScreen.jsx';
import HBLogo from '../components/brand/HBLogo.jsx';

/**
 * Cross-Platform AuthGate & Protected Route Navigator (Section 2.5)
 * 
 * Enforces role guards:
 * - Signed-out users landing on protected dashboards are routed to RoleSelect (/)
 * - Non-admin users visiting admin routes are blocked
 * - Authenticated users landing on login pages are redirected to their dashboard
 * - Synchronizes browser URL bar without page refresh
 */
export function RootNavigator() {
  const { isAuthorized, isAdmin, isLoading, currentRoute, navigate } = useAuth();

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
        // Non-admin attempting to access admin dashboard
        navigate(ROUTES.USER_DASHBOARD);
      } else if (currentRoute === ROUTES.USER_DASHBOARD && isAdmin) {
        navigate(ROUTES.ADMIN_DASHBOARD);
      }
    }
  }, [isAuthorized, isAdmin, isLoading, currentRoute, navigate]);

  // Handle browser back/forward buttons on Web
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePopState = () => {
      const p = window.location.pathname;
      if (p === '/login/admin') navigate(ROUTES.LOGIN_ADMIN);
      else if (p === '/login/user') navigate(ROUTES.LOGIN_USER);
      else if (p === '/access-denied') navigate(ROUTES.ACCESS_DENIED);
      else if (p.startsWith('/admin')) navigate(ROUTES.ADMIN_DASHBOARD);
      else if (p.startsWith('/user') || p === '/dashboard') navigate(ROUTES.USER_DASHBOARD);
      else navigate(ROUTES.ROLE_SELECT);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigate]);

  // Initial Auth Bootstrapping Splash Screen (Section 2.6)
  if (isLoading) {
    return (
      <View style={styles.splashRoot}>
        <HBLogo size={64} />
        <View style={styles.splashTextRow}>
          <ActivityIndicator size="small" color="#00B386" />
          <Text style={styles.splashText}>Checking credentials...</Text>
        </View>
      </View>
    );
  }

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
}

const styles = StyleSheet.create({
  splashRoot: {
    flex: 1,
    backgroundColor: '#04100E',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16
  },
  splashTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  splashText: {
    color: '#ECFBF6',
    fontSize: 14,
    fontWeight: '600'
  }
});

export default RootNavigator;
