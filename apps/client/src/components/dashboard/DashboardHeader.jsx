import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../styles/colors.js';
import typography from '../../styles/typography.js';
import { spacing } from '../../styles/spacing.js';

export function DashboardHeader({ displayName }) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  return (
    <View style={styles.header}>
      <Text style={styles.dateText}>{currentDate}</Text>
      <Text style={styles.greeting}>Welcome, {displayName || 'Member'}</Text>
      <Text style={styles.subheading}>
        Authorized access to HBPlus secure corporate environment
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.lg
  },
  dateText: {
    fontSize: typography.sizes.xs,
    color: colors.primaryHover,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: typography.weights.bold,
    marginBottom: 4
  },
  greeting: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    letterSpacing: -0.5
  },
  subheading: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginTop: 4
  }
});

export default DashboardHeader;
