import React, { useState, useEffect } from "react";
import Outstanding from "./outstanding";
import SearchFilters from "./filters";
import Table from "./table";
import PaymentDetails from "./payment-details";
import History from "./history";
import { Pagination } from "../../../components/pagination";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useOutletContext } from "react-router-dom";

const FinancialManagement = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const { setPageTitle } = useOutletContext();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  useEffect(() => {
    setPageTitle("Financial Management");
  });

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
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={limit}
        onPageChange={setPage}
        isMobile={isMobile}
        isTablet={isTablet}
      />
    </>
  );
};

export default FinancialManagement;
