import { createContext, useContext, useState } from "react";

const LandingPageAIContext = createContext();

export const useLandingPageAI = () => {
    return useContext(LandingPageAIContext);
}

export const LandingPageAIProvider = ({ children }) => {
    const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
    const [chatData, setChatData] = useState([
        { id: 1, message: "Hello, how can I help you today?", sender: "bot" },
      ]);
      const [typingState, setTypingState] = useState(false)
      const [message, setMessage] = useState('')
    
  const function1 = () => {
    if (!(message.trim())) return;
    if (!isAIAssistantOpen) {
      setIsAIAssistantOpen(true)
    }
    setTypingState(true)
    setChatData((prevChatData) => [
      ...prevChatData,
      { id: prevChatData.length + 1, message, sender: "user" },
    ]);
    setMessage(""); // Clear input after sending
    response()
  }


  const response = () => {
    setTimeout(() => {
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
  }

  
  const preDefinedMessages = (message) => {
    setMessage(message)



    setTimeout(() => {
      console.log('message sent', message)
      if (!(message.trim())) return;
      if (!isAIAssistantOpen) {
        setIsAIAssistantOpen(true)
      }
      setTypingState(true)
      setChatData((prevChatData) => [
        ...prevChatData,
        { id: prevChatData.length + 1, message, sender: "user" },
      ]);
      setMessage(""); // Clear input after sending
      response()
    }, 0);
  }

    return (
        <LandingPageAIContext.Provider value={{ isAIAssistantOpen, setIsAIAssistantOpen, chatData, setChatData, typingState, setTypingState, message, setMessage, function1, response, preDefinedMessages }}>
            {children}
        </LandingPageAIContext.Provider>
    );
};

export default LandingPageAIContext;
