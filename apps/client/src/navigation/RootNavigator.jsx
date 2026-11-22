import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { ROUTES } from './navigationConfig.js';
import LoginScreen from '../screens/LoginScreen.jsx';
import DashboardScreen from '../screens/DashboardScreen.jsx';
import AccessDeniedScreen from '../screens/AccessDeniedScreen.jsx';
import NotFoundScreen from '../screens/NotFoundScreen.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';

/**
 * Cross-Platform Root Navigator
 * Coordinates screens based on authentication state and browser path/history.
 */
export function RootNavigator() {
  const { isAuthorized, isLoading, errorCode, clearError } = useAuth();
  const [currentRoute, setCurrentRoute] = useState(ROUTES.LOGIN);

  // Sync route with authentication state
  useEffect(() => {
    if (isLoading) return;

    if (errorCode === 'DOMAIN_NOT_ALLOWED') {
      setCurrentRoute(ROUTES.ACCESS_DENIED);
    } else if (isAuthorized) {
      setCurrentRoute(ROUTES.DASHBOARD);
    } else {
      setCurrentRoute(ROUTES.LOGIN);
    }
  }, [isAuthorized, isLoading, errorCode]);

  // Synchronize browser URL bar on web without full reload
  useEffect(() => {
    if (typeof window !== 'undefined' && window.history) {
      let path = '/';
      if (currentRoute === ROUTES.DASHBOARD) path = '/dashboard';
      if (currentRoute === ROUTES.ACCESS_DENIED) path = '/access-denied';
      if (currentRoute === ROUTES.LOGIN) path = '/login';

      if (window.location.pathname !== path) {
        window.history.replaceState({}, '', path);
      }
    }
  }, [currentRoute]);

  // Handle Initial Application Loading
  if (isLoading) {
    return <LoadingSpinner fullScreen message="Initializing HBPlus Secure Access Portal..." />;
  }

  const navigateToLogin = () => {
    clearError();
    setCurrentRoute(ROUTES.LOGIN);
  };

  const navigateToHome = () => {
    if (isAuthorized) {
      setCurrentRoute(ROUTES.DASHBOARD);
    } else {
      setCurrentRoute(ROUTES.LOGIN);
    }
  };

  switch (currentRoute) {
    case ROUTES.DASHBOARD:
      return isAuthorized ? <DashboardScreen /> : <LoginScreen />;
    case ROUTES.ACCESS_DENIED:
      return <AccessDeniedScreen onNavigateLogin={navigateToLogin} />;
    case ROUTES.NOT_FOUND:
      return <NotFoundScreen onNavigateHome={navigateToHome} />;
    case ROUTES.LOGIN:
    default:
      return isAuthorized ? <DashboardScreen /> : <LoginScreen />;
  }
}

export default RootNavigator;
