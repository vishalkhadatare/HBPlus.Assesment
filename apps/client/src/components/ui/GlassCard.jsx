import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext.jsx';

export function GlassCard({ children, style, contentStyle, onPress, variant = 'elevated' }) {
  const { colors, borderRadius, shadows, isDark } = useTheme();

  const getBorderColor = () => {
    if (isDark) return colors.border;
    return colors.border;
  };

  const getBackgroundColor = () => {
    if (variant === 'plain') return colors.surface;
    if (variant === 'alt') return colors.surfaceAlt;
    if (variant === 'glass') return colors.surfaceGlass;
    return colors.surface;
  };

  const cardStyle = [
    styles.card,
    {
      backgroundColor: getBackgroundColor(),
      borderColor: getBorderColor(),
      borderRadius: borderRadius.card
    },
    !isDark ? shadows.sm : { borderWidth: 1, borderColor: colors.border },
    style
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={0.88}
      >
        <View style={[styles.innerContent, contentStyle]}>{children}</View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyle}>
      <View style={[styles.innerContent, contentStyle]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    overflow: 'hidden',
    marginVertical: 6
  },
  innerContent: {
    padding: 18
  }
});

export default GlassCard;
