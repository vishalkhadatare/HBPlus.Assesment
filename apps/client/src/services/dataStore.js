/**
 * Central Data Store for HBPlus Workspace Application
 * Provides state and initial data for all 13 modules, with Firestore synchronization.
 */
import { db } from '../config/firebase.js';
import { collection, doc, setDoc, getDocs, updateDoc } from 'firebase/firestore';

export const initialEmployees = [
  {
    id: 'emp-1',
    name: 'Sarah Chen',
    role: 'Senior Product Designer',
    department: 'Design',
    email: 'sarah.chen@hbplus.fit',
    phone: '+1 (555) 234-5678',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    location: 'San Francisco HQ',
    joinDate: '2023-04-15',
    manager: 'Alex Morgan'
  },
  {
    id: 'emp-2',
    name: 'Marcus Vance',
    role: 'Staff Frontend Engineer',
    department: 'Engineering',
    email: 'marcus.v@hbplus.fit',
    phone: '+1 (555) 345-6789',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    location: 'Remote - New York',
    joinDate: '2022-08-10',
    manager: 'David Kim'
  },
  {
    id: 'emp-3',
    name: 'Elena Rostova',
    role: 'VP of Engineering',
    department: 'Engineering',
    email: 'elena.r@hbplus.fit',
    phone: '+1 (555) 456-7890',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    location: 'San Francisco HQ',
    joinDate: '2021-01-20',
    manager: 'CEO'
  },
  {
    id: 'emp-4',
    name: 'David Kim',
    role: 'Engineering Manager',
    department: 'Engineering',
    email: 'david.kim@hbplus.fit',
    phone: '+1 (555) 567-8901',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    location: 'San Francisco HQ',
    joinDate: '2022-03-01',
    manager: 'Elena Rostova'
  },
  {
    id: 'emp-5',
    name: 'Jessica Taylor',
    role: 'Head of People & Culture',
    department: 'HR',
    email: 'jessica.t@hbplus.fit',
    phone: '+1 (555) 678-9012',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    location: 'San Francisco HQ',
    joinDate: '2021-11-15',
    manager: 'CEO'
  },
  {
    id: 'emp-6',
    name: 'Arjun Mehta',
    role: 'DevOps & Cloud Lead',
    department: 'Engineering',
    email: 'arjun.m@hbplus.fit',
    phone: '+1 (555) 789-0123',
    status: 'Remote',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    location: 'Remote - Austin',
    joinDate: '2023-01-09',
    manager: 'David Kim'
  },
  {
    id: 'emp-7',
    name: 'Rachel Adams',
    role: 'Operations Director',
    department: 'Operations',
    email: 'rachel.a@hbplus.fit',
    phone: '+1 (555) 890-1234',
    status: 'On Leave',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    location: 'Chicago Hub',
    joinDate: '2022-06-18',
    manager: 'COO'
  },
  {
    id: 'emp-8',
    name: 'Lucas Silva',
    role: 'Fitness Content Strategist',
    department: 'Marketing',
    email: 'lucas.s@hbplus.fit',
    phone: '+1 (555) 901-2345',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    location: 'San Francisco HQ',
    joinDate: '2023-09-01',
    manager: 'Alex Morgan'
  }
];

export const initialLeaveBalances = {
  casual: { total: 12, used: 4, label: 'Casual Leave' },
  sick: { total: 7, used: 2, label: 'Sick Leave' },
  annual: { total: 18, used: 5, label: 'Annual Paid Leave' }
};

export const initialLeaveRequests = [
  {
    id: 'lr-1',
    employeeName: 'Sarah Chen',
    leaveType: 'Annual Paid Leave',
    startDate: '2026-12-01',
    endDate: '2026-12-05',
    days: 5,
    reason: 'Family holiday travel',
    status: 'Approved',
    appliedOn: '2026-11-18'
  },
  {
    id: 'lr-2',
    employeeName: 'Marcus Vance',
    leaveType: 'Sick Leave',
    startDate: '2026-11-20',
    endDate: '2026-11-20',
    days: 1,
    reason: 'Medical checkup',
    status: 'Approved',
    appliedOn: '2026-11-19'
  },
  {
    id: 'lr-3',
    employeeName: 'Rachel Adams',
    leaveType: 'Casual Leave',
    startDate: '2026-11-23',
    endDate: '2026-11-25',
    days: 3,
    reason: 'Personal family event',
    status: 'Pending',
    appliedOn: '2026-11-21'
  }
];

