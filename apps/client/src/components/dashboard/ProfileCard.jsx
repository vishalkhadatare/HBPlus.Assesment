import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import colors from '../../styles/colors.js';
import typography from '../../styles/typography.js';
import { spacing, borderRadius, shadows } from '../../styles/spacing.js';

export function ProfileCard({ user, profile }) {
  const email = profile?.email || user?.email || '';
  const displayName = profile?.displayName || user?.displayName || 'Authorized Employee';
  const role = profile?.role || 'user';
  const photoURL = profile?.photoURL || user?.photoURL;
  const initial = displayName.charAt(0).toUpperCase();

  const isAdmin = role === 'admin';

  return (
    <View style={styles.card}>
      <View style={styles.profileRow}>
        {photoURL ? (
          <Image source={{ uri: photoURL }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarInitial}>{initial}</Text>
          </View>
        )}

        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.displayName}>{displayName}</Text>
            <View style={[styles.roleBadge, isAdmin ? styles.adminBadge : styles.userBadge]}>
              <Text style={[styles.roleBadgeText, isAdmin ? styles.adminBadgeText : styles.userBadgeText]}>
                {role.toUpperCase()}
              </Text>
            </View>
          </View>

          <Text style={styles.email}>{email}</Text>

          <View style={styles.domainVerifiedRow}>
            <Text style={styles.checkIcon}>✓</Text>
            <Text style={styles.verifiedText}>Domain Verified (@hbplus.fit)</Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.footerRow}>
        <View style={styles.statusItem}>
          <Text style={styles.statusLabel}>Access Status</Text>
          <Text style={styles.statusValueActive}>● Active & Authorized</Text>
        </View>
        <View style={styles.statusItem}>
          <Text style={styles.statusLabel}>Security Clearance</Text>
          <Text style={styles.statusValue}>{isAdmin ? 'Tier 1 - Full Admin' : 'Tier 2 - Staff Access'}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
    ...shadows.sm
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: colors.primaryBorder
  },
  avatarFallback: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: typography.weights.bold
  },
  info: {
    marginLeft: spacing.md,
    flex: 1
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  displayName: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginRight: spacing.sm
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.sm
  },
  userBadge: {
    backgroundColor: colors.badgeUserBg
  },
  userBadgeText: {
    color: colors.badgeUserText,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold
  },
  adminBadge: {
    backgroundColor: colors.badgeAdminBg
  },
  adminBadgeText: {
    color: colors.badgeAdminText,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold
  },
  email: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginTop: 2
  },
  domainVerifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6
  },
  checkIcon: {
    color: colors.success,
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 4
  },
  verifiedText: {
    color: colors.success,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  statusItem: {
    flex: 1
  },
  statusLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted
  },
  statusValue: {
    fontSize: typography.sizes.sm,
    color: colors.textPrimary,
    fontWeight: typography.weights.medium,
    marginTop: 2
  },
  statusValueActive: {
    fontSize: typography.sizes.sm,
    color: colors.success,
    fontWeight: typography.weights.semibold,
    marginTop: 2
  }
});

export default ProfileCard;
