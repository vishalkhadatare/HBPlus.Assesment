import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
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

export function DashboardScreen() {
  const { user, profile, role: initialRole, isLoading, error, clearError } = useAuth();
  const [activeModule, setActiveModule] = useState('dashboard');
  const [currentRole, setCurrentRole] = useState(() => initialRole || 'User');

  const toggleRole = () => {
    setCurrentRole((prev) => (prev === 'Admin' ? 'User' : 'Admin'));
  };

  if (isLoading && !profile && !user) {
    return <LoadingSpinner fullScreen message="Loading secure HBPlus workspace..." />;
  }

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return (
          <DashboardOverviewView
            onNavigate={setActiveModule}
            user={user}
            profile={profile}
            role={currentRole}
          />
        );
      case 'directory':
        return <DirectoryView role={currentRole} />;
      case 'attendance':
        return <AttendanceView role={currentRole} />;
      case 'leave':
        return <LeaveView role={currentRole} />;
      case 'shifts':
        return <ShiftsView role={currentRole} />;
      case 'payroll':
        return <PayrollView role={currentRole} />;
      case 'tasks':
        return <TasksView role={currentRole} />;
      case 'performance':
        return <PerformanceView role={currentRole} />;
      case 'announcements':
        return <AnnouncementsView role={currentRole} />;
      case 'documents':
        return <DocumentsView role={currentRole} />;
      case 'helpdesk':
        return <HelpdeskView role={currentRole} />;
      case 'reports':
        return <ReportsView role={currentRole} />;
      case 'admin':
        return (
          <AdminSettingsView
            user={user}
            profile={profile}
            role={currentRole}
            onToggleRole={toggleRole}
          />
        );
      default:
        return (
          <DashboardOverviewView
            onNavigate={setActiveModule}
            user={user}
            profile={profile}
            role={currentRole}
          />
        );
    }
  };

  return (
    <ModernAppLayout
      activeModule={activeModule}
      onSelectModule={setActiveModule}
      role={currentRole}
      onToggleRole={toggleRole}
    >
      {error ? (
        <View style={styles.errorBanner}>
          <ErrorMessage message={error} onRetry={clearError} retryLabel="Dismiss" />
        </View>
      ) : null}

      {renderActiveModule()}
    </ModernAppLayout>
  );
}

const styles = StyleSheet.create({
  errorBanner: {
    marginBottom: 12
  }
});

export default DashboardScreen;
