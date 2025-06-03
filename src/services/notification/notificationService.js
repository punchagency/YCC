import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getNotifications = async ({
  page = 1,
  limit = 10,
  priority,
} = {}) => {
  try {
    console.log("Fetching notifications with params:", {
      page,
      limit,
      priority,
    });

    const response = await axios.get(`${API_URL}/notifications`, {
      headers: getAuthHeader(),
      params: {
        page,
        limit,
        priority,
      },
    });

    console.log("Raw API Response:", response.data);

    if (response.data.status) {
      return {
        success: true,
        data: response.data.data.notifications,
        pagination: response.data.data.pagination,
      };
    } else {
      return {
        success: false,
        error: response.data.message || "Failed to fetch notifications",
      };
    }
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

export const updateComplaintStatus = async (complaintId, status) => {
  try {
    console.log(`Updating complaint ${complaintId} status to: ${status}`);

    const response = await axios.patch(
      `${process.env.REACT_APP_API_URL}/complaints/${complaintId}/status`,
      { status },
      { headers: getAuthHeader() }
    );

    console.log("Update complaint status response:", response.data);

    return {
      success: true,
      data: response.data.data,
      message: response.data.message || "Complaint status updated successfully",
    };
  } catch (error) {
    console.error("Error updating complaint status:", error);
    return {
      success: false,
      error:
        error.response?.data?.message || "Failed to update complaint status",
    };
  }
};
