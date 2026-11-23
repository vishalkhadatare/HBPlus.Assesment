import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  useWindowDimensions,
  Modal
} from 'react-native';
import { useAuth } from '../../hooks/useAuth.js';
import { RoleThemeProvider, useRoleTheme } from '../../theme/roleThemes.js';
import { CARD_RADIUS } from '../../theme/shape.js';
import HBLogo from '../brand/HBLogo.jsx';
import Icon from '../ui/Icon.jsx';
import SquaredCard from '../ui/SquaredCard.jsx';
import SquaredButton from '../ui/SquaredButton.jsx';
import SimpleCharts from '../ui/SimpleCharts.jsx';
import workforceStore from '../../services/workforceStore.js';

// ─── Metric Card for Mobile 2×2 grid ────────────────────────────────────────
function MetricCard({ value, badge, badgeColor, badgeBg, subtitle, iconName, iconBg, label }) {
  return (
    <View style={metricStyles.card}>
      <View style={metricStyles.topRow}>
        <View style={[metricStyles.iconCircle, { backgroundColor: iconBg }]}>
          <Icon name={iconName} size={18} color="#FFFFFF" strokeWidth={2} />
        </View>
        <View style={[metricStyles.badge, { backgroundColor: badgeBg }]}>
          <Text style={[metricStyles.badgeText, { color: badgeColor }]}>{badge}</Text>
        </View>
      </View>
      <Text style={metricStyles.value}>{value}</Text>
      <Text style={metricStyles.label}>{label}</Text>
      <Text style={metricStyles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const metricStyles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    flex: 1,
    minWidth: 140,
    gap: 4,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 2px 4px rgba(0,0,0,0.04), 0 8px 16px rgba(0,0,0,0.06)' }
      : { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.07, shadowRadius: 12, elevation: 3 })
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center'
  },
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700'
  },
  value: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    fontVariant: ['tabular-nums']
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.4,
    textTransform: 'uppercase'
  },
  subtitle: {
    fontSize: 11,
    color: '#64748B'
  }
});

// ─── Department Breakdown Card ───────────────────────────────────────────────
function DeptBreakdownCard() {
  const depts = [
    { label: 'Engineering', pct: 45, color: '#0F766E' },
    { label: 'Product', pct: 20, color: '#2563EB' },
    { label: 'Ops', pct: 22, color: '#7C3AED' },
    { label: 'Admin', pct: 13, color: '#D97706' }
  ];
  return (
    <View style={deptStyles.card}>
      <Text style={deptStyles.title}>Department Breakdown</Text>
      <Text style={deptStyles.sub}>Distribution of 248 staff</Text>
      {/* Segmented bar */}
      <View style={deptStyles.segBar}>
        {depts.map((d) => (
          <View key={d.label} style={[deptStyles.seg, { flex: d.pct, backgroundColor: d.color }]} />
        ))}
      </View>
      {/* Legend */}
      <View style={deptStyles.legendRow}>
        {depts.map((d) => (
          <View key={d.label} style={deptStyles.legendItem}>
            <View style={[deptStyles.legendDot, { backgroundColor: d.color }]} />
            <Text style={deptStyles.legendLabel}>{d.label}</Text>
            <Text style={[deptStyles.legendPct, { color: d.color }]}>{d.pct}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const deptStyles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    gap: 12,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 2px 4px rgba(0,0,0,0.04), 0 8px 16px rgba(0,0,0,0.06)' }
      : { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.07, shadowRadius: 12, elevation: 3 })
  },
  title: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  sub: { fontSize: 12, color: '#64748B', marginTop: -6 },
  segBar: {
    flexDirection: 'row',
    height: 10,
    borderRadius: 6,
    overflow: 'hidden',
    gap: 2
  },
  seg: { borderRadius: 4 },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 4
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { fontSize: 11, color: '#64748B', fontWeight: '500' },
  legendPct: { fontSize: 11, fontWeight: '700' }
});

// ─── Employee Card (mobile list) ─────────────────────────────────────────────
function EmployeeCard({ user }) {
  const initials = user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  const avatarColors = ['#0F766E', '#2563EB', '#7C3AED', '#D97706', '#C2410C'];
  const avatarColor = avatarColors[user.id.charCodeAt(user.id.length - 1) % avatarColors.length];
  return (
    <View style={empStyles.card}>
      <View style={[empStyles.avatar, { backgroundColor: avatarColor }]}>
        <Text style={empStyles.avatarText}>{initials}</Text>
      </View>
      <View style={empStyles.info}>
        <Text style={empStyles.name}>{user.name}</Text>
        <Text style={empStyles.email}>{user.email}</Text>
      </View>
      <View style={empStyles.badges}>
        <View style={[empStyles.badge, user.role === 'Admin' ? empStyles.badgeAdmin : empStyles.badgeUser]}>
          <Text style={[empStyles.badgeText, user.role === 'Admin' ? { color: '#FFFFFF' } : { color: '#334155' }]}>
            {user.role}
          </Text>
        </View>
        <View style={[empStyles.badge, user.status === 'Active' ? empStyles.badgeActive : empStyles.badgeLeave]}>
          <Text style={[empStyles.badgeText, user.status === 'Active' ? { color: '#059669' } : { color: '#2563EB' }]}>
            {user.status}
          </Text>
        </View>
      </View>
    </View>
  );
}

const empStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    gap: 10,
    marginBottom: 8,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 4px 8px rgba(0,0,0,0.04)' }
      : { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 })
  },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  info: { flex: 1, gap: 2 },
  name: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  email: { fontSize: 11, color: '#64748B' },
  badges: { flexDirection: 'column', gap: 4, alignItems: 'flex-end' },
  badge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  badgeAdmin: { backgroundColor: '#EA580C' },
  badgeUser: { backgroundColor: '#E2E8F0' },
  badgeActive: { backgroundColor: '#ECFDF5' },
  badgeLeave: { backgroundColor: '#EFF6FF' },
  badgeText: { fontSize: 10, fontWeight: '700' }
});

