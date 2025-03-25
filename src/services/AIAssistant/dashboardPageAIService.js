import axios from 'axios';

const API_URL = process.env.REACT_APP_DASHBOARD_VENDOR_ASSISTANT_API_URL;

export const getResponseFromAI = async (chat) => {
    console.log('chat being sent to AI', chat)
    const response = await axios.post(`${API_URL}`, {
        chat
    });
    return response.data;
};
