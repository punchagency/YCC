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
export const getSupplierDashboardStats = async ({supplierId}) => {
  try {
    const response = await axios.get(`${API_URL}/suppliers/analytics/${supplierId}`, {
      headers: getAuthHeader(),
    });
    
    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error) {
    console.error("Error fetching supplier dashboard stats:", error.response?.data || error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch supplier dashboard stats",
    };
  }
};

export const updateSupplierProfile = async ({supplierId, data}) => {
  // req.params.id, req.body
  try {
    const response = await axios.put(`${API_URL}/suppliers/${supplierId}`, data, {
      headers: getAuthHeader(),
    });
    return {
      success: true,
      data: response.data,
      message: response.data.message,
    };
  } catch (error) {
    console.error("Error updating supplier profile:", error.response?.data || error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update supplier profile",
    };
  }
};
export const updateInventoryItem = async (id, itemData, isFormData = false) => {
  try {
    // Check if we're dealing with FormData
    // const isFormData = itemData instanceof FormData;

    // Set the appropriate headers
    const headers = {
      ...getAuthHeader(),
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
    };

    const response = await axios.patch(`${API_URL}/suppliers/${id}`, itemData, { // NOTE: Changed from /suppliers to /inventory. Very critical for the onboarding process.
      headers: headers,
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error(`Error updating inventory item ${id}:`, error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update inventory item",
    };
  }
};