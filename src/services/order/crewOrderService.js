import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Fix: Return just the token
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Fix: Create a separate function for full headers
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

/**
 * Create a new crew order
 * @param {Object} orderData - The order data
 * @returns {Promise<Object>} - The response from the API
 */
export const createCrewOrder = async (orderData) => {
  try {
    const token = getAuthToken(); // Get just the token

    // Create FormData if there are attachments
    let data;
    let headers = {
      Authorization: `Bearer ${token}`, // Use the token correctly here
    };

    if (orderData.attachments && orderData.attachments.length > 0) {
      data = new FormData();

      // Add all non-file data
      Object.keys(orderData).forEach((key) => {
        if (key !== "attachments") {
          if (typeof orderData[key] === "object") {
            data.append(key, JSON.stringify(orderData[key]));
          } else {
            data.append(key, orderData[key]);
          }
        }
      });

      // Add attachments
      orderData.attachments.forEach((file, index) => {
        data.append("attachments", file);
      });

      // Set content type to multipart/form-data
      // Don't set Content-Type for FormData, browser will set it with boundary
    } else {
      // No attachments, use regular JSON
      data = orderData;
      headers["Content-Type"] = "application/json";
    }

    console.log("Sending request with token:", token);
    console.log("Request data:", data);

    const response = await axios({
      method: "POST",
      url: `${API_URL}/crew-orders`,
      data: data instanceof FormData ? data : data,
      headers,
    });

    return {
      status: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error creating crew order:", error);
    console.error("Error details:", error.response?.data);
    return {
      status: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

/**
 * Get all crew orders
 * @returns {Promise<Object>} - The response from the API
 */
export const getCrewOrders = async () => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_URL}/crew-orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error fetching crew orders:", error);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

/**
 * Get a specific crew order by ID
 * @param {string} orderId - The ID of the order to fetch
 * @returns {Promise<Object>} - The response from the API
 */
export const getCrewOrderById = async (orderId) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_URL}/crew-orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error(`Error fetching crew order ${orderId}:`, error);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

/**
 * Update a crew order
 * @param {string} orderId - The ID of the order to update
 * @param {Object} updateData - The data to update
 * @returns {Promise<Object>} - The response from the API
 */
export const updateCrewOrder = async (orderId, updateData) => {
  try {
    const token = getAuthToken();

    // Handle attachments similar to create function
    let data;
    let headers = {
      Authorization: `Bearer ${token}`,
    };

    if (updateData.attachments && updateData.attachments.length > 0) {
      data = new FormData();

      Object.keys(updateData).forEach((key) => {
        if (key !== "attachments") {
          if (typeof updateData[key] === "object") {
            data.append(key, JSON.stringify(updateData[key]));
          } else {
            data.append(key, updateData[key]);
          }
        }
      });

      updateData.attachments.forEach((file, index) => {
        data.append("attachments", file);
      });

      // Don't set Content-Type for FormData
    } else {
      data = updateData;
      headers["Content-Type"] = "application/json";
    }

    const response = await axios({
      method: "PUT",
      url: `${API_URL}/crew-orders/${orderId}`,
      data: data instanceof FormData ? data : data,
      headers,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error(`Error updating crew order ${orderId}:`, error);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

/**
 * Delete a crew order
 * @param {string} orderId - The ID of the order to delete
 * @returns {Promise<Object>} - The response from the API
 */
export const deleteCrewOrder = async (orderId) => {
  try {
    const token = getAuthToken();
    const response = await axios.delete(`${API_URL}/crew-orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error(`Error deleting crew order ${orderId}:`, error);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

/**
 * Bulk delete crew orders
 * @param {Array<string>} orderIds - Array of order IDs to delete
 * @returns {Promise<Object>} - The response from the API
 */
export const bulkDeleteCrewOrders = async (orderIds) => {
  try {
    const token = getAuthToken();
    const response = await axios.post(
      `${API_URL}/crew-orders/bulk-delete`,
      { orderIds },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error bulk deleting crew orders:", error);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};
