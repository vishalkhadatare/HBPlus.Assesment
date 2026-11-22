import { UserService } from './userService.js';
import config from '../config/environment.js';

export class DashboardService {
  /**
   * Retrieves dashboard statistics and service data tailored to the authenticated user's role.
   * @param {object} user - Authenticated user context from req.user
   * @returns {Promise<object>}
   */
  static async getDashboardMetrics(user) {
    const isUserAdmin = user.role === 'admin';

    // Base corporate portal information
    const portalOverview = {
      organizationName: 'HBPlus Fitness & Health International',
      enforcedDomain: config.ALLOWED_EMAIL_DOMAIN,
      portalVersion: '2.4.0',
      systemStatus: 'Operational',
      securityStatus: 'Enforced (Domain Restricted & Multi-Factor Guarded)',
      serverTime: new Date().toISOString()
    };

    // User-specific information
    const userSummary = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || 'Authorized Member',
      role: user.role,
      lastLogin: new Date().toISOString(),
      authorizedDomain: config.ALLOWED_EMAIL_DOMAIN
    };

    // Role-dependent stats
    let metrics = [];
    if (isUserAdmin) {
      const allUsers = await UserService.getAllUsers();
      const activeCount = allUsers.filter((u) => u.isActive !== false).length;
      const adminCount = allUsers.filter((u) => u.role === 'admin').length;

      metrics = [
        { id: 'total-members', label: 'Authorized Employees', value: allUsers.length || 1, change: '+12% this month' },
        { id: 'active-sessions', label: 'Active Sessions', value: activeCount || 1, change: 'Normal' },
        { id: 'security-posture', label: 'Domain Filter Rate', value: '100%', change: 'Enforced' },
        { id: 'admins', label: 'System Administrators', value: adminCount || 1, change: 'Restricted' }
      ];
    } else {
      metrics = [
        { id: 'membership-tier', label: 'Access Tier', value: 'Corporate Staff', change: 'Verified' },
        { id: 'locations-access', label: 'Facility Access', value: 'All Locations', change: 'Unlimited' },
        { id: 'wellness-credits', label: 'Wellness Credits', value: '$1,200 / yr', change: 'Active' },
        { id: 'security-compliance', label: 'Domain Validation', value: 'Compliant', change: 'hbplus.fit' }
      ];
    }

    // Corporate resources available to staff
    const corporateResources = [
      { id: 'res-1', title: 'Internal Directory & Staff Portal', category: 'HR & Directory', status: 'Available' },
      { id: 'res-2', title: 'HBPlus Gym & Studio Booking Pass', category: 'Facilities', status: 'Active' },
      { id: 'res-3', title: 'Corporate Health & Nutrition Dashboard', category: 'Health & Perks', status: 'Connected' },
      { id: 'res-4', title: 'IT Security & Single Sign-On Helpdesk', category: 'Support', status: 'Online' }
    ];

    return {
      portalOverview,
      userSummary,
      metrics,
      corporateResources
    };
  }
}

export default DashboardService;
