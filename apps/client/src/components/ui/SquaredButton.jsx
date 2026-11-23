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

// 16px rounded corners as spec'd for buttons (independent of CARD_RADIUS)
const BUTTON_RADIUS = 16;

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
    { borderRadius: BUTTON_RADIUS, height: 52 },

    // Primary — gradient on web, solid on native
    !isGoogle && !isSecondary && {
      backgroundColor: theme.primary,
      ...(Platform.OS === 'web'
        ? {
            backgroundImage: theme.buttonGradientCss,
            boxShadow: `0 4px 14px 0 ${theme.buttonGlow}, 0 2px 6px rgba(0,0,0,0.12)`
          }
        : {
            shadowColor: theme.primary,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.35,
            shadowRadius: 14,
            elevation: 4
          })
    },

    // Google — pure white, very soft shadow
    isGoogle && {
      backgroundColor: '#FFFFFF',
      borderWidth: 0,
      ...(Platform.OS === 'web'
        ? { boxShadow: '0 2px 8px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)' }
        : {
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.07,
            shadowRadius: 10,
            elevation: 2
          })
    },

    // Secondary — subtle fill
    isSecondary && {
      backgroundColor: '#F1F5F9',
      borderWidth: 1,
      borderColor: '#E2E8F0',
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
    fontWeight: '700',
    letterSpacing: -0.2
  },
  disabled: {
    opacity: 0.55
  }
});

export default SquaredButton;
