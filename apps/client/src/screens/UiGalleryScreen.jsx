import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../contexts/ThemeContext.jsx';
import Button from '../components/ui/Button.jsx';
import GlassCard from '../components/ui/GlassCard.jsx';
import Badge from '../components/ui/Badge.jsx';
import StatCard from '../components/ui/StatCard.jsx';
import Icon from '../components/ui/Icon.jsx';
import IconTile from '../components/ui/IconTile.jsx';
import { ProgressRing, AttendanceTrendChart } from '../components/ui/SimpleCharts.jsx';

export function UiGalleryScreen({ onBack }) {
  const { colors, isDark, toggleTheme } = useTheme();

  return (
    <ScrollView style={[styles.root, { backgroundColor: colors.bg }]} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>HBPlus Design System Gallery</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Executive 2026 UI Kit • Iris Indigo & Aqua
          </Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Button
            title={isDark ? "Light Mode" : "Dark Mode"}
            icon={isDark ? "sun" : "moon"}
            variant="secondary"
            size="small"
            onPress={toggleTheme}
          />
          {onBack ? (
            <Button title="Back" variant="outline" size="small" onPress={onBack} />
          ) : null}
        </View>
      </View>

      {/* Buttons */}
      <GlassCard style={styles.section}>
        <Text style={[styles.sectionHeading, { color: colors.text }]}>Buttons</Text>
        <View style={styles.row}>
          <Button title="Primary CTA" variant="primary" />
          <Button title="Secondary" variant="secondary" />
          <Button title="Outline" variant="outline" />
          <Button title="Danger" variant="danger" />
          <Button title="Small" variant="primary" size="small" />
          <Button title="Loading" variant="primary" isLoading={true} />
        </View>
      </GlassCard>

      {/* Badges / Status Chips */}
      <GlassCard style={styles.section}>
        <Text style={[styles.sectionHeading, { color: colors.text }]}>Status Chips & Badges</Text>
        <View style={styles.row}>
          <Badge label="Approved" variant="Approved" />
          <Badge label="Pending" variant="Pending" />
          <Badge label="Rejected" variant="Rejected" />
          <Badge label="In Office" variant="Active" />
          <Badge label="Remote" variant="Remote" />
          <Badge label="Admin" variant="Admin" />
        </View>
      </GlassCard>

      {/* Icon Tiles */}
      <GlassCard style={styles.section}>
        <Text style={[styles.sectionHeading, { color: colors.text }]}>Feature Icon Tiles (No Emoji!)</Text>
        <View style={styles.row}>
          <IconTile name="dashboard" module="dashboard" size={46} iconSize={22} />
          <IconTile name="directory" module="directory" size={46} iconSize={22} />
          <IconTile name="attendance" module="attendance" size={46} iconSize={22} />
          <IconTile name="leave" module="leave" size={46} iconSize={22} />
          <IconTile name="payroll" module="payroll" size={46} iconSize={22} />
          <IconTile name="tasks" module="tasks" size={46} iconSize={22} />
        </View>
      </GlassCard>

      {/* StatCards */}
      <GlassCard style={styles.section}>
        <Text style={[styles.sectionHeading, { color: colors.text }]}>KPI StatCards</Text>
        <View style={styles.row}>
          <StatCard title="Team Headcount" value="92" subtitle="+4 this month" iconName="directory" module="directory" trend="4.2%" />
          <StatCard title="Attendance Rate" value="98.4%" subtitle="San Francisco HQ" iconName="attendance" module="attendance" trend="1.8%" />
        </View>
      </GlassCard>

      {/* Progress Ring & Charts */}
      <GlassCard style={styles.section}>
        <Text style={[styles.sectionHeading, { color: colors.text }]}>Circular Progress & Trends</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 24, marginVertical: 12 }}>
          <ProgressRing size={68} progress={75} color={colors.primary} centerContent={<Text style={{ fontWeight: '800', color: colors.text }}>75%</Text>} />
          <ProgressRing size={68} progress={90} color={colors.success} centerContent={<Text style={{ fontWeight: '800', color: colors.text }}>90%</Text>} />
          <ProgressRing size={68} progress={45} color={colors.warning} centerContent={<Text style={{ fontWeight: '800', color: colors.text }}>45%</Text>} />
        </View>
        <AttendanceTrendChart />
      </GlassCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { maxWidth: 900, alignSelf: 'center', width: '100%', padding: 20, paddingBottom: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 },
  title: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { fontSize: 13, marginTop: 2 },
  section: { marginBottom: 16 },
  sectionHeading: { fontSize: 15, fontWeight: '800', marginBottom: 14 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, alignItems: 'center' }
});

export default UiGalleryScreen;
