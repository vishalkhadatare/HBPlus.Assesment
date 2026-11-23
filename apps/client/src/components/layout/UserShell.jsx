import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  useWindowDimensions
} from 'react-native';
import { useAuth } from '../../hooks/useAuth.js';
import { RoleThemeProvider, useRoleTheme } from '../../theme/roleThemes.js';
import { CARD_RADIUS } from '../../theme/shape.js';
import HBLogo from '../brand/HBLogo.jsx';
import Icon from '../ui/Icon.jsx';
import SquaredCard from '../ui/SquaredCard.jsx';
import SquaredButton from '../ui/SquaredButton.jsx';

// ─── SVG Progress Ring (web-only, used for leave balances & hero) ─────────────
function ProgressRing({ size = 60, strokeWidth = 5, progress = 0.75, color = '#14B8A6', children }) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * progress;

  if (Platform.OS !== 'web') {
    // Fallback: simple circle
    return (
      <View style={{ width: size, height: size, borderRadius: size / 2, borderWidth: strokeWidth, borderColor: color, alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </View>
    );
  }

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <svg
        width={size}
        height={size}
        style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
        />
      </svg>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </View>
    </View>
  );
}

function LeaveRing({ size = 60, strokeWidth = 5, value, total, color, label }) {
  const progress = total > 0 ? value / total : 0;
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * progress;

  if (Platform.OS !== 'web') {
    return (
      <View style={styles.balanceItem}>
        <View style={[styles.ringCircle, { borderColor: color }]}>
          <Text style={[styles.ringNum, { color }]}>{value}</Text>
        </View>
        <Text style={styles.ringLabel}>{label}</Text>
        <Text style={styles.ringFraction}>{value}/{total}</Text>
      </View>
    );
  }

  return (
    <View style={styles.balanceItem}>
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        {/* eslint-disable-next-line react-native/no-inline-styles */}
        <svg
          width={size}
          height={size}
          style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}
        >
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E2E8F0" strokeWidth={strokeWidth} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
          />
        </svg>
        <Text style={[styles.ringNum, { color }]}>{value}</Text>
      </View>
      <Text style={styles.ringLabel}>{label}</Text>
      <Text style={styles.ringFraction}>{value}/{total}</Text>
    </View>
  );
}

