import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import GlassCard from '../ui/GlassCard.jsx';
import Badge from '../ui/Badge.jsx';
import Button from '../ui/Button.jsx';
import Icon from '../ui/Icon.jsx';
import { ProgressRing } from '../ui/SimpleCharts.jsx';
import { initialLeaveBalances, initialLeaveRequests } from '../../services/dataStore.js';

export function LeaveView({ role = 'User' }) {
  const { colors, borderRadius } = useTheme();
  const [balances, setBalances] = useState(initialLeaveBalances);
  const [requests, setRequests] = useState(initialLeaveRequests);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('my-leaves'); // 'my-leaves' | 'team' | 'approvals'

  // Apply form state
  const [leaveType, setLeaveType] = useState('Casual Leave');
  const [startDate, setStartDate] = useState('2026-12-08');
  const [endDate, setEndDate] = useState('2026-12-11');
  const [leaveReason, setLeaveReason] = useState('');

  const calculateDays = () => {
    try {
      const s = new Date(startDate);
      const e = new Date(endDate);
      const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1;
      return diff > 0 ? diff : 1;
    } catch {
      return 1;
    }
  };

  const handleApplyLeave = () => {
    if (!leaveReason.trim()) return;
    const days = calculateDays();
    const newReq = {
      id: `lr-${Date.now()}`,
      employeeName: 'Aarav Mehta',
      leaveType,
      startDate,
      endDate,
      days,
      reason: leaveReason.trim(),
      status: 'Pending',
      appliedOn: new Date().toISOString().split('T')[0]
    };
    setRequests([newReq, ...requests]);
    setLeaveReason('');
    setIsApplyModalOpen(false);
  };

  const handleApprove = (id) => {
    setRequests(
      requests.map((r) => (r.id === id ? { ...r, status: 'Approved' } : r))
    );
  };

  const handleReject = (id) => {
    setRequests(
      requests.map((r) => (r.id === id ? { ...r, status: 'Rejected' } : r))
    );
  };

  const filteredRequests = requests.filter((r) => {
    if (activeTab === 'approvals') return r.status === 'Pending';
    if (activeTab === 'team') return true;
    return true;
  });

  return (
    <View style={styles.container}>
      {/* Top Header & Action */}
      <View style={styles.headerBar}>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={[styles.title, { color: colors.text }]}>Time Off & Leaves</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Track allowances, request approvals, and view team calendar
          </Text>
        </View>

        <Button
          title="Apply for Leave"
          icon="plus"
          variant="primary"
          onPress={() => setIsApplyModalOpen(true)}
          size="medium"
        />
      </View>

      {/* Horizontally Scrollable Balance Cards with ProgressRings (Section 9.5) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.balanceCardsScroll}
      >
        {/* Casual Leave */}
        <GlassCard style={styles.balanceCard}>
          <View style={styles.balanceCardRow}>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={[styles.balanceCardLabel, { color: colors.textMuted }]}>Casual Leave</Text>
              <Text style={[styles.balanceCardValue, { color: colors.primary }]}>
                {balances.casual.total - balances.casual.used}
                <Text style={[styles.balanceCardTotal, { color: colors.textSubtle }]}>
                  /{balances.casual.total}
                </Text>
              </Text>
              <Text style={[styles.balanceCardSub, { color: colors.textSubtle }]}>
                {balances.casual.used} days used
              </Text>
            </View>
            <ProgressRing
              size={56}
              strokeWidth={6}
              progress={Math.round(((balances.casual.total - balances.casual.used) / balances.casual.total) * 100)}
              color={colors.primary}
              centerContent={
                <Icon name="leave" size={16} color={colors.primary} />
              }
            />
          </View>
        </GlassCard>

        {/* Sick Leave */}
        <GlassCard style={styles.balanceCard}>
          <View style={styles.balanceCardRow}>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={[styles.balanceCardLabel, { color: colors.textMuted }]}>Sick Leave</Text>
              <Text style={[styles.balanceCardValue, { color: colors.warningText }]}>
                {balances.sick.total - balances.sick.used}
                <Text style={[styles.balanceCardTotal, { color: colors.textSubtle }]}>
                  /{balances.sick.total}
                </Text>
              </Text>
              <Text style={[styles.balanceCardSub, { color: colors.textSubtle }]}>
                {balances.sick.used} days used
              </Text>
            </View>
            <ProgressRing
              size={56}
              strokeWidth={6}
              progress={Math.round(((balances.sick.total - balances.sick.used) / balances.sick.total) * 100)}
              color={colors.warning}
              centerContent={
                <Icon name="activity" size={16} color={colors.warning} />
              }
            />
          </View>
        </GlassCard>

        {/* Annual Paid Leave */}
        <GlassCard style={styles.balanceCard}>
          <View style={styles.balanceCardRow}>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={[styles.balanceCardLabel, { color: colors.textMuted }]}>Annual Leave</Text>
              <Text style={[styles.balanceCardValue, { color: colors.successText }]}>
                {balances.annual.total - balances.annual.used}
                <Text style={[styles.balanceCardTotal, { color: colors.textSubtle }]}>
                  /{balances.annual.total}
                </Text>
              </Text>
              <Text style={[styles.balanceCardSub, { color: colors.textSubtle }]}>
                {balances.annual.used} days used
              </Text>
            </View>
            <ProgressRing
              size={56}
              strokeWidth={6}
              progress={Math.round(((balances.annual.total - balances.annual.used) / balances.annual.total) * 100)}
              color={colors.success}
              centerContent={
                <Icon name="sun" size={16} color={colors.success} />
              }
            />
          </View>
        </GlassCard>
      </ScrollView>

      {/* Segmented Control Tabs */}
      <View style={[styles.segmentedControl, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.segmentBtn, activeTab === 'my-leaves' && { backgroundColor: colors.surface, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }]}
          onPress={() => setActiveTab('my-leaves')}
        >
          <Text style={[styles.segmentText, { color: activeTab === 'my-leaves' ? colors.primary : colors.textMuted }]}>
            My Requests ({requests.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.segmentBtn, activeTab === 'approvals' && { backgroundColor: colors.surface, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }]}
          onPress={() => setActiveTab('approvals')}
        >
          <Text style={[styles.segmentText, { color: activeTab === 'approvals' ? colors.primary : colors.textMuted }]}>
            Pending Approvals ({requests.filter((r) => r.status === 'Pending').length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.segmentBtn, activeTab === 'team' && { backgroundColor: colors.surface, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }]}
          onPress={() => setActiveTab('team')}
        >
          <Text style={[styles.segmentText, { color: activeTab === 'team' ? colors.primary : colors.textMuted }]}>
            Team Calendar
          </Text>
        </TouchableOpacity>
      </View>

      {/* Requests List (Cards Architecture - Completely Immunized Against 1-Char Text Wrap!) */}
      <View style={styles.requestsContainer}>
        {filteredRequests.map((req) => (
          <GlassCard key={req.id} style={styles.leaveCard}>
            {/* Top Row: Employee Avatar + Info & Status Chip */}
            <View style={styles.cardHeaderRow}>
              <View style={styles.empHeaderLeft}>
                <View style={[styles.avatarCircle, { backgroundColor: colors.primary }]}>
                  <Text style={styles.avatarLetter}>{req.employeeName[0]}</Text>
                </View>

                <View style={{ flex: 1, minWidth: 0, marginLeft: 10 }}>
                  <Text style={[styles.cardEmpName, { color: colors.text }]} numberOfLines={1}>
                    {req.employeeName}
                  </Text>
                  <View style={styles.typeDurationRow}>
                    <Text style={[styles.cardTypeLabel, { color: colors.textMuted }]}>
                      {req.leaveType}
                    </Text>
                    <View style={styles.durationChip}>
                      <Text style={[styles.durationChipText, { color: colors.primary }]}>
                        {req.days} {req.days === 1 ? 'day' : 'days'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <Badge label={req.status} variant={req.status} size="small" />
            </View>

            {/* Date Range & Applied Date */}
            <View style={styles.dateRangeBox}>
              <Icon name="calendar" size={15} color={colors.textMuted} />
              <Text style={[styles.dateRangeText, { color: colors.text }]}>
                {req.startDate} → {req.endDate}
              </Text>
              <Text style={[styles.appliedDateText, { color: colors.textSubtle }]}>
                (Applied: {req.appliedOn})
              </Text>
            </View>

            {/* Reason Quoted */}
            <View style={[styles.reasonWrapper, { backgroundColor: colors.surfaceAlt }]}>
              <Text style={[styles.reasonText, { color: colors.textMuted }]} numberOfLines={2}>
                "{req.reason}"
              </Text>
            </View>

            {/* Manager Action Buttons (Only when Pending) */}
            {req.status === 'Pending' ? (
              <View style={[styles.cardActionsRow, { borderTopColor: colors.borderSubtle }]}>
                <TouchableOpacity
                  style={[styles.actionBtnApprove, { backgroundColor: colors.successSoft }]}
                  onPress={() => handleApprove(req.id)}
                  activeOpacity={0.8}
                >
                  <Icon name="checkCircle" size={15} color={colors.successText} />
                  <Text style={[styles.actionBtnText, { color: colors.successText }]}>Approve</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionBtnReject, { backgroundColor: colors.dangerSoft }]}
                  onPress={() => handleReject(req.id)}
                  activeOpacity={0.8}
                >
                  <Icon name="xCircle" size={15} color={colors.dangerText} />
                  <Text style={[styles.actionBtnText, { color: colors.dangerText }]}>Reject</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </GlassCard>
        ))}
      </View>

      {/* Apply Leave Modal */}
      {isApplyModalOpen ? (
        <Modal
          visible={isApplyModalOpen}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsApplyModalOpen(false)}
        >
          <View style={styles.modalOverlay}>
            <GlassCard style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={[styles.modalTitle, { color: colors.text }]}>Apply for Leave</Text>
                  <Text style={[styles.modalSubtitle, { color: colors.textMuted }]}>
                    Submit request for manager review
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setIsApplyModalOpen(false)} style={styles.modalClose}>
                  <Icon name="x" size={18} color={colors.textMuted} />
                </TouchableOpacity>
              </View>

              <View style={styles.modalForm}>
                <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Leave Type:</Text>
                <View style={styles.typeSelector}>
                  {['Casual Leave', 'Sick Leave', 'Annual Paid Leave'].map((t) => (
                    <TouchableOpacity
                      key={t}
                      style={[
                        styles.typePill,
                        {
                          backgroundColor: leaveType === t ? colors.primarySoft : colors.surfaceAlt,
                          borderColor: leaveType === t ? colors.primary : colors.border
                        }
                      ]}
                      onPress={() => setLeaveType(t)}
                    >
                      <Text
                        style={[
                          styles.typePillText,
                          { color: leaveType === t ? colors.primary : colors.text }
                        ]}
                      >
                        {t}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.formRow}>
                  <View style={{ flex: 1, minWidth: 0, marginRight: 8 }}>
                    <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Start Date:</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: colors.surfaceAlt, color: colors.text, borderColor: colors.border }]}
                      value={startDate}
                      onChangeText={setStartDate}
                    />
                  </View>
                  <View style={{ flex: 1, minWidth: 0, marginLeft: 8 }}>
                    <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>End Date:</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: colors.surfaceAlt, color: colors.text, borderColor: colors.border }]}
                      value={endDate}
                      onChangeText={setEndDate}
                    />
                  </View>
                </View>

                <View style={[styles.durationBadge, { backgroundColor: colors.primarySoft }]}>
                  <Icon name="clock" size={14} color={colors.primary} />
                  <Text style={[styles.durationText, { color: colors.primary }]}>
                    Calculated: {calculateDays()} business days
                  </Text>
                </View>

                <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Reason for Request:</Text>
                <TextInput
                  style={[styles.textArea, { backgroundColor: colors.surfaceAlt, color: colors.text, borderColor: colors.border }]}
                  placeholder="Provide brief context for approval..."
                  placeholderTextColor={colors.textSubtle}
                  multiline={true}
                  numberOfLines={3}
                  value={leaveReason}
                  onChangeText={setLeaveReason}
                />

                <View style={styles.modalFooter}>
                  <Button
                    title="Cancel"
                    variant="secondary"
                    onPress={() => setIsApplyModalOpen(false)}
                    style={{ marginRight: 8 }}
                  />
                  <Button
                    title="Submit Request"
                    variant="primary"
                    onPress={handleApplyLeave}
                  />
                </View>
              </View>
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
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 12
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2
  },
  balanceCardsScroll: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 16
  },
  balanceCard: {
    width: 220,
    marginVertical: 0
  },
  balanceCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  balanceCardLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: -0.1
  },
  balanceCardValue: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.6,
    marginVertical: 2,
    fontFamily: "'JetBrains Mono', monospace"
  },
  balanceCardTotal: {
    fontSize: 16,
    fontWeight: '500'
  },
  balanceCardSub: {
    fontSize: 11,
    fontWeight: '500'
  },
  segmentedControl: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    padding: 3,
    marginBottom: 16
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '700'
  },
  requestsContainer: {
    gap: 12
  },
  leaveCard: {
    marginVertical: 0
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10
  },
  empHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  avatarLetter: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14
  },
  cardEmpName: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2
  },
  typeDurationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2
  },
  cardTypeLabel: {
    fontSize: 12,
    fontWeight: '500'
  },
  durationChip: {
    backgroundColor: 'rgba(91, 91, 240, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6
  },
  durationChipText: {
    fontSize: 11,
    fontWeight: '700'
  },
  dateRangeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    flexWrap: 'wrap'
  },
  dateRangeText: {
    fontSize: 13,
    fontWeight: '600'
  },
  appliedDateText: {
    fontSize: 11
  },
  reasonWrapper: {
    padding: 10,
    borderRadius: 10,
    marginTop: 8
  },
  reasonText: {
    fontSize: 12,
    lineHeight: 16,
    fontStyle: 'italic'
  },
  cardActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1
  },
  actionBtnApprove: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4
  },
  actionBtnReject: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700'
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
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800'
  },
  modalSubtitle: {
    fontSize: 12,
    marginTop: 2
  },
  modalClose: {
    padding: 6
  },
  modalForm: {
    gap: 10
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700'
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6
  },
  typePill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1
  },
  typePillText: {
    fontSize: 12,
    fontWeight: '600'
  },
  formRow: {
    flexDirection: 'row'
  },
  input: {
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 14
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    gap: 6
  },
  durationText: {
    fontSize: 12,
    fontWeight: '700'
  },
  textArea: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    fontSize: 14,
    minHeight: 70
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10
  }
});

export default LeaveView;
