import React, { useState } from "react";
import Outstanding from "./outstanding";
import SearchFilters from "./filters";
import Table from "./table";
import PaymentDetails from "./payment-details";
import History from "./history";

const FinancialManagement = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleFilterChange = (filter) => {
    console.log("Filter changed to:", filter);
    setActiveFilter(filter);
  };

  const handleSearchChange = (query) => {
    console.log("Search query changed to:", query);
    setSearchQuery(query);
  };

  return (
    <>
      <Outstanding />
      <SearchFilters
        onFilterChange={handleFilterChange}
        onSearchChange={handleSearchChange}
        activeFilter={activeFilter}
      />
      <Table activeFilter={activeFilter} searchQuery={searchQuery} />
      <div className="flex justify-content-between align-content-center">
        <PaymentDetails />
        <History />
      </div>
    </>
  );
};

export default FinancialManagement;
