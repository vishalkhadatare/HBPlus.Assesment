import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext.jsx';

export function Badge({ label, variant = 'neutral', size = 'medium', style }) {
  const { colors } = useTheme();

  const getColors = () => {
    switch (variant) {
      case 'success':
      case 'Active':
      case 'Approved':
      case 'Done':
      case 'Paid':
        return { bg: colors.successSubtle, text: colors.successText, border: colors.success };
      case 'warning':
      case 'Pending':
      case 'In Progress':
      case 'In Review':
      case 'Medium':
        return { bg: colors.warningSubtle, text: colors.warningText, border: colors.warning };
      case 'danger':
      case 'Rejected':
      case 'Absent':
      case 'High':
        return { bg: colors.dangerSubtle, text: colors.dangerText, border: colors.danger };
      case 'info':
      case 'Remote':
      case 'Admin':
      case 'Pinned':
        return { bg: colors.infoSubtle, text: colors.infoText, border: colors.info };
      case 'purple':
      case 'User':
      case 'Engineering':
        return { bg: 'rgba(139, 92, 246, 0.12)', text: '#7C3AED', border: '#C4B5FD' };
      default:
        return { bg: colors.surfaceSubtle, text: colors.textSecondary, border: colors.border };
    }
  };

  const scheme = getColors();
  const isSmall = size === 'small';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: scheme.bg,
          borderColor: scheme.border,
          paddingVertical: isSmall ? 2 : 4,
          paddingHorizontal: isSmall ? 6 : 10
        },
        style
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: scheme.text,
            fontSize: isSmall ? 10 : 12
          }
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    borderWidth: 1,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.2
  }
});

export default Badge;
