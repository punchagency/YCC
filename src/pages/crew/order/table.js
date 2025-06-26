import React, { useState } from "react";
import { FaSortAmountUp, FaSortAmountDown } from "react-icons/fa";
import { FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import { Pagination } from "../../../components/pagination";
import { OrderTableSkeleton } from "../../../components/CrewOrderSkeletons";
import { formatAmount } from "../../../utils/formatAmount";

const OrderTable = ({ 
  orders = [], 
  loading = false, 
  error = null, 
  pagination = { page: 1, limit: 10, total: 0, totalPages: 0 },
  onPageChange,
  onLimitChange
}) => {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const navigate = useNavigate();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(muiTheme.breakpoints.between("sm", "md"));

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      return date.toLocaleDateString("en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field) => {
    if (sortField === field) {
      return sortDirection === "asc" ? (
        <FaSortAmountUp className="ml-1" />
      ) : (
        <FaSortAmountDown className="ml-1" />
      );
    }
    return <FaSortAmountUp className="ml-1 opacity-30" />;
  };

  // Function to handle view order dialog
  const handleViewOrder = (order) => {
    // Navigate to order details page
    navigate(`/crew/orders/${order._id}`);
  };

  // Table columns
  const columns = [
    { id: "orderId", label: "Order ID", minWidth: 120 },
    { id: "totalPrice", label: "Total Price", minWidth: 120 },
    { id: "overallStatus", label: "Overall Status", minWidth: 140 },
    { id: "orderDate", label: "Order Date", minWidth: 140 },
    { id: "actions", label: "Actions", minWidth: 100 },
  ];

  // Table row rendering
  const renderCell = (order, column) => {
    switch (column.id) {
      case "orderId":
        return order.orderId || "N/A";
      case "totalPrice":
        return `$${formatAmount(order.totalPrice)}`;
      case "overallStatus":
        return (
          <span
            style={{
              backgroundColor: order.overallStatus === "delivered"
                ? "#ECFDF3"
                : order.overallStatus === "confirmed"
                ? "#F0F9FF"
                : order.overallStatus === "shipped"
                ? "#FFFAEB"
                : order.overallStatus === "cancelled"
                ? "#FEF3F2"
                : order.overallStatus === "declined"
                ? "#FEF3F2"
                : order.overallStatus === "partially_confirmed"
                ? "#F0F9FF"
                : "#F2F4F7",
              color: order.overallStatus === "delivered"
                ? "#027A48"
                : order.overallStatus === "confirmed"
                ? "#0369A1"
                : order.overallStatus === "shipped"
                ? "#B54708"
                : order.overallStatus === "cancelled"
                ? "#B42318"
                : order.overallStatus === "declined"
                ? "#B42318"
                : order.overallStatus === "partially_confirmed"
                ? "#0369A1"
                : "#344054",
              padding: "2px 8px",
              borderRadius: "16px",
              fontSize: "12px",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            {order.overallStatus || "pending"}
          </span>
        );
      case "orderDate":
        return formatDate(order.orderDate);
      case "actions":
        return (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              icon={<FiEye size={18} />}
              className="p-button-outlined p-button-sm"
              style={{ border: "1px solid #D0D5DD", color: "#344054", backgroundColor: "white", borderRadius: 8 }}
              onClick={() => handleViewOrder(order)}
              tooltip="See Details"
            />
          </Box>
        );
      default:
        return null;
    }
  };

  // Loading state with skeleton
  if (loading) {
    return <OrderTableSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: "center", color: "#dc3545" }}>
        <Box sx={{ mb: 2, fontSize: 18, fontWeight: 600 }}>Error Loading Orders</Box>
        <Box sx={{ fontSize: 14, color: "#666" }}>{error}</Box>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", bgcolor: "#F8FBFF", borderRadius: 2}}>
      <Paper sx={{ width: "100%", overflow: "auto", borderRadius: 2, boxShadow: 1 }}>
        <TableContainer>
          <Table stickyHeader aria-label="orders table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.id === "actions" ? "right" : "left"}
                    sx={{
                      minWidth: column.minWidth,
                      backgroundColor: "#F9FAFB",
                      color: "#344054",
                      fontWeight: 600,
                      fontSize: isTablet ? 12 : 14,
                      borderBottom: "1px solid #EAECF0",
                      padding: isTablet ? "10px 16px" : "12px 24px",
                      letterSpacing: 0.1,
                    }}
                    onClick={
                      ["orderId", "totalPrice", "overallStatus", "orderDate"].includes(column.id)
                        ? () => handleSort(column.id)
                        : undefined
                    }
                    style={{ cursor: ["orderId", "totalPrice", "overallStatus", "orderDate"].includes(column.id) ? "pointer" : "default" }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {column.label}
                      {["orderId", "totalPrice", "overallStatus", "orderDate"].includes(column.id) && (
                        <span style={{ marginLeft: 4 }}>{getSortIcon(column.id)}</span>
                      )}
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center" sx={{ py: 4, color: "#667085" }}>
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order, idx) => (
                  <TableRow key={order._id || idx} hover sx={{ transition: "background 0.2s", backgroundColor: "#fff", '&:hover': { backgroundColor: '#F3F4F6' } }}>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.id === "actions" ? "right" : "left"}
                        sx={{
                          minWidth: column.minWidth,
                          color: "#344054",
                          fontWeight: 500,
                          fontSize: isTablet ? 13 : 15,
                          borderBottom: "1px solid #EAECF0",
                          padding: isTablet ? "10px 16px" : "12px 24px",
                          backgroundColor: '#fff',
                        }}
                      >
                        {renderCell(order, column)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
      {/* Pagination component */}
      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          itemsPerPage={pagination.limit}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
          isMobile={isMobile}
          isTablet={isTablet}
        />
      )}
    </Box>
  );
};

export default OrderTable;
