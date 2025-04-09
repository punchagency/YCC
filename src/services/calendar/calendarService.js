import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const createEvent = async (eventData) => {
  try {
    const response = await axios.post(`${API_URL}/events`, eventData, {
      headers: getAuthHeader(),
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error creating event:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to create event",
    };
  }
};

export const fetchEvents = async (startDate, endDate) => {
  try {
    const from = startDate.toISOString();
    const to = endDate.toISOString();   
    const response = await axios.get(`${API_URL}/events`, {
      headers: getAuthHeader(),
      params: {
        from,
        to,
      },
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error fetching events:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch events",
    };
  }
};
