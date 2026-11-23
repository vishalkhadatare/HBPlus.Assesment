import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext.jsx';

export function GlassCard({ children, style, contentStyle }) {
  const { colors, borderRadius, shadows } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: borderRadius.xl
        },
        shadows.card,
        style
      ]}
    >
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
    padding: 20
  }
});

export default GlassCard;
