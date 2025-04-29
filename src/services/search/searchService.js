import axios from "axios";

export const searchAll = async (query) => {
    try {
        const token = localStorage.getItem("token");
        if(!token) {
            return {
                success: false,
                message: "No token found",
                data: null,
            };
        }

       const response = await axios.get(
         `http://localhost:7000/api/search?query=${encodeURIComponent(query)}`,
         {
           headers: {
             Authorization: `Bearer ${token}`,
           },
         }
       );

       return response.data;
        
        
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "An error occurred",
            data: null,
            error: error.response?.data || error.message,
        };
    }
}
