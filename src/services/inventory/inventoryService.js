import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// Add authentication token to requests
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return {};
  }

  const header = { Authorization: `Bearer ${token}` };
  return header;
};

export const createInventoryData = async (inventoryData) => {
  try {
    // Check if we're dealing with FormData
    const isFormData = inventoryData instanceof FormData;

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

      if (!response.data || !response.data.status) {
        return {
          success: false,
          error: "Invalid response from server",
        };
      }

      const inventoryItems = response.data.data;
      if (!Array.isArray(inventoryItems)) {
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

    const response = await axios.patch(`${API_URL}/inventory/${id}`, itemData, { // NOTE: Changed from /suppliers to /inventory. Very critical for the onboarding process.
      headers: headers,
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
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

    const response = await axios.get(url, {
      headers: getAuthHeader(),
    });

    // Check if the response has the expected structure
    if (response.data && response.data.status) {
      return {
        success: true,
        data: response.data.data,
        pagination: response.data.pagination,
        message: response.data.message,
      };
    } else {
      return {
        success: false,
        error: "Invalid response structure from server",
      };
    }
  } catch (error) {
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
    return {
      success: false,
      error: error.response?.data?.message || "Failed to send email",
    };
  }
};

export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/inventory/product/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch product",
    };
  }
}

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
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch suppliers",
    };
  }
};
