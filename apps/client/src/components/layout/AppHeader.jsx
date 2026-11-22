import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import colors from '../../styles/colors.js';
import typography from '../../styles/typography.js';
import { spacing, borderRadius, shadows } from '../../styles/spacing.js';
import { useAuth } from '../../hooks/useAuth.js';

export function AppHeader() {
  const { isAuthorized, profile, signOut } = useAuth();

  return (
    <View style={styles.header}>
      <View style={styles.innerContainer}>
        {/* Brand / Logo */}
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>HB+</Text>
          </View>
          <View>
            <Text style={styles.brandTitle}>HBPlus</Text>
            <Text style={styles.brandSubtitle}>Secure Access Portal</Text>
          </View>
        </View>

        {/* Right Action: User Info & Logout */}
        {isAuthorized ? (
          <View style={styles.userSection}>
            <View style={styles.userInfo}>
              <Text style={styles.userName} numberOfLines={1}>
                {profile?.displayName || 'Authorized User'}
              </Text>
              <Text style={styles.userRole}>
                {profile?.role === 'admin' ? 'Administrator' : 'Staff Member'}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={signOut}
              accessibilityRole="button"
              accessibilityLabel="Sign Out"
              activeOpacity={0.8}
            >
              <Text style={styles.logoutText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
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
    maxWidth: 1200,
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
    width: 38,
    height: 38,
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
  userSection: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  userInfo: {
    marginRight: spacing.md,
    alignItems: 'flex-end'
  },
  userName: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    maxWidth: 160
  },
  userRole: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted
  },
  logoutButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.borderDark,
    backgroundColor: colors.surfaceSubtle
  },
  logoutText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary
  }
});

export default AppHeader;
