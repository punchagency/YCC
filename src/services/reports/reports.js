import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const getInventoryHealthReport = async () => {
  try {
    const response = await axios.get(`${API_URL}/reports/inventory-health`, {
      headers: getAuthHeader(),
    });
    return {
      success: true,
      data: response.data,
      message: response.data.message,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.message ||
        "Failed to fetch inventory health report",
    };
  }
};

const getSystemChartData = async () => {
  try {
    const response = await axios.get(`${API_URL}/reports/system-activity`, {
      headers: getAuthHeader(),
    });
    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.message || "Failed to fetch system activity data",
    };
  }
};

const getSystemMetrics = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/reports/system-metrics-overview`,
      {
        headers: getAuthHeader(),
      }
    );
    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch system metrics",
    };
  }
};

const downloadInventoryReport = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/reports/inventory-report?format=pdf`,
      {
        headers: getAuthHeader(),
        responseType: "blob", // Important for handling PDF files
      }
    );

    // Create a blob from the PDF content
    const blob = new Blob([response.data], { type: "application/pdf" });

    // Create a link to download the file
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "inventory-report.pdf");

    // Append to body, click and cleanup
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.message || "Failed to download inventory report",
    };
  }
};

//for downloading order report, inventory report, booking report, financial report

const downloadOrderReport = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/reports/order-report?format=pdf`,
      {
        headers: getAuthHeader(),
        responseType: "blob", // Important for handling PDF files
      }
    );

    // Create a blob from the PDF content
    const blob = new Blob([response.data], { type: "application/pdf" });

    // Create a link to download the file
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "order-report.pdf");

    // Append to body, click and cleanup
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to download order report",
    };
  }
};

const downloadBookingReport = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/reports/booking-report?format=pdf`,
      {
        headers: getAuthHeader(),
        responseType: "blob",
      }
    );

    // Create a blob from the PDF content
    const blob = new Blob([response.data], { type: "application/pdf" });

    // Create a link to download the file
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "booking-report.pdf");

    // Append to body, click and cleanup
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.message || "Failed to download booking report",
    };
  }
};

const downloadFinancialReport = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/reports/financial-report?format=pdf`,
      {
        headers: getAuthHeader(),
        responseType: "blob",
      }
    );

    // Create a blob from the PDF content
    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "financial-report.pdf");

    // Append to body, click and cleanup
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.message || "Failed to download financial report",
    };
  }
};

// Add Excel download functions
const downloadInventoryExcel = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/reports/inventory-report?format=excel`,
      {
        headers: getAuthHeader(),
        responseType: "blob",
      }
    );

    const blob = new Blob([response.data], {
      type: "application/vnd.ms-excel",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "inventory-report.xlsx");
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.message || "Failed to download inventory excel",
    };
  }
};

// Add similar functions for other Excel reports
const downloadOrderExcel = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/reports/order-report?format=xlsx`,
      {
        headers: getAuthHeader(),
        responseType: "blob",
      }
    );

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "order-report.xlsx");
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to download order excel",
    };
  }
};

const downloadBookingExcel = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/reports/booking-report?format=xlsx`,
      {
        headers: getAuthHeader(),
        responseType: "blob",
      }
    );

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "booking-report.xlsx");
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.message || "Failed to download booking excel",
    };
  }
};

const downloadFinancialExcel = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/reports/financial-report?format=xlsx`,
      {
        headers: getAuthHeader(),
        responseType: "blob",
      }
    );

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "financial-report.xlsx");
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.message || "Failed to download financial excel",
    };
  }
};

export {
  getInventoryHealthReport,
  getSystemChartData,
  getSystemMetrics,
  downloadInventoryReport,
  downloadOrderReport,
  downloadBookingReport,
  downloadFinancialReport,
  downloadInventoryExcel,
  downloadOrderExcel,
  downloadBookingExcel,
  downloadFinancialExcel,
};
