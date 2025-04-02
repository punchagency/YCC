import axios from 'axios';

const API_URL = 'https://ycc-ee4d189a3af8.herokuapp.com/api/services';
const token = localStorage.getItem("token");

export const getAllVendorServices = async () => {
    try {
        const response = await axios.get(`${API_URL}/vendor`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};