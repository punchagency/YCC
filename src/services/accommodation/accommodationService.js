import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/hotels`;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Get all accommodations with optional filtering
 */
export const getAllAccommodations = async (filters = {}) => {
  try {
    const params = new URLSearchParams();

    if (filters.location) params.append("location", filters.location);
    if (filters.checkIn) params.append("checkIn", filters.checkIn);
    if (filters.checkOut) params.append("checkOut", filters.checkOut);
    if (filters.adults) params.append("adults", filters.adults);
    if (filters.children) params.append("children", filters.children);
    if (filters.rooms) params.append("rooms", filters.rooms);
    if (filters.currency) params.append("currency", filters.currency);
    if (filters.sort) params.append("sort", filters.sort);

    const response = await axios.get(`${API_URL}/search?${params.toString()}`);

    return {
      status: true,
      data: response.data.data,
      pagination: response.data.pagination,
      message: response.data.message,
    };
  } catch (error) {
    console.error("Error fetching accommodations:", error);
    return {
      status: false,
      message:
        error.response?.data?.message || "Failed to fetch accommodations",
      data: [],
      pagination: null,
    };
  }
};

/**
 * Get accommodation by ID
 */
export const getAccommodationById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);

    return {
      status: true,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error) {
    console.error("Error fetching accommodation:", error);
    return {
      status: false,
      message: error.response?.data?.message || "Failed to fetch accommodation",
      data: null,
    };
  }
};

/**
 * Get accommodations by location
 */
export const getAccommodationsByLocation = async (location, filters = {}) => {
  try {
    const params = new URLSearchParams();

    if (filters.page) params.append("page", filters.page);
    if (filters.limit) params.append("limit", filters.limit);

    const response = await axios.get(
      `${API_URL}/location/${location}?${params.toString()}`
    );

    return {
      status: true,
      data: response.data.data,
      pagination: response.data.pagination,
      message: response.data.message,
    };
  } catch (error) {
    console.error("Error fetching accommodations by location:", error);
    return {
      status: false,
      message:
        error.response?.data?.message ||
        "Failed to fetch accommodations by location",
      data: [],
      pagination: null,
    };
  }
};

/**
 * Get all unique locations
 */
export const getLocations = async () => {
  try {
    const response = await axios.get(`${API_URL}/destinations`);

    return {
      status: true,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error) {
    console.error("Error fetching locations:", error);
    return {
      status: false,
      message: error.response?.data?.message || "Failed to fetch locations",
      data: [],
    };
  }
};

/**
 * Create new accommodation (requires authentication)
 */
export const createAccommodation = async (accommodationData) => {
  try {
    const response = await axios.post(API_URL, accommodationData, {
      headers: getAuthHeader(),
    });

    return {
      status: true,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error) {
    console.error("Error creating accommodation:", error);
    return {
      status: false,
      message:
        error.response?.data?.message || "Failed to create accommodation",
      data: null,
    };
  }
};

/**
 * Update accommodation (requires authentication)
 */
export const updateAccommodation = async (id, updateData) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}`, updateData, {
      headers: getAuthHeader(),
    });

    return {
      status: true,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error) {
    console.error("Error updating accommodation:", error);
    return {
      status: false,
      message:
        error.response?.data?.message || "Failed to update accommodation",
      data: null,
    };
  }
};

/**
 * Delete accommodation (requires authentication)
 */
export const deleteAccommodation = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: getAuthHeader(),
    });

    return {
      status: true,
      message: response.data.message,
    };
  } catch (error) {
    console.error("Error deleting accommodation:", error);
    return {
      status: false,
      message:
        error.response?.data?.message || "Failed to delete accommodation",
    };
  }
};
 