import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator, Platform } from 'react-native';
import colors from '../../styles/colors.js';
import typography from '../../styles/typography.js';
import { spacing, borderRadius, shadows } from '../../styles/spacing.js';

/**
 * Official Authentic Google Icon (4-color vector for Web, crisp fallback for Native)
 */
function GoogleIcon() {
  if (Platform.OS === 'web') {
    return (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        style={{ marginRight: 12, flexShrink: 0 }}
        aria-hidden="true"
      >
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        />
      </svg>
    );
  }

  return (
    <View style={styles.nativeGoogleBadge}>
      <Text style={styles.nativeGoogleText}>G</Text>
    </View>
  );
}

export function GoogleSignInButton({ onPress, isLoading = false, disabled = false }) {
  const isInteractive = !disabled && !isLoading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        !isInteractive && styles.buttonDisabled
      ]}
      onPress={isInteractive ? onPress : undefined}
      activeOpacity={0.88}
      accessibilityRole="button"
      accessibilityLabel="Continue with Google"
      disabled={!isInteractive}
    >
      {isLoading ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color={colors.primaryHover} />
          <Text style={styles.loadingText}>Authenticating with Google...</Text>
        </View>
      ) : (
        <View style={styles.buttonContent}>
          <GoogleIcon />
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
    borderColor: '#E2E8F0',
    borderRadius: borderRadius.lg,
    paddingVertical: 14,
    paddingHorizontal: 24,
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
  buttonText: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2
  },
  nativeGoogleBadge: {
    marginRight: 10,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center'
  },
  nativeGoogleText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
    lineHeight: 16
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingText: {
    marginLeft: spacing.sm,
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: typography.weights.medium
  }
});

export default GoogleSignInButton;
