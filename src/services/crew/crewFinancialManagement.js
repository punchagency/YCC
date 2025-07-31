import axios from "axios";

// Use the base API URL
const API_URL = process.env.REACT_APP_API_URL;
const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const CrewFinancialManagement = async() =>{
    const URL = `${API_URL}/crew-financial-management/financial-analytics`;
    const headers = getAuthHeader();
    headers["Content-Type"] = "application/json";
    try {
        const response = await axios.get(URL, { headers });

        if(response.status === 200){
            return {
                success: true,
                data: response.data.data,
                message: response.data.message
            };
        }else{
            return {
                success: false,
                error: response.data.message
            }
        }
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || "Failed to fetch crew financial management data"
        };
    }

}