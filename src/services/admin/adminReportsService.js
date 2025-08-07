/**
 * Admin Reports Service
 * Handles all admin reports API calls for KPIs and charts
 * Uses consistent API utilities and error handling
 * Follows the same pattern as adminDashboardService.js
 */

import { buildApiUrl } from "../../utils/apiUtils";
import { getAuthHeader } from "../../utils/authHeader";

/**
 * Fetch reports overview data (all first row KPIs)
 * @param {number} period - Number of days (7, 30, 90, 180) - default: 30
 * @returns {Promise<{revenue: Object, activeUsers: Object, inventory: Object, bookings: Object}>}
 */
export const getReportsOverview = async (period = 30) => {
  try {
    const response = await fetch(
      buildApiUrl(`admin/reports/overview?period=${period}`),
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
    console.error("Error fetching reports overview:", error);
    throw new Error("Failed to fetch reports overview data");
  }
};

/**
 * Fetch revenue statistics with trend data
 * @param {number} period - Number of days (7, 30, 90, 180) - default: 30
 * @returns {Promise<{current: number, previous: number, change: number, trend: Array, period: number}>}
 */
export const getRevenueStats = async (period = 30) => {
  try {
    const response = await fetch(
      buildApiUrl(`admin/reports/revenue?period=${period}`),
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
    console.error("Error fetching revenue stats:", error);
    throw new Error("Failed to fetch revenue statistics");
  }
};

/**
 * Fetch active users statistics with trend data
 * @param {number} period - Number of days (7, 30, 90, 180) - default: 30
 * @returns {Promise<{total: number, active: number, ratio: string, percentage: number, trend: Array}>}
 */
export const getActiveUsersStats = async (period = 30) => {
  try {
    const response = await fetch(
      buildApiUrl(`admin/reports/users?period=${period}`),
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
    console.error("Error fetching active users stats:", error);
    throw new Error("Failed to fetch active users statistics");
  }
};

/**
 * Fetch inventory health statistics
 * @returns {Promise<{total: number, inStock: number, alerts: number, healthScore: number, status: string}>}
 */
export const getInventoryHealthStats = async () => {
  try {
    const response = await fetch(buildApiUrl("admin/reports/inventory"), {
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
    console.error("Error fetching inventory health stats:", error);
    throw new Error("Failed to fetch inventory health statistics");
  }
};

/**
 * Fetch booking performance statistics with trend data
 * @param {number} period - Number of days (7, 30, 90, 180) - default: 30
 * @returns {Promise<{total: number, completed: number, successRate: number, change: number, trend: Array}>}
 */
export const getBookingPerformanceStats = async (period = 30) => {
  try {
    const response = await fetch(
      buildApiUrl(`admin/reports/bookings?period=${period}`),
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
    console.error("Error fetching booking performance stats:", error);
    throw new Error("Failed to fetch booking performance statistics");
  }
};

/**
 * Fetch all reports data in parallel
 * @param {number} period - Number of days (7, 30, 90, 180) - default: 30
 * @returns {Promise<{revenue: Object, activeUsers: Object, inventory: Object, bookings: Object}>}
 */
export const getAllReportsData = async (period = 30) => {
  try {
    const [revenue, activeUsers, inventory, bookings] = await Promise.all([
      getRevenueStats(period),
      getActiveUsersStats(period),
      getInventoryHealthStats(),
      getBookingPerformanceStats(period),
    ]);

    return {
      revenue: revenue.data,
      activeUsers: activeUsers.data,
      inventory: inventory.data,
      bookings: bookings.data,
    };
  } catch (error) {
    console.error("Error fetching all reports data:", error);
    throw new Error("Failed to fetch reports data");
  }
};