// ─── Main Shell Content ───────────────────────────────────────────────────────
function UserShellContent({ onSignOut }) {
  const { user, profile } = useAuth();
  const theme = useRoleTheme();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  const [activeTab, setActiveTab] = useState('home');
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [showSalary, setShowSalary] = useState(false);
  const [tasks, setTasks] = useState([
    { id: 't1', title: 'Submit Q4 Self-Assessment', due: 'Today, 5:00 PM', completed: false },
    { id: 't2', title: 'Review Security Awareness Training', due: 'Tomorrow', completed: true },
    { id: 't3', title: 'Confirm Annual Benefits Enrollment', due: 'Nov 30', completed: false }
  ]);
  const [toastMessage, setToastMessage] = useState(null);

  // Live Clock
  const [currentTime, setCurrentTime] = useState('');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleCheckInToggle = () => {
    setIsCheckedIn(!isCheckedIn);
    showToast(!isCheckedIn ? '🎉 Checked in at 09:14 AM (HQ Geofence Verified)' : 'Clocked out. Have a restful evening!');
  };

  const displayName = profile?.displayName || user?.displayName || user?.email?.split('@')[0] || 'Employee';
  const firstName = displayName.split(' ')[0] || 'Team';

  const userNavItems = [
    { id: 'home', label: 'Home', icon: 'dashboard' },
    { id: 'attendance', label: 'Attendance', icon: 'fingerprint' },
    { id: 'leave', label: 'Leave', icon: 'leave' },
    { id: 'payslips', label: 'Payslips', icon: 'payroll' },
    { id: 'tasks', label: 'Tasks', icon: 'tasks' },
    { id: 'profile', label: 'Profile', icon: 'user' }
  ];

  // Bottom nav (5 items for mobile)
  const mobileNavItems = [
    { id: 'home', label: 'Home', icon: 'dashboard' },
    { id: 'attendance', label: 'Attendance', icon: 'fingerprint' },
    null, // center check-in button placeholder
    { id: 'leave', label: 'Leave', icon: 'leave' },
    { id: 'more', label: 'More', icon: 'more' }
  ];

  return (
    <View style={styles.root}>
      {/* Identity strip (desktop only) */}
      {isDesktop ? (
        <View style={[styles.identityStrip, { backgroundColor: '#0F766E' }]} />
      ) : null}

      <View style={styles.mainLayout}>
        {/* ── DESKTOP SIDEBAR ─────────────────────────────────────────────── */}
        {isDesktop ? (
          <View style={styles.lightSidebar}>
            {/* Brand */}
            <View style={styles.sidebarBrand}>
              <HBLogo size={36} />
              <View style={styles.brandTitleWrap}>
                <Text style={styles.brandTitleText}>HBPlus</Text>
                <View style={styles.userBadgePill}>
                  <Text style={styles.userBadgeText}>Workspace</Text>
                </View>
              </View>
            </View>

            {/* Nav links */}
            <View style={styles.sidebarNav}>
              {userNavItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.sidebarNavItem, isActive && styles.sidebarNavItemActive]}
                    onPress={() => setActiveTab(item.id)}
                    activeOpacity={0.7}
                  >
                    <Icon
                      name={item.icon}
                      size={20}
                      color={isActive ? '#0F766E' : '#64748B'}
                      strokeWidth={isActive ? 2.4 : 1.8}
                    />
                    <Text style={[styles.sidebarNavText, isActive && styles.sidebarNavTextActive]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Sidebar footer */}
            <View style={styles.sidebarFooter}>
              <View style={styles.userBrief}>
                <View style={styles.userAvatar}>
                  <Text style={styles.userAvatarText}>{firstName.charAt(0).toUpperCase()}</Text>
                </View>
                <View style={styles.userInfoCol}>
                  <Text style={styles.userNameText} numberOfLines={1}>{displayName}</Text>
                  <Text style={styles.userEmailText} numberOfLines={1}>{user?.email}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.signOutBtn} onPress={onSignOut} activeOpacity={0.7}>
                <Icon name="logout" size={16} color="#DC2626" />
                <Text style={styles.signOutText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        {/* ── CONTENT COLUMN ───────────────────────────────────────────────── */}
        <View style={styles.contentColumn}>

          {/* ── TOP GREETING HEADER ─────────────────────────────────────── */}
          <View style={[styles.topArea, !isDesktop && styles.mobileTopArea]}>
            {/* Mobile: avatar left */}
            {!isDesktop ? (
              <View style={styles.mobileAvatarCircle}>
                <Text style={styles.mobileAvatarText}>{firstName.charAt(0).toUpperCase()}</Text>
              </View>
            ) : null}

            <View style={styles.greetingCol}>
              <Text style={styles.greetingText}>Good morning, {firstName} 👋</Text>
              <Text style={styles.dateSubText}>
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </Text>
            </View>

            <View style={styles.topActions}>
              <TouchableOpacity style={styles.bellBtn} activeOpacity={0.7}>
                <Icon name="bell" size={20} color="#0F172A" />
                <View style={styles.bellDot} />
              </TouchableOpacity>
              {!isDesktop ? (
                <TouchableOpacity onPress={onSignOut} style={styles.bellBtn} activeOpacity={0.7}>
                  <Icon name="logout" size={18} color="#EF4444" />
                </TouchableOpacity>
              ) : (
                <View style={styles.topAvatar}>
                  <Text style={styles.topAvatarText}>{firstName.charAt(0).toUpperCase()}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Toast */}
          {toastMessage ? (
            <View style={styles.toastCard}>
              <Text style={styles.toastText}>{toastMessage}</Text>
            </View>
          ) : null}

          {/* ── SCROLL CONTENT ──────────────────────────────────────────── */}
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={[styles.scrollInner, !isDesktop && styles.scrollInnerMobile]}
            showsVerticalScrollIndicator={false}
          >
            {/* ══ HOME TAB ════════════════════════════════════════════════ */}
            {activeTab === 'home' && (
              <>
                {/* 1. SHIFT HERO CARD */}
                <View style={styles.heroCard}>
                  <View style={styles.heroLeftCol}>
                    {/* Time badge */}
                    <View style={styles.liveClockBadge}>
                      <View style={styles.clockPulse} />
                      <Text style={styles.liveClockText}>{currentTime || '09:30 AM'}</Text>
                    </View>

                    <Text style={styles.shiftTitle}>General Corporate Shift</Text>
                    <Text style={styles.shiftTime}>09:00 AM – 06:00 PM • 8h remaining</Text>

                    <TouchableOpacity
                      style={[
                        styles.checkInActionBtn,
                        isCheckedIn && styles.checkInActionBtnChecked
                      ]}
                      onPress={handleCheckInToggle}
                      activeOpacity={0.88}
                    >
                      <Icon
                        name={isCheckedIn ? 'checkCircle' : 'fingerprint'}
                        size={20}
                        color={isCheckedIn ? '#059669' : '#0F766E'}
                        strokeWidth={2.4}
                      />
                      <Text style={[styles.checkInActionBtnText, isCheckedIn && styles.checkInActionBtnTextChecked]}>
                        {isCheckedIn ? 'Checked In ✓' : '1-Tap Geofence Check-In'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Progress ring (right side) */}
                  <View style={styles.heroRightCol}>
                    {Platform.OS === 'web' ? (
                      <View style={{ width: 80, height: 80, alignItems: 'center', justifyContent: 'center' }}>
                        {/* eslint-disable-next-line react-native/no-inline-styles */}
                        <svg
                          width={80}
                          height={80}
                          style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}
                        >
                          <circle cx={40} cy={40} r={34} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={6} />
                          <circle
                            cx={40}
                            cy={40}
                            r={34}
                            fill="none"
                            stroke="#FFFFFF"
                            strokeWidth={6}
                            strokeDasharray={`${2 * Math.PI * 34 * 0.68} ${2 * Math.PI * 34}`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <Text style={styles.progressRingVal}>68%</Text>
                        <Text style={styles.progressRingLabel}>Day Done</Text>
                      </View>
                    ) : (
                      <View style={styles.progressRingCircle}>
                        <Text style={styles.progressRingVal}>68%</Text>
                        <Text style={styles.progressRingLabel}>Day Done</Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* 2. QUICK ACTIONS 2×2 GRID */}
                <View style={styles.quickActionsGrid}>
                  {[
                    { label: 'Apply Leave', icon: 'leave', bg: '#ECFDF5', color: '#059669', action: () => setActiveTab('leave') },
                    { label: 'Clock History', icon: 'clock', bg: '#EFF6FF', color: '#2563EB', action: () => setActiveTab('attendance') },
                    { label: 'View Payslip', icon: 'payroll', bg: '#FFFBEB', color: '#D97706', action: () => setActiveTab('payslips') },
                    { label: 'My Tasks', icon: 'tasks', bg: '#F5F3FF', color: '#7C3AED', action: () => setActiveTab('tasks') }
                  ].map((qa, i) => (
                    <TouchableOpacity
                      key={i}
                      style={styles.quickActionTile}
                      onPress={qa.action}
                      activeOpacity={0.8}
                    >
                      <View style={[styles.quickActionIconWrap, { backgroundColor: qa.bg }]}>
                        <Icon name={qa.icon} size={22} color={qa.color} strokeWidth={2.2} />
                      </View>
                      <Text style={styles.quickActionLabel}>{qa.label}</Text>
                      <View style={{ flex: 1 }} />
                      <Icon name="chevronRight" size={16} color="#CBD5E1" strokeWidth={2} />
                    </TouchableOpacity>
                  ))}
                </View>

                {/* 3. LEAVE BALANCES */}
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>My Leave Balances</Text>
                  <TouchableOpacity onPress={() => setActiveTab('leave')}>
                    <Text style={styles.viewAllLink}>Apply →</Text>
                  </TouchableOpacity>
                </View>

                <SquaredCard style={styles.leaveBalanceCard}>
                  <View style={styles.balanceRingsRow}>
                    <LeaveRing size={64} strokeWidth={5} value={14} total={18} color="#0F766E" label="Annual" />
                    <LeaveRing size={64} strokeWidth={5} value={6}  total={8}  color="#2563EB" label="Sick"   />
                    <LeaveRing size={64} strokeWidth={5} value={4}  total={5}  color="#D97706" label="Casual" />
                  </View>
                </SquaredCard>

                {/* 4. PAYSLIP CARD */}
                <SquaredCard style={styles.payslipCardNew}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Latest Net Salary</Text>
                    <TouchableOpacity onPress={() => setShowSalary(!showSalary)}>
                      <Icon name={showSalary ? 'eyeOff' : 'eye'} size={18} color="#64748B" />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.salaryAmountNew}>
                    {showSalary ? '₹ 84,500' : '••••••'}
                  </Text>
                  <Text style={styles.salaryMeta}>Direct Deposit • Nov 15, 2026 (Processed)</Text>

                  <TouchableOpacity
                    style={styles.downloadPayslipBtn}
                    onPress={() => showToast('Payslip PDF downloaded to your device.')}
                    activeOpacity={0.8}
                  >
                    <Icon name="download" size={15} color="#0F766E" />
                    <Text style={styles.downloadPayslipText}>Download PDF</Text>
                  </TouchableOpacity>
                </SquaredCard>

                {/* 5. TASKS LIST */}
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Pending Tasks</Text>
                  <Text style={styles.tasksDueSub}>3 items</Text>
                </View>

                <View style={styles.tasksList}>
                  {tasks.map((t) => (
                    <TouchableOpacity
                      key={t.id}
                      style={styles.taskItemCard}
                      onPress={() => handleToggleTask(t.id)}
                      activeOpacity={0.8}
                    >
                      <View style={[styles.checkboxCircle, t.completed && styles.checkboxCircleCompleted]}>
                        {t.completed ? <Icon name="check" size={13} color="#FFFFFF" strokeWidth={3} /> : null}
                      </View>
                      <View style={styles.taskDetails}>
                        <Text style={[styles.taskTitle, t.completed && styles.taskTitleCompleted]}>
                          {t.title}
                        </Text>
                        <View style={styles.taskDueBadge}>
                          <Icon name="calendar" size={10} color="#D97706" />
                          <Text style={styles.taskDue}>{t.due}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* 6. ANNOUNCEMENTS */}
                <SquaredCard style={styles.announcementCard}>
                  <View style={styles.announcementHeader}>
                    <View style={styles.announcementIconWrap}>
                      <Icon name="announcements" size={18} color="#D97706" />
                    </View>
                    <Text style={styles.cardTitle}>Corporate Announcements</Text>
                  </View>

                  <View style={styles.announcementItem}>
                    <Text style={styles.announcementBody}>
                      🌟 Annual All-Hands Summit scheduled for Dec 12. All teams are requested to confirm attendance by Nov 28.
                    </Text>
                    <Text style={styles.announcementDate}>Nov 20, 2026</Text>
                  </View>

                  <View style={styles.announcementDivider} />

                  <View style={styles.announcementItem}>
                    <Text style={styles.announcementBody}>
                      💚 New flexible wellness stipends take effect starting next payroll cycle. Check the benefits portal for details.
                    </Text>
                    <Text style={styles.announcementDate}>Nov 18, 2026</Text>
                  </View>
                </SquaredCard>
              </>
            )}

            {/* ══ ATTENDANCE TAB ══════════════════════════════════════════ */}
            {activeTab === 'attendance' && (
              <SquaredCard style={styles.tabContentCard}>
                <Text style={styles.cardTitle}>Monthly Attendance Heatmap</Text>
                <Text style={styles.tasksDueSub}>21 of 22 days present (95.4% compliance)</Text>
                <View style={styles.heatmapGrid}>
                  {Array.from({ length: 28 }).map((_, idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.heatmapTile,
                        idx % 7 === 5 || idx % 7 === 6
                          ? styles.heatmapWeekend
                          : styles.heatmapPresent
                      ]}
                    >
                      <Text style={styles.heatmapTileNum}>{idx + 1}</Text>
                    </View>
                  ))}
                </View>
              </SquaredCard>
            )}

            {/* ══ LEAVE TAB ═══════════════════════════════════════════════ */}
            {activeTab === 'leave' && (
              <SquaredCard style={styles.tabContentCard}>
                <Text style={styles.cardTitle}>Request Time Off</Text>
                <Text style={styles.tasksDueSub}>Submit formal leave requests to your supervisor.</Text>
                <View style={{ marginTop: 16, gap: 12 }}>
                  <SquaredButton
                    title="Submit New Leave Application"
                    onPress={() => showToast('Leave request modal launched.')}
                  />
                </View>
              </SquaredCard>
            )}

            {/* ══ PAYSLIPS TAB ════════════════════════════════════════════ */}
            {activeTab === 'payslips' && (
              <SquaredCard style={styles.tabContentCard}>
                <Text style={styles.cardTitle}>Historical Payslips</Text>
                <Text style={styles.tasksDueSub}>Access payroll statements and tax documents.</Text>
                {['October 2026', 'September 2026', 'August 2026'].map((m, i) => (
                  <View key={i} style={styles.historicalRow}>
                    <Text style={styles.historicalMonth}>{m}</Text>
                    <TouchableOpacity onPress={() => showToast(`Downloading ${m} statement`)}>
                      <Icon name="download" size={16} color="#0F766E" />
                    </TouchableOpacity>
                  </View>
                ))}
              </SquaredCard>
            )}

            {/* ══ TASKS TAB ═══════════════════════════════════════════════ */}
            {activeTab === 'tasks' && (
              <SquaredCard style={styles.tabContentCard}>
                <Text style={styles.cardTitle}>Personal Tasks</Text>
                {tasks.map((t) => (
                  <TouchableOpacity
                    key={t.id}
                    style={styles.taskItemRow}
                    onPress={() => handleToggleTask(t.id)}
                  >
                    <View style={[styles.checkboxCircle, t.completed && styles.checkboxCircleCompleted]}>
                      {t.completed && <Icon name="check" size={13} color="#FFFFFF" />}
                    </View>
                    <Text style={[styles.taskTitle, t.completed && styles.taskTitleCompleted]}>{t.title}</Text>
                  </TouchableOpacity>
                ))}
              </SquaredCard>
            )}

            {/* ══ PROFILE TAB ═════════════════════════════════════════════ */}
            {activeTab === 'profile' && (
              <SquaredCard style={styles.tabContentCard}>
                <Text style={styles.cardTitle}>Personal Profile</Text>
                <Text style={styles.tasksDueSub}>Verified account: {user?.email}</Text>
                <View style={{ marginTop: 16, gap: 8 }}>
                  <Text style={styles.profileField}>Role: <Text style={{ fontWeight: '700' }}>User (Employee)</Text></Text>
                  <Text style={styles.profileField}>Status: <Text style={{ color: '#059669', fontWeight: '700' }}>Active</Text></Text>
                  <TouchableOpacity style={styles.signOutBtn} onPress={onSignOut}>
                    <Text style={styles.signOutText}>End Session</Text>
                  </TouchableOpacity>
                </View>
              </SquaredCard>
            )}
          </ScrollView>

          {/* ── MOBILE FLOATING BOTTOM NAV ──────────────────────────────── */}
          {!isDesktop ? (
            <View style={styles.phoneFloatingTabWrapper}>
              <View style={styles.phoneFloatingBar}>
                {/* Home */}
                <TouchableOpacity style={styles.phoneTabBtn} onPress={() => setActiveTab('home')}>
                  <Icon name="dashboard" size={22} color={activeTab === 'home' ? '#0F766E' : '#94A3B8'} />
                  <Text style={[styles.phoneTabLabel, activeTab === 'home' && styles.phoneTabLabelActive]}>Home</Text>
                </TouchableOpacity>

                {/* Attendance */}
                <TouchableOpacity style={styles.phoneTabBtn} onPress={() => setActiveTab('attendance')}>
                  <Icon name="fingerprint" size={22} color={activeTab === 'attendance' ? '#0F766E' : '#94A3B8'} />
                  <Text style={[styles.phoneTabLabel, activeTab === 'attendance' && styles.phoneTabLabelActive]}>Attendance</Text>
                </TouchableOpacity>

                {/* Center raised check-in button */}
                <TouchableOpacity
                  style={[styles.raisedCheckInBtn, isCheckedIn && styles.raisedCheckInBtnChecked]}
                  onPress={handleCheckInToggle}
                  activeOpacity={0.85}
                  accessibilityLabel="Check In / Out"
                >
                  <Icon
                    name={isCheckedIn ? 'check' : 'fingerprint'}
                    size={26}
                    color="#FFFFFF"
                    strokeWidth={2.6}
                  />
                </TouchableOpacity>

                {/* Leave */}
                <TouchableOpacity style={styles.phoneTabBtn} onPress={() => setActiveTab('leave')}>
                  <Icon name="leave" size={22} color={activeTab === 'leave' ? '#0F766E' : '#94A3B8'} />
                  <Text style={[styles.phoneTabLabel, activeTab === 'leave' && styles.phoneTabLabelActive]}>Leave</Text>
                </TouchableOpacity>

                {/* More */}
                <TouchableOpacity style={styles.phoneTabBtn} onPress={() => setActiveTab('profile')}>
                  <Icon name="more" size={22} color={activeTab === 'profile' ? '#0F766E' : '#94A3B8'} />
                  <Text style={[styles.phoneTabLabel, activeTab === 'profile' && styles.phoneTabLabelActive]}>More</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

export function UserShell({ onSignOut }) {
  return (
    <RoleThemeProvider role="user">
      <UserShellContent onSignOut={onSignOut} />
    </RoleThemeProvider>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F0FDFA',
    position: 'relative'
  },
  identityStrip: {
    height: 4,
    width: '100%',
    zIndex: 100
  },
  mainLayout: {
    flex: 1,
    flexDirection: 'row',
    height: '100%'
  },

  // ── Desktop Sidebar ────────────────────────────────────────────────────────
  lightSidebar: {
    width: 240,
    backgroundColor: '#FFFFFF',
    ...(Platform.OS === 'web' ? { backdropFilter: 'blur(12px)' } : {}),
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
    paddingVertical: 24,
    justifyContent: 'space-between'
  },
  sidebarBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 28
  },
  brandTitleWrap: {
    gap: 2
  },
  brandTitleText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3
  },
  userBadgePill: {
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#99F6E4',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20
  },
  userBadgeText: {
    color: '#0F766E',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase'
  },
  sidebarNav: {
    flex: 1,
    paddingHorizontal: 12,
    gap: 4
  },
  sidebarNavItem: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    borderRadius: CARD_RADIUS,
    gap: 12
  },
  sidebarNavItemActive: {
    backgroundColor: '#F0FDFA'
  },
  sidebarNavText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600'
  },
  sidebarNavTextActive: {
    color: '#0F766E',
    fontWeight: '700'
  },
  sidebarFooter: {
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 12
  },
  userBrief: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0F766E',
    alignItems: 'center',
    justifyContent: 'center'
  },
  userAvatarText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14
  },
  userInfoCol: {
    flex: 1
  },
  userNameText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A'
  },
  userEmailText: {
    fontSize: 11,
    color: '#94A3B8'
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6
  },
  signOutText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '600'
  },

  // ── Content Column ─────────────────────────────────────────────────────────
  contentColumn: {
    flex: 1,
    maxWidth: 1100,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },

  // ── Top Greeting Header ────────────────────────────────────────────────────
  topArea: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  },
  mobileTopArea: {
    paddingTop: Platform.OS === 'web' ? 'max(42px, env(safe-area-inset-top, 42px))' : 42,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    gap: 10
  },
  // Mobile avatar circle (left of greeting)
  mobileAvatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0F766E',
    ...(Platform.OS === 'web'
      ? { backgroundImage: 'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)' }
      : {}),
    alignItems: 'center',
    justifyContent: 'center'
  },
  mobileAvatarText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16
  },
  greetingCol: {
    flex: 1,
    gap: 2
  },
  greetingText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3
  },
  dateSubText: {
    fontSize: 13,
    color: '#64748B'
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  bellBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  bellDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#F59E0B'
  },
  topAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#0F766E',
    alignItems: 'center',
    justifyContent: 'center'
  },
  topAvatarText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800'
  },

  // ── Toast ──────────────────────────────────────────────────────────────────
  toastCard: {
    marginHorizontal: 20,
    marginBottom: 10,
    backgroundColor: '#0F172A',
    borderRadius: CARD_RADIUS,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignSelf: 'flex-start'
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600'
  },

  // ── Scroll ─────────────────────────────────────────────────────────────────
  scrollArea: {
    flex: 1
  },
  scrollInner: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
    gap: 14
  },
  scrollInnerMobile: {
    paddingBottom: 140
  },

  // ── Shift Hero Card ────────────────────────────────────────────────────────
  heroCard: {
    backgroundColor: '#0F766E',
    ...(Platform.OS === 'web'
      ? { backgroundImage: 'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)' }
      : {}),
    borderRadius: 24,
    padding: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 6,
    gap: 16,
    flexWrap: 'wrap'
  },
  heroLeftCol: {
    gap: 8,
    flex: 1,
    minWidth: 220
  },
  liveClockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-start'
  },
  clockPulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF'
  },
  liveClockText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  shiftTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3
  },
  shiftTime: {
    color: 'rgba(255, 255, 255, 0.82)',
    fontSize: 13,
    fontWeight: '500'
  },
  checkInActionBtn: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: 20,
    gap: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2
  },
  checkInActionBtnChecked: {
    backgroundColor: '#ECFDF5'
  },
  checkInActionBtnText: {
    color: '#0F766E',
    fontSize: 14,
    fontWeight: '800'
  },
  checkInActionBtnTextChecked: {
    color: '#059669'
  },
  heroRightCol: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  progressRingCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 5,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)'
  },
  progressRingVal: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800'
  },
  progressRingLabel: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 10,
    fontWeight: '600'
  },

  // ── Quick Action 2×2 Grid ──────────────────────────────────────────────────
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  quickActionTile: {
    // 2 columns on mobile, flexible on desktop
    flexBasis: '47%',
    flexGrow: 1,
    minWidth: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  quickActionIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  quickActionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1
  },

  // ── Section header ─────────────────────────────────────────────────────────
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A'
  },
  viewAllLink: {
    fontSize: 13,
    color: '#0F766E',
    fontWeight: '700'
  },

  // ── Leave Balance Card ─────────────────────────────────────────────────────
  leaveBalanceCard: {
    padding: 20
  },
  balanceRingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 6
  },
  balanceItem: {
    alignItems: 'center',
    gap: 6
  },
  ringCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF'
  },
  ringNum: {
    fontSize: 20,
    fontWeight: '800'
  },
  ringLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600'
  },
  ringFraction: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500'
  },

  // ── Payslip Card (new) ─────────────────────────────────────────────────────
  payslipCardNew: {
    padding: 22,
    gap: 10
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A'
  },
  salaryAmountNew: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F766E',
    letterSpacing: -0.5
  },
  salaryMeta: {
    fontSize: 12,
    color: '#64748B'
  },
  downloadPayslipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: '#0F766E',
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 4
  },
  downloadPayslipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F766E'
  },

  // ── Tasks ──────────────────────────────────────────────────────────────────
  tasksDueSub: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600'
  },
  tasksList: {
    gap: 10
  },
  taskItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  taskItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8
  },
  checkboxCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#0F766E',
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkboxCircleCompleted: {
    backgroundColor: '#059669',
    borderColor: '#059669'
  },
  taskDetails: {
    flex: 1,
    gap: 4
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A'
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
    fontWeight: '500'
  },
  taskDueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  taskDue: {
    fontSize: 11,
    color: '#D97706',
    fontWeight: '600'
  },

  // ── Announcements ──────────────────────────────────────────────────────────
  announcementCard: {
    padding: 20,
    gap: 12,
    backgroundColor: '#FFFDF5'
  },
  announcementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  announcementIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center'
  },
  announcementItem: {
    gap: 4
  },
  announcementBody: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20
  },
  announcementDate: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600'
  },
  announcementDivider: {
    height: 1,
    backgroundColor: '#FDE68A',
    opacity: 0.6
  },

  // ── Tab content generic card ───────────────────────────────────────────────
  tabContentCard: {
    padding: 22,
    gap: 14
  },

  // ── Heatmap ────────────────────────────────────────────────────────────────
  heatmapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12
  },
  heatmapTile: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  heatmapPresent: {
    backgroundColor: '#CCFBF1'
  },
  heatmapWeekend: {
    backgroundColor: '#F1F5F9'
  },
  heatmapTileNum: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F766E'
  },

  // ── Historical payslips ────────────────────────────────────────────────────
  historicalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  historicalMonth: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600'
  },

  // ── Profile ────────────────────────────────────────────────────────────────
  profileField: {
    fontSize: 14,
    color: '#334155'
  },

  // ── Floating Bottom Nav ────────────────────────────────────────────────────
  phoneFloatingTabWrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'web' ? 'max(14px, env(safe-area-inset-bottom, 14px))' : 14,
    left: 12,
    right: 12,
    zIndex: 90
  },
  phoneFloatingBar: {
    height: 64,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  phoneTabBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingHorizontal: 6,
    flex: 1
  },
  phoneTabLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600'
  },
  phoneTabLabelActive: {
    color: '#0F766E',
    fontWeight: '700'
  },
  raisedCheckInBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0F766E',
    ...(Platform.OS === 'web'
      ? { backgroundImage: 'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)' }
      : {}),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -24,
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 8
  },
  raisedCheckInBtnChecked: {
    backgroundColor: '#059669',
    ...(Platform.OS === 'web'
      ? { backgroundImage: 'linear-gradient(135deg, #047857 0%, #059669 100%)' }
      : {})
  }
});

export default UserShell;
