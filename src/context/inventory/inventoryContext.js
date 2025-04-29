import { createContext, useContext, useState} from "react";
import { getLowInventory, getAllInventoryItems } from "../../services/inventory/inventoryService";
import { getAuthHeader } from "../../services/inventory/inventoryService";

const InventoryContext = createContext();
const API_URL = `${process.env.REACT_APP_API_URL}/inventory`;



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

    
    const updateInventoryItem = async (inventoryId, updatedInventoryItem) => {
        try {
            const { quantity, price, serviceArea, category, name } = updatedInventoryItem;
            const response = await fetch(`${API_URL}/${inventoryId}`, {
                method: 'PATCH',
                headers: {
                    ...getAuthHeader(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    quantity,
                    price,
                    serviceArea,
                    category,
                    productName: name
                }),
            });
            const data = await response.json();
            console.log(data);
            return data;
        } catch (error) {
            console.log(error);
        }
    }

    const deleteInventoryItem = async (inventoryId) => {
        try {
            const response = await fetch(`${API_URL}/${inventoryId}`, {
                method: 'DELETE',
                headers: {
                    ...getAuthHeader(),
                    'Content-Type': 'application/json'
                },
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.log(error);
        }
    }

    const createInventoryItem = async (newInventoryItem) => {
        try {
            const { quantity, price, serviceArea, category, name } = newInventoryItem;
            const response = await fetch(`${API_URL}`, {
                method: 'POST',
                headers: {
                    ...getAuthHeader(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    quantity,
                    price,
                    serviceArea,
                    category,
                    productName: name
                })
            });
            const data = await response.json();
            return data;
        } catch (error) {
          console.log(error);
        }
    }







    const value = {
        lowInventory,
        loading,
        error,
        fetchLowInventory,
        allInventoryItems,
        fetchAllInventoryItems,
        updateInventoryItem,
        deleteInventoryItem,
        createInventoryItem,
    };

    return (
        <InventoryContext.Provider value={value}>
            {children}
        </InventoryContext.Provider>    
    );
};


