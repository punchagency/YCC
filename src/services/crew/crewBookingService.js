import axios from "axios";
import { API_URL } from "../../config";

// Helper function to get auth headers
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Create a new booking
 * @param {Object} bookingData - The booking data
 * @returns {Promise<Object>} - Response with status and data or error
 */
export const createBooking = async (bookingData) => {
  try {
    const response = await axios.post(`${API_URL}/crew-bookings`, bookingData, {
      headers: {
        ...getAuthHeader(),
      },
    });

    return {
      status: true,
      data: response.data,
      booking: response.data.booking,
    };
  } catch (error) {
    console.error("Error creating booking:", error);
    return {
      status: false,
      error: error.response?.data?.message || "Failed to create booking",
    };
  }
};

/**
 * Get all bookings
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} - Response with status and data or error
 */
export const getBookings = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/crew-bookings`, {
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
    console.error("Error fetching bookings:", error);
    return {
      status: false,
      error: error.response?.data?.message || "Failed to fetch bookings",
    };
  }
};

/**
 * Get booking by ID
 * @param {string} bookingId - The ID of the booking to retrieve
 * @returns {Promise<Object>} - Response with status and data or error
 */
export const getBookingById = async (bookingId) => {
  try {
    const response = await axios.get(`${API_URL}/crew-bookings/${bookingId}`, {
      headers: {
        ...getAuthHeader(),
      },
    });

    return {
      status: true,
      data: response.data,
    };
  } catch (error) {
    console.error(`Error fetching booking ${bookingId}:`, error);
    return {
      status: false,
      error: error.response?.data?.message || "Failed to fetch booking details",
    };
  }
};
export const getVendorsAndServices = async () => {
  try {
    const response = await axios.get(`${API_URL}/crew-bookings/vendors-and-services`, {
      headers: {
        ...getAuthHeader(),
      },
    });

    return {
      status: true,
      data: response.data,
    };
  } catch (error) {
    console.error(`Error fetching vendors and their services:`, error);
    return {
      status: false,
      error: error.response?.data?.message || "Failed to fetching vendors and their services",
    };
  }
};
