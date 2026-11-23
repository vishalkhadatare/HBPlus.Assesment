import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext.jsx';

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon,
  isLoading = false,
  disabled = false,
  style,
  textStyle
}) {
  const { colors, borderRadius } = useTheme();

  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isDanger = variant === 'danger';
  const isGhost = variant === 'ghost';

  const getBackgroundColor = () => {
    if (disabled) return colors.surfaceSubtle;
    if (isPrimary) return colors.primary;
    if (isSecondary) return colors.surfaceSubtle;
    if (isDanger) return colors.danger;
    return 'transparent';
  };

  const getTextColor = () => {
    if (disabled) return colors.textMuted;
    if (isPrimary || isDanger) return '#FFFFFF';
    if (isGhost) return colors.primary;
    return colors.textPrimary;
  };

  const isSmall = size === 'small';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: isSecondary ? colors.border : 'transparent',
          borderWidth: isSecondary ? 1 : 0,
          borderRadius: borderRadius.lg,
          paddingVertical: isSmall ? 8 : 12,
          paddingHorizontal: isSmall ? 12 : 20,
          opacity: disabled ? 0.6 : 1
        },
        style
      ]}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <View style={styles.contentRow}>
          {icon ? <View style={styles.iconWrapper}>{icon}</View> : null}
          <Text
            style={[
              styles.text,
              {
                color: getTextColor(),
                fontSize: isSmall ? 13 : 15
              },
              textStyle
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconWrapper: {
    marginRight: 8
  },
  text: {
    fontWeight: '700',
    letterSpacing: -0.2
  }
});

export default Button;
