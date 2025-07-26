import axios from "axios";
// import { useUser } from "../../context/userContext"; // Import at the top level

// Use the base API URL, not the auth URL
const API_URL = process.env.REACT_APP_API_URL;

// Add authentication token to requests
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  console.log(
    "Token from localStorage:",
    token ? `Token exists (${token.substring(0, 10)}...)` : "No token found"
  );

  if (!token) {
    console.warn("No authentication token found in localStorage");
    console.log("Available localStorage keys:", Object.keys(localStorage));
    return {};
  }

  const header = { Authorization: `Bearer ${token}` };
  console.log("Auth header created:", {
    Authorization: `Bearer ${token.substring(0, 10)}...`,
  });
  return header;
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

    console.log("Request headers:", headers);
    console.log("API URL:", `${API_URL}/inventory`);

    const response = await axios.post(`${API_URL}/inventory`, inventoryData, {
      headers: headers,
    });

    console.log("API Response:", response.data);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error creating inventory:", error);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);

    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to create inventory",
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

      console.log("API Response:", response.data);

      if (!response.data || !response.data.status) {
        console.error("Invalid API response:", response.data);
        return {
          success: false,
          error: "Invalid response from server",
        };
      }

      const inventoryItems = response.data.data;
      if (!Array.isArray(inventoryItems)) {
        console.error("Invalid inventory data format:", inventoryItems);
        return {
          success: false,
          error: "Invalid inventory data format",
        };
      }

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
export const updateInventoryItem = async (id, itemData, isFormData = false) => {
  try {
    // Check if we're dealing with FormData
    // const isFormData = itemData instanceof FormData;

    // Set the appropriate headers
    const headers = {
      ...getAuthHeader(),
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
    };

    const response = await axios.patch(`${API_URL}/inventory/${id}`, itemData, {
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

// Accepts inventoryId and productId, sends productId in request body
export const deleteInventoryItem = async (inventoryId, productId) => {
  try {
    // Send productId as a query parameter
    const response = await axios.delete(
      `${API_URL}/inventory/${inventoryId}?productId=${encodeURIComponent(productId)}`,
      {
        headers: getAuthHeader(),
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`Error deleting inventory item ${inventoryId}:`, error);
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

export const getInventoryItemById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/inventory/${id}`, {
      headers: getAuthHeader(),
    });

    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error) {
    console.error(`Error fetching inventory item ${id}:`, error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch inventory item",
    };
  }
};

export const getAllInventories = async (
  page = 1,
  limit = 10,
  searchText = "",
  stockStatus = "all"
) => {
  try {
    console.log("Fetching inventories with params:", {
      page,
      limit,
      searchText,
      stockStatus,
    });

    // Build query parameters
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    // Add search parameters if provided
    if (searchText && searchText.trim() !== "") {
      params.append("searchText", searchText.trim());
    }

    if (stockStatus && stockStatus !== "all") {
      params.append("stockStatus", stockStatus);
    }

    const url = `${API_URL}/inventory/all-inventories?${params.toString()}`;
    console.log("Request URL:", url);

    const response = await axios.get(url, {
      headers: getAuthHeader(),
    });

    console.log("Raw API Response:", response);
    console.log("Response Data:", response.data);

    // Check if the response has the expected structure
    if (response.data && response.data.status) {
      return {
        success: true,
        data: response.data.data,
        pagination: response.data.pagination,
        message: response.data.message,
      };
    } else {
      console.warn("API returned unexpected structure:", response.data);
      return {
        success: false,
        error: "Invalid response structure from server",
      };
    }
  } catch (error) {
    console.error("Error fetching all inventories:", error);
    console.error("Error details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch inventories",
    };
  }
};

export const sendInventoryEmail = async (to, subject, message) => {
  try {
    const response = await axios.post(
      `${API_URL}/inventory/send-email`,
      {
        to,
        subject,
        message,
      },
      {
        headers: getAuthHeader(),
      }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error sending inventory email:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to send email",
    };
  }
};

export const getAllSuppliers = async () => {
  try {
    const response = await axios.get(`${API_URL}/suppliers`, {
      headers: getAuthHeader(),
    });

    return {
      success: true,
      data: response.data.data || response.data,
    };
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch suppliers",
    };
  }
};
