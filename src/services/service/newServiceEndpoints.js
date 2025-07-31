import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// Helper to get auth header
const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };
};

export const createService = async ({ name, price, description }) => {
    try {
        const response = await axios.post(`${API_URL}/services/create-service`, { name, price, description }, {
            headers: getAuthHeader(),
        });

        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        console.error("Error creating event:", error);
        return {
            success: false,
            error: error.response?.data?.message || "Failed to create event",
        };
    }
}

export const getAllServices = async ({ search, page = 1, limit = 20}) => {
    try {
        const queryParams = new URLSearchParams();
        if (search) queryParams.append('search', search);
        if (page) queryParams.append('page', page.toString());
        if (limit) queryParams.append('limit', limit.toString());
        const response = await axios.get(`${API_URL}/services/get-services?${queryParams}`, {
            headers: getAuthHeader(),
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching events:", error);
        return {
            success: false,
            error: error.response?.data?.message || "Failed to fetch events",
        };
    }
}

export const updateService = async (service_id, { name, price, description}) => {
    try {
        const response = await axios.put(`${API_URL}/services/update-service/${service_id}`, { name, price, description}, {
            headers: getAuthHeader(),
        });

        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        console.error("Error updating event:", error);
        return {
            success: false,
            error: error.response?.data?.message || "Failed to update event",
        };
    }
}

export const deleteService = async (service_id) => {
    try {
        const response = await axios.delete(`${API_URL}/services/${service_id}`, {
            headers: getAuthHeader(),
        });

        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        console.error("Error deleting event:", error);
        return {
            success: false,
            error: error.response?.data?.message || "Failed to delete event",
        };
    }
}