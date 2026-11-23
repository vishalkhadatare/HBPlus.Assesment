import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Modal } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import useBreakpoint from '../../hooks/useBreakpoint.js';
import AnimatedLogo from '../brand/AnimatedLogo.jsx';
import Icon from '../ui/Icon.jsx';
import IconTile from '../ui/IconTile.jsx';
import Badge from '../ui/Badge.jsx';

export function ModernAppLayout({ activeModule, onSelectModule, role, onToggleRole, children }) {
  const { colors, isDark, toggleTheme, borderRadius, shadows } = useTheme();
  const { user, profile, signOut } = useAuth();
  const { isPhone, isTablet, isDesktop } = useBreakpoint();
  const [isMoreSheetOpen, setIsMoreSheetOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', category: 'Overview' },
    { id: 'directory', label: 'Directory', icon: 'directory', category: 'People' },
    { id: 'attendance', label: 'Attendance', icon: 'attendance', category: 'People' },
    { id: 'leave', label: 'Leave', icon: 'leave', category: 'People' },
    { id: 'shifts', label: 'Shifts', icon: 'shifts', category: 'Work' },
    { id: 'tasks', label: 'Tasks', icon: 'tasks', category: 'Work' },
    { id: 'performance', label: 'OKRs', icon: 'performance', category: 'Work' },
    { id: 'payroll', label: 'Payroll', icon: 'payroll', category: 'Company' },
    { id: 'announcements', label: 'Notices', icon: 'announcements', category: 'Company' },
    { id: 'documents', label: 'Policies', icon: 'documents', category: 'Company' },
    { id: 'helpdesk', label: 'Helpdesk', icon: 'helpdesk', category: 'Company' },
    { id: 'reports', label: 'Reports', icon: 'reports', category: 'Company' },
    { id: 'admin', label: 'Settings', icon: 'settings', category: 'System' }
  ];

  // Primary 4 items + More on phone
  const phoneTabs = [
    { id: 'dashboard', label: 'Home', icon: 'dashboard' },
    { id: 'directory', label: 'Team', icon: 'directory' },
    // Center is Attendance (raised)
    { id: 'leave', label: 'Leave', icon: 'leave' },
    { id: 'more', label: 'More', icon: 'more' }
  ];

  const displayName = profile?.displayName || user?.displayName || user?.email?.split('@')[0] || 'Aarav Mehta';
  const displayEmail = user?.email || 'aarav.m@hbplus.fit';

  const todayStr = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  }).format(new Date());

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
      <View style={[styles.shell, { backgroundColor: colors.bg }]}>
        {/* DESKTOP / TABLET SIDEBAR - NEVER RENDERED ON PHONE (< 768px) */}
        {!isPhone ? (
          <View
            style={[
              styles.desktopSidebar,
              isTablet && styles.tabletSidebar,
              {
                backgroundColor: colors.surface,
                borderRightColor: colors.border
              }
            ]}
          >
            {/* Brand Logo */}
            <View style={[styles.sidebarBrand, isTablet && { justifyContent: 'center' }]}>
              <AnimatedLogo size={36} showWordmark={!isTablet} textColor={colors.text} />
            </View>

            {/* User Profile Mini Card */}
            {!isTablet ? (
              <View style={[styles.profileCard, { backgroundColor: colors.surfaceAlt }]}>
                <View style={[styles.avatarInitials, { backgroundColor: colors.primary }]}>
                  <Text style={styles.avatarLetter}>{displayName[0]}</Text>
                </View>
                <View style={{ flex: 1, minWidth: 0, marginLeft: 10 }}>
                  <Text style={[styles.profileName, { color: colors.text }]} numberOfLines={1}>
                    {displayName}
                  </Text>
                  <Text style={[styles.profileEmail, { color: colors.textMuted }]} numberOfLines={1}>
                    {displayEmail}
                  </Text>
                </View>
                <Badge label={role} variant={role === 'Admin' ? 'Admin' : 'User'} size="small" showDot={false} />
              </View>
            ) : null}

            {/* Sidebar Navigation Items */}
            <ScrollView style={styles.navScroll} showsVerticalScrollIndicator={false}>
              {navItems.map((item) => {
                const isActive = activeModule === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.sidebarNavItem,
                      isActive && { backgroundColor: colors.primarySoft },
                      isTablet && { justifyContent: 'center', paddingHorizontal: 0 }
                    ]}
                    onPress={() => onSelectModule(item.id)}
                    activeOpacity={0.8}
                  >
                    <IconTile
                      name={item.icon}
                      module={item.id}
                      size={isTablet ? 38 : 34}
                      iconSize={18}
                    />
                    {!isTablet ? (
                      <Text
                        style={[
                          styles.navLabel,
                          {
                            color: isActive ? colors.primary : colors.textMuted,
                            fontWeight: isActive ? '700' : '500'
                          }
                        ]}
                        numberOfLines={1}
                      >
                        {item.label}
                      </Text>
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Sidebar Footer */}
            <View style={[styles.sidebarFooter, { borderTopColor: colors.borderSubtle }]}>
              {!isTablet ? (
                <View style={styles.footerRow}>
                  <TouchableOpacity
                    style={[styles.footerPill, { backgroundColor: colors.surfaceAlt }]}
                    onPress={toggleTheme}
                  >
                    <Icon name={isDark ? 'sun' : 'moon'} size={15} color={colors.textMuted} />
                    <Text style={[styles.footerPillText, { color: colors.textMuted }]}>
                      {isDark ? 'Light' : 'Dark'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.footerPill, { backgroundColor: colors.dangerSoft }]}
                    onPress={signOut}
                  >
                    <Icon name="logout" size={15} color={colors.dangerText} />
                    <Text style={[styles.footerPillText, { color: colors.dangerText }]}>
                      Sign Out
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity onPress={signOut} style={{ padding: 10, alignItems: 'center' }}>
                  <Icon name="logout" size={18} color={colors.dangerText} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        ) : null}

        {/* MAIN CONTENT AREA */}
        <View style={styles.mainContentArea}>
          {/* TOP BAR / HEADER (Responsive) */}
          <View
            style={[
              styles.topBar,
              {
                backgroundColor: colors.surfaceGlass,
                borderBottomColor: colors.border
              }
            ]}
          >
            {/* Left: Phone Greeting or Desktop Title */}
            <View style={styles.topBarLeft}>
              {isPhone ? (
                <View style={styles.phoneHeaderGreeting}>
                  <AnimatedLogo size={28} showGlow={false} />
                  <View style={{ marginLeft: 8 }}>
                    <Text style={[styles.phoneGreetingText, { color: colors.text }]}>
                      Good morning, {displayName.split(' ')[0]}
                    </Text>
                    <Text style={[styles.phoneDateText, { color: colors.textSubtle }]}>
                      {todayStr} • HBPlus
                    </Text>
                  </View>
                </View>
              ) : (
                <Text style={[styles.desktopModuleTitle, { color: colors.text }]}>
                  {navItems.find((n) => n.id === activeModule)?.label || 'Dashboard'}
                </Text>
              )}
            </View>

            {/* Right: Actions */}
            <View style={styles.topBarRight}>
              {/* Role Toggle Switcher */}
              <TouchableOpacity
                style={[
                  styles.roleToggleBadge,
                  { backgroundColor: role === 'Admin' ? colors.primarySoft : colors.surfaceAlt }
                ]}
                onPress={onToggleRole}
                activeOpacity={0.8}
              >
                <Icon
                  name="shieldCheck"
                  size={14}
                  color={role === 'Admin' ? colors.primary : colors.textMuted}
                />
                <Text
                  style={[
                    styles.roleToggleText,
                    { color: role === 'Admin' ? colors.primary : colors.textMuted }
                  ]}
                >
                  {role}
                </Text>
              </TouchableOpacity>

              {/* Theme Toggle (Phone) */}
              {isPhone ? (
                <TouchableOpacity
                  style={[styles.topIconBtn, { backgroundColor: colors.surfaceAlt }]}
                  onPress={toggleTheme}
                >
                  <Icon name={isDark ? 'sun' : 'moon'} size={17} color={colors.textMuted} />
                </TouchableOpacity>
              ) : null}

              {/* Sign Out (Phone header) */}
              {isPhone ? (
                <TouchableOpacity
                  style={[styles.topIconBtn, { backgroundColor: colors.dangerSoft }]}
                  onPress={signOut}
                >
                  <Icon name="logout" size={16} color={colors.dangerText} />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>

          {/* SCROLLABLE MODULE BODY */}
          <ScrollView
            style={styles.scrollBody}
            contentContainerStyle={[
              styles.scrollContent,
              isPhone ? { paddingBottom: 110, paddingHorizontal: 16 } : { paddingBottom: 50, paddingHorizontal: 28 }
            ]}
            showsVerticalScrollIndicator={false}
          >
            {children}

            <View style={styles.footerNote}>
              <Text style={[styles.footerNoteText, { color: colors.textSubtle }]}>
                HBPlus Workforce Platform • Unified Cross-Platform Portal
              </Text>
            </View>
          </ScrollView>

          {/* FLOATING GLASS BOTTOM TAB BAR (PHONES ONLY: width < 768px) */}
          {isPhone ? (
            <View
              style={[
                styles.floatingTabBar,
                {
                  backgroundColor: colors.surfaceGlass,
                  borderColor: colors.border
                },
                shadows.lg
              ]}
            >
              {/* Tab 1: Home */}
              <TouchableOpacity
                style={styles.tabItem}
                onPress={() => onSelectModule('dashboard')}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.tabIconPill,
                    activeModule === 'dashboard' && { backgroundColor: colors.primarySoft }
                  ]}
                >
                  <Icon
                    name="dashboard"
                    size={20}
                    color={activeModule === 'dashboard' ? colors.primary : colors.textSubtle}
                    strokeWidth={activeModule === 'dashboard' ? 2.4 : 1.8}
                  />
                  {activeModule === 'dashboard' ? (
                    <Text style={[styles.tabActiveLabel, { color: colors.primary }]}>Home</Text>
                  ) : null}
                </View>
              </TouchableOpacity>

              {/* Tab 2: Team / Directory */}
              <TouchableOpacity
                style={styles.tabItem}
                onPress={() => onSelectModule('directory')}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.tabIconPill,
                    activeModule === 'directory' && { backgroundColor: colors.primarySoft }
                  ]}
                >
                  <Icon
                    name="directory"
                    size={20}
                    color={activeModule === 'directory' ? colors.primary : colors.textSubtle}
                    strokeWidth={activeModule === 'directory' ? 2.4 : 1.8}
                  />
                  {activeModule === 'directory' ? (
                    <Text style={[styles.tabActiveLabel, { color: colors.primary }]}>Team</Text>
                  ) : null}
                </View>
              </TouchableOpacity>

              {/* Center Raised Gradient Button: Attendance / Clock */}
              <TouchableOpacity
                style={styles.centerRaisedWrapper}
                onPress={() => onSelectModule('attendance')}
                activeOpacity={0.85}
              >
                <View
                  style={[
                    styles.centerRaisedButton,
                    {
                      boxShadow: '0 8px 20px rgba(91, 91, 240, 0.45)',
                      backgroundImage: 'linear-gradient(135deg, #6A5CFF 0%, #4A3DF0 50%, #2F8BFF 100%)'
                    }
                  ]}
                >
                  <Icon name="fingerprint" size={26} color="#FFFFFF" strokeWidth={2.4} />
                </View>
              </TouchableOpacity>

              {/* Tab 4: Leave */}
              <TouchableOpacity
                style={styles.tabItem}
                onPress={() => onSelectModule('leave')}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.tabIconPill,
                    activeModule === 'leave' && { backgroundColor: colors.primarySoft }
                  ]}
                >
                  <Icon
                    name="leave"
                    size={20}
                    color={activeModule === 'leave' ? colors.primary : colors.textSubtle}
                    strokeWidth={activeModule === 'leave' ? 2.4 : 1.8}
                  />
                  {activeModule === 'leave' ? (
                    <Text style={[styles.tabActiveLabel, { color: colors.primary }]}>Leave</Text>
                  ) : null}
                </View>
              </TouchableOpacity>

              {/* Tab 5: More (Opens 3-Column Sheet) */}
              <TouchableOpacity
                style={styles.tabItem}
                onPress={() => setIsMoreSheetOpen(true)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.tabIconPill,
                    (isMoreSheetOpen || ['shifts', 'payroll', 'tasks', 'performance', 'announcements', 'documents', 'helpdesk', 'reports', 'admin'].includes(activeModule)) && { backgroundColor: colors.primarySoft }
                  ]}
                >
                  <Icon
                    name="more"
                    size={20}
                    color={['shifts', 'payroll', 'tasks', 'performance', 'announcements', 'documents', 'helpdesk', 'reports', 'admin'].includes(activeModule) ? colors.primary : colors.textSubtle}
                    strokeWidth={2}
                  />
                  {['shifts', 'payroll', 'tasks', 'performance', 'announcements', 'documents', 'helpdesk', 'reports', 'admin'].includes(activeModule) ? (
                    <Text style={[styles.tabActiveLabel, { color: colors.primary }]}>More</Text>
                  ) : null}
                </View>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </View>

      {/* "MORE" SHEET MODAL FOR PHONES (Section 6.4) */}
      {isMoreSheetOpen ? (
        <Modal
          visible={isMoreSheetOpen}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsMoreSheetOpen(false)}
        >
          <View style={styles.sheetOverlay}>
            <View
              style={[
                styles.sheetContent,
                {
                  backgroundColor: colors.surface,
                  borderTopColor: colors.border
                }
              ]}
            >
              {/* Sheet Drag Handle */}
              <View style={styles.sheetDragBar}>
                <View style={[styles.sheetHandle, { backgroundColor: colors.borderStrong }]} />
              </View>

              {/* Header */}
              <View style={styles.sheetHeader}>
                <View>
                  <Text style={[styles.sheetTitle, { color: colors.text }]}>All Workspace Features</Text>
                  <Text style={[styles.sheetSubtitle, { color: colors.textMuted }]}>
                    Access corporate tools and settings
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.closeBtn, { backgroundColor: colors.surfaceAlt }]}
                  onPress={() => setIsMoreSheetOpen(false)}
                >
                  <Icon name="x" size={18} color={colors.textMuted} />
                </TouchableOpacity>
              </View>

              {/* 3-Column Grid of Modules */}
              <ScrollView style={{ maxHeight: 420 }} showsVerticalScrollIndicator={false}>
                <View style={styles.modules3ColGrid}>
                  {navItems.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.moduleTile,
                        {
                          backgroundColor: activeModule === item.id ? colors.primarySoft : colors.surfaceAlt,
                          borderColor: activeModule === item.id ? colors.primary : 'transparent'
                        }
                      ]}
                      onPress={() => {
                        onSelectModule(item.id);
                        setIsMoreSheetOpen(false);
                      }}
                      activeOpacity={0.8}
                    >
                      <IconTile name={item.icon} module={item.id} size={44} iconSize={22} />
                      <Text
                        style={[
                          styles.moduleTileLabel,
                          {
                            color: activeModule === item.id ? colors.primary : colors.text,
                            fontWeight: activeModule === item.id ? '700' : '600'
                          }
                        ]}
                        numberOfLines={1}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              {/* Sheet Bottom Actions */}
              <View style={[styles.sheetFooter, { borderTopColor: colors.borderSubtle }]}>
                <TouchableOpacity
                  style={[styles.sheetFooterBtn, { backgroundColor: colors.surfaceAlt }]}
                  onPress={() => {
                    toggleTheme();
                    setIsMoreSheetOpen(false);
                  }}
                >
                  <Icon name={isDark ? 'sun' : 'moon'} size={16} color={colors.text} />
                  <Text style={[styles.sheetFooterBtnText, { color: colors.text }]}>
                    {isDark ? 'Light Mode' : 'Dark Mode'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.sheetFooterBtn, { backgroundColor: colors.dangerSoft }]}
                  onPress={() => {
                    setIsMoreSheetOpen(false);
                    signOut();
                  }}
                >
                  <Icon name="logout" size={16} color={colors.dangerText} />
                  <Text style={[styles.sheetFooterBtnText, { color: colors.dangerText }]}>
                    Sign Out
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  shell: {
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden'
  },
  desktopSidebar: {
    width: 254,
    borderRightWidth: 1,
    paddingVertical: 18,
    paddingHorizontal: 14,
    display: 'flex',
    flexDirection: 'column'
  },
  tabletSidebar: {
    width: 72,
    paddingHorizontal: 8
  },
  sidebarBrand: {
    paddingHorizontal: 6,
    marginBottom: 16
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 14,
    marginBottom: 14
  },
  avatarInitials: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarLetter: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14
  },
  profileName: {
    fontSize: 13,
    fontWeight: '700'
  },
  profileEmail: {
    fontSize: 11,
    fontWeight: '500'
  },
  navScroll: {
    flex: 1
  },
  sidebarNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginVertical: 2
  },
  navLabel: {
    fontSize: 13,
    marginLeft: 10,
    flex: 1
  },
  sidebarFooter: {
    borderTopWidth: 1,
    paddingTop: 12,
    marginTop: 8
  },
  footerRow: {
    flexDirection: 'row',
    gap: 8
  },
  footerPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6
  },
  footerPillText: {
    fontSize: 12,
    fontWeight: '700'
  },
  mainContentArea: {
    flex: 1,
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden'
  },
  topBar: {
    height: 60,
    borderBottomWidth: 1,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0
  },
  phoneHeaderGreeting: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0
  },
  phoneGreetingText: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.3
  },
  phoneDateText: {
    fontSize: 11,
    fontWeight: '500'
  },
  desktopModuleTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  roleToggleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    gap: 5
  },
  roleToggleText: {
    fontSize: 12,
    fontWeight: '700'
  },
  topIconBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  scrollBody: {
    flex: 1
  },
  scrollContent: {
    maxWidth: 1140,
    width: '100%',
    alignSelf: 'center',
    paddingTop: 16
  },
  footerNote: {
    marginTop: 40,
    paddingVertical: 16,
    alignItems: 'center'
  },
  footerNoteText: {
    fontSize: 11,
    fontWeight: '500'
  },
  floatingTabBar: {
    position: 'absolute',
    bottom: 12,
    left: 14,
    right: 14,
    height: 66,
    borderRadius: 28,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    zIndex: 100,
    backdropFilter: 'blur(20px)'
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tabIconPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4
  },
  tabActiveLabel: {
    fontSize: 11,
    fontWeight: '700'
  },
  centerRaisedWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    marginTop: -20
  },
  centerRaisedButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#5B5BF0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF'
  },
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  sheetContent: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 10
  },
  sheetDragBar: {
    alignItems: 'center',
    paddingVertical: 6
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '800'
  },
  sheetSubtitle: {
    fontSize: 12,
    marginTop: 2
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  modules3ColGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingVertical: 8
  },
  moduleTile: {
    width: '31%',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1
  },
  moduleTileLabel: {
    fontSize: 12,
    marginTop: 6
  },
  sheetFooter: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1
  },
  sheetFooterBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6
  },
  sheetFooterBtnText: {
    fontSize: 13,
    fontWeight: '700'
  }
});

export default ModernAppLayout;
