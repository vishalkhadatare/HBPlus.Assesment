import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import colors from '../../styles/colors.js';
import typography from '../../styles/typography.js';
import { spacing, borderRadius, shadows } from '../../styles/spacing.js';

export function ProfileCard({ user, profile }) {
  const email = profile?.email || user?.email || '';
  const displayName = profile?.displayName || user?.displayName || 'Team Member';
  const rawRole = profile?.role || 'User';
  const role = rawRole.toLowerCase() === 'admin' ? 'Admin' : 'User';
  const photoURL = profile?.photoURL || user?.photoURL;
  const initial = (displayName.charAt(0) || 'U').toUpperCase();

  const isAdmin = role === 'Admin';

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
                {role}
              </Text>
            </View>
          </View>

          <Text style={styles.email}>{email}</Text>

          {/* Verified @hbplus.fit status pill */}
          <View style={styles.verifiedPill}>
            <Text style={styles.checkIcon}>✓</Text>
            <Text style={styles.verifiedText}>Verified @hbplus.fit Member</Text>
          </View>
        </View>
      </View>

      {/* Minimal Admin-only indicator/card if role === 'Admin' */}
      {isAdmin ? (
        <View style={styles.adminSection}>
          <View style={styles.adminIndicator}>
            <Text style={styles.adminIndicatorIcon}>🛡️</Text>
            <View>
              <Text style={styles.adminIndicatorTitle}>Administrator Access Granted</Text>
              <Text style={styles.adminIndicatorSubtitle}>
                You have elevated privileges to manage corporate access controls.
              </Text>
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    width: '100%',
    ...shadows.sm
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: colors.primaryBorder
  },
  avatarFallback: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: typography.weights.bold
  },
  info: {
    marginLeft: spacing.lg,
    flex: 1
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  displayName: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginRight: spacing.sm
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: borderRadius.full
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
    marginTop: 4
  },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successSubtle,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    marginTop: 8
  },
  checkIcon: {
    color: colors.success,
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 4
  },
  verifiedText: {
    color: colors.success,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold
  },
  adminSection: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
  adminIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border
  },
  adminIndicatorIcon: {
    fontSize: 20,
    marginRight: spacing.md
  },
  adminIndicatorTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary
  },
  adminIndicatorSubtitle: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2
  }
});

export default ProfileCard;
