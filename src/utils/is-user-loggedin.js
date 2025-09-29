
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

// Utility function to check if token is valid
export const isLoggedIn = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        return false;
    }
    try {
        const decoded = jwtDecode(token);

        const isExpired = decoded.exp <= Math.floor(Date.now() / 1000);
        if (isExpired || !decoded.id) {
            return false;
        }
    } catch {
        return false;
    }
    return true;
};

// Utility function to clear user data
const clearUserData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Clear cookies
    document.cookie.split(";").forEach((c) => {
        document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
};

// Custom hook for user authentication state
export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const checkAuthStatus = useCallback(() => {
        const tokenValid = isLoggedIn();
        setIsAuthenticated(tokenValid);

        if (!tokenValid) {
            clearUserData();
            navigate('/login');
        }

        setIsLoading(false);
    }, [navigate]);

    const logout = useCallback(() => {
        clearUserData();
        setIsAuthenticated(false);
        navigate('/login');
    }, [navigate]);

    useEffect(() => {
        // Check auth status on mount
        checkAuthStatus();

        // Set up periodic checks every 5 minutes
        const interval = setInterval(checkAuthStatus, 5 * 60 * 1000);

        // Listen for storage changes (when token is modified in another tab)
        const handleStorageChange = (e) => {
            if (e.key === 'token' || e.key === 'user') {
                checkAuthStatus();
            }
        };

        // Listen for focus events (when user returns to tab)
        const handleFocus = () => {
            checkAuthStatus();
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('focus', handleFocus);

        return () => {
            clearInterval(interval);
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('focus', handleFocus);
        };
    }, [checkAuthStatus]);

    return {
        isAuthenticated,
        isLoading,
        checkAuthStatus,
        logout
    };
};
