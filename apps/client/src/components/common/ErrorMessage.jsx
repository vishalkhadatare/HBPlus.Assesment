import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../../styles/colors.js';
import typography from '../../styles/typography.js';
import { spacing, borderRadius } from '../../styles/spacing.js';

/**
 * Reusable Accessible Error Message Banner
 * Styled with soft rose background and crimson text.
 */
export function ErrorMessage({
  message,
  onRetry = null,
  retryLabel = 'Dismiss'
}) {
  if (!message) return null;

  return (
    <View style={styles.container}>
      <View style={styles.contentRow}>
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>🔒</Text>
        </View>
        <View style={styles.textContainer}>
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
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    width: '100%'
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconContainer: {
    marginRight: spacing.sm
  },
  iconText: {
    fontSize: 16
  },
  textContainer: {
    flex: 1
  },
  errorMessage: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: '#DC2626',
    lineHeight: 20
  },
  retryButton: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
    backgroundColor: '#DC2626',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: borderRadius.sm
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold
  }
});

export default ErrorMessage;
