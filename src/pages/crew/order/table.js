import React, { useState, useEffect, useCallback, useRef } from "react";
import { FaSortAmountUp, FaSortAmountDown } from "react-icons/fa";
import {
  FiEye,
  FiEdit,
  FiDownload,
  FiChevronLeft,
  FiChevronRight,
  FiChevronDown,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { getOrders } from "../../../services/crew/crewOrderService";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import { Pagination } from "../../../components/pagination";
import { TableSkeleton } from "../../../components/TableSkeleton";

const OrderTable = ({ filters = {}, onRef }) => {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [viewOrderDialog, setViewOrderDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const toast = useRef(null);

  const navigate = useNavigate();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(muiTheme.breakpoints.between("sm", "md"));

  // Fetch orders from API with filters
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Fetching crew orders with filters:", filters);
      
      const response = await getOrders({
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      });
      
      console.log("Crew orders response:", response);
      
      if (response.status) {
        let ordersData = [];
        
        // Handle different response structures
        if (response.data?.data && Array.isArray(response.data.data)) {
          ordersData = response.data.data;
        } else if (response.data && Array.isArray(response.data)) {
          ordersData = response.data;
        } else {
          console.error("Unexpected response structure:", response.data);
          setError("Invalid data structure received");
          return;
        }

        console.log(`Found ${ordersData.length} orders`);

        // Apply client-side filtering for criteria that can't be sent to the API
        if (filters.futureDelivery) {
          const currentDate = new Date();
          ordersData = ordersData.filter((order) => {
            const deliveryDate = order.estimatedDeliveryDate
              ? new Date(order.estimatedDeliveryDate)
              : null;
            return deliveryDate && deliveryDate > currentDate;
          });
        }

        // Apply status filtering if specified
        if (filters.status && Array.isArray(filters.status)) {
          ordersData = ordersData.filter((order) => 
            filters.status.includes(order.status?.toLowerCase())
          );
        }

        // Sort orders by createdAt in descending order (newest first)
        ordersData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Use server pagination if available, otherwise client-side
        const total = response.data?.pagination?.totalItems || ordersData.length;
        const totalPages = response.data?.pagination?.totalPages || Math.ceil(total / pagination.limit) || 1;
        
        // If server pagination is used, don't slice the data
        const finalOrders = response.data?.pagination ? ordersData : ordersData.slice(
          (pagination.page - 1) * pagination.limit,
          pagination.page * pagination.limit
        );

        setOrders(finalOrders);
        setPagination((prev) => ({
          ...prev,
          total,
          totalPages,
        }));
        setError(null);
      } else {
        console.error("Failed to fetch orders:", response.error);
        setError(response.error || "Failed to load orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  // Expose fetchOrders to parent component
  useEffect(() => {
    if (onRef) {
      onRef({ fetchOrders });
    }
  }, [onRef, fetchOrders]);

  // Fetch orders when component mounts and when filters or pagination change
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

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

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  // Handle items per page change
  const handleLimitChange = (newLimit) => {
    setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 }));
  };

  // Function to handle downloading order details as PDF
  const handleDownloadPDF = (order) => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text("Order Invoice", 14, 22);
      doc.setFontSize(12);
      doc.text(`Order ID: ${order.orderId || order._id || "N/A"}`, 14, 32);
      doc.text(
        `Date Placed: ${
          formatDate(order.createdAt || order.orderDate) || "N/A"
        }`,
        14,
        38
      );
      doc.text(
        `Est. Delivery: ${formatDate(order.estimatedDeliveryDate) || "N/A"}`,
        14,
        44
      );
      doc.setFontSize(16);
      doc.text("Vendor Information", 14, 54);
      doc.setFontSize(12);
      doc.text(`Vendor: ${order.vendor?.name || order.vendorName || "N/A"}`, 14, 60);
      doc.setFontSize(16);
      doc.text("Order Status", 14, 70);
      doc.setFontSize(12);
      doc.text(`Status: ${order.status || "pending"}`, 14, 76);
      if (order.products && order.products.length > 0) {
        doc.setFontSize(16);
        doc.text("Order Items", 14, 86);
        const tableColumn = ["Item", "Quantity", "Price", "Total"];
        const tableRows = [];
        order.products.forEach((item) => {
          const itemData = [
            item.id?.name || "Unknown Item",
            item.quantity || 1,
            `$${item.price?.toFixed(2) || "0.00"}`,
            `$${((item.price || 0) * (item.quantity || 1)).toFixed(2)}`,
          ];
          tableRows.push(itemData);
        });
        doc.autoTable({
          startY: 90,
          head: [tableColumn],
          body: tableRows,
          theme: "striped",
          headStyles: { fillColor: [66, 139, 202] },
        });
        const totalAmount = order.products.reduce(
          (total, item) => total + (item.price || 0) * (item.quantity || 1),
          0
        );
        doc.setFontSize(14);
        doc.text(
          `Total Amount: $${totalAmount.toFixed(2)}`,
          14,
          doc.autoTable.previous.finalY + 10
        );
      } else {
        doc.setFontSize(14);
        doc.text(
          `Total Amount: ${
            order.totalPrice ? `$${order.totalPrice.toFixed(2)}` : "N/A"
          }`,
          14,
          86
        );
      }
      if (order.deliveryAddress) {
        doc.setFontSize(16);
        doc.text(
          "Delivery Information",
          14,
          doc.autoTable?.previous?.finalY + 20 || 96
        );
        doc.setFontSize(12);
        const deliveryY = doc.autoTable?.previous?.finalY + 26 || 102;
        doc.text(
          `Address: ${order.deliveryAddress}`,
          14,
          deliveryY
        );
      }
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(
          `Generated on ${new Date().toLocaleString()}`,
          14,
          doc.internal.pageSize.height - 10
        );
      }
      const filename = `order-invoice-${
        order.orderId || order._id || "details"
      }.pdf`;
      doc.save(filename);
    } catch (error) {
      alert("Failed to generate PDF. Please try again.");
    }
  };

  // Function to handle view order dialog
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setViewOrderDialog(true);
  };

  // Table columns
  const columns = [
    { id: "supplier", label: "Supplier Name", minWidth: 120 },
    { id: "productCount", label: "Product Count", minWidth: 100 },
    { id: "deliveryAddress", label: "Delivery Address", minWidth: 180 },
    { id: "orderDate", label: "Order Date", minWidth: 120 },
    { id: "status", label: "Status", minWidth: 100 },
    { id: "totalPrice", label: "Total Price", minWidth: 100 },
    { id: "actions", label: "Actions", minWidth: 120 },
  ];

  // Table row rendering
  const renderCell = (order, column) => {
    switch (column.id) {
      case "supplier":
        return order?.vendor?.name || order?.vendorName || "N/A";
      case "productCount":
        return order.products?.length || 0;
      case "deliveryAddress":
        return order.deliveryAddress || "N/A";
      case "orderDate":
        return formatDate(order.createdAt || order.orderDate);
      case "status":
        return (
          <span
            style={{
              backgroundColor: order.status === "delivered"
                ? "#ECFDF3"
                : order.status === "confirmed"
                ? "#F0F9FF"
                : order.status === "shipped"
                ? "#FFFAEB"
                : order.status === "cancelled"
                ? "#FEF3F2"
                : order.status === "declined"
                ? "#FEF3F2"
                : "#F2F4F7",
              color: order.status === "delivered"
                ? "#027A48"
                : order.status === "confirmed"
                ? "#0369A1"
                : order.status === "shipped"
                ? "#B54708"
                : order.status === "cancelled"
                ? "#B42318"
                : order.status === "declined"
                ? "#B42318"
                : "#344054",
              padding: "2px 8px",
              borderRadius: "16px",
              fontSize: "12px",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            {order.status || "pending"}
          </span>
        );
      case "totalPrice":
        return `$${order.totalPrice?.toFixed(2) || "0.00"}`;
      case "actions":
        return (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              icon={<FiEye size={18} />}
              className="p-button-outlined p-button-sm"
              style={{ border: "1px solid #D0D5DD", color: "#344054", backgroundColor: "white", borderRadius: 8 }}
              onClick={() => handleViewOrder(order)}
              tooltip="View Order"
            />
            <Button
              icon={<FiEdit size={18} />}
              className="p-button-outlined p-button-sm"
              style={{ border: "1px solid #D0D5DD", color: "#344054", backgroundColor: "white", borderRadius: 8 }}
              tooltip="Edit Order"
            />
            <Button
              icon={<FiDownload size={18} />}
              className="p-button-outlined p-button-sm"
              style={{ border: "1px solid #D0D5DD", color: "#344054", backgroundColor: "white", borderRadius: 8 }}
              onClick={() => handleDownloadPDF(order)}
              tooltip="Download Invoice"
            />
          </Box>
        );
      default:
        return null;
    }
  };

  // Loading state
  if (loading) {
    return <TableSkeleton showSummary={false} />;
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: "center", color: "#dc3545" }}>{error}</Box>
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
                      ["supplier", "productCount", "deliveryAddress", "orderDate", "status", "totalPrice"].includes(column.id)
                        ? () => handleSort(column.id)
                        : undefined
                    }
                    style={{ cursor: ["supplier", "productCount", "deliveryAddress", "orderDate", "status", "totalPrice"].includes(column.id) ? "pointer" : "default" }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {column.label}
                      {["supplier", "productCount", "deliveryAddress", "orderDate", "status", "totalPrice"].includes(column.id) && (
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
      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        totalItems={pagination.total}
        itemsPerPage={pagination.limit}
        onPageChange={handlePageChange}
        isMobile={isMobile}
        isTablet={isTablet}
      />
    </Box>
  );
};

export default OrderTable;
