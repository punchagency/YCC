import axios from "axios";
import { buildApiUrl } from "../utils/apiUtils";

export const signup = async (formData) => {
  try {
    const response = await axios.post(buildApiUrl("auth/signup"), formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const login = async (userData) => {
  try {
    const response = await axios.post(buildApiUrl("auth/login"), userData);

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
};

export const ForgotPassword = async (email) => {
  try {
    const response = await axios.post(buildApiUrl("auth/forgot-password"), {
      email,
    });
    return {
      status: "success",
      message: response.data.message,
      data: response.data.data,
    };
  } catch (error) {
    return {
      status: "error",
      message: error.response?.data?.message || "Something went wrong!",
    };
  }
};

export const checkTokenValidity = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { valid: false, message: "No token found" };
    }

    // Make a request to a protected endpoint to check if token is valid
    const response = await axios.get(buildApiUrl("auth/verify-token"), {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { valid: true, data: response.data };
  } catch (error) {
    return {
      valid: false,
      message: error.response?.data?.message || "Token validation failed",
    };
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("id");
  localStorage.removeItem("user");

  // Redirect to login page
  window.location.href = "/login";
};

export const verifyOtp = async (email, otp) => {
  try {
    const response = await axios.post(buildApiUrl("auth/verify-otp"), {
      email,
      otp,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
