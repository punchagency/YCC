import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/bookings`;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getBookingService = async (vendorId) => {
  try {
    const response = await axios.get(`${API_URL}/${vendorId}/vendor`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateBookingService = async (bookingId, booking) => {
  try {
    const response = await axios.patch(`${API_URL}/${bookingId}`, booking);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateBookingStatusService = async (bookingId, status) => {
  try {
    const response = await axios.patch(`${API_URL}/${bookingId}/status`, {
      status,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteBookingService = async (bookingId) => {
  try {
    const response = await axios.delete(`${API_URL}/${bookingId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createBookingService = async (bookingData) => {
  try {
    const response = await axios.post(API_URL, bookingData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllBookingService = async (page = 1, limit = 10) => {
  try {
    console.log("Fetching bookings with:", { page, limit });
    const response = await axios.get(`${API_URL}/bookings`, {
      headers: getAuthHeader(),
      params: {
        page,
        limit,
      },
    });

    // Log the response to check the structure
    console.log("Bookings API Response:", response.data);

    // Make sure we're returning both the data and pagination info
    return {
      status: true,
      data: response.data.data || response.data, // Handle both structures
      pagination: {
        total: response.data.total || response.data.length,
        page: response.data.page || page,
        limit: response.data.limit || limit,
      },
    };
  } catch (error) {
    console.error("Error in getAllBookingService:", error);
    return {
      status: false,
      message: error.response?.data?.message || "Failed to fetch bookings",
      data: [],
      pagination: {
        total: 0,
        page: page,
        limit: limit,
      },
    };
  }
};

export const bulkDeleteBookings = async (bookingIds) => {
  try {
    const response = await axios.post(
      `${API_URL}/bulk-delete-bookings`,
      { bookingIds },
      {
        headers: getAuthHeader(),
      }
    );

    return {
      success: true,
      message: response.data.message || "Bookings deleted successfully",
    };
  } catch (error) {
    console.error(
      "Error bulk deleting bookings:",
      error.response?.data || error.message
    );
    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete bookings",
    };
  }
};
