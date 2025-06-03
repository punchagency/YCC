import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// Helper to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// Get all suppliers
export const getAllSuppliers = async (params = {}) => {
  try {
    console.log("Fetching all suppliers, params:", params);

    const response = await axios.get(`${API_URL}/suppliers`, {
      headers: getAuthHeader(),
      params: {
        page: params.page || 1,
        limit: params.limit || 10,
        businessType: params.businessType,
        serviceArea: params.serviceArea,
        search: params.search,
      },
    });

    console.log("All suppliers response:", response.data);

    return {
      status: true,
      data: response.data.data,
      pagination: response.data.pagination,
    };
  } catch (error) {
    console.error(
      "Error fetching all suppliers:",
      error.response?.data || error
    );
    return {
      status: false,
      error: error.response?.data?.message || "Failed to fetch suppliers",
    };
  }
};

// Get all suppliers with their inventories
export const getSuppliersWithInventories = async (params = {}) => {
  try {
    console.log("Fetching suppliers with inventories, params:", params);

    const response = await axios.get(`${API_URL}/suppliers/with-inventories`, {
      headers: getAuthHeader(),
      params: {
        page: params.page || 1,
        limit: params.limit || 10,
        businessType: params.businessType,
        serviceArea: params.serviceArea,
        search: params.search,
      },
    });

    console.log("Suppliers with inventories response:", response.data);

    return {
      status: true,
      data: response.data.data,
      pagination: response.data.pagination,
    };
  } catch (error) {
    console.error(
      "Error fetching suppliers with inventories:",
      error.response?.data || error
    );
    return {
      status: false,
      error:
        error.response?.data?.message ||
        "Failed to fetch suppliers with inventories",
    };
  }
};

// Get user orders
export const getUserOrders = async (params = {}) => {
  try {
    console.log("Fetching user orders with params:", params);

    // Check for token
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No authentication token found");
      return {
        status: false,
        error: "Authentication token not found",
      };
    }

    const response = await axios.get(`${API_URL}/suppliers/orders`, {
      headers: getAuthHeader(),
      params: {
        page: params.page || 1,
        limit: params.limit || 10,
        status: params.status,
        startDate: params.startDate,
        endDate: params.endDate,
      },
    });

    console.log("Raw API response:", response.data);

    // Ensure we have a valid response structure
    if (!response.data) {
      console.error("Invalid response from server - no data");
      throw new Error("Invalid response from server");
    }

    // Return the exact response structure from the API
    return {
      status: response.data.status,
      message: response.data.message,
      data: response.data.data,
      pagination: response.data.pagination,
    };
  } catch (error) {
    console.error("Error fetching user orders:", error.response?.data || error);

    // Handle specific error cases
    if (error.response?.status === 401) {
      console.error("Authentication error - token expired or invalid");
      localStorage.removeItem("token");
      return {
        status: false,
        error: "Session expired. Please login again.",
        unauthorized: true,
      };
    }

    return {
      status: false,
      error: error.response?.data?.message || "Failed to fetch orders",
    };
  }
};
