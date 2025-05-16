import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// Add authentication token to requests
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Fetch all crew inventory items with sorting and pagination
 */
export const getCrewInventory = async (params = {}) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortField = "name",
      sortDirection = "asc",
    } = params;

    console.log("Fetching inventory with params:", {
      page,
      limit,
      sortField,
      sortDirection,
    });

    // Update URL to match controller endpoint (/crew/inventory instead of /crew-inventory)
    const response = await axios.get(
      `${API_URL}/crew-inventory?page=${page}&limit=${limit}&sort=${sortField}&direction=${sortDirection}`,
      {
        headers: getAuthHeader(),
      }
    );

    console.log("API response:", response.data);
    console.log("Pagination response:", response.data.pagination);

    return {
      success: true,
      data: response.data.data,
      pagination: response.data.pagination,
    };
  } catch (error) {
    console.error("Error fetching crew inventory:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch inventory data",
    };
  }
};

/**
 * Create new crew inventory item
 */
export const createCrewInventory = async (inventoryData, timeout = 15000) => {
  try {
    const response = await axios.post(
      `${API_URL}/crew-inventory`,
      inventoryData,
      {
        headers: {
          ...getAuthHeader(),
          "Content-Type":
            inventoryData instanceof FormData
              ? "multipart/form-data"
              : "application/json",
        },
        timeout: timeout,
      }
    );

    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error) {
    console.error("Error creating crew inventory:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to create inventory",
    };
  }
};

/**
 * Delete crew inventory item
 */
export const deleteCrewInventory = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/crew-inventory/${id}`, {
      headers: getAuthHeader(),
    });

    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    console.error("Error deleting crew inventory:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete inventory item",
    };
  }
};

/**
 * Delete multiple crew inventory items
 */
export const bulkDeleteCrewInventory = async (inventoryIds) => {
  try {
    const deletePromises = inventoryIds.map((id) => deleteCrewInventory(id));

    const results = await Promise.all(deletePromises);

    // Check if any deletion failed
    const hasErrors = results.some((result) => !result.success);

    return {
      success: !hasErrors,
      message: hasErrors
        ? "Some items failed to delete"
        : `${inventoryIds.length} item(s) deleted successfully`,
    };
  } catch (error) {
    console.error("Error bulk deleting inventory:", error);
    return {
      success: false,
      error: "Failed to delete inventory items",
    };
  }
};

/**
 * Get a single crew inventory item
 */
export const getCrewInventoryById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/crew-inventory/${id}`, {
      headers: getAuthHeader(),
    });

    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error("Error fetching inventory item:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch inventory item",
    };
  }
};

/**
 * Update crew inventory item
 */
export const updateCrewInventory = async (id, inventoryData) => {
  try {
    const response = await axios.patch(
      `${API_URL}/crew-inventory/${id}`,
      inventoryData,
      {
        headers: {
          ...getAuthHeader(),
          "Content-Type":
            inventoryData instanceof FormData
              ? "multipart/form-data"
              : "application/json",
        },
      }
    );

    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error) {
    console.error("Error updating crew inventory:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update inventory",
    };
  }
};

/**
 * Get low stock products
 */
export const getLowStockCrewProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/crew-inventory/low-stock`, {
      headers: getAuthHeader(),
    });

    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error("Error fetching low stock products:", error);
    return {
      success: false,
      error:
        error.response?.data?.message || "Failed to fetch low stock products",
    };
  }
};
