/**
 * workforceStore.js
 * Reactive, shared state store bridging Employee & Admin operations in real time.
 * Synchronizes profiles, live geofence attendance, leave approval workflows,
 * audit logging, and company announcements.
 */

import { initialEmployees, initialLeaveBalances, initialLeaveRequests, initialTasks, initialAnnouncements } from './dataStore.js';

const STORAGE_KEY = 'hbplus_workforce_store_v2';

// Initial state
const defaultState = {
  profile: {
    displayName: '',
    email: '',
    phone: '',
    countryCode: '+91',
    countryIso: 'IN',
    department: 'Engineering Systems',
    designation: 'Enterprise Specialist',
    employeeId: 'HBP-2026-0001',
    joinDate: '2026-01-15',
    location: 'Bangalore HQ (Campus Alpha)',
    emergencyContact: 'Security Operations (+91 98000 11223)',
    bio: 'Enterprise workforce member with verified domain access.',
    notificationsEnabled: true,
    shift: 'General Corporate Shift (09:00 AM – 06:00 PM)'
  },
  adminProfile: {
    displayName: 'Elena Rostova',
    email: 'elena.rostova@hbplus.fit',
    phone: '+91 99887 76655',
    countryCode: '+91',
    countryIso: 'IN',
    department: 'Platform Governance & Security',
    designation: 'Principal Security Administrator',
    employeeId: 'HBP-ADM-001',
    clearanceLevel: 'Level 4 (Full Governance Authority)',
    joinDate: '2021-08-01',
    location: 'Bangalore HQ (Security Command Room)',
    emergencyContact: 'Chief Security Officer (+91 98000 11223)',
    bio: 'Principal system security architect managing enterprise access governance, strict domain compliance, and organizational telemetry across HB Plus.',
    mfaStatus: 'Hardware FIDO2 Security Key Enforced',
    soc2Status: 'Compliant (SOC2 Type II)'
  },
  isCheckedIn: false,
  checkInTime: null,
  presentCount: 231,
  totalWorkforce: 248,
  leaveBalances: {
    annual: { total: 18, used: 4, label: 'Annual Paid' },
    sick: { total: 8, used: 2, label: 'Medical/Sick' },
    casual: { total: 5, used: 1, label: 'Casual' }
  },
  leaveRequests: [
    ...initialLeaveRequests,
    {
      id: 'lr-auto-1',
      employeeName: 'Rachel Green',
      department: 'Engineering Systems',
      leaveType: 'Annual Paid Leave',
      startDate: '2026-11-28',
      endDate: '2026-11-30',
      days: 3,
      reason: 'Family wedding event',
      status: 'Pending',
      appliedOn: '2026-11-23'
    }
  ],
  employees: [
    ...initialEmployees
  ],
  auditLogs: [
    { id: 'log-1', text: 'System health check completed. All security policies operational.', time: 'Just now', type: 'system' },
    { id: 'log-2', text: 'Rachel Green checked in at HQ Zone A (Geofence Verified).', time: '12m ago', type: 'attendance' },
    { id: 'log-3', text: 'Marcus Vance submitted Annual Leave request (Nov 26 - Nov 30).', time: '28m ago', type: 'leave' },
    { id: 'log-4', text: 'Administrator Elena verified domain strict policy @hbplus.fit.', time: '1h ago', type: 'security' },
    { id: 'log-5', text: 'David Kim updated Engineering sprint goals for Q4.', time: '2h ago', type: 'team' }
  ],
  announcements: [
    ...initialAnnouncements
  ],
  tasks: [
    { id: 't1', title: 'Submit Q4 Self-Assessment Review', due: 'Today, 5:00 PM', completed: false },
    { id: 't2', title: 'Review Security Awareness & Domain Training', due: 'Tomorrow', completed: true },
    { id: 't3', title: 'Confirm Annual Flexible Benefits Enrollment', due: 'Nov 30', completed: false }
  ]
};

// Load saved state or default
function loadState() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return { ...defaultState };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultState };
    const parsed = JSON.parse(raw);
    if (parsed.profile?.displayName === 'Rachel Green') {
      parsed.profile.displayName = '';
    }
    if (parsed.profile?.email === 'rachel.green@hbplus.fit') {
      parsed.profile.email = '';
    }
    return {
      ...defaultState,
      ...parsed,
      leaveBalances: { ...defaultState.leaveBalances, ...(parsed.leaveBalances || {}) },
      profile: { ...defaultState.profile, ...(parsed.profile || {}) },
      adminProfile: { ...defaultState.adminProfile, ...(parsed.adminProfile || {}) }
    };
  } catch {
    return { ...defaultState };
  }
}

let state = loadState();
const listeners = new Set();

function notify() {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }
  listeners.forEach((listener) => {
    try {
      listener(state);
    } catch {}
  });
}

