import React, { createContext, useContext, useState, useEffect } from "react";

// Create notifications context
export const NotificationsContext = createContext();

// Custom hook to use the notifications context
export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationsProvider"
    );
  }
  return context;
};

// Provider component
export const NotificationsProvider = ({ children }) => {
  // Initialize notifications from localStorage or default to true
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    const savedNotificationSetting = localStorage.getItem(
      "notificationsEnabled"  
    );
    return savedNotificationSetting === null
      ? true
      : JSON.parse(savedNotificationSetting);
  });

  // Update localStorage when notification setting changes
  useEffect(() => {
    localStorage.setItem(
      "notificationsEnabled",
      JSON.stringify(notificationsEnabled)
    );
  }, [notificationsEnabled]);

  // Toggle notifications
  const toggleNotifications = () => {
    setNotificationsEnabled((prev) => !prev);
  };

  return (
    <NotificationsContext.Provider
      value={{
        notificationsEnabled,
        toggleNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
