import React, { createContext, useContext, useState} from 'react';
import { useToast } from '../toast/toastContext';
import { getAllServices, updateOneService, deleteOneService, createOneService } from "../../services/service/serviceService";

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

    const updateService = async (serviceId, updatedService) => {
        try {
            const response = await updateOneService(serviceId, updatedService);
            if(response.status){
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Service updated successfully' });
            }
            return response;
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: error.message || 'Failed to update service' });
        }
    }

    const deleteService = async (serviceId) => {
        try {
            const response = await deleteOneService(serviceId);
            if(response.status){
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Service deleted successfully' });
            }
            return response;
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: error.message || 'Failed to delete service' });
            }
    }

    const createService = async (newService) => {
        try {
            const response = await createOneService(newService);
            if(response.status){
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Service created successfully' });
            }
            return response;
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: error.message || 'Failed to create service' });
        }
    }
    return (
        <ServiceContext.Provider value={{ services, fetchServices, updateService, deleteService, createService }}>
            {children}
        </ServiceContext.Provider>
    );
};
