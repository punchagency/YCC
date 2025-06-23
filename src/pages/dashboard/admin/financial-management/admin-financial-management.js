import { Box } from "@mui/material";
import Section1FinancialManagement from "./section1-financial-management";
import Section2FinancialManagement from "./section2-financial-management";
import Section3FinancialManagement from "./section3-financial-management";

import { useTransaction } from "../../../../context/transaction/transactionContext";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import React from "react";

const AdminFinancialManagement = () => {
  const { transactions, metrics, getTransactions, totalPages, totalItems } =
    useTransaction();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [transactionStatus, setTransactionStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const { setPageTitle } = useOutletContext() || {};

  React.useEffect(() => {
    if (setPageTitle) setPageTitle("Financial Management");
  }, [setPageTitle]);

  useEffect(() => {
    try {
      getTransactions({ page, limit, transactionStatus, search });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [limit, page, transactionStatus, search, getTransactions]);

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        maxWidth: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#F8FBFF",
      }}
    >
      {metrics && (
        <Section1FinancialManagement metrics={metrics} loading={loading} />
      )}
      <Section2FinancialManagement
        transactionStatus={transactionStatus}
        setPage={setPage}
        setLimit={setLimit}
        setTransactionStatus={setTransactionStatus}
        setSearch={setSearch}
      />
      {transactions && (
        <Section3FinancialManagement
          transactions={transactions}
          loading={loading}
          page={page}
          limit={limit}
          setPage={setPage}
          setLimit={setLimit}
          totalPages={totalPages}
          totalItems={totalItems}
        />
      )}
    </Box>
  );
};

export default AdminFinancialManagement;
