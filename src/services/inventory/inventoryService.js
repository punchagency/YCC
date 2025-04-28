import axios from "axios";
// import { useUser } from "../../context/userContext"; // Import at the top level

// Use the base API URL, not the auth URL
const API_URL = process.env.REACT_APP_API_URL;

// Add authentication token to requests
export const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Get user ID from localStorage with debugging
// const getUserId = () => {
//   try {
//     // Log all localStorage keys to see what's available
//     console.log("All localStorage keys:");
//     for (let i = 0; i < localStorage.length; i++) {
//       const key = localStorage.key(i);
//       console.log(`${key}: ${localStorage.getItem(key)}`);
//     }

//     const id = localStorage.getItem("id");
//     console.log("ID from localStorage:", id);

//     // Try other possible keys
//     const userId = localStorage.getItem("userId");
//     console.log("userId from localStorage:", userId);

//     const userStr = localStorage.getItem("user");
//     console.log("user string from localStorage:", userStr);

//     try {
//       if (userStr) {
//         const user = JSON.parse(userStr);
//         console.log("Parsed user object:", user);
//         if (user && user.id) return user.id;
//       }
//     } catch (e) {
//       console.error("Error parsing user JSON:", e);
//     }

//     return id || userId || null;
//   } catch (error) {
//     console.error("Error getting user ID from localStorage:", error);
//     return null;
//   }
// };

export const createInventoryData = async (inventoryData) => {
  try {
    // Check if we're dealing with FormData
    const isFormData = inventoryData instanceof FormData;

    // For debugging - log what's in the FormData
    if (isFormData) {
      console.log("FormData contents:");
      for (let pair of inventoryData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }
    }

    // Set the appropriate headers
    const headers = {
      ...getAuthHeader(),
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
    };

    const response = await axios.post(`${API_URL}/inventory`, inventoryData, {
      headers: headers,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error creating inventory:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to create inventory",
    };
  }
};

export const getInventoryData = async (params = {}) => {
  try {
    const { page = 1 } = params;

    const response = await axios.get(
      `${API_URL}/inventory?page=${page}&limit=10`,
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
    console.error("Error fetching inventory data:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch inventory data",
    };
  }
};

export const getAllInventoryItems = async () => {
  try {
    let allInventoryItems = [];
    let page = 1;
    let hasNextPage = true;

    while (hasNextPage) {
      const response = await axios.get(`${API_URL}/inventory`, {
        params: {
          page,
          pageSize: 10,
        },
        headers: getAuthHeader(),
      });
      const inventoryItems = response.data.data;
      allInventoryItems.push(...inventoryItems);

      const pagination = response.data.pagination;
      hasNextPage = pagination?.hasNextPage;
      page++;
    }

    return allInventoryItems;
  } catch (error) {
    console.error("Error fetching all inventory items:", error);
    return {
      success: false,
      error:
        error.response?.data?.message || "Failed to fetch all inventory items",
    };
  }
};
export const updateInventoryItem = async (id, itemData) => {
  try {
    const response = await axios.patch(`${API_URL}/inventory/${id}`, itemData, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json",
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`Error updating inventory item ${id}:`, error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update inventory item",
    };
  }
};

export const deleteInventoryItem = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/inventory/${id}`, {
      headers: getAuthHeader(),
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`Error deleting inventory item ${id}:`, error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete inventory item",
    };
  }
};

export const getLowInventory = async () => {
  try {
    const response = await axios.get(`${API_URL}/inventory/low-stock`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching low inventory:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch low inventory",
    };
  }
};

export const deleteAllInventoryItems = async (inventoryIds) => {
  try {
    const response = await axios.delete(`${API_URL}/inventory/bulk-delete`, {
      headers: getAuthHeader(),
      data: { inventoryIds }, // Send IDs in request body
    });
    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error) {
    console.error("Error in deleteAllInventoryItems:", error);
    return {
      success: false,
      error:
        error.response?.data?.message || "Failed to delete inventory items",
    };
  }
};

// Add this new function to update product inventory status
export const updateProductInventoryStatus = async (
  productId,
  status,
  quantityChange = 0
) => {
  try {
    const headers = {
      ...getAuthHeader(),
      "Content-Type": "application/json",
    };

    const data = {
      status: status,
      quantityChange: quantityChange,
    };

    const response = await axios.patch(
      `${API_URL}/inventory/product/${productId}/status`,
      data,
      {
        headers: headers,
      }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error(`Error updating product inventory status:`, error);
    return {
      success: false,
      error:
        error.response?.data?.message ||
        "Failed to update product inventory status",
    };
  }
};
