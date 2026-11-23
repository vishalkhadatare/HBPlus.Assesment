import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRoleTheme } from '../../theme/roleThemes.js';
import { CARD_RADIUS } from '../../theme/shape.js';
import Icon from './Icon.jsx';

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

  return (
    <View style={[styles.wrapper, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: isFocused ? theme.inputFocusFill : theme.inputFill,
            borderRadius: CARD_RADIUS,
            borderBottomColor: isFocused ? theme.primary : 'transparent',
            borderBottomWidth: 2
          }
        ]}
      >
        {iconName ? (
          <View style={styles.iconContainer}>
            <Icon
              name={iconName}
              size={18}
              color={isFocused ? theme.primary : '#64748B'}
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
          editable={editable}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onSubmitEditing={onSubmitEditing}
          returnKeyType={returnKeyType}
        />

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
              color={isPasswordVisible ? theme.primary : '#94A3B8'}
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
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
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
    right: 12,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default SquaredInput;
