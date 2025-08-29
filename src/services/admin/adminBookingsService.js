import axios from "axios";
import { getAuthHeader } from "../../utils/authHeader";
import { buildApiUrl } from "../../utils/apiUtils";

/**
 * Fetch all bookings for admin (paginated, optional status filter)
 * @param {Object} params - { page, limit, status, sort }
 * @returns {Promise}
 */
export async function getAdminBookings(params = {}) {
  try {
    const response = await axios.get(buildApiUrl("/admin/bookings"), {
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

/**
 * Search bookings for admin (paginated)
 * @param {Object} params - { q, status, page, limit }
 * @returns {Promise}
 */
export async function searchAdminBookings(params = {}) {
  try {
    const response = await axios.get(buildApiUrl("/admin/bookings/search"), {
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

/**
 * Fetch a single booking by ID for admin
 * @param {string} id - Booking ID
 * @returns {Promise}
 */
export async function getAdminBookingById(id) {
  try {
    const response = await axios.get(buildApiUrl(`/admin/bookings/${id}`), {
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
