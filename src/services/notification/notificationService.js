import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getNotifications = async () => {
  try {
    const response = await axios.get(`${API_URL}/complaints`, {
      headers: getAuthHeader(),
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error fetching complaints:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch complaints",
    };
  }
};  

