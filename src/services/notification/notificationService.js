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

    // Transform the API response to match our notification structure
    const transformedData = response.data.data.map((complaint) => ({
      priority: complaint.priority || "Low",
      type: complaint.type || "General Issue",
      description: complaint.description,
      status: complaint.status || "Pending",
      _id: complaint._id,
    }));

    return {
      success: true,
      data: transformedData,
    };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch notifications",
    };
  }
};
