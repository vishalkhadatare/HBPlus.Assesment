import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator } from 'react-native';
import colors from '../../styles/colors.js';
import typography from '../../styles/typography.js';
import { spacing, borderRadius, shadows } from '../../styles/spacing.js';

export function GoogleSignInButton({ onPress, isLoading = false, disabled = false }) {
  const isInteractive = !disabled && !isLoading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        !isInteractive && styles.buttonDisabled
      ]}
      onPress={isInteractive ? onPress : undefined}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel="Continue with Google"
      disabled={!isInteractive}
    >
      {isLoading ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color={colors.primaryHover} />
          <Text style={styles.loadingText}>Connecting to Google...</Text>
        </View>
      ) : (
        <View style={styles.buttonContent}>
          {/* Crisp, cross-platform Google G badge */}
          <View style={styles.googleIconContainer}>
            <Text style={styles.googleGLetter}>G</Text>
          </View>
          <Text style={styles.buttonText}>Continue with Google</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.borderDark,
    borderRadius: borderRadius.lg,
    paddingVertical: 13,
    paddingHorizontal: 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm
  },
  buttonDisabled: {
    opacity: 0.65,
    backgroundColor: colors.surfaceSubtle
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  googleIconContainer: {
    marginRight: spacing.md,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center'
  },
  googleGLetter: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 18
  },
  buttonText: {
    color: colors.textPrimary,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    letterSpacing: 0.1
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingText: {
    marginLeft: spacing.sm,
    color: colors.textSecondary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium
  }
});

export default GoogleSignInButton;
