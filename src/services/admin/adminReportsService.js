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
 * Fetch reports charts datasets (second row)
 * @param {number} period - Number of days (7, 30, 90, 180) - default: 30
 * @returns {Promise<{revenueTrend: Object, userActivity: Object, inventoryHealth: Object}>}
 */
export const getReportsCharts = async (period = 30) => {
  try {
    const response = await fetch(
      buildApiUrl(`admin/reports/charts?period=${period}`),
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

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "API request failed");
    }

    if (!result.data) {
      throw new Error("No data received from API");
    }

    return result;
  } catch (error) {
    throw new Error(`Failed to fetch reports charts data: ${error.message}`);
  }
};
