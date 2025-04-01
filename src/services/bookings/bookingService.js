import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/bookings`;

export const getBookingService = async (vendorId) => {
    const response = await axios.get(`${API_URL}/${vendorId}/vendor`);
    return response.data;
}

export const updateBookingService = async (bookingId, booking) => {
    const response = await axios.patch(`${API_URL}/${bookingId}`, booking);
    console.log('response', response)
    //return response;
}

export const deleteBookingService = async (bookingId) => {
    const response = await axios.delete(`${API_URL}/${bookingId}`);
    return response;
}
