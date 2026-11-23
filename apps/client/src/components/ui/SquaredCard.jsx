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
      shadowColor: theme.role === 'admin' ? '#0E3B5C' : '#00775B',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: theme.role === 'admin' ? 0.08 : 0.07,
      shadowRadius: 24,
      elevation: 0
    },
    Platform.OS === 'web' && {
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)'
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
