import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Modal, ScrollView } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import GlassCard from '../ui/GlassCard.jsx';
import Badge from '../ui/Badge.jsx';
import Button from '../ui/Button.jsx';
import Icon from '../ui/Icon.jsx';
import { initialEmployees } from '../../services/dataStore.js';

export function DirectoryView() {
  const { colors, borderRadius } = useTheme();
  const [employees, setEmployees] = useState(initialEmployees);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'org'

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
      role: newRole.trim() || 'Software Engineer',
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
      {/* Header */}
      <View style={styles.headerBar}>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={[styles.title, { color: colors.text }]}>Employee Directory</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            {filteredEmployees.length} active team members across locations
          </Text>
        </View>

        <View style={styles.topActions}>
          <TouchableOpacity
            style={[
              styles.viewToggleBtn,
              { backgroundColor: colors.surfaceAlt, borderColor: colors.border }
            ]}
            onPress={() => setViewMode(viewMode === 'grid' ? 'org' : 'grid')}
          >
            <Icon name={viewMode === 'grid' ? 'activity' : 'dashboard'} size={15} color={colors.text} />
            <Text style={[styles.viewToggleText, { color: colors.text }]}>
              {viewMode === 'grid' ? 'Org View' : 'Grid View'}
            </Text>
          </TouchableOpacity>

          <Button
            title="Add Member"
            icon="plus"
            onPress={() => setIsAddModalOpen(true)}
            variant="primary"
            size="small"
          />
        </View>
      </View>

      {/* Search & Department Filter Chips */}
      <GlassCard style={styles.filterCard}>
        <View style={[styles.searchBox, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
          <Icon name="search" size={17} color={colors.textSubtle} style={{ marginRight: 8 }} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search by name, role, or email..."
            placeholderTextColor={colors.textSubtle}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="x" size={16} color={colors.textSubtle} />
            </TouchableOpacity>
          ) : null}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.deptScroll}>
          {departments.map((dept) => {
            const isSelected = selectedDept === dept;
            return (
              <TouchableOpacity
                key={dept}
                style={[
                  styles.deptChip,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.surfaceAlt,
                    borderColor: isSelected ? colors.primary : colors.border
                  }
                ]}
                onPress={() => setSelectedDept(dept)}
              >
                <Text
                  style={[
                    styles.deptChipText,
                    { color: isSelected ? '#FFFFFF' : colors.textMuted }
                  ]}
                >
                  {dept}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </GlassCard>

      {/* Directory Grid */}
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
                  <View style={{ flex: 1, minWidth: 0, marginLeft: 12 }}>
                    <Text style={[styles.empName, { color: colors.text }]} numberOfLines={1}>
                      {emp.name}
                    </Text>
                    <Text style={[styles.empRole, { color: colors.textMuted }]} numberOfLines={1}>
                      {emp.role}
                    </Text>
                    <Text style={[styles.empDept, { color: colors.textSubtle }]} numberOfLines={1}>
                      {emp.department} • {emp.location.split(' - ')[0]}
                    </Text>
                  </View>
                </View>

                <View style={[styles.empFooter, { borderTopColor: colors.borderSubtle }]}>
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
        /* Hierarchical Org Chart */
        <GlassCard style={styles.orgCard}>
          <Text style={[styles.sectionHeading, { color: colors.text }]}>
            Organization Hierarchy
          </Text>
          <View style={styles.orgTree}>
            <View style={[styles.orgNode, { borderColor: colors.primary, backgroundColor: colors.surfaceAlt }]}>
              <Text style={[styles.orgNodeTitle, { color: colors.text }]}>
                Executive Leadership
              </Text>
              <Text style={{ fontSize: 12, color: colors.textMuted }}>CEO & Founders</Text>
            </View>

            <View style={[styles.orgConnector, { backgroundColor: colors.borderStrong }]} />

            <View style={styles.orgLevel}>
              <View style={[styles.orgNode, { borderColor: colors.border, backgroundColor: colors.surfaceAlt }]}>
                <Text style={[styles.orgNodeTitle, { color: colors.text }]}>Elena Rostova</Text>
                <Text style={{ fontSize: 11, color: colors.textMuted }}>VP Engineering</Text>
              </View>
              <View style={[styles.orgNode, { borderColor: colors.border, backgroundColor: colors.surfaceAlt }]}>
                <Text style={[styles.orgNodeTitle, { color: colors.text }]}>Jessica Taylor</Text>
                <Text style={{ fontSize: 11, color: colors.textMuted }}>Head of People</Text>
              </View>
              <View style={[styles.orgNode, { borderColor: colors.border, backgroundColor: colors.surfaceAlt }]}>
                <Text style={[styles.orgNodeTitle, { color: colors.text }]}>Rachel Adams</Text>
                <Text style={{ fontSize: 11, color: colors.textMuted }}>Operations Director</Text>
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
                <View style={{ flex: 1, minWidth: 0, marginLeft: 14 }}>
                  <Text style={[styles.modalName, { color: colors.text }]}>
                    {selectedEmployee.name}
                  </Text>
                  <Text style={[styles.modalRole, { color: colors.textMuted }]}>
                    {selectedEmployee.role}
                  </Text>
                  <Badge label={selectedEmployee.department} variant="primary" size="small" />
                </View>
                <TouchableOpacity onPress={() => setSelectedEmployee(null)} style={styles.closeBtn}>
                  <Icon name="x" size={18} color={colors.textMuted} />
                </TouchableOpacity>
              </View>

              <View style={styles.modalBody}>
                <View style={[styles.detailRow, { borderBottomColor: colors.borderSubtle }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Icon name="mail" size={14} color={colors.textSubtle} />
                    <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Email:</Text>
                  </View>
                  <Text style={[styles.detailVal, { color: colors.text }]}>{selectedEmployee.email}</Text>
                </View>

                <View style={[styles.detailRow, { borderBottomColor: colors.borderSubtle }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Icon name="phone" size={14} color={colors.textSubtle} />
                    <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Phone:</Text>
                  </View>
                  <Text style={[styles.detailVal, { color: colors.text }]}>{selectedEmployee.phone}</Text>
                </View>

                <View style={[styles.detailRow, { borderBottomColor: colors.borderSubtle }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Icon name="mapPin" size={14} color={colors.textSubtle} />
                    <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Location:</Text>
                  </View>
                  <Text style={[styles.detailVal, { color: colors.text }]}>{selectedEmployee.location}</Text>
                </View>

                <View style={[styles.detailRow, { borderBottomColor: colors.borderSubtle }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Icon name="user" size={14} color={colors.textSubtle} />
                    <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Manager:</Text>
                  </View>
                  <Text style={[styles.detailVal, { color: colors.text }]}>{selectedEmployee.manager}</Text>
                </View>

                <View style={[styles.detailRow, { borderBottomColor: colors.borderSubtle }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Icon name="calendar" size={14} color={colors.textSubtle} />
                    <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Joined:</Text>
                  </View>
                  <Text style={[styles.detailVal, { color: colors.text }]}>{selectedEmployee.joinDate}</Text>
                </View>
              </View>

              <View style={styles.modalFooter}>
                <Button title="Close Profile" variant="secondary" onPress={() => setSelectedEmployee(null)} />
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
              <Text style={[styles.modalTitle, { color: colors.text }]}>Add New Team Member</Text>

              <View style={{ gap: 10, marginVertical: 12 }}>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surfaceAlt, color: colors.text, borderColor: colors.border }]}
                  placeholder="Full Name (e.g. Diya Sharma)"
                  placeholderTextColor={colors.textSubtle}
                  value={newName}
                  onChangeText={setNewName}
                />
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surfaceAlt, color: colors.text, borderColor: colors.border }]}
                  placeholder="Role (e.g. Senior Designer)"
                  placeholderTextColor={colors.textSubtle}
                  value={newRole}
                  onChangeText={setNewRole}
                />
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surfaceAlt, color: colors.text, borderColor: colors.border }]}
                  placeholder="Official Email (@hbplus.fit)"
                  placeholderTextColor={colors.textSubtle}
                  value={newEmail}
                  onChangeText={setNewEmail}
                />

                <View style={styles.modalFooter}>
                  <Button title="Cancel" variant="secondary" onPress={() => setIsAddModalOpen(false)} style={{ marginRight: 8 }} />
                  <Button title="Save Member" variant="primary" onPress={handleAddEmployee} />
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
  container: { width: '100%' },
  headerBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 },
  title: { fontSize: 22, fontWeight: '800', letterSpacing: -0.4 },
  subtitle: { fontSize: 13, fontWeight: '500', marginTop: 2 },
  topActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  viewToggleBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10, borderWidth: 1, gap: 6 },
  viewToggleText: { fontSize: 12, fontWeight: '700' },
  filterCard: { marginBottom: 16 },
  searchBox: { flexDirection: 'row', alignItems: 'center', height: 42, borderRadius: 12, borderWidth: 1, paddingHorizontal: 12, marginBottom: 10 },
  searchInput: { flex: 1, fontSize: 13, height: '100%' },
  deptScroll: { flexDirection: 'row', gap: 6 },
  deptChip: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999, borderWidth: 1 },
  deptChipText: { fontSize: 12, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  cardWrapper: { flex: 1, minWidth: 260, maxWidth: 540 },
  empCard: { marginVertical: 0 },
  empHeader: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 50, height: 50, borderRadius: 16, flexShrink: 0 },
  empName: { fontSize: 15, fontWeight: '800', letterSpacing: -0.2 },
  empRole: { fontSize: 12, fontWeight: '500', marginTop: 2 },
  empDept: { fontSize: 11, fontWeight: '500', marginTop: 2 },
  empFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTopWidth: 1 },
  viewDetailsText: { fontSize: 12, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalCard: { width: '100%', maxWidth: 460 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  modalAvatar: { width: 60, height: 60, borderRadius: 18, flexShrink: 0 },
  modalName: { fontSize: 18, fontWeight: '800' },
  modalRole: { fontSize: 13, marginBottom: 4 },
  closeBtn: { padding: 6 },
  modalBody: { gap: 6, marginVertical: 10 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1 },
  detailLabel: { fontSize: 12, fontWeight: '600' },
  detailVal: { fontSize: 13, fontWeight: '700' },
  modalFooter: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 14 },
  modalTitle: { fontSize: 18, fontWeight: '800' },
  input: { height: 40, borderRadius: 10, borderWidth: 1, paddingHorizontal: 12, fontSize: 14 },
  orgCard: { padding: 20 },
  sectionHeading: { fontSize: 16, fontWeight: '800', marginBottom: 16 },
  orgTree: { alignItems: 'center' },
  orgNode: { borderWidth: 1.5, borderRadius: 12, padding: 12, alignItems: 'center', minWidth: 160 },
  orgNodeTitle: { fontSize: 14, fontWeight: '800' },
  orgConnector: { width: 2, height: 20, marginVertical: 4 },
  orgLevel: { flexDirection: 'row', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }
});

export default DirectoryView;
