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

export const getServiceById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/services/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
// Get all services (public route - no auth required)
export const getAllServices = async (type) => {
  try {
    const url = `/public/services?type=${type}`;
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get service by name (public route - no auth required)
export const getServiceByName = async (name) => {
  try {
    const response = await axios.get(`${API_URL}/public/services/${name}`);
    return response.data;
  } catch (error) {
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
    throw error;
  }
};
