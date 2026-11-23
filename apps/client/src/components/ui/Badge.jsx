import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import Icon from './Icon.jsx';

export function Badge({ label, variant = 'neutral', size = 'medium', showDot = true, style }) {
  const { colors, borderRadius } = useTheme();

  const getScheme = () => {
    switch (variant) {
      case 'success':
      case 'Active':
      case 'Approved':
      case 'Done':
      case 'Paid':
      case 'Present':
        return { bg: colors.successSoft, text: colors.successText, dot: colors.success, border: colors.successSoft };
      case 'warning':
      case 'Pending':
      case 'In Progress':
      case 'In Review':
      case 'Medium':
      case 'Half-Day':
        return { bg: colors.warningSoft, text: colors.warningText, dot: colors.warning, border: colors.warningSoft };
      case 'danger':
      case 'Rejected':
      case 'Absent':
      case 'High':
        return { bg: colors.dangerSoft, text: colors.dangerText, dot: colors.danger, border: colors.dangerSoft };
      case 'info':
      case 'Remote':
      case 'Admin':
      case 'Pinned':
        return { bg: colors.infoSoft, text: colors.infoText, dot: colors.info, border: colors.infoSoft };
      case 'primary':
      case 'User':
      case 'Engineering':
        return { bg: colors.primarySoft, text: colors.primary, dot: colors.primary, border: colors.primaryBorder };
      default:
        return { bg: colors.surfaceAlt, text: colors.textMuted, dot: colors.textSubtle, border: colors.border };
    }
  };

  const scheme = getScheme();
  const isSmall = size === 'small';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: scheme.bg,
          borderColor: scheme.border,
          borderRadius: borderRadius.chip,
          paddingVertical: isSmall ? 3 : 5,
          paddingHorizontal: isSmall ? 8 : 10
        },
        style
      ]}
    >
      {showDot ? (
        <View style={[styles.dot, { backgroundColor: scheme.dot, marginRight: 5 }]} />
      ) : null}
      <Text
        style={[
          styles.text,
          {
            color: scheme.text,
            fontSize: isSmall ? 11 : 12
          }
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    flexShrink: 0
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.1
  }
});

export default Badge;
