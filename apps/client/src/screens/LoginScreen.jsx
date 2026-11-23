import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../styles/colors.js';
import typography from '../styles/typography.js';
import { spacing, borderRadius, shadows } from '../styles/spacing.js';
import { useAuth } from '../hooks/useAuth.js';
import GoogleSignInButton from '../components/auth/GoogleSignInButton.jsx';
import ErrorMessage from '../components/common/ErrorMessage.jsx';
import AppLayout from '../components/layout/AppLayout.jsx';

export function LoginScreen() {
  const { signInWithGoogle, isAuthorizing, error, errorCode, clearError } = useAuth();

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
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.md
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 420,
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
    marginTop: spacing.lg,
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
  }
});

export default LoginScreen;
