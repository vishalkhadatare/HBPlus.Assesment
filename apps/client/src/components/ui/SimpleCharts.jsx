import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import GlassCard from './GlassCard.jsx';

/**
 * Clean Cross-Platform Attendance Trend Chart (Mon - Sun)
 */
export function AttendanceTrendChart({ data = [92, 96, 98, 94, 99, 85, 90] }) {
  const { colors } = useTheme();
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <GlassCard style={styles.chartCard}>
      <View style={styles.chartHeader}>
        <View>
          <Text style={[styles.chartTitle, { color: colors.textPrimary }]}>
            Attendance Trend
          </Text>
          <Text style={[styles.chartSubtitle, { color: colors.textSecondary }]}>
            Past 7 business days presence rate
          </Text>
        </View>
        <View style={[styles.ratePill, { backgroundColor: colors.successSubtle }]}>
          <Text style={[styles.rateText, { color: colors.successText }]}>97.2% Avg</Text>
        </View>
      </View>

      <View style={styles.barsContainer}>
        {data.map((value, idx) => {
          const heightPercent = `${value}%`;
          const isHighest = value >= 98;
          return (
            <View key={idx} style={styles.barColumn}>
              <Text style={[styles.barValue, { color: colors.textMuted }]}>{value}%</Text>
              <View style={[styles.barTrack, { backgroundColor: colors.surfaceSubtle }]}>
                <View
                  style={[
                    styles.barFill,
                    {
                      height: heightPercent,
                      backgroundColor: isHighest ? colors.primary : colors.primaryLight
                    }
                  ]}
                />
              </View>
              <Text style={[styles.barLabel, { color: colors.textSecondary }]}>
                {days[idx]}
              </Text>
            </View>
          );
        })}
      </View>
    </GlassCard>
  );
}

/**
 * Clean Cross-Platform Department Distribution Donut / Progress Bar
 */
export function DepartmentDistributionChart({
  departments = [
    { name: 'Engineering', count: 42, color: '#10B981', percent: 45 },
    { name: 'Product & Design', count: 18, color: '#3B82F6', percent: 20 },
    { name: 'Operations & Fitness', count: 20, color: '#8B5CF6', percent: 22 },
    { name: 'People & Admin', count: 12, color: '#F59E0B', percent: 13 }
  ]
}) {
  const { colors } = useTheme();

  return (
    <GlassCard style={styles.chartCard}>
      <Text style={[styles.chartTitle, { color: colors.textPrimary }]}>
        Department Distribution
      </Text>
      <Text style={[styles.chartSubtitle, { color: colors.textSecondary }]}>
        Active headcount breakdown (92 total)
      </Text>

      {/* Stacked Ratio Bar */}
      <View style={styles.stackedBar}>
        {departments.map((dept, i) => (
          <View
            key={i}
            style={{
              flex: dept.percent,
              height: 12,
              backgroundColor: dept.color,
              marginRight: i === departments.length - 1 ? 0 : 3,
              borderRadius: 3
            }}
          />
        ))}
      </View>

      {/* Legend Grid */}
      <View style={styles.legendGrid}>
        {departments.map((dept, i) => (
          <View key={i} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: dept.color }]} />
            <Text style={[styles.legendName, { color: colors.textSecondary }]}>
              {dept.name}
            </Text>
            <Text style={[styles.legendValue, { color: colors.textPrimary }]}>
              {dept.count} ({dept.percent}%)
            </Text>
          </View>
        ))}
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  chartCard: {
    marginVertical: 8
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3
  },
  chartSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2
  },
  ratePill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  rateText: {
    fontSize: 12,
    fontWeight: '700'
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    paddingTop: 10
  },
  barColumn: {
    alignItems: 'center',
    flex: 1
  },
  barValue: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 4
  },
  barTrack: {
    width: 22,
    height: 90,
    borderRadius: 6,
    overflow: 'hidden',
    justifyContent: 'flex-end'
  },
  barFill: {
    width: '100%',
    borderRadius: 6
  },
  barLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6
  },
  stackedBar: {
    flexDirection: 'row',
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    marginVertical: 16
  },
  legendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 140,
    marginVertical: 4
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8
  },
  legendName: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1
  },
  legendValue: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6
  }
});

export default {
  AttendanceTrendChart,
  DepartmentDistributionChart
};
