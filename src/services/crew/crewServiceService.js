import axios from "axios";
import { API_URL } from "../../config";

// Helper function to get auth headers
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Get all services
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} - Response with status and data or error
 */
export const getServices = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/services/all/services`, {
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
    return {
      status: false,
      error: error.response?.data?.message || "Failed to fetch services",
    };
  }
};

export const createBooking = async (bookingData) => {
  try {
    const response = await axios.post(`${API_URL}/bookings`, bookingData, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json",
      },
    });

    return {
      status: true,
      data: response.data,
    };
  } catch (error) {
    return {
      status: false,
      error: error.response?.data?.message || "Failed to create booking",
    };
  }
};