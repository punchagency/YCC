import React, { createContext, useContext, useState, useEffect } from "react";

// Create the context
export const UserContext = createContext();

// Custom hook to use the user context
export const useUser = () => useContext(UserContext);

// Provider component to wrap the application
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        // Initialize user state from localStorage
        const savedUser = localStorage.getItem('user');
        try {
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            return null;
        }
    });

    // Load user from localStorage (useful for page refreshes)
    useEffect(() => {
        // Get user data from localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
            } catch (error) {
                console.error('Error parsing user data:', error);
                localStorage.removeItem('user'); // Clear invalid data
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

    return (
        <UserContext.Provider value={{ user, loginUser, logoutUser, signupUser, setUser }}>
            {children}
        </UserContext.Provider>
    );

};
