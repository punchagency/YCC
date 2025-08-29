import { createContext, useContext, useState, useEffect } from "react";
import { getResponseFromAI } from "../../services/AIAssistant/dashboardPageAIService";
import { fetchChatHistory } from "../../services/AIAssistant/chatHistoryService";
import { useUser } from "../userContext";

const DashboardAIContext = createContext();

export const useDashboardAI = () => {
  return useContext(DashboardAIContext);
};

export const DashboardAIProvider = ({ children }) => {
  const { user } = useUser();

  const userId = user?.id || user?._id || null;
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [chatData, setChatData] = useState({
    _id: "",
    userId: userId,
    messages: [],
    chatSuggestions: [],
  });
  const [typingState, setTypingState] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState(null);

  // Load chat history when modal opens
  useEffect(() => {
    const loadChatHistory = async () => {
      if (isAIAssistantOpen && userId && chatData.messages.length === 0) {
        setIsLoadingHistory(true);
        setHistoryError(null);

        try {
          const result = await fetchChatHistory(userId);

          if (result.success && result.chatData) {
            setChatData((prevData) => ({
              ...prevData,
              _id: result.chatData._id,
              messages: result.chatData.messages || [],
              chatSuggestions:
                result.chatData.chatSuggestions || prevData.chatSuggestions,
            }));
          } else if (!result.success) {
            //console.warn("Could not load chat history:", result.error);
            setHistoryError(result.error);
          }
        } catch (error) {
          setHistoryError("Failed to load chat history");
        } finally {
          setIsLoadingHistory(false);
        }
      }
    };

    loadChatHistory();
  }, [isAIAssistantOpen, userId]);

  // Update userId in chatData when user changes
  useEffect(() => {
    setChatData((prevData) => ({
      ...prevData,
      userId: userId,
    }));
  }, [userId]);

  const sendMessage = () => {
    if (!message.trim()) return;
    if (!isAIAssistantOpen) {
      setIsAIAssistantOpen(true);
    }
    setTypingState(true);
    let previousChatData = chatData;
    previousChatData.messages.push({ role: "user", content: message });
    setChatData(previousChatData);
    getResponse(previousChatData);
    setMessage("");
  };

  const getResponse = async (previousChatData) => {
    /*  setTimeout(() => {
      
      
            setChatData((prevChatData) => [
              ...prevChatData,
              {
                id: prevChatData.length + 1, // Use prevChatData.length to keep IDs correct
                message: "Acknowledged... here is your response",
                sender: "bot",
              },
            ]);
            setTypingState(false);
          }, 2000);
          */
    const response = await getResponseFromAI(previousChatData);
    setChatData(response);
    setTypingState(false);
  };

  const preDefinedMessages = (predefinedMessage) => {
    if (!predefinedMessage.trim()) return;
    if (!isAIAssistantOpen) {
      setIsAIAssistantOpen(true);
    }
    setTypingState(true);
    let previousChatData = chatData;
    previousChatData.messages.push({
      role: "user",
      content: predefinedMessage,
    });
    setChatData(previousChatData);
    getResponse(previousChatData);
  };

  return (
    <DashboardAIContext.Provider
      value={{
        isAIAssistantOpen,
        setIsAIAssistantOpen,
        chatData,
        setChatData,
        typingState,
        setTypingState,
        message,
        setMessage,
        sendMessage,
        getResponse,
        preDefinedMessages,
        isLoadingHistory,
        historyError,
      }}
    >
      {children}
    </DashboardAIContext.Provider>
  );
};

export default DashboardAIContext;
