import { createContext, useContext, useState, useCallback } from "react";
import { getOrders, getOrderSummary } from "../../services/order/orderService";

const OrderContext = createContext();


export const useOrder = () => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error("useOrder must be used within an OrderProvider");
    }
    return context;
};

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [orderSummary, setOrderSummary] = useState({});


    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getOrders();
            setOrders(response.data);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchOrderSummary = useCallback(async (query) => {
        try {
            setLoading(true);
            setError(null);
            const response = await getOrderSummary(query);
            setOrderSummary(response.data.data);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }, []);


    const value = {
        orders,
        loading,
        error,
        fetchOrders,
        orderSummary,
        fetchOrderSummary
    };

    return (
        <OrderContext.Provider value={value}>
            {children}
        </OrderContext.Provider>
    );
};

