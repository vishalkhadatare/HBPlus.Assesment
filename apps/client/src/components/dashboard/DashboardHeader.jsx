import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../styles/colors.js';
import typography from '../../styles/typography.js';
import { spacing } from '../../styles/spacing.js';

export function DashboardHeader({ displayName }) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <View style={styles.header}>
      <Text style={styles.dateText}>{currentDate}</Text>
      <Text style={styles.greeting}>Welcome back, {displayName || 'Colleague'}</Text>
      <Text style={styles.subheading}>
        HBPlus Secure Access Portal — Your authenticated corporate workspace
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
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: typography.weights.semibold,
    marginBottom: 4
  },
  greeting: {
    fontSize: typography.sizes.xxxl,
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
