import React, { useState, useEffect, useRef, useCallback } from "react";
import Stock from "./stock";
import green from "../../../assets/images/crew/green.png";
import danger from "../../../assets/images/crew/danger.png";
import {
  FaChevronDown,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";
import { FiEye, FiDownload, FiEdit } from "react-icons/fi";
import sort from "../../../assets/images/crew/sort.png";
import eyesIn from "../../../assets/images/crew/eyes-in.png";
import editLogo from "../../../assets/images/crew/editLogo.png";
import deleteLogo from "../../../assets/images/crew/deleteLogo.png";
import "./inventory.css";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import {
  getCrewInventoryById,
  updateCrewInventory,
  getLowStockCrewProducts,
} from "../../../services/inventory/crewInventoryService";
import { InputText } from "primereact/inputtext";
import moment from "moment";

const Table = ({
  products = [],
  loading = false,
  onDelete,
  onRefresh,
  pagination = {},
}) => {
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewItem, setViewItem] = useState({
    id: null,
    productName: "",
    category: "",
    serviceArea: "",
    stockQuantity: "",
    price: "",
    productImage: null,
  });
  const [isViewLoading, setIsViewLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editItem, setEditItem] = useState({
    id: null,
    productName: "",
    category: "",
    serviceArea: "",
    stockQuantity: "",
    price: "",
  });
  const [isEditLoading, setIsEditLoading] = useState(false);
  const toast = useRef(null);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [isLowStockLoading, setIsLowStockLoading] = useState(false);
  const [recentActivities, setRecentActivities] = useState(() => {
    const savedActivities = localStorage.getItem("recentInventoryActivities");
    return savedActivities ? JSON.parse(savedActivities) : [];
  });

  // Set defaults for pagination if not provided
  const {
    totalItems = 0,
    totalPages = 1,
    currentPage: apiCurrentPage = 1,
    pageSize = 10,
    hasNextPage = false,
    hasPrevPage = false,
  } = pagination;

  // Update local current page if API returns different value
  useEffect(() => {
    console.log("Table received pagination:", pagination);
    if (apiCurrentPage !== currentPage) {
      console.log(
        `Updating current page from ${currentPage} to ${apiCurrentPage}`
      );
      setCurrentPage(apiCurrentPage);
    }
  }, [apiCurrentPage, pagination]);

  // Reset selection when products change
  useEffect(() => {
    setSelectedItems([]);
    setSelectAll(false);
  }, [products]);

  // Add useEffect to fetch low stock items when component mounts
  useEffect(() => {
    fetchLowStockItems();
  }, []);

  // Add this effect to refresh low stock items when products change
  useEffect(() => {
    if (products.length > 0) {
      fetchLowStockItems();
    }
  }, [products]);

  // Function to fetch low stock items
  const fetchLowStockItems = async () => {
    setIsLowStockLoading(true);
    try {
      const response = await getLowStockCrewProducts();

      if (response.success) {
        // Limit to only 3 items
        const limitedItems = (response.data || []).slice(0, 3);
        setLowStockItems(limitedItems);
      } else {
        console.error("Failed to load low stock items:", response.error);
        if (toast.current) {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: response.error || "Failed to load low stock items",
            life: 3000,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching low stock items:", error);
    } finally {
      setIsLowStockLoading(false);
    }
  };

  // Function to determine alert color based on percentage
  const getAlertBackgroundColor = (percentage) => {
    if (percentage <= 30) {
      return "#FF30211A"; // Red for critical (below 30%)
    } else if (percentage <= 60) {
      return "#FBBC051A"; // Yellow for warning (30-60%)
    } else {
      return "#22C55E1A"; // Green for ok (above 60%)
    }
  };

  const handleSort = (field) => {
    const newDirection =
      sortField === field && sortDirection === "asc" ? "desc" : "asc";

    setSortField(field);
    setSortDirection(newDirection);

    if (onRefresh) {
      onRefresh({
        sortField: field,
        sortDirection: newDirection,
        page: currentPage,
        limit: pageSize,
      });
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;

    setCurrentPage(newPage);

    if (onRefresh) {
      onRefresh({
        sortField,
        sortDirection,
        page: newPage,
        limit: pageSize,
      });
    }
  };

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh({
        sortField,
        sortDirection,
        page: currentPage,
        limit: pageSize,
      });
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
    return (
      <img
        src={sort}
        alt="sort"
        style={{
          width: "15px",
          height: "15px",
          opacity: 0.3,
          marginLeft: "5px",
        }}
      />
    );
  };

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);

    if (checked) {
      const allItemIds = products.map((item) => item.id);
      setSelectedItems(allItemIds);
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (e, itemId) => {
    const checked = e.target.checked;

    if (checked) {
      setSelectedItems((prev) => [...prev, itemId]);
    } else {
      setSelectedItems((prev) => prev.filter((id) => id !== itemId));

      if (selectAll) {
        setSelectAll(false);
      }
    }
  };

  const handleBulkDelete = () => {
    if (selectedItems.length === 0) return;
    if (onDelete) {
      onDelete(selectedItems);
    }
  };

  const handleViewItem = async (item) => {
    setIsViewLoading(true);
    try {
      // Fetch detailed item data from API
      const result = await getCrewInventoryById(item.id);

      if (result.success) {
        const itemData = result.data;
        setViewItem({
          id: itemData._id,
          productName: itemData.product?.name || "Unknown Product",
          category: itemData.product?.category || "Uncategorized",
          serviceArea: itemData.product?.serviceArea || "Not specified",
          stockQuantity: itemData.quantity || 0,
          price: itemData.price || 0,
          productImage: itemData.productImage || null,
        });
        setShowViewModal(true);

        // Log the view activity
        addActivity("viewed", item.name);
      } else {
        if (toast.current) {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: result.error || "Failed to load inventory item",
            life: 3000,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching inventory item:", error);
      if (toast.current) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Error loading inventory item",
          life: 3000,
        });
      }
    } finally {
      setIsViewLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditItem({
      id: item.id,
      productName: item.name,
      category: item.category,
      serviceArea: item.vendor,
      stockQuantity: item.quantity.toString(),
      price: item.price.toFixed(2),
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    setIsEditLoading(true);

    try {
      // Format the data for the API
      const updateData = {
        productName: editItem.productName,
        category: editItem.category,
        serviceArea: editItem.serviceArea,
        quantity: parseInt(editItem.stockQuantity),
        price: parseFloat(editItem.price),
      };

      // Call the API to update the item
      const result = await updateCrewInventory(editItem.id, updateData);

      if (result.success) {
        // Show success message
        if (toast.current) {
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Product updated successfully",
            life: 3000,
          });
        }

        setShowEditModal(false);

        // Refresh the inventory data
        if (onRefresh) {
          onRefresh({
            sortField,
            sortDirection,
            page: currentPage,
            limit: pageSize,
          });
        }

        // Refresh low stock items to update the alerts
        fetchLowStockItems();

        // Log the update activity
        addActivity("updated", editItem.productName);
      } else {
        // Show error message
        if (toast.current) {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: result.error || "Failed to update product",
            life: 3000,
          });
        }
      }
    } catch (error) {
      console.error("Error updating product:", error);
      if (toast.current) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "An unexpected error occurred while updating the product",
          life: 3000,
        });
      }
    } finally {
      setIsEditLoading(false);
    }
  };

  const handleDelete = (item) => {
    setItemToDelete(item);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    setIsDeleting(true);

    // Log the delete activity before actual deletion
    if (itemToDelete) {
      addActivity("deleted", itemToDelete.name);
    }

    if (onDelete) {
      onDelete([itemToDelete.id]);
      setShowDeleteConfirmation(false);

      // Refresh low stock items after deletion
      setTimeout(() => {
        fetchLowStockItems();
        setIsDeleting(false);
      }, 500);
    }
  };

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are only a few
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show a subset of pages with ellipsis
      if (currentPage <= 3) {
        // Near beginning: show first 3, ellipsis, last
        for (let i = 1; i <= 3; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near end: show first, ellipsis, last 3
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Middle: show first, ellipsis, current-1, current, current+1, ellipsis, last
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // Function to add a new activity
  const addActivity = useCallback((action, itemName) => {
    const newActivity = {
      id: Date.now(),
      action,
      itemName,
      timestamp: new Date().toISOString(),
    };

    setRecentActivities((prevActivities) => {
      // Add new activity to the beginning and keep only the latest 3
      const updatedActivities = [newActivity, ...prevActivities].slice(0, 3);
      return updatedActivities;
    });
  }, []);

  // Save activities to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(
      "recentInventoryActivities",
      JSON.stringify(recentActivities)
    );
  }, [recentActivities]);

  // Format time difference for display
  const formatTimeAgo = (timestamp) => {
    const now = moment();
    const activityTime = moment(timestamp);
    const diffMinutes = now.diff(activityTime, "minutes");

    if (diffMinutes < 1) {
      return "Just now";
    } else if (diffMinutes < 60) {
      return `${diffMinutes} min${diffMinutes !== 1 ? "s" : ""} ago`;
    } else if (diffMinutes < 1440) {
      // less than a day
      const hours = Math.floor(diffMinutes / 60);
      return `${hours} hr${hours !== 1 ? "s" : ""} ago`;
    } else {
      const days = Math.floor(diffMinutes / 1440);
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    }
  };

  // Get appropriate icon for activity type
  const getActivityIcon = (action) => {
    switch (action) {
      case "added":
      case "updated":
        return green;
      case "deleted":
      case "low stock":
        return danger;
      default:
        return green;
    }
  };

  // Add this function to handle filter changes
  const handleFilterChange = (filters) => {
    // Apply filters to the API call or local filtering
    const filteredParams = {
      sortField,
      sortDirection,
      page: 1, // Reset to first page when filters change
      limit: pageSize,
    };
    
    // Add category filter if not "all"
    if (filters.category !== "all") {
      filteredParams.category = filters.category;
    }
    
    // Add stock level filter
    if (filters.stockLevel !== "all") {
      switch (filters.stockLevel) {
        case "low":
          filteredParams.stockLevel = "low";
          break;
        case "out":
          filteredParams.stockLevel = "out";
          break;
        case "in":
          filteredParams.stockLevel = "in";
          break;
        default:
          break;
      }
    }
    
    // Add vendor/location filter if not "all"
    if (filters.vendor !== "all") {
      filteredParams.serviceArea = filters.vendor;
    }
    
    // Use onRefresh instead of fetchInventory
    if (onRefresh) {
      onRefresh(filteredParams);
    }
  };

  return (
    <>
      <div className="flex justify-content-between">
        <div
          className="bg-white p-4 m-4"
          style={{ width: "90%", borderRadius: "10px" }}
        >
          <Stock onFilterChange={handleFilterChange} products={products} />

          <div className="p-2 bg-white rounded-xl shadow-sm mt-5">
            <div className="flex justify-between mb-3">
              <h3 className="text-lg font-semibold">Inventory Items</h3>
            </div>

            <div
              className="overflow-x-auto hide-scrollbar"
              style={{
                width: "100%",
                tableLayout: "fixed",
                borderCollapse: "collapse",
              }}
            >
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              <table
                className="inventory-header-table"
                style={{
                  width: "100%",
                  tableLayout: "fixed",
                  borderCollapse: "collapse",
                  marginBottom: "0",
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        width: "5%",
                        textAlign: "center",
                        padding: "10px",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={handleSelectAll}
                          style={{
                            margin: 0,
                            width: "17px",
                            height: "17px",
                          }}
                        />
                        {selectedItems.length > 0 && (
                          <i
                            className="pi pi-trash"
                            style={{
                              cursor: "pointer",
                              color: "#ff4d4f",
                              marginLeft: "8px",
                            }}
                            onClick={handleBulkDelete}
                          ></i>
                        )}
                      </div>
                    </th>
                    <th
                      style={{
                        width: "25%",
                        textAlign: "left",
                        padding: "10px",
                        borderBottom: "1px solid #eee",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort("name")}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <p style={{ margin: 0, flex: 1, fontSize: "15px" }}>
                          Item Name
                        </p>
                        {getSortIcon("name")}
                      </div>
                    </th>
                    <th
                      style={{
                        width: "15%",
                        textAlign: "left",
                        padding: "10px",
                        borderBottom: "1px solid #eee",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort("category")}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <p style={{ margin: 0, flex: 1, fontSize: "15px" }}>
                          Category
                        </p>
                        {getSortIcon("category")}
                      </div>
                    </th>
                    <th
                      style={{
                        width: "20%",
                        textAlign: "left",
                        padding: "10px",
                        borderBottom: "1px solid #eee",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort("vendor")}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <p style={{ margin: 0, flex: 1, fontSize: "15px" }}>
                          Service Area
                        </p>
                        {getSortIcon("vendor")}
                      </div>
                    </th>
                    <th
                      style={{
                        width: "10%",
                        textAlign: "left",
                        padding: "10px",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            flex: 1,
                            fontSize: "15px",
                            textAlign: "center",
                          }}
                        >
                          Actions
                        </p>
                      </div>
                    </th>
                  </tr>
                </thead>
              </table>

              <table
                className="inventory-table"
                style={{
                  width: "100%",
                  tableLayout: "fixed",
                  borderCollapse: "collapse",
                  marginTop: "0",
                }}
              >
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4">
                        Loading inventory data...
                      </td>
                    </tr>
                  ) : products.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4">
                        No inventory items found. Add your first item!
                      </td>
                    </tr>
                  ) : (
                    products.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td
                          style={{
                            width: "5%",
                            padding: "10px",
                            textAlign: "center",
                            borderBottom: "1px solid #eee",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={(e) => handleSelectItem(e, item.id)}
                            style={{
                              width: "16px",
                              height: "16px",
                            }}
                          />
                        </td>
                        <td
                          style={{
                            width: "25%",
                            padding: "10px",
                            borderBottom: "1px solid #eee",
                            fontSize: "13px",
                          }}
                        >
                          {item.name}
                        </td>
                        <td
                          style={{
                            width: "15%",
                            padding: "10px",
                            borderBottom: "1px solid #eee",
                            fontSize: "13px",
                          }}
                        >
                          {item.category}
                        </td>
                        <td
                          style={{
                            width: "20%",
                            padding: "10px",
                            borderBottom: "1px solid #eee",
                            fontSize: "13px",
                          }}
                        >
                          {item.vendor}
                        </td>
                        <td
                          style={{
                            width: "10%",
                            padding: "10px",
                            borderBottom: "1px solid #eee",
                            fontSize: "13px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              justifyContent: "center",
                            }}
                          >
                            <img
                              src={eyesIn}
                              alt="view"
                              style={{
                                width: "20px",
                                height: "20px",
                                cursor: "pointer",
                              }}
                              onClick={() => handleViewItem(item)}
                            />
                            <img
                              src={editLogo}
                              alt="edit"
                              style={{
                                width: "20px",
                                height: "20px",
                                cursor: "pointer",
                              }}
                              onClick={() => handleEdit(item)}
                            />
                            <img
                              src={deleteLogo}
                              alt="delete"
                              style={{
                                width: "20px",
                                height: "20px",
                                cursor: "pointer",
                              }}
                              onClick={() => handleDelete(item)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Pagination footer */}
              <div
                className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4"
                style={{ height: "50px" }}
              >
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing{" "}
                      <span className="font-medium">
                        {products.length > 0
                          ? (currentPage - 1) * pageSize + 1
                          : 0}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium">
                        {Math.min(currentPage * pageSize, totalItems)}
                      </span>{" "}
                      of <span className="font-medium">{totalItems}</span>{" "}
                      results
                    </p>
                  </div>

                  {/* Pagination Controls */}
                  <div>
                    <nav
                      className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                      aria-label="Pagination"
                    >
                      {/* Previous Page Button */}
                      <button
                        className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={!hasPrevPage}
                        style={{
                          cursor: hasPrevPage ? "pointer" : "not-allowed",
                          opacity: hasPrevPage ? 1 : 0.5,
                        }}
                      >
                        <span className="sr-only">Previous</span>
                        <FaChevronDown className="h-3 w-3 rotate-90" />
                      </button>

                      {/* Page Numbers */}
                      {generatePageNumbers().map((page, index) =>
                        page === "..." ? (
                          <span
                            key={`ellipsis-${index}`}
                            className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300"
                          >
                            ...
                          </span>
                        ) : (
                          <button
                            key={page}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                              page === currentPage
                                ? "bg-blue-50 text-blue-600"
                                : "text-gray-900"
                            } ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0`}
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </button>
                        )
                      )}

                      {/* Next Page Button */}
                      <button
                        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={!hasNextPage}
                        style={{
                          cursor: hasNextPage ? "pointer" : "not-allowed",
                          opacity: hasNextPage ? 1 : 0.5,
                        }}
                      >
                        <span className="sr-only">Next</span>
                        <FaChevronDown className="h-3 w-3 -rotate-90" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div></div>
        <div style={{ width: "30%" }}>
          <div
            className="bg-white p-4 m-4"
            style={{
              height: "auto",
              minHeight: "200px",
              borderRadius: "10px",
              width: "90%",
            }}
          >
            <div>
              <h2>Low Stock Alerts</h2>

              {isLowStockLoading ? (
                <div
                  className="flex justify-content-center align-items-center"
                  style={{ height: "100px" }}
                >
                  <i
                    className="pi pi-spin pi-spinner"
                    style={{ fontSize: "2rem" }}
                  ></i>
                </div>
              ) : lowStockItems.length > 0 ? (
                lowStockItems.map((item, index) => (
                  <div
                    key={item._id || index}
                    className="flex justify-content-between"
                    style={{
                      backgroundColor: getAlertBackgroundColor(item.percentage),
                      padding: "10px",
                      marginBottom: "10px",
                      marginTop: index === 0 ? "20px" : "0",
                      borderRadius: "5px",
                    }}
                  >
                    <p>
                      {item.product?.name || "Unknown Product"} ({item.quantity}{" "}
                      remaining)
                    </p>
                    <p
                      style={{
                        cursor: "pointer",
                        color: "#0387D9",
                        fontWeight: "500",
                      }}
                      onClick={() => {
                        // You could implement a reorder function here
                        toast.current.show({
                          severity: "info",
                          summary: "Reorder",
                          detail: `Reordering ${
                            item.product?.name || "Unknown Product"
                          }`,
                          life: 3000,
                        });
                      }}
                    >
                      Reorder
                    </p>
                  </div>
                ))
              ) : (
                <div
                  className="flex justify-content-center align-items-center"
                  style={{
                    height: "100px",
                    color: "#6B7280",
                    flexDirection: "column",
                    marginTop: "20px",
                  }}
                >
                  <i
                    className="pi pi-check-circle"
                    style={{ fontSize: "1.5rem", marginBottom: "10px" }}
                  ></i>
                  <p>No low stock items</p>
                </div>
              )}
            </div>
          </div>
          <div
            className="bg-white p-4 m-4"
            style={{ height: "200px", borderRadius: "10px", width: "90%" }}
          >
            <div>
              <h2>Recent Activity</h2>
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <div
                    key={activity.id}
                    className="flex justify-content-between"
                    style={{
                      marginTop: index === 0 ? "20px" : "10px",
                      marginBottom: "10px",
                    }}
                  >
                    <div className="flex items-center">
                      <img
                        src={getActivityIcon(activity.action)}
                        alt={activity.action}
                        width="20px"
                        height="20px"
                        className="mr-1"
                      />
                      <p>
                        {activity.action.charAt(0).toUpperCase() +
                          activity.action.slice(1)}{" "}
                        {activity.itemName}
                      </p>
                    </div>
                    <p style={{ fontSize: "13px", width: "100px" }}>
                      {formatTimeAgo(activity.timestamp)}
                    </p>
                  </div>
                ))
              ) : (
                <div
                  className="flex justify-content-center align-items-center"
                  style={{
                    height: "100px",
                    color: "#6B7280",
                    flexDirection: "column",
                    marginTop: "20px",
                  }}
                >
                  <i
                    className="pi pi-history"
                    style={{ fontSize: "1.5rem", marginBottom: "10px" }}
                  ></i>
                  <p>No recent activities</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog
        visible={showDeleteConfirmation}
        onHide={() => setShowDeleteConfirmation(false)}
        header="Confirm Deletion"
        modal
        style={{ width: "400px" }}
        maskStyle={{
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          backdropFilter: "blur(4px)",
        }}
        footer={
          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}
          >
            <Button
              label="Cancel"
              style={{
                backgroundColor: "#EF4444",
                color: "#fff",
                border: "1px solid #EF4444",
                width: "100px",
                outline: "none",
              }}
              onClick={() => setShowDeleteConfirmation(false)}
              className="p-button-text"
              disabled={isDeleting}
            />
            <Button
              label={isDeleting ? "Deleting..." : "Yes"}
              style={{
                backgroundColor: "#0387D9",
                color: "#fff",
                border: "1px solid #0387D9",
                width: "100px",
                outline: "none",
              }}
              onClick={confirmDelete}
              className="p-button-danger"
              disabled={isDeleting}
            />
          </div>
        }
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle"
            style={{ fontSize: "2rem", color: "#ff9800", marginRight: "10px" }}
          ></i>
          <span>Are you sure you want to delete this item?</span>
        </div>
      </Dialog>

      {/* View Item Modal */}
      <Dialog
        visible={showViewModal}
        onHide={() => setShowViewModal(false)}
        header="Inventory Summary"
        className="view-inventory-modal"
        style={{ width: "80%", maxWidth: "800px" }}
        modal
        blockScroll
      >
        <div className="view-form">
          {/* Product Image and Name Section */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "24px",
              padding: "12px",
              backgroundColor: "#F9FAFB",
              borderRadius: "8px",
            }}
          >
            {viewItem.productImage ? (
              <img
                src={viewItem.productImage}
                alt={viewItem.productName}
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "4px",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "4px",
                  backgroundColor: "#E5E7EB",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <i
                  className="pi pi-image"
                  style={{ fontSize: "24px", color: "#9CA3AF" }}
                ></i>
              </div>
            )}
            <div>
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
                {viewItem.productName}
              </h3>
              <p
                style={{
                  margin: "4px 0 0 0",
                  fontSize: "14px",
                  color: "#6B7280",
                }}
              >
                {viewItem.category}
              </p>
            </div>
          </div>

          {/* Details Grid */}
          <div style={{ display: "grid", gap: "16px" }}>
            <div
              className="detail-row"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <span style={{ color: "#6B7280", fontSize: "14px" }}>
                Product Name
              </span>
              <span
                style={{
                  color: "#111827",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                {viewItem.productName}
              </span>
            </div>

            <div
              className="detail-row"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <span style={{ color: "#6B7280", fontSize: "14px" }}>
                Category
              </span>
              <span
                style={{
                  color: "#111827",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                {viewItem.category}
              </span>
            </div>

            <div
              className="detail-row"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <span style={{ color: "#6B7280", fontSize: "14px" }}>Price</span>
              <span
                style={{
                  color: "#111827",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                ${parseFloat(viewItem.price).toFixed(2)}
              </span>
            </div>

            <div
              className="detail-row"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <span style={{ color: "#6B7280", fontSize: "14px" }}>
                Availability
              </span>
              <span
                style={{
                  color: "#111827",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                {viewItem.stockQuantity} units
              </span>
            </div>

            <div
              className="detail-row"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <span style={{ color: "#6B7280", fontSize: "14px" }}>
                Service Area
              </span>
              <span
                style={{
                  color: "#111827",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                {viewItem.serviceArea}
              </span>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Edit Modal */}
      <Dialog
        visible={showEditModal}
        onHide={() => setShowEditModal(false)}
        header="Update Stock"
        className="edit-inventory-modal"
        modal
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        style={{ width: "35vw" }}
        maskStyle={{
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          backdropFilter: "blur(4px)",
        }}
      >
        <div className="edit-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="productName">Product Name</label>
              <InputText
                id="productName"
                value={editItem.productName}
                onChange={(e) =>
                  setEditItem({ ...editItem, productName: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <InputText
                id="category"
                value={editItem.category}
                onChange={(e) =>
                  setEditItem({ ...editItem, category: e.target.value })
                }
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="serviceArea">Service Area</label>
              <InputText
                id="serviceArea"
                value={editItem.serviceArea}
                onChange={(e) =>
                  setEditItem({ ...editItem, serviceArea: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="stockQuantity">Stock Quantity</label>
              <InputText
                id="stockQuantity"
                type="number"
                value={editItem.stockQuantity}
                onChange={(e) =>
                  setEditItem({ ...editItem, stockQuantity: e.target.value })
                }
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price</label>
              <InputText
                id="price"
                type="number"
                step="0.01"
                value={editItem.price}
                onChange={(e) =>
                  setEditItem({ ...editItem, price: e.target.value })
                }
              />
            </div>
          </div>

          <div
            className="button-row"
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            <Button
              label="Cancel"
              icon="pi pi-times"
              onClick={() => setShowEditModal(false)}
              className="p-button-text"
              disabled={isEditLoading}
              style={{
                backgroundColor: "#EF4444",
                color: "#fff",
                width: "200px",
              }}
            />
            <Button
              label={isEditLoading ? "Updating..." : "Update Product"}
              icon="pi pi-check"
              onClick={handleUpdate}
              disabled={isEditLoading}
              style={{
                backgroundColor: "#0387D9",
                color: "#fff",
                width: "200px",
              }}
            />
          </div>
        </div>
      </Dialog>

      <Toast ref={toast} position="bottom-right" />
    </>
  );
};

export default Table;
