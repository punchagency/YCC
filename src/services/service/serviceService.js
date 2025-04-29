import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/services`;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAllServices = async () => {
  try {
    console.log("Fetching all services...");
    const response = await axios.get(`${API_URL}/all/services`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};

export const getAllVendorServices = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/vendor`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateOneService = async (serviceId, updatedService) => {
  try {
    const response = await axios.patch(`${API_URL}/${serviceId}`, updatedService, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteOneService = async (serviceId) => {
  try {
    const response = await axios.delete(`${API_URL}/${serviceId}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createOneService = async (newService) => {
  try {
    const response = await axios.post(`${API_URL}`, newService, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
