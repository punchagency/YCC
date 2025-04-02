import axios from 'axios';

const API_URL = 'https://ycc-ee4d189a3af8.herokuapp.com/api/bookings';

export const getBookingService = async (vendorId) => {
  try {
    const response = await axios.get(`${API_URL}/${vendorId}/vendor`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const updateBookingService = async (bookingId, booking) => {
  try {
    const response = await axios.patch(`${API_URL}/${bookingId}`, booking);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const updateBookingStatusService = async (bookingId, status) => {
  try {
    const response = await axios.patch(`${API_URL}/${bookingId}/status`, { status });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const deleteBookingService = async (bookingId) => {
  try {
    const response = await axios.delete(`${API_URL}/${bookingId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}
