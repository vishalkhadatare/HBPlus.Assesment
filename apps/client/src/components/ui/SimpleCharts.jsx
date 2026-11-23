import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import GlassCard from './GlassCard.jsx';

/**
 * Apple Fitness-style Circular Progress Ring
 */
export function ProgressRing({
  size = 76,
  strokeWidth = 8,
  progress = 75,
  color = '#00B386',
  trackColor,
  centerContent
}) {
  const { colors } = useTheme();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View style={{ width: size, height: size, position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor || colors.surfaceAlt}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      {centerContent ? (
        <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center' }}>
          {centerContent}
        </View>
      ) : null}
    </View>
  );
}

/**
 * Modern Attendance Trend Chart
 */
export function AttendanceTrendChart({ data = [94, 98, 97, 95, 99, 86, 92] }) {
  const { colors } = useTheme();
  const [selectedDay, setSelectedDay] = useState(4); // default to Friday
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <GlassCard style={styles.chartCard}>
      <View style={styles.chartHeader}>
        <View>
          <Text style={[styles.chartTitle, { color: colors.text }]}>
            Attendance Pulse
          </Text>
          <Text style={[styles.chartSubtitle, { color: colors.textMuted }]}>
            Past 7 business days presence rate
          </Text>
        </View>
        <View style={[styles.ratePill, { backgroundColor: colors.successSoft }]}>
          <Text style={[styles.rateText, { color: colors.successText }]}>97.4% Avg</Text>
        </View>
      </View>

      <View style={styles.barsContainer}>
        {data.map((value, idx) => {
          const heightPercent = `${value}%`;
          const isSelected = selectedDay === idx;
          return (
            <TouchableOpacity
              key={idx}
              style={styles.barColumn}
              onPress={() => setSelectedDay(idx)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.barValue,
                  {
                    color: isSelected ? '#EA580C' : '#64748B',
                    fontWeight: isSelected ? '700' : '500'
                  }
                ]}
              >
                {value}%
              </Text>
              <View style={[styles.barTrack, { backgroundColor: '#F3EAE1' }]}>
                <View
                  style={[
                    styles.barFill,
                    {
                      height: heightPercent,
                      backgroundColor: isSelected ? '#EA580C' : '#D4B8A3'
                    }
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.barLabel,
                  {
                    color: isSelected ? colors.text : colors.textMuted,
                    fontWeight: isSelected ? '700' : '500'
                  }
                ]}
              >
                {days[idx]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </GlassCard>
  );
}

/**
 * Modern Department Headcount Stacked Bar & Legend
 */
export function DepartmentDistributionChart({
  departments = [
    { name: 'Engineering', count: 42, color: '#EA580C', percent: 45 },
    { name: 'Product & Design', count: 18, color: '#F97316', percent: 20 },
    { name: 'Operations & Fitness', count: 20, color: '#8B5CF6', percent: 22 },
    { name: 'People & Admin', count: 12, color: '#F5A524', percent: 13 }
  ]
}) {
  const { colors } = useTheme();

  return (
    <GlassCard style={styles.chartCard}>
      <Text style={[styles.chartTitle, { color: colors.text }]}>
        Workforce Distribution
      </Text>
      <Text style={[styles.chartSubtitle, { color: colors.textMuted }]}>
        Active headcount across 4 core departments (92 total)
      </Text>

      {/* Stacked Ratio Bar */}
      <View style={styles.stackedBar}>
        {departments.map((dept, i) => (
          <View
            key={i}
            style={{
              flex: dept.percent,
              height: 10,
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
            <Text style={[styles.legendName, { color: colors.textMuted }]}>
              {dept.name}
            </Text>
            <Text style={[styles.legendValue, { color: colors.text }]}>
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
    marginVertical: 6
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2
  },
  chartSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2
  },
  ratePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8
  },
  rateText: {
    fontSize: 11,
    fontWeight: '700'
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 130,
    paddingTop: 8
  },
  barColumn: {
    alignItems: 'center',
    flex: 1
  },
  barValue: {
    fontSize: 10,
    marginBottom: 4,
    fontFamily: "'JetBrains Mono', monospace"
  },
  barTrack: {
    width: 20,
    height: 84,
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
    marginTop: 6
  },
  stackedBar: {
    flexDirection: 'row',
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    marginVertical: 14
  },
  legendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 6
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 130,
    marginVertical: 2
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6
  },
  legendName: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1
  },
  legendValue: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
    fontFamily: "'JetBrains Mono', monospace"
  }
});

export default {
  ProgressRing,
  AttendanceTrendChart,
  DepartmentDistributionChart
};
