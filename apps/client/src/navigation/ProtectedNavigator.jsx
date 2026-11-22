import React from 'react';
import { useAuth } from '../hooks/useAuth.js';
import DashboardScreen from '../screens/DashboardScreen.jsx';
import LoginScreen from '../screens/LoginScreen.jsx';
import AccessDeniedScreen from '../screens/AccessDeniedScreen.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';

/**
 * Protected Navigator that strictly requires verified domain authorization.
 */
export function ProtectedNavigator({ onNavigateLogin }) {
  const { isAuthorized, isLoading, errorCode } = useAuth();

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Verifying session authorization..." />;
  }

  if (errorCode === 'DOMAIN_NOT_ALLOWED') {
    return <AccessDeniedScreen onNavigateLogin={onNavigateLogin} />;
  }

  if (!isAuthorized) {
    return <LoginScreen />;
  }

  return <DashboardScreen />;
}

export default ProtectedNavigator;
