import { createContext, useContext, useState} from "react";
import { getInvoices } from "../../services/invoice/invoiceService";

const InvoiceContext = createContext();


export const useInvoice = () => {
    const context = useContext(InvoiceContext);
    if (!context) {
        throw new Error("useInvoice must be used within an InvoiceProvider");
    }
    return context;
};

export const InvoiceProvider = ({ children }) => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const fetchInvoices = async () => {
        try {
            const response = await getInvoices();
            setInvoices(response.data);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }; 

    const value = {
        invoices,
        loading,
        error,
        fetchInvoices,
    };

    return (
        <InvoiceContext.Provider value={value}>
            {children}
        </InvoiceContext.Provider>
    );
};

