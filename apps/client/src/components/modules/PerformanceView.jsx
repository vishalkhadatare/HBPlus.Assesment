import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import GlassCard from '../ui/GlassCard.jsx';
import Badge from '../ui/Badge.jsx';
import Icon from '../ui/Icon.jsx';
import { initialOKRs } from '../../services/dataStore.js';

export function PerformanceView() {
  const { colors } = useTheme();
  const [okrs] = useState(initialOKRs);

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={[styles.title, { color: colors.text }]}>Performance & OKRs</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Quarterly objectives, key results, and growth milestones (Q4 2026)
          </Text>
        </View>
        <Badge label="Q4 Cycle Active" variant="info" showDot={true} />
      </View>

      <View style={styles.okrList}>
        {okrs.map((item) => (
          <GlassCard key={item.id} style={styles.okrCard}>
            <View style={styles.okrHeader}>
              <View style={{ flex: 1, minWidth: 0 }}>
                <View style={styles.catRow}>
                  <Badge label={item.category} variant="primary" size="small" showDot={false} />
                  <Badge label={item.status} variant={item.status === 'Exceeding' ? 'success' : 'info'} size="small" />
                </View>
                <Text style={[styles.objTitle, { color: colors.text }]}>
                  {item.objective}
                </Text>
              </View>

              <View style={styles.percentBox}>
                <Text style={[styles.percentNum, { color: colors.primary }]}>{item.progress}%</Text>
                <Text style={{ fontSize: 10, color: colors.textSubtle }}>Overall</Text>
              </View>
            </View>

            {/* Progress Track */}
            <View style={[styles.progressTrack, { backgroundColor: colors.surfaceAlt }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${item.progress}%`,
                    backgroundColor: colors.primary,
                    backgroundImage: 'linear-gradient(90deg, #6A5CFF 0%, #14C8D9 100%)'
                  }
                ]}
              />
            </View>

            {/* Key Results Checklist */}
            <View style={styles.krSection}>
              <Text style={[styles.krTitle, { color: colors.textMuted }]}>Key Results Progress:</Text>
              {item.keyResults.map((kr, idx) => (
                <View key={idx} style={[styles.krRow, { borderBottomColor: colors.borderSubtle }]}>
                  <Icon
                    name={kr.done ? 'checkCircle' : 'clock'}
                    size={16}
                    color={kr.done ? colors.successText : colors.textSubtle}
                  />
                  <Text style={[styles.krText, { color: colors.text }]}>{kr.text}</Text>
                  <Text style={[styles.krTarget, { color: colors.textMuted }]}>
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
  headerBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 },
  title: { fontSize: 22, fontWeight: '800', letterSpacing: -0.4 },
  subtitle: { fontSize: 13, fontWeight: '500', marginTop: 2 },
  okrList: { gap: 12 },
  okrCard: { marginVertical: 0 },
  okrHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  catRow: { flexDirection: 'row', gap: 6, marginBottom: 6 },
  objTitle: { fontSize: 15, fontWeight: '800', lineHeight: 20 },
  percentBox: { alignItems: 'center', marginLeft: 14 },
  percentNum: { fontSize: 24, fontWeight: '900', fontFamily: "'JetBrains Mono', monospace" },
  progressTrack: { height: 8, borderRadius: 4, overflow: 'hidden', marginVertical: 8 },
  progressFill: { height: '100%', borderRadius: 4 },
  krSection: { marginTop: 10 },
  krTitle: { fontSize: 12, fontWeight: '700', marginBottom: 6 },
  krRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, borderBottomWidth: 1, gap: 8 },
  krText: { flex: 1, fontSize: 12, fontWeight: '500' },
  krTarget: { fontSize: 12, fontWeight: '700', fontFamily: "'JetBrains Mono', monospace" }
});

export default PerformanceView;
