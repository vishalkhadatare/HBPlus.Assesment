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
      <View style={styles.centerContainer}>
        <View style={styles.card}>
          {/* Brand Badge */}
          <View style={styles.brandContainer}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoText}>HB+</Text>
            </View>
            <Text style={styles.title}>HBPlus Secure Access</Text>
            <Text style={styles.subtitle}>
              Official Corporate Single Sign-On Portal
            </Text>
          </View>

          {/* Restriction Notice */}
          <View style={styles.domainBanner}>
            <Text style={styles.domainBannerTitle}>Restricted Access System</Text>
            <Text style={styles.domainBannerText}>
              Access to this portal is restricted exclusively to authorized employees and administrators with an active corporate account.
            </Text>
          </View>

          {/* Inline Error Message */}
          {error ? (
            <ErrorMessage
              message={error}
              code={errorCode}
              onRetry={clearError}
              retryLabel="Dismiss & Retry"
            />
          ) : null}

          {/* Google Sign-In Action */}
          <View style={styles.actionSection}>
            <GoogleSignInButton
              onPress={signInWithGoogle}
              isLoading={isAuthorizing}
              disabled={isAuthorizing}
            />
            <Text style={styles.helperText}>
              Use your official <Text style={styles.boldDomain}>@hbplus.fit</Text> account.
            </Text>
          </View>

          {/* Security Assurance */}
          <View style={styles.securityFooter}>
            <Text style={styles.securityLock}>🔒</Text>
            <Text style={styles.securityText}>
              Cryptographically verified via Firebase & Google OAuth 2.0
            </Text>
          </View>
        </View>
      </View>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 440,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.md
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg
  },
  logoBadge: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md
  },
  logoText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 22,
    letterSpacing: -0.5
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center'
  },
  domainBanner: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg
  },
  domainBannerTitle: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4
  },
  domainBannerText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    lineHeight: 18
  },
  actionSection: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    alignItems: 'center'
  },
  helperText: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    marginTop: spacing.md,
    textAlign: 'center'
  },
  boldDomain: {
    fontWeight: typography.weights.bold,
    color: colors.primary
  },
  securityFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
  securityLock: {
    fontSize: 12,
    marginRight: 6
  },
  securityText: {
    fontSize: 11,
    color: colors.textMuted
  }
});

export default LoginScreen;
