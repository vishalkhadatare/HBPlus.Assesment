import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import Icon from './Icon.jsx';

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon,
  iconRight,
  isLoading = false,
  disabled = false,
  style,
  textStyle
}) {
  const { colors, borderRadius, shadows } = useTheme();

  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isOutline = variant === 'outline';
  const isDanger = variant === 'danger';
  const isSuccess = variant === 'success';
  const isGhost = variant === 'ghost';

  const getHeight = () => {
    if (size === 'small') return 36;
    if (size === 'large') return 56;
    return 46;
  };

  const getBackgroundColor = () => {
    if (disabled) return colors.surfaceAlt;
    if (isPrimary) return colors.primary;
    if (isSecondary) return colors.surfaceAlt;
    if (isDanger) return colors.danger;
    if (isSuccess) return colors.success;
    return 'transparent';
  };

  const getTextColor = () => {
    if (disabled) return colors.textSubtle;
    if (isPrimary || isDanger || isSuccess) return '#FFFFFF';
    if (isGhost || isOutline) return colors.primary;
    return colors.text;
  };

  const getBorderColor = () => {
    if (isOutline) return colors.primary;
    if (isSecondary) return colors.border;
    return 'transparent';
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          height: getHeight(),
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: isOutline || isSecondary ? 1 : 0,
          borderRadius: borderRadius.btn,
          paddingHorizontal: size === 'small' ? 12 : 18,
          opacity: disabled ? 0.6 : 1
        },
        isPrimary && !disabled ? {
          backgroundImage: 'linear-gradient(135deg, #6A5CFF 0%, #4A3DF0 50%, #2F8BFF 100%)',
          boxShadow: '0 4px 14px rgba(91, 91, 240, 0.35)'
        } : null,
        style
      ]}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.84}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <View style={styles.contentRow}>
          {icon ? (
            <View style={styles.iconWrapper}>
              {typeof icon === 'string' ? (
                <Icon name={icon} size={size === 'small' ? 14 : 18} color={getTextColor()} />
              ) : (
                icon
              )}
            </View>
          ) : null}

          <Text
            style={[
              styles.text,
              {
                color: getTextColor(),
                fontSize: size === 'small' ? 12 : size === 'large' ? 16 : 14
              },
              textStyle
            ]}
          >
            {title}
          </Text>

          {iconRight ? (
            <View style={styles.iconRightWrapper}>
              {typeof iconRight === 'string' ? (
                <Icon name={iconRight} size={size === 'small' ? 14 : 18} color={getTextColor()} />
              ) : (
                iconRight
              )}
            </View>
          ) : null}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexShrink: 0
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconWrapper: {
    marginRight: 8
  },
  iconRightWrapper: {
    marginLeft: 8
  },
  text: {
    fontWeight: '700',
    letterSpacing: -0.2
  }
});

export default Button;
