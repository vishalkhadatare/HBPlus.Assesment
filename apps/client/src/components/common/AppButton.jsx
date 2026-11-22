import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import colors from '../../styles/colors.js';
import typography from '../../styles/typography.js';
import { spacing, borderRadius } from '../../styles/spacing.js';

export function AppButton({
  title,
  onPress,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'danger'
  size = 'md',        // 'sm' | 'md' | 'lg'
  isLoading = false,
  disabled = false,
  icon = null,
  style = {},
  textStyle = {}
}) {
  const isInteractive = !disabled && !isLoading;

  const buttonStyles = [
    styles.base,
    styles[variant],
    styles[`size_${size}`],
    (!isInteractive) && styles.disabled,
    style
  ];

  const labelStyles = [
    styles.textBase,
    styles[`text_${variant}`],
    styles[`textSize_${size}`],
    (!isInteractive) && styles.textDisabled,
    textStyle
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={isInteractive ? onPress : undefined}
      activeOpacity={0.8}
      disabled={!isInteractive}
      accessibilityRole="button"
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' ? colors.primary : colors.textInverse}
        />
      ) : (
        <View style={styles.contentRow}>
          {icon ? <View style={styles.iconMargin}>{icon}</View> : null}
          <Text style={labelStyles}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconMargin: {
    marginRight: spacing.sm
  },
  // Variants
  primary: {
    backgroundColor: colors.primary
  },
  secondary: {
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.borderDark
  },
  danger: {
    backgroundColor: colors.danger
  },
  disabled: {
    opacity: 0.55
  },
  // Sizes
  size_sm: {
    paddingVertical: 8,
    paddingHorizontal: 12
  },
  size_md: {
    paddingVertical: 12,
    paddingHorizontal: 20
  },
  size_lg: {
    paddingVertical: 14,
    paddingHorizontal: 28
  },
  // Text Styles
  textBase: {
    fontWeight: typography.weights.semibold,
    textAlign: 'center'
  },
  text_primary: {
    color: colors.textInverse
  },
  text_secondary: {
    color: colors.textPrimary
  },
  text_outline: {
    color: colors.textPrimary
  },
  text_danger: {
    color: colors.textInverse
  },
  textDisabled: {
    opacity: 0.8
  },
  textSize_sm: {
    fontSize: typography.sizes.xs
  },
  textSize_md: {
    fontSize: typography.sizes.sm
  },
  textSize_lg: {
    fontSize: typography.sizes.base
  }
});

export default AppButton;
