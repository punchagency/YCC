import axios from "axios";
import { API_URL } from '../../config';

// Configure axios defaults
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Get all services (public route - no auth required)
export const getAllServices = async () => {
  try {
    const url = `/public/services`;
    console.log("Fetching all services from URL:", url);
    console.log("API_URL value:", API_URL);
    console.log("Full URL:", `${API_URL}${url}`);
    const response = await api.get(url);
    console.log("Services response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching services:", error);
    console.error("Error Message:", error.message);
    console.error("Request URL:", error.config?.url);
    console.error("Request method:", error.config?.method);
    console.error("Request headers:", error.config?.headers);
    throw error;
  }
};

// Get service by name (public route - no auth required)
export const getServiceByName = async (name) => {
  try {
    const response = await axios.get(`${API_URL}/public/services/${name}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching service:", error);
    throw error;
  }
};

// Protected routes (require authentication)
export const createService = async (serviceData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/services/create`,
      serviceData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating service:", error);
    throw error;
  }
};

export const updateService = async (id, serviceData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${API_URL}/services/update/${id}`,
      serviceData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating service:", error);
    throw error;
  }
};

export const deleteService = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API_URL}/services/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting service:", error);
    throw error;
  }
};

export const getAllVendorServices = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/services/vendor`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching vendor services:", error);
    throw error;
  }
};

export const uploadServices = async (file) => {
  try {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(`${API_URL}/services/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading services:", error);
    throw error;
  }
};
