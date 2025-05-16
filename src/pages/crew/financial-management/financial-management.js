import React, { useState } from "react";
import Outstanding from "./outstanding";
import SearchFilters from "./filters";
import Table from "./table";
import PaymentDetails from "./payment-details";
import History from "./history";
const FinancialManagement = () => {
  return (
    <>
      <Outstanding />
      <SearchFilters />
      <Table />
      <div className="flex justify-content-between align-content-center">
        <PaymentDetails />
        <History />
      </div>
    </>
  );
};

export default FinancialManagement;
