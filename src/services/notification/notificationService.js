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

export const markNotificationAsRead = async (notificationId) => {
  try {
    console.log(`Marking notification ${notificationId} as read`);

    const response = await axios.patch(
      `${API_URL}/notifications/${notificationId}/read`,
      {},
      { headers: getAuthHeader() }
    );

    console.log("Mark notification as read response:", response.data);

    if (response.data.status) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || "Notification marked as read",
      };
    } else {
      return {
        success: false,
        error: response.data.message || "Failed to mark notification as read",
      };
    }
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return {
      success: false,
      error:
        error.response?.data?.message || "Failed to mark notification as read",
    };
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    console.log("Marking all notifications as read");

    const response = await axios.patch(
      `${API_URL}/notifications/mark-all-read`,
      {},
      { headers: getAuthHeader() }
    );

    console.log("Mark all notifications as read response:", response.data);

    if (response.data.status) {
      return {
        success: true,
        message: response.data.message || "All notifications marked as read",
      };
    } else {
      return {
        success: false,
        error: response.data.message || "Failed to mark all notifications as read",
      };
    }
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return {
      success: false,
      error:
        error.response?.data?.message || "Failed to mark all notifications as read",
    };
  }
};

export const deleteNotification = async (notificationId) => {
  try {
    console.log(`Deleting notification ${notificationId}`);

    const response = await axios.delete(
      `${API_URL}/notifications/${notificationId}`,
      { headers: getAuthHeader() }
    );

    console.log("Delete notification response:", response.data);

    if (response.data.status) {
      return {
        success: true,
        message: response.data.message || "Notification deleted successfully",
      };
    } else {
      return {
        success: false,
        error: response.data.message || "Failed to delete notification",
      };
    }
  } catch (error) {
    console.error("Error deleting notification:", error);
    return {
      success: false,
      error:
        error.response?.data?.message || "Failed to delete notification",
    };
  }
};

export const updateComplaintStatus = async (complaintId, status) => {
  try {
    console.log(`Updating complaint ${complaintId} status to: ${status}`);

    const response = await axios.patch(
      `${API_URL}/complaints/${complaintId}/status`,
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

export const updateNotificationStatus = async (notificationId, status) => {
  console.warn("updateNotificationStatus is deprecated. Use markNotificationAsRead instead.");
  return markNotificationAsRead(notificationId);
};
