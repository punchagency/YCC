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

export const getInvoices = async (query = {}) => {
  try {
    const { page = 1, limit = 10, status, type, period = 'all' } = query;
    
    const params = { page, limit, period };
    if (status !== undefined) params.status = status;
    if (type !== undefined) params.type = type;
    
    const response = await axios.get(API_URL, { headers: getAuthHeader(), params });
    return response.data;
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch invoices",
    };
  }
};


