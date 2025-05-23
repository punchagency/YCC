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

const OrderTable = ({ filters = {} }) => {
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const toast = useRef(null);

  const navigate = useNavigate();

  // Fetch orders from API with filters
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Fetching orders with filters:", filters);

      // Prepare API parameters including filters
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        sortBy: sortField,
        sortOrder: sortDirection,
      };

      // Add status filter if provided
      if (filters.status && filters.status.length > 0) {
        params.status = filters.status.join(",");
      }

      console.log("Request params:", params);

      const response = await getOrders(params);
      console.log("Orders API response:", response);

      if (response.status) {
        // Check the structure of the response
        console.log("Response data structure:", JSON.stringify(response.data));

        let ordersData = [];
        let paginationData = { ...pagination };

        // Based on the console output, the structure is response.data.data
        if (response.data?.data && Array.isArray(response.data.data)) {
          ordersData = response.data.data;

          // Update pagination if available
          if (response.data.pagination) {
            console.log("Pagination data from API:", response.data.pagination);
            paginationData = {
              page: parseInt(response.data.pagination.currentPage) || 1,
              limit: parseInt(response.data.pagination.pageSize) || 10,
              total: parseInt(response.data.pagination.totalItems) || 0,
              totalPages: parseInt(response.data.pagination.totalPages) || 1,
            };
          }
        } else if (
          response.data?.data?.data &&
          Array.isArray(response.data.data.data)
        ) {
          // Alternative nested structure
          ordersData = response.data.data.data;

          // Update pagination if available
          if (response.data.data.pagination) {
            console.log(
              "Pagination data from API:",
              response.data.data.pagination
            );
            paginationData = {
              page: parseInt(response.data.data.pagination.currentPage) || 1,
              limit: parseInt(response.data.data.pagination.pageSize) || 10,
              total: parseInt(response.data.data.pagination.totalItems) || 0,
              totalPages:
                parseInt(response.data.data.pagination.totalPages) || 1,
            };
          }
        } else if (Array.isArray(response.data)) {
          // Direct array response
          ordersData = response.data;
        }

        // Apply client-side filtering for criteria that can't be sent to the API
        if (filters.futureDelivery) {
          const currentDate = new Date();
          ordersData = ordersData.filter((order) => {
            const estimatedDelivery = order.estimatedDeliveryDate
              ? new Date(order.estimatedDeliveryDate)
              : null;
            return estimatedDelivery && estimatedDelivery > currentDate;
          });
        }

        console.log("Filtered orders data:", ordersData);
        console.log("Pagination data:", paginationData);

        setOrders(ordersData);
        setPagination(paginationData);
      } else {
        console.error("Failed to fetch orders:", response.error);
        setError("Failed to load orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, sortField, sortDirection, filters]);

  // Fetch orders when component mounts or when sort/pagination changes
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Format date for display without date-fns
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";

      // Format as MM/DD/YYYY
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      const year = date.getFullYear();

      return `${month}/${day}/${year}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
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

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Processing":
        return "bg-blue-100 text-blue-800";
      case "Shipped":
        return "bg-yellow-100 text-yellow-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      case "Pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
    console.log("Downloading PDF for order:", order.orderId || order._id);

    try {
      // Create a new PDF document
      const doc = new jsPDF();

      // Add title
      doc.setFontSize(20);
      doc.text("Order Invoice", 14, 22);

      // Add order ID and dates
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

      // Add vendor information
      doc.setFontSize(16);
      doc.text("Vendor Information", 14, 54);
      doc.setFontSize(12);
      doc.text(`Vendor: ${order.vendorName || "N/A"}`, 14, 60);

      // Add order status
      doc.setFontSize(16);
      doc.text("Order Status", 14, 70);
      doc.setFontSize(12);
      doc.text(`Status: ${order.status || "Pending"}`, 14, 76);

      // Add order items table if available
      if (order.items && order.items.length > 0) {
        doc.setFontSize(16);
        doc.text("Order Items", 14, 86);

        // Prepare table data
        const tableColumn = ["Item", "Quantity", "Price", "Total"];
        const tableRows = [];

        order.items.forEach((item) => {
          const itemData = [
            item.name || "Unknown Item",
            item.quantity || 1,
            `$${item.price?.toFixed(2) || "0.00"}`,
            `$${((item.price || 0) * (item.quantity || 1)).toFixed(2)}`,
          ];
          tableRows.push(itemData);
        });

        // Add the table
        doc.autoTable({
          startY: 90,
          head: [tableColumn],
          body: tableRows,
          theme: "striped",
          headStyles: { fillColor: [66, 139, 202] },
        });

        // Add total amount
        const totalAmount = order.items.reduce(
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
        // If no items, add order total if available
        doc.setFontSize(14);
        doc.text(
          `Total Amount: ${
            order.totalAmount ? `$${order.totalAmount.toFixed(2)}` : "N/A"
          }`,
          14,
          86
        );
      }

      // Add shipping information if available
      if (order.shippingAddress) {
        doc.setFontSize(16);
        doc.text(
          "Shipping Information",
          14,
          doc.autoTable?.previous?.finalY + 20 || 96
        );
        doc.setFontSize(12);

        const shippingY = doc.autoTable?.previous?.finalY + 26 || 102;
        doc.text(
          `Address: ${order.shippingAddress.street || ""}`,
          14,
          shippingY
        );
        doc.text(
          `${order.shippingAddress.city || ""}, ${
            order.shippingAddress.state || ""
          } ${order.shippingAddress.zip || ""}`,
          14,
          shippingY + 6
        );
        doc.text(
          `Country: ${order.shippingAddress.country || ""}`,
          14,
          shippingY + 12
        );
      }

      // Add footer with date
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

      // Generate filename with order ID
      const filename = `order-invoice-${
        order.orderId || order._id || "details"
      }.pdf`;

      // Save the PDF
      doc.save(filename);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  // Function to handle view order dialog
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setViewOrderDialog(true);
  };

  // Handle window resize for mobile detection (similar to order.js)
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div className="bg-white p-4 m-4">
        {/* Order Table */}
        <div className="p-2 bg-white rounded-xl shadow-sm mt-5">
          {loading ? (
            <div className="text-center py-4">Loading orders...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table
                style={{
                  width: "100%",
                  tableLayout: "fixed",
                  borderCollapse: "collapse",
                }}
              >
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      style={{
                        width: "15%",
                        textAlign: "left",
                        padding: "10px",
                        borderBottom: "1px solid #eee",
                      }}
                      onClick={() => handleSort("orderId")}
                    >
                      <div className="flex items-center">
                        Order ID {getSortIcon("orderId")}
                      </div>
                    </th>
                    <th
                      style={{
                        width: "25%",
                        textAlign: "left",
                        padding: "10px",
                        borderBottom: "1px solid #eee",
                      }}
                      onClick={() => handleSort("vendorName")}
                    >
                      <div className="flex items-center">
                        Vendor Name {getSortIcon("vendorName")}
                      </div>
                    </th>
                    <th
                      style={{
                        width: "15%",
                        textAlign: "left",
                        padding: "10px",
                        borderBottom: "1px solid #eee",
                      }}
                      onClick={() => handleSort("createdAt")}
                    >
                      <div className="flex items-center">
                        Date Placed {getSortIcon("createdAt")}
                      </div>
                    </th>
                    <th
                      style={{
                        width: "15%",
                        textAlign: "left",
                        padding: "10px",
                        borderBottom: "1px solid #eee",
                      }}
                      onClick={() => handleSort("estimatedDeliveryDate")}
                    >
                      <div className="flex items-center">
                        Est. Delivery {getSortIcon("estimatedDeliveryDate")}
                      </div>
                    </th>
                    <th
                      style={{
                        width: "15%",
                        textAlign: "left",
                        padding: "10px",
                        borderBottom: "1px solid #eee",
                      }}
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center">
                        Status {getSortIcon("status")}
                      </div>
                    </th>
                    <th
                      style={{
                        width: "15%",
                        textAlign: "left",
                        padding: "10px",
                        borderBottom: "1px solid #eee",
                      }}
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center">
                        Actions {getSortIcon("status")}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center py-4 text-gray-500"
                      >
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    orders.map((order, index) => (
                      <tr key={order._id || index} className="hover:bg-gray-50">
                        <td
                          style={{
                            padding: "10px",
                            borderBottom: "1px solid #eee",
                          }}
                        >
                          {order.orderId || order._id || `ORD-${index}`}
                        </td>
                        <td
                          style={{
                            padding: "10px",
                            borderBottom: "1px solid #eee",
                          }}
                        >
                          {order.vendorName || "N/A"}
                        </td>
                        <td
                          style={{
                            padding: "10px",
                            borderBottom: "1px solid #eee",
                          }}
                        >
                          {formatDate(order.createdAt || order.orderDate)}
                        </td>
                        <td
                          style={{
                            padding: "10px",
                            borderBottom: "1px solid #eee",
                          }}
                        >
                          {formatDate(order.estimatedDeliveryDate)}
                        </td>
                        <td
                          style={{
                            padding: "10px",
                            borderBottom: "1px solid #eee",
                          }}
                        >
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                              order.status
                            )}`}
                          >
                            {order.status || "Pending"}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: "10px",
                            borderBottom: "1px solid #eee",
                          }}
                        >
                          <div className="flex justify-end space-x-4">
                            <div
                              style={{
                                border: "1px solid lightgrey",
                                padding: "5px",
                                cursor: "pointer",
                              }}
                              title="View Order"
                              onClick={() => handleViewOrder(order)}
                            >
                              <FiEye size={18} />
                            </div>
                            <div
                              style={{
                                border: "1px solid lightgrey",
                                padding: "5px",
                                cursor: "pointer",
                              }}
                              title="Edit Order"
                            >
                              <FiEdit size={18} />
                            </div>
                            <div
                              style={{
                                border: "1px solid lightgrey",
                                padding: "5px",
                                cursor: "pointer",
                              }}
                              title="Download Invoice"
                              onClick={() => handleDownloadPDF(order)}
                            >
                              <FiDownload
                                size={18}
                                style={{ cursor: "pointer" }}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div
            className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-1 sm:px-6 mt-4"
            style={{ height: "50px" }}
          >
            {/* Mobile view pagination */}
            <div className="flex flex-1 justify-between sm:hidden">
              <div>
                <p className="text-xs text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {(pagination.page - 1) * pagination.limit + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total
                    )}
                  </span>{" "}
                  of <span className="font-medium">{pagination.total}</span>{" "}
                  results
                </p>
              </div>
              <div className="flex">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium ${
                    pagination.page === 1
                      ? "text-gray-400"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <FiChevronLeft size={15} />
                </button>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium ${
                    pagination.page === pagination.totalPages
                      ? "text-gray-400"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <FiChevronRight size={15} />
                </button>
              </div>
            </div>

            {/* Desktop view pagination */}
            <div className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-600 bg-white border rounded-md shadow-sm">
              {/* Left: Items per page and count */}
              <div className="flex items-center ">
                {/* Items per page dropdown */}
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() =>
                    handleLimitChange(pagination.limit === 10 ? 20 : 10)
                  }
                >
                  <span className="text-gray-500 p-3">{pagination.limit}</span>
                  <FiChevronDown className="text-xs" />
                </div>
                <span className="text-gray-500">Items Per Page</span>
                <span className="text-gray-500 ml-4">
                  {(pagination.page - 1) * pagination.limit + 1}–
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  )}{" "}
                  Of {pagination.total} Items
                </span>
              </div>

              {/* Right: Page navigation */}
              <div className="flex items-center gap-2">
                {/* Page number dropdown */}
                <div className="flex items-center">
                  <span>{pagination.page}</span>
                  <FiChevronDown className="text-xs ml-1" />
                </div>
                <span className="text-gray-500">
                  Of {pagination.totalPages} Pages
                </span>

                {/* Arrows */}
                <button
                  className={`text-gray-400 hover:text-gray-600 ${
                    pagination.page === 1
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  <FiChevronLeft />
                </button>
                <button
                  className={`text-gray-400 hover:text-gray-600 ${
                    pagination.page === pagination.totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                >
                  <FiChevronRight />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View Order Dialog */}
      <Dialog
        visible={viewOrderDialog}
        onHide={() => setViewOrderDialog(false)}
        style={{ width: isMobile ? "95vw" : "70vw" }}
        contentStyle={{ backgroundColor: "#F8FBFF" }}
        header={`Order Details: ${
          selectedOrder?.orderId || selectedOrder?._id || "N/A"
        }`}
        className="order-modal"
      >
        <div className="flex justify-content-between">
          <div style={{ width: "60%" }}>
            <div
              className="bg-white p-4 rounded-md"
              style={{ width: "100%", margin: "20px", borderRadius: "10px" }}
            >
              <h3>Ordered Item</h3>
              <table
                style={{
                  width: "100%",
                  border: "1px solid lightgrey",
                  borderCollapse: "collapse",
                }}
                className="table-order"
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        padding: "8px",
                        textAlign: "left",
                        borderBottom: "1px solid lightgrey",
                      }}
                    >
                      Order ID
                    </th>
                    <th
                      style={{
                        padding: "8px",
                        textAlign: "left",
                        borderBottom: "1px solid lightgrey",
                      }}
                    >
                      Item Name
                    </th>
                    <th
                      style={{
                        padding: "8px",
                        textAlign: "left",
                        borderBottom: "1px solid lightgrey",
                      }}
                    >
                      Quantity
                    </th>
                    <th
                      style={{
                        padding: "8px",
                        textAlign: "left",
                        borderBottom: "1px solid lightgrey",
                      }}
                    >
                      Price
                    </th>
                    <th
                      style={{
                        padding: "8px",
                        textAlign: "left",
                        borderBottom: "1px solid lightgrey",
                      }}
                    >
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      style={{
                        padding: "8px",
                        borderBottom: "1px solid lightgrey",
                      }}
                    >
                      {selectedOrder?.orderId || selectedOrder?._id || "N/A"}
                    </td>
                    <td
                      style={{
                        padding: "8px",
                        borderBottom: "1px solid lightgrey",
                      }}
                    >
                      {selectedOrder?.products?.[0]?.name ||
                        selectedOrder?.products?.[0]?.id?.name ||
                        "N/A"}
                    </td>
                    <td
                      style={{
                        padding: "8px",
                        borderBottom: "1px solid lightgrey",
                      }}
                    >
                      {selectedOrder?.products?.[0]?.quantity || "N/A"}
                    </td>
                    <td
                      style={{
                        padding: "8px",
                        borderBottom: "1px solid lightgrey",
                      }}
                    >
                      ${selectedOrder?.products?.[0]?.price || "N/A"}
                    </td>
                    <td
                      style={{
                        padding: "8px",
                        borderBottom: "1px solid lightgrey",
                      }}
                    >
                      $
                      {selectedOrder?.totalPrice ||
                        (selectedOrder?.products?.[0]?.price &&
                        selectedOrder?.products?.[0]?.quantity
                          ? (
                              selectedOrder.products[0].price *
                              selectedOrder.products[0].quantity
                            ).toFixed(2)
                          : "N/A")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div
              className="bg-white p-4 rounded-md"
              style={{ width: "100%", margin: "20px", borderRadius: "10px" }}
            >
              <div
                style={{
                  borderBottom: "1px solid lightgrey",
                  padding: "10px",
                  marginBottom: "20px",
                }}
              >
                <h3>Estimated Delivery Date</h3>
                <p>{selectedOrder?.estimatedDeliveryDate || "N/A"}</p>
              </div>
              <div
                style={{
                  borderBottom: "1px solid lightgrey",
                  padding: "10px",
                  marginBottom: "20px",
                }}
              >
                <h3>Shipping address</h3>
                <p>{selectedOrder?.deliveryAddress || "N/A"}</p>
              </div>
              <div>
                <h3>Order Actions</h3>
                <button
                  style={{
                    backgroundColor: "#FF30211A",
                    color: "#FF3021",
                    padding: "10px 20px",
                    border: "1px solid #FF30211A",
                    marginRight: "10px",
                  }}
                >
                  Report An Issue
                </button>
                <button
                  style={{
                    backgroundColor: "#3D56D81A",
                    color: "#3D56D8",
                    padding: "10px 20px",
                    border: "1px solid #3D56D81A",
                    marginRight: "10px",
                  }}
                >
                  ReOrder Item
                </button>
                <button
                  style={{
                    border: "1px solid lightgrey",
                    backgroundColor: "transparent",
                    padding: "10px 20px",
                  }}
                >
                  Cancel Order
                </button>
              </div>
            </div>
          </div>
          <div
            className="bg-white p-4 rounded-md"
            style={{ width: "35%", margin: "20px" }}
          >
            <div>
              <h3>Cost summary</h3>
              <div className="flex justify-content-between">
                <p>Price</p>
                <p>${selectedOrder?.products?.[0]?.price || "N/A"}</p>
              </div>
              <div className="flex justify-content-between">
                <p>Subtotal</p>
                <p>${selectedOrder?.products?.[0]?.price || "N/A"}</p>
              </div>
              <div
                className="flex justify-content-between"
                style={{
                  borderTop: "1px solid lightgrey",
                  padding: "10px",
                  marginTop: "20px",
                }}
              >
                <p>Total</p>
                <p>
                  $
                  {selectedOrder?.totalPrice ||
                    selectedOrder?.products?.[0]?.price ||
                    "N/A"}
                </p>
              </div>
            </div>
            <div
              className="bg-white rounded-md"
              style={{
                width: "100%",
                marginTop: "40px",
                borderRadius: "10px",
                boxShadow: "0px -2px 2px lightgrey",
                padding: "30px 20px",
              }}
            >
              <h3 className="mb-2">Vendor Information</h3>
              <p className="mb-2">Vendor Name: {selectedOrder?.vendorName || "N/A"}</p>
              {/* <p className="mb-2">
                {selectedOrder?.vendorAddress || "N/A"}
              </p>
              <p className="mb-2">
                {selectedOrder?.vendorPhone || "N/A"}
              </p>
              <p className="mb-2">
                {selectedOrder?.vendorEmail || "N/A"}
              </p> */}
              <button
                style={{
                  backgroundColor: "#F0F0F0",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  marginTop: "20px",
                  width: "100%",
                  border: "1px solid #F0F0F0",
                  outline: "none",
                }}
              >
                Contact Vendor
              </button>
            </div>
          </div>
        </div>
      </Dialog>

      <Toast ref={toast} position="bottom-right" />
    </>
  );
};

export default OrderTable;
