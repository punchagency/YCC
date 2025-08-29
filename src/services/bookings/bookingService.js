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

    const response = await axios.patch(`${API_URL}/${bookingId}`, booking, {
      headers: getAuthHeader(),
    });

    return {
      status: true,
      data: response.data,
      message: "Booking updated successfully",
    };
  } catch (error) {
    return {
      status: false,
      message: error.response?.data?.message || "Failed to update booking",
      error: error,
    };
  }
};

export const updateBookingStatusService = async (bookingId, status) => {
  try {
    const response = await axios.patch(
      `${process.env.REACT_APP_API_URL}/bookings/${bookingId}/status`,
      { status },
      { headers: getAuthHeader() }
    );

    return {
      status: true,
      data: response.data,
      message: "Status updated successfully",
    };
  } catch (error) {
    return {
      status: false,
      message:
        error.response?.data?.message || "Failed to update booking status",
    };
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
    const response = await axios.post(API_URL, bookingData, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllBookingService = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${API_URL}/user/bookings`, {
      headers: getAuthHeader(),
      params: {
        page,
        limit,
      },
    });

    if (response.data.status) {
      return {
        status: true,
        data: response.data.data,
        pagination: {
          total: response.data.data.length,
          page: page,
          limit: limit,
        },
      };
    } else {
      return {
        status: false,
        message: response.data.message || "Failed to fetch bookings",
        data: [],
        pagination: {
          total: 0,
          page: page,
          limit: limit,
        },
      };
    }
  } catch (error) {
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
      `${API_URL}/bulk-delete-bookings`, // Make sure this endpoint matches your backend
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

    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete bookings",
    };
  }
};

export const getServiceProviderBookings = async ({ page = 1, limit = 10, status, paymentStatus, StartDate, EndDate, sortBy = "dateTime", sortOrder = "desc" }) => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("page", page);
    queryParams.append("limit", limit);
    if(status) queryParams.append("status", status);
    if(paymentStatus) queryParams.append("paymentStatus", paymentStatus);
    if(StartDate) queryParams.append("StartDate", StartDate);
    if(EndDate) queryParams.append("EndDate", EndDate);
    if(sortBy) queryParams.append("sortBy", sortBy);
    if(sortOrder) queryParams.append("sortOrder", sortOrder);
    const response = await axios.get(`${API_URL}/vendor-bookings?${queryParams}`, {
      headers: getAuthHeader(),
    });

    return response.data;
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete bookings",
    };
  }
};

export const updateStatusOfBooking = async ({bookingId, status, reason, notes, requiresQuote, quoteItems}) => {
  try {
    const response = await axios.patch(`${API_URL}/${bookingId}/status`, { status, reason, notes, requiresQuote, quoteItems }, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update booking status",
    };
  }
}