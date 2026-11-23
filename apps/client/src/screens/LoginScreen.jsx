import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../styles/colors.js';
import typography from '../styles/typography.js';
import { spacing, borderRadius, shadows } from '../styles/spacing.js';
import { useAuth } from '../hooks/useAuth.js';
import GoogleSignInButton from '../components/auth/GoogleSignInButton.jsx';
import ErrorMessage from '../components/common/ErrorMessage.jsx';
import AppLayout from '../components/layout/AppLayout.jsx';

export function LoginScreen() {
  const {
    signInWithGoogle,
    signInWithDemoAccount,
    isAuthorizing,
    error,
    errorCode,
    clearError,
    devAllowAnyGoogle,
    setDevAllowAnyGoogle
  } = useAuth();

  return (
    <AppLayout showHeader={false}>
      <View style={styles.centerWrapper}>
        <View style={styles.card}>
          {/* Minimal Fitness-Tech Brand Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoText}>HB+</Text>
            </View>
          </View>

          {/* Clean Titles */}
          <Text style={styles.title}>HBPlus Access</Text>
          <Text style={styles.subtitle}>
            Sign in with your @hbplus.fit Google account
          </Text>

          {/* Clean Alert Banner for Domain Restriction & Errors */}
          {error ? (
            <ErrorMessage
              message={error}
              code={errorCode}
              onRetry={clearError}
              retryLabel="Dismiss"
            />
          ) : null}

          {/* Google Sign-In Action */}
          <View style={styles.actionContainer}>
            <GoogleSignInButton
              onPress={signInWithGoogle}
              isLoading={isAuthorizing}
              disabled={isAuthorizing}
            />
          </View>

          {/* Subtle Domain Requirement Note */}
          <View style={styles.domainRequirementBox}>
            <Text style={styles.domainRequirementText}>
              Restricted portal. Only authenticated <Text style={styles.domainHighlight}>@hbplus.fit</Text> accounts will be granted access.
            </Text>
          </View>

          {/* Live Testing & Firestore Verification Panel */}
          <View style={styles.devBox}>
            <Text style={styles.devTitle}>🛠️ Live Firestore Testing Tools</Text>
            <Text style={styles.devSubtitle}>
              Test live Firestore storage & dashboard access without an @hbplus.fit Google inbox:
            </Text>

            <View style={styles.devButtonsCol}>
              <TouchableOpacity
                style={styles.devButton}
                onPress={() => signInWithDemoAccount('employee@hbplus.fit', 'User')}
                disabled={isAuthorizing}
                activeOpacity={0.8}
              >
                <Text style={styles.devButtonText}>⚡ 1-Click Test Employee (@hbplus.fit)</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.devButton, styles.devButtonAdmin]}
                onPress={() => signInWithDemoAccount('admin@hbplus.fit', 'Admin')}
                disabled={isAuthorizing}
                activeOpacity={0.8}
              >
                <Text style={[styles.devButtonText, styles.devButtonTextAdmin]}>⚡ 1-Click Test Admin (@hbplus.fit)</Text>
              </TouchableOpacity>
            </View>

            {/* Optional Personal Google Account Bypass for live testing */}
            <TouchableOpacity
              style={styles.toggleRow}
              onPress={() => setDevAllowAnyGoogle(!devAllowAnyGoogle)}
              activeOpacity={0.8}
            >
              <View style={[styles.checkbox, devAllowAnyGoogle && styles.checkboxActive]}>
                {devAllowAnyGoogle ? <Text style={styles.checkmark}>✓</Text> : null}
              </View>
              <Text style={styles.toggleLabel}>
                Allow personal Google login for this test session
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  centerWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 440,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    ...shadows.md
  },
  logoContainer: {
    marginBottom: spacing.md
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm
  },
  logoText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 24,
    letterSpacing: -0.5
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 6
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg
  },
  actionContainer: {
    width: '100%',
    marginVertical: spacing.sm
  },
  domainRequirementBox: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    width: '100%'
  },
  domainRequirementText: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18
  },
  domainHighlight: {
    fontWeight: typography.weights.bold,
    color: colors.primaryHover
  },
  // Testing panel styles
  devBox: {
    marginTop: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    width: '100%'
  },
  devTitle: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4
  },
  devSubtitle: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    lineHeight: 16,
    marginBottom: spacing.md
  },
  devButtonsCol: {
    gap: 8,
    marginBottom: spacing.sm
  },
  devButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: borderRadius.md,
    alignItems: 'center'
  },
  devButtonText: {
    color: colors.primaryHover,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold
  },
  devButtonAdmin: {
    borderColor: '#FDE68A',
    backgroundColor: '#FFFBEB'
  },
  devButtonTextAdmin: {
    color: '#92400E'
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.borderDark,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    lineHeight: 14
  },
  toggleLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    flex: 1
  }
});

export default LoginScreen;
