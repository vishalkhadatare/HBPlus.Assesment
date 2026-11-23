import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useRoleTheme } from '../../theme/roleThemes.js';
import { CARD_RADIUS } from '../../theme/shape.js';

export function SquaredCard({
  children,
  style,
  onPress,
  activeOpacity = 0.88,
  glow = false,
  ...props
}) {
  const theme = useRoleTheme();

  const containerStyle = [
    styles.card,
    {
      backgroundColor: theme.cardTint,
      borderRadius: CARD_RADIUS,
      borderWidth: 1,
      borderColor: theme.role === 'admin' ? '#E2E8F0' : 'rgba(178, 234, 219, 0.72)',
      shadowColor: theme.role === 'admin' ? '#0F172A' : '#00775B',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: theme.role === 'admin' ? 0.07 : 0.08,
      shadowRadius: 28,
      elevation: 0
    },
    Platform.OS === 'web' && {
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      boxShadow: theme.role === 'admin'
        ? '0 18px 48px rgba(15,23,42,0.10)'
        : '0 18px 48px rgba(0,119,91,0.10)'
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
