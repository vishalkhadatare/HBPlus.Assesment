import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import GlassCard from '../ui/GlassCard.jsx';
import Badge from '../ui/Badge.jsx';
import Button from '../ui/Button.jsx';
import { initialLeaveBalances, initialLeaveRequests } from '../../services/dataStore.js';

export function LeaveView({ role = 'User' }) {
  const { colors, borderRadius } = useTheme();
  const [balances, setBalances] = useState(initialLeaveBalances);
  const [requests, setRequests] = useState(initialLeaveRequests);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('my-leaves'); // 'my-leaves' | 'approvals'

  // Form state
  const [leaveType, setLeaveType] = useState('Casual Leave');
  const [startDate, setStartDate] = useState('2026-12-10');
  const [endDate, setEndDate] = useState('2026-12-12');
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
      employeeName: 'You (Current User)',
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

  return (
    <View style={styles.container}>
      {/* Top Header & Apply Button */}
      <View style={styles.headerBar}>
        <View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Leave Management</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Review balances, apply for time off, and manage team requests
          </Text>
        </View>

        <Button
          title="+ Apply for Leave"
          variant="primary"
          onPress={() => setIsApplyModalOpen(true)}
        />
      </View>

      {/* Leave Balances Grid */}
      <View style={styles.balancesGrid}>
        <GlassCard style={styles.balanceCard}>
          <Text style={[styles.balanceType, { color: colors.textSecondary }]}>Casual Leave</Text>
          <Text style={[styles.balanceNum, { color: colors.primary }]}>
            {balances.casual.total - balances.casual.used}
            <Text style={[styles.balanceTotal, { color: colors.textMuted }]}>
              /{balances.casual.total}
            </Text>
          </Text>
          <Text style={[styles.balanceSub, { color: colors.textMuted }]}>
            {balances.casual.used} days consumed this year
          </Text>
        </GlassCard>

        <GlassCard style={styles.balanceCard}>
          <Text style={[styles.balanceType, { color: colors.textSecondary }]}>Sick Leave</Text>
          <Text style={[styles.balanceNum, { color: colors.warningText }]}>
            {balances.sick.total - balances.sick.used}
            <Text style={[styles.balanceTotal, { color: colors.textMuted }]}>
              /{balances.sick.total}
            </Text>
          </Text>
          <Text style={[styles.balanceSub, { color: colors.textMuted }]}>
            {balances.sick.used} days consumed this year
          </Text>
        </GlassCard>

        <GlassCard style={styles.balanceCard}>
          <Text style={[styles.balanceType, { color: colors.textSecondary }]}>Annual Paid Leave</Text>
          <Text style={[styles.balanceNum, { color: colors.successText }]}>
            {balances.annual.total - balances.annual.used}
            <Text style={[styles.balanceTotal, { color: colors.textMuted }]}>
              /{balances.annual.total}
            </Text>
          </Text>
          <Text style={[styles.balanceSub, { color: colors.textMuted }]}>
            {balances.annual.used} days consumed this year
          </Text>
        </GlassCard>
      </View>

      {/* Tabs & Table */}
      <GlassCard style={styles.tableCard}>
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'my-leaves' && styles.tabActive]}
            onPress={() => setActiveTab('my-leaves')}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === 'my-leaves' ? colors.primary : colors.textSecondary }
              ]}
            >
              All Requests ({requests.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'approvals' && styles.tabActive]}
            onPress={() => setActiveTab('approvals')}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === 'approvals' ? colors.primary : colors.textSecondary }
              ]}
            >
              Pending Approvals ({requests.filter((r) => r.status === 'Pending').length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Requests List */}
        <View style={styles.requestsList}>
          {requests
            .filter((r) => (activeTab === 'approvals' ? r.status === 'Pending' : true))
            .map((req) => (
              <View
                key={req.id}
                style={[styles.requestRow, { borderBottomColor: colors.borderSubtle }]}
              >
                <View style={{ flex: 2 }}>
                  <Text style={[styles.reqEmp, { color: colors.textPrimary }]}>
                    {req.employeeName}
                  </Text>
                  <Text style={[styles.reqType, { color: colors.textSecondary }]}>
                    {req.leaveType} • {req.days} {req.days === 1 ? 'day' : 'days'}
                  </Text>
                  <Text style={[styles.reqReason, { color: colors.textMuted }]}>
                    "{req.reason}"
                  </Text>
                </View>

                <View style={{ flex: 1.5 }}>
                  <Text style={[styles.reqDates, { color: colors.textPrimary }]}>
                    {req.startDate} to {req.endDate}
                  </Text>
                  <Text style={[styles.reqApplied, { color: colors.textMuted }]}>
                    Applied: {req.appliedOn}
                  </Text>
                </View>

                <View style={styles.actionsCol}>
                  <Badge label={req.status} variant={req.status} size="small" />

                  {req.status === 'Pending' ? (
                    <View style={styles.btnRow}>
                      <TouchableOpacity
                        style={[styles.actionPill, { backgroundColor: colors.successSubtle }]}
                        onPress={() => handleApprove(req.id)}
                      >
                        <Text style={[styles.pillText, { color: colors.successText }]}>✓ Approve</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionPill, { backgroundColor: colors.dangerSubtle }]}
                        onPress={() => handleReject(req.id)}
                      >
                        <Text style={[styles.pillText, { color: colors.dangerText }]}>✕ Reject</Text>
                      </TouchableOpacity>
                    </View>
                  ) : null}
                </View>
              </View>
            ))}
        </View>
      </GlassCard>

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
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                Apply for Leave
              </Text>

              <View style={styles.formGap}>
                <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Leave Type:</Text>
                <View style={styles.typeSelector}>
                  {['Casual Leave', 'Sick Leave', 'Annual Paid Leave'].map((t) => (
                    <TouchableOpacity
                      key={t}
                      style={[
                        styles.typePill,
                        {
                          backgroundColor: leaveType === t ? colors.primary : colors.surfaceSubtle,
                          borderColor: leaveType === t ? colors.primary : colors.border
                        }
                      ]}
                      onPress={() => setLeaveType(t)}
                    >
                      <Text
                        style={[
                          styles.typePillText,
                          { color: leaveType === t ? '#FFFFFF' : colors.textSecondary }
                        ]}
                      >
                        {t}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.twoCol}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Start Date:</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: colors.surfaceSubtle, color: colors.textPrimary, borderColor: colors.border }]}
                      value={startDate}
                      onChangeText={setStartDate}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>End Date:</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: colors.surfaceSubtle, color: colors.textPrimary, borderColor: colors.border }]}
                      value={endDate}
                      onChangeText={setEndDate}
                    />
                  </View>
                </View>

                <View style={[styles.durationBadge, { backgroundColor: colors.primarySubtle }]}>
                  <Text style={[styles.durationText, { color: colors.primary }]}>
                    Calculated Duration: {calculateDays()} business days
                  </Text>
                </View>

                <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Reason for Request:</Text>
                <TextInput
                  style={[styles.textArea, { backgroundColor: colors.surfaceSubtle, color: colors.textPrimary, borderColor: colors.border }]}
                  placeholder="Provide brief context for manager approval..."
                  placeholderTextColor={colors.textMuted}
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
                    title="Submit Application"
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
    marginBottom: 16
  },
  title: {
    fontSize: 20,
    fontWeight: '800'
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2
  },
  balancesGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16
  },
  balanceCard: {
    flex: 1
  },
  balanceType: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6
  },
  balanceNum: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5
  },
  balanceTotal: {
    fontSize: 18,
    fontWeight: '600'
  },
  balanceSub: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 4
  },
  tableCard: {
    padding: 0
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingHorizontal: 16
  },
  tabItem: {
    paddingVertical: 12,
    marginRight: 20
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#10B981'
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700'
  },
  requestsList: {
    padding: 16
  },
  requestRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    flexWrap: 'wrap',
    gap: 12
  },
  reqEmp: {
    fontSize: 14,
    fontWeight: '800'
  },
  reqType: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2
  },
  reqReason: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 2
  },
  reqDates: {
    fontSize: 13,
    fontWeight: '700'
  },
  reqApplied: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2
  },
  actionsCol: {
    alignItems: 'flex-end',
    gap: 6
  },
  btnRow: {
    flexDirection: 'row',
    gap: 6
  },
  actionPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  pillText: {
    fontSize: 11,
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
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16
  },
  formGap: {
    gap: 10
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700'
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  typePill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1
  },
  typePillText: {
    fontSize: 12,
    fontWeight: '700'
  },
  twoCol: {
    flexDirection: 'row',
    gap: 12
  },
  durationBadge: {
    padding: 8,
    borderRadius: 8,
    alignItems: 'center'
  },
  durationText: {
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
    marginTop: 12
  }
});

export default LeaveView;
