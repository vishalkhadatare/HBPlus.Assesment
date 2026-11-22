import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator } from 'react-native';
import colors from '../../styles/colors.js';
import typography from '../../styles/typography.js';
import { spacing, borderRadius, shadows } from '../../styles/spacing.js';

/**
 * High-quality Google Sign-In button following Google Identity branding guidelines.
 */
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
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.loadingText}>Authenticating with Google...</Text>
        </View>
      ) : (
        <View style={styles.buttonContent}>
          {/* Crisp, cross-platform Google 'G' icon rendered with vector circles */}
          <View style={styles.googleIconContainer}>
            <View style={styles.googleGContainer}>
              <Text style={styles.googleGLetter}>G</Text>
            </View>
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
    borderColor: '#D1D5DB',
    borderRadius: borderRadius.md,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm
  },
  buttonDisabled: {
    opacity: 0.65,
    backgroundColor: '#F3F4F6'
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
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  googleGContainer: {
    width: 22,
    height: 22,
    borderRadius: 11,
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
    color: '#1F2937',
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
