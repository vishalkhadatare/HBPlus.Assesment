import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useRoleTheme } from '../../theme/roleThemes.js';
import { CARD_RADIUS } from '../../theme/shape.js';

// Premium glass card — 2025 HB Plus design system
export function SquaredCard({
  children,
  style,
  onPress,
  activeOpacity = 0.88,
  glow = false,
  ...props
}) {
  const theme = useRoleTheme();

  const borderRadius = CARD_RADIUS + 4; // 24px

  const containerStyle = [
    styles.card,
    {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius,
      borderWidth: 1,
      borderColor: '#E2E8F0',
      // Native shadow (iOS)
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.07,
      shadowRadius: 12,
      // Android
      elevation: 3
    },
    Platform.OS === 'web' && {
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      boxShadow: glow
        ? `0 4px 6px -1px rgba(0,0,0,0.05), 0 10px 15px -3px rgba(0,0,0,0.08), 0 0 0 2px ${theme.primary}40`
        : '0 4px 6px -1px rgba(0,0,0,0.05), 0 10px 15px -3px rgba(0,0,0,0.08)'
    },
    style
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={containerStyle}
        onPress={onPress}
        activeOpacity={activeOpacity}
        {...props}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={containerStyle} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 0,
    outlineStyle: 'none'
  }
});

export default SquaredCard;
