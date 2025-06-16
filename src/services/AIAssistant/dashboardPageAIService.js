import axios from 'axios';

const API_URL = 'https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill';

export const getResponseFromAI = async (chat) => {
    try {
        const userMessage = chat.messages[chat.messages.length - 1].content;
        const response = await axios.post(
            API_URL,
            { inputs: userMessage },
            { headers: { 'Content-Type': 'application/json' } }
        );
        const data = response.data;
        return {
            ...chat,
            messages: [
                ...chat.messages,
                { role: 'assistant', content: data.generated_text || "Sorry, I didn't get that." }
            ]
        };
    } catch (error) {
        return {
            ...chat,
            messages: [
                ...chat.messages,
                { role: 'assistant', content: "Sorry, I couldn't connect to the AI service." }
            ]
        };
    }
};
