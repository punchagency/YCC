import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import AdminOrderFilter from "./AdminOrderFilter";
import OrderTable from "../crew/order/table";
import {
  useOutletContext,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import {
  getAdminOrders,
  searchAdminOrders,
} from "../../services/admin/adminOrderService";

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

  // On mount, set filterCriteria, page, limit, and searchValue from URL params
  useEffect(() => {
    const urlStatus = searchParams.get("status") || "all";
    let criteria = {};
    if (["active", "completed", "pending"].includes(urlStatus)) {
      criteria = { status: urlStatus };
    } else {
      criteria = {};
    }
    setFilterCriteria(criteria);
    // Set page and limit from URL
    const urlPage = parseInt(searchParams.get("page")) || 1;
    const urlLimit = parseInt(searchParams.get("limit")) || 10;
    setPagination((prev) => ({ ...prev, page: urlPage, limit: urlLimit }));
    // Set search value from URL
    const urlQ = searchParams.get("q") || "";
    setSearchValue(urlQ);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update the URL query string with the status filter, page, limit, and search (q)
  const updateUrlParams = (status, page, limit, q) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (status === "all") {
      newSearchParams.delete("status");
    } else {
      newSearchParams.set("status", status);
    }
    newSearchParams.set("page", page.toString());
    newSearchParams.set("limit", limit.toString());
    if (q && q.trim() !== "") {
      newSearchParams.set("q", q);
    } else {
      newSearchParams.delete("q");
    }
    setSearchParams(newSearchParams);
  };

  // Fetch orders from backend (search or normal)
  const fetchOrders = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      let response;
      // If searchValue (q) is present, use search endpoint
      if (searchValue && searchValue.trim() !== "") {
        response = await searchAdminOrders({
          q: searchValue,
          page: params.page || pagination.page,
          limit: params.limit || pagination.limit,
          status: params.status || filterCriteria.status || "all",
        });
      } else {
        response = await getAdminOrders({
          page: params.page || pagination.page,
          limit: params.limit || pagination.limit,
          ...filterCriteria,
        });
      }
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
      status: filterCriteria.status || "all",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, pagination.limit, filterCriteria, searchValue]);

  // Handle search
  const handleSearch = (value) => {
    setSearchValue(value);
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page
    updateUrlParams(filterCriteria.status || "all", 1, pagination.limit, value);
  };

  // Handle filter change
  const handleFilterChange = (criteria) => {
    // Map the filter to a single status string, just like the crew side
    let status = "all";
    if (criteria.status) {
      if (Array.isArray(criteria.status)) {
        if (criteria.status.includes("pending")) status = "pending";
        else if (
          criteria.status.includes("partially_confirmed") ||
          criteria.status.includes("confirmed") ||
          criteria.status.includes("shipped")
        ) {
          status = "active"; // FIX: should be 'active', not 'confirmed'
        } else if (criteria.status.includes("delivered")) status = "completed";
      } else {
        status = criteria.status;
      }
    }
    setFilterCriteria({ status });
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page
    updateUrlParams(status, 1, pagination.limit, searchValue);
  };

  // Handle page/limit change
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    // Update URL with new page
    let status = filterCriteria.status || searchParams.get("status") || "all";
    updateUrlParams(status, newPage, pagination.limit, searchValue);
  };

  const handleLimitChange = (newLimit) => {
    setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 }));
    // Update URL with new limit and reset to page 1
    let status = filterCriteria.status || searchParams.get("status") || "all";
    updateUrlParams(status, 1, newLimit, searchValue);
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
        px: { md: 3 },
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
