import { createContext, useContext, useState } from "react";
import {
  getLowInventory,
  getAllInventoryItems,
} from "../../services/inventory/inventoryService";
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
    try {
      const response = await getAllInventoryItems();
      console.log("Inventory response:", response);

      if (Array.isArray(response)) {
        setAllInventoryItems(response);
        return response;
      } else if (response && response.success === false) {
        console.error("Error fetching inventory:", response.error);
        setError(response.error);
        return null;
      } else {
        console.error("Invalid response format:", response);
        setError("Invalid response format from server");
        return null;
      }
    } catch (error) {
      console.error("Error in fetchAllInventoryItems:", error);
      setError(error.message || "Failed to fetch inventory items");
      return null;
    }
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
