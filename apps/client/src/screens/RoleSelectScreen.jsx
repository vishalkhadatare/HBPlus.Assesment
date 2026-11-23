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
import { CARD_RADIUS } from '../theme/shape.js';

export function RoleSelectScreen() {
  const { navigate } = useAuth();
  const { width } = useWindowDimensions();
  const isWide = width >= 768;
  const [isDevSheetOpen, setIsDevSheetOpen] = useState(false);

  return (
    <View style={styles.root}>
      {/* Background Soft Gradient */}
      <View style={styles.gradientBg} pointerEvents="none" />

      {/* Developer Diagnostics Subtle Gear Icon */}
      <TouchableOpacity
        style={styles.gearBtn}
        onPress={() => setIsDevSheetOpen(true)}
        activeOpacity={0.7}
        accessibilityLabel="Developer Diagnostics"
      >
        <Icon name="settings" size={20} color="#94A3B8" />
      </TouchableOpacity>

      <View style={[styles.mainWrapper, isWide && styles.mainWrapperWide]}>
        {/* Animated Logo (Keeps exact honeycomb component & animation) */}
        <View style={styles.logoArea}>
          <AnimatedLogo
            size={isWide ? 120 : 104}
            showWordmark={true}
            showTagline={false}
            textColor="#0F172A"
          />
        </View>

        {/* Two Clean, Large Choice Buttons */}
        <View style={styles.cardArea}>
          {/* Admin Choice Button */}
          <TouchableOpacity
            style={styles.roleCard}
            onPress={() => navigate(ROUTES.LOGIN_ADMIN)}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Admin"
          >
            <View style={styles.adminIconTile}>
              <Icon name="shieldCheck" size={26} color="#00B386" strokeWidth={2.2} />
            </View>

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Admin</Text>
            </View>

            <View style={styles.trailingArrow}>
              <Icon name="chevronRight" size={20} color="#00B386" strokeWidth={2.4} />
            </View>
          </TouchableOpacity>

          {/* User Choice Button */}
          <TouchableOpacity
            style={styles.roleCard}
            onPress={() => navigate(ROUTES.LOGIN_USER)}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="User"
          >
            <View style={styles.userIconTile}>
              <Icon name="userCircle" size={26} color="#FFB020" strokeWidth={2.2} />
            </View>

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>User</Text>
            </View>

            <View style={styles.trailingArrow}>
              <Icon name="chevronRight" size={20} color="#FFB020" strokeWidth={2.4} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

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
    backgroundColor: '#F7FBFA',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    position: 'relative'
  },
  gradientBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F7FBFA',
    ...(Platform.OS === 'web'
      ? { backgroundImage: 'linear-gradient(180deg, #F7FBFA 0%, #E4F5EF 100%)' }
      : {})
  },
  gearBtn: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 24 : 48,
    right: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    zIndex: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2
  },
  mainWrapper: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    zIndex: 10
  },
  mainWrapperWide: {
    maxWidth: 420
  },
  logoArea: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40
  },
  cardArea: {
    width: '100%',
    gap: 16
  },
  roleCard: {
    width: '100%',
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.78)',
    ...(Platform.OS === 'web' ? { backdropFilter: 'blur(12px)' } : {}),
    borderRadius: CARD_RADIUS,
    paddingHorizontal: 20,
    borderWidth: 0,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 0,
    cursor: 'pointer'
  },
  adminIconTile: {
    width: 48,
    height: 48,
    borderRadius: CARD_RADIUS,
    backgroundColor: 'rgba(0, 179, 134, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16
  },
  userIconTile: {
    width: 48,
    height: 48,
    borderRadius: CARD_RADIUS,
    backgroundColor: 'rgba(255, 176, 32, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16
  },
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
  trailingArrow: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center'
  },
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
