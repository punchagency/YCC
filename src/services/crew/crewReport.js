import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;

/**
 * Get dashboard summary report data
 * @param {Object} params - Optional query parameters
 * @returns {Promise<Object>} - Dashboard summary data
 */
export const getDashboardSummary = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/crew-reports/dashboard`, {
      params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return {
      status: true,
      data: response.data,
      message: "Dashboard summary data retrieved successfully",
    };
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    return {
      status: false,
      data: null,
      message:
        error.response?.data?.message || "Failed to retrieve dashboard summary",
      error: error.response?.data || error.message,
    };
  }
};

/**
 * Get order report data
 * @param {Object} params - Optional query parameters (date range, status, etc.)
 * @returns {Promise<Object>} - Order report data
 */
export const getOrderReport = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/crew-reports/orders`, {
      params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return {
      status: true,
      data: response.data,
      message: "Order report data retrieved successfully",
    };
  } catch (error) {
    console.error("Error fetching order reports:", error);
    return {
      status: false,
      data: null,
      message:
        error.response?.data?.message || "Failed to retrieve order reports",
      error: error.response?.data || error.message,
    };
  }
};

/**
 * Get booking report data
 * @param {Object} params - Optional query parameters (date range, status, etc.)
 * @returns {Promise<Object>} - Booking report data
 */
export const getBookingReport = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/crew-reports/bookings`, {
      params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return {
      status: true,
      data: response.data,
      message: "Booking report data retrieved successfully",
    };
  } catch (error) {
    console.error("Error fetching booking reports:", error);
    return {
      status: false,
      data: null,
      message:
        error.response?.data?.message || "Failed to retrieve booking reports",
      error: error.response?.data || error.message,
    };
  }
};

/**
 * Get inventory report data
 * @param {Object} params - Optional query parameters (categories, status, etc.)
 * @returns {Promise<Object>} - Inventory report data
 */
export const getInventoryReport = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/crew-reports/inventory`, {
      params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return {
      status: true,
      data: response.data,
      message: "Inventory report data retrieved successfully",
    };
  } catch (error) {
    console.error("Error fetching inventory reports:", error);
    return {
      status: false,
      data: null,
      message:
        error.response?.data?.message || "Failed to retrieve inventory reports",
      error: error.response?.data || error.message,
    };
  }
};

/**
 * Export report data as CSV
 * @param {string} reportType - Type of report (dashboard, orders, bookings, inventory)
 * @param {Object} params - Optional query parameters
 * @returns {Promise<Object>} - CSV data or download URL
 */
export const exportReportCSV = async (reportType, params = {}) => {
  try {
    const response = await axios.get(
      `${API_URL}/crew-reports/${reportType}/export`,
      {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "text/csv",
        },
        responseType: "blob",
      }
    );

    // Create a download link for the CSV file
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${reportType}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return {
      status: true,
      message: `${reportType} report exported successfully`,
    };
  } catch (error) {
    console.error(`Error exporting ${reportType} report:`, error);
    return {
      status: false,
      message:
        error.response?.data?.message ||
        `Failed to export ${reportType} report`,
      error: error.response?.data || error.message,
    };
  }
};
