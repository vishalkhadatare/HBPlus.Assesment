import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import StatCard from '../ui/StatCard.jsx';
import GlassCard from '../ui/GlassCard.jsx';
import Badge from '../ui/Badge.jsx';
import Button from '../ui/Button.jsx';
import Icon from '../ui/Icon.jsx';
import IconTile from '../ui/IconTile.jsx';
import { ProgressRing, AttendanceTrendChart, DepartmentDistributionChart } from '../ui/SimpleCharts.jsx';
import DiagnosticsPanel from '../common/DiagnosticsPanel.jsx';

export function DashboardOverviewView({ onNavigate, user, profile, role }) {
  const { colors, borderRadius, shadows } = useTheme();
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [isClockedIn, setIsClockedIn] = useState(true);
  const [timerSeconds, setTimerSeconds] = useState(3 * 3600 + 42 * 60 + 15); // 03:42:15

  // Live timer tick
  useEffect(() => {
    let t;
    if (isClockedIn) {
      t = setInterval(() => setTimerSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(t);
  }, [isClockedIn]);

  const formatTimer = (sec) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const quickActionItems = [
    { id: 'leave', label: 'Apply Leave', icon: 'leave', module: 'leave' },
    { id: 'attendance', label: 'Attendance', icon: 'attendance', module: 'attendance' },
    { id: 'payroll', label: 'Payslip', icon: 'payroll', module: 'payroll' },
    { id: 'tasks', label: 'Tasks', icon: 'tasks', module: 'tasks' },
    { id: 'directory', label: 'People', icon: 'directory', module: 'directory' },
    { id: 'helpdesk', label: 'Helpdesk', icon: 'helpdesk', module: 'helpdesk' }
  ];

  const upcomingHolidays = [
    { name: 'Thanksgiving Break', date: 'Nov 26 - 27', days: '2 days' },
    { name: 'Winter Corporate Recess', date: 'Dec 24 - Jan 2', days: '7 days' }
  ];

  const birthdays = [
    { name: 'Marcus Vance', date: 'Tomorrow (Nov 24)', role: 'Frontend Lead' },
    { name: 'Elena Rostova', date: 'Nov 29', role: 'VP Engineering' }
  ];

  const recentActivity = [
    { user: 'Marcus Vance', action: 'clocked in at 09:12 AM', time: '1h ago', icon: 'clock' },
    { user: 'Sarah Chen', action: 'approved Annual Leave for Dec 01-05', time: '2h ago', icon: 'checkCircle' },
    { user: 'Arjun Mehta', action: 'updated Firestore Security Rules v2', time: '3h ago', icon: 'shieldCheck' },
    { user: 'Jessica Taylor', action: 'published Health Coverage Guide 2026', time: '5h ago', icon: 'fileText' }
  ];

  return (
    <View style={styles.container}>
      {/* 1. HERO "TODAY" WORKSPACE CARD (Section 9.2: gradientPrimary, 26 radius) */}
      <View
        style={[
          styles.heroTodayCard,
          {
            backgroundImage: 'linear-gradient(135deg, #6A5CFF 0%, #4A3DF0 50%, #2F8BFF 100%)',
            boxShadow: '0 12px 32px rgba(91, 91, 240, 0.35)',
            borderRadius: borderRadius.hero
          }
        ]}
      >
        <View style={styles.heroTopRow}>
          <View style={{ flex: 1, minWidth: 0 }}>
            <View style={styles.shiftBadge}>
              <View style={styles.liveGreenDot} />
              <Text style={styles.shiftBadgeText}>Regular Shift • 09:00 - 18:00</Text>
            </View>
            <Text style={styles.heroStatusText}>
              {isClockedIn ? `Working for ${formatTimer(timerSeconds)}` : 'Checked Out for Day'}
            </Text>
            <Text style={styles.heroLocationSub}>San Francisco HQ • Geofence Verified</Text>
          </View>

          <ProgressRing
            size={74}
            strokeWidth={7}
            progress={isClockedIn ? 48 : 0}
            color="#FFFFFF"
            trackColor="rgba(255,255,255,0.22)"
            centerContent={
              <Icon name={isClockedIn ? 'fingerprint' : 'clock'} size={24} color="#FFFFFF" strokeWidth={2.4} />
            }
          />
        </View>

        {/* Big Slide / 1-Tap Action */}
        <TouchableOpacity
          style={[styles.heroPunchBtn, { backgroundColor: isClockedIn ? 'rgba(255,255,255,0.2)' : '#FFFFFF' }]}
          onPress={() => setIsClockedIn(!isClockedIn)}
          activeOpacity={0.88}
        >
          <Icon
            name={isClockedIn ? 'xCircle' : 'checkCircle'}
            size={18}
            color={isClockedIn ? '#FFFFFF' : '#4A3DF0'}
            strokeWidth={2.5}
          />
          <Text style={[styles.heroPunchText, { color: isClockedIn ? '#FFFFFF' : '#4A3DF0' }]}>
            {isClockedIn ? 'Slide to Check Out' : 'Check In for Today'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 2. QUICK ACTIONS ROW (Horizontal Scrollable 64px Tiles) */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Shortcuts</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.quickActionsScroll}
      >
        {quickActionItems.map((act) => (
          <TouchableOpacity
            key={act.id}
            style={styles.quickActionTile}
            onPress={() => onNavigate(act.id)}
            activeOpacity={0.8}
          >
            <IconTile name={act.icon} module={act.module} size={52} iconSize={24} />
            <Text style={[styles.quickActionLabel, { color: colors.text }]} numberOfLines={1}>
              {act.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 3. 2x2 STATS GRID */}
      <View style={styles.statsGrid}>
        <StatCard
          title="Total Team"
          value="92"
          subtitle="4 new this month"
          iconName="directory"
          module="directory"
          trend="4.2%"
          trendType="up"
        />
        <StatCard
          title="Attendance Today"
          value="98.4%"
          subtitle="86 in office, 3 remote"
          iconName="attendance"
          module="attendance"
          trend="1.8%"
          trendType="up"
        />
        <StatCard
          title="Leave Balance"
          value="27"
          subtitle="Annual & Casual"
          iconName="leave"
          module="leave"
          trend="3 used"
          trendType="up"
        />
        <StatCard
          title="Sprint Tasks"
          value="14"
          subtitle="6 high priority"
          iconName="tasks"
          module="tasks"
          trend="3 closed"
          trendType="up"
        />
      </View>

      {/* Cloud Diagnostics Suite Button */}
      <TouchableOpacity
        style={[styles.diagToggleBtn, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}
        onPress={() => setShowDiagnostics(!showDiagnostics)}
      >
        <Icon name="zap" size={15} color={colors.primary} />
        <Text style={[styles.diagToggleText, { color: colors.primary }]}>
          {showDiagnostics ? 'Hide Live Diagnostics' : '⚡ Open Live Firebase Storage Diagnostics'}
        </Text>
      </TouchableOpacity>

      {showDiagnostics ? (
        <View style={{ marginVertical: 8 }}>
          <DiagnosticsPanel currentUser={user} />
        </View>
      ) : null}

      {/* 4. CHARTS SECTION */}
      <View style={styles.chartsGrid}>
        <View style={styles.chartCol}>
          <AttendanceTrendChart />
        </View>
        <View style={styles.chartCol}>
          <DepartmentDistributionChart />
        </View>
      </View>

      {/* 5. UPCOMING HOLIDAYS & BIRTHDAYS */}
      <View style={styles.twoColGrid}>
        {/* Holidays */}
        <GlassCard style={styles.halfCard}>
          <View style={styles.cardHeaderSmall}>
            <Text style={[styles.smallCardTitle, { color: colors.text }]}>Corporate Holidays</Text>
            <Icon name="calendar" size={16} color={colors.primary} />
          </View>
          <View style={styles.itemsList}>
            {upcomingHolidays.map((h, i) => (
              <View key={i} style={[styles.smallItemRow, { borderBottomColor: colors.borderSubtle }]}>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={[styles.itemTitle, { color: colors.text }]} numberOfLines={1}>{h.name}</Text>
                  <Text style={[styles.itemSub, { color: colors.textMuted }]}>{h.date}</Text>
                </View>
                <Badge label={h.days} variant="info" size="small" showDot={false} />
              </View>
            ))}
          </View>
        </GlassCard>

        {/* Birthdays */}
        <GlassCard style={styles.halfCard}>
          <View style={styles.cardHeaderSmall}>
            <Text style={[styles.smallCardTitle, { color: colors.text }]}>Team Celebrations</Text>
            <Icon name="sparkles" size={16} color={colors.warning} />
          </View>
          <View style={styles.itemsList}>
            {birthdays.map((b, i) => (
              <View key={i} style={[styles.smallItemRow, { borderBottomColor: colors.borderSubtle }]}>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={[styles.itemTitle, { color: colors.text }]} numberOfLines={1}>{b.name}</Text>
                  <Text style={[styles.itemSub, { color: colors.textMuted }]}>{b.role}</Text>
                </View>
                <View style={[styles.warmBadge, { backgroundColor: colors.warningSoft }]}>
                  <Text style={[styles.warmBadgeText, { color: colors.warningText }]}>{b.date}</Text>
                </View>
              </View>
            ))}
          </View>
        </GlassCard>
      </View>

      {/* 6. LIVE ACTIVITY FEED */}
      <GlassCard style={styles.activityCard}>
        <View style={styles.cardHeaderSmall}>
          <Text style={[styles.smallCardTitle, { color: colors.text }]}>Live Activity Feed</Text>
          <Icon name="activity" size={16} color={colors.primary} />
        </View>
        <View style={styles.itemsList}>
          {recentActivity.map((act, i) => (
            <View key={i} style={[styles.actRow, { borderBottomColor: colors.borderSubtle }]}>
              <View style={[styles.actIconTile, { backgroundColor: colors.surfaceAlt }]}>
                <Icon name={act.icon} size={15} color={colors.primary} />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={[styles.actText, { color: colors.text }]}>
                  <Text style={{ fontWeight: '700' }}>{act.user}</Text> {act.action}
                </Text>
              </View>
              <Text style={[styles.actTime, { color: colors.textSubtle }]}>{act.time}</Text>
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
  heroTodayCard: {
    padding: 22,
    marginBottom: 20
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18
  },
  shiftBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 6
  },
  liveGreenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399'
  },
  shiftBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700'
  },
  heroStatusText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginTop: 8,
    fontFamily: "'JetBrains Mono', monospace"
  },
  heroLocationSub: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2
  },
  heroPunchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    gap: 8
  },
  heroPunchText: {
    fontSize: 14,
    fontWeight: '800'
  },
  sectionHeader: {
    marginBottom: 8
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2
  },
  quickActionsScroll: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 16
  },
  quickActionTile: {
    alignItems: 'center',
    width: 68
  },
  quickActionLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center'
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14
  },
  diagToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
    marginBottom: 12
  },
  diagToggleText: {
    fontSize: 13,
    fontWeight: '700'
  },
  chartsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12
  },
  chartCol: {
    flex: 1,
    minWidth: 290
  },
  twoColGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12
  },
  halfCard: {
    flex: 1,
    minWidth: 270,
    marginVertical: 0
  },
  cardHeaderSmall: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  smallCardTitle: {
    fontSize: 14,
    fontWeight: '800'
  },
  itemsList: {
    gap: 2
  },
  smallItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '700'
  },
  itemSub: {
    fontSize: 11,
    marginTop: 2
  },
  warmBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  warmBadgeText: {
    fontSize: 11,
    fontWeight: '700'
  },
  activityCard: {
    marginVertical: 0
  },
  actRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: 1,
    gap: 10
  },
  actIconTile: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  actText: {
    fontSize: 13,
    lineHeight: 18
  },
  actTime: {
    fontSize: 11,
    fontWeight: '500',
    flexShrink: 0
  }
});

export default DashboardOverviewView;
