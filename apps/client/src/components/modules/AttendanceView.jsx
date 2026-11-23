import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import GlassCard from '../ui/GlassCard.jsx';
import Badge from '../ui/Badge.jsx';
import Button from '../ui/Button.jsx';
import { getAttendanceStats, getMonthlyHeatmap, getWhoIsInToday } from '../../services/attendanceService.js';

export function AttendanceView() {
  const { colors, borderRadius } = useTheme();
  const [stats, setStats] = useState(getAttendanceStats());
  const [heatmap] = useState(getMonthlyHeatmap());
  const [whoIsIn] = useState(getWhoIsInToday());
  const [isClockedIn, setIsClockedIn] = useState(true);
  const [workSeconds, setWorkSeconds] = useState(stats.totalWorkSeconds);
  const [isRegularisationModalOpen, setIsRegularisationModalOpen] = useState(false);
  const [regularisationSubmitted, setRegularisationSubmitted] = useState(false);

  // Form state
  const [regDate, setRegDate] = useState('2026-11-20');
  const [regTime, setRegTime] = useState('09:00 AM');
  const [regReason, setRegReason] = useState('');

  // Live timer tick
  useEffect(() => {
    let timer;
    if (isClockedIn) {
      timer = setInterval(() => {
        setWorkSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isClockedIn]);

  const formatTimer = (totalSec) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const togglePunch = () => {
    setIsClockedIn(!isClockedIn);
  };

  const handleRegularisationSubmit = () => {
    setRegularisationSubmitted(true);
    setTimeout(() => {
      setIsRegularisationModalOpen(false);
      setRegularisationSubmitted(false);
    }, 1200);
  };

  return (
    <View style={styles.container}>
      {/* Top Banner: Clock-In & Live Work Timer */}
      <GlassCard style={styles.punchCard}>
        <View style={styles.punchRow}>
          <View>
            <View style={styles.statusRow}>
              <View
                style={[
                  styles.liveIndicatorDot,
                  { backgroundColor: isClockedIn ? colors.success : colors.danger }
                ]}
              />
              <Text style={[styles.statusTitle, { color: colors.textPrimary }]}>
                {isClockedIn ? 'Currently Clocked In' : 'Clocked Out'}
              </Text>
            </View>

            <Text style={[styles.timerDisplay, { color: colors.textPrimary }]}>
              {formatTimer(workSeconds)}
            </Text>

            <View style={styles.geofenceRow}>
              <Text style={styles.geofenceIcon}>📍</Text>
              <Text style={[styles.geofenceText, { color: colors.textSecondary }]}>
                San Francisco HQ (Verified Geofence)
              </Text>
              <Badge label="Verified" variant="success" size="small" />
            </View>
          </View>

          <View style={styles.punchActionCol}>
            <Button
              title={isClockedIn ? 'Clock Out for Day' : 'Clock In Now'}
              onPress={togglePunch}
              variant={isClockedIn ? 'danger' : 'primary'}
              size="medium"
              style={styles.punchButton}
            />
            <TouchableOpacity
              onPress={() => setIsRegularisationModalOpen(true)}
              style={styles.regulariseLink}
            >
              <Text style={[styles.regulariseLinkText, { color: colors.primary }]}>
                Request Regularisation
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </GlassCard>

      {/* Monthly Attendance Stats Row */}
      <View style={styles.statsRow}>
        <GlassCard style={styles.smallStatCard}>
          <Text style={[styles.statNum, { color: colors.successText }]}>{stats.daysPresent}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Days Present</Text>
        </GlassCard>
        <GlassCard style={styles.smallStatCard}>
          <Text style={[styles.statNum, { color: colors.warningText }]}>{stats.halfDays}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Half-Days</Text>
        </GlassCard>
        <GlassCard style={styles.smallStatCard}>
          <Text style={[styles.statNum, { color: colors.primary }]}>{stats.attendanceRate}%</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Attendance %</Text>
        </GlassCard>
      </View>

      {/* 30-Day Attendance Heatmap Calendar */}
      <GlassCard style={styles.heatmapCard}>
        <View style={styles.cardHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            30-Day Attendance Heatmap
          </Text>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.colorBox, { backgroundColor: colors.success }]} />
              <Text style={[styles.legendText, { color: colors.textSecondary }]}>Present</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.colorBox, { backgroundColor: colors.warning }]} />
              <Text style={[styles.legendText, { color: colors.textSecondary }]}>Half-Day</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.colorBox, { backgroundColor: colors.info }]} />
              <Text style={[styles.legendText, { color: colors.textSecondary }]}>Holiday</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.colorBox, { backgroundColor: '#CBD5E1' }]} />
              <Text style={[styles.legendText, { color: colors.textSecondary }]}>Weekend</Text>
            </View>
          </View>
        </View>

        <View style={styles.heatmapGrid}>
          {heatmap.map((item, index) => {
            let bg = colors.success;
            if (item.status === 'weekend') bg = '#E2E8F0';
            else if (item.status === 'leave') bg = colors.danger;
            else if (item.status === 'halfday') bg = colors.warning;
            else if (item.status === 'holiday') bg = colors.info;

            return (
              <View
                key={index}
                style={[
                  styles.heatCell,
                  { backgroundColor: bg, borderRadius: borderRadius.sm }
                ]}
              >
                <Text style={styles.heatCellText}>{item.day}</Text>
              </View>
            );
          })}
        </View>
      </GlassCard>

      {/* Who is In Today Live List */}
      <GlassCard style={styles.rosterCard}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Who is In Today ({whoIsIn.length} checked in)
        </Text>
        <View style={styles.rosterList}>
          {whoIsIn.map((emp, i) => (
            <View key={i} style={[styles.rosterRow, { borderBottomColor: colors.borderSubtle }]}>
              <View style={styles.rosterProfile}>
                <View style={styles.miniAvatar}>
                  <Text style={styles.avatarInitial}>{emp.name[0]}</Text>
                </View>
                <View>
                  <Text style={[styles.rosterName, { color: colors.textPrimary }]}>{emp.name}</Text>
                  <Text style={[styles.rosterRole, { color: colors.textSecondary }]}>{emp.role}</Text>
                </View>
              </View>

              <View style={styles.rosterRight}>
                <Text style={[styles.rosterTime, { color: colors.textMuted }]}>{emp.inAt}</Text>
                <Badge label={emp.status} variant={emp.status === 'In Office' ? 'Active' : 'Remote'} size="small" />
              </View>
            </View>
          ))}
        </View>
      </GlassCard>

      {/* Regularisation Request Modal */}
      {isRegularisationModalOpen ? (
        <Modal
          visible={isRegularisationModalOpen}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsRegularisationModalOpen(false)}
        >
          <View style={styles.modalOverlay}>
            <GlassCard style={styles.modalCard}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                Attendance Regularisation Request
              </Text>
              <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
                Submit a request for missing punches or biometric check-in discrepancies.
              </Text>

              {regularisationSubmitted ? (
                <View style={styles.successBox}>
                  <Text style={{ fontSize: 24, textAlign: 'center', marginBottom: 8 }}>✅</Text>
                  <Text style={{ fontSize: 15, fontWeight: '700', textAlign: 'center', color: colors.successText }}>
                    Regularisation Request Submitted!
                  </Text>
                  <Text style={{ fontSize: 12, textAlign: 'center', color: colors.textSecondary, marginTop: 4 }}>
                    Your manager and HR have been notified for approval.
                  </Text>
                </View>
              ) : (
                <View style={styles.formContainer}>
                  <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Date:</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.surfaceSubtle, color: colors.textPrimary, borderColor: colors.border }]}
                    value={regDate}
                    onChangeText={setRegDate}
                  />

                  <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Missing Punch Time:</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.surfaceSubtle, color: colors.textPrimary, borderColor: colors.border }]}
                    value={regTime}
                    onChangeText={setRegTime}
                  />

                  <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Reason for Regularisation:</Text>
                  <TextInput
                    style={[styles.textArea, { backgroundColor: colors.surfaceSubtle, color: colors.textPrimary, borderColor: colors.border }]}
                    placeholder="e.g. Attended offsite client meeting..."
                    placeholderTextColor={colors.textMuted}
                    multiline={true}
                    numberOfLines={3}
                    value={regReason}
                    onChangeText={setRegReason}
                  />

                  <View style={styles.modalFooter}>
                    <Button
                      title="Cancel"
                      variant="secondary"
                      onPress={() => setIsRegularisationModalOpen(false)}
                      style={{ marginRight: 8 }}
                    />
                    <Button
                      title="Submit Request"
                      variant="primary"
                      onPress={handleRegularisationSubmit}
                    />
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
  container: {
    width: '100%'
  },
  punchCard: {
    marginBottom: 12
  },
  punchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  liveIndicatorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '700'
  },
  timerDisplay: {
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -1,
    marginVertical: 4
  },
  geofenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  geofenceIcon: {
    fontSize: 14
  },
  geofenceText: {
    fontSize: 12,
    fontWeight: '500'
  },
  punchActionCol: {
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  punchButton: {
    minWidth: 160
  },
  regulariseLink: {
    marginTop: 8,
    paddingVertical: 4
  },
  regulariseLinkText: {
    fontSize: 12,
    fontWeight: '700'
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12
  },
  smallStatCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16
  },
  statNum: {
    fontSize: 24,
    fontWeight: '800'
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4
  },
  heatmapCard: {
    marginBottom: 12
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 8
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800'
  },
  legendRow: {
    flexDirection: 'row',
    gap: 12
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  colorBox: {
    width: 12,
    height: 12,
    borderRadius: 3
  },
  legendText: {
    fontSize: 11,
    fontWeight: '500'
  },
  heatmapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  heatCell: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center'
  },
  heatCellText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  },
  rosterCard: {
    marginTop: 4
  },
  rosterList: {
    marginTop: 8
  },
  rosterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1
  },
  rosterProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  miniAvatar: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15
  },
  rosterName: {
    fontSize: 14,
    fontWeight: '700'
  },
  rosterRole: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2
  },
  rosterRight: {
    alignItems: 'flex-end',
    gap: 4
  },
  rosterTime: {
    fontSize: 12,
    fontWeight: '600'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  modalCard: {
    width: '100%',
    maxWidth: 480
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800'
  },
  modalSubtitle: {
    fontSize: 13,
    marginTop: 4,
    marginBottom: 16
  },
  formContainer: {
    gap: 10
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700'
  },
  input: {
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 14
  },
  textArea: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    fontSize: 14,
    minHeight: 70
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 14
  },
  successBox: {
    padding: 24,
    alignItems: 'center'
  }
});

export default AttendanceView;
