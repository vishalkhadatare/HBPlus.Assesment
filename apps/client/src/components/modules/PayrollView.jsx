import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import GlassCard from '../ui/GlassCard.jsx';
import Badge from '../ui/Badge.jsx';
import Button from '../ui/Button.jsx';
import { initialPayslips } from '../../services/dataStore.js';

export function PayrollView({ role = 'User' }) {
  const { colors, borderRadius } = useTheme();
  const [payslips] = useState(initialPayslips);
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const currentSalary = {
    gross: '$10,000.00',
    net: '$8,500.00',
    basic: '$6,500.00',
    hra: '$2,200.00',
    allowances: '$1,300.00',
    pf: '$600.00',
    tax: '$900.00',
    currency: 'USD'
  };

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => {
      setDownloadSuccess(false);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.headerBar}>
        <View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Payroll & Payslips</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Confidential compensation breakdown and tax receipts
          </Text>
        </View>
        <Badge label="Direct Deposit Active" variant="success" />
      </View>

      {/* Salary Overview Card */}
      <GlassCard style={styles.overviewCard}>
        <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>
          Monthly Compensation Structure
        </Text>

        <View style={styles.salaryGrid}>
          <View style={styles.salaryItem}>
            <Text style={[styles.salaryLabel, { color: colors.textSecondary }]}>Gross Monthly Pay</Text>
            <Text style={[styles.salaryAmount, { color: colors.textPrimary }]}>{currentSalary.gross}</Text>
          </View>
          <View style={styles.salaryItem}>
            <Text style={[styles.salaryLabel, { color: colors.textSecondary }]}>Total Deductions (PF+Tax)</Text>
            <Text style={[styles.salaryAmount, { color: colors.dangerText }]}>-$1,500.00</Text>
          </View>
          <View style={styles.salaryItem}>
            <Text style={[styles.salaryLabel, { color: colors.textSecondary }]}>Net Direct Deposit</Text>
            <Text style={[styles.salaryAmount, { color: colors.primary }]}>{currentSalary.net}</Text>
          </View>
        </View>

        {/* Detailed Line Items */}
        <View style={styles.lineItemsTable}>
          <View style={[styles.lineRow, { borderBottomColor: colors.borderSubtle }]}>
            <Text style={[styles.lineDesc, { color: colors.textSecondary }]}>Basic Salary</Text>
            <Text style={[styles.lineVal, { color: colors.textPrimary }]}>{currentSalary.basic}</Text>
          </View>
          <View style={[styles.lineRow, { borderBottomColor: colors.borderSubtle }]}>
            <Text style={[styles.lineDesc, { color: colors.textSecondary }]}>House Rent Allowance (HRA)</Text>
            <Text style={[styles.lineVal, { color: colors.textPrimary }]}>{currentSalary.hra}</Text>
          </View>
          <View style={[styles.lineRow, { borderBottomColor: colors.borderSubtle }]}>
            <Text style={[styles.lineDesc, { color: colors.textSecondary }]}>Special Wellness Stipend</Text>
            <Text style={[styles.lineVal, { color: colors.textPrimary }]}>{currentSalary.allowances}</Text>
          </View>
          <View style={[styles.lineRow, { borderBottomColor: colors.borderSubtle }]}>
            <Text style={[styles.lineDesc, { color: colors.dangerText }]}>Provident Fund (Employee PF)</Text>
            <Text style={[styles.lineVal, { color: colors.dangerText }]}>-{currentSalary.pf}</Text>
          </View>
          <View style={[styles.lineRow, { borderBottomColor: colors.borderSubtle }]}>
            <Text style={[styles.lineDesc, { color: colors.dangerText }]}>Federal & State Income Tax</Text>
            <Text style={[styles.lineVal, { color: colors.dangerText }]}>-{currentSalary.tax}</Text>
          </View>
        </View>
      </GlassCard>

      {/* Admin Corporate Payroll Summary (If Admin) */}
      {role === 'Admin' ? (
        <GlassCard style={[styles.adminCard, { borderColor: colors.primary }]}>
          <View style={styles.adminHeader}>
            <View>
              <Text style={[styles.adminTitle, { color: colors.primary }]}>
                🛡️ Admin Payroll Run Summary (November 2026)
              </Text>
              <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>
                Corporate bank batch #HB-202611-BATCH01
              </Text>
            </View>
            <Badge label="Batch Cleared" variant="success" size="small" />
          </View>

          <View style={styles.adminStatsRow}>
            <View>
              <Text style={{ fontSize: 11, color: colors.textMuted }}>Total Disbursed</Text>
              <Text style={{ fontSize: 20, fontWeight: '800', color: colors.textPrimary }}>$846,200.00</Text>
            </View>
            <View>
              <Text style={{ fontSize: 11, color: colors.textMuted }}>Employees Paid</Text>
              <Text style={{ fontSize: 20, fontWeight: '800', color: colors.textPrimary }}>92 / 92</Text>
            </View>
            <View>
              <Text style={{ fontSize: 11, color: colors.textMuted }}>Payment Gateway</Text>
              <Text style={{ fontSize: 14, fontWeight: '700', color: colors.textPrimary, marginTop: 4 }}>Silicon Valley Bank / ACH</Text>
            </View>
          </View>
        </GlassCard>
      ) : null}

      {/* Past Payslips List */}
      <GlassCard style={styles.payslipsCard}>
        <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>
          Historical Payslips
        </Text>

        <View style={styles.payslipList}>
          {payslips.map((ps) => (
            <View
              key={ps.id}
              style={[styles.payslipRow, { borderBottomColor: colors.borderSubtle }]}
            >
              <View style={styles.psIconContainer}>
                <Text style={styles.psIcon}>🧾</Text>
              </View>

              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.psMonth, { color: colors.textPrimary }]}>{ps.month}</Text>
                <Text style={[styles.psBank, { color: colors.textMuted }]}>
                  Disbursed on {ps.disbursedOn} • {ps.bankAccount}
                </Text>
              </View>

              <View style={styles.psRight}>
                <Text style={[styles.psAmount, { color: colors.textPrimary }]}>
                  ${ps.net.toLocaleString()}
                </Text>
                <TouchableOpacity
                  style={[styles.viewSlipBtn, { backgroundColor: colors.primarySubtle }]}
                  onPress={() => setSelectedPayslip(ps)}
                >
                  <Text style={[styles.viewSlipText, { color: colors.primary }]}>
                    View Slip →
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </GlassCard>

      {/* Interactive Payslip Modal */}
      {selectedPayslip ? (
        <Modal
          visible={Boolean(selectedPayslip)}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setSelectedPayslip(null)}
        >
          <View style={styles.modalOverlay}>
            <GlassCard style={styles.modalCard}>
              <View style={styles.slipModalHeader}>
                <View>
                  <Text style={[styles.slipBrand, { color: colors.primary }]}>HBPlus Corporate</Text>
                  <Text style={[styles.slipTitle, { color: colors.textPrimary }]}>
                    Pay Statement: {selectedPayslip.month}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setSelectedPayslip(null)}>
                  <Text style={{ fontSize: 20, color: colors.textMuted }}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.slipBody}>
                <View style={styles.slipRow}>
                  <Text style={[styles.slipLabel, { color: colors.textSecondary }]}>Gross Earnings:</Text>
                  <Text style={[styles.slipVal, { color: colors.textPrimary }]}>${selectedPayslip.gross.toLocaleString()}</Text>
                </View>
                <View style={styles.slipRow}>
                  <Text style={[styles.slipLabel, { color: colors.textSecondary }]}>Total Deductions:</Text>
                  <Text style={[styles.slipVal, { color: colors.dangerText }]}>-${(selectedPayslip.gross - selectedPayslip.net).toLocaleString()}</Text>
                </View>
                <View style={[styles.slipRow, styles.slipTotalRow, { borderColor: colors.primary }]}>
                  <Text style={[styles.slipTotalLabel, { color: colors.textPrimary }]}>Net Pay Credited:</Text>
                  <Text style={[styles.slipTotalVal, { color: colors.primary }]}>${selectedPayslip.net.toLocaleString()}</Text>
                </View>
                <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 8 }}>
                  Direct deposit processed to {selectedPayslip.bankAccount} on {selectedPayslip.disbursedOn}.
                </Text>
              </View>

              <View style={styles.modalFooter}>
                <Button
                  title={downloadSuccess ? 'Downloaded!' : 'Download PDF Statement'}
                  variant="primary"
                  onPress={handleDownload}
                  style={{ marginRight: 8 }}
                />
                <Button
                  title="Close"
                  variant="secondary"
                  onPress={() => setSelectedPayslip(null)}
                />
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
  overviewCard: {
    marginBottom: 16
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 16
  },
  salaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 20
  },
  salaryItem: {
    flex: 1,
    minWidth: 160
  },
  salaryLabel: {
    fontSize: 12,
    fontWeight: '600'
  },
  salaryAmount: {
    fontSize: 24,
    fontWeight: '900',
    marginTop: 4
  },
  lineItemsTable: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
    paddingTop: 12
  },
  lineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1
  },
  lineDesc: {
    fontSize: 13,
    fontWeight: '500'
  },
  lineVal: {
    fontSize: 13,
    fontWeight: '700'
  },
  adminCard: {
    marginBottom: 16,
    borderWidth: 1.5
  },
  adminHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  adminTitle: {
    fontSize: 15,
    fontWeight: '800'
  },
  adminStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12
  },
  payslipsCard: {
    marginBottom: 16
  },
  payslipList: {
    gap: 4
  },
  payslipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1
  },
  psIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.04)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  psIcon: {
    fontSize: 18
  },
  psMonth: {
    fontSize: 15,
    fontWeight: '700'
  },
  psBank: {
    fontSize: 12,
    marginTop: 2
  },
  psRight: {
    alignItems: 'flex-end',
    gap: 4
  },
  psAmount: {
    fontSize: 15,
    fontWeight: '800'
  },
  viewSlipBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  viewSlipText: {
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
  slipModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  slipBrand: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  slipTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2
  },
  slipBody: {
    gap: 8,
    marginVertical: 12
  },
  slipRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6
  },
  slipLabel: {
    fontSize: 13,
    fontWeight: '500'
  },
  slipVal: {
    fontSize: 14,
    fontWeight: '700'
  },
  slipTotalRow: {
    borderTopWidth: 2,
    borderBottomWidth: 2,
    paddingVertical: 10,
    marginTop: 8
  },
  slipTotalLabel: {
    fontSize: 15,
    fontWeight: '800'
  },
  slipTotalVal: {
    fontSize: 18,
    fontWeight: '900'
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16
  }
});

export default PayrollView;