export const initialTasks = [
  {
    id: 'tsk-101',
    title: 'Migrate Cloud Firestore Security Rules v2',
    department: 'Engineering',
    assignee: 'Arjun Mehta',
    priority: 'High',
    status: 'In Progress',
    dueDate: '2026-11-28'
  },
  {
    id: 'tsk-102',
    title: 'Design Dark Mode Glass Tokens for Mobile',
    department: 'Design',
    assignee: 'Sarah Chen',
    priority: 'High',
    status: 'Done',
    dueDate: '2026-11-22'
  },
  {
    id: 'tsk-103',
    title: 'Finalize November Payroll Disbursement',
    department: 'Finance',
    assignee: 'Jessica Taylor',
    priority: 'Medium',
    status: 'In Review',
    dueDate: '2026-11-29'
  },
  {
    id: 'tsk-104',
    title: 'Implement Geofence Attendance Verification',
    department: 'Engineering',
    assignee: 'Marcus Vance',
    priority: 'High',
    status: 'In Progress',
    dueDate: '2026-11-26'
  },
  {
    id: 'tsk-105',
    title: 'Update Q4 Health Insurance Benefit Handbook',
    department: 'HR',
    assignee: 'Jessica Taylor',
    priority: 'Low',
    status: 'To Do',
    dueDate: '2026-12-05'
  },
  {
    id: 'tsk-106',
    title: 'Publish Q1 Corporate Strategy Roadmap',
    department: 'Executive',
    assignee: 'Elena Rostova',
    priority: 'Medium',
    status: 'Backlog',
    dueDate: '2026-12-15'
  }
];

export const initialPayslips = [
  {
    id: 'ps-2026-10',
    month: 'October 2026',
    disbursedOn: '2026-10-31',
    basic: 6500,
    hra: 2200,
    allowances: 1300,
    gross: 10000,
    pf: 600,
    tax: 900,
    net: 8500,
    status: 'Paid',
    bankAccount: '•••• 4821 (Chase Bank)'
  },
  {
    id: 'ps-2026-09',
    month: 'September 2026',
    disbursedOn: '2026-09-30',
    basic: 6500,
    hra: 2200,
    allowances: 1300,
    gross: 10000,
    pf: 600,
    tax: 900,
    net: 8500,
    status: 'Paid',
    bankAccount: '•••• 4821 (Chase Bank)'
  },
  {
    id: 'ps-2026-08',
    month: 'August 2026',
    disbursedOn: '2026-08-31',
    basic: 6500,
    hra: 2200,
    allowances: 1300,
    gross: 10000,
    pf: 600,
    tax: 900,
    net: 8500,
    status: 'Paid',
    bankAccount: '•••• 4821 (Chase Bank)'
  }
];

export const initialAnnouncements = [
  {
    id: 'ann-1',
    title: 'Annual HBPlus Global Team Summit 2027',
    content: 'Registration is now open for our annual summit in Denver, CO. All travel and accommodation expenses are covered under corporate policy.',
    priority: 'Pinned',
    department: 'Company-Wide',
    author: 'Elena Rostova, VP',
    date: '2026-11-20'
  },
  {
    id: 'ann-2',
    title: 'Upgraded Wellness & Gym Membership Credits',
    content: 'All employees now receive $200/month wellness stipend automatically eligible for fitness centers, athletic gear, and nutrition plans.',
    priority: 'Normal',
    department: 'People & Culture',
    author: 'Jessica Taylor',
    date: '2026-11-15'
  },
  {
    id: 'ann-3',
    title: 'Cloud Infrastructure Maintenance Window',
    content: 'Scheduled database maintenance will occur this Saturday from 02:00 to 04:00 UTC. Zero downtime expected for web & mobile apps.',
    priority: 'Normal',
    department: 'Engineering',
    author: 'Arjun Mehta',
    date: '2026-11-12'
  }
];

