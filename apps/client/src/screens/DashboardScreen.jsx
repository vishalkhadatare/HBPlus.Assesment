import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../styles/colors.js';
import typography from '../styles/typography.js';
import { spacing, borderRadius, shadows } from '../styles/spacing.js';
import { useAuth } from '../hooks/useAuth.js';
import { useDashboard } from '../hooks/useDashboard.js';
import AppLayout from '../components/layout/AppLayout.jsx';
import DashboardHeader from '../components/dashboard/DashboardHeader.jsx';
import ProfileCard from '../components/dashboard/ProfileCard.jsx';
import StatCard from '../components/dashboard/StatCard.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import ErrorMessage from '../components/common/ErrorMessage.jsx';

export function DashboardScreen() {
  const { user, profile, signOut } = useAuth();
  const { dashboardData, isLoading, error, refresh } = useDashboard();

  if (isLoading && !dashboardData) {
    return (
      <AppLayout>
        <LoadingSpinner fullScreen message="Loading secure corporate workspace..." />
      </AppLayout>
    );
  }

  const metrics = dashboardData?.metrics || [];
  const portalOverview = dashboardData?.portalOverview;
  const corporateResources = dashboardData?.corporateResources || [];

  return (
    <AppLayout>
      <View style={styles.container}>
        {/* Welcome Header */}
        <DashboardHeader displayName={profile?.displayName || user?.displayName} />

        {error ? (
          <ErrorMessage
            message={error}
            onRetry={refresh}
            retryLabel="Refresh Dashboard"
          />
        ) : null}

        {/* User Identity & Clearance Card */}
        <ProfileCard user={user} profile={profile} />

        {/* Corporate Metrics Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Corporate Metrics & Access Overview</Text>
          <View style={styles.metricsGrid}>
            {metrics.map((metric) => (
              <StatCard
                key={metric.id}
                label={metric.label}
                value={metric.value}
                change={metric.change}
              />
            ))}
          </View>
        </View>

        {/* Corporate Portal Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Authorized Corporate Resources</Text>
          <View style={styles.resourcesGrid}>
            {corporateResources.map((res) => (
              <View key={res.id} style={styles.resourceCard}>
                <View style={styles.resourceHeader}>
                  <Text style={styles.resourceCategory}>{res.category}</Text>
                  <View style={styles.resourceBadge}>
                    <Text style={styles.resourceBadgeText}>{res.status}</Text>
                  </View>
                </View>
                <Text style={styles.resourceTitle}>{res.title}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* System Assurance Information */}
        {portalOverview ? (
          <View style={styles.systemInfoCard}>
            <Text style={styles.systemInfoTitle}>Security & Audit Posture</Text>
            <View style={styles.systemInfoRow}>
              <Text style={styles.systemInfoLabel}>Organization:</Text>
              <Text style={styles.systemInfoValue}>{portalOverview.organizationName}</Text>
            </View>
            <View style={styles.systemInfoRow}>
              <Text style={styles.systemInfoLabel}>Enforced Domain:</Text>
              <Text style={styles.systemInfoValue}>@{portalOverview.enforcedDomain}</Text>
            </View>
            <View style={styles.systemInfoRow}>
              <Text style={styles.systemInfoLabel}>Portal Version:</Text>
              <Text style={styles.systemInfoValue}>{portalOverview.portalVersion}</Text>
            </View>
            <View style={styles.systemInfoRow}>
              <Text style={styles.systemInfoLabel}>System Status:</Text>
              <Text style={styles.systemInfoValueSuccess}>● {portalOverview.systemStatus}</Text>
            </View>
          </View>
        ) : null}

        {/* Logout Callout */}
        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={signOut}
            activeOpacity={0.8}
            accessibilityRole="button"
          >
            <Text style={styles.signOutButtonText}>Sign Out from HBPlus Access</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md
  },
  section: {
    marginBottom: spacing.xl
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.sm
  },
  resourcesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.sm
  },
  resourceCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    margin: spacing.sm,
    flex: 1,
    minWidth: 240,
    ...shadows.sm
  },
  resourceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs
  },
  resourceCategory: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    textTransform: 'uppercase',
    fontWeight: typography.weights.semibold
  },
  resourceBadge: {
    backgroundColor: colors.successSubtle,
    borderRadius: borderRadius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2
  },
  resourceBadgeText: {
    fontSize: 10,
    color: colors.success,
    fontWeight: typography.weights.bold
  },
  resourceTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    marginTop: 4
  },
  systemInfoCard: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.xl
  },
  systemInfoTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm
  },
  systemInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4
  },
  systemInfoLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary
  },
  systemInfoValue: {
    fontSize: typography.sizes.xs,
    color: colors.textPrimary,
    fontWeight: typography.weights.semibold
  },
  systemInfoValueSuccess: {
    fontSize: typography.sizes.xs,
    color: colors.success,
    fontWeight: typography.weights.bold
  },
  logoutSection: {
    alignItems: 'center',
    marginVertical: spacing.lg
  },
  signOutButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.borderDark,
    backgroundColor: colors.surface
  },
  signOutButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary
  }
});

export default DashboardScreen;
