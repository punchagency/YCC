import axios from "axios";
import { getAuthHeader } from "../../utils/authHeader";

// Use the base API URL
const API_URL = process.env.REACT_APP_API_URL;

/**
 * Create a new order
 * @param {Object} orderData - The order data
 * @returns {Promise<Object>} - Response with status and data or error
 */
export const createOrder = async (orderData) => {
  try {
    const response = await axios.post(`${API_URL}/crew-orders/`, orderData, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });

    return {
      status: true,
      data: response.data,
    };
  } catch (error) {
    // Handle 401 authentication errors
    if (error.response?.status === 401) {
      const authError = new Error(
        "Authentication required. Please log in again."
      );
      authError.status = 401;
      authError.isAuthError = true;
      throw authError;
    }

    return {
      status: false,
      error: error.response?.data?.message || "Failed to create order",
    };
  }
};

/**
 * Get all orders with enhanced data processing and error handling
 * @param {Object} params - Query parameters for filtering and pagination
 * @returns {Promise<Object>} - Response with status, data, statusCounts, and pagination or error
 */
export const getOrders = async (params = {}) => {
  try {

    // Build query parameters
    const queryParams = {
      page: params.page || 1,
      limit: params.limit || 10,
    };

    // Add status filter if provided
    if (params.status && params.status !== "all") {
      queryParams.status = params.status;
    }

    // Add sort parameters if provided
    if (params.sortBy) {
      queryParams.sortBy = params.sortBy;
    }
    if (params.sortDirection) {
      queryParams.sortDirection = params.sortDirection;
    }

    const response = await axios.get(`${API_URL}/crew-orders`, {
      params: queryParams,
      headers: {
        ...getAuthHeader(),
      },
    });

    // Extract and process the response data
    let ordersData = [];
    let statusCounts = { pending: 0, active: 0, completed: 0, total: 0 };
    let paginationData = {
      totalItems: 0,
      totalPages: 0,
      currentPage: params.page || 1,
      pageSize: params.limit || 10,
    };

    // Handle different response structures
    if (response.data?.data && Array.isArray(response.data.data)) {
      ordersData = response.data.data;
    } else if (response.data && Array.isArray(response.data)) {
      ordersData = response.data;
    } else {
      throw new Error("Invalid data structure received from API");
    }

    // Extract status counts from response
    if (response.data?.statusCounts) {
      statusCounts = response.data.statusCounts;
    }

    // Extract pagination data from response
    if (response.data?.pagination) {
      paginationData = response.data.pagination;
    } else {
      // Fallback pagination calculation
      paginationData = {
        totalItems: ordersData.length,
        totalPages: Math.ceil(ordersData.length / (params.limit || 10)),
        currentPage: params.page || 1,
        pageSize: params.limit || 10,
      };
    }

    return {
      status: true,
      data: {
        data: ordersData,
        statusCounts,
        pagination: paginationData,
      },
    };
  } catch (error) {
    // Enhanced error handling with specific error messages
    let errorMessage = "Failed to fetch orders";

    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response.data;

      switch (status) {
        case 401:
          // For 401 errors, we want to throw the error so it can be handled by the component
          // This allows for proper logout and redirect handling
          const authError = new Error(
            "Authentication required. Please log in again."
          );
          authError.status = 401;
          authError.isAuthError = true;
          throw authError;
        case 403:
          errorMessage = "You don't have permission to access orders.";
          break;
        case 404:
          errorMessage = "Orders endpoint not found.";
          break;
        case 500:
          errorMessage = "Server error occurred while fetching orders.";
          break;
        default:
          errorMessage = data?.message || `Server error (${status})`;
      }
    } else if (error.request) {
      // Network error
      errorMessage = "Network error. Please check your connection.";
    } else {
      // Other error
      errorMessage = error.message || "An unexpected error occurred";
    }

    return {
      status: false,
      error: errorMessage,
    };
  }
};

/**
 * Get a single order by ID
 * @param {string} orderId - The order ID
 * @returns {Promise<Object>} - Response with status and data or error
 */