export const initialDocuments = [
  {
    id: 'doc-1',
    title: 'HBPlus Employee Handbook 2026',
    category: 'HR Policies',
    size: '3.4 MB',
    format: 'PDF',
    updatedAt: '2026-10-01'
  },
  {
    id: 'doc-2',
    title: 'Comprehensive Health & Dental Coverage Guide',
    category: 'Benefits',
    size: '2.1 MB',
    format: 'PDF',
    updatedAt: '2026-09-15'
  },
  {
    id: 'doc-3',
    title: 'Information Security & Data Protection Policy',
    category: 'IT Security',
    size: '1.8 MB',
    format: 'PDF',
    updatedAt: '2026-11-05'
  },
  {
    id: 'doc-4',
    title: 'Remote Work & Equipment Stipend Guidelines',
    category: 'Operations',
    size: '1.2 MB',
    format: 'PDF',
    updatedAt: '2026-08-20'
  }
];

export const initialOKRs = [
  {
    id: 'okr-1',
    objective: 'Accelerate Cross-Platform Mobile & Web Experience',
    category: 'Engineering',
    progress: 88,
    status: 'Exceeding',
    keyResults: [
      { text: 'Reduce APK binary size below 5MB', current: '4.06 MB', target: '< 5 MB', done: true },
      { text: 'Sub-100ms dashboard latency on 4G networks', current: '76ms', target: '< 100ms', done: true },
      { text: 'Complete 100% automated test coverage across routes', current: '94%', target: '100%', done: false }
    ]
  },
  {
    id: 'okr-2',
    objective: 'Expand Corporate Wellness & Fitness Brand Engagement',
    category: 'Product & Fitness',
    progress: 74,
    status: 'On Track',
    keyResults: [
      { text: 'Onboard 15,000 corporate members to HBPlus fitness tiers', current: '12,400', target: '15,000', done: false },
      { text: 'Achieve 99.9% uptime on daily attendance logging', current: '99.94%', target: '99.9%', done: true }
    ]
  }
];

export const initialHelpdeskTickets = [
  {
    id: 'tkt-401',
    subject: 'Request external monitor for remote workstation',
    category: 'Hardware',
    priority: 'Medium',
    status: 'In Progress',
    createdAt: '2026-11-22',
    requester: 'Marcus Vance',
    responses: 2
  },
  {
    id: 'tkt-402',
    subject: 'Figma Organization seat license provisioning',
    category: 'Software',
    priority: 'High',
    status: 'Resolved',
    createdAt: '2026-11-19',
    requester: 'Sarah Chen',
    responses: 3
  },
  {
    id: 'tkt-403',
    subject: 'Query regarding travel reimbursement tax exemption',
    category: 'HR & Finance',
    priority: 'Low',
    status: 'Open',
    createdAt: '2026-11-23',
    requester: 'David Kim',
    responses: 1
  }
];

export const initialShifts = [
  { employee: 'Sarah Chen', role: 'Designer', monday: '09:00 - 18:00', tuesday: '09:00 - 18:00', wednesday: '09:00 - 18:00', thursday: '09:00 - 18:00', friday: '09:00 - 18:00' },
  { employee: 'Marcus Vance', role: 'Frontend', monday: '09:00 - 18:00', tuesday: '09:00 - 18:00', wednesday: '09:00 - 18:00', thursday: '09:00 - 18:00', friday: '09:00 - 18:00' },
  { employee: 'Arjun Mehta', role: 'DevOps', monday: '14:00 - 23:00', tuesday: '14:00 - 23:00', wednesday: '14:00 - 23:00', thursday: '14:00 - 23:00', friday: '14:00 - 23:00' },
  { employee: 'Lucas Silva', role: 'Marketing', monday: '09:00 - 18:00', tuesday: '09:00 - 18:00', wednesday: '09:00 - 18:00', thursday: '09:00 - 18:00', friday: '09:00 - 18:00' }
];

export default {
  initialEmployees,
  initialLeaveBalances,
  initialLeaveRequests,
  initialTasks,
  initialPayslips,
  initialAnnouncements,
  initialDocuments,
  initialOKRs,
  initialHelpdeskTickets,
  initialShifts
};
