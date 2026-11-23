import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  useWindowDimensions,
  Animated
} from 'react-native';
import { useAuth } from '../../hooks/useAuth.js';
import { RoleThemeProvider, useRoleTheme } from '../../theme/roleThemes.js';
import { CARD_RADIUS } from '../../theme/shape.js';
import HBLogo from '../brand/HBLogo.jsx';
import Icon from '../ui/Icon.jsx';
import SquaredCard from '../ui/SquaredCard.jsx';
import SquaredButton from '../ui/SquaredButton.jsx';

function UserShellContent({ onSignOut }) {
  const { user, profile } = useAuth();
  const theme = useRoleTheme();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'attendance' | 'leave' | 'payslips' | 'tasks' | 'profile'
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

  return (
    <View style={styles.root}>
      {/* 4px Amber Identity Strip across the top (Section 3) */}
      <View style={[styles.identityStrip, { backgroundColor: theme.identityStrip }]} />

      <View style={styles.mainLayout}>
        {/* DESKTOP: Light Sidebar (Translucent White, 240px, Airy) */}
        {isDesktop ? (
          <View style={styles.lightSidebar}>
            {/* Brand Header */}
            <View style={styles.sidebarBrand}>
              <HBLogo size={36} />
              <View style={styles.brandTitleWrap}>
                <Text style={styles.brandTitleText}>HBPlus</Text>
                <View style={styles.userBadgePill}>
                  <Text style={styles.userBadgeText}>Workspace</Text>
                </View>
              </View>
            </View>

            {/* Navigation Links */}
            <View style={styles.sidebarNav}>
              {userNavItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.sidebarNavItem,
                      isActive && styles.sidebarNavItemActive
                    ]}
                    onPress={() => setActiveTab(item.id)}
                    activeOpacity={0.7}
                  >
                    <Icon
                      name={item.icon}
                      size={20}
                      color={isActive ? '#00B386' : '#64748B'}
                      strokeWidth={isActive ? 2.4 : 1.8}
                    />
                    <Text
                      style={[
                        styles.sidebarNavText,
                        isActive && styles.sidebarNavTextActive
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Bottom Profile & Sign Out */}
            <View style={styles.sidebarFooter}>
              <View style={styles.userBrief}>
                <View style={styles.userAvatar}>
                  <Text style={styles.userAvatarText}>
                    {firstName.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.userInfoCol}>
                  <Text style={styles.userNameText} numberOfLines={1}>
                    {displayName}
                  </Text>
                  <Text style={styles.userEmailText} numberOfLines={1}>
                    {user?.email}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.signOutBtn}
                onPress={onSignOut}
                activeOpacity={0.7}
              >
                <Icon name="logout" size={16} color="#DC2626" />
                <Text style={styles.signOutText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        {/* Content Column (max 1100px on desktop) */}
        <View style={styles.contentColumn}>
          {/* Top Bar: Greeting Header + Avatar + Notification Bell */}
          <View style={styles.topArea}>
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

              <View style={styles.topAvatar}>
                <Text style={styles.topAvatarText}>
                  {firstName.charAt(0).toUpperCase()}
                </Text>
              </View>

              {!isDesktop ? (
                <TouchableOpacity onPress={onSignOut} style={styles.bellBtn}>
                  <Icon name="logout" size={18} color="#EF4444" />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>

          {/* Toast Notification */}
          {toastMessage ? (
            <View style={styles.toastCard}>
              <Text style={styles.toastText}>{toastMessage}</Text>
            </View>
          ) : null}

          {/* Main Scroll Content */}
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollInner}
            showsVerticalScrollIndicator={false}
          >
            {activeTab === 'home' && (
              <>
                {/* 1. Hero "Today" Card (Emerald Gradient, Live Clock, Shift Time, 1-Tap Check-In) */}
                <View style={styles.heroCard}>
                  <View style={styles.heroLeftCol}>
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
                        color={isCheckedIn ? '#00B386' : '#0F172A'}
                        strokeWidth={2.4}
                      />
                      <Text
                        style={[
                          styles.checkInActionBtnText,
                          isCheckedIn && styles.checkInActionBtnTextChecked
                        ]}
                      >
                        {isCheckedIn ? 'Checked In at 09:14 AM' : '1-Tap Geofence Check-In'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.heroRightCol}>
                    <View style={styles.progressRingCircle}>
                      <Text style={styles.progressRingVal}>68%</Text>
                      <Text style={styles.progressRingLabel}>Day Done</Text>
                    </View>
                  </View>
                </View>

                {/* 2. Quick Actions as Large Icon Tiles (Comfortable 60px rows) */}
                <View style={styles.quickActionsGrid}>
                  {[
                    { label: 'Apply Leave', icon: 'leave', bg: '#EFF6FF', color: '#2563EB', action: () => setActiveTab('leave') },
                    { label: 'Clock History', icon: 'clock', bg: '#ECFDF5', color: '#059669', action: () => setActiveTab('attendance') },
                    { label: 'View Payslip', icon: 'payroll', bg: '#FFF7ED', color: '#EA580C', action: () => setActiveTab('payslips') },
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
                    </TouchableOpacity>
                  ))}
                </View>

                {/* 3. Leave Balances & Attendance Heatmap Row */}
                <View style={styles.twoColRow}>
                  {/* Leave Balances Card */}
                  <SquaredCard style={styles.leaveCard}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.cardTitle}>My Leave Balances</Text>
                      <TouchableOpacity onPress={() => setActiveTab('leave')}>
                        <Text style={styles.viewAllLink}>Apply</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.balanceRingsRow}>
                      <View style={styles.balanceItem}>
                        <View style={[styles.ringCircle, { borderColor: '#00B386' }]}>
                          <Text style={styles.ringNum}>14</Text>
                        </View>
                        <Text style={styles.ringLabel}>Annual (of 18)</Text>
                      </View>

                      <View style={styles.balanceItem}>
                        <View style={[styles.ringCircle, { borderColor: '#FFB020' }]}>
                          <Text style={styles.ringNum}>6</Text>
                        </View>
                        <Text style={styles.ringLabel}>Sick (of 8)</Text>
                      </View>

                      <View style={styles.balanceItem}>
                        <View style={[styles.ringCircle, { borderColor: '#3B82F6' }]}>
                          <Text style={styles.ringNum}>4</Text>
                        </View>
                        <Text style={styles.ringLabel}>Casual (of 5)</Text>
                      </View>
                    </View>
                  </SquaredCard>

                  {/* Latest Payslip Card */}
                  <SquaredCard style={styles.payslipCard}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.cardTitle}>Latest Net Salary</Text>
                      <TouchableOpacity onPress={() => setShowSalary(!showSalary)}>
                        <Icon name={showSalary ? 'eyeOff' : 'eye'} size={18} color="#64748B" />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.salaryAmountRow}>
                      <Text style={styles.salaryCurrency}>$</Text>
                      <Text style={styles.salaryAmount}>
                        {showSalary ? '8,450.00' : '••••••••'}
                      </Text>
                    </View>
                    <Text style={styles.salaryMeta}>Direct Deposit • Nov 15, 2026 (Processed)</Text>

                    <TouchableOpacity
                      style={styles.downloadPayslipBtn}
                      onPress={() => showToast('Payslip PDF downloaded to your device.')}
                      activeOpacity={0.8}
                    >
                      <Icon name="download" size={15} color="#00775B" />
                      <Text style={styles.downloadPayslipText}>Download PDF</Text>
                    </TouchableOpacity>
                  </SquaredCard>
                </View>

                {/* 4. My Tasks Due Soon with Check Ticks */}
                <SquaredCard style={styles.tasksCard}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Pending Tasks</Text>
                    <Text style={styles.tasksDueSub}>3 items requiring your attention</Text>
                  </View>

                  <View style={styles.tasksList}>
                    {tasks.map((t) => (
                      <TouchableOpacity
                        key={t.id}
                        style={styles.taskItemRow}
                        onPress={() => handleToggleTask(t.id)}
                        activeOpacity={0.8}
                      >
                        <View
                          style={[
                            styles.checkboxCircle,
                            t.completed && styles.checkboxCircleCompleted
                          ]}
                        >
                          {t.completed ? (
                            <Icon name="check" size={13} color="#FFFFFF" strokeWidth={3} />
                          ) : null}
                        </View>
                        <View style={styles.taskDetails}>
                          <Text
                            style={[
                              styles.taskTitle,
                              t.completed && styles.taskTitleCompleted
                            ]}
                          >
                            {t.title}
                          </Text>
                          <Text style={styles.taskDue}>{t.due}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </SquaredCard>

                {/* 5. Company Announcements & Celebrations */}
                <SquaredCard style={styles.announcementCard}>
                  <View style={styles.announcementHeader}>
                    <Icon name="announcements" size={18} color="#FFB020" />
                    <Text style={styles.cardTitle}>Corporate Announcements</Text>
                  </View>
                  <Text style={styles.announcementBody}>
                    🌟 Annual All-Hands Summit scheduled for Dec 12. New flexible wellness stipends take effect starting next payroll cycle.
                  </Text>
                </SquaredCard>
              </>
            )}

            {activeTab === 'attendance' && (
              <SquaredCard style={styles.tasksCard}>
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

            {activeTab === 'leave' && (
              <SquaredCard style={styles.tasksCard}>
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

            {activeTab === 'payslips' && (
              <SquaredCard style={styles.payslipCard}>
                <Text style={styles.cardTitle}>Historical Payslips</Text>
                <Text style={styles.tasksDueSub}>Access payroll statements and tax documents.</Text>
                {['October 2026', 'September 2026', 'August 2026'].map((m, i) => (
                  <View key={i} style={styles.historicalRow}>
                    <Text style={styles.historicalMonth}>{m}</Text>
                    <TouchableOpacity
                      onPress={() => showToast(`Downloading ${m} statement`)}
                    >
                      <Icon name="download" size={16} color="#00B386" />
                    </TouchableOpacity>
                  </View>
                ))}
              </SquaredCard>
            )}

            {activeTab === 'tasks' && (
              <SquaredCard style={styles.tasksCard}>
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

            {activeTab === 'profile' && (
              <SquaredCard style={styles.tasksCard}>
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

          {/* PHONES: Floating Bottom Tab Bar with Raised Round Check-In Button in Centre (Section 5.2) */}
          {!isDesktop ? (
            <View style={styles.phoneFloatingTabWrapper}>
              <View style={styles.phoneFloatingBar}>
                <TouchableOpacity
                  style={styles.phoneTabBtn}
                  onPress={() => setActiveTab('home')}
                >
                  <Icon name="dashboard" size={20} color={activeTab === 'home' ? '#00B386' : '#64748B'} />
                  <Text style={[styles.phoneTabLabel, activeTab === 'home' && styles.phoneTabLabelActive]}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.phoneTabBtn}
                  onPress={() => setActiveTab('attendance')}
                >
                  <Icon name="fingerprint" size={20} color={activeTab === 'attendance' ? '#00B386' : '#64748B'} />
                  <Text style={[styles.phoneTabLabel, activeTab === 'attendance' && styles.phoneTabLabelActive]}>Attendance</Text>
                </TouchableOpacity>

                {/* Raised Round Check-In Button in Centre */}
                <TouchableOpacity
                  style={[
                    styles.raisedCheckInBtn,
                    isCheckedIn && styles.raisedCheckInBtnChecked
                  ]}
                  onPress={handleCheckInToggle}
                  activeOpacity={0.85}
                  accessibilityLabel="Check In / Out"
                >
                  <Icon
                    name={isCheckedIn ? 'check' : 'fingerprint'}
                    size={24}
                    color="#FFFFFF"
                    strokeWidth={2.6}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.phoneTabBtn}
                  onPress={() => setActiveTab('leave')}
                >
                  <Icon name="leave" size={20} color={activeTab === 'leave' ? '#00B386' : '#64748B'} />
                  <Text style={[styles.phoneTabLabel, activeTab === 'leave' && styles.phoneTabLabelActive]}>Leave</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.phoneTabBtn}
                  onPress={() => setActiveTab('payslips')}
                >
                  <Icon name="payroll" size={20} color={activeTab === 'payslips' ? '#00B386' : '#64748B'} />
                  <Text style={[styles.phoneTabLabel, activeTab === 'payslips' && styles.phoneTabLabelActive]}>Payslips</Text>
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

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F5FBF7',
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
    width: 240,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    ...(Platform.OS === 'web' ? { backdropFilter: 'blur(12px)' } : {}),
    borderRightWidth: 1,
    borderRightColor: '#E6F6EE',
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
    backgroundColor: '#FFF7E6',
    borderWidth: 1,
    borderColor: 'rgba(255, 176, 32, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: CARD_RADIUS
  },
  userBadgeText: {
    color: '#B57400',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase'
  },
  sidebarNav: {
    flex: 1,
    paddingHorizontal: 12,
    gap: 6
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
    backgroundColor: 'rgba(0, 179, 134, 0.12)'
  },
  sidebarNavText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600'
  },
  sidebarNavTextActive: {
    color: '#00B386',
    fontWeight: '700'
  },
  sidebarFooter: {
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E6F6EE',
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
    backgroundColor: 'rgba(0, 179, 134, 0.15)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  userAvatarText: {
    color: '#00B386',
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
  contentColumn: {
    flex: 1,
    maxWidth: 1100,
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  topArea: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  greetingCol: {
    gap: 4
  },
  greetingText: {
    fontSize: 22,
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
    gap: 12
  },
  bellBtn: {
    width: 38,
    height: 38,
    borderRadius: CARD_RADIUS,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 0
  },
  bellDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#FFB020'
  },
  topAvatar: {
    width: 38,
    height: 38,
    borderRadius: CARD_RADIUS,
    backgroundColor: '#E0F8F1',
    alignItems: 'center',
    justifyContent: 'center'
  },
  topAvatarText: {
    color: '#00B386',
    fontSize: 15,
    fontWeight: '800'
  },
  toastCard: {
    marginHorizontal: 24,
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
  scrollArea: {
    flex: 1
  },
  scrollInner: {
    paddingHorizontal: 20,
    paddingBottom: 140,
    gap: 16
  },
  // Hero Today Card
  heroCard: {
    backgroundColor: '#00B386',
    ...(Platform.OS === 'web'
      ? { backgroundImage: 'linear-gradient(135deg, #00D9A5 0%, #00B386 100%)' }
      : {}),
    borderRadius: CARD_RADIUS,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#00B386',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 0,
    flexWrap: 'wrap',
    gap: 16
  },
  heroLeftCol: {
    gap: 8,
    flex: 1,
    minWidth: 260
  },
  liveClockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
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
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 13,
    fontWeight: '500'
  },
  checkInActionBtn: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: CARD_RADIUS,
    gap: 10,
    alignSelf: 'flex-start',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 0
  },
  checkInActionBtnChecked: {
    backgroundColor: '#ECFDF5'
  },
  checkInActionBtnText: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '700'
  },
  checkInActionBtnTextChecked: {
    color: '#00B386'
  },
  heroRightCol: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  progressRingCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)'
  },
  progressRingVal: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800'
  },
  progressRingLabel: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 10,
    fontWeight: '600'
  },
  // Quick Actions (60px rows)
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14
  },
  quickActionTile: {
    flex: 1,
    minWidth: 140,
    height: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: CARD_RADIUS,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#00775B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 0
  },
  quickActionIconWrap: {
    width: 38,
    height: 38,
    borderRadius: CARD_RADIUS,
    alignItems: 'center',
    justifyContent: 'center'
  },
  quickActionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A'
  },
  twoColRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16
  },
  leaveCard: {
    flex: 1,
    minWidth: 300,
    padding: 22,
    gap: 16
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
  viewAllLink: {
    fontSize: 13,
    color: '#00B386',
    fontWeight: '700'
  },
  balanceRingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 6
  },
  balanceItem: {
    alignItems: 'center',
    gap: 8
  },
  ringCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF'
  },
  ringNum: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A'
  },
  ringLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600'
  },
  payslipCard: {
    flex: 1,
    minWidth: 300,
    padding: 22,
    gap: 12
  },
  salaryAmountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4
  },
  salaryCurrency: {
    fontSize: 20,
    fontWeight: '700',
    color: '#64748B'
  },
  salaryAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0F172A',
    fontVariant: ['tabular-nums']
  },
  salaryMeta: {
    fontSize: 12,
    color: '#64748B'
  },
  downloadPayslipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    alignSelf: 'flex-start'
  },
  downloadPayslipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#00775B'
  },
  tasksCard: {
    padding: 22,
    gap: 14
  },
  tasksDueSub: {
    fontSize: 12,
    color: '#64748B'
  },
  tasksList: {
    gap: 10
  },
  taskItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6
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
    backgroundColor: '#00B386',
    borderColor: '#00B386'
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
  taskDue: {
    fontSize: 11,
    color: '#64748B'
  },
  announcementCard: {
    padding: 20,
    gap: 8,
    backgroundColor: '#FFFDF5'
  },
  announcementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  announcementBody: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20
  },
  heatmapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12
  },
  heatmapTile: {
    width: 36,
    height: 36,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  heatmapPresent: {
    backgroundColor: '#E0F8F1'
  },
  heatmapWeekend: {
    backgroundColor: '#F1F5F9'
  },
  heatmapTileNum: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155'
  },
  historicalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  historicalMonth: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600'
  },
  profileField: {
    fontSize: 14,
    color: '#334155'
  },
  // Floating Bottom Tab Bar on Phones (Section 5.2)
  phoneFloatingTabWrapper: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
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
    shadowColor: '#00775B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 4
  },
  phoneTabBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingHorizontal: 6
  },
  phoneTabLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600'
  },
  phoneTabLabelActive: {
    color: '#00B386',
    fontWeight: '700'
  },
  raisedCheckInBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#00B386',
    ...(Platform.OS === 'web'
      ? { backgroundImage: 'linear-gradient(135deg, #00D9A5 0%, #00B386 100%)' }
      : {}),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
    shadowColor: '#00B386',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6
  },
  raisedCheckInBtnChecked: {
    backgroundColor: '#00775B'
  }
});

export default UserShell;
