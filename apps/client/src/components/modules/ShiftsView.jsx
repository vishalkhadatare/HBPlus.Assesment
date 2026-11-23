import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, TextInput } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import GlassCard from '../ui/GlassCard.jsx';
import Badge from '../ui/Badge.jsx';
import Button from '../ui/Button.jsx';
import Icon from '../ui/Icon.jsx';
import { initialShifts } from '../../services/dataStore.js';

export function ShiftsView() {
  const { colors } = useTheme();
  const [shifts] = useState(initialShifts);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [swapTarget, setSwapTarget] = useState('Sarah Chen');
  const [swapDate, setSwapDate] = useState('2026-11-25');
  const [swapSuccess, setSwapSuccess] = useState(false);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  const handleSwapSubmit = () => {
    setSwapSuccess(true);
    setTimeout(() => {
      setIsSwapModalOpen(false);
      setSwapSuccess(false);
    }, 1200);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={[styles.title, { color: colors.text }]}>Shifts & Scheduling</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Weekly shift assignments, team rotations, and swap requests
          </Text>
        </View>

        <Button
          title="Request Swap"
          icon="refresh"
          variant="secondary"
          onPress={() => setIsSwapModalOpen(true)}
        />
      </View>

      {/* Weekly Schedule Table */}
      <GlassCard style={styles.tableCard}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.table}>
            <View style={[styles.tableHeader, { borderBottomColor: colors.borderSubtle }]}>
              <Text style={[styles.thEmployee, { color: colors.textMuted }]}>Team Member</Text>
              {days.map((d) => (
                <Text key={d} style={[styles.thDay, { color: colors.textMuted }]}>{d}</Text>
              ))}
            </View>

            {shifts.map((s, idx) => (
              <View key={idx} style={[styles.tableRow, { borderBottomColor: colors.borderSubtle }]}>
                <View style={styles.tdEmployee}>
                  <Text style={[styles.empName, { color: colors.text }]} numberOfLines={1}>{s.employee}</Text>
                  <Text style={[styles.empRole, { color: colors.textSubtle }]} numberOfLines={1}>{s.role}</Text>
                </View>
                <View style={styles.tdDay}><Badge label={s.monday.split(' - ')[0]} variant="info" size="small" showDot={false} /></View>
                <View style={styles.tdDay}><Badge label={s.tuesday.split(' - ')[0]} variant="info" size="small" showDot={false} /></View>
                <View style={styles.tdDay}><Badge label={s.wednesday.split(' - ')[0]} variant="info" size="small" showDot={false} /></View>
                <View style={styles.tdDay}><Badge label={s.thursday.split(' - ')[0]} variant="info" size="small" showDot={false} /></View>
                <View style={styles.tdDay}><Badge label={s.friday.split(' - ')[0]} variant="info" size="small" showDot={false} /></View>
              </View>
            ))}
          </View>
        </ScrollView>
      </GlassCard>

      {/* Shift Swap Modal */}
      {isSwapModalOpen ? (
        <Modal
          visible={isSwapModalOpen}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsSwapModalOpen(false)}
        >
          <View style={styles.modalOverlay}>
            <GlassCard style={styles.modalCard}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Request Shift Swap
              </Text>

              {swapSuccess ? (
                <View style={{ padding: 20, alignItems: 'center' }}>
                  <Icon name="checkCircle" size={28} color={colors.success} style={{ marginBottom: 8 }} />
                  <Text style={{ fontSize: 15, fontWeight: '700', color: colors.successText }}>
                    Swap Request Dispatched!
                  </Text>
                </View>
              ) : (
                <View style={{ gap: 10, marginVertical: 10 }}>
                  <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Colleague to Swap With:</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.surfaceAlt, color: colors.text, borderColor: colors.border }]}
                    value={swapTarget}
                    onChangeText={setSwapTarget}
                  />

                  <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Target Date:</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.surfaceAlt, color: colors.text, borderColor: colors.border }]}
                    value={swapDate}
                    onChangeText={setSwapDate}
                  />

                  <View style={styles.modalFooter}>
                    <Button title="Cancel" variant="secondary" onPress={() => setIsSwapModalOpen(false)} style={{ marginRight: 8 }} />
                    <Button title="Submit Swap" variant="primary" onPress={handleSwapSubmit} />
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
  headerBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 },
  title: { fontSize: 22, fontWeight: '800', letterSpacing: -0.4 },
  subtitle: { fontSize: 13, fontWeight: '500', marginTop: 2 },
  tableCard: { padding: 0 },
  table: { minWidth: 600 },
  tableHeader: { flexDirection: 'row', padding: 12, borderBottomWidth: 1 },
  thEmployee: { width: 150, fontSize: 12, fontWeight: '700' },
  thDay: { flex: 1, fontSize: 12, fontWeight: '700', textAlign: 'center' },
  tableRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1 },
  tdEmployee: { width: 150 },
  empName: { fontSize: 13, fontWeight: '700' },
  empRole: { fontSize: 11, marginTop: 2 },
  tdDay: { flex: 1, alignItems: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalCard: { width: '100%', maxWidth: 440 },
  modalTitle: { fontSize: 18, fontWeight: '800' },
  fieldLabel: { fontSize: 12, fontWeight: '700' },
  input: { height: 40, borderRadius: 10, borderWidth: 1, paddingHorizontal: 12, fontSize: 14 },
  modalFooter: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 }
});

export default ShiftsView;