export const getOrderById = async (orderId) => {
  try {
    const response = await axios.get(`${API_URL}/crew-orders/${orderId}`, {
      headers: {
        ...getAuthHeader(),
      },
    });

    return {
      status: true,
      data: response.data,
    };
  } catch (error) {
    // Handle 401 authentication errors
    if (error.response?.status === 401) {
      const authError = new Error(
        "Authentication required. Please log in again."
      );
      authError.status = 401;
      authError.isAuthError = true;
      throw authError;
    }

    return {
      status: false,
      error: error.response?.data?.message || "Failed to fetch order",
    };
  }
};

/**
 * Update an order
 * @param {string} orderId - The order ID
 * @param {Object} orderData - The updated order data
 * @returns {Promise<Object>} - Response with status and data or error
 */
export const updateOrder = async (orderId, orderData) => {
  try {
    const response = await axios.put(
      `${API_URL}/crew-orders/${orderId}`,
      orderData,
      {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
      }
    );

    return {
      status: true,
      data: response.data,
    };
  } catch (error) {
    // Handle 401 authentication errors
    if (error.response?.status === 401) {
      const authError = new Error(
        "Authentication required. Please log in again."
      );
      authError.status = 401;
      authError.isAuthError = true;
      throw authError;
    }

    return {
      status: false,
      error: error.response?.data?.message || "Failed to update order",
    };
  }
};

/**
 * Delete an order
 * @param {string} orderId - The order ID
 * @returns {Promise<Object>} - Response with status and data or error
 */
export const deleteOrder = async (orderId) => {
  try {
    const response = await axios.delete(`${API_URL}/crew-orders/${orderId}`, {
      headers: {
        ...getAuthHeader(),
      },
    });

    return {
      status: true,
      data: response.data,
    };
  } catch (error) {
    // Handle 401 authentication errors
    if (error.response?.status === 401) {
      const authError = new Error(
        "Authentication required. Please log in again."
      );
      authError.status = 401;
      authError.isAuthError = true;
      throw authError;
    }

    return {
      status: false,
      error: error.response?.data?.message || "Failed to delete order",
    };
  }
};

/**
 * Update order status
 * @param {string} orderId - The order ID
 * @param {string} status - The new status
 * @returns {Promise<Object>} - Response with status and data or error
 */
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await axios.patch(
      `${API_URL}/crew-orders/${orderId}/status`,
      { status },
      {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
      }
    );

    return {
      status: true,
      data: response.data,
    };
  } catch (error) {
    // Handle 401 authentication errors
    if (error.response?.status === 401) {
      const authError = new Error(
        "Authentication required. Please log in again."
      );
      authError.status = 401;
      authError.isAuthError = true;
      throw authError;
    }

    return {
      status: false,
      error: error.response?.data?.message || "Failed to update order status",
    };
  }
};

/**
 * Get order statistics
 * @returns {Promise<Object>} - Response with status and data or error
 */
export const getOrderStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/crew-orders/stats`, {
      headers: {
        ...getAuthHeader(),
      },
    });

    return {
      status: true,
      data: response.data,
    };
  } catch (error) {
    // Handle 401 authentication errors
    if (error.response?.status === 401) {
      const authError = new Error(
        "Authentication required. Please log in again."
      );
      authError.status = 401;
      authError.isAuthError = true;
      throw authError;
    }

    return {
      status: false,
      error:
        error.response?.data?.message || "Failed to fetch order statistics",
    };
  }
};

export const getProductsWithVendors = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/crew-orders/products-with-creators`,
      {
        headers: {
          ...getAuthHeader(),
        },
      }
    );
    return {
      status: true,
      data: response.data,
    };
  } catch (error) {
    // Handle 401 authentication errors
    if (error.response?.status === 401) {
      const authError = new Error(
        "Authentication required. Please log in again."
      );
      authError.status = 401;
      authError.isAuthError = true;
      throw authError;
    }

    return {
      status: false,
      error:
        error.response?.data?.message ||
        "Failed to fetch products with vendors",
    };
  }
};
