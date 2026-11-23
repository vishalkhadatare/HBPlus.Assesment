import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useAuth } from '../hooks/useAuth.js';
import { ROUTES } from './navigationConfig.js';
import LoginScreen from '../screens/LoginScreen.jsx';
import DashboardScreen from '../screens/DashboardScreen.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import colors from '../styles/colors.js';

/**
 * Cross-Platform Root Navigator
 * Strictly enforces protected routes and synchronizes browser URL.
 */
export function RootNavigator() {
  const { isAuthorized, isLoading } = useAuth();
  const [currentRoute, setCurrentRoute] = useState(ROUTES.LOGIN);

  // Sync route strictly with authorization state
  useEffect(() => {
    if (isLoading) return;

    if (isAuthorized) {
      setCurrentRoute(ROUTES.DASHBOARD);
    } else {
      // If unauthorized, redirect to LOGIN
      setCurrentRoute(ROUTES.LOGIN);
    }
  }, [isAuthorized, isLoading]);

  // Synchronize browser URL bar on web without full reload
  useEffect(() => {
    if (typeof window !== 'undefined' && window.history) {
      const targetPath = isAuthorized ? '/dashboard' : '/login';

      if (window.location.pathname !== targetPath) {
        window.history.replaceState({}, '', targetPath);
      }
    }
  }, [isAuthorized]);

  // Initial authentication loading state
  if (isLoading) {
    return (
      <View style={styles.loadingWrapper}>
        <LoadingSpinner fullScreen message="Checking access credentials..." />
      </View>
    );
  }

  // Route protection: /dashboard is only rendered if isAuthorized is true
  if (isAuthorized) {
    return <DashboardScreen />;
  }

  // Default: unauthenticated users always land on LoginScreen
  return <LoginScreen />;
}

const styles = StyleSheet.create({
  loadingWrapper: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default RootNavigator;
