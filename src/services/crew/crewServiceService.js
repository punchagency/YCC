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
    console.log("Calling getServices API with params:", params);
    console.log("API URL:", `${API_URL}/services/all/services`);

    const response = await axios.get(`${API_URL}/services/all/services`, {
      params,
      headers: {
        ...getAuthHeader(),
      },
    });

    console.log("API response status:", response.status);
    console.log("API response data structure:", Object.keys(response.data));

    return {
      status: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error fetching services:", error);
    console.error("Error response:", error.response?.data);
    return {
      status: false,
      error: error.response?.data?.message || "Failed to fetch services",
    };
  }
};

export const createBooking = async (bookingData) => {
  try {
    console.log("Creating booking with data:", bookingData);

    const response = await axios.post(`${API_URL}/bookings`, bookingData, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json",
      },
    });

    console.log("Booking creation response:", response.data);

    return {
      status: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error creating booking:", error);
    console.error("Error response:", error.response?.data);
    return {
      status: false,
      error: error.response?.data?.message || "Failed to create booking",
    };
  }
};