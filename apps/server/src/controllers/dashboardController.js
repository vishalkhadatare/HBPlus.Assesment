import { DashboardService } from '../services/dashboardService.js';
import { successResponse } from '../utils/apiResponse.js';

export class DashboardController {
  /**
   * GET /api/dashboard
   * Returns dashboard metrics and status for authorized users.
   */
  static async getDashboard(req, res, next) {
    try {
      const data = await DashboardService.getDashboardMetrics(req.user);
      return res.status(200).json(
        successResponse('Dashboard data retrieved successfully', data)
      );
    } catch (error) {
      next(error);
    }
  }
}

export default DashboardController;
