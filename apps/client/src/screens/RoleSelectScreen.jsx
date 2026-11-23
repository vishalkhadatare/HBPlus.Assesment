import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
  Modal,
  ScrollView
} from 'react-native';
import { useAuth } from '../hooks/useAuth.js';
import { useTheme } from '../contexts/ThemeContext.jsx';
import AnimatedLogo from '../components/brand/AnimatedLogo.jsx';
import Icon from '../components/ui/Icon.jsx';
import DiagnosticsPanel from '../components/common/DiagnosticsPanel.jsx';
import { ROUTES } from '../navigation/navigationConfig.js';

export function RoleSelectScreen() {
  const { navigate } = useAuth();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const isWide = width >= 900;
  const [isDevSheetOpen, setIsDevSheetOpen] = useState(false);

  return (
    <View style={styles.root}>
      {/* 1. Deep Midnight Aurora Gradient */}
      <View style={styles.gradientBg} pointerEvents="none" />

      {/* Floating Aurora Glow Orbs */}
      <View style={styles.orbLayer} pointerEvents="none">
        <View style={[styles.orb, styles.orb1]} />
        <View style={[styles.orb, styles.orb2]} />
        <View style={[styles.orb, styles.orb3]} />
      </View>

      {/* 2. Developer Diagnostics Gear Icon */}
      <TouchableOpacity
        style={styles.gearBtn}
        onPress={() => setIsDevSheetOpen(true)}
        activeOpacity={0.75}
        accessibilityLabel="Developer Diagnostics"
      >
        <Icon name="settings" size={20} color="rgba(255, 255, 255, 0.85)" />
      </TouchableOpacity>

      <View style={[styles.mainWrapper, isWide && styles.mainWrapperWide]}>
        {/* Top: Animated Logo & Headline */}
        <View style={[styles.heroArea, isWide && styles.heroAreaWide]}>
          <AnimatedLogo size={isWide ? 130 : 100} showWordmark={true} showTagline={true} />

          <View style={styles.headlineWrapper}>
            <Text style={styles.title}>Welcome to HBPlus</Text>
            <Text style={styles.subtitle}>Choose how you want to sign in</Text>
          </View>
        </View>

        {/* Bottom / Right: Two Choice Cards (Admin & User) */}
        <View style={[styles.cardArea, isWide && styles.cardAreaWide]}>
          {/* Admin Choice Button */}
          <TouchableOpacity
            style={styles.roleCard}
            onPress={() => navigate(ROUTES.LOGIN_ADMIN)}
            activeOpacity={0.88}
            accessibilityRole="button"
            accessibilityLabel="Admin Login"
          >
            <View style={[styles.iconTile, { backgroundColor: '#E0F8F1' }]}>
              <Icon name="shieldCheck" size={24} color="#00B386" strokeWidth={2.2} />
            </View>

            <View style={styles.cardContent}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardTitle}>Admin</Text>
                <View style={styles.badgeAdmin}>
                  <Text style={styles.badgeAdminText}>PROVISIONED</Text>
                </View>
              </View>
              <Text style={styles.cardCaption}>Manage people, roles, attendance & system settings</Text>
            </View>

            <View style={styles.trailingArrow}>
              <Icon name="chevronRight" size={20} color="#00B386" />
            </View>
          </TouchableOpacity>

          {/* User Choice Button */}
          <TouchableOpacity
            style={styles.roleCard}
            onPress={() => navigate(ROUTES.LOGIN_USER)}
            activeOpacity={0.88}
            accessibilityRole="button"
            accessibilityLabel="User Login"
          >
            <View style={[styles.iconTile, { backgroundColor: '#FFF7E6' }]}>
              <Icon name="user" size={24} color="#FFB020" strokeWidth={2.2} />
            </View>

            <View style={styles.cardContent}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardTitle}>User</Text>
                <View style={styles.badgeUser}>
                  <Text style={styles.badgeUserText}>GOOGLE OAUTH</Text>
                </View>
              </View>
              <Text style={styles.cardCaption}>Access your personal workspace, shifts & leave</Text>
            </View>

            <View style={styles.trailingArrow}>
              <Icon name="chevronRight" size={20} color="#FFB020" />
            </View>
          </TouchableOpacity>

          {/* Footer Security Notice */}
          <View style={styles.footerLockNotice}>
            <Icon name="lock" size={14} color="rgba(255, 255, 255, 0.6)" />
            <Text style={styles.footerLockText}>
              Restricted to <Text style={{ color: '#2EE6B6', fontWeight: '700' }}>@hbplus.fit</Text> accounts
            </Text>
          </View>
        </View>
      </View>

      {/* Persistent Bottom Copyright */}
      <Text style={styles.bottomCopyright}>© 2026 HBPlus. Corporate Access Portal.</Text>

      {/* Developer Diagnostics Modal */}
      {isDevSheetOpen ? (
        <Modal
          visible={isDevSheetOpen}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsDevSheetOpen(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>Developer Diagnostics</Text>
                  <Text style={styles.modalSub}>Cloud Firestore, Auth & Configuration health</Text>
                </View>
                <TouchableOpacity onPress={() => setIsDevSheetOpen(false)}>
                  <Icon name="x" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              <ScrollView style={{ maxHeight: 420 }} showsVerticalScrollIndicator={false}>
                <DiagnosticsPanel />
              </ScrollView>
            </View>
          </View>
        </Modal>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#04100E',
    overflow: 'hidden',
    position: 'relative'
  },
  gradientBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    ...(Platform.OS === 'web'
      ? {
          background: 'linear-gradient(150deg, #04100E 0%, #07302A 50%, #0B5D4B 100%)'
        }
      : {
          backgroundColor: '#07302A'
        })
  },
  orbLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    ...(Platform.OS === 'web' ? { filter: 'blur(75px)' } : null)
  },
  orb: {
    position: 'absolute',
    borderRadius: 9999
  },
  orb1: {
    width: 320,
    height: 320,
    backgroundColor: 'rgba(0, 179, 134, 0.22)',
    top: -60,
    left: -60
  },
  orb2: {
    width: 280,
    height: 280,
    backgroundColor: 'rgba(29, 140, 248, 0.18)',
    top: '35%',
    right: -40
  },
  orb3: {
    width: 240,
    height: 240,
    backgroundColor: 'rgba(255, 176, 32, 0.15)',
    bottom: 40,
    left: '20%'
  },
  gearBtn: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 20 : 46,
    right: 20,
    zIndex: 20,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  mainWrapper: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 36
  },
  mainWrapperWide: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 980,
    alignSelf: 'center',
    gap: 60,
    paddingTop: 0,
    paddingBottom: 0
  },
  heroArea: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10
  },
  heroAreaWide: {
    flex: 1,
    alignItems: 'center'
  },
  headlineWrapper: {
    alignItems: 'center',
    marginTop: 16
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.6,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.72)',
    marginTop: 6,
    fontWeight: '500',
    textAlign: 'center'
  },
  cardArea: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    gap: 14
  },
  cardAreaWide: {
    flex: 1
  },
  roleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    boxShadow: '0 12px 32px rgba(4, 16, 14, 0.35)',
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)'
  },
  iconTile: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  cardContent: {
    flex: 1,
    minWidth: 0
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0A1A17',
    letterSpacing: -0.3
  },
  badgeAdmin: {
    backgroundColor: '#E0F8F1',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6
  },
  badgeAdminText: {
    color: '#00775B',
    fontSize: 10,
    fontWeight: '800'
  },
  badgeUser: {
    backgroundColor: '#FFF7E6',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6
  },
  badgeUserText: {
    color: '#B54708',
    fontSize: 10,
    fontWeight: '800'
  },
  cardCaption: {
    fontSize: 13,
    color: '#51635E',
    lineHeight: 18,
    fontWeight: '500'
  },
  trailingArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F4F8F7',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  footerLockNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8
  },
  footerLockText: {
    fontSize: 12.5,
    color: 'rgba(255, 255, 255, 0.65)',
    fontWeight: '500'
  },
  bottomCopyright: {
    position: 'absolute',
    bottom: 8,
    alignSelf: 'center',
    color: 'rgba(255, 255, 255, 0.35)',
    fontSize: 11
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    paddingBottom: 36
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0A1A17'
  },
  modalSub: {
    fontSize: 12,
    color: '#51635E',
    marginTop: 2
  }
});

export default RoleSelectScreen;
