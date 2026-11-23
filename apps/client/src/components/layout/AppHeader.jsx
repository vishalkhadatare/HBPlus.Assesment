import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../../styles/colors.js';
import typography from '../../styles/typography.js';
import { spacing, borderRadius, shadows } from '../../styles/spacing.js';
import { useAuth } from '../../hooks/useAuth.js';

export function AppHeader() {
  const { isAuthorized, signOut } = useAuth();

  return (
    <View style={styles.header}>
      <View style={styles.innerContainer}>
        {/* Brand / Logo */}
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>HB+</Text>
          </View>
          <View>
            <Text style={styles.brandTitle}>HBPlus Access</Text>
            <Text style={styles.brandSubtitle}>Secure Corporate Portal</Text>
          </View>
        </View>

        {/* Single Clean Sign Out Button */}
        {isAuthorized ? (
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={signOut}
            accessibilityRole="button"
            accessibilityLabel="Sign Out"
            activeOpacity={0.8}
          >
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    ...shadows.sm,
    zIndex: 10
  },
  innerContainer: {
    maxWidth: 1000,
    width: '100%',
    marginHorizontal: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm
  },
  logoText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: -0.5
  },
  brandTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    lineHeight: 18
  },
  brandSubtitle: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted
  },
  signOutButton: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.borderDark,
    backgroundColor: colors.surfaceSubtle
  },
  signOutText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary
  }
});

export default AppHeader;
