import axios from "axios";
import { buildApiUrl } from "../../utils/apiUtils";

/**
 * Fetch user's chat history from the database
 * @param {string} userId - The user's ID (used as sessionId in the database)
 * @returns {Promise<Object>} Chat history data
 */
export const fetchChatHistory = async (userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required to fetch chat history");
    }

    const response = await axios.get(buildApiUrl("chats"), {
      params: { userId },
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000, // 10 second timeout
    });

    const data = response?.data;

    if (!data?.success) {
      throw new Error(data?.message || "Failed to fetch chat history");
    }

    return {
      success: true,
      chatData: data.data,
    };
  } catch (error) {
    console.error("Error fetching chat history:", error);

    // Handle different types of errors
    if (error.code === "ECONNABORTED") {
      return {
        success: false,
        error: "Request timeout - please check your connection",
        chatData: null,
      };
    }

    if (error.response?.status === 404) {
      return {
        success: false,
        error: "Chat history not found",
        chatData: null,
      };
    }

    if (error.response?.status >= 500) {
      return {
        success: false,
        error: "Server error - please try again later",
        chatData: null,
      };
    }

    return {
      success: false,
      error: error.message || "Failed to fetch chat history",
      chatData: null,
    };
  }
};
