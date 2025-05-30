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
    console.log("Fetching user orders, params:", params);

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

    console.log("User orders response:", response.data);

    return {
      status: true,
      data: response.data.data || response.data,
      pagination: response.data.pagination,
    };
  } catch (error) {
    console.error("Error fetching user orders:", error.response?.data || error);
    return {
      status: false,
      error: error.response?.data?.message || "Failed to fetch orders",
    };
  }
};
