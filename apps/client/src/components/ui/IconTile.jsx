import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import Icon from './Icon.jsx';

export function IconTile({
  name,
  module = 'dashboard',
  size = 40,
  iconSize = 20,
  tintOverride,
  style
}) {
  const { colors, borderRadius } = useTheme();

  const tint = tintOverride || colors.tints?.[module] || colors.tints?.dashboard || {
    bg: colors.primarySoft,
    text: colors.primary,
    border: colors.primaryBorder
  };

  return (
    <View
      style={[
        styles.tile,
        {
          width: size,
          height: size,
          borderRadius: Math.round(size * 0.32),
          backgroundColor: tint.bg,
          borderColor: tint.border,
          borderWidth: 1
        },
        style
      ]}
    >
      <Icon name={name || module} size={iconSize} color={tint.text} strokeWidth={2.2} />
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  }
});

export default IconTile;
