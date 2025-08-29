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


    const response = await axios.get(`${API_URL}/notifications`, {
      headers: getAuthHeader(),
      params: {
        page,
        limit,
        priority,
      },
    });

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

export const markNotificationAsRead = async (notificationId) => {
  try {

    const response = await axios.patch(
      `${API_URL}/notifications/${notificationId}/read`,
      {},
      { headers: getAuthHeader() }
    );

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
    return {
      success: false,
      error:
        error.response?.data?.message || "Failed to mark notification as read",
    };
  }
};

export const markAllNotificationsAsRead = async () => {
  try {

    const response = await axios.patch(
      `${API_URL}/notifications/mark-all-read`,
      {},
      { headers: getAuthHeader() }
    );

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
    return {
      success: false,
      error:
        error.response?.data?.message || "Failed to mark all notifications as read",
    };
  }
};

export const deleteNotification = async (notificationId) => {
  try {

    const response = await axios.delete(
      `${API_URL}/notifications/${notificationId}`,
      { headers: getAuthHeader() }
    );

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
    return {
      success: false,
      error:
        error.response?.data?.message || "Failed to delete notification",
    };
  }
};

export const updateComplaintStatus = async (complaintId, status) => {
  try {

    const response = await axios.patch(
      `${API_URL}/complaints/${complaintId}/status`,
      { status },
      { headers: getAuthHeader() }
    );

    return {
      success: true,
      data: response.data.data,
      message: response.data.message || "Complaint status updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.message || "Failed to update complaint status",
    };
  }
};

export const getSupplierNotifications = async ({page = 1, limit = 10, priority,}) => {
  try {
    const response = await axios.get(`${API_URL}/notifications/supplier`, {
      headers: getAuthHeader(),
      params: {
        page,
        limit,
        priority,
      },
    });

    return response.data;
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch notifications",
    };
  }
};

// Supplier notification functions
export const markSupplierNotificationAsRead = async (notificationId) => {
  try {
    const response = await axios.patch(
      `${API_URL}/notifications/supplier/${notificationId}/read`,
      {},
      { headers: getAuthHeader() }
    );

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
    return {
      success: false,
      error: error.response?.data?.message || "Failed to mark notification as read",
    };
  }
};

export const markAllSupplierNotificationsAsRead = async () => {
  try {
    const response = await axios.patch(
      `${API_URL}/notifications/supplier/read-all`,
      {},
      { headers: getAuthHeader() }
    );

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
    return {
      success: false,
      error: error.response?.data?.message || "Failed to mark all notifications as read",
    };
  }
};

export const deleteSupplierNotification = async (notificationId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/notifications/supplier/${notificationId}`,
      { headers: getAuthHeader() }
    );

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
    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete notification",
    };
  }
};

// Vendor notification functions
export const getVendorNotifications = async ({ page = 1, limit = 10, priority } = {}) => {
  try {
    const response = await axios.get(`${API_URL}/notifications/vendor`, {
      headers: getAuthHeader(),
      params: {
        page,
        limit,
        priority,
      },
    });

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

export const markVendorNotificationAsRead = async (notificationId) => {
  try {
    
    const response = await axios.patch(
      `${API_URL}/notifications/vendor/${notificationId}/read`,
      {},
      { headers: getAuthHeader() }
    );

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
    
    return {
      success: false,
      error: error.response?.data?.message || "Failed to mark notification as read",
    };
  }
};

export const markAllVendorNotificationsAsRead = async () => {
  try {
    
    const response = await axios.patch(
      `${API_URL}/notifications/vendor/read-all`,
      {},
      { headers: getAuthHeader() }
    );

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
    
    return {
      success: false,
      error: error.response?.data?.message || "Failed to mark all notifications as read",
    };
  }
};

export const deleteVendorNotification = async (notificationId) => {
  try {
    
    const response = await axios.delete(
      `${API_URL}/notifications/vendor/${notificationId}`,
      { headers: getAuthHeader() }
    );

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

    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete notification",
    };
  }
};

export const updateNotificationStatus = async (notificationId, status) => {
  // console.warn("updateNotificationStatus is deprecated. Use markNotificationAsRead instead.");
  return markNotificationAsRead(notificationId);
};
