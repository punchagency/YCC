import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/services`;
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