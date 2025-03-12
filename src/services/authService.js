import axios from "axios";

const API_URL = "https://ycc-ee4d189a3af8.herokuapp.com";
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

    const response = await axios.post(`${API_URL}/signup`, formData, {
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
    const response = await axios.post(`${API_URL}/login`, userData);
    console.log("Login response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    throw error.response?.data || { message: "Login failed" };
  }
};

export const ForgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/forgot-password`, { email });
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
