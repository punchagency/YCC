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
      createdAt: complaint.createdAt || complaint.create_at || new Date(),
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

export const updateNotificationStatus = async (notificationId, status) => {
  try {
    const response = await axios.patch(
      `${API_URL}/complaints/${notificationId}/status`,
      { status },
      { headers: getAuthHeader() }
    );

    if (response.data.status) {
      return {
        success: true,
        data: response.data.data,
      };
    } else {
      return {
        success: false,
        error: response.data.message || "Failed to update notification status",
      };
    }
  } catch (error) {
    console.error("Error updating notification status:", error);
    return {
      success: false,
      error:
        error.response?.data?.message ||
        "An error occurred while updating notification status",
    };
  }
};
