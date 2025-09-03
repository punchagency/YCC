import axios from "axios";

// Direct call to n8n webhook using frontend env vars
const N8N_WEBHOOK_URL = process.env.REACT_APP_N8N_WEBHOOK_URL;
const N8N_SESSION_ID = process.env.REACT_APP_N8N_SESSION_ID;

export const getResponseFromAI = async (chat) => {
  try {
    const latestUserMessage =
      chat.messages[chat.messages.length - 1]?.content || "";

    if (!N8N_WEBHOOK_URL) {
      throw new Error("N8N webhook URL is not configured");
    }

    if (!latestUserMessage.trim()) {
      return chat;
    }

    // Resolve userId from chat, userContext persisted localStorage, or null
    let userId = chat?.userId || null;
    if (!userId) {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          userId = parsed?.id || parsed?._id || null;
        }
      } catch (_) {}
    }

    const response = await axios.post(
      N8N_WEBHOOK_URL,
      {
        chatInput: latestUserMessage,
        sessionId: N8N_SESSION_ID || "",
        userId: userId || null,
      },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 300000, // 5 minutes
      }
    );

    const data = response?.data || {};
    const assistantOutput =
      typeof data.output === "string" && data.output.trim().length > 0
        ? data.output
        : "Sorry, I didn't get that.";

    return {
      ...chat,
      messages: [
        ...chat.messages,
        { role: "assistant", content: assistantOutput },
      ],
    };
  } catch (error) {
    const friendlyMessage = error?.message?.includes("N8N webhook URL")
      ? "Chat service not configured. Please set the webhook URL."
      : "Sorry, I couldn't connect to the AI service.";

    return {
      ...chat,
      messages: [
        ...chat.messages,
        { role: "assistant", content: friendlyMessage },
      ],
    };
  }
};
