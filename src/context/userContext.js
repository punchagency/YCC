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



  const getStripeAccount = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/stripe/get-stripe-account`, {
      headers: getAuthHeader(),
    });
    const data = await response.json();
    if (!data.status) {
      setStripeAccount(null);
    } else {
      setStripeAccount(data.data);
    }
  };

const createStripeAccount = async () => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/stripe/create-stripe-account`,{
    headers: getAuthHeader()
  });
  const data = await response.json();
  if(data.status){
    window.location.href = data.data.url;
  }
}


  const refreshStripeAccountLink = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/stripe/refresh-stripe-account-link`,{
      headers: getAuthHeader()
    });
    const data = await response.json();
    if(data.status){
      window.location.href = data.data.url;
    }
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
  const verifyOnboardingStep1 = async () => {
    if(user.role === "supplier"){
      const response = await fetch(`${process.env.REACT_APP_API_URL}/suppliers/verify/inventory-upload`, {
        headers: getAuthHeader()
      });
      const data = await response.json();
      return data;
    }else if(user.role === "service_provider"){
      const response = await fetch(`${process.env.REACT_APP_API_URL}/vendors/verify/services-upload`, {
        headers: getAuthHeader()
      });
      const data = await response.json();
      return data;
    }
  }


const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const completeOnboarding = async () => {
  if(user.role === "supplier"){
    const response = await fetch(`${process.env.REACT_APP_API_URL}/suppliers/complete/onboarding`, {
      headers: getAuthHeader()
    });
    const data = await response.json();
    return data.status;
  }else if(user.role === "service_provider"){
    const response = await fetch(`${process.env.REACT_APP_API_URL}/vendors/complete/onboarding`, {
      headers: getAuthHeader()
    });
    const data = await response.json();
    return data.status;
  }
}

const checkOnboardingStatus = async () => {
  if(user.role === "supplier"){
    const response = await fetch(`${process.env.REACT_APP_API_URL}/suppliers/onboarding/status`, {
      headers: getAuthHeader()
    });
    const data = await response.json();
    return data.data;
  }else if(user.role === "service_provider"){
    const response = await fetch(`${process.env.REACT_APP_API_URL}/vendors/onboarding/status`, {
      headers: getAuthHeader()
    });
    const data = await response.json();
    return data.data;
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
