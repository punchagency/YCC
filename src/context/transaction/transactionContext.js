import { createContext, useContext, useState } from "react";
import { getTransactionsService } from "../../services/transaction/transactionService";
import { useToast } from "../toast/toastContext";
const TransactionContext = createContext();

export const useTransaction = () => {
  return useContext(TransactionContext);
};

export const TransactionProvider = ({ children }) => {
  
  const [transactions, setTransactions] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const { toast } = useToast();
  const getTransactions = async ({page, limit, transactionStatus, search}) => {
    const response = await getTransactionsService({page, limit, transactionStatus, search});
    if (!response.status) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: response.message,
        life: 3000
    });
    setTransactions([]);
    setTotalPages(0);
      return;
    }
    const data = response.data;
    setTransactions(data.pagination.result);
    setMetrics(data.metrics);
    setTotalPages(data.pagination.totalPages);
    setTotalItems(data.pagination.totalData);
  };

  return (
    <TransactionContext.Provider value={{ transactions, metrics, getTransactions, totalPages, totalItems }}>
      {children}
    </TransactionContext.Provider>
  );
};

export default TransactionProvider;
