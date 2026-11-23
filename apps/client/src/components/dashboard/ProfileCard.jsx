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
        <View style={styles.avatarWrapper}>
          {photoURL ? (
            <Image source={{ uri: photoURL }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarInitial}>{initial}</Text>
            </View>
          )}
          <View style={styles.onlineBadge} />
        </View>

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
            <Text style={styles.verifiedText}>Verified @hbplus.fit Domain</Text>
          </View>
        </View>
      </View>

      {/* Meta Grid */}
      <View style={styles.metaGrid}>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Domain Status</Text>
          <Text style={styles.metaValueActive}>● Authorized</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Auth Provider</Text>
          <Text style={styles.metaValue}>Google OAuth</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Access Scope</Text>
          <Text style={styles.metaValue}>{isAdmin ? 'Full Management' : 'Standard Member'}</Text>
        </View>
      </View>

      {/* Minimal Admin-only indicator if role === 'Admin' */}
      {isAdmin ? (
        <View style={styles.adminSection}>
          <View style={styles.adminIndicator}>
            <Text style={styles.adminIndicatorIcon}>🛡️</Text>
            <View style={styles.adminIndicatorContent}>
              <Text style={styles.adminIndicatorTitle}>Administrator Privileges Active</Text>
              <Text style={styles.adminIndicatorSubtitle}>
                Elevated clearance provisioned in Cloud Firestore (users/{'{uid}'}).
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
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    width: '100%',
    ...shadows.card
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatarWrapper: {
    position: 'relative'
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: '#10B981'
  },
  avatarFallback: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.glow
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800'
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF'
  },
  info: {
    marginLeft: 20,
    flex: 1
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  displayName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginRight: 10,
    letterSpacing: -0.4
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: borderRadius.full
  },
  userBadge: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0'
  },
  userBadgeText: {
    color: '#065F46',
    fontSize: 11,
    fontWeight: '700'
  },
  adminBadge: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A'
  },
  adminBadgeText: {
    color: '#92400E',
    fontSize: 11,
    fontWeight: '700'
  },
  email: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 3,
    fontWeight: '500'
  },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    marginTop: 8
  },
  checkIcon: {
    color: '#059669',
    fontSize: 11,
    fontWeight: 'bold',
    marginRight: 4
  },
  verifiedText: {
    color: '#065F46',
    fontSize: 11,
    fontWeight: '600'
  },
  metaGrid: {
    flexDirection: 'row',
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    justifyContent: 'space-between'
  },
  metaItem: {
    flex: 1
  },
  metaLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B'
  },
  metaValueActive: {
    fontSize: 13,
    fontWeight: '700',
    color: '#059669'
  },
  adminSection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9'
  },
  adminIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FDE68A'
  },
  adminIndicatorIcon: {
    fontSize: 22,
    marginRight: 12
  },
  adminIndicatorContent: {
    flex: 1
  },
  adminIndicatorTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E'
  },
  adminIndicatorSubtitle: {
    fontSize: 12,
    color: '#B45309',
    marginTop: 2,
    lineHeight: 16
  }
});

export default ProfileCard;