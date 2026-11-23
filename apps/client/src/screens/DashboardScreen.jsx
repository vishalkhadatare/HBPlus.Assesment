import React, { useState } from 'react';
import { View, StyleSheet, Modal, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../hooks/useAuth.js';
import AdminShell from '../components/layout/AdminShell.jsx';
import UserShell from '../components/layout/UserShell.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import ErrorMessage from '../components/common/ErrorMessage.jsx';
import Icon from '../components/ui/Icon.jsx';
import { CARD_RADIUS } from '../theme/shape.js';

export function DashboardScreen() {
  const { user, profile, role, isLoading, error, clearError, signOut, isAdmin } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // During auth resolution: never flash the other role's theme
  if (isLoading && !profile && !user) {
    return (
      <View style={styles.loadingNeutral}>
        <LoadingSpinner message="Verifying credentials..." />
      </View>
    );
  }

  const handleSignOutConfirmed = async () => {
    setShowLogoutConfirm(false);
    await signOut();
  };

  return (
    <View style={styles.root}>
      {error ? (
        <View style={styles.errorOverlay}>
          <ErrorMessage message={error} onDismiss={clearError} />
        </View>
      ) : null}

      {/* Render dedicated role shell */}
      {isAdmin ? (
        <AdminShell onSignOut={() => setShowLogoutConfirm(true)} />
      ) : (
        <UserShell onSignOut={() => setShowLogoutConfirm(true)} />
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <Modal
          visible={showLogoutConfirm}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowLogoutConfirm(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.confirmCard}>
              <View style={styles.confirmIconTile}>
                <Icon name="logout" size={24} color="#EF4444" />
              </View>
              <Text style={styles.confirmTitle}>Confirm Sign Out</Text>
              <Text style={styles.confirmText}>
                Are you sure you want to end your session? You will be returned to the HBPlus welcome portal.
              </Text>
              <View style={styles.confirmActionRow}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setShowLogoutConfirm(false)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.confirmSignOutBtn}
                  onPress={handleSignOutConfirmed}
                  activeOpacity={0.8}
                >
                  <Text style={styles.confirmSignOutText}>Sign Out</Text>
                </TouchableOpacity>
              </View>
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
    backgroundColor: '#F7FBFA'
  },
  loadingNeutral: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7FBFA'
  },
  errorOverlay: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 999
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  confirmCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: CARD_RADIUS,
    padding: 24,
    alignItems: 'center',
    gap: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8
  },
  confirmIconTile: {
    width: 48,
    height: 48,
    borderRadius: CARD_RADIUS,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center'
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A'
  },
  confirmText: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18
  },
  confirmActionRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginTop: 6
  },
  cancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: CARD_RADIUS,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569'
  },
  confirmSignOutBtn: {
    flex: 1,
    height: 44,
    borderRadius: CARD_RADIUS,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center'
  },
  confirmSignOutText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF'
  }
});

export default DashboardScreen;
