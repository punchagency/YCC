import { getAuthHeader } from "../utils/authHeader";
import { buildApiUrl } from "../utils/apiUtils";

/**
 * Fetch all invoices with pagination for admin financial management
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Items per page (default: 20)
 * @returns {Promise<Object>} - Invoice data with pagination and summary
 */
export const getAdminInvoices = async (page = 1, limit = 20) => {
  try {
    const response = await fetch(
      `${buildApiUrl(
        "admin/financial-management/invoices"
      )}?page=${page}&limit=${limit}`,
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
    console.error("Error fetching admin invoices:", error);
    throw error;
  }
};

/**
 * Fetch financial statistics for admin dashboard
 * @param {string} startDate - Start date for statistics (optional)
 * @param {string} endDate - End date for statistics (optional)
 * @returns {Promise<Object>} - Financial statistics data
 */
export const getAdminFinancialStatistics = async (
  startDate = null,
  endDate = null
) => {
  try {
    let url = buildApiUrl("admin/financial-management/statistics");
    const params = new URLSearchParams();

    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url, {
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
    console.error("Error fetching financial statistics:", error);
    throw error;
  }
};
