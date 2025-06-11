import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

// Configure axios defaults
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

const TestApi = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testApi = async () => {
      try {
        console.log('Testing API call...');
        console.log('API_URL:', API_URL);
        const response = await api.get('/public/services');
        console.log('Response:', response);
        setData(response.data);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      }
    };

    testApi();
  }, []);

  return (
    <div>
      <h2>API Test</h2>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {data && (
        <pre>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default TestApi; 