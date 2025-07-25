import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import AdminOrderFilter from "./AdminOrderFilter";
import OrderTable from "../crew/order/table";
import { useOutletContext, useSearchParams } from "react-router-dom";

const AdminOrder = () => {
  const { setPageTitle } = useOutletContext() || {};
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState("");
  const [filterCriteria, setFilterCriteria] = useState({});
  const [orders, setOrders] = useState([]); // Stubbed data for now
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Set page title
  useEffect(() => {
    if (setPageTitle) setPageTitle("Orders");
  }, [setPageTitle]);

  // Handle search (stubbed)
  const handleSearch = (value) => {
    setSearchValue(value);
    // TODO: Implement search logic
  };

  // Handle filter change
  const handleFilterChange = (criteria) => {
    setFilterCriteria(criteria);
    // TODO: Implement filter logic
  };

  // Handle page/limit change (stubbed)
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleLimitChange = (newLimit) => {
    setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 }));
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#F8FBFF",
        minHeight: "100vh",
        mx: "auto",
        mt: { md: 2 },
        p: { md: 2 },
        px: { md: 2 },
      }}
    >
      {/* Admin Filter/Search Bar */}
      <AdminOrderFilter
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        currentStatus={searchParams.get("status") || "all"}
      />
      {/* Orders Table */}
      <OrderTable
        orders={orders}
        loading={loading}
        error={error}
        pagination={pagination}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />
    </Box>
  );
};

export default AdminOrder;
