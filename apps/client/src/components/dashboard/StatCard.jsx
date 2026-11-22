import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../styles/colors.js';
import typography from '../../styles/typography.js';
import { spacing, borderRadius, shadows } from '../../styles/spacing.js';

export function StatCard({ label, value, change, icon = null }) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>{label}</Text>
        {icon ? <View style={styles.iconBox}>{icon}</View> : null}
      </View>
      <Text style={styles.value}>{value}</Text>
      {change ? (
        <View style={styles.badge}>
          <Text style={styles.changeText}>{change}</Text>
        </View>
      ) : null}
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
    minWidth: 180,
    flex: 1,
    margin: spacing.sm,
    ...shadows.sm
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs
  },
  label: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium
  },
  iconBox: {
    marginLeft: spacing.xs
  },
  value: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginVertical: 4
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primarySubtle,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginTop: 4
  },
  changeText: {
    fontSize: typography.sizes.xs,
    color: colors.primary,
    fontWeight: typography.weights.medium
  }
});

export default StatCard;
