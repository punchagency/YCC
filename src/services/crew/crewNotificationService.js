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
    const { page = 1, limit = 10, type, status } = params;

    const response = await axios.get(
      `${API_URL}/crew-notifications/notify`,
      {
        headers: getAuthHeader(),
        params: {
          page,
          limit,
          type,
          status,
        },
      }
    );

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

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
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
    const response = await axios.patch(
      `${API_URL}/crew-notifications/${id}/read`,
      {},
      {
        headers: getAuthHeader(),
      }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
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
    const response = await axios.get(
      `${API_URL}/crew-notifications/unread/count`,
      {
        headers: getAuthHeader(),
      }
    );

    return {
      success: true,
      count: response.data.count,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch unread count",
    };
  }
};
