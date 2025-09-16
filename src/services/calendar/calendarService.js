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

    const headers = getAuthHeader();

    const requestConfig = {
      headers,
      params: {
        from,
        to,
      },
    };

    const response = await axios.get(`${API_URL}/events`, requestConfig);

    // Fix: Return the events array directly instead of the wrapper object
    if (response.status && response.data) {
      return {
        success: true,
        data: response.data, // Return the events array directly
      };
    } else {
      return {
        success: false,
        error: response.data.message || "Invalid response format",
      };
    }
  } catch (error) {
    console.error("Error fetching events:", error);

    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch events",
    };
  }
};

export const updateEvent = async (eventId, eventData) => {
  try {
    const response = await axios.put(
      `${API_URL}/events/${eventId}`,
      eventData,
      {
        headers: getAuthHeader(),
      }
    );

    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error("Error updating event:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update event",
    };
  }
};

export const deleteEvent = async (eventId) => {
  try {
    const response = await axios.delete(`${API_URL}/events/${eventId}`, {
      headers: getAuthHeader(),
    });

    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    console.error("Error deleting event:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete event",
    };
  }
};

export const inviteGuests = async (eventId, guestEmails) => {
  try {
    const response = await axios.post(
      `${API_URL}/events/invite-guests`,
      { eventId, guestEmails },
      {
        headers: getAuthHeader(),
      }
    );

    return {
      success: response.data.status,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error) {
    console.error("Error inviting guests:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to invite guests",
    };
  }
};

export const addGuestService = async (eventId, guestEmails) => {
  try {
    const response = await axios.post(
      `${API_URL}/events/invite-guests`,
      {
        eventId,
        guestEmails,
      },
      {
        headers: getAuthHeader(),
      }
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error adding guest:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to add guest",
    };
  }
};
