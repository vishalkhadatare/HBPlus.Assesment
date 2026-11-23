import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Platform,
  View
} from 'react-native';
import { useRoleTheme } from '../../theme/roleThemes.js';
import { CARD_RADIUS } from '../../theme/shape.js';

export function SquaredButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary', // 'primary' | 'google' | 'secondary'
  icon,
  style,
  textStyle
}) {
  const theme = useRoleTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 20
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20
    }).start();
  };

  const isGoogle = variant === 'google';
  const isSecondary = variant === 'secondary';

  const buttonStyle = [
    styles.baseButton,
    {
      borderRadius: CARD_RADIUS,
      height: 56
    },
    // Primary gradient / fill
    !isGoogle && !isSecondary && {
      backgroundColor: theme.primary,
      ...(Platform.OS === 'web'
        ? { backgroundImage: theme.buttonGradientCss }
        : {}),
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 14,
      elevation: 0
    },
    // Google variant: pure white, borderless, very soft shadow
    isGoogle && {
      backgroundColor: '#FFFFFF',
      borderWidth: 0,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 0
    },
    // Secondary variant: subtle role tint
    isSecondary && {
      backgroundColor: theme.inputFill,
      borderWidth: 0,
      elevation: 0
    },
    (disabled || loading) && styles.disabled,
    style
  ];

  const labelColor = isGoogle
    ? '#0F172A'
    : isSecondary
    ? '#334155'
    : '#FFFFFF';

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }], width: '100%' }}>
      <TouchableOpacity
        style={buttonStyle}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.9}
      >
        {loading ? (
          <ActivityIndicator size="small" color={labelColor} />
        ) : (
          <View style={styles.contentRow}>
            {icon ? <View style={styles.iconWrapper}>{icon}</View> : null}
            <Text style={[styles.label, { color: labelColor }, textStyle]}>
              {title}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  baseButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    outlineStyle: 'none'
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2
  },
  disabled: {
    opacity: 0.65
  }
});

export default SquaredButton;