// ─── Main Shell Content ───────────────────────────────────────────────────────
function AdminShellContent({ onSignOut }) {
  const { user, profile } = useAuth();
  const theme = useRoleTheme();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;
  const isTablet = width >= 600 && width < 900;

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'users' | 'approvals' | 'reports' | 'audit' | 'settings' | 'profile'
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserFilter, setSelectedUserFilter] = useState('all');
  const [toastMessage, setToastMessage] = useState(null);

  // Workforce reactive state subscription
  const [storeState, setStoreState] = useState(workforceStore.getState());
  useEffect(() => {
    return workforceStore.subscribe((s) => setStoreState({ ...s }));
  }, []);

  const adminProfile = storeState.adminProfile || {
    displayName: 'Elena Rostova',
    email: user?.email || 'elena.rostova@hbplus.fit',
    phone: '+91 99887 76655',
    department: 'Platform Governance & Security',
    designation: 'Principal Security Administrator',
    employeeId: 'HBP-ADM-001',
    clearanceLevel: 'Level 4 (Full Governance Authority)',
    location: 'Bangalore HQ (Security Command Room)',
    emergencyContact: 'Chief Security Officer (+91 98000 11223)',
    bio: 'Principal system security architect managing enterprise access governance, strict domain compliance, and organizational telemetry across HB Plus.'
  };

  const pendingApprovals = (storeState.leaveRequests || []).filter(
    (req) => (req.status || '').toLowerCase() === 'pending'
  );

  // Broadcast Modal State
  const [broadcastModalOpen, setBroadcastModalOpen] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastContent, setBroadcastContent] = useState('');
  const [broadcastPriority, setBroadcastPriority] = useState('High');
  const [broadcastDept, setBroadcastDept] = useState('All Departments');

  // Admin Profile Edit State
  const [isEditingAdminProfile, setIsEditingAdminProfile] = useState(false);
  const [adminName, setAdminName] = useState(adminProfile.displayName);
  const [adminPhone, setAdminPhone] = useState(adminProfile.phone);
  const [adminDept, setAdminDept] = useState(adminProfile.department);
  const [adminDesignation, setAdminDesignation] = useState(adminProfile.designation);
  const [adminBio, setAdminBio] = useState(adminProfile.bio);
  const [adminEmergency, setAdminEmergency] = useState(adminProfile.emergencyContact);
  const [adminClearance, setAdminClearance] = useState(adminProfile.clearanceLevel || 'Level 4 (Full Governance Authority)');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleApprove = (id, name) => {
    workforceStore.actionLeaveRequest(id, 'approve');
    showToast(`Approved leave request for ${name}`);
  };

  const handleReject = (id, name) => {
    workforceStore.actionLeaveRequest(id, 'reject');
    showToast(`Rejected request for ${name}`);
  };

  const handleSaveAdminProfile = () => {
    workforceStore.updateAdminProfile({
      displayName: adminName,
      phone: adminPhone,
      department: adminDept,
      designation: adminDesignation,
      bio: adminBio,
      emergencyContact: adminEmergency,
      clearanceLevel: adminClearance
    });
    setIsEditingAdminProfile(false);
    showToast('Admin Profile & Security Clearance updated.');
  };

  const handlePublishBroadcast = () => {
    if (!broadcastTitle.trim()) {
      showToast('Please enter an announcement title');
      return;
    }
    workforceStore.addAnnouncement({
      title: broadcastTitle.trim(),
      content: broadcastContent.trim() || 'Important corporate operational update for all personnel.',
      priority: broadcastPriority,
      department: broadcastDept
    });
    setBroadcastTitle('');
    setBroadcastContent('');
    setBroadcastModalOpen(false);
    showToast(`Broadcast published to ${broadcastDept}`);
  };

  const defaultUsers = [
    { id: 'usr-1', name: 'Elena Rostova', email: 'elena.rostova@hbplus.fit', role: 'Admin', department: 'Security Operations', status: 'Active' },
    { id: 'usr-2', name: 'Rachel Green', email: 'rachel.green@hbplus.fit', role: 'User', department: 'Engineering Systems', status: 'Active' },
    { id: 'usr-3', name: 'Marcus Vance', email: 'marcus.vance@hbplus.fit', role: 'User', department: 'Core Infrastructure', status: 'Active' },
    { id: 'usr-4', name: 'Aaliyah Khan', email: 'aaliyah.khan@hbplus.fit', role: 'User', department: 'Frontend Systems', status: 'Active' },
    { id: 'usr-5', name: 'Lucas Sterling', email: 'lucas.s@hbplus.fit', role: 'User', department: 'Product Engineering', status: 'On Leave' }
  ];

  const workforceUsers = (storeState && storeState.employees && storeState.employees.length > 0) ? storeState.employees : defaultUsers;
  const sampleUsers = workforceUsers;

  const filteredUsers = workforceUsers.filter((u) => {
    const nameStr = (u.name || '').toLowerCase();
    const emailStr = (u.email || '').toLowerCase();
    const deptStr = (u.department || u.dept || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch = nameStr.includes(query) || emailStr.includes(query) || deptStr.includes(query);

    if (selectedUserFilter === 'all') return matchesSearch;
    if (selectedUserFilter === 'admin') return matchesSearch && (u.role || '').toLowerCase().includes('admin');
    if (selectedUserFilter === 'user') return matchesSearch && !(u.role || '').toLowerCase().includes('admin');
    return matchesSearch;
  });

  const navSections = [
    {
      title: 'Overview',
      items: [
        { id: 'overview', label: 'Control Room', icon: 'dashboard' }
      ]
    },
    {
      title: 'People',
      items: [
        { id: 'users', label: 'Workforce & Roles', icon: 'directory' }
      ]
    },
    {
      title: 'Operations',
      items: [
        { id: 'approvals', label: 'Pending Approvals', icon: 'checkSquare', badge: pendingApprovals.length > 0 ? pendingApprovals.length : null }
      ]
    },
    {
      title: 'System',
      items: [
        { id: 'reports', label: 'Reports & Analytics', icon: 'reports' },
        { id: 'audit', label: 'Audit Log Feed', icon: 'activity' },
        { id: 'settings', label: 'System Settings', icon: 'settings' }
      ]
    },
    {
      title: 'Administrator',
      items: [
        { id: 'profile', label: 'Admin Profile', icon: 'user' }
      ]
    }
  ];

  // ── MOBILE LAYOUT ────────────────────────────────────────────────────────
  if (!isDesktop && !isTablet) {
    return (
      <View style={styles.root}>
        {/* ── Mobile Top Bar ── */}
        <View style={styles.mobileTopBar}>
          {/* Left: Logo + Admin badge */}
          <View style={styles.mobileTopLeft}>
            <HBLogo size={32} />
            <View style={styles.mobileAdminBadge}>
              <Icon name="shieldCheck" size={11} color="#EA580C" strokeWidth={2.4} />
              <Text style={styles.mobileAdminBadgeText}>Admin</Text>
            </View>
          </View>

          {/* Center: Online dot */}
          <View style={styles.mobileStatusPill}>
            <View style={styles.onlineDot} />
            <Text style={styles.mobileStatusText}>Online</Text>
          </View>

          {/* Right: Bell + Logout */}
          <View style={styles.mobileTopRight}>
            <TouchableOpacity style={styles.mobileIconBtn} activeOpacity={0.7}>
              <Icon name="bell" size={18} color="#0F172A" />
              <View style={styles.bellBadge} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.mobileIconBtn} onPress={onSignOut} activeOpacity={0.7}>
              <Icon name="logout" size={18} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Toast */}
        {toastMessage ? (
          <View style={styles.toastCard}>
            <Icon name="checkCircle" size={16} color="#00B386" />
            <Text style={styles.toastText}>{toastMessage}</Text>
          </View>
        ) : null}

        {/* ── Scrollable Content ── */}
        <ScrollView
          style={styles.mobileScroll}
          contentContainerStyle={styles.mobileScrollInner}
          showsVerticalScrollIndicator={false}
        >
          {/* Search bar */}
          <View style={styles.mobileSearchBar}>
            <Icon name="search" size={16} color="#94A3B8" />
            <TextInput
              style={styles.mobileSearchInput}
              placeholder="Search people, audit logs..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* ── Tab: Overview ── */}
          {activeTab === 'overview' && (
            <>
              {/* Broadcast Banner */}
              <View style={[styles.mobileSectionCard, { backgroundColor: '#FFF7ED', borderColor: '#FFEDD5', borderWidth: 1, paddingVertical: 12 }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={[styles.mobileSectionTitle, { color: '#C2410C' }]}>Admin Broadcast Center</Text>
                    <Text style={styles.mobileSectionSub}>Push real-time notices to all employee portals</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.approveCircleBtn, { backgroundColor: '#EA580C', width: 'auto', paddingHorizontal: 12, borderRadius: 10, height: 36, flexDirection: 'row', gap: 6 }]}
                    onPress={() => setBroadcastModalOpen(true)}
                  >
                    <Icon name="bell" size={14} color="#FFFFFF" />
                    <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '700' }}>+ Broadcast</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* 4 Metric Cards 2×2 grid */}
              <View style={styles.metricsGrid}>
                <MetricCard
                  value={String(storeState.totalWorkforce || 248)}
                  badge="+12%"
                  badgeColor="#059669"
                  badgeBg="#ECFDF5"
                  label="Total Workforce"
                  subtitle="Active accounts across 6 depts"
                  iconName="dashboard"
                  iconBg="#0F766E"
                />
                <MetricCard
                  value={String(storeState.presentCount || 231)}
                  badge={`${Math.round(((storeState.presentCount || 231) / (storeState.totalWorkforce || 248)) * 100)}%`}
                  badgeColor="#059669"
                  badgeBg="#ECFDF5"
                  label="Present Today"
                  subtitle="1-tap geofence verified"
                  iconName="fingerprint"
                  iconBg="#2563EB"
                />
              </View>
              <View style={[styles.metricsGrid, { marginTop: 10 }]}>
                <MetricCard
                  value="12"
                  badge="4.8%"
                  badgeColor="#2563EB"
                  badgeBg="#EFF6FF"
                  label="On Leave"
                  subtitle="8 planned, 4 medical"
                  iconName="calendar"
                  iconBg="#D97706"
                />
                <MetricCard
                  value={String(pendingApprovals.length)}
                  badge={pendingApprovals.length > 0 ? "Action" : "Clear"}
                  badgeColor={pendingApprovals.length > 0 ? "#D97706" : "#059669"}
                  badgeBg={pendingApprovals.length > 0 ? "#FEF3C7" : "#ECFDF5"}
                  label="Pending Approvals"
                  subtitle="Requires admin review"
                  iconName="bell"
                  iconBg="#C2410C"
                />
              </View>

              {/* Attendance Trend Card */}
              <View style={styles.mobileSectionCard}>
                <View style={styles.mobileSectionHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.mobileSectionTitle}>Attendance Trend (30 Days)</Text>
                    <Text style={styles.mobileSectionSub}>Workforce presence vs scheduled shifts</Text>
                  </View>
                  <View style={styles.slaTag}>
                    <Text style={styles.slaTagText}>99.4% SLA</Text>
                  </View>
                </View>
                <SimpleCharts type="bar" height={160} />
              </View>

              {/* Dept Breakdown */}
              <DeptBreakdownCard />

              {/* Workforce Governance */}
              <View style={styles.mobileSectionCard}>
                <View style={styles.mobileSectionHeader}>
                  <Text style={styles.mobileSectionTitle}>Workforce Governance</Text>
                </View>
                {/* Filter tabs */}
                <View style={styles.mobileFilterRow}>
                  {['all', 'admin', 'user'].map((f) => (
                    <TouchableOpacity
                      key={f}
                      style={[styles.mobileFilterTab, selectedUserFilter === f && styles.mobileFilterTabActive]}
                      onPress={() => setSelectedUserFilter(f)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.mobileFilterTabText, selectedUserFilter === f && styles.mobileFilterTabTextActive]}>
                        {f.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {filteredUsers.slice(0, 5).map((u) => (
                  <EmployeeCard key={u.id} user={u} />
                ))}
              </View>

              {/* Pending Approvals Queue */}
              <View style={styles.mobileSectionCard}>
                <Text style={styles.mobileSectionTitle}>Pending Approvals Queue</Text>
                <Text style={[styles.mobileSectionSub, { marginBottom: 8 }]}>Real-time requests awaiting sign-off</Text>
                {pendingApprovals.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Icon name="checkCircle" size={28} color="#059669" />
                    <Text style={styles.emptyStateText}>All pending approvals cleared!</Text>
                  </View>
                ) : (
                  pendingApprovals.map((req) => {
                    const reqName = req.employeeName || req.name;
                    const reqDept = req.department || req.dept || 'Engineering';
                    const reqType = req.leaveType || req.type;
                    const reqDates = req.dates || `${req.startDate} to ${req.endDate} (${req.days} days)`;
                    return (
                      <View key={req.id} style={styles.mobileApprovalCard}>
                        <View style={{ flex: 1, gap: 2 }}>
                          <Text style={styles.approvalName}>{reqName}</Text>
                          <Text style={styles.approvalMeta}>{reqDept} • {reqType}</Text>
                          <Text style={styles.approvalMeta}>{reqDates}</Text>
                          {req.reason ? <Text style={[styles.approvalMeta, { fontStyle: 'italic' }]}>"{req.reason}"</Text> : null}
                        </View>
                        <View style={styles.approvalActions}>
                          <TouchableOpacity
                            style={styles.approveCircleBtn}
                            onPress={() => handleApprove(req.id, reqName)}
                            activeOpacity={0.8}
                          >
                            <Icon name="checkCircle" size={20} color="#FFFFFF" strokeWidth={2} />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.rejectCircleBtn}
                            onPress={() => handleReject(req.id, reqName)}
                            activeOpacity={0.8}
                          >
                            <Icon name="xCircle" size={20} color="#FFFFFF" strokeWidth={2} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })
                )}
              </View>

              {/* Audit Log Feed */}
              <View style={styles.mobileSectionCard}>
                <Text style={styles.mobileSectionTitle}>Audit Log Feed</Text>
                <Text style={[styles.mobileSectionSub, { marginBottom: 8 }]}>Immutable compliance telemetry</Text>
                {(storeState.auditLogs || []).slice(0, 5).map((log) => (
                  <View key={log.id} style={styles.mobileAuditRow}>
                    <Text style={styles.auditTime}>{log.time}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.auditAction}>{log.text || log.action}</Text>
                      <Text style={styles.auditActor}>{(log.type || 'SYSTEM').toUpperCase()} • Verified</Text>
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}

          {activeTab === 'users' && (
            <View style={styles.mobileSectionCard}>
              <Text style={styles.mobileSectionTitle}>Workforce Directory & Role Provisioning</Text>
              <Text style={styles.mobileSectionSub}>Full employee roster with direct privilege elevation tools.</Text>
              <View style={[styles.mobileFilterRow, { marginTop: 12 }]}>
                {['all', 'admin', 'user'].map((f) => (
                  <TouchableOpacity
                    key={f}
                    style={[styles.mobileFilterTab, selectedUserFilter === f && styles.mobileFilterTabActive]}
                    onPress={() => setSelectedUserFilter(f)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.mobileFilterTabText, selectedUserFilter === f && styles.mobileFilterTabTextActive]}>
                      {f.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {filteredUsers.map((u) => (
                <EmployeeCard key={u.id} user={u} />
              ))}
            </View>
          )}

          {activeTab === 'approvals' && (
            <View style={styles.mobileSectionCard}>
              <Text style={styles.mobileSectionTitle}>Pending Approvals</Text>
              <Text style={[styles.mobileSectionSub, { marginBottom: 8 }]}>Review time-off and reimbursement requests.</Text>
              {pendingApprovals.length === 0 ? (
                <View style={styles.emptyState}>
                  <Icon name="checkCircle" size={28} color="#059669" />
                  <Text style={styles.emptyStateText}>All pending approvals cleared!</Text>
                </View>
              ) : (
                pendingApprovals.map((req) => {
                  const reqName = req.employeeName || req.name;
                  const reqDept = req.department || req.dept || 'Engineering';
                  const reqType = req.leaveType || req.type;
                  const reqDates = req.dates || `${req.startDate} to ${req.endDate} (${req.days} days)`;
                  return (
                    <View key={req.id} style={styles.mobileApprovalCard}>
                      <View style={{ flex: 1, gap: 2 }}>
                        <Text style={styles.approvalName}>{reqName}</Text>
                        <Text style={styles.approvalMeta}>{reqDept} • {reqType}</Text>
                        <Text style={styles.approvalMeta}>{reqDates}</Text>
                        {req.reason ? <Text style={[styles.approvalMeta, { fontStyle: 'italic' }]}>"{req.reason}"</Text> : null}
                      </View>
                      <View style={styles.approvalActions}>
                        <TouchableOpacity
                          style={styles.approveCircleBtn}
                          onPress={() => handleApprove(req.id, reqName)}
                          activeOpacity={0.8}
                        >
                          <Icon name="checkCircle" size={20} color="#FFFFFF" strokeWidth={2} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.rejectCircleBtn}
                          onPress={() => handleReject(req.id, reqName)}
                          activeOpacity={0.8}
                        >
                          <Icon name="xCircle" size={20} color="#FFFFFF" strokeWidth={2} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          )}

          {activeTab === 'reports' && (
            <View style={{ gap: 14 }}>
              <View style={styles.metricsGrid}>
                <MetricCard value="99.4%" badge="SLA" badgeColor="#059669" badgeBg="#ECFDF5" label="Overall Presence" subtitle="30-day verified attendance" iconName="dashboard" iconBg="#0F766E" />
                <MetricCard value="98.2%" badge="+0.8%" badgeColor="#059669" badgeBg="#ECFDF5" label="Punctuality" subtitle="On-time shift arrival" iconName="activity" iconBg="#2563EB" />
              </View>
              <View style={styles.mobileSectionCard}>
                <View style={styles.mobileSectionHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.mobileSectionTitle}>Attendance Trend (30 Days)</Text>
                    <Text style={styles.mobileSectionSub}>Historical presence trends</Text>
                  </View>
                  <View style={styles.slaTag}>
                    <Text style={styles.slaTagText}>99.4% SLA</Text>
                  </View>
                </View>
                <SimpleCharts type="bar" height={200} />
              </View>
              <View style={styles.mobileSectionCard}>
                <Text style={styles.mobileSectionTitle}>Department Attendance Health</Text>
                {[
                  { name: 'Engineering', rate: '99%', count: '42 / 42 present', color: '#00B386' },
                  { name: 'Product & Design', rate: '96%', count: '17 / 18 present', color: '#0284C7' },
                  { name: 'Operations & Fitness', rate: '97%', count: '27 / 28 present', color: '#7C3AED' },
                  { name: 'People & Admin', rate: '100%', count: '12 / 12 present', color: '#EA580C' }
                ].map((dept, i) => (
                  <View key={i} style={styles.mobileApprovalCard}>
                    <View style={{ flex: 1, gap: 2 }}>
                      <Text style={styles.approvalName}>{dept.name}</Text>
                      <Text style={styles.approvalMeta}>{dept.count}</Text>
                    </View>
                    <View style={[styles.mobileFilterTab, { backgroundColor: '#ECFDF5' }]}>
                      <Text style={[styles.mobileFilterTabText, { color: '#059669' }]}>{dept.rate}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {activeTab === 'audit' && (
            <View style={styles.mobileSectionCard}>
              <Text style={styles.mobileSectionTitle}>System Audit Log</Text>
              <Text style={[styles.mobileSectionSub, { marginBottom: 10 }]}>Every authenticated interaction is permanently logged.</Text>
              {(storeState.auditLogs || []).map((l) => (
                <View key={l.id} style={styles.mobileAuditRow}>
                  <Text style={styles.auditTime}>{l.time}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.auditAction}>{l.text || l.action}</Text>
                    <Text style={styles.auditActor}>{(l.type || 'SYSTEM').toUpperCase()} • Immutable Trail</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* ══ MOBILE ADMIN PROFILE SECTION ══ */}
          {activeTab === 'profile' && (
            <View style={styles.profileSectionWrapper}>
              {/* 1. Admin Hero Card */}
              <View style={styles.profileHeroCard}>
                <View style={styles.profileHeroTop}>
                  <View style={[styles.profileAvatarLarge, { backgroundColor: '#EA580C' }]}>
                    <Text style={styles.profileAvatarLargeText}>
                      {(adminProfile.displayName || 'E').charAt(0).toUpperCase()}
                    </Text>
                    <View style={styles.profileOnlineDot} />
                  </View>
                  <View style={styles.profileHeroInfo}>
                    <View style={styles.profileNameRow}>
                      <Text style={styles.profileNameText}>{adminProfile.displayName}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginTop: 2 }}>
                      <View style={[styles.domainBadge, { backgroundColor: '#FFF7ED', borderColor: '#FFEDD5' }]}>
                        <Text style={[styles.domainBadgeText, { color: '#EA580C' }]}>Administrator</Text>
                      </View>
                      <View style={styles.domainBadge}>
                        <Text style={styles.domainBadgeText}>@hbplus.fit</Text>
                      </View>
                    </View>
                    <Text style={styles.profileRoleTitle}>{adminProfile.designation} • {adminProfile.department}</Text>
                    <Text style={styles.profileEmployeeId}>ID: {adminProfile.employeeId} • {adminProfile.clearanceLevel}</Text>
                  </View>
                </View>

                <View style={styles.profileActionRow}>
                  <TouchableOpacity
                    style={[styles.editProfileToggleBtn, isEditingAdminProfile && styles.editProfileToggleBtnActive]}
                    onPress={() => {
                      setAdminName(adminProfile.displayName);
                      setAdminPhone(adminProfile.phone);
                      setAdminDept(adminProfile.department);
                      setAdminDesignation(adminProfile.designation);
                      setAdminBio(adminProfile.bio);
                      setAdminEmergency(adminProfile.emergencyContact);
                      setAdminClearance(adminProfile.clearanceLevel || 'Level 4 (Full Governance Authority)');
                      setIsEditingAdminProfile(!isEditingAdminProfile);
                    }}
                    activeOpacity={0.8}
                  >
                    <Icon name={isEditingAdminProfile ? 'x' : 'user'} size={15} color={isEditingAdminProfile ? '#FFFFFF' : '#EA580C'} />
                    <Text style={[styles.editProfileToggleBtnText, isEditingAdminProfile && { color: '#FFFFFF' }]}>
                      {isEditingAdminProfile ? 'Cancel Editing' : 'Edit Admin Profile'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.resetPassBtn}
                    onPress={() => showToast('Password reset dispatched to administrator email.')}
                    activeOpacity={0.8}
                  >
                    <Icon name="lock" size={14} color="#475569" />
                    <Text style={styles.resetPassBtnText}>Reset Password</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* 2. Mobile In-place Edit Form */}
              {isEditingAdminProfile ? (
                <View style={styles.editProfileCard}>
                  <Text style={styles.cardTitle}>Edit Administrator Credentials</Text>
                  <Text style={styles.tasksDueSub}>Updates reflect across audit trails and workforce records.</Text>

                  <View style={styles.editFormGrid}>
                    <View style={styles.formFieldBlock}>
                      <Text style={styles.formFieldLabel}>Administrator Name</Text>
                      <TextInput
                        style={styles.formTextInput}
                        value={adminName}
                        onChangeText={setAdminName}
                        placeholder="Admin Full Name"
                      />
                    </View>

                    <View style={styles.formFieldBlock}>
                      <Text style={styles.formFieldLabel}>Direct Phone</Text>
                      <TextInput
                        style={styles.formTextInput}
                        value={adminPhone}
                        onChangeText={setAdminPhone}
                        placeholder="+91 99887 76655"
                      />
                    </View>

                    <View style={styles.formFieldBlock}>
                      <Text style={styles.formFieldLabel}>Department</Text>
                      <TextInput
                        style={styles.formTextInput}
                        value={adminDept}
                        onChangeText={setAdminDept}
                        placeholder="Platform Governance & Security"
                      />
                    </View>

                    <View style={styles.formFieldBlock}>
                      <Text style={styles.formFieldLabel}>Designation / Role</Text>
                      <TextInput
                        style={styles.formTextInput}
                        value={adminDesignation}
                        onChangeText={setAdminDesignation}
                        placeholder="Principal Security Administrator"
                      />
                    </View>

                    <View style={styles.formFieldBlock}>
                      <Text style={styles.formFieldLabel}>Clearance Level</Text>
                      <TextInput
                        style={styles.formTextInput}
                        value={adminClearance}
                        onChangeText={setAdminClearance}
                        placeholder="Level 4 (Full Authority)"
                      />
                    </View>

                    <View style={styles.formFieldBlock}>
                      <Text style={styles.formFieldLabel}>Emergency Incident Contact</Text>
                      <TextInput
                        style={styles.formTextInput}
                        value={adminEmergency}
                        onChangeText={setAdminEmergency}
                        placeholder="CSO Direct Line"
                      />
                    </View>

                    <View style={styles.formFieldBlock}>
                      <Text style={styles.formFieldLabel}>Governance Bio</Text>
                      <TextInput
                        style={[styles.formTextInput, { height: 72, textAlignVertical: 'top' }]}
                        value={adminBio}
                        onChangeText={setAdminBio}
                        placeholder="Executive bio and scope of authority"
                        multiline
                      />
                    </View>
                  </View>

                  <View style={styles.editFormActions}>
                    <TouchableOpacity
                      style={[styles.saveProfileBtn, { backgroundColor: '#EA580C' }]}
                      onPress={handleSaveAdminProfile}
                      activeOpacity={0.88}
                    >
                      <Icon name="check" size={16} color="#FFFFFF" strokeWidth={2.4} />
                      <Text style={styles.saveProfileBtnText}>Save Changes</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.cancelProfileBtn}
                      onPress={() => setIsEditingAdminProfile(false)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.cancelProfileBtnText}>Discard</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : null}

              {/* 3. Detail Cards */}
              <View style={styles.profileDetailsGrid}>
                <View style={styles.profileInfoCard}>
                  <View style={styles.infoCardHeader}>
                    <Icon name="directory" size={18} color="#EA580C" />
                    <Text style={styles.infoCardTitle}>Executive Identity</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Official Email</Text>
                    <Text style={styles.infoValue}>{user?.email || adminProfile.email}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Direct Phone</Text>
                    <Text style={styles.infoValue}>{adminProfile.phone}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Department</Text>
                    <Text style={styles.infoValue}>{adminProfile.department}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Location</Text>
                    <Text style={styles.infoValue}>{adminProfile.location}</Text>
                  </View>
                </View>

                <View style={styles.profileInfoCard}>
                  <View style={styles.infoCardHeader}>
                    <Icon name="shieldCheck" size={18} color="#EA580C" />
                    <Text style={styles.infoCardTitle}>Security Credentials</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Domain Policy</Text>
                    <Text style={[styles.infoValue, { color: '#059669', fontWeight: '700' }]}>STRICT (@hbplus.fit)</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Auth Standard</Text>
                    <Text style={styles.infoValue}>Hardware FIDO2 Enforced</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Compliance</Text>
                    <Text style={[styles.infoValue, { color: '#0F766E', fontWeight: '700' }]}>SOC2 Type II</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Emergency Line</Text>
                    <Text style={styles.infoValue}>{adminProfile.emergencyContact}</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {activeTab === 'settings' && (
            <View style={{ gap: 14 }}>
              <View style={styles.mobileSectionCard}>
                <View style={styles.mobileSectionHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.mobileSectionTitle}>Domain Governance & Tenant Security</Text>
                    <Text style={styles.mobileSectionSub}>Strict authentication restrictions</Text>
                  </View>
                  <View style={styles.slaTag}>
                    <Text style={styles.slaTagText}>Active</Text>
                  </View>
                </View>
                <View style={{ gap: 12, marginTop: 8 }}>
                  <View style={styles.settingRow}>
                    <View style={{ gap: 2 }}>
                      <Text style={styles.settingLabel}>Domain Enforcement Rule</Text>
                      <Text style={styles.approvalMeta}>Restricts sign-ins strictly to corporate addresses</Text>
                    </View>
                    <View style={[styles.mobileAdminBadge, { backgroundColor: '#EA580C', borderColor: '#EA580C' }]}>
                      <Text style={[styles.mobileAdminBadgeText, { color: '#FFFFFF' }]}>STRICT</Text>
                    </View>
                  </View>
                  <View style={styles.settingRow}>
                    <View style={{ gap: 2 }}>
                      <Text style={styles.settingLabel}>SSL / TLS Certificate</Text>
                      <Text style={styles.approvalMeta}>End-to-end encrypted transport layer</Text>
                    </View>
                    <View style={[styles.mobileFilterTab, { backgroundColor: '#ECFDF5' }]}>
                      <Text style={[styles.mobileFilterTabText, { color: '#059669' }]}>TLS 1.3</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.mobileSectionCard}>
                <Text style={styles.mobileSectionTitle}>Session & Access Policies</Text>
                <Text style={[styles.mobileSectionSub, { marginBottom: 8 }]}>Idle timeout windows and token lifecycle governance</Text>
                <View style={{ gap: 12 }}>
                  {[
                    { label: 'Idle Session Timeout (Admin)', val: '30 Minutes' },
                    { label: 'Idle Session Timeout (User)', val: '8 Hours' },
                    { label: 'Geofence Radius (HQ Campus)', val: '500 meters' },
                    { label: 'Immutable Audit Trail', val: 'Enabled (90 Days)' }
                  ].map((s, i) => (
                    <View key={i} style={styles.settingRow}>
                      <Text style={styles.settingLabel}>{s.label}</Text>
                      <Text style={styles.settingVal}>{s.val}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* ── Bottom Navigation Bar ── */}
        <View style={styles.mobileBottomBar}>
          {[
            { id: 'overview', label: 'Dashboard', icon: 'dashboard' },
            { id: 'users', label: 'Users', icon: 'directory' },
            { id: 'approvals', label: 'Approvals', icon: 'checkSquare', badge: pendingApprovals.length },
            { id: 'profile', label: 'Profile', icon: 'user' },
            { id: 'settings', label: 'More', icon: 'settings' }
          ].map((item) => {
            const isActive = activeTab === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.mobileBottomTab}
                onPress={() => setActiveTab(item.id)}
                activeOpacity={0.7}
              >
                <View style={{ position: 'relative' }}>
                  <Icon
                    name={item.icon}
                    size={22}
                    color={isActive ? '#F97316' : '#94A3B8'}
                    strokeWidth={isActive ? 2.4 : 1.8}
                  />
                  {item.badge ? (
                    <View style={styles.phoneBadgeDot}>
                      <Text style={styles.phoneBadgeText}>{item.badge}</Text>
                    </View>
                  ) : null}
                </View>
                <Text style={[styles.mobileBottomLabel, isActive && styles.mobileBottomLabelActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }

  // ── DESKTOP / TABLET LAYOUT ──────────────────────────────────────────────
  return (
    <View style={styles.root}>
      {/* Identity strip */}
      <View style={[styles.identityStrip, { backgroundColor: theme.identityStrip || '#C2410C' }]} />

      <View style={styles.mainContainer}>
        {/* Sidebar */}
        <View
          style={[
            styles.sidebar,
            {
              width: isSidebarCollapsed ? 72 : 264,
              backgroundColor: theme.sidebarBg || '#FFFFFF'
            }
          ]}
        >
          {/* Sidebar Header */}
          <View style={styles.sidebarHeader}>
            <HBLogo size={isSidebarCollapsed ? 32 : 36} />
            {!isSidebarCollapsed ? (
              <View style={styles.brandTitleCol}>
                <Text style={styles.sidebarBrandTitle}>HBPlus</Text>
                <View style={styles.sidebarRoleBadge}>
                  <Icon name="shieldCheck" size={11} color="#EA580C" />
                  <Text style={styles.sidebarRoleBadgeText}>Admin Control</Text>
                </View>
              </View>
            ) : null}
          </View>

          {/* Nav Items */}
          <ScrollView style={styles.sidebarNavScroll} showsVerticalScrollIndicator={false}>
            {navSections.map((section, sIdx) => (
              <View key={sIdx} style={styles.sidebarSectionBlock}>
                {!isSidebarCollapsed ? (
                  <Text style={styles.sidebarSectionHeading}>{section.title}</Text>
                ) : (
                  <View style={styles.sidebarDividerMini} />
                )}

                {section.items.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.sidebarNavItem,
                        isActive && styles.sidebarNavItemActive
                      ]}
                      onPress={() => setActiveTab(item.id)}
                      activeOpacity={0.8}
                    >
                      <Icon
                        name={item.icon}
                        size={18}
                        color={isActive ? '#FFFFFF' : '#64748B'}
                        strokeWidth={isActive ? 2.4 : 1.8}
                      />
                      {!isSidebarCollapsed ? (
                        <Text
                          style={[
                            styles.sidebarNavLabel,
                            isActive && styles.sidebarNavLabelActive
                          ]}
                          numberOfLines={1}
                        >
                          {item.label}
                        </Text>
                      ) : null}

                      {!isSidebarCollapsed && item.badge ? (
                        <View style={[styles.navBadge, isActive && styles.navBadgeActive]}>
                          <Text style={[styles.navBadgeText, isActive && styles.navBadgeTextActive]}>{item.badge}</Text>
                        </View>
                      ) : null}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </ScrollView>

          {/* Sidebar Footer */}
          <View style={styles.sidebarFooter}>
            <TouchableOpacity
              style={styles.collapseBtn}
              onPress={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              activeOpacity={0.7}
            >
              <Icon
                name={isSidebarCollapsed ? 'chevronRight' : 'chevronLeft'}
                size={16}
                color="#64748B"
              />
              {!isSidebarCollapsed ? (
                <Text style={styles.collapseBtnText}>Collapse Rail</Text>
              ) : null}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.signOutBtn}
              onPress={onSignOut}
              activeOpacity={0.7}
            >
              <Icon name="logout" size={16} color="#EF4444" />
              {!isSidebarCollapsed ? (
                <Text style={styles.signOutBtnText}>Sign Out</Text>
              ) : null}
            </TouchableOpacity>
          </View>
        </View>

        {/* Content Area */}
        <View style={[styles.contentColumn, { backgroundColor: '#FFF7ED' }]}>
          {/* Top Bar */}
          <View style={styles.topBar}>
            <View style={styles.searchBox}>
              <Icon name="search" size={16} color="#64748B" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search people, audit logs, commands..."
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <View style={styles.shortcutPill}>
                <Text style={styles.shortcutText}>⌘K</Text>
              </View>
            </View>

            <View style={styles.topBarRight}>
              <View style={styles.statusDotRow}>
                <View style={styles.pulsingDot} />
                <Text style={styles.statusDotText}>Systems Operational</Text>
              </View>

              <TouchableOpacity style={styles.iconCircleBtn} activeOpacity={0.7}>
                <Icon name="bell" size={18} color="#0F172A" />
                <View style={styles.unreadBadgeDot} />
              </TouchableOpacity>

              <View style={styles.adminRolePill}>
                <Icon name="shieldCheck" size={14} color="#EA580C" strokeWidth={2.4} />
                <Text style={styles.adminRolePillText}>Admin</Text>
              </View>
            </View>
          </View>

          {/* Toast */}
          {toastMessage ? (
            <View style={styles.toastCard}>
              <Icon name="checkCircle" size={16} color="#00B386" />
              <Text style={styles.toastText}>{toastMessage}</Text>
            </View>
          ) : null}

          {/* Main Scrollable */}
          <ScrollView
            style={styles.scrollContent}
            contentContainerStyle={styles.scrollContentInner}
            showsVerticalScrollIndicator={false}
          >
            {activeTab === 'overview' && (
              <>
                {/* Desktop Broadcast Banner */}
                <SquaredCard style={[styles.kpiCard, { marginBottom: 16, backgroundColor: '#FFF7ED', borderColor: '#FFEDD5', borderWidth: 1, padding: 18 }]}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                      <View style={[styles.kpiDeltaBadge, { backgroundColor: '#FFEDD5', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 12 }]}>
                        <Icon name="bell" size={20} color="#EA580C" />
                      </View>
                      <View>
                        <Text style={{ fontSize: 16, fontWeight: '800', color: '#9A3412' }}>Real-Time Workforce Broadcast</Text>
                        <Text style={{ fontSize: 13, color: '#C2410C', marginTop: 2 }}>
                          Instant company-wide alerts push to all authenticated web and mobile user sessions.
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={[styles.approveBtn, { backgroundColor: '#EA580C', paddingHorizontal: 18, height: 42, borderRadius: 10 }]}
                      onPress={() => setBroadcastModalOpen(true)}
                      activeOpacity={0.85}
                    >
                      <Icon name="bell" size={15} color="#FFFFFF" />
                      <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '700', marginLeft: 6 }}>+ New Broadcast</Text>
                    </TouchableOpacity>
                  </View>
                </SquaredCard>

                {/* 4 KPI Cards */}
                <View style={styles.kpiRow}>
                  <SquaredCard style={styles.kpiCard}>
                    <Text style={styles.kpiOverline}>TOTAL WORKFORCE</Text>
                    <View style={styles.kpiValRow}>
                      <Text style={styles.kpiNumber}>{storeState.totalWorkforce || 248}</Text>
                      <View style={[styles.kpiDeltaBadge, { backgroundColor: '#ECFDF5' }]}>
                        <Text style={[styles.kpiDeltaText, { color: '#059669' }]}>+12%</Text>
                      </View>
                    </View>
                    <Text style={styles.kpiSub}>Active accounts across 6 depts</Text>
                  </SquaredCard>

                  <SquaredCard style={styles.kpiCard}>
                    <Text style={styles.kpiOverline}>PRESENT TODAY</Text>
                    <View style={styles.kpiValRow}>
                      <Text style={styles.kpiNumber}>{storeState.presentCount || 231}</Text>
                      <View style={[styles.kpiDeltaBadge, { backgroundColor: '#ECFDF5' }]}>
                        <Text style={[styles.kpiDeltaText, { color: '#059669' }]}>
                          {Math.round(((storeState.presentCount || 231) / (storeState.totalWorkforce || 248)) * 100)}%
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.kpiSub}>1-tap geofence verified</Text>
                  </SquaredCard>

                  <SquaredCard style={styles.kpiCard}>
                    <Text style={styles.kpiOverline}>ON LEAVE</Text>
                    <View style={styles.kpiValRow}>
                      <Text style={styles.kpiNumber}>12</Text>
                      <View style={[styles.kpiDeltaBadge, { backgroundColor: '#EFF6FF' }]}>
                        <Text style={[styles.kpiDeltaText, { color: '#2563EB' }]}>4.8%</Text>
                      </View>
                    </View>
                    <Text style={styles.kpiSub}>8 planned, 4 medical</Text>
                  </SquaredCard>

                  <SquaredCard style={styles.kpiCard}>
                    <Text style={styles.kpiOverline}>PENDING APPROVALS</Text>
                    <View style={styles.kpiValRow}>
                      <Text style={styles.kpiNumber}>{pendingApprovals.length}</Text>
                      <View style={[styles.kpiDeltaBadge, { backgroundColor: pendingApprovals.length > 0 ? '#FEF3C7' : '#ECFDF5' }]}>
                        <Text style={[styles.kpiDeltaText, { color: pendingApprovals.length > 0 ? '#D97706' : '#059669' }]}>
                          {pendingApprovals.length > 0 ? 'Action' : 'Clear'}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.kpiSub}>Queue requires admin review</Text>
                  </SquaredCard>
                </View>

                {/* Charts Row */}
                <View style={styles.chartsGrid}>
                  <SquaredCard style={styles.chartCardLarge}>
                    <View style={styles.cardHeader}>
                      <View>
                        <Text style={styles.cardTitle}>Attendance Trend (30 Days)</Text>
                        <Text style={styles.cardSub}>Workforce presence vs scheduled shifts</Text>
                      </View>
                      <View style={styles.chartTagPill}>
                        <Text style={styles.chartTagText}>99.4% SLA</Text>
                      </View>
                    </View>
                    <SimpleCharts type="area" height={190} />
                  </SquaredCard>

                  <SquaredCard style={styles.chartCardSmall}>
                    <View style={styles.cardHeader}>
                      <View>
                        <Text style={styles.cardTitle}>Department Breakdown</Text>
                        <Text style={styles.cardSub}>Distribution of 248 staff</Text>
                      </View>
                    </View>
                    <SimpleCharts type="donut" height={190} />
                  </SquaredCard>
                </View>

                {/* Users Table */}
                <SquaredCard style={styles.tableCard}>
                  <View style={styles.tableHeaderRow}>
                    <View>
                      <Text style={styles.cardTitle}>Workforce Governance</Text>
                      <Text style={styles.cardSub}>Manage accounts, permission claims and access state</Text>
                    </View>
                    <View style={styles.filterPillsRow}>
                      {['all', 'admin', 'user'].map((f) => (
                        <TouchableOpacity
                          key={f}
                          style={[styles.filterPill, selectedUserFilter === f && styles.filterPillActive]}
                          onPress={() => setSelectedUserFilter(f)}
                          activeOpacity={0.7}
                        >
                          <Text style={[styles.filterPillText, selectedUserFilter === f && styles.filterPillTextActive]}>
                            {f.toUpperCase()}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.tableBody}>
                      <View style={styles.tableHeadRow}>
                        <Text style={[styles.tableTh, { width: 180 }]}>EMPLOYEE</Text>
                        <Text style={[styles.tableTh, { width: 140 }]}>DEPARTMENT</Text>
                        <Text style={[styles.tableTh, { width: 90 }]}>ROLE</Text>
                        <Text style={[styles.tableTh, { width: 90 }]}>STATUS</Text>
                        <Text style={[styles.tableTh, { width: 80, textAlign: 'right' }]}>ACTION</Text>
                      </View>

                      {filteredUsers.map((item) => (
                        <View key={item.id} style={styles.tableTr}>
                          <View style={[styles.tableTd, { width: 180 }]}>
                            <Text style={styles.userName}>{item.name}</Text>
                            <Text style={styles.userEmail}>{item.email}</Text>
                          </View>
                          <Text style={[styles.tableTdText, { width: 140 }]}>{item.department || item.dept || 'Engineering'}</Text>
                          <View style={{ width: 90 }}>
                            <View
                              style={[
                                styles.roleBadgeCell,
                                (item.role || '').toLowerCase().includes('admin')
                                  ? { backgroundColor: '#EA580C' }
                                  : { backgroundColor: '#E2E8F0' }
                              ]}
                            >
                              <Text
                                style={[
                                  styles.roleBadgeCellText,
                                  (item.role || '').toLowerCase().includes('admin') ? { color: '#FFFFFF' } : { color: '#334155' }
                                ]}
                              >
                                {item.role}
                              </Text>
                            </View>
                          </View>
                          <View style={{ width: 90 }}>
                            <View
                              style={[
                                styles.statusBadgeCell,
                                item.status === 'Active'
                                  ? { backgroundColor: '#ECFDF5' }
                                  : { backgroundColor: '#EFF6FF' }
                              ]}
                            >
                              <Text
                                style={[
                                  styles.statusBadgeCellText,
                                  item.status === 'Active' ? { color: '#059669' } : { color: '#2563EB' }
                                ]}
                              >
                                {item.status}
                              </Text>
                            </View>
                          </View>
                          <View style={{ width: 80, flexDirection: 'row', justifyContent: 'flex-end', gap: 6 }}>
                            <TouchableOpacity
                              style={styles.rowActionBtn}
                              onPress={() => showToast(`Password reset link dispatched for ${item.name}`)}
                              activeOpacity={0.7}
                              accessibilityLabel="Reset"
                            >
                              <Icon name="refresh" size={13} color="#64748B" />
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.rowActionBtn}
                              onPress={() => showToast(`Updated role permissions for ${item.name}`)}
                              activeOpacity={0.7}
                              accessibilityLabel="Edit Role"
                            >
                              <Icon name="shieldCheck" size={13} color="#EA580C" />
                            </TouchableOpacity>
                          </View>
                        </View>
                      ))}
                    </View>
                  </ScrollView>
                </SquaredCard>

                {/* Bottom Grid: Approvals + Audit */}
                <View style={styles.bottomGrid}>
                  <SquaredCard style={styles.approvalsCard}>
                    <View style={styles.cardHeader}>
                      <View>
                        <Text style={styles.cardTitle}>Pending Approvals Queue</Text>
                        <Text style={styles.cardSub}>Real-time requests awaiting supervisor sign-off</Text>
                      </View>
                      <View style={[styles.kpiDeltaBadge, { backgroundColor: pendingApprovals.length > 0 ? '#FEF3C7' : '#ECFDF5' }]}>
                        <Text style={[styles.kpiDeltaText, { color: pendingApprovals.length > 0 ? '#D97706' : '#059669' }]}>
                          {pendingApprovals.length} Pending
                        </Text>
                      </View>
                    </View>

                    {pendingApprovals.length === 0 ? (
                      <View style={styles.emptyState}>
                        <Icon name="checkCircle" size={28} color="#059669" />
                        <Text style={styles.emptyStateText}>All pending approvals cleared!</Text>
                      </View>
                    ) : (
                      pendingApprovals.map((req) => {
                        const reqName = req.employeeName || req.name;
                        const reqDept = req.department || req.dept || 'Engineering';
                        const reqType = req.leaveType || req.type;
                        const reqDates = req.dates || `${req.startDate} to ${req.endDate} (${req.days} days)`;
                        return (
                          <View key={req.id} style={styles.approvalItem}>
                            <View style={styles.approvalInfo}>
                              <Text style={styles.approvalName}>{reqName}</Text>
                              <Text style={styles.approvalMeta}>{reqDept} • {reqType} • {reqDates}</Text>
                              {req.reason ? <Text style={[styles.approvalMeta, { fontStyle: 'italic', marginTop: 2 }]}>"{req.reason}"</Text> : null}
                            </View>
                            <View style={styles.approvalActions}>
                              <TouchableOpacity
                                style={styles.approveBtn}
                                onPress={() => handleApprove(req.id, reqName)}
                                activeOpacity={0.8}
                              >
                                <Icon name="check" size={14} color="#FFFFFF" strokeWidth={2.6} />
                                <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '700', marginLeft: 4 }}>Approve</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={styles.rejectBtn}
                                onPress={() => handleReject(req.id, reqName)}
                                activeOpacity={0.8}
                              >
                                <Icon name="x" size={14} color="#DC2626" strokeWidth={2.6} />
                                <Text style={{ color: '#DC2626', fontSize: 12, fontWeight: '700', marginLeft: 4 }}>Reject</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        );
                      })
                    )}
                  </SquaredCard>

                  <SquaredCard style={styles.auditCard}>
                    <View style={styles.cardHeader}>
                      <View>
                        <Text style={styles.cardTitle}>Live Audit Log Feed</Text>
                        <Text style={styles.cardSub}>Immutable compliance telemetry</Text>
                      </View>
                    </View>

                    <View style={styles.auditList}>
                      {(storeState.auditLogs || []).slice(0, 5).map((log) => (
                        <View key={log.id} style={styles.auditRow}>
                          <Text style={styles.auditTime}>{log.time}</Text>
                          <View style={styles.auditDetails}>
                            <Text style={styles.auditAction}>{log.text || log.action}</Text>
                            <Text style={styles.auditActor}>{(log.type || 'SYSTEM').toUpperCase()} • Verified</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  </SquaredCard>
                </View>
              </>
            )}

            {activeTab === 'users' && (
              <SquaredCard style={styles.tableCard}>
                <View style={styles.tableHeaderRow}>
                  <View>
                    <Text style={styles.cardTitle}>Workforce Directory & Role Provisioning</Text>
                    <Text style={styles.cardSub}>Full employee roster with direct privilege elevation tools.</Text>
                  </View>
                  <View style={styles.filterPillsRow}>
                    {['all', 'admin', 'user'].map((f) => (
                      <TouchableOpacity
                        key={f}
                        style={[styles.filterPill, selectedUserFilter === f && styles.filterPillActive]}
                        onPress={() => setSelectedUserFilter(f)}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.filterPillText, selectedUserFilter === f && styles.filterPillTextActive]}>
                          {f.toUpperCase()}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                <View style={{ marginTop: 16 }}>
                  {filteredUsers.map((u) => (
                    <View key={u.id} style={styles.tableTr}>
                      <View style={{ flex: 2 }}>
                        <Text style={styles.userName}>{u.name}</Text>
                        <Text style={styles.userEmail}>{u.email}</Text>
                      </View>
                      <Text style={[styles.tableTdText, { flex: 1.5 }]}>{u.department || u.dept || 'Engineering'}</Text>
                      <Text style={[styles.tableTdText, { flex: 1 }]}>{u.role}</Text>
                    </View>
                  ))}
                </View>
              </SquaredCard>
            )}

            {activeTab === 'approvals' && (
              <SquaredCard style={styles.approvalsCard}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.cardTitle}>Pending Approvals Queue</Text>
                    <Text style={styles.cardSub}>Review workforce time-off and shift claims in real time.</Text>
                  </View>
                  <View style={[styles.kpiDeltaBadge, { backgroundColor: pendingApprovals.length > 0 ? '#FEF3C7' : '#ECFDF5' }]}>
                    <Text style={[styles.kpiDeltaText, { color: pendingApprovals.length > 0 ? '#D97706' : '#059669' }]}>
                      {pendingApprovals.length} Pending
                    </Text>
                  </View>
                </View>

                {pendingApprovals.length === 0 ? (
                  <View style={[styles.emptyState, { paddingVertical: 48 }]}>
                    <Icon name="checkCircle" size={36} color="#059669" />
                    <Text style={[styles.emptyStateText, { fontSize: 16, marginTop: 8 }]}>All workforce approvals are cleared!</Text>
                    <Text style={{ color: '#94A3B8', fontSize: 13, marginTop: 4 }}>
                      New leave requests submitted by staff will appear dynamically in this queue.
                    </Text>
                  </View>
                ) : (
                  pendingApprovals.map((req) => {
                    const reqName = req.employeeName || req.name;
                    const reqDept = req.department || req.dept || 'Engineering';
                    const reqType = req.leaveType || req.type;
                    const reqDates = req.dates || `${req.startDate} to ${req.endDate} (${req.days} days)`;
                    return (
                      <View key={req.id} style={[styles.approvalItem, { marginTop: 12 }]}>
                        <View style={styles.approvalInfo}>
                          <Text style={styles.approvalName}>{reqName}</Text>
                          <Text style={styles.approvalMeta}>{reqDept} • {reqType} • {reqDates}</Text>
                          {req.reason ? <Text style={[styles.approvalMeta, { fontStyle: 'italic', marginTop: 2 }]}>"{req.reason}"</Text> : null}
                        </View>
                        <View style={styles.approvalActions}>
                          <TouchableOpacity
                            style={styles.approveBtn}
                            onPress={() => handleApprove(req.id, reqName)}
                            activeOpacity={0.8}
                          >
                            <Icon name="check" size={14} color="#FFFFFF" strokeWidth={2.4} />
                            <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '700', marginLeft: 4 }}>Approve</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.rejectBtn}
                            onPress={() => handleReject(req.id, reqName)}
                            activeOpacity={0.8}
                          >
                            <Icon name="x" size={14} color="#DC2626" strokeWidth={2.4} />
                            <Text style={{ color: '#DC2626', fontSize: 12, fontWeight: '700', marginLeft: 4 }}>Reject</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })
                )}
              </SquaredCard>
            )}

            {activeTab === 'reports' && (
              <View style={{ gap: 16 }}>
                <View style={styles.kpiRow}>
                  <SquaredCard style={styles.kpiCard}>
                    <Text style={styles.kpiOverline}>OVERALL PRESENCE</Text>
                    <View style={styles.kpiValRow}>
                      <Text style={styles.kpiNumber}>99.4%</Text>
                      <View style={[styles.kpiDeltaBadge, { backgroundColor: '#ECFDF5' }]}>
                        <Text style={[styles.kpiDeltaText, { color: '#059669' }]}>SLA</Text>
                      </View>
                    </View>
                    <Text style={styles.kpiSub}>30-day verified attendance</Text>
                  </SquaredCard>
                  <SquaredCard style={styles.kpiCard}>
                    <Text style={styles.kpiOverline}>PUNCTUALITY</Text>
                    <View style={styles.kpiValRow}>
                      <Text style={styles.kpiNumber}>98.2%</Text>
                      <View style={[styles.kpiDeltaBadge, { backgroundColor: '#ECFDF5' }]}>
                        <Text style={[styles.kpiDeltaText, { color: '#059669' }]}>+0.8%</Text>
                      </View>
                    </View>
                    <Text style={styles.kpiSub}>On-time shift arrival</Text>
                  </SquaredCard>
                  <SquaredCard style={styles.kpiCard}>
                    <Text style={styles.kpiOverline}>GEOFENCE ADHERENCE</Text>
                    <View style={styles.kpiValRow}>
                      <Text style={styles.kpiNumber}>100%</Text>
                      <View style={[styles.kpiDeltaBadge, { backgroundColor: '#ECFDF5' }]}>
                        <Text style={[styles.kpiDeltaText, { color: '#059669' }]}>Verified</Text>
                      </View>
                    </View>
                    <Text style={styles.kpiSub}>0 location anomalies</Text>
                  </SquaredCard>
                </View>

                <SquaredCard style={styles.chartCardLarge}>
                  <View style={styles.cardHeader}>
                    <View>
                      <Text style={styles.cardTitle}>Attendance Trend (30 Days)</Text>
                      <Text style={styles.cardSub}>Historical presence trends and overtime metrics.</Text>
                    </View>
                    <View style={styles.chartTagPill}>
                      <Text style={styles.chartTagText}>99.4% SLA</Text>
                    </View>
                  </View>
                  <SimpleCharts type="bar" height={220} />
                </SquaredCard>

                <SquaredCard style={styles.tableCard}>
                  <Text style={styles.cardTitle}>Department Attendance Health</Text>
                  <Text style={styles.cardSub}>Live presence breakdown across active units</Text>
                  <View style={{ marginTop: 14, gap: 10 }}>
                    {[
                      { name: 'Engineering', rate: '99%', count: '42 / 42 present', color: '#00B386' },
                      { name: 'Product & Design', rate: '96%', count: '17 / 18 present', color: '#0284C7' },
                      { name: 'Operations & Fitness', rate: '97%', count: '27 / 28 present', color: '#7C3AED' },
                      { name: 'People & Admin', rate: '100%', count: '12 / 12 present', color: '#EA580C' }
                    ].map((dept, i) => (
                      <View key={i} style={[styles.approvalItem, { paddingVertical: 12 }]}>
                        <View style={{ gap: 2 }}>
                          <Text style={styles.approvalName}>{dept.name}</Text>
                          <Text style={styles.approvalMeta}>{dept.count}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <View style={[styles.kpiDeltaBadge, { backgroundColor: '#ECFDF5' }]}>
                            <Text style={[styles.kpiDeltaText, { color: '#059669' }]}>{dept.rate}</Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                </SquaredCard>
              </View>
            )}

            {activeTab === 'audit' && (
              <SquaredCard style={styles.auditCard}>
                <Text style={styles.cardTitle}>System Audit Log</Text>
                <Text style={styles.cardSub}>Every authenticated interaction is permanently logged.</Text>
                <View style={[styles.auditList, { marginTop: 16 }]}>
                  {(storeState.auditLogs || []).map((l) => (
                    <View key={l.id} style={styles.auditRow}>
                      <Text style={styles.auditTime}>{l.time}</Text>
                      <Text style={styles.auditAction}>{l.text || l.action} ({(l.type || 'SYSTEM').toUpperCase()})</Text>
                    </View>
                  ))}
                </View>
              </SquaredCard>
            )}

            {activeTab === 'settings' && (
              <View style={{ gap: 16 }}>
                <SquaredCard style={styles.tableCard}>
                  <View style={styles.cardHeader}>
                    <View>
                      <Text style={styles.cardTitle}>Domain Governance & Tenant Security</Text>
                      <Text style={styles.cardSub}>Strict authentication restrictions and domain enforcement</Text>
                    </View>
                    <View style={styles.chartTagPill}>
                      <Text style={styles.chartTagText}>Active</Text>
                    </View>
                  </View>
                  <View style={{ marginTop: 14, gap: 12 }}>
                    <View style={styles.settingRow}>
                      <View style={{ gap: 2 }}>
                        <Text style={styles.settingLabel}>Domain Enforcement Rule</Text>
                        <Text style={styles.approvalMeta}>Restricts sign-ins strictly to corporate addresses</Text>
                      </View>
                      <View style={styles.adminRolePill}>
                        <Text style={styles.adminRolePillText}>STRICT (@hbplus.fit)</Text>
                      </View>
                    </View>
                    <View style={styles.settingRow}>
                      <View style={{ gap: 2 }}>
                        <Text style={styles.settingLabel}>SSL / TLS Certificate</Text>
                        <Text style={styles.approvalMeta}>End-to-end encrypted transport layer</Text>
                      </View>
                      <View style={[styles.kpiDeltaBadge, { backgroundColor: '#ECFDF5' }]}>
                        <Text style={[styles.kpiDeltaText, { color: '#059669' }]}>TLS 1.3 Active</Text>
                      </View>
                    </View>
                  </View>
                </SquaredCard>

                <SquaredCard style={styles.tableCard}>
                  <Text style={styles.cardTitle}>Session & Access Policies</Text>
                  <Text style={styles.cardSub}>Idle timeout windows and token lifecycle governance</Text>
                  <View style={{ marginTop: 14, gap: 12 }}>
                    <View style={styles.settingRow}>
                      <Text style={styles.settingLabel}>Idle Session Timeout (Admin)</Text>
                      <Text style={styles.settingVal}>30 Minutes</Text>
                    </View>
                    <View style={styles.settingRow}>
                      <Text style={styles.settingLabel}>Idle Session Timeout (User)</Text>
                      <Text style={styles.settingVal}>8 Hours</Text>
                    </View>
                    <View style={styles.settingRow}>
                      <Text style={styles.settingLabel}>Geofence Radius (HQ Campus)</Text>
                      <Text style={styles.settingVal}>500 meters</Text>
                    </View>
                    <View style={styles.settingRow}>
                      <Text style={styles.settingLabel}>Immutable Audit Trail</Text>
                      <View style={[styles.kpiDeltaBadge, { backgroundColor: '#ECFDF5' }]}>
                        <Text style={[styles.kpiDeltaText, { color: '#059669' }]}>Enabled (90 Days)</Text>
                      </View>
                    </View>
                  </View>
                </SquaredCard>
              </View>
            )}

            {/* ══ DESKTOP ADMIN PROFILE SECTION ══ */}
            {activeTab === 'profile' && (
              <View style={styles.profileSectionWrapper}>
                {/* 1. Admin Hero Card */}
                <SquaredCard style={styles.profileHeroCard}>
                  <View style={styles.profileHeroTop}>
                    <View style={[styles.profileAvatarLarge, { backgroundColor: '#EA580C' }]}>
                      <Text style={styles.profileAvatarLargeText}>
                        {(adminProfile.displayName || 'E').charAt(0).toUpperCase()}
                      </Text>
                      <View style={styles.profileOnlineDot} />
                    </View>

                    <View style={styles.profileHeroInfo}>
                      <View style={styles.profileNameRow}>
                        <Text style={styles.profileNameText}>{adminProfile.displayName}</Text>
                        <View style={[styles.domainBadge, { backgroundColor: '#FFF7ED', borderColor: '#FFEDD5' }]}>
                          <Text style={[styles.domainBadgeText, { color: '#EA580C' }]}>Administrator</Text>
                        </View>
                        <View style={styles.domainBadge}>
                          <Text style={styles.domainBadgeText}>@hbplus.fit</Text>
                        </View>
                      </View>
                      <Text style={styles.profileRoleTitle}>{adminProfile.designation} • {adminProfile.department}</Text>
                      <Text style={styles.profileEmployeeId}>ID: {adminProfile.employeeId} • {adminProfile.clearanceLevel}</Text>
                    </View>
                  </View>

                  <View style={styles.profileActionRow}>
                    <TouchableOpacity
                      style={[styles.editProfileToggleBtn, isEditingAdminProfile && styles.editProfileToggleBtnActive]}
                      onPress={() => {
                        setAdminName(adminProfile.displayName);
                        setAdminPhone(adminProfile.phone);
                        setAdminDept(adminProfile.department);
                        setAdminDesignation(adminProfile.designation);
                        setAdminBio(adminProfile.bio);
                        setAdminEmergency(adminProfile.emergencyContact);
                        setAdminClearance(adminProfile.clearanceLevel || 'Level 4 (Full Governance Authority)');
                        setIsEditingAdminProfile(!isEditingAdminProfile);
                      }}
                      activeOpacity={0.8}
                    >
                      <Icon name={isEditingAdminProfile ? 'x' : 'user'} size={16} color={isEditingAdminProfile ? '#FFFFFF' : '#EA580C'} />
                      <Text style={[styles.editProfileToggleBtnText, isEditingAdminProfile && { color: '#FFFFFF' }]}>
                        {isEditingAdminProfile ? 'Cancel Editing' : 'Edit Admin Profile'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.resetPassBtn}
                      onPress={() => showToast('Password reset link dispatched to administrator email.')}
                      activeOpacity={0.8}
                    >
                      <Icon name="lock" size={15} color="#475569" />
                      <Text style={styles.resetPassBtnText}>Reset Credentials</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.resetPassBtn, { borderColor: '#FDBA74', backgroundColor: '#FFF7ED' }]}
                      onPress={() => setBroadcastModalOpen(true)}
                      activeOpacity={0.8}
                    >
                      <Icon name="bell" size={15} color="#EA580C" />
                      <Text style={[styles.resetPassBtnText, { color: '#EA580C', fontWeight: '700' }]}>+ Broadcast Announcement</Text>
                    </TouchableOpacity>
                  </View>
                </SquaredCard>

                {/* 2. In-place Edit Form */}
                {isEditingAdminProfile ? (
                  <SquaredCard style={styles.editProfileCard}>
                    <Text style={styles.cardTitle}>Edit Administrator Credentials & Profile</Text>
                    <Text style={styles.tasksDueSub}>Updates reflect across governance audits, incident response contacts, and directory.</Text>

                    <View style={styles.editFormGrid}>
                      <View style={styles.formFieldBlock}>
                        <Text style={styles.formFieldLabel}>Full Name</Text>
                        <TextInput
                          style={styles.formTextInput}
                          value={adminName}
                          onChangeText={setAdminName}
                          placeholder="Administrator Full Name"
                        />
                      </View>

                      <View style={styles.formFieldBlock}>
                        <Text style={styles.formFieldLabel}>Direct Contact Phone</Text>
                        <TextInput
                          style={styles.formTextInput}
                          value={adminPhone}
                          onChangeText={setAdminPhone}
                          placeholder="+91 99887 76655"
                        />
                      </View>

                      <View style={styles.formFieldBlock}>
                        <Text style={styles.formFieldLabel}>Administrative Department</Text>
                        <TextInput
                          style={styles.formTextInput}
                          value={adminDept}
                          onChangeText={setAdminDept}
                          placeholder="Platform Governance & Security"
                        />
                      </View>

                      <View style={styles.formFieldBlock}>
                        <Text style={styles.formFieldLabel}>Designation / Role Title</Text>
                        <TextInput
                          style={styles.formTextInput}
                          value={adminDesignation}
                          onChangeText={setAdminDesignation}
                          placeholder="Principal Security Administrator"
                        />
                      </View>

                      <View style={styles.formFieldBlock}>
                        <Text style={styles.formFieldLabel}>Clearance Level</Text>
                        <TextInput
                          style={styles.formTextInput}
                          value={adminClearance}
                          onChangeText={setAdminClearance}
                          placeholder="Level 4 (Full Governance Authority)"
                        />
                      </View>

                      <View style={styles.formFieldBlock}>
                        <Text style={styles.formFieldLabel}>Emergency Incident Direct Line</Text>
                        <TextInput
                          style={styles.formTextInput}
                          value={adminEmergency}
                          onChangeText={setAdminEmergency}
                          placeholder="CSO / Incident Command (+91 98000 11223)"
                        />
                      </View>

                      <View style={styles.formFieldBlock}>
                        <Text style={styles.formFieldLabel}>Executive Bio & Authority Summary</Text>
                        <TextInput
                          style={[styles.formTextInput, { height: 72, textAlignVertical: 'top' }]}
                          value={adminBio}
                          onChangeText={setAdminBio}
                          placeholder="Summary of responsibilities and governance mandate"
                          multiline
                        />
                      </View>
                    </View>

                    <View style={styles.editFormActions}>
                      <TouchableOpacity
                        style={[styles.saveProfileBtn, { backgroundColor: '#EA580C' }]}
                        onPress={handleSaveAdminProfile}
                        activeOpacity={0.88}
                      >
                        <Icon name="check" size={16} color="#FFFFFF" strokeWidth={2.4} />
                        <Text style={styles.saveProfileBtnText}>Save Admin Profile</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.cancelProfileBtn}
                        onPress={() => setIsEditingAdminProfile(false)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.cancelProfileBtnText}>Discard</Text>
                      </TouchableOpacity>
                    </View>
                  </SquaredCard>
                ) : null}

                {/* 3. Detailed Profile Overview Cards */}
                <View style={styles.profileDetailsGrid}>
                  {/* Card 1: Official Workplace Identity */}
                  <SquaredCard style={styles.profileInfoCard}>
                    <View style={styles.infoCardHeader}>
                      <Icon name="directory" size={18} color="#EA580C" />
                      <Text style={styles.infoCardTitle}>Executive Workplace Identity</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Official Email</Text>
                      <Text style={styles.infoValue}>{user?.email || adminProfile.email}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Mobile Number</Text>
                      <Text style={styles.infoValue}>{adminProfile.phone}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Department</Text>
                      <Text style={styles.infoValue}>{adminProfile.department}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Work Location</Text>
                      <Text style={styles.infoValue}>{adminProfile.location}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Security Clearance</Text>
                      <Text style={[styles.infoValue, { color: '#EA580C', fontWeight: '700' }]}>{adminProfile.clearanceLevel}</Text>
                    </View>
                  </SquaredCard>

                  {/* Card 2: Security & Tenant Governance */}
                  <SquaredCard style={styles.profileInfoCard}>
                    <View style={styles.infoCardHeader}>
                      <Icon name="shieldCheck" size={18} color="#EA580C" />
                      <Text style={styles.infoCardTitle}>Security & Tenant Governance</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Domain Enforcement</Text>
                      <Text style={[styles.infoValue, { color: '#059669', fontWeight: '700' }]}>STRICT (@hbplus.fit)</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Multi-Factor Auth</Text>
                      <Text style={styles.infoValue}>Hardware FIDO2 Security Key</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Transport Security</Text>
                      <Text style={styles.infoValue}>TLS 1.3 End-to-End Encrypted</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Compliance Standard</Text>
                      <Text style={[styles.infoValue, { color: '#0F766E', fontWeight: '700' }]}>SOC2 Type II Certified</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Emergency Direct Line</Text>
                      <Text style={styles.infoValue}>{adminProfile.emergencyContact}</Text>
                    </View>
                  </SquaredCard>

                  {/* Card 3: Executive Bio */}
                  <SquaredCard style={[styles.profileInfoCard, { flex: 1, minWidth: '100%' }]}>
                    <View style={styles.infoCardHeader}>
                      <Icon name="user" size={18} color="#EA580C" />
                      <Text style={styles.infoCardTitle}>Executive Mandate & Bio</Text>
                    </View>
                    <Text style={{ fontSize: 14, color: '#334155', lineHeight: 22, marginTop: 4 }}>
                      {adminProfile.bio}
                    </Text>
                  </SquaredCard>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </View>

      {/* Broadcast Modal */}
      <Modal
        visible={broadcastModalOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setBroadcastModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={[styles.kpiDeltaBadge, { backgroundColor: '#FEF3C7', paddingHorizontal: 8, paddingVertical: 4 }]}>
                  <Icon name="bell" size={16} color="#D97706" />
                </View>
                <Text style={styles.modalTitle}>Broadcast Announcement</Text>
              </View>
              <TouchableOpacity onPress={() => setBroadcastModalOpen(false)}>
                <Icon name="x" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Broadcast an operational alert or priority notice across employee portals in real-time.
            </Text>

            <View style={{ gap: 12, marginTop: 12 }}>
              <View style={styles.formFieldBlock}>
                <Text style={styles.formFieldLabel}>Announcement Title *</Text>
                <TextInput
                  style={styles.formTextInput}
                  placeholder="e.g. Q4 All-Hands & Production Deployment"
                  value={broadcastTitle}
                  onChangeText={setBroadcastTitle}
                />
              </View>

              <View style={styles.formFieldBlock}>
                <Text style={styles.formFieldLabel}>Target Audience / Department</Text>
                <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                  {['All Departments', 'Engineering', 'Operations', 'Leadership'].map((d) => (
                    <TouchableOpacity
                      key={d}
                      style={[styles.modalFilterChip, broadcastDept === d && styles.modalFilterChipActive]}
                      onPress={() => setBroadcastDept(d)}
                    >
                      <Text style={[styles.modalFilterChipText, broadcastDept === d && styles.modalFilterChipTextActive]}>
                        {d}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formFieldBlock}>
                <Text style={styles.formFieldLabel}>Priority Level</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {['Normal', 'High', 'Urgent'].map((p) => (
                    <TouchableOpacity
                      key={p}
                      style={[styles.modalFilterChip, broadcastPriority === p && styles.modalFilterChipActive]}
                      onPress={() => setBroadcastPriority(p)}
                    >
                      <Text style={[styles.modalFilterChipText, broadcastPriority === p && styles.modalFilterChipTextActive]}>
                        {p}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formFieldBlock}>
                <Text style={styles.formFieldLabel}>Announcement Content</Text>
                <TextInput
                  style={[styles.formTextInput, { height: 80, textAlignVertical: 'top' }]}
                  placeholder="Enter full details, agenda, and instructions..."
                  value={broadcastContent}
                  onChangeText={setBroadcastContent}
                  multiline
                />
              </View>
            </View>

            <View style={styles.modalActionRow}>
              <TouchableOpacity
                style={styles.modalSubmitBtn}
                onPress={handlePublishBroadcast}
                activeOpacity={0.88}
              >
                <Icon name="check" size={16} color="#FFFFFF" strokeWidth={2.4} />
                <Text style={styles.modalSubmitBtnText}>Publish Broadcast</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setBroadcastModalOpen(false)}
              >
                <Text style={styles.modalCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export function AdminShell({ onSignOut }) {
  return (
    <RoleThemeProvider role="admin">
      <AdminShellContent onSignOut={onSignOut} />
    </RoleThemeProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFF7ED',
    position: 'relative'
  },
  identityStrip: {
    height: 4,
    width: '100%',
    zIndex: 100
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
    height: '100%'
  },

  // ── Desktop Sidebar ────────────────────────────────────────────
  sidebar: {
    height: '100%',
    paddingVertical: 18,
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between'
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    gap: 12,
    marginBottom: 20
  },
  brandTitleCol: {
    gap: 2
  },
  sidebarBrandTitle: {
    color: '#0F172A',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3
  },
  sidebarRoleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FFEDD5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 4
  },
  sidebarRoleBadgeText: {
    color: '#EA580C',
    fontSize: 10,
    fontWeight: '700'
  },
  sidebarNavScroll: {
    flex: 1
  },
  sidebarSectionBlock: {
    paddingHorizontal: 12,
    marginBottom: 16
  },
  sidebarSectionHeading: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    paddingHorizontal: 10,
    marginBottom: 6
  },
  sidebarDividerMini: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 6,
    marginHorizontal: 10
  },
  sidebarNavItem: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: CARD_RADIUS,
    gap: 12
  },
  sidebarNavItemActive: {
    backgroundColor: '#EA580C',
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 3px 10px rgba(234,88,12,0.25)' }
      : { shadowColor: '#EA580C', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.22, shadowRadius: 6 })
  },
  sidebarNavLabel: {
    flex: 1,
    color: '#475569',
    fontSize: 13,
    fontWeight: '600'
  },
  sidebarNavLabelActive: {
    color: '#FFFFFF',
    fontWeight: '700'
  },
  navBadge: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FFEDD5',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8
  },
  navBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderColor: 'transparent'
  },
  navBadgeText: {
    color: '#EA580C',
    fontSize: 11,
    fontWeight: '800'
  },
  navBadgeTextActive: {
    color: '#FFFFFF'
  },
  sidebarFooter: {
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
    gap: 6
  },
  collapseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 38,
    borderRadius: CARD_RADIUS,
    gap: 10
  },
  collapseBtnText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600'
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 38,
    borderRadius: CARD_RADIUS,
    gap: 10
  },
  signOutBtnText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600'
  },

  // ── Desktop Content Area ───────────────────────────────────────
  contentColumn: {
    flex: 1,
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  topBar: {
    minHeight: 58,
    backgroundColor: '#FFFFFF',
    ...(Platform.OS === 'web' ? { backdropFilter: 'blur(10px)' } : {}),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    zIndex: 10,
    width: '100%',
    maxWidth: '100%'
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: CARD_RADIUS,
    paddingHorizontal: 12,
    height: 38,
    width: '45%',
    maxWidth: 420
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    marginLeft: 8,
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {})
  },
  shortcutPill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  shortcutText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B'
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 0
  },
  statusDotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: CARD_RADIUS
  },
  pulsingDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#10B981'
  },
  statusDotText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669'
  },
  iconCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  unreadBadgeDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#EA580C'
  },
  adminRolePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FFEDD5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: CARD_RADIUS
  },
  adminRolePillText: {
    color: '#EA580C',
    fontSize: 12,
    fontWeight: '800'
  },

  // ── Toast ──────────────────────────────────────────────────────
  toastCard: {
    position: 'absolute',
    top: 72,
    right: 24,
    backgroundColor: '#0F172A',
    borderRadius: CARD_RADIUS,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    zIndex: 99
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600'
  },

  // ── Scroll & Content ───────────────────────────────────────────
  scrollContent: {
    flex: 1
  },
  scrollContentInner: {
    padding: 20,
    gap: 18,
    paddingBottom: 90
  },

  // ── KPI Cards ──────────────────────────────────────────────────
  kpiRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  kpiCard: {
    flex: 1,
    minWidth: 140,
    padding: 16,
    gap: 4
  },
  kpiOverline: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
    textTransform: 'uppercase'
  },
  kpiValRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8
  },
  kpiNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    fontVariant: ['tabular-nums']
  },
  kpiDeltaBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6
  },
  kpiDeltaText: {
    fontSize: 11,
    fontWeight: '700'
  },
  kpiSub: {
    fontSize: 12,
    color: '#64748B'
  },

  // ── Charts ─────────────────────────────────────────────────────
  chartsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14
  },
  chartCardLarge: {
    flex: 2,
    minWidth: 280,
    width: '100%',
    padding: 18,
    gap: 14
  },
  chartCardSmall: {
    flex: 1,
    minWidth: 280,
    width: '100%',
    padding: 18,
    gap: 14
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A'
  },
  cardSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2
  },
  chartTagPill: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  chartTagText: {
    color: '#059669',
    fontSize: 11,
    fontWeight: '700'
  },

  // ── Table / Users ──────────────────────────────────────────────
  tableCard: {
    padding: 20,
    gap: 14
  },
  tableHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10
  },
  filterPillsRow: {
    flexDirection: 'row',
    gap: 6
  },
  filterPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: CARD_RADIUS,
    backgroundColor: '#F1F5F9'
  },
  filterPillActive: {
    backgroundColor: '#EA580C'
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B'
  },
  filterPillTextActive: {
    color: '#FFFFFF'
  },
  tableBody: {
    width: '100%',
    marginTop: 4
  },
  tableHeadRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0'
  },
  tableTh: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.4,
    textTransform: 'uppercase'
  },
  tableTr: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  tableTd: {
    justifyContent: 'center'
  },
  userName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A'
  },
  userEmail: {
    fontSize: 11,
    color: '#64748B'
  },
  tableTdText: {
    fontSize: 13,
    color: '#334155'
  },
  roleBadgeCell: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  roleBadgeCellText: {
    fontSize: 11,
    fontWeight: '700'
  },
  statusBadgeCell: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  statusBadgeCellText: {
    fontSize: 11,
    fontWeight: '700'
  },
  rowActionBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center'
  },

  // ── Approvals + Audit Grid ─────────────────────────────────────
  bottomGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14
  },
  approvalsCard: {
    flex: 1,
    minWidth: 280,
    width: '100%',
    padding: 18,
    gap: 12
  },
  approvalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: CARD_RADIUS
  },
  approvalInfo: {
    gap: 2
  },
  approvalName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A'
  },
  approvalMeta: {
    fontSize: 12,
    color: '#64748B'
  },
  approvalActions: {
    flexDirection: 'row',
    gap: 8
  },
  approveBtn: {
    width: 32,
    height: 32,
    borderRadius: CARD_RADIUS,
    backgroundColor: '#EA580C',
    alignItems: 'center',
    justifyContent: 'center'
  },
  rejectBtn: {
    width: 32,
    height: 32,
    borderRadius: CARD_RADIUS,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 8
  },
  emptyStateText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#EA580C'
  },
  auditCard: {
    flex: 1,
    minWidth: 280,
    width: '100%',
    padding: 18,
    gap: 12
  },
  auditList: {
    gap: 10
  },
  auditRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC'
  },
  auditTime: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
    minWidth: 60
  },
  auditDetails: {
    flex: 1,
    gap: 2
  },
  auditAction: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A'
  },
  auditActor: {
    fontSize: 11,
    color: '#94A3B8'
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  settingLabel: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '500'
  },
  settingVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A'
  },

  // ── Mobile Top Bar ─────────────────────────────────────────────
  mobileTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 54,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    minHeight: 90,
    zIndex: 20,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }
      : { shadowColor: '#0F172A', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 3 })
  },
  mobileTopLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  mobileAdminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8
  },
  mobileAdminBadgeText: {
    color: '#EA580C',
    fontSize: 11,
    fontWeight: '700'
  },
  mobileStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#10B981'
  },
  mobileStatusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669'
  },
  mobileTopRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  mobileIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  bellBadge: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#EA580C'
  },

  // ── Mobile Scroll ──────────────────────────────────────────────
  mobileScroll: {
    flex: 1
  },
  mobileScrollInner: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 140,
    gap: 12
  },

  // ── Mobile Search Bar ──────────────────────────────────────────
  mobileSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
    marginBottom: 2
  },
  mobileSearchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {})
  },

  // ── Mobile Metric Grid ─────────────────────────────────────────
  metricsGrid: {
    flexDirection: 'row',
    gap: 10
  },

  // ── Mobile Section Cards ───────────────────────────────────────
  mobileSectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 2px 4px rgba(0,0,0,0.04), 0 8px 16px rgba(0,0,0,0.06)' }
      : { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.07, shadowRadius: 12, elevation: 3 })
  },
  mobileSectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  mobileSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A'
  },
  mobileSectionSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2
  },
  slaTag: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  slaTagText: {
    color: '#059669',
    fontSize: 11,
    fontWeight: '700'
  },

  // ── Mobile Filter Tabs ─────────────────────────────────────────
  mobileFilterRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10
  },
  mobileFilterTab: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: '#F1F5F9'
  },
  mobileFilterTabActive: {
    backgroundColor: '#EA580C'
  },
  mobileFilterTabText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B'
  },
  mobileFilterTabTextActive: {
    color: '#FFFFFF'
  },

  // ── Mobile Approval Card ───────────────────────────────────────
  mobileApprovalCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    gap: 10
  },
  approveCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center'
  },
  rejectCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center'
  },

  // ── Mobile Audit Row ───────────────────────────────────────────
  mobileAuditRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },

  // ── Mobile Bottom Navigation Bar ──────────────────────────────
  mobileBottomBar: {
    height: Platform.OS === 'web' ? 'calc(68px + max(0px, env(safe-area-inset-bottom, 0px)))' : 72,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 90,
    paddingBottom: Platform.OS === 'web' ? 'max(8px, env(safe-area-inset-bottom, 8px))' : 8,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 -2px 12px rgba(0,0,0,0.06)' }
      : { shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 8 })
  },
  mobileBottomTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    gap: 3
  },
  mobileBottomLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8'
  },
  mobileBottomLabelActive: {
    color: '#F97316',
    fontWeight: '700'
  },
  phoneBadgeDot: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#EA580C',
    borderRadius: 8,
    paddingHorizontal: 4,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  phoneBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800'
  },

  // ── Admin Profile Styles ──
  profileSectionWrapper: {
    gap: 16
  },
  profileHeroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    gap: 16,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 2px 4px rgba(0,0,0,0.04), 0 8px 16px rgba(0,0,0,0.06)' }
      : { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.07, shadowRadius: 12, elevation: 3 })
  },
  profileHeroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16
  },
  profileAvatarLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  profileAvatarLargeText: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800'
  },
  profileOnlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF'
  },
  profileHeroInfo: {
    flex: 1,
    gap: 3
  },
  profileNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap'
  },
  profileNameText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A'
  },
  domainBadge: {
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CCFBF1'
  },
  domainBadgeText: {
    color: '#0F766E',
    fontSize: 11,
    fontWeight: '700'
  },
  profileRoleTitle: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500'
  },
  profileEmployeeId: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600'
  },
  profileActionRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    marginTop: 4
  },
  editProfileToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FFEDD5',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12
  },
  editProfileToggleBtnActive: {
    backgroundColor: '#EA580C',
    borderColor: '#EA580C'
  },
  editProfileToggleBtnText: {
    color: '#EA580C',
    fontSize: 13,
    fontWeight: '700'
  },
  resetPassBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12
  },
  resetPassBtnText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '600'
  },
  editProfileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    gap: 14,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 2px 4px rgba(0,0,0,0.04), 0 8px 16px rgba(0,0,0,0.06)' }
      : { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.07, shadowRadius: 12, elevation: 3 })
  },
  tasksDueSub: {
    fontSize: 13,
    color: '#64748B'
  },
  editFormGrid: {
    gap: 12,
    marginTop: 8
  },
  formFieldBlock: {
    gap: 4
  },
  formFieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155'
  },
  formTextInput: {
    height: 46,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#0F172A',
    outlineStyle: 'none'
  },
  editFormActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10
  },
  saveProfileBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 48,
    borderRadius: 12
  },
  saveProfileBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700'
  },
  cancelProfileBtn: {
    paddingHorizontal: 18,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1'
  },
  cancelProfileBtnText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600'
  },
  profileDetailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16
  },
  profileInfoCard: {
    flex: 1,
    minWidth: 280,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    gap: 12,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 2px 4px rgba(0,0,0,0.04), 0 8px 16px rgba(0,0,0,0.06)' }
      : { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.07, shadowRadius: 12, elevation: 3 })
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  infoCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A'
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  infoLabel: {
    fontSize: 13,
    color: '#64748B'
  },
  infoValue: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '600'
  },

  // ── Modal Styles ──
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  modalContainer: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    gap: 14,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2), 0 8px 10px -6px rgba(0,0,0,0.1)' }
      : { elevation: 8 })
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A'
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#64748B'
  },
  modalFilterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9'
  },
  modalFilterChipActive: {
    backgroundColor: '#EA580C'
  },
  modalFilterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569'
  },
  modalFilterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700'
  },
  modalActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12
  },
  modalSubmitBtn: {
    flex: 1,
    height: 46,
    backgroundColor: '#EA580C',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6
  },
  modalSubmitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700'
  },
  modalCancelBtn: {
    paddingHorizontal: 16,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalCancelBtnText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600'
  }
});

export default AdminShell;
