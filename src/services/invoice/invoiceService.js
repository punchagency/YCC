import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/invoices`;
// Helper to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const getInvoices = async ({ status, type, period }) => {
  try {
    const queryParams = new URLSearchParams();
    if (status) queryParams.append("status", status);
    if (type) queryParams.append("type", type);
    if (period) queryParams.append("period", period);
    console.log("queryParams", queryParams.toString());
    const response = await axios.get(`${API_URL}?${queryParams}`, { headers: getAuthHeader() });

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching invoices:",
      error.response?.data || error.message
    );
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch invoices",
    };
  }
};


