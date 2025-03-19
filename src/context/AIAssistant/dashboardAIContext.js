import { createContext, useContext, useState } from "react";
import { getResponseFromAI } from "../../services/AIAssistant/dashboardPageAIService";
import { useUser } from "../userContext";


const DashboardAIContext = createContext();

export const useDashboardAI = () => {
    return useContext(DashboardAIContext);
}

export const DashboardAIProvider = ({ children }) => {
    //const { user } =useUser();
    const userId = '67ced33a4b1b4e1b3802f2ae'
    const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
    const [chatData, setChatData] = useState({
        _id: '',
        userId: userId,
        messages: []
    });
    const [typingState, setTypingState] = useState(false)
    const [message, setMessage] = useState('')

    const sendMessage = () => {
        if (!(message.trim())) return;
        if (!isAIAssistantOpen) {
            setIsAIAssistantOpen(true)
        }
        setTypingState(true)
        console.log(' message being sent', message)
        let previousChatData = chatData
        console.log('previousChatData', previousChatData)
        previousChatData.messages.push({ role: 'user', content: message })
        setChatData(previousChatData)
        console.log('chatData on sending message', previousChatData)
        getResponse(previousChatData)
        setMessage("");
    }


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
        console.log('chatData on getting response', previousChatData)
        const response = await getResponseFromAI(previousChatData)
        console.log('response from AI', response)
        setChatData(response)
        setTypingState(false);
    }


    const preDefinedMessages = (predefinedMessage) => {
        console.log('message sent', predefinedMessage)
        if (!(predefinedMessage.trim())) return;
        if (!isAIAssistantOpen) {
            setIsAIAssistantOpen(true)
        }
        setTypingState(true)
        let previousChatData = chatData
        previousChatData.messages.push({ role: 'user', content: predefinedMessage })
        setChatData(previousChatData)
        getResponse(previousChatData)

    }


















    return (
        <DashboardAIContext.Provider value={{ isAIAssistantOpen, setIsAIAssistantOpen, chatData, setChatData, typingState, setTypingState, message, setMessage, sendMessage, getResponse, preDefinedMessages }}>
            {children}
        </DashboardAIContext.Provider>
    );
};

export default DashboardAIContext;
