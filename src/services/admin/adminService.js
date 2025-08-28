import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const checkPendingVendors = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/vendors/pending/check`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchPendingVendors = async (type, lastId = null, limit = 20) => {
  try {
    const response = await axios.get(`${API_URL}/admin/vendors/pending`, {
      params: {
        type,
        lastId,
        limit
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const approveVendor = async (vendorId, type, emailData) => {
  try {
    const response = await axios.put(
      `${API_URL}/admin/vendors/${vendorId}/approve`,
      {
        type,
        vendorId,
        ...emailData
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const rejectVendor = async (vendorId, type, emailData) => {
  try {
    const response = await axios.put(
      `${API_URL}/admin/vendors/${vendorId}/reject`,
      {
        type,
        ...emailData
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}; 