import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../styles/colors.js';
import typography from '../styles/typography.js';
import { spacing, borderRadius, shadows } from '../styles/spacing.js';
import { useAuth } from '../hooks/useAuth.js';
import AppLayout from '../components/layout/AppLayout.jsx';

export function AccessDeniedScreen({ onNavigateLogin }) {
  const { signInWithGoogle, isAuthorizing } = useAuth();

  return (
    <AppLayout showHeader={false}>
      <View style={styles.centerContainer}>
        <View style={styles.card}>
          {/* Security Shield Lock */}
          <View style={styles.lockBadge}>
            <Text style={styles.lockIcon}>🔒</Text>
          </View>

          <Text style={styles.title}>Access Denied</Text>

          {/* EXACT REQUIRED RESTRICTION MESSAGE */}
          <View style={styles.messageBanner}>
            <Text style={styles.exactMessage}>
              Access restricted. Please login using your official domain email.
            </Text>
          </View>

          <Text style={styles.details}>
            This application is exclusively reserved for members of the authorized corporate domain (@hbplus.fit).
            Personal email addresses (such as Gmail, Yahoo, or other domains) cannot be authorized.
          </Text>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={signInWithGoogle}
              disabled={isAuthorizing}
              activeOpacity={0.85}
              accessibilityRole="button"
            >
              <Text style={styles.primaryButtonText}>
                {isAuthorizing ? 'Opening Google...' : 'Sign In with Official Account'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={onNavigateLogin}
              activeOpacity={0.8}
              accessibilityRole="button"
            >
              <Text style={styles.secondaryButtonText}>Return to Portal Login</Text>
            </TouchableOpacity>
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
    maxWidth: 460,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    alignItems: 'center',
    ...shadows.md
  },
  lockBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md
  },
  lockIcon: {
    fontSize: 28
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: '#991B1B',
    marginBottom: spacing.sm
  },
  messageBanner: {
    backgroundColor: '#FEF2F2',
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    marginVertical: spacing.md,
    width: '100%'
  },
  exactMessage: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: '#991B1B',
    textAlign: 'center',
    lineHeight: 20
  },
  details: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: spacing.lg
  },
  actions: {
    width: '100%'
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginBottom: spacing.sm
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold
  },
  secondaryButton: {
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.borderDark,
    paddingVertical: 12,
    borderRadius: borderRadius.md,
    alignItems: 'center'
  },
  secondaryButtonText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium
  }
});

export default AccessDeniedScreen;
