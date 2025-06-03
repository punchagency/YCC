import React, { createContext, useContext, useState, useEffect } from "react";

// Create the context
export const UserContext = createContext();

// Custom hook to use the user context
export const useUser = () => useContext(UserContext);

// Provider component to wrap the application
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Initialize user state from localStorage
    const savedUser = localStorage.getItem("user");
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [userProfile, setUserProfile] = useState(null);
  const [stripeAccount, setStripeAccount] = useState(null);

  // Load user from localStorage (useful for page refreshes)
  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user"); // Clear invalid data
      }
    }
  }, []);

  // Function to log in the user and store data
  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Function to handle user signup (same logic as login)
  const signupUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Function to log out the user
  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // const getStripeAccount = async (userId, role) => {
  //   console.log('userContext - getStripeAccount called with:', { userId, role });
  //   const response = await fetch(`${process.env.REACT_APP_API_URL}/stripe/get-stripe-account`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       ...getAuthHeader()
  //     },
  //     body: JSON.stringify({ userId, role })
  //   });
  //   console.log("status code:", response);
  //   const data = await response.json();
  //   console.log('userContext - getStripeAccount response:', data);
  //   if (!data.status) {
  //     setStripeAccount(null);
  //   } else {
  //     setStripeAccount(data.data);
  //   }
  //   return data;
  // };
  const getStripeAccount = async (userId, role) => {
    console.log('userContext - getStripeAccount called with:', { userId, role });
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/stripe/get-stripe-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({ userId, role })
      });
      const data = await response.json();
      console.log('userContext - getStripeAccount response:', data);
      
      if (!data.status) {
        // Only set to null if account truly doesn't exist
        if (response.status === 404) {
          setStripeAccount(null);
        }
        // For other errors, don't change the state
      } else {
        setStripeAccount(data.data);
      }
      return data;
    } catch (error) {
      console.error('userContext - getStripeAccount error:', error);
      // Don't set stripeAccount to null on network errors
      return { status: false, message: error.message };
    }
  };

  const createStripeAccount = async (userId, role) => {
    console.log('userContext - createStripeAccount called with:', { userId, role });
    const response = await fetch(`${process.env.REACT_APP_API_URL}/stripe/create-stripe-account`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ userId, role })
    });
    const data = await response.json();
    console.log('userContext - createStripeAccount response:', data);
    if(data.status){
      window.location.href = data.data.url;
    }
    return data;
  }

  const refreshStripeAccountLink = async (userId, role) => {
    console.log('userContext - refreshStripeAccountLink called with:', { userId, role });
    const response = await fetch(`${process.env.REACT_APP_API_URL}/stripe/refresh-stripe-account-link`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ userId, role })
    });
    const data = await response.json();
    console.log('userContext - refreshStripeAccountLink response:', data);
    if(data.status){
      window.location.href = data.data.url;
    }
    return data;
  }

  const uploadInventoryData = async (selectedFile, userId) => {
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("userId", userId);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/inventory/upload`, {
        method: "POST",
        body: formData,
        headers: {
          ...getAuthHeader()
        },
      });
      const data = await response.json();

      if (!data.status) {
        const error = data.message;
        throw new Error(error);
      }

      console.log("Upload successful:", data);
      return data.status;
    } catch (err) {
      console.error("Upload failed:", err.message);
      throw err;
    }
  };

  const uploadServicesData = async (selectedFile, userId) => {
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("userId", userId);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/services/upload`, {
        method: "POST",
        body: formData,
        headers: {
          ...getAuthHeader()
        },
      });
      const data = await response.json();

      if (!data.status) {
        const error = data.message;
        throw new Error(error);
      }

      console.log("Upload successful:", data);
      return data.status;
    } catch (err) {
      console.error("Upload failed:", err.message);
      throw err;
    }
  };

  const verifyOnboardingStep1 = async (userId, role) => {
    console.log('userContext - verifyOnboardingStep1 called with userId:', userId);
    try {
      if(role === "supplier"){
        const response = await fetch(`${process.env.REACT_APP_API_URL}/suppliers/verify/inventory-upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
          },
          body: JSON.stringify({ userId })
        });
        const data = await response.json();
        console.log('userContext - verifyOnboardingStep1 response:', data);
        return data;
      }else if(role === "service_provider"){
        const response = await fetch(`${process.env.REACT_APP_API_URL}/vendors/verify/services-upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
          },
          body: JSON.stringify({ userId })
        });
        const data = await response.json();
        console.log('userContext - verifyOnboardingStep1 response:', data);
        return data;
      }
    } catch (error) {
      console.error('userContext - verifyOnboardingStep1 error:', error);
      throw error;
    }
  }

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const completeOnboarding = async (userId, role) => {
    console.log('userContext - completeOnboarding called with:', { userId, role });
    try {
      if(role === "supplier"){
        const response = await fetch(`${process.env.REACT_APP_API_URL}/suppliers/complete/onboarding`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
          },
          body: JSON.stringify({ userId })
        });
        const data = await response.json();
        console.log('userContext - completeOnboarding response:', data);
        return data.status;
      }else if(role === "service_provider"){
        const response = await fetch(`${process.env.REACT_APP_API_URL}/vendors/complete/onboarding`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
          },
          body: JSON.stringify({ userId })
        });
        const data = await response.json();
        console.log('userContext - completeOnboarding response:', data);
        return data.status;
      }
    } catch (error) {
      console.error('userContext - completeOnboarding error:', error);
      throw error;
    }
  }

  const checkOnboardingStatus = async (userId, role) => {
    console.log('userContext - checkOnboardingStatus called with:', { userId, role });
    try {
      if(role === "supplier"){
        const response = await fetch(`${process.env.REACT_APP_API_URL}/suppliers/onboarding/status`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
          },
          body: JSON.stringify({ userId })
        });
        const data = await response.json();
        console.log('userContext - checkOnboardingStatus response:', data);
        return data.data;
      }else if(role === "service_provider"){
        const response = await fetch(`${process.env.REACT_APP_API_URL}/vendors/onboarding/status`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
          },
          body: JSON.stringify({ userId })
        });
        const data = await response.json();
        console.log('userContext - checkOnboardingStatus response:', data);
        return data.data;
      }
    } catch (error) {
      console.error('userContext - checkOnboardingStatus error:', error);
      throw error;
    }
  }

  return (
    <UserContext.Provider
      value={{
        user,
        loginUser,
        logoutUser,
        signupUser,
        setUser,
        userProfile,
        setUserProfile,
        stripeAccount,
        getStripeAccount,
        createStripeAccount,
        refreshStripeAccountLink,
        uploadInventoryData,
        uploadServicesData,
        verifyOnboardingStep1,
        completeOnboarding,
        checkOnboardingStatus
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
