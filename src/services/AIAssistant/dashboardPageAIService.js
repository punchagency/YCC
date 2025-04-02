import axios from 'axios';

const API_URL = 'https://ycc-ee4d189a3af8.herokuapp.com/api/ai/vendor';

export const getResponseFromAI = async (chat) => {
    console.log('chat being sent to AI', chat)
    const response = await axios.post(`${API_URL}`, {
        chat
    });
    return response.data;
};
