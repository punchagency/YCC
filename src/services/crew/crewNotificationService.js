import axios from "axios";

// Use the base API URL
const API_URL = process.env.REACT_APP_API_URL;

// Add authentication token to requests
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Get user data from localStorage
const getUserData = () => {
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  } catch (error) {
    console.error("Error getting user data from localStorage:", error);
    return null;
  }
};

/**
 * Fetch notifications for the current crew member
 * @param {Object} params - Query parameters including page and limit
 * @returns {Promise<Object>} - Response with success status and data
 */
export const fetchCrewNotifications = async (params = {}) => {
  try {
    const { page = 1, limit = 10 } = params;

    console.log("Fetching notifications with params:", { page, limit });

    const response = await axios.get(
      `${API_URL}/crew-notifications/notify?page=${page}&limit=${limit}`,
      {
        headers: getAuthHeader(),
      }
    );

    console.log("API Response for notifications:", response.data);

    return {
      success: true,
      data: response.data.data,
      pagination: response.data.pagination,
      message: response.data.message,
    };
  } catch (error) {
    console.error("Error fetching crew notifications:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch notifications",
    };
  }
};

/**
 * Update notification status
 * @param {string} id - Notification ID
 * @param {string} status - New status
 * @returns {Promise<Object>} - Response with success status and data
 */
export const updateNotificationStatus = async (id, status) => {
  try {
    console.log(`Updating notification ${id} status to:`, status);

    const response = await axios.patch(
      `${API_URL}/crew-notifications/${id}/status`,
      { status },
      {
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Status update response:", response.data);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error(`Error updating notification status for ${id}:`, error);
    return {
      success: false,
      error:
        error.response?.data?.message || "Failed to update notification status",
    };
  }
};

/**
 * Mark notification as read
 * @param {string} id - Notification ID
 * @returns {Promise<Object>} - Response with success status and data
 */
export const markNotificationAsRead = async (id) => {
  try {
    console.log(`Marking notification ${id} as read`);

    const response = await axios.patch(
      `${API_URL}/crew-notifications/${id}/read`,
      {},
      {
        headers: getAuthHeader(),
      }
    );

    console.log("Mark as read response:", response.data);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error(`Error marking notification ${id} as read:`, error);
    return {
      success: false,
      error:
        error.response?.data?.message || "Failed to mark notification as read",
    };
  }
};

/**
 * Get unread notifications count
 * @returns {Promise<Object>} - Response with success status and count
 */
export const getUnreadNotificationsCount = async () => {
  try {
    console.log("Fetching unread notifications count");

    const response = await axios.get(
      `${API_URL}/crew-notifications/unread/count`,
      {
        headers: getAuthHeader(),
      }
    );

    console.log("Unread count response:", response.data);

    return {
      success: true,
      count: response.data.count,
    };
  } catch (error) {
    console.error("Error fetching unread notifications count:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch unread count",
    };
  }
};
