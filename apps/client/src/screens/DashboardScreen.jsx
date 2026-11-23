import React from 'react';
import { View, StyleSheet } from 'react-native';
import colors from '../styles/colors.js';
import { spacing } from '../styles/spacing.js';
import { useAuth } from '../hooks/useAuth.js';
import AppLayout from '../components/layout/AppLayout.jsx';
import DashboardHeader from '../components/dashboard/DashboardHeader.jsx';
import ProfileCard from '../components/dashboard/ProfileCard.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import ErrorMessage from '../components/common/ErrorMessage.jsx';

export function DashboardScreen() {
  const { user, profile, isLoading, error, clearError } = useAuth();

  if (isLoading && !profile && !user) {
    return (
      <AppLayout>
        <LoadingSpinner fullScreen message="Loading secure corporate workspace..." />
      </AppLayout>
    );
  }

  return (
    <AppLayout showHeader={true}>
      <View style={styles.container}>
        {/* Welcome Greeting */}
        <DashboardHeader displayName={profile?.displayName || user?.displayName} />

        {error ? (
          <ErrorMessage
            message={error}
            onRetry={clearError}
            retryLabel="Dismiss"
          />
        ) : null}

        {/* Single Well-Designed User Profile Card */}
        <ProfileCard user={user} profile={profile} />
      </View>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.lg,
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center'
  }
});

export default DashboardScreen;
