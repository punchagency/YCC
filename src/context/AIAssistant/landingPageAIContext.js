import { createContext, useContext, useState } from "react";

const LandingPageAIContext = createContext();

export const useLandingPageAI = () => {
    return useContext(LandingPageAIContext);
}

export const LandingPageAIProvider = ({ children }) => {
    const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(true);

    return (
        <LandingPageAIContext.Provider value={{ isAIAssistantOpen, setIsAIAssistantOpen }}>
            {children}
        </LandingPageAIContext.Provider>
    );
};

export default LandingPageAIContext;
