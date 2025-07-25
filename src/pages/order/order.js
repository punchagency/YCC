import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import AdminOrderFilter from "./AdminOrderFilter";
import OrderTable from "../crew/order/table";
import {
  useOutletContext,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import { getAdminOrders } from "../../services/admin/adminOrderService";

const AdminOrder = () => {
  const { setPageTitle } = useOutletContext() || {};
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState("");
  const [filterCriteria, setFilterCriteria] = useState({});
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const navigate = useNavigate();

  // Set page title
  useEffect(() => {
    if (setPageTitle) setPageTitle("Orders");
  }, [setPageTitle]);

  // Fetch orders from backend
  const fetchOrders = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAdminOrders({
        page: params.page || pagination.page,
        limit: params.limit || pagination.limit,
        ...params,
      });
      if (response.status) {
        // Support both array and object data
        let ordersData = [];
        let paginationData = { ...pagination };
        if (Array.isArray(response.data?.result)) {
          ordersData = response.data.result;
          paginationData = {
            page: response.data.page,
            limit: response.data.limit,
            total: response.data.totalData,
            totalPages: response.data.totalPages,
          };
        } else if (Array.isArray(response.data)) {
          ordersData = response.data;
        }
        setOrders(ordersData);
        setPagination(paginationData);
      } else {
        // Handle 401
        if (
          response.message &&
          (response.message.toLowerCase().includes("unauthorized") ||
            response.message.toLowerCase().includes("forbidden") ||
            response.message.toLowerCase().includes("token"))
        ) {
          navigate("/login", {
            replace: true,
            state: { message: "Session expired. Please log in again." },
          });
        } else {
          setError(response.message || "Failed to fetch orders");
        }
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount and when pagination/filter/search changes
  useEffect(() => {
    fetchOrders({
      page: pagination.page,
      limit: pagination.limit,
      ...filterCriteria,
      search: searchValue,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, pagination.limit, filterCriteria, searchValue]);

  // Handle search
  const handleSearch = (value) => {
    setSearchValue(value);
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page
  };

  // Handle filter change
  const handleFilterChange = (criteria) => {
    setFilterCriteria(criteria);
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page
  };

  // Handle page/limit change
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
        showUserColumn={true}
        detailsBasePath={"/admin/orders-management/"}
      />
    </Box>
  );
};

export default AdminOrder;
