import axios from "axios";

const API_URL =    `${process.env.REACT_APP_API_URL}/invoices`;
// Helper to get auth header
const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

export const getInvoices = async () => {
    const response = await axios.get(API_URL, { headers: getAuthHeader() });
    return response.data;   
};


