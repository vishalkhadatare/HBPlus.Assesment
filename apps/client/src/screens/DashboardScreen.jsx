import React, { useState } from 'react';
import { View, StyleSheet, Modal, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../hooks/useAuth.js';
import ModernAppLayout from '../components/layout/ModernAppLayout.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import ErrorMessage from '../components/common/ErrorMessage.jsx';

// Modules
import DashboardOverviewView from '../components/modules/DashboardOverviewView.jsx';
import DirectoryView from '../components/modules/DirectoryView.jsx';
import AttendanceView from '../components/modules/AttendanceView.jsx';
import LeaveView from '../components/modules/LeaveView.jsx';
import ShiftsView from '../components/modules/ShiftsView.jsx';
import PayrollView from '../components/modules/PayrollView.jsx';
import TasksView from '../components/modules/TasksView.jsx';
import PerformanceView from '../components/modules/PerformanceView.jsx';
import AnnouncementsView from '../components/modules/AnnouncementsView.jsx';
import DocumentsView from '../components/modules/DocumentsView.jsx';
import HelpdeskView from '../components/modules/HelpdeskView.jsx';
import ReportsView from '../components/modules/ReportsView.jsx';
import AdminSettingsView from '../components/modules/AdminSettingsView.jsx';
import UiGalleryScreen from './UiGalleryScreen.jsx';
import Icon from '../components/ui/Icon.jsx';

export function DashboardScreen() {
  const { user, profile, role, isLoading, error, clearError, signOut } = useAuth();
  const [activeModule, setActiveModule] = useState('dashboard');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Normalized role string
  const normalizedRole = (role || 'user').toLowerCase() === 'admin' ? 'Admin' : 'User';

  if (isLoading && !profile && !user) {
    return <LoadingSpinner fullScreen message="Verifying secure access credentials..." />;
  }

  const handleModuleSelect = (moduleId) => {
    // Role guard: Only Admins can navigate to admin module
    if (moduleId === 'admin' && normalizedRole !== 'Admin') {
      setActiveModule('dashboard');
      return;
    }
    setActiveModule(moduleId);
  };

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return (
          <DashboardOverviewView
            onNavigate={handleModuleSelect}
            user={user}
            profile={profile}
            role={normalizedRole}
          />
        );
      case 'directory':
        return <DirectoryView role={normalizedRole} />;
      case 'attendance':
        return <AttendanceView role={normalizedRole} />;
      case 'leave':
        return <LeaveView role={normalizedRole} />;
      case 'shifts':
        return <ShiftsView role={normalizedRole} />;
      case 'payroll':
        return <PayrollView role={normalizedRole} />;
      case 'tasks':
        return <TasksView role={normalizedRole} />;
      case 'performance':
        return <PerformanceView role={normalizedRole} />;
      case 'announcements':
        return <AnnouncementsView role={normalizedRole} />;
      case 'documents':
        return <DocumentsView role={normalizedRole} />;
      case 'helpdesk':
        return <HelpdeskView role={normalizedRole} />;
      case 'reports':
        return <ReportsView role={normalizedRole} />;
      case 'admin':
        if (normalizedRole !== 'Admin') {
          return (
            <DashboardOverviewView
              onNavigate={handleModuleSelect}
              user={user}
              profile={profile}
              role={normalizedRole}
            />
          );
        }
        return (
          <AdminSettingsView
            user={user}
            profile={profile}
            role={normalizedRole}
            onOpenGallery={() => setActiveModule('ui-gallery')}
          />
        );
      case 'ui-gallery':
        return <UiGalleryScreen onBack={() => setActiveModule('dashboard')} />;
      default:
        return (
          <DashboardOverviewView
            onNavigate={handleModuleSelect}
            user={user}
            profile={profile}
            role={normalizedRole}
          />
        );
    }
  };

  return (
    <ModernAppLayout
      activeModule={activeModule}
      onSelectModule={handleModuleSelect}
      onSignOut={() => setShowLogoutConfirm(true)}
      user={user}
      profile={profile}
      role={normalizedRole}
    >
      <View style={styles.contentWrapper}>
        {error ? (
          <View style={styles.errorContainer}>
            <ErrorMessage message={error} onDismiss={clearError} />
          </View>
        ) : null}

        {renderActiveModule()}
      </View>

      {/* Logout Confirmation Sheet */}
      {showLogoutConfirm ? (
        <Modal
          visible={showLogoutConfirm}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowLogoutConfirm(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.confirmCard}>
              <View style={styles.confirmIconTile}>
                <Icon name="logOut" size={24} color="#F04438" />
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
                  style={styles.signOutBtn}
                  onPress={() => {
                    setShowLogoutConfirm(false);
                    signOut();
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.signOutBtnText}>Sign Out</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      ) : null}
    </ModernAppLayout>
  );
}

const styles = StyleSheet.create({
  contentWrapper: {
    flex: 1,
    minWidth: 0
  },
  errorContainer: {
    marginBottom: 16
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(4, 16, 14, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  confirmCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    gap: 12,
    boxShadow: '0 20px 48px rgba(0,0,0,0.3)',
    elevation: 8
  },
  confirmIconTile: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FEE4E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0A1A17'
  },
  confirmText: {
    fontSize: 13.5,
    color: '#51635E',
    textAlign: 'center',
    lineHeight: 20
  },
  confirmActionRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginTop: 8
  },
  cancelBtn: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DDE8E5',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#51635E'
  },
  signOutBtn: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#F04438',
    alignItems: 'center',
    justifyContent: 'center'
  },
  signOutBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF'
  }
});

export default DashboardScreen;
