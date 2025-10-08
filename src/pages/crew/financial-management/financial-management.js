import React, { useState, useEffect } from "react";
import Outstanding from "./outstanding";
import SearchFilters from "./filters";
import Table from "./table";
import { Pagination } from "../../../components/pagination";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useOutletContext } from "react-router-dom";
import { useToast } from "../../../components/Toast";
import { CrewFinancialManagement } from '../../../services/crew/crewFinancialManagement.js';

const FinancialManagement = () => {
  const [fetchFinancialManagementQueries, setFetchFinancialManagementQueries] = useState({
    page: 1,
    limit: 10,
    invoiceType: "all",
    status: "all",
    startDate: "",
    endDate: "",
    search: "",
    sortBy: "date",
    sortDirection: "desc"
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const { showError } = useToast();
  const limit = fetchFinancialManagementQueries.limit;
  const { setPageTitle } = useOutletContext();
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [financeData, setFinanceData] = React.useState({});
  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  useEffect(() => {
    setPageTitle("Financial Management");
  });

  const handleFilterChange = (status) => {
    setFetchFinancialManagementQueries(prev => ({...prev, status, page: 1}));
  };

  const handleSearchChange = (search) => {
    setFetchFinancialManagementQueries(prev => ({...prev, search, page: 1}));
  };

  const handleInvoiceTypeChange = (invoiceType) => {
    setFetchFinancialManagementQueries(prev => ({...prev, invoiceType, page: 1}));
  };

  const handleStartDateChange = (startDate) => {
    setFetchFinancialManagementQueries(prev => ({...prev, startDate, page: 1}));
  };

  const handleEndDateChange = (endDate) => {
    setFetchFinancialManagementQueries(prev => ({...prev, endDate, page: 1}));
  };

  const handleSortChange = (sortBy, sortDirection) => {
    setFetchFinancialManagementQueries(prev => ({...prev, sortBy, sortDirection, page: 1}));
  };

  const handlePageChange = (newPage) => {
    setFetchFinancialManagementQueries(prev => ({...prev, page: newPage}));
  };

  const fetchFinanceData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await CrewFinancialManagement({
        ...fetchFinancialManagementQueries,
        invoiceType: fetchFinancialManagementQueries.invoiceType === 'all' ? undefined : fetchFinancialManagementQueries.invoiceType,
        status: fetchFinancialManagementQueries.status === 'all' ? undefined : fetchFinancialManagementQueries.status,
        startDate: fetchFinancialManagementQueries.startDate === '' ? undefined : fetchFinancialManagementQueries.startDate,
        endDate: fetchFinancialManagementQueries.endDate === '' ? undefined : fetchFinancialManagementQueries.endDate,
        search: fetchFinancialManagementQueries.search === '' ? undefined : fetchFinancialManagementQueries.search,
      });
      setFinanceData(response.data);
      setTotalItems(response.data.pagination?.totalItems || 0);
      setTotalPages(response.data.pagination?.totalPages || 0);
    } catch (error) {
      setError(error.message);
      showError(error.message || "Failed to fetch data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, [fetchFinancialManagementQueries]);

  return (
    <>
      <Outstanding financeData={financeData} loading={loading} />
      <SearchFilters
        onFilterChange={handleFilterChange}
        onSearchChange={handleSearchChange}
        onInvoiceTypeChange={handleInvoiceTypeChange}
        onStartDateChange={handleStartDateChange}
        onEndDateChange={handleEndDateChange}
        activeFilter={fetchFinancialManagementQueries.status}
        loading={loading}
      />
      <Table
        invoices={financeData?.invoices || []}
        loading={loading}
        currentSortField={fetchFinancialManagementQueries.sortBy}
        currentSortDirection={fetchFinancialManagementQueries.sortDirection}
        onSortChange={handleSortChange}
      />

      <Pagination
        currentPage={fetchFinancialManagementQueries.page}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={limit}
        onPageChange={handlePageChange}
        isMobile={isMobile}
        isTablet={isTablet}
      />
    </>
  );
};

export default FinancialManagement;
