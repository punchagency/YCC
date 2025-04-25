import { createContext, useContext, useState } from "react";
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [orderSummary, setOrderSummary] = useState({});


    const fetchOrders = async () => {
        try {
            const response = await getOrders();
            setOrders(response.data);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };  

    const fetchOrderSummary = async () => {
        try {
            const response = await getOrderSummary();
            setOrderSummary(response.data.data);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };


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

