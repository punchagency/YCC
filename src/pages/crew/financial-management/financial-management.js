import React, { useState, useEffect } from "react";
import Outstanding from "./outstanding";
import SearchFilters from "./filters";
import Table from "./table";
import { Pagination } from "../../../components/pagination";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useOutletContext } from "react-router-dom";
import { CrewFinancialManagement } from '../../../services/crew/crewFinancialManagement.js';

const FinancialManagement = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const { setPageTitle } = useOutletContext();
  const [totalPages] = useState(0);
  const [totalItems] = useState(0);
  const [financeData, setFinanceData] = React.useState({});
  const [loading, setLoading] = useState(true);
  const toast = React.useRef(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  useEffect(() => {
    setPageTitle("Financial Management");
  });

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const fetchFinanceData = async () => {
    try {
      setLoading(true);
      const response = await CrewFinancialManagement();
      setFinanceData(response.data);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch data. Please try again later.",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, []);

  return (
    <>
      <Outstanding financeData={financeData} loading={loading} />
      <SearchFilters
        onFilterChange={handleFilterChange}
        onSearchChange={handleSearchChange}
        activeFilter={activeFilter}
      />
      <Table activeFilter={activeFilter} searchQuery={searchQuery} financeData={financeData} loading={loading} />

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
