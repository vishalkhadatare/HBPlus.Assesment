import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import GlassCard from '../ui/GlassCard.jsx';
import Badge from '../ui/Badge.jsx';
import Button from '../ui/Button.jsx';
import Icon from '../ui/Icon.jsx';
import { getAttendanceStats, getMonthlyHeatmap, getWhoIsInToday } from '../../services/attendanceService.js';

export function AttendanceView() {
  const { colors, borderRadius } = useTheme();
  const [stats] = useState(getAttendanceStats());
  const [heatmap] = useState(getMonthlyHeatmap());
  const [whoIsIn] = useState(getWhoIsInToday());
  const [isClockedIn, setIsClockedIn] = useState(true);
  const [workSeconds, setWorkSeconds] = useState(stats.totalWorkSeconds);
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);

  const [regDate, setRegDate] = useState('2026-11-20');
  const [regTime, setRegTime] = useState('09:00 AM');
  const [regReason, setRegReason] = useState('');

  // Live timer tick
  useEffect(() => {
    let timer;
    if (isClockedIn) {
      timer = setInterval(() => setWorkSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isClockedIn]);

  const formatTimer = (sec) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleRegSubmit = () => {
    setRegSuccess(true);
    setTimeout(() => {
      setIsRegModalOpen(false);
      setRegSuccess(false);
    }, 1200);
  };

  return (
    <View style={styles.container}>
      {/* Top Banner: Clock In / Live Work Timer */}
      <GlassCard style={styles.punchCard}>
        <View style={styles.punchRow}>
          <View style={{ flex: 1, minWidth: 200 }}>
            <View style={styles.statusPill}>
              <View style={[styles.liveDot, { backgroundColor: isClockedIn ? colors.success : colors.danger }]} />
              <Text style={[styles.statusTitle, { color: colors.text }]}>
                {isClockedIn ? 'Active Work Session' : 'Clocked Out'}
              </Text>
            </View>

            <Text style={[styles.timerDisplay, { color: colors.text }]}>
              {formatTimer(workSeconds)}
            </Text>

            <View style={styles.geofenceRow}>
              <Icon name="mapPin" size={14} color={colors.primary} />
              <Text style={[styles.geofenceText, { color: colors.textMuted }]}>
                San Francisco HQ (Geofence Verified)
              </Text>
              <Badge label="Verified" variant="success" size="small" showDot={false} />
            </View>
          </View>

          <View style={styles.punchActionCol}>
            <Button
              title={isClockedIn ? 'Check Out for Day' : 'Check In Now'}
              icon={isClockedIn ? 'xCircle' : 'checkCircle'}
              onPress={() => setIsClockedIn(!isClockedIn)}
              variant={isClockedIn ? 'danger' : 'primary'}
              size="medium"
              style={{ minWidth: 160 }}
            />
            <TouchableOpacity onPress={() => setIsRegModalOpen(true)} style={styles.regulariseLink}>
              <Text style={[styles.regulariseLinkText, { color: colors.primary }]}>
                Request Regularisation →
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </GlassCard>

      {/* Monthly Attendance Stats Row */}
      <View style={styles.statsRow}>
        <GlassCard style={styles.smallStatCard}>
          <Text style={[styles.statNum, { color: colors.successText }]}>{stats.daysPresent}</Text>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>Days Present</Text>
        </GlassCard>
        <GlassCard style={styles.smallStatCard}>
          <Text style={[styles.statNum, { color: colors.warningText }]}>{stats.halfDays}</Text>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>Half-Days</Text>
        </GlassCard>
        <GlassCard style={styles.smallStatCard}>
          <Text style={[styles.statNum, { color: colors.primary }]}>{stats.attendanceRate}%</Text>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>Attendance %</Text>
        </GlassCard>
      </View>

      {/* 30-Day Attendance Heatmap */}
      <GlassCard style={styles.heatmapCard}>
        <View style={styles.cardHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            30-Day Attendance Heatmap
          </Text>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.colorBox, { backgroundColor: colors.success }]} />
              <Text style={[styles.legendText, { color: colors.textMuted }]}>Present</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.colorBox, { backgroundColor: colors.warning }]} />
              <Text style={[styles.legendText, { color: colors.textMuted }]}>Half-Day</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.colorBox, { backgroundColor: colors.info }]} />
              <Text style={[styles.legendText, { color: colors.textMuted }]}>Holiday</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.colorBox, { backgroundColor: colors.borderStrong }]} />
              <Text style={[styles.legendText, { color: colors.textMuted }]}>Weekend</Text>
            </View>
          </View>
        </View>

        <View style={styles.heatmapGrid}>
          {heatmap.map((item, index) => {
            let bg = colors.success;
            if (item.status === 'weekend') bg = colors.surfaceAlt;
            else if (item.status === 'leave') bg = colors.danger;
            else if (item.status === 'halfday') bg = colors.warning;
            else if (item.status === 'holiday') bg = colors.info;

            return (
              <View
                key={index}
                style={[
                  styles.heatCell,
                  { backgroundColor: bg, borderRadius: borderRadius.chip }
                ]}
              >
                <Text style={styles.heatCellText}>{item.day}</Text>
              </View>
            );
          })}
        </View>
      </GlassCard>

      {/* Who is In Today */}
      <GlassCard style={styles.rosterCard}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Who is In Today ({whoIsIn.length} logged in)
        </Text>
        <View style={styles.rosterList}>
          {whoIsIn.map((emp, i) => (
            <View key={i} style={[styles.rosterRow, { borderBottomColor: colors.borderSubtle }]}>
              <View style={styles.rosterProfile}>
                <View style={[styles.miniAvatar, { backgroundColor: colors.primary }]}>
                  <Text style={styles.avatarInitial}>{emp.name[0]}</Text>
                </View>
                <View>
                  <Text style={[styles.rosterName, { color: colors.text }]}>{emp.name}</Text>
                  <Text style={[styles.rosterRole, { color: colors.textMuted }]}>{emp.role}</Text>
                </View>
              </View>

              <View style={styles.rosterRight}>
                <Text style={[styles.rosterTime, { color: colors.textSubtle }]}>{emp.inAt}</Text>
                <Badge label={emp.status} variant={emp.status === 'In Office' ? 'Active' : 'Remote'} size="small" />
              </View>
            </View>
          ))}
        </View>
      </GlassCard>

      {/* Regularisation Modal */}
      {isRegModalOpen ? (
        <Modal
          visible={isRegModalOpen}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsRegModalOpen(false)}
        >
          <View style={styles.modalOverlay}>
            <GlassCard style={styles.modalCard}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Attendance Regularisation Request
              </Text>

              {regSuccess ? (
                <View style={{ padding: 24, alignItems: 'center' }}>
                  <Icon name="checkCircle" size={32} color={colors.success} style={{ marginBottom: 8 }} />
                  <Text style={{ fontSize: 16, fontWeight: '700', color: colors.successText }}>
                    Regularisation Request Submitted!
                  </Text>
                </View>
              ) : (
                <View style={{ gap: 10, marginVertical: 12 }}>
                  <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Date:</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.surfaceAlt, color: colors.text, borderColor: colors.border }]}
                    value={regDate}
                    onChangeText={setRegDate}
                  />

                  <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Missing Punch Time:</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.surfaceAlt, color: colors.text, borderColor: colors.border }]}
                    value={regTime}
                    onChangeText={setRegTime}
                  />

                  <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Reason:</Text>
                  <TextInput
                    style={[styles.textArea, { backgroundColor: colors.surfaceAlt, color: colors.text, borderColor: colors.border }]}
                    placeholder="e.g. Attended client demo at external venue..."
                    placeholderTextColor={colors.textSubtle}
                    multiline={true}
                    numberOfLines={3}
                    value={regReason}
                    onChangeText={setRegReason}
                  />

                  <View style={styles.modalFooter}>
                    <Button title="Cancel" variant="secondary" onPress={() => setIsRegModalOpen(false)} style={{ marginRight: 8 }} />
                    <Button title="Submit Request" variant="primary" onPress={handleRegSubmit} />
                  </View>
                </View>
              )}
            </GlassCard>
          </View>
        </Modal>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  punchCard: { marginBottom: 14 },
  punchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  liveDot: { width: 8, height: 8, borderRadius: 4 },
  statusTitle: { fontSize: 13, fontWeight: '700' },
  timerDisplay: { fontSize: 32, fontWeight: '800', letterSpacing: -0.6, marginVertical: 4, fontFamily: "'JetBrains Mono', monospace" },
  geofenceRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  geofenceText: { fontSize: 12, fontWeight: '500' },
  punchActionCol: { alignItems: 'flex-end', justifyContent: 'center' },
  regulariseLink: { marginTop: 8, paddingVertical: 4 },
  regulariseLinkText: { fontSize: 12, fontWeight: '700' },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  smallStatCard: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 14 },
  statNum: { fontSize: 24, fontWeight: '800', fontFamily: "'JetBrains Mono', monospace" },
  statLabel: { fontSize: 11, fontWeight: '600', marginTop: 4 },
  heatmapCard: { marginBottom: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '800', letterSpacing: -0.2 },
  legendRow: { flexDirection: 'row', gap: 10 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  colorBox: { width: 10, height: 10, borderRadius: 3 },
  legendText: { fontSize: 11, fontWeight: '500' },
  heatmapGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  heatCell: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  heatCellText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700', fontFamily: "'JetBrains Mono', monospace" },
  rosterCard: { marginTop: 4 },
  rosterList: { marginTop: 6 },
  rosterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1 },
  rosterProfile: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  miniAvatar: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  avatarInitial: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },
  rosterName: { fontSize: 13, fontWeight: '700' },
  rosterRole: { fontSize: 11, marginTop: 2 },
  rosterRight: { alignItems: 'flex-end', gap: 2 },
  rosterTime: { fontSize: 11, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalCard: { width: '100%', maxWidth: 460 },
  modalTitle: { fontSize: 18, fontWeight: '800' },
  fieldLabel: { fontSize: 12, fontWeight: '700' },
  input: { height: 40, borderRadius: 10, borderWidth: 1, paddingHorizontal: 12, fontSize: 14 },
  textArea: { borderRadius: 10, borderWidth: 1, padding: 10, fontSize: 14, minHeight: 70 },
  modalFooter: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 }
});

export default AttendanceView;
