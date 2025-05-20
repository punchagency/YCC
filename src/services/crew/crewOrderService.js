import axios from "axios";

// Use the base API URL
const API_URL = process.env.REACT_APP_API_URL;

// Add authentication token to requests
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Create a new order
 * @param {Object} orderData - The order data
 * @returns {Promise<Object>} - Response with status and data or error
 */
export const createOrder = async (orderData) => {
  try {
    const response = await axios.post(`${API_URL}/crew-orders`, orderData, {
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
    console.error("Error creating order:", error);
    return {
      status: false,
      error: error.response?.data?.message || "Failed to create order",
    };
  }
};

/**
 * Get all orders
 * @param {Object} params - Query parameters for filtering and pagination
 * @returns {Promise<Object>} - Response with status and data or error
 */
export const getOrders = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/crew-orders`, {
      params,
      headers: {
        ...getAuthHeader(),
      },
    });

    return {
      status: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return {
      status: false,
      error: error.response?.data?.message || "Failed to fetch orders",
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
    console.error(`Error fetching order ${orderId}:`, error);
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
    console.error(`Error updating order ${orderId}:`, error);
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
    console.error(`Error deleting order ${orderId}:`, error);
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
    console.error(`Error updating order status ${orderId}:`, error);
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
    console.error("Error fetching order statistics:", error);
    return {
      status: false,
      error:
        error.response?.data?.message || "Failed to fetch order statistics",
    };
  }
};
