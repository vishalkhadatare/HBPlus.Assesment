import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../../styles/colors.js';
import typography from '../../styles/typography.js';
import { spacing, borderRadius } from '../../styles/spacing.js';

/**
 * Reusable Accessible Error Message Banner
 */
export function ErrorMessage({
  message,
  code,
  onRetry = null,
  retryLabel = 'Try Again'
}) {
  if (!message) return null;

  const isDomainError = code === 'DOMAIN_NOT_ALLOWED' || message.includes('Access restricted');

  return (
    <View style={[styles.container, isDomainError ? styles.domainErrorContainer : styles.standardErrorContainer]}>
      <View style={styles.contentRow}>
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>{isDomainError ? '🔒' : '⚠️'}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.errorTitle}>
            {isDomainError ? 'Domain Access Restricted' : 'Authentication Notice'}
          </Text>
          <Text style={styles.errorMessage}>{message}</Text>
        </View>
      </View>

      {onRetry ? (
        <TouchableOpacity
          style={styles.retryButton}
          onPress={onRetry}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={retryLabel}
        >
          <Text style={styles.retryText}>{retryLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1
  },
  domainErrorContainer: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5'
  },
  standardErrorContainer: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A'
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  iconContainer: {
    marginRight: spacing.sm,
    marginTop: 2
  },
  iconText: {
    fontSize: 18
  },
  textContainer: {
    flex: 1
  },
  errorTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: '#991B1B',
    marginBottom: 4
  },
  errorMessage: {
    fontSize: typography.sizes.sm,
    color: '#7F1D1D',
    lineHeight: 20
  },
  retryButton: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
    backgroundColor: '#DC2626',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: borderRadius.sm
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold
  }
});

export default ErrorMessage;
