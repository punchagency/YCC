import React, { createContext, useContext, useRef } from "react";
import { Toast as PrimeToast } from "primereact/toast";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const toast = useRef(null);

  const showSuccess = (message) => {
    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: message,
      life: 3000,
    });
  };

  const showError = (message) => {
    toast.current.show({
      severity: "error",
      summary: "Error",
      detail: message,
      life: 3000,
    });
  };

  const showInfo = (message) => {
    toast.current.show({
      severity: "info",
      summary: "Info",
      detail: message,
      life: 3000,
    });
  };

  const showWarn = (message) => {
    toast.current.show({
      severity: "warn",
      summary: "Warning",
      detail: message,
      life: 3000,
    });
  };

  return (
    <ToastContext.Provider
      value={{ showSuccess, showError, showInfo, showWarn }}
    >
      <PrimeToast ref={toast} />
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