export const workforceStore = {
  getState() {
    return state;
  },

  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  // ── Profile Updates ──
  updateProfile(updates) {
    state = {
      ...state,
      profile: {
        ...state.profile,
        ...updates
      }
    };
    // Also update current user in employees list
    state.employees = state.employees.map((emp) => {
      if (emp.email === state.profile.email || emp.name === state.profile.displayName) {
        return {
          ...emp,
          name: updates.displayName || emp.name,
          phone: updates.phone || emp.phone,
          department: updates.department || emp.department,
          role: updates.designation || emp.role
        };
      }
      return emp;
    });

    // Add audit log entry
    this.addAuditLog(`User ${state.profile.displayName} updated their corporate profile.`);
    notify();
    return state.profile;
  },

  // ── Admin Profile Updates ──
  updateAdminProfile(updates) {
    state = {
      ...state,
      adminProfile: {
        ...state.adminProfile,
        ...updates
      }
    };
    this.addAuditLog(`Administrator ${state.adminProfile.displayName} updated security credentials and contact profile.`, 'security');
    notify();
    return state.adminProfile;
  },

  // ── Attendance Check-In / Clock-Out ──
  toggleCheckIn() {
    const nowChecked = !state.isCheckedIn;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    state = {
      ...state,
      isCheckedIn: nowChecked,
      checkInTime: nowChecked ? timeStr : null,
      presentCount: nowChecked ? state.presentCount + 1 : Math.max(0, state.presentCount - 1)
    };

    const actionText = nowChecked
      ? `${state.profile.displayName} checked in at ${timeStr} (1-Tap Geofence Verified).`
      : `${state.profile.displayName} clocked out at ${timeStr}.`;

    this.addAuditLog(actionText, 'attendance');
    notify();
    return state.isCheckedIn;
  },

  // ── Apply for Leave (From Employee to Admin Pending Queue) ──
  applyLeave({ leaveType, startDate, endDate, days = 1, reason }) {
    const newRequest = {
      id: `lr-${Date.now()}`,
      employeeName: state.profile.displayName,
      department: state.profile.department,
      leaveType,
      startDate,
      endDate,
      days: Number(days) || 1,
      reason: reason || 'Personal/Family necessity',
      status: 'Pending',
      appliedOn: new Date().toISOString().split('T')[0]
    };

    state = {
      ...state,
      leaveRequests: [newRequest, ...state.leaveRequests]
    };

    this.addAuditLog(`New leave request submitted by ${state.profile.displayName}: ${leaveType} (${days} days).`, 'leave');
    notify();
    return newRequest;
  },

  // ── Admin Approves / Rejects Leave ──
  actionLeaveRequest(id, action) {
    const req = state.leaveRequests.find((r) => r.id === id);
    if (!req) return;

    const newStatus = action === 'approve' ? 'Approved' : 'Rejected';

    state = {
      ...state,
      leaveRequests: state.leaveRequests.map((r) =>
        r.id === id ? { ...r, status: newStatus } : r
      )
    };

    // If approved and matches current user, adjust balances
    if (action === 'approve' && req.employeeName === state.profile.displayName) {
      const typeKey = req.leaveType.toLowerCase().includes('sick')
        ? 'sick'
        : req.leaveType.toLowerCase().includes('casual')
        ? 'casual'
        : 'annual';

      if (state.leaveBalances[typeKey]) {
        state.leaveBalances[typeKey].used = Math.min(
          state.leaveBalances[typeKey].total,
          state.leaveBalances[typeKey].used + (req.days || 1)
        );
      }
    }

    this.addAuditLog(
      `Administrator ${action === 'approve' ? 'approved' : 'rejected'} ${req.leaveType} for ${req.employeeName}.`,
      'approval'
    );
    notify();
  },

  // ── Post Announcement (Admin to Employees) ──
  addAnnouncement({ title, content, priority = 'Normal', department = 'Company-Wide' }) {
    const newAnn = {
      id: `ann-${Date.now()}`,
      title,
      content,
      priority,
      department,
      author: 'Admin Portal',
      date: new Date().toISOString().split('T')[0]
    };

    state = {
      ...state,
      announcements: [newAnn, ...state.announcements]
    };

    this.addAuditLog(`New corporate announcement broadcasted: "${title}".`, 'announcement');
    notify();
    return newAnn;
  },

  // ── Tasks Toggle ──
  toggleTask(taskId) {
    state = {
      ...state,
      tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    };
    notify();
  },

  // ── Add Audit Log ──
  addAuditLog(text, type = 'system') {
    const entry = {
      id: `log-${Date.now()}`,
      text,
      time: 'Just now',
      type
    };
    state = {
      ...state,
      auditLogs: [entry, ...state.auditLogs.slice(0, 19)]
    };
    notify();
  }
};

export default workforceStore;
