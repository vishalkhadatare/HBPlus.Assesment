import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Dimensions, Platform } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import AnimatedLogo from '../brand/AnimatedLogo.jsx';
import Badge from '../ui/Badge.jsx';

export function ModernAppLayout({ activeModule, onSelectModule, role, onToggleRole, children }) {
  const { colors, isDark, toggleTheme, borderRadius, shadows } = useTheme();
  const { user, profile, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'directory', label: 'Directory', icon: '👥' },
    { id: 'attendance', label: 'Attendance', icon: '⏱️' },
    { id: 'leave', label: 'Leave', icon: '🌴' },
    { id: 'shifts', label: 'Shifts', icon: '📅' },
    { id: 'payroll', label: 'Payroll', icon: '💳' },
    { id: 'tasks', label: 'Tasks', icon: '📋' },
    { id: 'performance', label: 'OKRs', icon: '🎯' },
    { id: 'announcements', label: 'Notices', icon: '📢' },
    { id: 'documents', label: 'Policies', icon: '📄' },
    { id: 'helpdesk', label: 'Helpdesk', icon: '🎫' },
    { id: 'reports', label: 'Reports', icon: '📈' },
    { id: 'admin', label: 'Settings', icon: '⚙️' }
  ];

  // Mobile primary 5 tabs
  const mobilePrimaryTabs = [
    { id: 'dashboard', label: 'Home', icon: '📊' },
    { id: 'directory', label: 'Team', icon: '👥' },
    { id: 'attendance', label: 'Clock', icon: '⏱️' },
    { id: 'leave', label: 'Leave', icon: '🌴' },
    { id: 'tasks', label: 'Tasks', icon: '📋' }
  ];

  const displayName = profile?.displayName || user?.displayName || user?.email?.split('@')[0] || 'Team Member';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.shell, { backgroundColor: colors.background }]}>
        {/* Desktop / Tablet Glass Sidebar */}
        <View
          style={[
            styles.desktopSidebar,
            {
              backgroundColor: colors.surface,
              borderRightColor: colors.border
            }
          ]}
        >
          {/* Brand Header */}
          <View style={styles.brandContainer}>
            <AnimatedLogo size={36} fontSize={15} showGlow={true} />
            <View style={{ marginLeft: 8 }}>
              <Text style={[styles.brandTitle, { color: colors.textPrimary }]}>HBPlus</Text>
              <Text style={[styles.brandSubtitle, { color: colors.textSecondary }]}>
                Corporate Workspace
              </Text>
            </View>
          </View>

          {/* User Badge Card */}
          <View style={[styles.sidebarUserCard, { backgroundColor: colors.surfaceSubtle }]}>
            <View style={styles.userInitials}>
              <Text style={styles.initialsText}>{displayName[0]}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={[styles.userName, { color: colors.textPrimary }]} numberOfLines={1}>
                {displayName}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                <Badge label={role} variant={role === 'Admin' ? 'Admin' : 'User'} size="small" />
              </View>
            </View>
          </View>

          {/* Navigation Links Scrollable */}
          <ScrollView style={styles.sidebarNavScroll} showsVerticalScrollIndicator={false}>
            {navItems.map((item) => {
              const isActive = activeModule === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.navItem,
                    {
                      backgroundColor: isActive ? colors.primarySubtle : 'transparent',
                      borderRadius: borderRadius.md
                    }
                  ]}
                  onPress={() => onSelectModule(item.id)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.navIcon}>{item.icon}</Text>
                  <Text
                    style={[
                      styles.navLabel,
                      {
                        color: isActive ? colors.primary : colors.textSecondary,
                        fontWeight: isActive ? '800' : '600'
                      }
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Sidebar Footer Controls */}
          <View style={[styles.sidebarFooter, { borderTopColor: colors.borderSubtle }]}>
            <TouchableOpacity
              style={[styles.footerBtn, { backgroundColor: colors.surfaceSubtle }]}
              onPress={toggleTheme}
            >
              <Text style={{ fontSize: 13, color: colors.textSecondary, fontWeight: '700' }}>
                {isDark ? '☀️ Light' : '🌙 Dark'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.footerBtn, { backgroundColor: colors.dangerSubtle }]}
              onPress={signOut}
            >
              <Text style={{ fontSize: 13, color: colors.dangerText, fontWeight: '700' }}>
                Sign Out
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Content Area */}
        <View style={styles.mainArea}>
          {/* Glass Top Header (Mobile & Desktop) */}
          <View
            style={[
              styles.topBar,
              {
                backgroundColor: colors.surfaceGlass,
                borderBottomColor: colors.border
              }
            ]}
          >
            <View style={styles.topBarLeft}>
              <View style={styles.mobileBrand}>
                <AnimatedLogo size={28} fontSize={12} showGlow={false} />
                <Text style={[styles.mobileTitle, { color: colors.textPrimary }]}>HBPlus</Text>
              </View>

              <Text style={[styles.currentModuleHeading, { color: colors.textPrimary }]}>
                {navItems.find((n) => n.id === activeModule)?.label || 'Dashboard'}
              </Text>
            </View>

            <View style={styles.topBarRight}>
              {/* Quick Role Toggle Shortcut */}
              <TouchableOpacity
                style={[styles.quickRolePill, { backgroundColor: colors.primarySubtle }]}
                onPress={onToggleRole}
              >
                <Text style={[styles.quickRoleText, { color: colors.primary }]}>
                  {role === 'Admin' ? '🛡️ Admin View' : '👤 Employee View'}
                </Text>
              </TouchableOpacity>

              {/* Theme Toggle Button */}
              <TouchableOpacity
                style={[styles.themePill, { backgroundColor: colors.surfaceSubtle }]}
                onPress={toggleTheme}
              >
                <Text style={{ fontSize: 13 }}>{isDark ? '☀️' : '🌙'}</Text>
              </TouchableOpacity>

              {/* Mobile Drawer Toggle */}
              <TouchableOpacity
                style={[styles.mobileMenuToggle, { backgroundColor: colors.surfaceSubtle }]}
                onPress={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Text style={{ fontSize: 16 }}>{mobileMenuOpen ? '✕' : '☰'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Mobile All-Modules Drawer Dropdown */}
          {mobileMenuOpen ? (
            <View style={[styles.mobileDrawer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
              <View style={styles.mobileDrawerGrid}>
                {navItems.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.drawerChip,
                      {
                        backgroundColor: activeModule === item.id ? colors.primary : colors.surfaceSubtle
                      }
                    ]}
                    onPress={() => {
                      onSelectModule(item.id);
                      setMobileMenuOpen(false);
                    }}
                  >
                    <Text style={{ fontSize: 13, marginRight: 4 }}>{item.icon}</Text>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '700',
                        color: activeModule === item.id ? '#FFFFFF' : colors.textPrimary
                      }}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                style={[styles.mobileSignOutBtn, { backgroundColor: colors.dangerSubtle }]}
                onPress={signOut}
              >
                <Text style={{ color: colors.dangerText, fontWeight: '700', fontSize: 13 }}>
                  Sign Out of HBPlus
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {/* Module Content ScrollView */}
          <ScrollView
            style={styles.contentScrollView}
            contentContainerStyle={styles.contentScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {children}

            <View style={styles.footerBar}>
              <Text style={[styles.footerText, { color: colors.textMuted }]}>
                © {new Date().getFullYear()} HBPlus • Unified Workspace • Secured with Cloud Firestore
              </Text>
            </View>
          </ScrollView>

          {/* Floating Glass Bottom Navigation Tab Bar for Mobile */}
          <View
            style={[
              styles.floatingBottomTabs,
              {
                backgroundColor: colors.surfaceGlass,
                borderColor: colors.border
              },
              shadows.elevated
            ]}
          >
            {mobilePrimaryTabs.map((tab) => {
              const isActive = activeModule === tab.id;
              return (
                <TouchableOpacity
                  key={tab.id}
                  style={styles.bottomTabItem}
                  onPress={() => onSelectModule(tab.id)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.bottomTabIconContainer,
                      {
                        backgroundColor: isActive ? colors.primarySubtle : 'transparent'
                      }
                    ]}
                  >
                    <Text style={styles.bottomTabIcon}>{tab.icon}</Text>
                  </View>
                  <Text
                    style={[
                      styles.bottomTabLabel,
                      {
                        color: isActive ? colors.primary : colors.textSecondary,
                        fontWeight: isActive ? '800' : '600'
                      }
                    ]}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}

            {/* "More" Trigger */}
            <TouchableOpacity
              style={styles.bottomTabItem}
              onPress={() => setMobileMenuOpen(!mobileMenuOpen)}
              activeOpacity={0.8}
            >
              <View style={styles.bottomTabIconContainer}>
                <Text style={styles.bottomTabIcon}>⚡</Text>
              </View>
              <Text style={[styles.bottomTabLabel, { color: colors.textSecondary }]}>
                More
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  shell: {
    flex: 1,
    flexDirection: 'row'
  },
  desktopSidebar: {
    width: 250,
    borderRightWidth: 1,
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 14,
    display: 'flex'
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.6
  },
  brandSubtitle: {
    fontSize: 11,
    fontWeight: '600'
  },
  sidebarUserCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 14,
    marginBottom: 16
  },
  userInitials: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center'
  },
  initialsText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14
  },
  userName: {
    fontSize: 13,
    fontWeight: '700'
  },
  sidebarNavScroll: {
    flex: 1
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 12,
    marginVertical: 2
  },
  navIcon: {
    fontSize: 16,
    marginRight: 10
  },
  navLabel: {
    fontSize: 13,
    letterSpacing: -0.2
  },
  sidebarFooter: {
    borderTopWidth: 1,
    paddingTop: 12,
    flexDirection: 'row',
    gap: 8
  },
  footerBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  mainArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  topBar: {
    height: 60,
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  mobileBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  mobileTitle: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: -0.4
  },
  currentModuleHeading: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  quickRolePill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999
  },
  quickRoleText: {
    fontSize: 12,
    fontWeight: '700'
  },
  themePill: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  mobileMenuToggle: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  mobileDrawer: {
    borderBottomWidth: 1,
    padding: 12,
    zIndex: 20
  },
  mobileDrawerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10
  },
  drawerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8
  },
  mobileSignOutBtn: {
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center'
  },
  contentScrollView: {
    flex: 1
  },
  contentScrollContent: {
    maxWidth: 1080,
    width: '100%',
    alignSelf: 'center',
    padding: 16,
    paddingBottom: 90
  },
  footerBar: {
    marginTop: 32,
    paddingVertical: 16,
    alignItems: 'center'
  },
  footerText: {
    fontSize: 11,
    fontWeight: '500'
  },
  floatingBottomTabs: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    right: 16,
    height: 60,
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 6,
    zIndex: 100
  },
  bottomTabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  bottomTabIconContainer: {
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 12
  },
  bottomTabIcon: {
    fontSize: 16
  },
  bottomTabLabel: {
    fontSize: 10,
    marginTop: 2
  }
});

export default ModernAppLayout;
