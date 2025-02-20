import { createContext, useContext, useState, useEffect } from "react";

// Create the context
const UserContext = createContext();

// Custom hook to use the user context
export const useUser = () => useContext(UserContext);


// Provider component to wrap the application
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Load user from localStorage (useful for page refreshes)
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
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
        <UserContext.Provider value={{ user, loginUser, logoutUser, signupUser  }}>
            {children}
        </UserContext.Provider>
    );

};