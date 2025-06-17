import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// Helper to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// Get user settings
export const getUserSettings = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        status: false,
        message: "Authentication required",
      };
    }

    const response = await axios.get(`${API_URL}/settings`, {
      headers: getAuthHeader(),
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching user settings:", error);
    return {
      status: false,
      message: error.response?.data?.message || "Error retrieving settings",
      error: error.message,
    };
  }
};

// Update user settings
export const updateUserSettings = async (settingsData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        status: false,
        message: "Authentication required",
      };
    }

    const response = await axios.put(`${API_URL}/settings`, settingsData, {
      headers: getAuthHeader(),
    });

    return response.data;
  } catch (error) {
    console.error("Error updating user settings:", error);
    return {
      status: false,
      message: error.response?.data?.message || "Error updating settings",
      error: error.message,
    };
  }
};

// Upload profile picture
export const uploadProfilePicture = async (file) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        status: false,
        message: "Authentication required",
      };
    }
    const formData = new FormData();
    formData.append("profilePicture", file);
    const response = await axios.post(`${API_URL}/settings/profile-picture`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    return {
      status: false,
      message: error.response?.data?.message || "Error uploading profile picture",
      error: error.message,
    };
  }
};

// Remove profile picture
export const removeProfilePicture = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        status: false,
        message: "Authentication required",
      };
    }
    const response = await axios.delete(`${API_URL}/settings/profile-picture`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error removing profile picture:", error);
    return {
      status: false,
      message: error.response?.data?.message || "Error removing profile picture",
      error: error.message,
    };
  }
};
