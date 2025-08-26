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
    console.log(
      "Creating order with data:",
      JSON.stringify(orderData, null, 2)
    );

    // Validate required fields
    if (
      !orderData.supplierId ||
      !orderData.products ||
      !orderData.deliveryAddress ||
      !orderData.deliveryDate
    ) {
      console.error("Missing required fields:", {
        supplierId: !orderData.supplierId,
        products: !orderData.products,
        deliveryAddress: !orderData.deliveryAddress,
        deliveryDate: !orderData.deliveryDate,
      });
      return {
        status: false,
        error: "Missing required fields",
      };
    }

    // Validate products array
    if (!Array.isArray(orderData.products) || orderData.products.length === 0) {
      console.error("Invalid products array:", orderData.products);
      return {
        status: false,
        error: "Products must be a non-empty array",
      };
    }

    // Validate each product
    for (const product of orderData.products) {
      if (!product.id || !product.quantity || !product.price) {
        console.error("Invalid product data:", product);
        return {
          status: false,
          error: "Each product must have id, quantity, and price",
        };
      }
    }

    const response = await axios.post(`${API_URL}/orders/create`, orderData, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });

    console.log("Order creation response:", response.data);
    return {
      status: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error creating order:", error.response?.data || error);
    return {
      status: false,
      error: error.response?.data?.message || "Failed to create order",
    };
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

// Get order summary
export const getOrderSummary = async (query = {}) => {
  try {
    const { page = 1, limit = 5, status, filter, search, sort } = query;
    
    const params = { page, limit };
    if (status) params.status = status;
    if (filter) params.filter = typeof filter === 'object' ? JSON.stringify(filter) : filter;
    if (search) params.search = search;
    if (sort) params.sort = typeof sort === 'object' ? JSON.stringify(sort) : sort;
    
    const response = await axios.get(`${API_URL}/orders`, {
      headers: getAuthHeader(),
      params
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error(
      "Error fetching order summary:",
      error.response?.data || error.message
    );
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch order summary",
    };
  }
};

// Bulk delete orders
export const bulkDeleteOrders = async (orderIds) => {
  try {
    const response = await axios.post(
      `${API_URL}/orders/bulk-delete-orders`,
      { orderIds },
      {
        headers: getAuthHeader(),
      }
    );

    return {
      success: true,
      message: response.data.message || "Orders deleted successfully",
    };
  } catch (error) {
    console.error(
      "Error bulk deleting orders:",
      error.response?.data || error.message
    );
    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete orders",
    };
  }
};

/**
 * Search products for order creation
 * @param {Object} params - Search parameters
 * @param {string} params.query - Search query
 * @param {string} params.category - Category filter
 * @param {string} params.supplier - Supplier filter
 * @param {number} params.limit - Items per page
 * @param {number} params.page - Page number
 * @returns {Promise<Object>} Search results
 */
export const searchProducts = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.query) queryParams.append('query', params.query);
    if (params.category) queryParams.append('category', params.category);
    if (params.supplier) queryParams.append('supplier', params.supplier);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.page) queryParams.append('page', params.page.toString());
    const response = await axios.get(
      `${API_URL}/orders/search-products?${queryParams}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

/**
 * Get product categories for filter dropdown
 * @returns {Promise<Object>} Categories list
 */
export const getProductCategories = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/orders/categories`,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const getSupplierOrders = async (status) => {
    try {
        const response = await axios.get(`${API_URL}/orders/supplier-orders?status=${status}`, {
            headers: getAuthHeader(),
        });
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
}