import React, { createContext, useContext, useState, useEffect } from "react";
import { getUserSettings } from "../services/crewSettings/crewsettings";

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

  // Load user from API on mount (for real info)
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        // If no token, try to load from localStorage as fallback
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
          } catch (error) {
            localStorage.removeItem("user");
          }
        }
        return;
      }

      try {
        const response = await getUserSettings();
        if (response.status && response.data && response.data.user) {
          setUser(response.data.user);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          return response.data.user;
        } else {
        }
      } catch (e) {
        // fallback to localStorage if API fails
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
          } catch (error) {
            localStorage.removeItem("user");
          }
        }
      }
    };
    fetchUser();
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
    localStorage.removeItem("token");
  };

  // Function to refresh user data
  const refreshUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    try {
      const response = await getUserSettings();

      if (response.status && response.data && response.data.user) {

        setUser(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        return response.data.user;
      } else {
      }
    } catch (e) {
    }
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
    //console.log('userContext - getStripeAccount called with:', { userId, role });
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/stripe/get-stripe-account`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeader(),
          },
          body: JSON.stringify({ userId, role }),
        }
      );
      const data = await response.json();
      //console.log('userContext - getStripeAccount response:', data);

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
      //console.error('userContext - getStripeAccount error:', error);
      // Don't set stripeAccount to null on network errors
      return { status: false, message: error.message };
    }
  };

  const createStripeAccount = async (userId, role) => {
    //console.log('userContext - createStripeAccount called with:', { userId, role });
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/stripe/create-stripe-account`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({ userId, role }),
      }
    );
    const data = await response.json();
    //console.log('userContext - createStripeAccount response:', data);
    if (data.status) {
      window.location.href = data.data.url;
    }
    return data;
  };

  const refreshStripeAccountLink = async (userId, role) => {
    //console.log('userContext - refreshStripeAccountLink called with:', { userId, role });
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/stripe/refresh-stripe-account-link`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({ userId, role }),
      }
    );
    const data = await response.json();
    //console.log('userContext - refreshStripeAccountLink response:', data);
    if (data.status) {
      window.location.href = data.data.url;
    }
    return data;
  };

  const uploadInventoryData = async (selectedFile, userId) => {
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("userId", userId);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/inventory/upload`,
        {
          method: "POST",
          body: formData,
          headers: {
            ...getAuthHeader(),
          },
        }
      );
      const data = await response.json();

      if (!data.status) {
        // Handle detailed error responses from the new backend validation
        let errorMessage = data.message || "Upload failed";

        // If there's a specific error field, append it for more detail
        if (data.error) {
          errorMessage = `${errorMessage}: ${data.error}`;
        }

        throw new Error(errorMessage);
      }

      //console.log("Upload successful:", data);
      return {
        status: data.status,
        message: data.message,
        data: data.data, // Include detailed success data
      };
    } catch (err) {
      //console.error("Upload failed:", err.message);
      throw err;
    }
  };

  // AI Parser: send Excel to Python parser and get normalized products
  const parseInventoryWithAI = async (file) => {
    const aiBase = process.env.REACT_APP_AI_PARSER_URL;
    if (!aiBase) {
      throw new Error("AI parser URL not configured (REACT_APP_AI_PARSER_URL)");
    }
    const formData = new FormData();
    formData.append("file", file);
    const resp = await fetch(`${aiBase}/parse-inventory`, {
      method: "POST",
      body: formData,
    });
    const json = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      // Bubble up friendly structured errors so UI can render them nicely
      const error = new Error(
        json?.message ||
          (resp.status === 422 ? "Validation error" : "AI parsing failed")
      );
      error.response = { status: resp.status, data: json };
      error.data = json;
      throw error;
    }
    if (!json?.products || !Array.isArray(json.products)) {
      throw new Error("AI parser returned an invalid response");
    }
    return json.products;
  };

  // Import normalized products into Node inventory
  const importParsedInventoryToNode = async ({
    userId,
    supplierId,
    products,
  }) => {
    const body = supplierId ? { supplierId, products } : { userId, products };
    const resp = await fetch(
      `${process.env.REACT_APP_API_URL}/inventory/import`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify(body),
      }
    );
    const json = await resp.json().catch(() => ({}));
    if (!resp.ok || json?.status === false) {
      throw new Error(json?.message || "Import failed");
    }
    return json;
  };

  const uploadServicesData = async (selectedFile, userId) => {
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("userId", userId);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/services/upload`,
        {
          method: "POST",
          body: formData,
          headers: {
            ...getAuthHeader(),
          },
        }
      );
      const data = await response.json();

      if (!data.status) {
        const error = data.message;
        throw new Error(error);
      }

      //console.log("Upload successful:", data);
      return data.status;
    } catch (err) {
      //console.error("Upload failed:", err.message);
      throw err;
    }
  };

  const verifyOnboardingStep1 = async (userId, role) => {
    //console.log('userContext - verifyOnboardingStep1 called with userId:', userId);
    try {
      if (role === "supplier") {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/suppliers/verify/inventory-upload`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...getAuthHeader(),
            },
            body: JSON.stringify({ userId }),
          }
        );
        const data = await response.json();
        //console.log('userContext - verifyOnboardingStep1 response:', data);
        return data;
      } else if (role === "service_provider") {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/vendors/verify/services-upload`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...getAuthHeader(),
            },
            body: JSON.stringify({ userId }),
          }
        );
        const data = await response.json();
        //console.log('userContext - verifyOnboardingStep1 response:', data);
        return data;
      }
    } catch (error) {
      //console.error('userContext - verifyOnboardingStep1 error:', error);
      throw error;
    }
  };

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const completeOnboarding = async (userId, role) => {
    //console.log('userContext - completeOnboarding called with:', { userId, role });
    try {
      if (role === "supplier") {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/suppliers/complete/onboarding`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...getAuthHeader(),
            },
            body: JSON.stringify({ userId }),
          }
        );
        const data = await response.json();
        //console.log('userContext - completeOnboarding response:', data);
        return data.status;
      } else if (role === "service_provider") {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/vendors/complete/onboarding`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...getAuthHeader(),
            },
            body: JSON.stringify({ userId }),
          }
        );
        const data = await response.json();
        //console.log('userContext - completeOnboarding response:', data);
        return data.status;
      }
    } catch (error) {
      //console.error('userContext - completeOnboarding error:', error);
      throw error;
    }
  };

  const checkOnboardingStatus = async (userId, role) => {
    //console.log('userContext - checkOnboardingStatus called with:', { userId, role });
    try {
      if (role === "supplier") {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/suppliers/onboarding/status`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...getAuthHeader(),
            },
            body: JSON.stringify({ userId }),
          }
        );
        const data = await response.json();
        //console.log('userContext - checkOnboardingStatus response:', data);
        return data.data;
      } else if (role === "service_provider") {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/vendors/onboarding/status`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...getAuthHeader(),
            },
            body: JSON.stringify({ userId }),
          }
        );
        const data = await response.json();
        //console.log('userContext - checkOnboardingStatus response:', data);
        return data.data;
      }
    } catch (error) {
      //console.error('userContext - checkOnboardingStatus error:', error);
      throw error;
    }
  };

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
        parseInventoryWithAI,
        importParsedInventoryToNode,
        uploadServicesData,
        verifyOnboardingStep1,
        completeOnboarding,
        checkOnboardingStatus,
        refreshUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
