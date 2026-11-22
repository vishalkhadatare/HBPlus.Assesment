import { useState, useEffect, useCallback } from 'react';
import { DashboardService } from '../services/dashboardService.js';
import { useAuth } from './useAuth.js';

/**
 * Custom hook for dashboard data fetching and state management.
 */
export function useDashboard() {
  const { isAuthorized } = useAuth();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    if (!isAuthorized) {
      setData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const result = await DashboardService.getDashboard();
      setData(result);
    } catch (err) {
      console.error('[useDashboard] Failed to fetch dashboard data:', err);
      setError(err.message || 'Unable to retrieve dashboard information.');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthorized]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    dashboardData: data,
    isLoading,
    error,
    refresh: fetchDashboard
  };
}

export default useDashboard;
