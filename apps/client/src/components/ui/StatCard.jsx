import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import GlassCard from './GlassCard.jsx';

export function StatCard({ title, value, subtitle, icon, trend, trendType = 'up', style }) {
  const { colors, typography } = useTheme();

  const isUp = trendType === 'up';

  return (
    <GlassCard style={[styles.card, style]} contentStyle={styles.content}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: colors.textSecondary }]}>{title}</Text>
        {icon ? (
          <View style={[styles.iconContainer, { backgroundColor: colors.primarySubtle }]}>
            <Text style={styles.iconText}>{icon}</Text>
          </View>
        ) : null}
      </View>

      <Text style={[styles.value, { color: colors.textPrimary }]}>{value}</Text>

      <View style={styles.footerRow}>
        {trend ? (
          <View
            style={[
              styles.trendBadge,
              { backgroundColor: isUp ? colors.successSubtle : colors.dangerSubtle }
            ]}
          >
            <Text
              style={[
                styles.trendText,
                { color: isUp ? colors.successText : colors.dangerText }
              ]}
            >
              {isUp ? '↑ ' : '↓ '}
              {trend}
            </Text>
          </View>
        ) : null}
        {subtitle ? (
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>{subtitle}</Text>
        ) : null}
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 160
  },
  content: {
    padding: 16
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.2
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconText: {
    fontSize: 16
  },
  value: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.8,
    marginBottom: 8
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  trendBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6
  },
  trendText: {
    fontSize: 11,
    fontWeight: '700'
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500'
  }
});

export default StatCard;
