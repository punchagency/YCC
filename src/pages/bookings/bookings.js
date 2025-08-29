import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import {
  useOutletContext,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import AdminBookingsFilter from "./AdminBookingsFilter";
import AdminBookingsTable from "./AdminBookingsTable";
import {
  getAdminBookings,
  searchAdminBookings,
} from "../../services/admin/adminBookingsService";

const AdminBookingsPage = () => {
  const { setPageTitle } = useOutletContext() || {};
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // UI-only scaffold state (no data wiring yet)
  const [searchValue, setSearchValue] = useState("");
  const [status, setStatus] = useState(searchParams.get("status") || "all");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (setPageTitle) setPageTitle("Bookings");
  }, [setPageTitle]);

  const handleSearch = (value) => {
    setSearchValue(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
    updateUrlParams(status || "all", 1, pagination.limit, value);
  };

  const handleFilterChange = (criteria) => {
    setStatus(criteria.status || "all");
    setPagination((prev) => ({ ...prev, page: 1 }));
    updateUrlParams(criteria.status || "all", 1, pagination.limit, searchValue);
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    updateUrlParams(status || "all", newPage, pagination.limit, searchValue);
  };

  const handleLimitChange = (newLimit) => {
    setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 }));
    updateUrlParams(status || "all", 1, newLimit, searchValue);
  };

  const updateUrlParams = (statusValue, pageValue, limitValue, qValue) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (statusValue === "all") newSearchParams.delete("status");
    else newSearchParams.set("status", statusValue);
    newSearchParams.set("page", String(pageValue));
    newSearchParams.set("limit", String(limitValue));
    if (qValue && qValue.trim() !== "") newSearchParams.set("q", qValue);
    else newSearchParams.delete("q");
    setSearchParams(newSearchParams);
  };

  // Initialize from URL on mount
  useEffect(() => {
    const urlStatus = searchParams.get("status") || "all";
    const urlPage = parseInt(searchParams.get("page")) || 1;
    const urlLimit = parseInt(searchParams.get("limit")) || 10;
    const urlQ = searchParams.get("q") || "";
    setStatus(urlStatus);
    setPagination((prev) => ({ ...prev, page: urlPage, limit: urlLimit }));
    setSearchValue(urlQ);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch bookings when dependencies change
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        let response;
        const baseParams = { page: pagination.page, limit: pagination.limit };
        if (searchValue && searchValue.trim() !== "") {
          const searchParams =
            status && status !== "all"
              ? { ...baseParams, q: searchValue, status }
              : { ...baseParams, q: searchValue };
          response = await searchAdminBookings(searchParams);
        } else {
          const listParams =
            status && status !== "all"
              ? {
                  ...baseParams,
                  filter: JSON.stringify({ bookingStatus: status }),
                }
              : baseParams;
          response = await getAdminBookings(listParams);
        }
        if (response.status) {
          let rows = [];
          let pag = { ...pagination };
          if (Array.isArray(response.data?.result)) {
            rows = response.data.result;
            pag = {
              page: response.data.page,
              limit: response.data.limit,
              total: response.data.totalData,
              totalPages: response.data.totalPages,
            };
          } else if (Array.isArray(response.data)) {
            rows = response.data;
          }
          setBookings(rows);
          setPagination(pag);
        } else {
          const msg =
            response.message || response.error || "Failed to fetch bookings";
          if (
            msg &&
            (msg.toLowerCase().includes("unauthorized") ||
              msg.toLowerCase().includes("forbidden") ||
              msg.toLowerCase().includes("token"))
          ) {
            navigate("/login", {
              replace: true,
              state: { message: "Session expired. Please log in again." },
            });
          } else {
            setError(msg);
          }
        }
      } catch (err) {
        setError(err.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, pagination.limit, status, searchValue]);

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
      <AdminBookingsFilter
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        currentStatus={status}
      />
      <AdminBookingsTable
        bookings={bookings}
        loading={loading}
        error={error}
        pagination={pagination}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />
    </Box>
  );
};

export default AdminBookingsPage;
