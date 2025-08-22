import { createContext, useContext, useState } from "react";
import { getResponseFromAI } from "../../services/AIAssistant/landingPageAIService";

const LandingPageAIContext = createContext();

export const useLandingPageAI = () => {
  return useContext(LandingPageAIContext);
};

export const LandingPageAIProvider = ({ children }) => {
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [chatData, setChatData] = useState({
    messages: [],
    chatSuggestions: [
      "What is YCC?",
      "How does YCC work?", 
      "How to become a vendor?",
      "How to register as a supplier?",
      "How to become a crew member?",
      "Getting started guide"
    ],
  });
  const [typingState, setTypingState] = useState(false);
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    if (!message.trim()) return;
    if (!isAIAssistantOpen) {
      setIsAIAssistantOpen(true);
    }
    setTypingState(true);
    console.log(" message being sent", message);
    const nextChatData = {
      ...chatData,
      messages: [...chatData.messages, { role: "user", content: message }],
    };
    console.log("chatData on sending message", nextChatData);
    setChatData(nextChatData);
    setMessage("");
    getResponse(nextChatData);
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
    console.log("chatData on getting response", previousChatData);
    const response = await getResponseFromAI(previousChatData);
    console.log("response from AI", response);
    setChatData(response);
    setTypingState(false);
  };

  const preDefinedMessages = (predefinedMessage) => {
    console.log("message sent", predefinedMessage);
    if (!predefinedMessage.trim()) return;
    if (!isAIAssistantOpen) {
      setIsAIAssistantOpen(true);
    }
    setTypingState(true);
    const nextChatData = {
      ...chatData,
      messages: [
        ...chatData.messages,
        { role: "user", content: predefinedMessage },
      ],
    };
    setChatData(nextChatData);
    getResponse(nextChatData);
  };

  return (
    <LandingPageAIContext.Provider
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
      }}
    >
      {children}
    </LandingPageAIContext.Provider>
  );
};

export default LandingPageAIContext;
