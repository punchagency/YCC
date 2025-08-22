import axios from "axios";
const API_URL = `${process.env.REACT_APP_API_URL}`;
const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getCrewQuotes = async ({ page, limit, status }) => {
    try {
        const queryParams = new URLSearchParams();
        if (page) queryParams.append('page', page.toString());
        if (limit) queryParams.append('limit', limit.toString());
        if (status) queryParams.append('status', status);
        const response = await axios.get(`${API_URL}/quotes/customer?${queryParams}`, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching quotes:", error);
        throw error;
    }
};

export const getQuoteById = async (quoteId) => {
    try {
        const response = await axios.get(`${API_URL}/quotes/${quoteId}`, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching quote:", error);
        throw error;
    }
}

export const approveQuoteAndPay = async (quoteId) => {
    try {
        const response = await axios.post(`${API_URL}/quotes/approve/${quoteId}`, null, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        console.error("Error approving quote:", error);
        throw error;
    }
}

export const declineQuote = async (quoteId, reason) => {
    try {
        const response = await axios.post(`${API_URL}/quotes/decline/${quoteId}`, { reason }, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        console.error("Error declining quote:", error);
        throw error;
    }
}
export const getUnapprovedBookings = async () => {
    try {
        const response = await axios.get(`${API_URL}/quotes/unapproved-bookings`, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        console.error("Error declining quote:", error);
        throw error;
    }
}
export const approveCompletedBooking = async ({ bookingId, rating, feedback }) => {
    try {
        const response = await axios.post(`${API_URL}/quotes/approve-completed-booking/${bookingId}`, { rating, feedback }, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        console.error("Error declining quote:", error);
        return { status: false, message: error.response.data.message };
    }
}
export const objectCompletedBooking = async ({ bookingId, objectionReason, details }) => {
    try {
        const response = await axios.post(`${API_URL}/quotes/object-completed-booking/${bookingId}`, { objectionReason, details }, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        console.error("Error declining quote:", error);
        return { status: false, message: error.response.data.message };
    }
}