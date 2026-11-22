import apiClient from './apiClient.js';

export class DashboardService {
  /**
   * Fetches dashboard metrics, corporate resources, and portal overview.
   */
  static async getDashboard() {
    const response = await apiClient.get('/dashboard');
    return response.data;
  }

  /**
   * Fetches full profile from backend.
   */
  static async getProfile() {
    const response = await apiClient.get('/users/me');
    return response.data;
  }

  /**
   * Fetches admin users list (if current user is admin).
   */
  static async getAdminUsers() {
    const response = await apiClient.get('/admin/users');
    return response.data;
  }
}

export default DashboardService;
