import axios from "axios";
import { getAuthHeader } from "../../utils/authHeader";
import { buildApiUrl } from "../../utils/apiUtils";

/**
 * Fetch all orders for admin (paginated)
 * @param {Object} params - { page, limit, search, filter, sort }
 * @returns {Promise}
 */
export async function getAdminOrders(params = {}) {
  try {
    const response = await axios.get(buildApiUrl("/admin/orders"), {
      params,
      headers: {
        ...getAuthHeader(),
      },
    });
    return response.data;
  } catch (error) {
    // Standardize error response
    if (error.response) {
      return error.response.data;
    }
    return { status: false, message: error.message };
  }
}

/**
 * Fetch a single order by ID for admin
 * @param {string} id - Order ID
 * @returns {Promise}
 */
export async function getAdminOrderById(id) {
  try {
    const response = await axios.get(buildApiUrl(`/admin/orders/${id}`), {
      headers: {
        ...getAuthHeader(),
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    return { status: false, message: error.message };
  }
}

/**
 * Search orders for admin (paginated, by orderId, _id, user email, crew name)
 * @param {Object} params - { q, status, page, limit }
 * @returns {Promise}
 */
export async function searchAdminOrders(params = {}) {
  try {
    const response = await axios.get(buildApiUrl("/admin/orders/search"), {
      params,
      headers: {
        ...getAuthHeader(),
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    return { status: false, message: error.message };
  }
}
