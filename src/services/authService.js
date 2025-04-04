import axios from "axios";

const API_URL = "http://localhost:7000/api";
console.log("API_URL:", API_URL);

export const signup = async (formData) => {
  try {
    console.log("AuthService: Starting signup request");
    console.log("FormData contents:");
    for (let pair of formData.entries()) {
      console.log(
        pair[0],
        ":",
        pair[1] instanceof File
          ? { name: pair[1].name, type: pair[1].type, size: pair[1].size }
          : pair[1]
      );
    }

    const response = await axios.post(`${API_URL}/auth/signup`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("AuthService: Received response:", response.data);

    if (response.data.token) {
      console.log("AuthService: Storing token in localStorage");

      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error("AuthService: Signup error:", {
      response: error.response?.data,
      error: error.message,
    });
    throw error.response?.data || error;
  }
};

export const login = async (userData) => {
  try {
    console.log("Sending login request:", userData);
    const response = await axios.post(`${API_URL}/auth/login`, userData);
    console.log("Login response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    throw error.response?.data || { message: "Login failed" };
  }
};

export const ForgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/auth/forgot-password`, {
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
    const response = await axios.get(`${API_URL}/auth/verify-token`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { valid: true, data: response.data };
  } catch (error) {
    console.error("Token validation failed:", error);
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
  
  console.log("User logged out, tokens removed from localStorage");
  
  // Redirect to login page
  window.location.href = "/login";
};
