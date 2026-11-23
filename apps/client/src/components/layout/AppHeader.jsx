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
            <View style={styles.badgeRow}>
              <View style={styles.dot} />
              <Text style={styles.brandSubtitle}>Secure Corporate Portal</Text>
            </View>
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
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    ...shadows.sm,
    zIndex: 10
  },
  innerContainer: {
    maxWidth: 960,
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
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    ...shadows.glow
  },
  logoText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: -0.5
  },
  brandTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 18,
    letterSpacing: -0.3
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#10B981',
    marginRight: 5
  },
  brandSubtitle: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500'
  },
  signOutButton: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC'
  },
  signOutText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569'
  }
});

export default AppHeader;