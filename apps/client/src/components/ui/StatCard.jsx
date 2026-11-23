import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import GlassCard from './GlassCard.jsx';
import Icon from './Icon.jsx';
import IconTile from './IconTile.jsx';

export function StatCard({
  title,
  value,
  subtitle,
  iconName,
  module = 'dashboard',
  trend,
  trendType = 'up',
  style
}) {
  const { colors } = useTheme();

  const isUp = trendType === 'up';

  return (
    <GlassCard style={[styles.card, style]} contentStyle={styles.content}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: colors.textMuted }]} numberOfLines={1}>
          {title}
        </Text>
        {iconName ? (
          <IconTile name={iconName} module={module} size={32} iconSize={16} />
        ) : null}
      </View>

      <Text style={[styles.value, { color: colors.text }]}>{value}</Text>

      <View style={styles.footerRow}>
        {trend ? (
          <View
            style={[
              styles.trendBadge,
              { backgroundColor: isUp ? colors.successSoft : colors.dangerSoft }
            ]}
          >
            <Icon
              name={isUp ? 'arrowUp' : 'arrowDown'}
              size={12}
              color={isUp ? colors.successText : colors.dangerText}
              strokeWidth={3}
            />
            <Text
              style={[
                styles.trendText,
                { color: isUp ? colors.successText : colors.dangerText }
              ]}
            >
              {trend}
            </Text>
          </View>
        ) : null}
        {subtitle ? (
          <Text style={[styles.subtitle, { color: colors.textSubtle }]} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 150
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
    letterSpacing: -0.1,
    flex: 1
  },
  value: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.6,
    marginBottom: 8,
    fontFamily: "'JetBrains Mono', monospace"
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap'
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 2
  },
  trendText: {
    fontSize: 11,
    fontWeight: '700'
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1
  }
});

export default StatCard;
