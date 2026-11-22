import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useAuth } from '../../hooks/useAuth.js';
import LoadingSpinner from './LoadingSpinner.jsx';
import ErrorMessage from './ErrorMessage.jsx';

/**
 * Component-level route and content guard.
 */
export function ProtectedContent({
  children,
  requiredRole = null,
  fallback = null
}) {
  const { isAuthorized, isLoading, role, error, errorCode } = useAuth();

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Verifying security credentials..." />;
  }

  if (!isAuthorized) {
    if (fallback) return fallback;
    return (
      <View style={styles.container}>
        <ErrorMessage
          message={error || 'Access restricted. Please login using your official domain email.'}
          code={errorCode || 'DOMAIN_NOT_ALLOWED'}
        />
      </View>
    );
  }

  if (requiredRole && role !== requiredRole) {
    return (
      <View style={styles.container}>
        <ErrorMessage
          message="Administrative privileges required to access this resource."
          code="FORBIDDEN"
        />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    padding: 16
  }
});

export default ProtectedContent;
