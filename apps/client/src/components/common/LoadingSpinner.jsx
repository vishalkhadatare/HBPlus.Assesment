import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import colors from '../../styles/colors.js';
import typography from '../../styles/typography.js';
import spacing from '../../styles/spacing.js';

/**
 * Reusable Loading Spinner Component with optional accessible label.
 */
export function LoadingSpinner({
  size = 'large',
  color = colors.primary,
  message = null,
  fullScreen = false
}) {
  const content = (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size={size} color={color} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );

  return content;
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.spacing.md,
    justifyContent: 'center',
    alignItems: 'center'
  },
  fullScreen: {
    flex: 1,
    minHeight: 300,
    justifyContent: 'center',
    alignItems: 'center'
  },
  message: {
    marginTop: spacing.spacing.md,
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium
  }
});

export default LoadingSpinner;
