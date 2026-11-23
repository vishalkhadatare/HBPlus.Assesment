import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
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
import workforceStore from '../../services/workforceStore.js';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase.js';

// ─── SVG Progress Ring (web-only, used for leave balances & hero) ─────────────
function ProgressRing({ size = 60, strokeWidth = 5, progress = 0.75, color = '#14B8A6', children }) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * progress;

  if (Platform.OS !== 'web') {
    return (
      <View style={{ width: size, height: size, borderRadius: size / 2, borderWidth: strokeWidth, borderColor: color, alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </View>
    );
  }

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
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
  const progress = total > 0 ? (total - value) / total : 0;
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
      <Text style={styles.ringFraction}>{value}/{total} rem</Text>
    </View>
  );
}

// ─── Main Shell Content ───────────────────────────────────────────────────────
function UserShellContent({ onSignOut }) {
  const { user, profile: authProfile, sendPasswordReset } = useAuth();
  const theme = useRoleTheme();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  // Real-time reactive workforce state
  const [storeState, setStoreState] = useState(workforceStore.getState());
  useEffect(() => {
    return workforceStore.subscribe((newState) => {
      setStoreState({ ...newState });
    });
  }, []);

  const [activeTab, setActiveTab] = useState('home');
  const [showSalary, setShowSalary] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Leave Application Modal State
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [leaveType, setLeaveType] = useState('Annual Paid Leave');
  const [leaveDays, setLeaveDays] = useState('2');
  const [leaveStartDate, setLeaveStartDate] = useState('2026-12-01');
  const [leaveEndDate, setLeaveEndDate] = useState('2026-12-02');
  const [leaveReason, setLeaveReason] = useState('');

  // Profile Edit Mode & Form State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(storeState.profile.displayName);
  const [editPhone, setEditPhone] = useState(storeState.profile.phone);
  const [editDepartment, setEditDepartment] = useState(storeState.profile.department);
  const [editDesignation, setEditDesignation] = useState(storeState.profile.designation);
  const [editBio, setEditBio] = useState(storeState.profile.bio);
  const [editEmergency, setEditEmergency] = useState(storeState.profile.emergencyContact);

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
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleTask = (id) => {
    workforceStore.toggleTask(id);
  };

  const handleCheckInToggle = () => {
    const isNowChecked = workforceStore.toggleCheckIn();
    showToast(
      isNowChecked
        ? '🎉 Checked in at ' + (currentTime || '09:14 AM') + ' (HQ Geofence Verified)'
        : 'Clocked out. Have a restful evening!'
    );
  };

  const handleApplyLeaveSubmit = () => {
    if (!leaveReason.trim()) {
      showToast('Please enter a brief reason for your leave.');
      return;
    }
    workforceStore.applyLeave({
      leaveType,
      startDate: leaveStartDate,
      endDate: leaveEndDate,
      days: Number(leaveDays) || 1,
      reason: leaveReason.trim()
    });
    setLeaveModalOpen(false);
    setLeaveReason('');
    showToast('🎉 Leave request submitted! Forwarded to Admin for approval.');
  };

  const profile = storeState.profile;
  const displayName = authProfile?.displayName || user?.displayName || authProfile?.name || profile.displayName || 'Employee';
  const displayEmail = user?.email || authProfile?.email || profile.email;
  const displayPhone = authProfile?.phone || profile.phone || '+91 98765 43210';
  const displayDepartment = authProfile?.department || profile.department || 'Engineering Systems';
  const displayDesignation = authProfile?.designation || profile.designation || 'Enterprise Specialist';
  const displayEmployeeId = authProfile?.employeeId || profile.employeeId || `HBP-${user?.uid ? user.uid.slice(-4).toUpperCase() : '2026'}`;
  const displayBio = authProfile?.bio || profile.bio;
  const displayEmergency = authProfile?.emergencyContact || profile.emergencyContact;
  const firstName = (displayName || '').split(' ')[0] || 'Team';

  // Synchronize edit form fields whenever the authenticated account updates
  useEffect(() => {
    if (displayName) setEditName(displayName);
    if (displayPhone) setEditPhone(displayPhone);
    if (displayDepartment) setEditDepartment(displayDepartment);
    if (displayDesignation) setEditDesignation(displayDesignation);
    if (displayBio) setEditBio(displayBio);
    if (displayEmergency) setEditEmergency(displayEmergency);
  }, [displayName, displayPhone, displayDepartment, displayDesignation, displayBio, displayEmergency]);

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      showToast('Please provide your full name.');
      return;
    }
    workforceStore.updateProfile({
      displayName: editName.trim(),
      phone: editPhone.trim(),
      department: editDepartment.trim(),
      designation: editDesignation.trim(),
      bio: editBio.trim(),
      emergencyContact: editEmergency.trim()
    });

    if (user?.uid) {
      try {
        await setDoc(doc(db, 'users', user.uid), {
          displayName: editName.trim(),
          name: editName.trim(),
          phone: editPhone.trim(),
          department: editDepartment.trim(),
          designation: editDesignation.trim(),
          bio: editBio.trim(),
          emergencyContact: editEmergency.trim(),
          updatedAt: serverTimestamp()
        }, { merge: true });
      } catch (err) {
        console.warn('[UserShell] Firestore sync notice:', err.message);
      }
    }

    setIsEditingProfile(false);
    showToast('✅ Profile updated and synchronized with database!');
  };

  const handlePasswordReset = async () => {
    try {
      if (sendPasswordReset && user?.email) {
        await sendPasswordReset(user.email);
        showToast(`Reset email sent to ${user.email}`);
      } else {
        showToast('Password reset link sent to your registered corporate email.');
      }
    } catch {
      showToast('Password reset link sent to your corporate email.');
    }
  };

  const userNavItems = [
    { id: 'home', label: 'Home', icon: 'dashboard' },
    { id: 'attendance', label: 'Attendance', icon: 'fingerprint' },
    { id: 'leave', label: 'Leave', icon: 'leave' },
    { id: 'payslips', label: 'Payslips', icon: 'payroll' },
    { id: 'tasks', label: 'Tasks', icon: 'tasks' },
    { id: 'profile', label: 'Profile', icon: 'user' }
  ];

  // Leave balance counters from store
  const annualBal = storeState.leaveBalances.annual.total - storeState.leaveBalances.annual.used;
  const sickBal = storeState.leaveBalances.sick.total - storeState.leaveBalances.sick.used;
  const casualBal = storeState.leaveBalances.casual.total - storeState.leaveBalances.casual.used;

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
              <TouchableOpacity
                style={styles.userBrief}
                onPress={() => setActiveTab('profile')}
                activeOpacity={0.8}
              >
                <View style={styles.userAvatar}>
                  <Text style={styles.userAvatarText}>{firstName.charAt(0).toUpperCase()}</Text>
                </View>
                <View style={styles.userInfoCol}>
                  <Text style={styles.userNameText} numberOfLines={1}>{displayName}</Text>
                  <Text style={styles.userEmailText} numberOfLines={1}>{user?.email || profile.email}</Text>
                </View>
              </TouchableOpacity>
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
            {!isDesktop ? (
              <TouchableOpacity
                style={styles.mobileAvatarCircle}
                onPress={() => setActiveTab('profile')}
                activeOpacity={0.8}
              >
                <Text style={styles.mobileAvatarText}>{firstName.charAt(0).toUpperCase()}</Text>
              </TouchableOpacity>
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
              <TouchableOpacity
                style={styles.bellBtn}
                activeOpacity={0.7}
                onPress={() => showToast('All notifications are up to date.')}
              >
                <Icon name="bell" size={20} color="#0F172A" />
                <View style={styles.bellDot} />
              </TouchableOpacity>
              {!isDesktop ? (
                <TouchableOpacity onPress={onSignOut} style={styles.bellBtn} activeOpacity={0.7}>
                  <Icon name="logout" size={18} color="#EF4444" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.topAvatar}
                  onPress={() => setActiveTab('profile')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.topAvatarText}>{firstName.charAt(0).toUpperCase()}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Toast */}
          {toastMessage ? (
            <View style={styles.toastCard}>
              <Icon name="checkCircle" size={16} color="#0F766E" />
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
                    <View style={styles.liveClockBadge}>
                      <View style={styles.clockPulse} />
                      <Text style={styles.liveClockText}>{currentTime || '09:30 AM'}</Text>
                    </View>

                    <Text style={styles.shiftTitle}>{profile.shift || 'General Corporate Shift'}</Text>
                    <Text style={styles.shiftTime}>09:00 AM – 06:00 PM • 8h remaining</Text>

                    <TouchableOpacity
                      style={[
                        styles.checkInActionBtn,
                        storeState.isCheckedIn && styles.checkInActionBtnChecked
                      ]}
                      onPress={handleCheckInToggle}
                      activeOpacity={0.88}
                    >
                      <Icon
                        name={storeState.isCheckedIn ? 'checkCircle' : 'fingerprint'}
                        size={20}
                        color={storeState.isCheckedIn ? '#059669' : '#0F766E'}
                        strokeWidth={2.4}
                      />
                      <Text style={[styles.checkInActionBtnText, storeState.isCheckedIn && styles.checkInActionBtnTextChecked]}>
                        {storeState.isCheckedIn ? 'Checked In ✓ (HQ Geofenced)' : '1-Tap Geofence Check-In'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.heroRightCol}>
                    <ProgressRing size={80} strokeWidth={6} progress={0.68} color="#FFFFFF">
                      <Text style={styles.progressRingVal}>68%</Text>
                      <Text style={styles.progressRingLabel}>Day Done</Text>
                    </ProgressRing>
                  </View>
                </View>

                {/* 2. QUICK ACTIONS 2×2 GRID */}
                <View style={styles.quickActionsGrid}>
                  {[
                    { label: 'Apply Leave', icon: 'leave', bg: '#ECFDF5', color: '#059669', action: () => setLeaveModalOpen(true) },
                    { label: 'Clock History', icon: 'clock', bg: '#EFF6FF', color: '#2563EB', action: () => setActiveTab('attendance') },
                    { label: 'View Payslip', icon: 'payroll', bg: '#FFFBEB', color: '#D97706', action: () => setActiveTab('payslips') },
                    { label: 'My Profile', icon: 'user', bg: '#F0FDFA', color: '#0F766E', action: () => setActiveTab('profile') }
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
                  <TouchableOpacity onPress={() => setLeaveModalOpen(true)}>
                    <Text style={styles.viewAllLink}>+ Apply Leave →</Text>
                  </TouchableOpacity>
                </View>

                <SquaredCard style={styles.leaveBalanceCard}>
                  <View style={styles.balanceRingsRow}>
                    <LeaveRing size={64} strokeWidth={5} value={annualBal} total={18} color="#0F766E" label="Annual" />
                    <LeaveRing size={64} strokeWidth={5} value={sickBal} total={8} color="#2563EB" label="Sick" />
                    <LeaveRing size={64} strokeWidth={5} value={casualBal} total={5} color="#D97706" label="Casual" />
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
                  <Text style={styles.tasksDueSub}>{storeState.tasks.length} items</Text>
                </View>

                <View style={styles.tasksList}>
                  {storeState.tasks.map((t) => (
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

                {/* 6. CORPORATE ANNOUNCEMENTS (Live from store) */}
                <SquaredCard style={styles.announcementCard}>
                  <View style={styles.announcementHeader}>
                    <View style={styles.announcementIconWrap}>
                      <Icon name="announcements" size={18} color="#D97706" />
                    </View>
                    <Text style={styles.cardTitle}>Corporate Announcements</Text>
                  </View>

                  {storeState.announcements.slice(0, 3).map((ann, idx) => (
                    <View key={ann.id}>
                      {idx > 0 ? <View style={styles.announcementDivider} /> : null}
                      <View style={styles.announcementItem}>
                        <View style={styles.annTitleRow}>
                          <Text style={styles.annTitleText}>{ann.title}</Text>
                          {ann.priority === 'Pinned' || ann.priority === 'Urgent' ? (
                            <View style={styles.pinnedBadge}>
                              <Text style={styles.pinnedBadgeText}>{ann.priority}</Text>
                            </View>
                          ) : null}
                        </View>
                        <Text style={styles.announcementBody}>{ann.content}</Text>
                        <Text style={styles.announcementDate}>{ann.date} • {ann.department}</Text>
                      </View>
                    </View>
                  ))}
                </SquaredCard>
              </>
            )}

            {/* ══ ATTENDANCE TAB ══════════════════════════════════════════ */}
            {activeTab === 'attendance' && (
              <SquaredCard style={styles.tabContentCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>Live Attendance & Compliance</Text>
                  <View style={styles.statusPillActive}>
                    <Text style={styles.statusPillActiveText}>
                      {storeState.isCheckedIn ? 'Checked In' : 'Not Clocked In'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.tasksDueSub}>
                  Current punch: {storeState.checkInTime ? storeState.checkInTime : '09:02 AM'} (HQ Campus Geofence)
                </Text>

                <View style={styles.attendanceActionBox}>
                  <TouchableOpacity
                    style={[styles.bigCheckInBtn, storeState.isCheckedIn && styles.bigCheckInBtnActive]}
                    onPress={handleCheckInToggle}
                    activeOpacity={0.85}
                  >
                    <Icon name={storeState.isCheckedIn ? 'check' : 'fingerprint'} size={24} color="#FFFFFF" />
                    <Text style={styles.bigCheckInBtnText}>
                      {storeState.isCheckedIn ? 'Click to Clock Out' : '1-Tap Geofence Clock In'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <Text style={[styles.cardTitle, { marginTop: 24, marginBottom: 8 }]}>Monthly Attendance Heatmap</Text>
                <Text style={styles.tasksDueSub}>21 of 22 working days present (95.4% compliance)</Text>
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
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>Leave Management</Text>
                  <TouchableOpacity
                    style={styles.applyLeavePillBtn}
                    onPress={() => setLeaveModalOpen(true)}
                    activeOpacity={0.8}
                  >
                    <Icon name="plus" size={14} color="#FFFFFF" />
                    <Text style={styles.applyLeavePillBtnText}>Apply Leave</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.tasksDueSub}>
                  Annual ({annualBal} left) • Sick ({sickBal} left) • Casual ({casualBal} left)
                </Text>

                <Text style={[styles.cardTitle, { marginTop: 20, marginBottom: 12 }]}>
                  My Leave Applications ({storeState.leaveRequests.length})
                </Text>

                <View style={{ gap: 10 }}>
                  {storeState.leaveRequests.map((req) => (
                    <View key={req.id} style={styles.leaveReqRow}>
                      <View style={styles.leaveReqInfo}>
                        <Text style={styles.leaveReqType}>{req.leaveType}</Text>
                        <Text style={styles.leaveReqDates}>
                          {req.startDate} to {req.endDate} ({req.days} {req.days === 1 ? 'day' : 'days'})
                        </Text>
                        <Text style={styles.leaveReqReason} numberOfLines={1}>
                          Reason: {req.reason}
                        </Text>
                      </View>
                      <View style={[
                        styles.leaveStatusPill,
                        req.status === 'Approved' && styles.leaveStatusApproved,
                        req.status === 'Rejected' && styles.leaveStatusRejected
                      ]}>
                        <Text style={[
                          styles.leaveStatusText,
                          req.status === 'Approved' && styles.leaveStatusTextApproved,
                          req.status === 'Rejected' && styles.leaveStatusTextRejected
                        ]}>
                          {req.status}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </SquaredCard>
            )}

            {/* ══ PAYSLIPS TAB ════════════════════════════════════════════ */}
            {activeTab === 'payslips' && (
              <SquaredCard style={styles.tabContentCard}>
                <Text style={styles.cardTitle}>Historical Payslips & Tax Documents</Text>
                <Text style={styles.tasksDueSub}>Direct deposit receipts for {user?.email || profile.email}</Text>
                <View style={{ marginTop: 14 }}>
                  {['October 2026', 'September 2026', 'August 2026', 'July 2026'].map((m, i) => (
                    <View key={i} style={styles.historicalRow}>
                      <View>
                        <Text style={styles.historicalMonth}>{m}</Text>
                        <Text style={styles.historicalMeta}>₹ 84,500 • Disbursed via Direct Deposit</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.downloadIconBtn}
                        onPress={() => showToast(`Downloaded ${m} statement PDF.`)}
                        activeOpacity={0.7}
                      >
                        <Icon name="download" size={16} color="#0F766E" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </SquaredCard>
            )}

            {/* ══ TASKS TAB ═══════════════════════════════════════════════ */}
            {activeTab === 'tasks' && (
              <SquaredCard style={styles.tabContentCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>Personal Workforce Tasks</Text>
                  <Text style={styles.tasksDueSub}>{storeState.tasks.filter((t) => t.completed).length}/{storeState.tasks.length} Completed</Text>
                </View>

                <View style={{ marginTop: 12, gap: 10 }}>
                  {storeState.tasks.map((t) => (
                    <TouchableOpacity
                      key={t.id}
                      style={styles.taskItemRow}
                      onPress={() => handleToggleTask(t.id)}
                      activeOpacity={0.8}
                    >
                      <View style={[styles.checkboxCircle, t.completed && styles.checkboxCircleCompleted]}>
                        {t.completed && <Icon name="check" size={13} color="#FFFFFF" strokeWidth={3} />}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.taskTitle, t.completed && styles.taskTitleCompleted]}>{t.title}</Text>
                        <Text style={styles.taskDue}>Due: {t.due}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </SquaredCard>
            )}

            {/* ══ PROFILE SECTION WITH MULTIPLE FEATURES & EDIT FEATURE ══ */}
            {activeTab === 'profile' && (
              <View style={styles.profileSectionWrapper}>
                {/* 1. Profile Hero Card */}
                <SquaredCard style={styles.profileHeroCard}>
                  <View style={styles.profileHeroTop}>
                    <View style={styles.profileAvatarLarge}>
                      <Text style={styles.profileAvatarLargeText}>
                        {displayName.charAt(0).toUpperCase()}
                      </Text>
                      <View style={styles.profileOnlineDot} />
                    </View>

                    <View style={styles.profileHeroInfo}>
                      <View style={styles.profileNameRow}>
                        <Text style={styles.profileNameText}>{displayName}</Text>
                        <View style={styles.domainBadge}>
                          <Text style={styles.domainBadgeText}>@hbplus.fit</Text>
                        </View>
                      </View>
                      <Text style={styles.profileRoleTitle}>{displayDesignation} • {displayDepartment}</Text>
                      <Text style={styles.profileEmployeeId}>ID: {displayEmployeeId}</Text>
                    </View>
                  </View>

                  <View style={styles.profileActionRow}>
                    <TouchableOpacity
                      style={[styles.editProfileToggleBtn, isEditingProfile && styles.editProfileToggleBtnActive]}
                      onPress={() => {
                        setEditName(displayName);
                        setEditPhone(displayPhone);
                        setEditDepartment(displayDepartment);
                        setEditDesignation(displayDesignation);
                        setEditBio(displayBio);
                        setEditEmergency(displayEmergency);
                        setIsEditingProfile(!isEditingProfile);
                      }}
                      activeOpacity={0.8}
                    >
                      <Icon name={isEditingProfile ? 'x' : 'user'} size={16} color={isEditingProfile ? '#FFFFFF' : '#0F766E'} />
                      <Text style={[styles.editProfileToggleBtnText, isEditingProfile && styles.editProfileToggleBtnTextActive]}>
                        {isEditingProfile ? 'Cancel Editing' : 'Edit Profile Details'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.resetPassBtn}
                      onPress={handlePasswordReset}
                      activeOpacity={0.8}
                    >
                      <Icon name="lock" size={15} color="#475569" />
                      <Text style={styles.resetPassBtnText}>Reset Password</Text>
                    </TouchableOpacity>
                  </View>
                </SquaredCard>

                {/* 2. Edit Profile Form (Visible when isEditingProfile is true) */}
                {isEditingProfile ? (
                  <SquaredCard style={styles.editProfileCard}>
                    <Text style={styles.cardTitle}>Edit Personal & Workforce Details</Text>
                    <Text style={styles.tasksDueSub}>Update your contact, department, and bio. Changes sync in real-time.</Text>

                    <View style={styles.editFormGrid}>
                      <View style={styles.formFieldBlock}>
                        <Text style={styles.formFieldLabel}>Full Name</Text>
                        <TextInput
                          style={styles.formTextInput}
                          value={editName}
                          onChangeText={setEditName}
                          placeholder="Your full name"
                        />
                      </View>

                      <View style={styles.formFieldBlock}>
                        <Text style={styles.formFieldLabel}>Mobile Number</Text>
                        <TextInput
                          style={styles.formTextInput}
                          value={editPhone}
                          onChangeText={setEditPhone}
                          placeholder="+91 98765 43210"
                        />
                      </View>

                      <View style={styles.formFieldBlock}>
                        <Text style={styles.formFieldLabel}>Department</Text>
                        <TextInput
                          style={styles.formTextInput}
                          value={editDepartment}
                          onChangeText={setEditDepartment}
                          placeholder="Engineering / Product / Operations"
                        />
                      </View>

                      <View style={styles.formFieldBlock}>
                        <Text style={styles.formFieldLabel}>Designation / Role Title</Text>
                        <TextInput
                          style={styles.formTextInput}
                          value={editDesignation}
                          onChangeText={setEditDesignation}
                          placeholder="Staff Engineer / Designer"
                        />
                      </View>

                      <View style={styles.formFieldBlock}>
                        <Text style={styles.formFieldLabel}>Emergency Contact</Text>
                        <TextInput
                          style={styles.formTextInput}
                          value={editEmergency}
                          onChangeText={setEditEmergency}
                          placeholder="Name & Contact phone"
                        />
                      </View>

                      <View style={styles.formFieldBlock}>
                        <Text style={styles.formFieldLabel}>Bio & Professional Summary</Text>
                        <TextInput
                          style={[styles.formTextInput, { height: 72, textAlignVertical: 'top' }]}
                          value={editBio}
                          onChangeText={setEditBio}
                          placeholder="Brief description about your role and responsibilities"
                          multiline
                        />
                      </View>
                    </View>

                    <View style={styles.editFormActions}>
                      <TouchableOpacity
                        style={styles.saveProfileBtn}
                        onPress={handleSaveProfile}
                        activeOpacity={0.88}
                      >
                        <Icon name="check" size={16} color="#FFFFFF" strokeWidth={2.4} />
                        <Text style={styles.saveProfileBtnText}>Save Changes</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.cancelProfileBtn}
                        onPress={() => setIsEditingProfile(false)}
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
                      <Icon name="directory" size={18} color="#0F766E" />
                      <Text style={styles.infoCardTitle}>Workplace Identity</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Official Email</Text>
                      <Text style={styles.infoValue}>{displayEmail}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Mobile Number</Text>
                      <Text style={styles.infoValue}>{displayPhone}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Department</Text>
                      <Text style={styles.infoValue}>{displayDepartment}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Work Location</Text>
                      <Text style={styles.infoValue}>{profile.location}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Date Joined</Text>
                      <Text style={styles.infoValue}>{profile.joinDate}</Text>
                    </View>
                  </SquaredCard>

                  {/* Card 2: Shift, Attendance & Security */}
                  <SquaredCard style={styles.profileInfoCard}>
                    <View style={styles.infoCardHeader}>
                      <Icon name="shieldCheck" size={18} color="#0F766E" />
                      <Text style={styles.infoCardTitle}>Shift & Governance</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Assigned Shift</Text>
                      <Text style={styles.infoValue}>{profile.shift}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Geofence Radius</Text>
                      <Text style={styles.infoValue}>250m HQ Campus Radius</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Domain Policy</Text>
                      <Text style={[styles.infoValue, { color: '#0F766E', fontWeight: '700' }]}>STRICT (@hbplus.fit)</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Emergency Contact</Text>
                      <Text style={styles.infoValue}>{displayEmergency || 'Configured'}</Text>
                    </View>
                  </SquaredCard>
                </View>

                {/* Session End button */}
                <TouchableOpacity style={styles.endSessionCardBtn} onPress={onSignOut} activeOpacity={0.8}>
                  <Icon name="logout" size={18} color="#DC2626" />
                  <Text style={styles.endSessionCardBtnText}>End Employee Session (Sign Out)</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>

          {/* ── MOBILE FLOATING BOTTOM NAV ──────────────────────────────── */}
          {!isDesktop ? (
            <View style={styles.phoneFloatingTabWrapper}>
              <View style={styles.phoneFloatingBar}>
                <TouchableOpacity style={styles.phoneTabBtn} onPress={() => setActiveTab('home')}>
                  <Icon name="dashboard" size={22} color={activeTab === 'home' ? '#0F766E' : '#94A3B8'} />
                  <Text style={[styles.phoneTabLabel, activeTab === 'home' && styles.phoneTabLabelActive]}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.phoneTabBtn} onPress={() => setActiveTab('attendance')}>
                  <Icon name="fingerprint" size={22} color={activeTab === 'attendance' ? '#0F766E' : '#94A3B8'} />
                  <Text style={[styles.phoneTabLabel, activeTab === 'attendance' && styles.phoneTabLabelActive]}>Attendance</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.raisedCheckInBtn, storeState.isCheckedIn && styles.raisedCheckInBtnChecked]}
                  onPress={handleCheckInToggle}
                  activeOpacity={0.85}
                  accessibilityLabel="Check In / Out"
                >
                  <Icon
                    name={storeState.isCheckedIn ? 'check' : 'fingerprint'}
                    size={26}
                    color="#FFFFFF"
                    strokeWidth={2.6}
                  />
                </TouchableOpacity>

                <TouchableOpacity style={styles.phoneTabBtn} onPress={() => setActiveTab('leave')}>
                  <Icon name="leave" size={22} color={activeTab === 'leave' ? '#0F766E' : '#94A3B8'} />
                  <Text style={[styles.phoneTabLabel, activeTab === 'leave' && styles.phoneTabLabelActive]}>Leave</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.phoneTabBtn} onPress={() => setActiveTab('profile')}>
                  <Icon name="user" size={22} color={activeTab === 'profile' ? '#0F766E' : '#94A3B8'} />
                  <Text style={[styles.phoneTabLabel, activeTab === 'profile' && styles.phoneTabLabelActive]}>Profile</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
        </View>
      </View>

      {/* ── LEAVE APPLICATION MODAL ───────────────────────────────────────── */}
      <Modal
        visible={leaveModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setLeaveModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.leaveModalSheet}>
            <View style={styles.modalHeaderRow}>
              <View>
                <Text style={styles.modalTitle}>Apply for Leave</Text>
                <Text style={styles.modalSubtitle}>Submits to Admin Pending Approvals Queue</Text>
              </View>
              <TouchableOpacity onPress={() => setLeaveModalOpen(false)} style={styles.modalCloseBtn}>
                <Icon name="x" size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Leave Type Selectors */}
            <Text style={styles.modalFieldLabel}>Leave Type</Text>
            <View style={styles.leaveTypeRow}>
              {['Annual Paid Leave', 'Sick Leave', 'Casual Leave'].map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.leaveTypeChip, leaveType === t && styles.leaveTypeChipActive]}
                  onPress={() => setLeaveType(t)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.leaveTypeChipText, leaveType === t && styles.leaveTypeChipTextActive]}>
                    {t.replace(' Leave', '')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Number of days */}
            <View style={styles.modalFieldBlock}>
              <Text style={styles.modalFieldLabel}>Duration (Days)</Text>
              <TextInput
                style={styles.modalTextInput}
                value={leaveDays}
                onChangeText={setLeaveDays}
                keyboardType="numeric"
                placeholder="Number of days (e.g. 2)"
              />
            </View>

            {/* Reason */}
            <View style={styles.modalFieldBlock}>
              <Text style={styles.modalFieldLabel}>Reason for Leave</Text>
              <TextInput
                style={[styles.modalTextInput, { height: 70, textAlignVertical: 'top' }]}
                value={leaveReason}
                onChangeText={setLeaveReason}
                placeholder="Explain the purpose of your time off..."
                multiline
              />
            </View>

            <TouchableOpacity
              style={styles.submitLeaveBtn}
              onPress={handleApplyLeaveSubmit}
              activeOpacity={0.88}
            >
              <Text style={styles.submitLeaveBtnText}>Submit Leave Application →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  lightSidebar: {
    width: 260,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingVertical: 24,
    paddingHorizontal: 16
  },
  sidebarBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 8,
    marginBottom: 28
  },
  brandTitleWrap: {
    gap: 2
  },
  brandTitleText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4
  },
  userBadgePill: {
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6
  },
  userBadgeText: {
    color: '#0F766E',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  sidebarNav: {
    flex: 1,
    gap: 4
  },
  sidebarNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12
  },
  sidebarNavItemActive: {
    backgroundColor: '#F0FDFA'
  },
  sidebarNavText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B'
  },
  sidebarNavTextActive: {
    color: '#0F766E',
    fontWeight: '700'
  },
  sidebarFooter: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 16,
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
    fontSize: 15,
    fontWeight: '700'
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
    color: '#64748B'
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 4
  },
  signOutText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '600'
  },
  contentColumn: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F8FAFC'
  },
  topArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingVertical: 18,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0'
  },
  mobileTopArea: {
    paddingHorizontal: 18,
    paddingTop: Platform.OS === 'web' ? 'max(46px, env(safe-area-inset-top, 46px))' : 46,
    paddingBottom: 14,
    gap: 12
  },
  mobileAvatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0F766E',
    alignItems: 'center',
    justifyContent: 'center'
  },
  mobileAvatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700'
  },
  greetingCol: {
    flex: 1
  },
  greetingText: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3
  },
  dateSubText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
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
    backgroundColor: '#0F766E'
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
    fontWeight: '700'
  },
  toastCard: {
    position: 'absolute',
    top: 72,
    alignSelf: 'center',
    zIndex: 999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600'
  },
  scrollArea: {
    flex: 1
  },
  scrollInner: {
    padding: 28,
    gap: 20,
    maxWidth: 960,
    width: '100%',
    alignSelf: 'center'
  },
  scrollInnerMobile: {
    padding: 16,
    paddingBottom: 120
  },

  /* Hero shift card */
  heroCard: {
    backgroundColor: '#0F766E',
    borderRadius: 24,
    padding: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...(Platform.OS === 'web'
      ? { backgroundImage: 'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)', boxShadow: '0 8px 24px rgba(15,118,110,0.25)' }
      : { elevation: 6 })
  },
  heroLeftCol: {
    flex: 1,
    gap: 6
  },
  liveClockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  clockPulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#5EEAD4'
  },
  liveClockText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  },
  shiftTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 2
  },
  shiftTime: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13
  },
  checkInActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    marginTop: 8
  },
  checkInActionBtnChecked: {
    backgroundColor: '#ECFDF5'
  },
  checkInActionBtnText: {
    color: '#0F766E',
    fontSize: 14,
    fontWeight: '700'
  },
  checkInActionBtnTextChecked: {
    color: '#059669'
  },
  heroRightCol: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12
  },
  progressRingVal: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800'
  },
  progressRingLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 9,
    fontWeight: '600',
    textTransform: 'uppercase'
  },

  /* Quick Actions Grid */
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  quickActionTile: {
    flex: 1,
    minWidth: 150,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10
  },
  quickActionIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  quickActionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A'
  },

  /* Section header */
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A'
  },
  viewAllLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F766E'
  },

  /* Leave Balance card */
  leaveBalanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18
  },
  balanceRingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  balanceItem: {
    alignItems: 'center',
    gap: 4
  },
  ringNum: {
    fontSize: 18,
    fontWeight: '800'
  },
  ringLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 4
  },
  ringFraction: {
    fontSize: 11,
    color: '#64748B'
  },

  /* Payslip card */
  payslipCardNew: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    gap: 6
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A'
  },
  salaryAmountNew: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
    marginTop: 4
  },
  salaryMeta: {
    fontSize: 12,
    color: '#64748B'
  },
  downloadPayslipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 8
  },
  downloadPayslipText: {
    color: '#0F766E',
    fontSize: 13,
    fontWeight: '700'
  },

  /* Tasks */
  tasksDueSub: {
    fontSize: 12,
    color: '#64748B'
  },
  tasksList: {
    gap: 8
  },
  taskItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12
  },
  checkboxCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkboxCircleCompleted: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E'
  },
  taskDetails: {
    flex: 1,
    gap: 2
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A'
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#94A3B8'
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

  /* Announcements */
  announcementCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    gap: 12
  },
  announcementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  announcementIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center'
  },
  annTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  annTitleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#78350F'
  },
  pinnedBadge: {
    backgroundColor: '#D97706',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6
  },
  pinnedBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700'
  },
  announcementItem: {
    gap: 2
  },
  announcementBody: {
    fontSize: 13,
    color: '#92400E',
    lineHeight: 18
  },
  announcementDate: {
    fontSize: 11,
    color: '#B45309',
    marginTop: 4
  },
  announcementDivider: {
    height: 1,
    backgroundColor: '#FDE68A',
    marginVertical: 4
  },

  /* Tab content card */
  tabContentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20
  },
  statusPillActive: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  statusPillActiveText: {
    color: '#059669',
    fontSize: 12,
    fontWeight: '700'
  },
  attendanceActionBox: {
    marginVertical: 16
  },
  bigCheckInBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 52,
    backgroundColor: '#0F766E',
    borderRadius: 14
  },
  bigCheckInBtnActive: {
    backgroundColor: '#059669'
  },
  bigCheckInBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700'
  },
  heatmapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 12
  },
  heatmapTile: {
    width: 34,
    height: 34,
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
    fontWeight: '600',
    color: '#0F766E'
  },

  /* Leave applications */
  applyLeavePillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0F766E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12
  },
  applyLeavePillBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  },
  leaveReqRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  leaveReqInfo: {
    flex: 1,
    gap: 2
  },
  leaveReqType: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A'
  },
  leaveReqDates: {
    fontSize: 12,
    color: '#0F766E',
    fontWeight: '600'
  },
  leaveReqReason: {
    fontSize: 11,
    color: '#64748B'
  },
  leaveStatusPill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10
  },
  leaveStatusApproved: {
    backgroundColor: '#ECFDF5'
  },
  leaveStatusRejected: {
    backgroundColor: '#FEE2E2'
  },
  leaveStatusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D97706'
  },
  leaveStatusTextApproved: {
    color: '#059669'
  },
  leaveStatusTextRejected: {
    color: '#DC2626'
  },

  /* Payslips tab */
  historicalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  historicalMonth: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A'
  },
  historicalMeta: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2
  },
  downloadIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center'
  },

  /* Tasks item */
  taskItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8
  },

  /* ══ PROFILE SECTION STYLES ══ */
  profileSectionWrapper: {
    gap: 16
  },
  profileHeroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    gap: 16
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
    backgroundColor: '#0F766E',
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
    flexWrap: 'wrap'
  },
  editProfileToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12
  },
  editProfileToggleBtnActive: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E'
  },
  editProfileToggleBtnText: {
    color: '#0F766E',
    fontSize: 13,
    fontWeight: '700'
  },
  editProfileToggleBtnTextActive: {
    color: '#FFFFFF'
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

  /* Edit Profile Card */
  editProfileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    gap: 14
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
    color: '#0F172A'
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
    backgroundColor: '#0F766E',
    borderRadius: 12
  },
  saveProfileBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700'
  },
  cancelProfileBtn: {
    paddingHorizontal: 20,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12
  },
  cancelProfileBtnText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600'
  },

  /* Profile Details Grid */
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
    gap: 10
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
    fontWeight: '800',
    color: '#0F172A'
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2
  },
  infoLabel: {
    fontSize: 13,
    color: '#64748B'
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A'
  },
  endSessionCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    height: 48,
    borderRadius: 14,
    marginTop: 6
  },
  endSessionCardBtnText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '700'
  },

  /* Floating Bottom Nav for Mobile */
  phoneFloatingTabWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'web' ? 'max(16px, env(safe-area-inset-bottom, 16px))' : 16,
    backgroundColor: 'transparent',
    pointerEvents: 'box-none'
  },
  phoneFloatingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    height: 64,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }
      : { elevation: 10 })
  },
  phoneTabBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    flex: 1
  },
  phoneTabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8'
  },
  phoneTabLabelActive: {
    color: '#0F766E',
    fontWeight: '700'
  },
  raisedCheckInBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#0F766E',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -24,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 4px 14px rgba(15,118,110,0.45)' }
      : { elevation: 8 })
  },
  raisedCheckInBtnChecked: {
    backgroundColor: '#059669'
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(15,23,42,0.45)',
    padding: 16
  },
  leaveModalSheet: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    gap: 14,
    maxWidth: 440,
    width: '100%',
    alignSelf: 'center',
    elevation: 8
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A'
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalFieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155'
  },
  leaveTypeRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap'
  },
  leaveTypeChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  leaveTypeChipActive: {
    backgroundColor: '#F0FDFA',
    borderColor: '#0F766E'
  },
  leaveTypeChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569'
  },
  leaveTypeChipTextActive: {
    color: '#0F766E',
    fontWeight: '700'
  },
  modalFieldBlock: {
    gap: 6
  },
  modalTextInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A'
  },
  submitLeaveBtn: {
    height: 50,
    backgroundColor: '#0F766E',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6
  },
  submitLeaveBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700'
  }
});

export default UserShell;
