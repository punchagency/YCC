import axios from "axios";
import { buildApiUrl } from "../utils/apiUtils";
import { captureApiError, captureUserAction, updateUserContext, clearUserContext } from "./sentry/sentryService";

export const signup = async (formData) => {
  try {
    captureUserAction("signup_attempt", { hasFormData: true });
    
    const response = await axios.post(buildApiUrl("auth/signup"), formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      captureUserAction("signup_success", { userId: response.data.user?.id });
      
      // Update user context for Sentry
      if (response.data.user) {
        updateUserContext(response.data.user);
      }
    }
    
    return response.data;
  } catch (error) {
    captureApiError(error, {
      endpoint: "auth/signup",
      method: "POST",
      hasFormData: true,
    }, "User Signup");
    
    throw error.response?.data || error;
  }
};

export const login = async (userData) => {
  try {
    captureUserAction("login_attempt", { email: userData.email });
    
    const response = await axios.post(buildApiUrl("auth/login"), userData);

    if (response.data.success && response.data.user) {
      captureUserAction("login_success", { 
        userId: response.data.user.id,
        role: response.data.user.role 
      });
      
      // Update user context for Sentry
      updateUserContext(response.data.user);
    }

    return response.data;
  } catch (error) {
    captureApiError(error, {
      endpoint: "auth/login",
      method: "POST",
      email: userData.email,
    }, "User Login");
    
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
  captureUserAction("logout", { timestamp: new Date().toISOString() });
  
  localStorage.removeItem("token");
  localStorage.removeItem("id");
  localStorage.removeItem("user");

  // Clear Sentry user context
  clearUserContext();

  // Redirect to login page
  window.location.href = "/login";
};

export const findUserByEmail = async (email) => {
  try {
    const response = await axios.get(buildApiUrl("auth/find-user-by-email/" + email));
    return response.data;
  } catch (error) {
    return error.response.data;
  }
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
