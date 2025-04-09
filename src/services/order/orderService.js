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

// Create a new order
export const createOrder = async (orderData) => {
  try {
    const response = await axios.post(`${API_URL}/orders`, orderData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get all orders
export const getOrders = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/orders`, {
      headers: getAuthHeader(),
      params, // For pagination, sorting, filtering
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error(
      "Error fetching orders:",
      error.response?.data || error.message
    );
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch orders",
    };
  }
};

// Get order by ID
export const getOrderById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/orders/${id}`, {
      headers: getAuthHeader(),
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error(
      "Error fetching order:",
      error.response?.data || error.message
    );
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch order",
    };
  }
};

// Get orders by supplier ID
export const getOrdersBySupplierId = async (supplierId, params = {}) => {
  try {
    const response = await axios.get(
      `${API_URL}/orders/supplier/${supplierId}`,
      {
        headers: getAuthHeader(),
        params, // For pagination, sorting, filtering
      }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error(
      "Error fetching supplier orders:",
      error.response?.data || error.message
    );
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch supplier orders",
    };
  }
};

// Update order status
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await axios.patch(
      `${API_URL}/orders/${orderId}/status`,
      { status },
      {
        headers: getAuthHeader(),
      }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error(
      "Error updating order status:",
      error.response?.data || error.message
    );
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update order status",
    };
  }
};

// Update order
export const updateOrder = async (orderId, orderData) => {
  try {
    const response = await axios.put(
      `${API_URL}/orders/${orderId}`,
      orderData,
      {
        headers: getAuthHeader(),
      }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error(
      "Error updating order:",
      error.response?.data || error.message
    );
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update order",
    };
  }
};

// Cancel order
export const cancelOrder = async (orderId) => {
  try {
    const response = await axios.post(
      `${API_URL}/orders/${orderId}/cancel`,
      {},
      {
        headers: getAuthHeader(),
      }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error(
      "Error cancelling order:",
      error.response?.data || error.message
    );
    return {
      success: false,
      error: error.response?.data?.message || "Failed to cancel order",
    };
  }
};

// Delete order
export const deleteOrder = async (orderId) => {
  try {
    const response = await axios.delete(`${API_URL}/orders/${orderId}`, {
      headers: getAuthHeader(),
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error(
      "Error deleting order:",
      error.response?.data || error.message
    );
    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete order",
    };
  }
};
