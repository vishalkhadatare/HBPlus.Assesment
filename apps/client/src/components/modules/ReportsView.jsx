import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import GlassCard from '../ui/GlassCard.jsx';
import StatCard from '../ui/StatCard.jsx';
import Button from '../ui/Button.jsx';
import { AttendanceTrendChart, DepartmentDistributionChart } from '../ui/SimpleCharts.jsx';

export function ReportsView() {
  const { colors } = useTheme();
  const [exported, setExported] = useState(false);

  const handleExport = () => {
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Executive Reports & Analytics</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Workforce intelligence, retention rates, and operational telemetry
          </Text>
        </View>

        <Button
          title={exported ? "✓ CSV Downloaded" : "Export Monthly CSV"}
          variant="primary"
          onPress={handleExport}
        />
      </View>

      <View style={styles.kpiGrid}>
        <StatCard title="Team Retention" value="98.2%" subtitle="Industry avg: 89%" trend="1.2%" trendType="up" />
        <StatCard title="Avg Check-In Time" value="09:04 AM" subtitle="San Francisco HQ" trend="On Time" trendType="up" />
        <StatCard title="Leave Utilization" value="68%" subtitle="Healthy distribution" trend="Optimal" trendType="up" />
      </View>

      <View style={styles.chartsGrid}>
        <View style={styles.chartCol}>
          <AttendanceTrendChart />
        </View>
        <View style={styles.chartCol}>
          <DepartmentDistributionChart />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  headerBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '800' },
  subtitle: { fontSize: 13, fontWeight: '500', marginTop: 2 },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  chartsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  chartCol: { flex: 1, minWidth: 300 }
});

export default ReportsView;
