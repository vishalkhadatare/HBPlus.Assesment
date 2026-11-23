import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Modal, ScrollView } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import GlassCard from '../ui/GlassCard.jsx';
import Badge from '../ui/Badge.jsx';
import Button from '../ui/Button.jsx';
import { initialEmployees } from '../../services/dataStore.js';

export function DirectoryView() {
  const { colors, borderRadius } = useTheme();
  const [employees, setEmployees] = useState(initialEmployees);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'org'

  // New employee form state
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newDept, setNewDept] = useState('Engineering');
  const [newEmail, setNewEmail] = useState('');

  const departments = ['All', 'Engineering', 'Design', 'HR', 'Operations', 'Marketing'];

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const handleAddEmployee = () => {
    if (!newName.trim() || !newEmail.trim()) return;
    const newEmp = {
      id: `emp-${Date.now()}`,
      name: newName.trim(),
      role: newRole.trim() || 'Team Member',
      department: newDept,
      email: newEmail.trim(),
      phone: '+1 (555) 019-8234',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      location: 'San Francisco HQ',
      joinDate: new Date().toISOString().split('T')[0],
      manager: 'David Kim'
    };
    setEmployees([newEmp, ...employees]);
    setNewName('');
    setNewRole('');
    setNewEmail('');
    setIsAddModalOpen(false);
  };

  return (
    <View style={styles.container}>
      {/* Top Header & Actions */}
      <View style={styles.headerBar}>
        <View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Employee Directory</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {filteredEmployees.length} active team members
          </Text>
        </View>

        <View style={styles.topActions}>
          <TouchableOpacity
            style={[
              styles.viewToggleBtn,
              { backgroundColor: viewMode === 'grid' ? colors.primarySubtle : colors.surfaceSubtle }
            ]}
            onPress={() => setViewMode(viewMode === 'grid' ? 'org' : 'grid')}
          >
            <Text style={{ fontSize: 13, fontWeight: '700', color: colors.textPrimary }}>
              {viewMode === 'grid' ? '🌳 Org Chart View' : '🔲 Grid View'}
            </Text>
          </TouchableOpacity>

          <Button
            title="+ Add Member"
            onPress={() => setIsAddModalOpen(true)}
            variant="primary"
            size="small"
          />
        </View>
      </View>

      {/* Search & Filter Bar */}
      <GlassCard style={styles.filterCard}>
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: colors.surfaceSubtle,
              color: colors.textPrimary,
              borderColor: colors.border
            }
          ]}
          placeholder="Search by name, role, or email..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.deptScroll}>
          {departments.map((dept) => {
            const isSelected = selectedDept === dept;
            return (
              <TouchableOpacity
                key={dept}
                style={[
                  styles.deptChip,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.surfaceSubtle,
                    borderColor: isSelected ? colors.primary : colors.border
                  }
                ]}
                onPress={() => setSelectedDept(dept)}
              >
                <Text
                  style={[
                    styles.deptChipText,
                    { color: isSelected ? '#FFFFFF' : colors.textSecondary }
                  ]}
                >
                  {dept}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </GlassCard>

      {/* Directory Grid View */}
      {viewMode === 'grid' ? (
        <View style={styles.grid}>
          {filteredEmployees.map((emp) => (
            <TouchableOpacity
              key={emp.id}
              style={styles.cardWrapper}
              onPress={() => setSelectedEmployee(emp)}
              activeOpacity={0.85}
            >
              <GlassCard style={styles.empCard}>
                <View style={styles.empHeader}>
                  <Image source={{ uri: emp.avatar }} style={styles.avatar} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[styles.empName, { color: colors.textPrimary }]}>{emp.name}</Text>
                    <Text style={[styles.empRole, { color: colors.textSecondary }]}>{emp.role}</Text>
                    <Text style={[styles.empDept, { color: colors.textMuted }]}>{emp.department}</Text>
                  </View>
                </View>

                <View style={styles.empFooter}>
                  <Badge label={emp.status} variant={emp.status} size="small" />
                  <Text style={[styles.viewDetailsText, { color: colors.primary }]}>
                    View Profile →
                  </Text>
                </View>
              </GlassCard>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        /* Hierarchical Org Chart View */
        <GlassCard style={styles.orgCard}>
          <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>
            Organization Hierarchy
          </Text>
          <View style={styles.orgTree}>
            <View style={[styles.orgNode, styles.orgRoot, { borderColor: colors.primary }]}>
              <Text style={[styles.orgNodeTitle, { color: colors.textPrimary }]}>
                Executive Leadership
              </Text>
              <Text style={{ fontSize: 12, color: colors.textSecondary }}>CEO & Founders</Text>
            </View>

            <View style={styles.orgConnector} />

            <View style={styles.orgLevel}>
              <View style={[styles.orgNode, { borderColor: colors.border }]}>
                <Text style={[styles.orgNodeTitle, { color: colors.textPrimary }]}>
                  Elena Rostova
                </Text>
                <Text style={{ fontSize: 11, color: colors.textSecondary }}>VP of Engineering</Text>
              </View>
              <View style={[styles.orgNode, { borderColor: colors.border }]}>
                <Text style={[styles.orgNodeTitle, { color: colors.textPrimary }]}>
                  Jessica Taylor
                </Text>
                <Text style={{ fontSize: 11, color: colors.textSecondary }}>Head of People</Text>
              </View>
              <View style={[styles.orgNode, { borderColor: colors.border }]}>
                <Text style={[styles.orgNodeTitle, { color: colors.textPrimary }]}>
                  Rachel Adams
                </Text>
                <Text style={{ fontSize: 11, color: colors.textSecondary }}>Operations Director</Text>
              </View>
            </View>
          </View>
        </GlassCard>
      )}

      {/* Employee Detail Modal */}
      {selectedEmployee ? (
        <Modal
          visible={Boolean(selectedEmployee)}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setSelectedEmployee(null)}
        >
          <View style={styles.modalOverlay}>
            <GlassCard style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Image source={{ uri: selectedEmployee.avatar }} style={styles.modalAvatar} />
                <View style={{ flex: 1, marginLeft: 16 }}>
                  <Text style={[styles.modalName, { color: colors.textPrimary }]}>
                    {selectedEmployee.name}
                  </Text>
                  <Text style={[styles.modalRole, { color: colors.textSecondary }]}>
                    {selectedEmployee.role}
                  </Text>
                  <Badge label={selectedEmployee.department} variant="purple" size="small" />
                </View>
                <TouchableOpacity onPress={() => setSelectedEmployee(null)} style={styles.closeBtn}>
                  <Text style={{ fontSize: 20, color: colors.textMuted }}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.modalBody}>
                <View style={styles.modalDetailRow}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Official Email:</Text>
                  <Text style={[styles.detailValue, { color: colors.textPrimary }]}>{selectedEmployee.email}</Text>
                </View>
                <View style={styles.modalDetailRow}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Phone Number:</Text>
                  <Text style={[styles.detailValue, { color: colors.textPrimary }]}>{selectedEmployee.phone}</Text>
                </View>
                <View style={styles.modalDetailRow}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Office Location:</Text>
                  <Text style={[styles.detailValue, { color: colors.textPrimary }]}>{selectedEmployee.location}</Text>
                </View>
                <View style={styles.modalDetailRow}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Reporting Manager:</Text>
                  <Text style={[styles.detailValue, { color: colors.textPrimary }]}>{selectedEmployee.manager}</Text>
                </View>
                <View style={styles.modalDetailRow}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Joined HBPlus:</Text>
                  <Text style={[styles.detailValue, { color: colors.textPrimary }]}>{selectedEmployee.joinDate}</Text>
                </View>
              </View>

              <View style={styles.modalFooter}>
                <Button
                  title="Close Profile"
                  variant="secondary"
                  onPress={() => setSelectedEmployee(null)}
                />
              </View>
            </GlassCard>
          </View>
        </Modal>
      ) : null}

      {/* Add Employee Modal */}
      {isAddModalOpen ? (
        <Modal
          visible={isAddModalOpen}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsAddModalOpen(false)}
        >
          <View style={styles.modalOverlay}>
            <GlassCard style={styles.modalCard}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                Add New Team Member
              </Text>

              <TextInput
                style={[styles.input, { backgroundColor: colors.surfaceSubtle, color: colors.textPrimary, borderColor: colors.border }]}
                placeholder="Full Name (e.g. Liam Taylor)"
                placeholderTextColor={colors.textMuted}
                value={newName}
                onChangeText={setNewName}
              />
              <TextInput
                style={[styles.input, { backgroundColor: colors.surfaceSubtle, color: colors.textPrimary, borderColor: colors.border }]}
                placeholder="Job Role (e.g. Product Manager)"
                placeholderTextColor={colors.textMuted}
                value={newRole}
                onChangeText={setNewRole}
              />
              <TextInput
                style={[styles.input, { backgroundColor: colors.surfaceSubtle, color: colors.textPrimary, borderColor: colors.border }]}
                placeholder="Official Email (@hbplus.fit)"
                placeholderTextColor={colors.textMuted}
                value={newEmail}
                onChangeText={setNewEmail}
              />

              <View style={styles.modalFooter}>
                <Button
                  title="Cancel"
                  variant="secondary"
                  onPress={() => setIsAddModalOpen(false)}
                  style={{ marginRight: 8 }}
                />
                <Button
                  title="Save Member"
                  variant="primary"
                  onPress={handleAddEmployee}
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
    marginBottom: 12
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  viewToggleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8
  },
  filterCard: {
    marginBottom: 16
  },
  searchInput: {
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 14,
    marginBottom: 12
  },
  deptScroll: {
    flexDirection: 'row'
  },
  deptChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    marginRight: 8
  },
  deptChipText: {
    fontSize: 12,
    fontWeight: '700'
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  cardWrapper: {
    flex: 1,
    minWidth: 280,
    maxWidth: 460
  },
  empCard: {
    marginVertical: 0
  },
  empHeader: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 16
  },
  empName: {
    fontSize: 15,
    fontWeight: '800'
  },
  empRole: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2
  },
  empDept: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2
  },
  empFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)'
  },
  viewDetailsText: {
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
    alignItems: 'center',
    marginBottom: 16
  },
  modalAvatar: {
    width: 64,
    height: 64,
    borderRadius: 20
  },
  modalName: {
    fontSize: 18,
    fontWeight: '800'
  },
  modalRole: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4
  },
  closeBtn: {
    padding: 6
  },
  modalBody: {
    marginVertical: 12,
    gap: 10
  },
  modalDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)'
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '600'
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700'
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16
  },
  input: {
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 14,
    marginBottom: 12
  },
  orgCard: {
    padding: 20
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 16
  },
  orgTree: {
    alignItems: 'center'
  },
  orgNode: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    minWidth: 160
  },
  orgRoot: {
    minWidth: 200
  },
  orgNodeTitle: {
    fontSize: 14,
    fontWeight: '800'
  },
  orgConnector: {
    width: 2,
    height: 24,
    backgroundColor: '#CBD5E1',
    marginVertical: 4
  },
  orgLevel: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
    justifyContent: 'center'
  }
});

export default DirectoryView;
