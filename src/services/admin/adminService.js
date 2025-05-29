export const checkPendingVendors = async () => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/vendors/pending/check`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to check pending vendors');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking pending vendors:', error);
    throw error;
  }
}; 