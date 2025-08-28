import axios from "axios";

// Use the base API URL
const API_URL = process.env.REACT_APP_API_URL;

// Add authentication token to requests
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Get user data from localStorage
const getUserData = () => {
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  } catch (error) {
    console.error("Error getting user data from localStorage:", error);
    return null;
  }
};

/**
 * Create a new crew inventory item
 * @param {FormData} inventoryData - Form data containing inventory details
 * @returns {Promise<Object>} - Response with success status and data
 */
export const createCrewInventoryData = async (inventoryData) => {
  try {
    // Check if we're dealing with FormData or regular JSON object
    const isFormData = inventoryData instanceof FormData;

    let dataToSend;
    let headers = {
      ...getAuthHeader(),
    };

    if (isFormData) {
      // Convert FormData to a regular object for better compatibility
      dataToSend = {};
      for (let [key, value] of inventoryData.entries()) {
        dataToSend[key] = value;
      }
      headers["Content-Type"] = "application/json";
    } else {
      // Use JSON data as is
      dataToSend = inventoryData;
      headers["Content-Type"] = "application/json";
    }

    // Use the crew-specific endpoint
    const response = await axios.post(
      `${API_URL}/crew-inventory/`,
      dataToSend,
      {
        headers: headers,
      }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error creating crew inventory:", error);
    console.error("Error response:", error.response?.data);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to create crew inventory",
    };
  }
};

/**
 * Get all crew inventory items
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} - Response with success status and data
 */
export const getCrewInventoryData = async (params = {}) => {
  try {
    const { page = 1 } = params;

    const response = await axios.get(
      `${API_URL}/crew-inventory?page=${page}&limit=10`,
      {
        headers: getAuthHeader(),
      }
    );

    return {
      success: true,
      data: response.data.data,
      pagination: response.data.pagination,
      message: response.data.message,
    };
  } catch (error) {
    console.error("Error fetching crew inventory data:", error);
    return {
      success: false,
      error:
        error.response?.data?.message || "Failed to fetch crew inventory data",
    };
  }
};

/**
 * Delete a crew inventory item
 * @param {string} id - Inventory item ID
 * @returns {Promise<Object>} - Response with success status and data
 */
export const deleteCrewInventoryItem = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/crew-inventory/${id}`, {
      headers: getAuthHeader(),
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error(`Error deleting crew inventory item ${id}:`, error);
    return {
      success: false,
      error:
        error.response?.data?.message || "Failed to delete crew inventory item",
    };
  }
};

/**
 * Update a crew inventory item
 * @param {string} id - Inventory item ID
 * @param {Object} itemData - Updated inventory data
 * @returns {Promise<Object>} - Response with success status and data
 */
export const updateCrewInventoryItem = async (id, itemData) => {
  try {
    const response = await axios.patch(
      `${API_URL}/crew-inventory/${id}`,
      itemData,
      {
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`Error updating crew inventory item ${id}:`, error);
    return {
      success: false,
      error:
        error.response?.data?.message || "Failed to update crew inventory item",
    };
  }
};

// Get low stock crew inventory items
export const getLowStockCrewInventory = async (threshold = 10) => {
  try {
    const response = await fetch(`${API_URL}/crew-inventory/low-stock`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });

    const data = await response.json();

    if (data.status) {
      return {
        success: true,
        data: data.data,
      };
    } else {
      return {
        success: false,
        error: data.message,
      };
    }
  } catch (error) {
    console.error("Error fetching low stock inventory:", error);
    return {
      success: false,
      error: "Failed to fetch low stock inventory",
    };
  }
};
