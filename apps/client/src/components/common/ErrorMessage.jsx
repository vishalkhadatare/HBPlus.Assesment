import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../../styles/colors.js';
import typography from '../../styles/typography.js';
import { spacing, borderRadius, shadows } from '../../styles/spacing.js';

/**
 * Modern High-Contrast Error / Restriction Banner
 * Features a soft rose surface, crisp crimson typography, lock emblem, and elegant inline dismiss.
 */
export function ErrorMessage({
  message,
  onRetry = null,
  retryLabel = 'Dismiss'
}) {
  if (!message) return null;

  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <Text style={styles.icon}>🔒</Text>
      </View>

      <View style={styles.textWrapper}>
        <Text style={styles.errorMessage}>{message}</Text>
      </View>

      {onRetry ? (
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onRetry}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={retryLabel}
        >
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.sm
  },
  iconWrapper: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.full,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  icon: {
    fontSize: 14
  },
  textWrapper: {
    flex: 1,
    paddingRight: 6
  },
  errorMessage: {
    fontSize: 13,
    fontWeight: typography.weights.semibold,
    color: '#991B1B',
    lineHeight: 18
  },
  closeButton: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)'
  },
  closeIcon: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
    lineHeight: 14
  }
});

export default ErrorMessage;
