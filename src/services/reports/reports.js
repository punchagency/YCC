import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;


const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};



const getInventoryHealthReport = async ()=>{
    try {
        const response = await axios.get(`${API_URL}/reports/inventory-health`, {
            headers: getAuthHeader(),
        });
        return {
            success: true,
            data: response.data,
            message: response.data.message,
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || "Failed to fetch inventory health report",
        };
    }
}


export { getInventoryHealthReport };