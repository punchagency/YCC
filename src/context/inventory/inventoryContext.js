import { createContext, useContext, useState, useEffect } from "react";
import { getLowInventory, getAllInventoryItems } from "../../services/inventory/inventoryService";
const InventoryContext = createContext();



export const useInventory = () => {
    const context = useContext(InventoryContext);
    if (!context) {
        throw new Error("useInventory must be used within an InventoryProvider");
    }
    return context;
};  

export const InventoryProvider = ({ children }) => {
    const [lowInventory, setLowInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [allInventoryItems, setAllInventoryItems] = useState([]);

    const fetchLowInventory = async () => { 
        try {
            const response = await getLowInventory();
            console.log(response.data);
            setLowInventory(response.data);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllInventoryItems = async () => {
        const response = await getAllInventoryItems();
        setAllInventoryItems(response);
    };
    const value = {
        lowInventory,
        loading,
        error,
        fetchLowInventory,
        allInventoryItems,
        fetchAllInventoryItems,
    };

    return (
        <InventoryContext.Provider value={value}>
            {children}
        </InventoryContext.Provider>    
    );
};


