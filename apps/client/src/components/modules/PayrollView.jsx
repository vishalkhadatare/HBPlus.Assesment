import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import GlassCard from '../ui/GlassCard.jsx';
import Badge from '../ui/Badge.jsx';
import Button from '../ui/Button.jsx';
import Icon from '../ui/Icon.jsx';
import { initialPayslips } from '../../services/dataStore.js';

export function PayrollView({ role = 'User' }) {
  const { colors, borderRadius } = useTheme();
  const [payslips] = useState(initialPayslips);
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [showAmounts, setShowAmounts] = useState(true);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const currentSalary = {
    gross: '$10,000.00',
    net: '$8,500.00',
    basic: '$6,500.00',
    hra: '$2,200.00',
    allowances: '$1,300.00',
    pf: '$600.00',
    tax: '$900.00'
  };

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerBar}>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={[styles.title, { color: colors.text }]}>Payroll & Compensation</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Confidential earnings, automated tax deductions, and historical pay statements
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.eyeToggleBtn, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}
          onPress={() => setShowAmounts(!showAmounts)}
        >
          <Icon name={showAmounts ? 'eyeOff' : 'eye'} size={16} color={colors.textMuted} />
          <Text style={[styles.eyeToggleText, { color: colors.text }]}>
            {showAmounts ? 'Hide Amounts' : 'Show Amounts'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Salary Overview Card */}
      <GlassCard style={styles.overviewCard}>
        <Text style={[styles.sectionHeading, { color: colors.text }]}>
          Monthly Compensation Breakdown
        </Text>

        <View style={styles.salaryGrid}>
          <View style={styles.salaryItem}>
            <Text style={[styles.salaryLabel, { color: colors.textMuted }]}>Gross Monthly</Text>
            <Text style={[styles.salaryAmount, { color: colors.text }]}>
              {showAmounts ? currentSalary.gross : '••••••••'}
            </Text>
          </View>
          <View style={styles.salaryItem}>
            <Text style={[styles.salaryLabel, { color: colors.textMuted }]}>Total Deductions</Text>
            <Text style={[styles.salaryAmount, { color: colors.dangerText }]}>
              {showAmounts ? '-$1,500.00' : '••••••••'}
            </Text>
          </View>
          <View style={styles.salaryItem}>
            <Text style={[styles.salaryLabel, { color: colors.textMuted }]}>Net Disbursed</Text>
            <Text style={[styles.salaryAmount, { color: colors.primary }]}>
              {showAmounts ? currentSalary.net : '••••••••'}
            </Text>
          </View>
        </View>

        {/* Detailed Line Items */}
        <View style={[styles.lineItemsTable, { borderTopColor: colors.borderSubtle }]}>
          <View style={[styles.lineRow, { borderBottomColor: colors.borderSubtle }]}>
            <Text style={[styles.lineDesc, { color: colors.textMuted }]}>Basic Salary</Text>
            <Text style={[styles.lineVal, { color: colors.text }]}>{showAmounts ? currentSalary.basic : '••••'}</Text>
          </View>
          <View style={[styles.lineRow, { borderBottomColor: colors.borderSubtle }]}>
            <Text style={[styles.lineDesc, { color: colors.textMuted }]}>House Rent Allowance (HRA)</Text>
            <Text style={[styles.lineVal, { color: colors.text }]}>{showAmounts ? currentSalary.hra : '••••'}</Text>
          </View>
          <View style={[styles.lineRow, { borderBottomColor: colors.borderSubtle }]}>
            <Text style={[styles.lineDesc, { color: colors.textMuted }]}>Wellness & Fitness Stipend</Text>
            <Text style={[styles.lineVal, { color: colors.text }]}>{showAmounts ? currentSalary.allowances : '••••'}</Text>
          </View>
          <View style={[styles.lineRow, { borderBottomColor: colors.borderSubtle }]}>
            <Text style={[styles.lineDesc, { color: colors.dangerText }]}>Provident Fund (PF Contribution)</Text>
            <Text style={[styles.lineVal, { color: colors.dangerText }]}>{showAmounts ? `-${currentSalary.pf}` : '••••'}</Text>
          </View>
          <View style={[styles.lineRow, { borderBottomColor: colors.borderSubtle }]}>
            <Text style={[styles.lineDesc, { color: colors.dangerText }]}>Income Tax Withholding (TDS)</Text>
            <Text style={[styles.lineVal, { color: colors.dangerText }]}>{showAmounts ? `-${currentSalary.tax}` : '••••'}</Text>
          </View>
        </View>
      </GlassCard>

      {/* Historical Payslips */}
      <GlassCard style={styles.payslipsCard}>
        <Text style={[styles.sectionHeading, { color: colors.text }]}>
          Historical Pay Statements
        </Text>

        <View style={styles.payslipList}>
          {payslips.map((ps) => (
            <View key={ps.id} style={[styles.payslipRow, { borderBottomColor: colors.borderSubtle }]}>
              <View style={[styles.psIconContainer, { backgroundColor: colors.surfaceAlt }]}>
                <Icon name="wallet" size={18} color={colors.primary} />
              </View>

              <View style={{ flex: 1, minWidth: 0, marginLeft: 12 }}>
                <Text style={[styles.psMonth, { color: colors.text }]}>{ps.month}</Text>
                <Text style={[styles.psBank, { color: colors.textSubtle }]}>
                  Disbursed on {ps.disbursedOn} • {ps.bankAccount}
                </Text>
              </View>

              <View style={styles.psRight}>
                <Text style={[styles.psAmount, { color: colors.text }]}>
                  {showAmounts ? `$${ps.net.toLocaleString()}` : '••••'}
                </Text>
                <TouchableOpacity
                  style={[styles.viewSlipBtn, { backgroundColor: colors.primarySoft }]}
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

      {/* Payslip Modal */}
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
                  <Text style={[styles.slipBrand, { color: colors.primary }]}>HBPlus Corporate Portal</Text>
                  <Text style={[styles.slipTitle, { color: colors.text }]}>
                    Pay Statement: {selectedPayslip.month}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setSelectedPayslip(null)}>
                  <Icon name="x" size={18} color={colors.textMuted} />
                </TouchableOpacity>
              </View>

              <View style={styles.slipBody}>
                <View style={styles.slipRow}>
                  <Text style={[styles.slipLabel, { color: colors.textMuted }]}>Gross Earnings:</Text>
                  <Text style={[styles.slipVal, { color: colors.text }]}>${selectedPayslip.gross.toLocaleString()}</Text>
                </View>
                <View style={styles.slipRow}>
                  <Text style={[styles.slipLabel, { color: colors.textMuted }]}>Total Deductions:</Text>
                  <Text style={[styles.slipVal, { color: colors.dangerText }]}>-${(selectedPayslip.gross - selectedPayslip.net).toLocaleString()}</Text>
                </View>
                <View style={[styles.slipRow, styles.slipTotalRow, { borderColor: colors.primary }]}>
                  <Text style={[styles.slipTotalLabel, { color: colors.text }]}>Net Disbursed:</Text>
                  <Text style={[styles.slipTotalVal, { color: colors.primary }]}>${selectedPayslip.net.toLocaleString()}</Text>
                </View>
              </View>

              <View style={styles.modalFooter}>
                <Button
                  title={downloadSuccess ? 'Downloaded!' : 'Download PDF Statement'}
                  icon="download"
                  variant="primary"
                  onPress={handleDownload}
                  style={{ marginRight: 8 }}
                />
                <Button title="Close" variant="secondary" onPress={() => setSelectedPayslip(null)} />
              </View>
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
  eyeToggleBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, borderWidth: 1, gap: 6 },
  eyeToggleText: { fontSize: 12, fontWeight: '700' },
  overviewCard: { marginBottom: 14 },
  sectionHeading: { fontSize: 16, fontWeight: '800', marginBottom: 14, letterSpacing: -0.2 },
  salaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 16 },
  salaryItem: { flex: 1, minWidth: 140 },
  salaryLabel: { fontSize: 12, fontWeight: '600' },
  salaryAmount: { fontSize: 24, fontWeight: '800', marginTop: 4, fontFamily: "'JetBrains Mono', monospace" },
  lineItemsTable: { borderTopWidth: 1, paddingTop: 10 },
  lineRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7, borderBottomWidth: 1 },
  lineDesc: { fontSize: 13, fontWeight: '500' },
  lineVal: { fontSize: 13, fontWeight: '700', fontFamily: "'JetBrains Mono', monospace" },
  payslipsCard: { marginBottom: 14 },
  payslipList: { gap: 2 },
  payslipRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1 },
  psIconContainer: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  psMonth: { fontSize: 14, fontWeight: '700' },
  psBank: { fontSize: 11, marginTop: 2 },
  psRight: { alignItems: 'flex-end', gap: 2 },
  psAmount: { fontSize: 14, fontWeight: '800', fontFamily: "'JetBrains Mono', monospace" },
  viewSlipBtn: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  viewSlipText: { fontSize: 11, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalCard: { width: '100%', maxWidth: 460 },
  slipModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  slipBrand: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  slipTitle: { fontSize: 17, fontWeight: '800', marginTop: 2 },
  slipBody: { gap: 6, marginVertical: 10 },
  slipRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  slipLabel: { fontSize: 13, fontWeight: '500' },
  slipVal: { fontSize: 13, fontWeight: '700', fontFamily: "'JetBrains Mono', monospace" },
  slipTotalRow: { borderTopWidth: 2, borderBottomWidth: 2, paddingVertical: 8, marginTop: 6 },
  slipTotalLabel: { fontSize: 14, fontWeight: '800' },
  slipTotalVal: { fontSize: 17, fontWeight: '900', fontFamily: "'JetBrains Mono', monospace" },
  modalFooter: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 14 }
});

export default PayrollView;
