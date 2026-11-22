import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../styles/colors.js';
import typography from '../styles/typography.js';
import { spacing, borderRadius, shadows } from '../styles/spacing.js';
import AppLayout from '../components/layout/AppLayout.jsx';

export function NotFoundScreen({ onNavigateHome }) {
  return (
    <AppLayout showHeader={false}>
      <View style={styles.centerContainer}>
        <View style={styles.card}>
          <Text style={styles.code}>404</Text>
          <Text style={styles.title}>Page Not Found</Text>
          <Text style={styles.description}>
            The requested destination does not exist or has been moved within the corporate intranet.
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={onNavigateHome}
            activeOpacity={0.8}
            accessibilityRole="button"
          >
            <Text style={styles.buttonText}>Return to Portal</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 420,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    ...shadows.md
  },
  code: {
    fontSize: 48,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    marginBottom: spacing.xs
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm
  },
  description: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: borderRadius.md
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold
  }
});

export default NotFoundScreen;
