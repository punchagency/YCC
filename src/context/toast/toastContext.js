import React, { createContext, useContext, useRef } from 'react';
import { Toast } from 'primereact/toast';
const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

export const ToastProvider = ({ children }) => {
    const toast = useRef(null);

    return (
        <ToastContext.Provider value={{ toast }}>
            <Toast ref={toast} />
            {children}
        </ToastContext.Provider>
    );
};


