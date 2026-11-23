import React, { useState } from 'react';
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

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'users' | 'approvals' | 'reports' | 'audit' | 'settings'
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserFilter, setSelectedUserFilter] = useState('all');
  const [approvalsList, setApprovalsList] = useState([
    { id: 'app-1', name: 'David Miller', type: 'Annual Leave', dates: 'Nov 26 - Nov 30', dept: 'Engineering', status: 'Pending' },
    { id: 'app-2', name: 'Sarah Chen', type: 'Overtime Claim', dates: '12.5 hrs (Sprint 42)', dept: 'Product', status: 'Pending' },
    { id: 'app-3', name: 'Alex Johnson', type: 'Remote Request', dates: 'Dec 01 - Dec 05', dept: 'Security', status: 'Pending' }
  ]);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleApprove = (id, name) => {
    setApprovalsList((prev) => prev.filter((item) => item.id !== id));
    showToast(`Approved request for ${name}`);
  };

  const handleReject = (id, name) => {
    setApprovalsList((prev) => prev.filter((item) => item.id !== id));
    showToast(`Rejected request for ${name}`);
  };

  // Sample Users Table Data
  const sampleUsers = [
    { id: 'usr-1', name: 'Elena Rostova', email: 'elena.rostova@hbplus.fit', role: 'Admin', dept: 'Security Operations', status: 'Active', lastActive: '2m ago' },
    { id: 'usr-2', name: 'Marcus Vance', email: 'marcus.vance@hbplus.fit', role: 'User', dept: 'Core Infrastructure', status: 'Active', lastActive: '14m ago' },
    { id: 'usr-3', name: 'Aaliyah Khan', email: 'aaliyah.khan@hbplus.fit', role: 'User', dept: 'Frontend Systems', status: 'Active', lastActive: '1h ago' },
    { id: 'usr-4', name: 'Lucas Sterling', email: 'lucas.s@hbplus.fit', role: 'User', dept: 'Product Engineering', status: 'On Leave', lastActive: 'Yesterday' },
    { id: 'usr-5', name: 'Priya Sharma', email: 'priya.s@hbplus.fit', role: 'Admin', dept: 'Platform Governance', status: 'Active', lastActive: 'Just now' }
  ];

  const filteredUsers = sampleUsers.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.dept.toLowerCase().includes(searchQuery.toLowerCase());
    if (selectedUserFilter === 'all') return matchesSearch;
    if (selectedUserFilter === 'admin') return matchesSearch && u.role === 'Admin';
    if (selectedUserFilter === 'user') return matchesSearch && u.role === 'User';
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
        { id: 'approvals', label: 'Pending Approvals', icon: 'checkSquare', badge: approvalsList.length > 0 ? approvalsList.length : null }
      ]
    },
    {
      title: 'System',
      items: [
        { id: 'reports', label: 'Reports & Analytics', icon: 'reports' },
        { id: 'audit', label: 'Audit Log Feed', icon: 'activity' },
        { id: 'settings', label: 'System Settings', icon: 'settings' }
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
              {/* 4 Metric Cards 2×2 grid */}
              <View style={styles.metricsGrid}>
                <MetricCard
                  value="248"
                  badge="+12%"
                  badgeColor="#059669"
                  badgeBg="#ECFDF5"
                  label="Total Workforce"
                  subtitle="Active accounts across 6 depts"
                  iconName="dashboard"
                  iconBg="#0F766E"
                />
                <MetricCard
                  value="231"
                  badge="93.1%"
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
                  value={String(approvalsList.length)}
                  badge="Action"
                  badgeColor="#D97706"
                  badgeBg="#FEF3C7"
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
                {filteredUsers.map((u) => (
                  <EmployeeCard key={u.id} user={u} />
                ))}
              </View>

              {/* Pending Approvals Queue */}
              <View style={styles.mobileSectionCard}>
                <Text style={styles.mobileSectionTitle}>Pending Approvals Queue</Text>
                <Text style={[styles.mobileSectionSub, { marginBottom: 8 }]}>Real-time requests awaiting sign-off</Text>
                {approvalsList.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Icon name="checkCircle" size={28} color="#EA580C" />
                    <Text style={styles.emptyStateText}>All pending approvals cleared!</Text>
                  </View>
                ) : (
                  approvalsList.map((req) => (
                    <View key={req.id} style={styles.mobileApprovalCard}>
                      <View style={{ flex: 1, gap: 2 }}>
                        <Text style={styles.approvalName}>{req.name}</Text>
                        <Text style={styles.approvalMeta}>{req.dept} • {req.type}</Text>
                        <Text style={styles.approvalMeta}>{req.dates}</Text>
                      </View>
                      <View style={styles.approvalActions}>
                        <TouchableOpacity
                          style={styles.approveCircleBtn}
                          onPress={() => handleApprove(req.id, req.name)}
                          activeOpacity={0.8}
                        >
                          <Icon name="checkCircle" size={20} color="#FFFFFF" strokeWidth={2} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.rejectCircleBtn}
                          onPress={() => handleReject(req.id, req.name)}
                          activeOpacity={0.8}
                        >
                          <Icon name="xCircle" size={20} color="#FFFFFF" strokeWidth={2} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
                )}
              </View>

              {/* Audit Log Feed */}
              <View style={styles.mobileSectionCard}>
                <Text style={styles.mobileSectionTitle}>Audit Log Feed</Text>
                <Text style={[styles.mobileSectionSub, { marginBottom: 8 }]}>Immutable compliance telemetry</Text>
                {[
                  { time: '14:02:11', actor: 'admin@hbplus.fit', action: 'Custom claim verified', ip: '10.0.4.12' },
                  { time: '13:58:45', actor: 'marcus.v@hbplus.fit', action: 'Geofence check-in [HQ-East]', ip: '192.168.1.84' },
                  { time: '13:42:09', actor: 'system-governance', action: 'Nightly payroll sync complete', ip: 'internal' },
                  { time: '13:10:33', actor: 'sarah.c@hbplus.fit', action: 'Submitted overtime claim', ip: '10.0.2.91' }
                ].map((log, idx) => (
                  <View key={idx} style={styles.mobileAuditRow}>
                    <Text style={styles.auditTime}>{log.time}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.auditAction}>{log.action}</Text>
                      <Text style={styles.auditActor}>{log.actor} • {log.ip}</Text>
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
              {approvalsList.length === 0 ? (
                <View style={styles.emptyState}>
                  <Icon name="checkCircle" size={28} color="#EA580C" />
                  <Text style={styles.emptyStateText}>All pending approvals cleared!</Text>
                </View>
              ) : (
                approvalsList.map((req) => (
                  <View key={req.id} style={styles.mobileApprovalCard}>
                    <View style={{ flex: 1, gap: 2 }}>
                      <Text style={styles.approvalName}>{req.name}</Text>
                      <Text style={styles.approvalMeta}>{req.dept} • {req.type}</Text>
                      <Text style={styles.approvalMeta}>{req.dates}</Text>
                    </View>
                    <View style={styles.approvalActions}>
                      <TouchableOpacity
                        style={styles.approveCircleBtn}
                        onPress={() => handleApprove(req.id, req.name)}
                        activeOpacity={0.8}
                      >
                        <Icon name="checkCircle" size={20} color="#FFFFFF" strokeWidth={2} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.rejectCircleBtn}
                        onPress={() => handleReject(req.id, req.name)}
                        activeOpacity={0.8}
                      >
                        <Icon name="xCircle" size={20} color="#FFFFFF" strokeWidth={2} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
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
              {[
                { time: '14:02:11', actor: 'admin@hbplus.fit', action: 'Custom claim verified' },
                { time: '13:58:45', actor: 'marcus.v@hbplus.fit', action: 'Geofence check-in [HQ-East]' },
                { time: '13:42:09', actor: 'system-governance', action: 'Nightly payroll sync complete' }
              ].map((l, i) => (
                <View key={i} style={styles.mobileAuditRow}>
                  <Text style={styles.auditTime}>{l.time}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.auditAction}>{l.action}</Text>
                    <Text style={styles.auditActor}>{l.actor}</Text>
                  </View>
                </View>
              ))}
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
            { id: 'approvals', label: 'Approvals', icon: 'checkSquare', badge: approvalsList.length },
            { id: 'reports', label: 'Reports', icon: 'reports' },
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
                {/* 4 KPI Cards */}
                <View style={styles.kpiRow}>
                  <SquaredCard style={styles.kpiCard}>
                    <Text style={styles.kpiOverline}>TOTAL WORKFORCE</Text>
                    <View style={styles.kpiValRow}>
                      <Text style={styles.kpiNumber}>248</Text>
                      <View style={[styles.kpiDeltaBadge, { backgroundColor: '#ECFDF5' }]}>
                        <Text style={[styles.kpiDeltaText, { color: '#059669' }]}>+12%</Text>
                      </View>
                    </View>
                    <Text style={styles.kpiSub}>Active accounts across 6 depts</Text>
                  </SquaredCard>

                  <SquaredCard style={styles.kpiCard}>
                    <Text style={styles.kpiOverline}>PRESENT TODAY</Text>
                    <View style={styles.kpiValRow}>
                      <Text style={styles.kpiNumber}>231</Text>
                      <View style={[styles.kpiDeltaBadge, { backgroundColor: '#ECFDF5' }]}>
                        <Text style={[styles.kpiDeltaText, { color: '#059669' }]}>93.1%</Text>
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
                      <Text style={styles.kpiNumber}>{approvalsList.length}</Text>
                      <View style={[styles.kpiDeltaBadge, { backgroundColor: '#FEF3C7' }]}>
                        <Text style={[styles.kpiDeltaText, { color: '#D97706' }]}>Action</Text>
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
                          <Text style={[styles.tableTdText, { width: 140 }]}>{item.dept}</Text>
                          <View style={{ width: 90 }}>
                            <View
                              style={[
                                styles.roleBadgeCell,
                                item.role === 'Admin'
                                  ? { backgroundColor: '#EA580C' }
                                  : { backgroundColor: '#E2E8F0' }
                              ]}
                            >
                              <Text
                                style={[
                                  styles.roleBadgeCellText,
                                  item.role === 'Admin' ? { color: '#FFFFFF' } : { color: '#334155' }
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
                    </View>

                    {approvalsList.length === 0 ? (
                      <View style={styles.emptyState}>
                        <Icon name="checkCircle" size={28} color="#EA580C" />
                        <Text style={styles.emptyStateText}>All pending approvals cleared!</Text>
                      </View>
                    ) : (
                      approvalsList.map((req) => (
                        <View key={req.id} style={styles.approvalItem}>
                          <View style={styles.approvalInfo}>
                            <Text style={styles.approvalName}>{req.name}</Text>
                            <Text style={styles.approvalMeta}>{req.type} • {req.dates}</Text>
                          </View>
                          <View style={styles.approvalActions}>
                            <TouchableOpacity
                              style={styles.approveBtn}
                              onPress={() => handleApprove(req.id, req.name)}
                              activeOpacity={0.8}
                            >
                              <Icon name="check" size={14} color="#FFFFFF" strokeWidth={2.6} />
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.rejectBtn}
                              onPress={() => handleReject(req.id, req.name)}
                              activeOpacity={0.8}
                            >
                              <Icon name="x" size={14} color="#DC2626" strokeWidth={2.6} />
                            </TouchableOpacity>
                          </View>
                        </View>
                      ))
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
                      {[
                        { time: '14:02:11', actor: 'admin@hbplus.fit', action: 'Custom claim verified', ip: '10.0.4.12' },
                        { time: '13:58:45', actor: 'marcus.v@hbplus.fit', action: 'Geofence check-in [HQ-East]', ip: '192.168.1.84' },
                        { time: '13:42:09', actor: 'system-governance', action: 'Nightly payroll sync complete', ip: 'internal' },
                        { time: '13:10:33', actor: 'sarah.c@hbplus.fit', action: 'Submitted overtime claim', ip: '10.0.2.91' }
                      ].map((log, idx) => (
                        <View key={idx} style={styles.auditRow}>
                          <Text style={styles.auditTime}>{log.time}</Text>
                          <View style={styles.auditDetails}>
                            <Text style={styles.auditAction}>{log.action}</Text>
                            <Text style={styles.auditActor}>{log.actor} • {log.ip}</Text>
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
                <Text style={styles.cardTitle}>Workforce Directory & Role Provisioning</Text>
                <Text style={styles.cardSub}>Full employee roster with direct privilege elevation tools.</Text>
                <View style={{ marginTop: 16 }}>
                  {sampleUsers.map((u) => (
                    <View key={u.id} style={styles.tableTr}>
                      <View style={{ flex: 2 }}>
                        <Text style={styles.userName}>{u.name}</Text>
                        <Text style={styles.userEmail}>{u.email}</Text>
                      </View>
                      <Text style={[styles.tableTdText, { flex: 1.5 }]}>{u.dept}</Text>
                      <Text style={[styles.tableTdText, { flex: 1 }]}>{u.role}</Text>
                    </View>
                  ))}
                </View>
              </SquaredCard>
            )}

            {activeTab === 'approvals' && (
              <SquaredCard style={styles.approvalsCard}>
                <Text style={styles.cardTitle}>Pending Approvals</Text>
                <Text style={styles.cardSub}>Review time-off and reimbursement requests.</Text>
                {approvalsList.map((req) => (
                  <View key={req.id} style={[styles.approvalItem, { marginTop: 12 }]}>
                    <View style={styles.approvalInfo}>
                      <Text style={styles.approvalName}>{req.name}</Text>
                      <Text style={styles.approvalMeta}>{req.type} • {req.dates}</Text>
                    </View>
                    <View style={styles.approvalActions}>
                      <TouchableOpacity
                        style={styles.approveBtn}
                        onPress={() => handleApprove(req.id, req.name)}
                      >
                        <Icon name="check" size={14} color="#FFFFFF" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.rejectBtn}
                        onPress={() => handleReject(req.id, req.name)}
                      >
                        <Icon name="x" size={14} color="#DC2626" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
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
                  {[
                    { time: '14:02:11', actor: 'admin@hbplus.fit', action: 'Custom claim verified' },
                    { time: '13:58:45', actor: 'marcus.v@hbplus.fit', action: 'Geofence check-in [HQ-East]' },
                    { time: '13:42:09', actor: 'system-governance', action: 'Nightly payroll sync complete' }
                  ].map((l, i) => (
                    <View key={i} style={styles.auditRow}>
                      <Text style={styles.auditTime}>{l.time}</Text>
                      <Text style={styles.auditAction}>{l.action} ({l.actor})</Text>
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
          </ScrollView>
        </View>
      </View>
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
    paddingTop: Platform.OS === 'web' ? 'max(42px, env(safe-area-inset-top, 42px))' : 42,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    minHeight: Platform.OS === 'web' ? 'calc(60px + max(42px, env(safe-area-inset-top, 42px)))' : 100,
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
    paddingBottom: 100,
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
  }
});

export default AdminShell;
