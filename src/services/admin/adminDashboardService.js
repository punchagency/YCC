/**
 * Admin Dashboard Service
 * Handles all admin dashboard API calls for KPIs, charts, and leaderboards
 * Uses consistent API utilities and error handling
 */

import { buildApiUrl } from "../../utils/apiUtils";
import { getAuthHeader } from "../../utils/authHeader";

/**
 * Fetch user statistics (KPIs) for the first row
 * @returns {Promise<{totalCrewUsers: number, totalSuppliers: number, totalServiceProviders: number}>}
 */
export const getUserStats = async () => {
  try {
    const response = await fetch(buildApiUrl("admin/dashboard/user-stats"), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user stats:", error);
    throw new Error("Failed to fetch user statistics");
  }
};

/**
 * Fetch platform trends data for charts (second row)
 * @param {number} days - Number of days to look back (default: 30)
 * @returns {Promise<{ordersChart: Object, invoicesChart: Object, userGrowthChart: Object}>}
 */
export const getPlatformTrends = async (days = 30) => {
  try {
    const response = await fetch(
      buildApiUrl(`admin/dashboard/platform-trends?days=${days}`),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching platform trends:", error);
    throw new Error("Failed to fetch platform trends data");
  }
};

/**
 * Fetch leaderboards data for quick stats (third row)
 * @returns {Promise<{topUsers: Array, topSuppliers: Array, topServiceProviders: Array}>}
 */
export const getLeaderboards = async () => {
  try {
    const response = await fetch(buildApiUrl("admin/dashboard/leaderboards"), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching leaderboards:", error);
    throw new Error("Failed to fetch leaderboards data");
  }
};

/**
 * Fetch all dashboard data in parallel
 * @returns {Promise<{userStats: Object, platformTrends: Object, leaderboards: Object}>}
 */
export const getAllDashboardData = async () => {
  try {
    const [userStats, platformTrends, leaderboards] = await Promise.all([
      getUserStats(),
      getPlatformTrends(),
      getLeaderboards(),
    ]);

    return {
      userStats,
      platformTrends,
      leaderboards,
    };
  } catch (error) {
    console.error("Error fetching all dashboard data:", error);
    throw new Error("Failed to fetch dashboard data");
  }
};
