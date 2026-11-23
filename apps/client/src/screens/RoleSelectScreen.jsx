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
import AnimatedLogo from '../components/brand/AnimatedLogo.jsx';
import Icon from '../components/ui/Icon.jsx';
import DiagnosticsPanel from '../components/common/DiagnosticsPanel.jsx';
import { ROUTES } from '../navigation/navigationConfig.js';

export function RoleSelectScreen() {
  const { navigate } = useAuth();
  const { width } = useWindowDimensions();
  const isWide = width >= 768;
  const [isDevSheetOpen, setIsDevSheetOpen] = useState(false);

  return (
    <View style={styles.root}>
      {/* Background gradient */}
      <View style={styles.gradientBg} pointerEvents="none" />

      {/* Ambient blobs */}
      <View style={styles.blobTopLeft} pointerEvents="none" />
      <View style={styles.blobBottomRight} pointerEvents="none" />

      {/* Developer diagnostics gear – subtle, top-right */}
      <TouchableOpacity
        style={styles.gearBtn}
        onPress={() => setIsDevSheetOpen(true)}
        activeOpacity={0.7}
        accessibilityLabel="Developer Diagnostics"
      >
        <Icon name="settings" size={16} color="#94A3B8" />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.scrollRoot}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={[styles.mainWrapper, isWide && styles.mainWrapperWide]}>
          {/* Animated Logo */}
          <View style={styles.logoArea}>
            <AnimatedLogo
              size={isWide ? 130 : 110}
              showWordmark={true}
              showTagline={false}
              textColor="#0F172A"
            />
          </View>

          {/* Tagline + Heading */}
          <View style={styles.introBlock}>
            <Text style={styles.eyebrow}>HBPlus Workspace</Text>
            <Text style={styles.heading}>Choose your access</Text>
          </View>

          {/* Role cards */}
          <View style={[styles.cardArea, isWide && styles.cardAreaWide]}>
            {/* Admin Card */}
            <TouchableOpacity
              style={[styles.roleCard, isWide && styles.roleCardWide]}
              onPress={() => navigate(ROUTES.LOGIN_ADMIN)}
              activeOpacity={0.9}
              accessibilityRole="button"
              accessibilityLabel="Admin"
            >
              {/* Icon circle – orange gradient */}
              <View style={styles.adminIconCircle}>
                <Icon name="shieldCheck" size={24} color="#FFFFFF" strokeWidth={2} />
              </View>

              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Admin</Text>
                <Text style={styles.cardDescription}>
                  Manage people, approvals and reports
                </Text>
              </View>

              {/* Chevron in orange circle */}
              <View style={styles.chevronCircleOrange}>
                <Icon name="chevronRight" size={16} color="#FFFFFF" strokeWidth={2.5} />
              </View>
            </TouchableOpacity>

            {/* User Card */}
            <TouchableOpacity
              style={[styles.roleCard, isWide && styles.roleCardWide]}
              onPress={() => navigate(ROUTES.LOGIN_USER)}
              activeOpacity={0.9}
              accessibilityRole="button"
              accessibilityLabel="User"
            >
              {/* Icon circle – teal gradient */}
              <View style={styles.userIconCircle}>
                <Icon name="userCircle" size={24} color="#FFFFFF" strokeWidth={2} />
              </View>

              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>User</Text>
                <Text style={styles.cardDescription}>
                  Access your workspace, tasks and payroll
                </Text>
              </View>

              {/* Chevron in teal circle */}
              <View style={styles.chevronCircleTeal}>
                <Icon name="chevronRight" size={16} color="#FFFFFF" strokeWidth={2.5} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Developer Diagnostics Modal */}
      {isDevSheetOpen && (
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
                  <Text style={styles.modalSub}>Firebase, Firestore & Session Status</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setIsDevSheetOpen(false)}
                  style={styles.closeBtn}
                >
                  <Icon name="x" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              <ScrollView style={{ maxHeight: 420 }} showsVerticalScrollIndicator={false}>
                <DiagnosticsPanel />
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    position: 'relative'
  },

  /* ── Background ── */
  gradientBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F8FAFC',
    ...(Platform.OS === 'web'
      ? { backgroundImage: 'linear-gradient(180deg, #F8FAFC 0%, #F0FDFA 100%)' }
      : {})
  },

  /* ── Ambient blobs ── */
  blobTopLeft: {
    position: 'absolute',
    top: -80,
    left: -80,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(20, 184, 166, 0.40)',
    ...(Platform.OS === 'web' ? { filter: 'blur(80px)' } : {}),
    zIndex: 0
  },
  blobBottomRight: {
    position: 'absolute',
    bottom: -80,
    right: -80,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(249, 115, 22, 0.40)',
    ...(Platform.OS === 'web' ? { filter: 'blur(80px)' } : {}),
    zIndex: 0
  },

  /* ── Gear button ── */
  gearBtn: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 'max(32px, env(safe-area-inset-top, 32px))' : 32,
    right: 16,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.80)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    zIndex: 20,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 2px 8px rgba(15,23,42,0.06)' }
      : {
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.04,
          shadowRadius: 6,
          elevation: 2
        })
  },

  /* ── Scroll / wrapper ── */
  scrollRoot: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'web' ? 'max(48px, env(safe-area-inset-top, 48px))' : 48,
    paddingBottom: Platform.OS === 'web' ? 'max(28px, env(safe-area-inset-bottom, 28px))' : 28,
    width: '100%'
  },
  mainWrapper: {
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    zIndex: 10,
    gap: 20
  },
  mainWrapperWide: {
    maxWidth: 560
  },

  /* ── Logo ── */
  logoArea: {
    alignItems: 'center',
    justifyContent: 'center'
  },

  /* ── Intro block ── */
  introBlock: {
    alignItems: 'center',
    gap: 6
  },
  eyebrow: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase'
  },
  heading: {
    color: '#0F172A',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    textAlign: 'center'
  },

  /* ── Card area ── */
  cardArea: {
    width: '100%',
    gap: 14,
    marginTop: 4
  },
  cardAreaWide: {
    flexDirection: 'row'
  },

  /* ── Role card ── */
  roleCard: {
    flex: 1,
    minHeight: 82,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...(Platform.OS === 'web'
      ? {
          boxShadow: '0 4px 24px rgba(15,23,42,0.07)',
          transition: 'transform 160ms ease, box-shadow 160ms ease',
          cursor: 'pointer'
        }
      : {
          shadowColor: '#0F172A',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.07,
          shadowRadius: 16,
          elevation: 3
        })
  },
  roleCardWide: {
    minHeight: 100
  },

  /* ── Icon circles ── */
  adminIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    backgroundColor: '#F97316',
    ...(Platform.OS === 'web'
      ? { backgroundImage: 'linear-gradient(135deg, #C2410C 0%, #F97316 100%)' }
      : {})
  },
  userIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    backgroundColor: '#14B8A6',
    ...(Platform.OS === 'web'
      ? { backgroundImage: 'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)' }
      : {})
  },

  /* ── Card text ── */
  cardContent: {
    flex: 1,
    justifyContent: 'center'
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2
  },
  cardDescription: {
    fontSize: 13,
    lineHeight: 18,
    color: '#64748B',
    marginTop: 3
  },

  /* ── Chevron circles ── */
  chevronCircleOrange: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web'
      ? { backgroundImage: 'linear-gradient(135deg, #C2410C 0%, #F97316 100%)' }
      : {})
  },
  chevronCircleTeal: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#14B8A6',
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web'
      ? { backgroundImage: 'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)' }
      : {})
  },

  /* ── Diagnostics modal ── */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modalContent: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A'
  },
  modalSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2
  },
  closeBtn: {
    padding: 6
  }
});

export default RoleSelectScreen;
