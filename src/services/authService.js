import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;
console.log("API_URL:", process.env.REACT_APP_API_URL);

export const signup = async (userData) => {
  try {
    console.log("Sending signup request:", userData);
    const response = await axios.post(`${API_URL}/signup`, userData, {
      headers: {
        "Content-Type": "multipart/form-data", // Add this for file uploads
      },
    });
    if(response.data.token){
      localStorage.setItem("token", response.data.token)
    }
    console.log("Signup response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Signup failed:", error.response?.data || error.message);
    throw error.response?.data || { message: "Signup failed" };
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
