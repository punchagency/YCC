import axios from "axios";

// Use the base API URL
const API_URL = process.env.REACT_APP_API_URL;
const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const CrewFinancialManagement = async ({ page = 1, limit = 10, invoiceType, status, startDate, endDate, search }) => {
    const queryParams = new URLSearchParams();
    if (page) queryParams.append("page", page.toString());
    if (limit) queryParams.append("limit", limit.toString());
    if (invoiceType) queryParams.append("invoiceType", invoiceType);
    if (status) queryParams.append("status", status);
    if (startDate) queryParams.append("startDate", startDate);
    if (endDate) queryParams.append("endDate", endDate);
    if (search) queryParams.append("search", search);
    // if (sortBy) queryParams.append("sortBy", sortBy);
    // if (sortDirection) queryParams.append("sortDirection", sortDirection);
    const URL = `${API_URL}/crew-financial-management/financial-analytics`;
    const headers = getAuthHeader();
    headers["Content-Type"] = "application/json";
    try {
        const response = await axios.get(URL, {
            headers,
            params: queryParams,
        });

        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch crew financial management data");
    }

}