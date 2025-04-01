import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/bookings`;

export const getBookings = async (vendorId) => {
    const response = await axios.get(`${API_URL}/${vendorId}/vendor`);
    return response.data;
}

export const updateBooking = async (bookingId, booking) => {
    const response = await axios.patch(`${API_URL}/${bookingId}`, booking);
    return response;
}

export const deleteBooking = async (bookingId) => {
    const response = await axios.delete(`${API_URL}/${bookingId}`);
    return response;
}
