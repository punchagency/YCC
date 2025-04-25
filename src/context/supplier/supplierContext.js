import React, { createContext, useContext, useState } from 'react';
import { useToast } from '../toast/toastContext';
import { getAllSuppliers } from "../../services/supplier/supplierService";

const SupplierContext = createContext();

export const useSupplier = () => {
    const context = useContext(SupplierContext);
    if (!context) {
        throw new Error('useSupplier must be used within a SupplierProvider');
    }
    return context;
}

export const SupplierProvider = ({ children }) => {
    const [suppliers, setSuppliers] = useState([]);
    const { toast } = useToast();

    const fetchSuppliers = async () => {
        try {
            const response = await getAllSuppliers();
            setSuppliers(response); 
        } catch (error) {
           toast.current.show({ severity: 'error', summary: 'Error', detail: error.message || 'Failed to fetch suppliers' });
        }
    };

    return (
        <SupplierContext.Provider value={{ suppliers, fetchSuppliers }}>
            {children}
        </SupplierContext.Provider>
    );
};
