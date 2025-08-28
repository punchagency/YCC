import React, { createContext, useContext, useState} from 'react';
import { useToast } from '../toast/toastContext';
import { getAllServices } from "../../services/service/serviceService";

const ServiceContext = createContext();

export const useService = () => {
    const context = useContext(ServiceContext);
    if (!context) {
        throw new Error('useService must be used within a ServiceProvider');
    }
    return context;
}

export const ServiceProvider = ({ children }) => {
    const [services, setServices] = useState([]);
    const { toast } = useToast();

    const fetchServices = async () => {
        try {
            const response = await getAllServices();
            setServices(response.data); 
        } catch (error) {
           toast.current.show({ severity: 'error', summary: 'Error', detail: error.message || 'Failed to fetch services' });
        }
    };

    return (
        <ServiceContext.Provider value={{ services, fetchServices }}>
            {children}
        </ServiceContext.Provider>
    );
};
