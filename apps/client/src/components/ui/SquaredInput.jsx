import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRoleTheme } from '../../theme/roleThemes.js';
import Icon from './Icon.jsx';

// 14px border radius for inputs as per 2025 premium spec
const INPUT_RADIUS = 14;

export function SquaredInput({
  label,
  iconName,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  showPasswordToggle = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  editable = true,
  onSubmitEditing,
  returnKeyType = 'done',
  style
}) {
  const theme = useRoleTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const effectiveSecure = secureTextEntry && !isPasswordVisible;

  // Focus ring colour: use the theme's brand primary
  const focusColor = theme.primary;

  return (
    <View style={[styles.wrapper, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: isFocused ? '#FFFFFF' : '#F1F5F9',
            borderRadius: INPUT_RADIUS,
            borderColor: isFocused ? focusColor : '#E2E8F0',
            borderWidth: isFocused ? 2 : 1,
            ...(Platform.OS === 'web'
              ? {
                  boxShadow: isFocused
                    ? `0 0 0 3px ${focusColor}22`
                    : 'none',
                  transition: 'box-shadow 0.15s ease, border-color 0.15s ease, background-color 0.15s ease'
                }
              : {})
          }
        ]}
      >
        {/* Left icon slot */}
        {iconName ? (
          <View style={styles.iconContainer}>
            <Icon
              name={iconName}
              size={18}
              color={isFocused ? focusColor : '#64748B'}
            />
          </View>
        ) : null}

        <TextInput
          style={[
            styles.input,
            {
              color: '#0F172A',
              paddingRight: showPasswordToggle ? 42 : 12
            }
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          secureTextEntry={effectiveSecure}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          autoComplete={secureTextEntry ? 'password' : 'email'}
          textContentType={secureTextEntry ? 'password' : 'emailAddress'}
          accessibilityLabel={label}
          accessibilityHint={placeholder}
          editable={editable}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onSubmitEditing={onSubmitEditing}
          returnKeyType={returnKeyType}
        />

        {/* Password eye toggle */}
        {showPasswordToggle ? (
          <TouchableOpacity
            style={styles.eyeBtn}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Icon
              name={isPasswordVisible ? 'eyeOff' : 'eye'}
              size={18}
              color={isPasswordVisible ? focusColor : '#94A3B8'}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 6
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155'
  },
  inputContainer: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    borderWidth: 0,
    outlineStyle: 'none',
    position: 'relative'
  },
  iconContainer: {
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    borderWidth: 0,
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {})
  },
  eyeBtn: {
    position: 'absolute',
    right: 14,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default SquaredInput;
