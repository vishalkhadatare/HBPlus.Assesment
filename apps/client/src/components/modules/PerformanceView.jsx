import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import GlassCard from '../ui/GlassCard.jsx';
import Badge from '../ui/Badge.jsx';
import { initialOKRs } from '../../services/dataStore.js';

export function PerformanceView() {
  const { colors } = useTheme();
  const [okrs] = useState(initialOKRs);

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Performance & OKRs</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Quarterly objectives, key results, and growth milestones (Q4 2026)
          </Text>
        </View>
        <Badge label="Q4 Cycle Active" variant="info" />
      </View>

      <View style={styles.okrList}>
        {okrs.map((item) => (
          <GlassCard key={item.id} style={styles.okrCard}>
            <View style={styles.okrHeader}>
              <View style={{ flex: 1 }}>
                <View style={styles.catRow}>
                  <Badge label={item.category} variant="purple" size="small" />
                  <Badge label={item.status} variant={item.status === 'Exceeding' ? 'success' : 'info'} size="small" />
                </View>
                <Text style={[styles.objTitle, { color: colors.textPrimary }]}>
                  {item.objective}
                </Text>
              </View>

              <View style={styles.percentBox}>
                <Text style={[styles.percentNum, { color: colors.primary }]}>{item.progress}%</Text>
                <Text style={{ fontSize: 10, color: colors.textMuted }}>Overall</Text>
              </View>
            </View>

            {/* Progress Bar Track */}
            <View style={[styles.progressTrack, { backgroundColor: colors.surfaceSubtle }]}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${item.progress}%`, backgroundColor: colors.primary }
                ]}
              />
            </View>

            {/* Key Results Checklist */}
            <View style={styles.krSection}>
              <Text style={[styles.krTitle, { color: colors.textSecondary }]}>Key Results Progress:</Text>
              {item.keyResults.map((kr, idx) => (
                <View key={idx} style={[styles.krRow, { borderBottomColor: colors.borderSubtle }]}>
                  <Text style={[styles.krCheck, { color: kr.done ? colors.successText : colors.textMuted }]}>
                    {kr.done ? '✓' : '○'}
                  </Text>
                  <Text style={[styles.krText, { color: colors.textPrimary }]}>{kr.text}</Text>
                  <Text style={[styles.krTarget, { color: colors.textSecondary }]}>
                    {kr.current} / {kr.target}
                  </Text>
                </View>
              ))}
            </View>
          </GlassCard>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  headerBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '800' },
  subtitle: { fontSize: 13, fontWeight: '500', marginTop: 2 },
  okrList: { gap: 14 },
  okrCard: { marginVertical: 0 },
  okrHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  catRow: { flexDirection: 'row', gap: 6, marginBottom: 6 },
  objTitle: { fontSize: 16, fontWeight: '800', lineHeight: 22 },
  percentBox: { alignItems: 'center', marginLeft: 16 },
  percentNum: { fontSize: 24, fontWeight: '900' },
  progressTrack: { height: 8, borderRadius: 4, overflow: 'hidden', marginVertical: 10 },
  progressFill: { height: '100%', borderRadius: 4 },
  krSection: { marginTop: 12 },
  krTitle: { fontSize: 12, fontWeight: '700', marginBottom: 6 },
  krRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, borderBottomWidth: 1, gap: 8 },
  krCheck: { fontSize: 14, fontWeight: '800', width: 18 },
  krText: { flex: 1, fontSize: 13, fontWeight: '500' },
  krTarget: { fontSize: 12, fontWeight: '700' }
});

export default PerformanceView;
