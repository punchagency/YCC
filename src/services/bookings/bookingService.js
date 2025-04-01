import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/bookings`;

export const getBookings = async (vendorId) => {
    const response = await axios.get(`${API_URL}/${vendorId}/vendor`);
    return response.data;
}

export const deleteBooking = async (bookingId) => {
    const response = await axios.delete(`${API_URL}/${bookingId}`);
    return response;
}
