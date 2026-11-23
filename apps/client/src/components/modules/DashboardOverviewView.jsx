import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import StatCard from '../ui/StatCard.jsx';
import GlassCard from '../ui/GlassCard.jsx';
import Badge from '../ui/Badge.jsx';
import Button from '../ui/Button.jsx';
import { AttendanceTrendChart, DepartmentDistributionChart } from '../ui/SimpleCharts.jsx';
import DiagnosticsPanel from '../common/DiagnosticsPanel.jsx';

export function DashboardOverviewView({ onNavigate, user, profile, role }) {
  const { colors } = useTheme();
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  const upcomingHolidays = [
    { name: 'Thanksgiving Break', date: 'Nov 26 - 27, 2026', days: '2 days' },
    { name: 'Winter Corporate Recess', date: 'Dec 24 - Jan 2, 2027', days: '7 days' }
  ];

  const birthdays = [
    { name: 'Marcus Vance', date: 'Tomorrow (Nov 24)', department: 'Engineering' },
    { name: 'Elena Rostova', date: 'Nov 29', department: 'Engineering' }
  ];

  const recentActivity = [
    { user: 'Marcus Vance', action: 'clocked in at 09:12 AM', time: '1h ago', icon: '⏱️' },
    { user: 'Sarah Chen', action: 'approved Annual Leave for Dec 01-05', time: '2h ago', icon: '🌴' },
    { user: 'Arjun Mehta', action: 'updated Firestore Security Rules v2', time: '3h ago', icon: '🛡️' },
    { user: 'Jessica Taylor', action: 'published Health Coverage Guide 2026', time: '5h ago', icon: '📄' }
  ];

  return (
    <View style={styles.container}>
      {/* KPI Overview Row */}
      <View style={styles.kpiGrid}>
        <StatCard
          title="Total Team"
          value="92"
          subtitle="4 new this month"
          icon="👥"
          trend="4.2%"
          trendType="up"
        />
        <StatCard
          title="Attendance Today"
          value="98.4%"
          subtitle="86 present, 3 remote"
          icon="⚡"
          trend="1.8%"
          trendType="up"
        />
        <StatCard
          title="On Leave Today"
          value="3"
          subtitle="2 planned, 1 sick"
          icon="🌴"
          trend="Stable"
          trendType="up"
        />
        <StatCard
          title="Pending Tasks"
          value="14"
          subtitle="6 high priority"
          icon="📋"
          trend="3 resolved"
          trendType="up"
        />
      </View>

      {/* Quick Action Shortcuts */}
      <GlassCard style={styles.quickActionsCard}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Quick Actions
        </Text>
        <View style={styles.actionsRow}>
          <Button
            title="Clock In / Out"
            onPress={() => onNavigate('attendance')}
            variant="primary"
            style={styles.actionBtn}
          />
          <Button
            title="Apply Leave"
            onPress={() => onNavigate('leave')}
            variant="secondary"
            style={styles.actionBtn}
          />
          <Button
            title="Kanban Tasks"
            onPress={() => onNavigate('tasks')}
            variant="secondary"
            style={styles.actionBtn}
          />
          <Button
            title="Helpdesk Ticket"
            onPress={() => onNavigate('helpdesk')}
            variant="secondary"
            style={styles.actionBtn}
          />
          <Button
            title={showDiagnostics ? "Hide Diagnostics" : "Cloud Diagnostics"}
            onPress={() => setShowDiagnostics(!showDiagnostics)}
            variant="ghost"
            style={styles.actionBtn}
          />
        </View>
      </GlassCard>

      {/* Cloud Diagnostics Panel (Collapsible) */}
      {showDiagnostics ? (
        <View style={{ marginVertical: 8 }}>
          <DiagnosticsPanel currentUser={user} />
        </View>
      ) : null}

      {/* Charts Section */}
      <View style={styles.chartsGrid}>
        <View style={styles.chartCol}>
          <AttendanceTrendChart />
        </View>
        <View style={styles.chartCol}>
          <DepartmentDistributionChart />
        </View>
      </View>

      {/* Notices & Birthdays Section */}
      <View style={styles.twoColRow}>
        {/* Upcoming Holidays */}
        <GlassCard style={styles.halfCard}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            📅 Upcoming Holidays
          </Text>
          <View style={styles.listContainer}>
            {upcomingHolidays.map((h, i) => (
              <View key={i} style={[styles.listItem, { borderBottomColor: colors.borderSubtle }]}>
                <View>
                  <Text style={[styles.itemPrimary, { color: colors.textPrimary }]}>{h.name}</Text>
                  <Text style={[styles.itemSecondary, { color: colors.textSecondary }]}>{h.date}</Text>
                </View>
                <Badge label={h.days} variant="info" size="small" />
              </View>
            ))}
          </View>
        </GlassCard>

        {/* Team Birthdays */}
        <GlassCard style={styles.halfCard}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            🎂 Team Birthdays
          </Text>
          <View style={styles.listContainer}>
            {birthdays.map((b, i) => (
              <View key={i} style={[styles.listItem, { borderBottomColor: colors.borderSubtle }]}>
                <View>
                  <Text style={[styles.itemPrimary, { color: colors.textPrimary }]}>{b.name}</Text>
                  <Text style={[styles.itemSecondary, { color: colors.textSecondary }]}>{b.department}</Text>
                </View>
                <Badge label={b.date} variant="purple" size="small" />
              </View>
            ))}
          </View>
        </GlassCard>
      </View>

      {/* Live Activity Feed */}
      <GlassCard style={styles.activityCard}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          ⚡ Real-time Activity Feed
        </Text>
        <View style={styles.listContainer}>
          {recentActivity.map((act, i) => (
            <View key={i} style={[styles.activityRow, { borderBottomColor: colors.borderSubtle }]}>
              <Text style={styles.actIcon}>{act.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.actText, { color: colors.textPrimary }]}>
                  <Text style={{ fontWeight: '700' }}>{act.user}</Text> {act.action}
                </Text>
              </View>
              <Text style={[styles.actTime, { color: colors.textMuted }]}>{act.time}</Text>
            </View>
          ))}
        </View>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%'
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12
  },
  quickActionsCard: {
    marginVertical: 8
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
    letterSpacing: -0.3
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  actionBtn: {
    marginRight: 4,
    marginBottom: 4
  },
  chartsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  chartCol: {
    flex: 1,
    minWidth: 300
  },
  twoColRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 4
  },
  halfCard: {
    flex: 1,
    minWidth: 280
  },
  listContainer: {
    marginTop: 6
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1
  },
  itemPrimary: {
    fontSize: 14,
    fontWeight: '700'
  },
  itemSecondary: {
    fontSize: 12,
    marginTop: 2
  },
  activityCard: {
    marginTop: 12
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 10
  },
  actIcon: {
    fontSize: 18
  },
  actText: {
    fontSize: 13
  },
  actTime: {
    fontSize: 11,
    fontWeight: '500'
  }
});

export default DashboardOverviewView;
