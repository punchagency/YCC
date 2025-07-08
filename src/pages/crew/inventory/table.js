import React, { useState, useRef, useEffect, useCallback } from "react";
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
import {
  deleteCrewInventoryItem,
  updateCrewInventoryItem,
} from "../../../services/crew/crewInventoryService";
import { Toast } from "primereact/toast";
import {
  getCrewInventoryData,
  getLowStockCrewInventory,
} from "../../../services/crew/crewInventoryService";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Pagination } from "../../../components/pagination";

const Table = ({ inventoryItems = [], onRefresh, refreshTrigger = 0 }) => {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [itemToView, setItemToView] = useState(null);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [lowStockLoading, setLowStockLoading] = useState(false);
  const toast = useRef(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [editFormData, setEditFormData] = useState({
    productName: "",
    category: "",
    stockQuantity: 0,
    price: 0,
    warehouseLocation: "",
  });
  const [editLoading, setEditLoading] = useState(false);

  const categories = [
    { label: "Food & Beverage", value: "Food & Beverage" },
    { label: "Cleaning Supplies", value: "Cleaning Supplies" },
    { label: "Safety Equipment", value: "Safety Equipment" },
    { label: "Nautical Equipment", value: "Nautical Equipment" },
    { label: "Decor & Furnishings", value: "Decor & Furnishings" },
  ];

  const dropdownStyles = {
    border: "none",
    boxShadow: "none",
  };

  const fetchLowStockItems = useCallback(async () => {
    setLowStockLoading(true);
    try {
      console.log("Fetching low stock items");
      const result = await getLowStockCrewInventory();
      console.log("Low stock items:", result);
      if (result.success) {
        const limitedItems = result.data.slice(0, 2);
        console.log("Limited low stock items", limitedItems);
        setLowStockItems(limitedItems);
      } else {
        console.error("Failed to fetch low stock items:", result.error);
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: result.error || "Failed to fetch low stock items",
          life: 3000,
        });
      }
    } catch (error) {
      console.error("Error fetching low stock items:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "An unexpected error occurred",
        life: 3000,
      });
    } finally {
      setLowStockLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLowStockItems();
  }, []);

  const fetchInventoryData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getCrewInventoryData({ page: pagination.page });
      console.log("Inventory crew data:", result);
      if (result.success) {
        // Extract the result array from the data object
        const inventoryData = result.data?.result || [];
        setInventory(inventoryData);

        // Set pagination if available
        if (result.data) {
          setPagination((prev) => ({
            ...prev,
            page: result.data.page || prev.page,
            limit: result.data.limit || prev.limit,
            total: result.data.totalData || 0,
            totalPages: result.data.totalPages || 1,
          }));
        }
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: result.error || "Failed to fetch inventory data",
        });
      }
    } catch (error) {
      console.error("Error fetching inventory data:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "An unexpected error occurred",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  }, [pagination.page]);

  useEffect(() => {
    fetchInventoryData();
  }, [pagination.page, refreshTrigger]);

  useEffect(() => {
    if (onRefresh) {
      onRefresh(fetchInventoryData);
    }
  }, []);

  // Handle page change for pagination
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const displayItems = inventory.length > 0 ? inventory : [];

  const handleSort = (field) => {
    if (sortField === field) {
      const newDirection = sortDirection === "asc" ? "desc" : "asc";
      setSortDirection(newDirection);
      addActivity("sorted", `${field} ${newDirection}ending`);
    } else {
      setSortField(field);
      setSortDirection("asc");
      addActivity("sorted", `${field} ascending`);
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

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);

    if (checked) {
      // Select all items
      const allItemIds = displayItems.map((item) => item._id);
      setSelectedItems(allItemIds);
    } else {
      // Deselect all
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (e, itemId) => {
    const checked = e.target.checked;

    if (checked) {
      setSelectedItems((prev) => [...prev, itemId]);
    } else {
      setSelectedItems((prev) => prev.filter((id) => id !== itemId));

      // If we're unchecking an item, also uncheck the "select all" checkbox
      if (selectAll) {
        setSelectAll(false);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;

    try {
      const result = await deleteCrewInventoryItem(selectedItems[0]);
      if (result.success) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Items deleted successfully",
          life: 3000,
        });

        // Refresh the inventory list
        fetchInventoryData();
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: result.error || "Failed to delete items",
          life: 3000,
        });
      }
    } catch (error) {
      console.error("Error deleting items:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "An unexpected error occurred",
        life: 3000,
      });
    }
  };

  const handleViewItem = (item) => {
    console.log("Viewing item:", item);
    setItemToView(item);
    setViewModalVisible(true);
    addActivity("viewed", item.product?.name || "Unknown item");
  };

  const handleEditItem = (item) => {
    console.log("Editing item:", item);
    setItemToEdit(item);
    setEditFormData({
      productName: item.product?.name || "",
      category: item.product?.category || "",
      stockQuantity: item.quantity || 0,
      price: item.price || 0,
      warehouseLocation: item.warehouseLocation || "",
    });
    setEditModalVisible(true);
    addActivity("opened edit for", item.product?.name || "Unknown item");
  };

  const handleDelete = (item) => {
    console.log("Deleting item:", item);
    setItemToDelete(item);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    setDeleteLoading(true);
    try {
      const result = await deleteCrewInventoryItem(itemToDelete._id);
      if (result.success) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Item deleted successfully",
          life: 3000,
        });

        // Record the activity
        addActivity("deleted", itemToDelete.product?.name || "Unknown item");

        // Refresh data
        fetchInventoryData();
        fetchLowStockItems(); // Refresh low stock items immediately
        setDeleteModalVisible(false);
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: result.error || "Failed to delete item",
          life: 3000,
        });
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "An unexpected error occurred",
        life: 3000,
      });
    } finally {
      setDeleteLoading(false);
      setItemToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteModalVisible(false);
    setItemToDelete(null);
  };

  const closeViewModal = () => {
    setViewModalVisible(false);
    setItemToView(null);
  };

  const loadActivities = useCallback(() => {
    try {
      const storedActivities = localStorage.getItem("crewInventoryActivities");
      if (storedActivities) {
        setRecentActivities(JSON.parse(storedActivities));
      }
    } catch (error) {
      console.error("Error loading activities from localStorage:", error);
    }
  }, []);

  const addActivity = useCallback((action, itemName) => {
    const newActivity = {
      id: Date.now(),
      action,
      itemName,
      timestamp: new Date().toISOString(),
    };

    setRecentActivities((prevActivities) => {
      const updatedActivities = [newActivity, ...prevActivities].slice(0, 10); // Keep only 10 most recent
      localStorage.setItem(
        "crewInventoryActivities",
        JSON.stringify(updatedActivities)
      );
      return updatedActivities;
    });
  }, []);

  const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - activityTime) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} sec${diffInSeconds !== 1 ? "s" : ""} ago`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min${diffInMinutes !== 1 ? "s" : ""} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hr${diffInHours !== 1 ? "s" : ""} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
  };

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  const handleSaveEdit = async () => {
    if (!itemToEdit) return;

    // Validate required fields
    if (!editFormData.productName || !editFormData.category) {
      toast.current.show({
        severity: "error",
        summary: "Required Fields",
        detail: "Product name and category are required",
        life: 3000,
      });
      return;
    }

    setEditLoading(true);
    try {
      // Prepare the data for the API
      const editData = {
        product: {
          name: editFormData.productName,
          category: editFormData.category,
        },
        quantity: Number(editFormData.stockQuantity) || 0,
        price: Number(editFormData.price) || 0,
        warehouseLocation: editFormData.warehouseLocation,
      };

      // Call the API to update the item
      const result = await updateCrewInventoryItem(itemToEdit._id, editData);

      if (result.success) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Item updated successfully",
          life: 3000,
        });

        // Record the activity
        addActivity("edited", editFormData.productName);

        // Refresh data and close modal
        fetchInventoryData();
        fetchLowStockItems(); // Refresh low stock items immediately
        setEditModalVisible(false);
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: result.error || "Failed to update item",
          life: 3000,
        });
      }
    } catch (error) {
      console.error("Error updating item:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "An unexpected error occurred",
        life: 3000,
      });
    } finally {
      setEditLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditModalVisible(false);
    setItemToEdit(null);
    setEditFormData({
      productName: "",
      category: "",
      stockQuantity: 0,
      price: 0,
      warehouseLocation: "",
    });
  };

  return (
    <>
      {/* Loading Overlay */}
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              className="pi pi-spin pi-spinner"
              style={{ fontSize: "2rem", marginBottom: "10px" }}
            ></div>
            <p>Loading inventory data...</p>
          </div>
        </div>
      )}

      <div className="inventory-container">
        <div className="flex" style={{ height: "inherit" }}>
          <div style={{ width: "70%" }}>
            <div className="bg-white p-4 m-4">
              <Stock />
              <div className="mt-4">
                <div className="flex justify-content-between mb-4">
                  <div>
                    {/* <button
                      className="mr-2 p-2 bg-transparent"
                      style={{
                        border: "1px solid #e0e0e0",
                        borderRadius: "3px",
                        alignContent: "center",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={sort}
                        alt="sort"
                        style={{ width: "15px", height: "15px" }}
                        className="mr-2"
                      />
                      Sort
                    </button> */}
                  </div>
                  <div>
                    <button
                      className="mr-2 p-2 bg-transparent"
                      style={{
                        border: "1px solid #e0e0e0",
                        borderRadius: "3px",
                        alignContent: "center",
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                      onClick={handleBulkDelete}
                      disabled={selectedItems.length === 0}
                    >
                      Delete Selected
                    </button>
                  </div>
                </div>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginTop: "10px",
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: "#f9fafb" }}>
                      <th
                        style={{
                          width: "5%",
                          padding: "10px",
                          textAlign: "left",
                          fontSize: "13px",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th
                        style={{
                          width: "25%",
                          padding: "10px",
                          textAlign: "left",
                          cursor: "pointer",
                          fontSize: "13px",
                        }}
                        onClick={() => handleSort("productName")}
                      >
                        <div className="flex items-center">
                          Product Name {getSortIcon("productName")}
                        </div>
                      </th>
                      <th
                        style={{
                          width: "15%",
                          padding: "10px",
                          textAlign: "left",
                          cursor: "pointer",
                          fontSize: "13px",
                        }}
                        onClick={() => handleSort("category")}
                      >
                        <div className="flex items-center">
                          Category {getSortIcon("category")}
                        </div>
                      </th>
                      <th
                        style={{
                          width: "15%",
                          padding: "10px",
                          textAlign: "left",
                          cursor: "pointer",
                          fontSize: "13px",
                        }}
                        onClick={() => handleSort("quantity")}
                      >
                        <div className="flex items-center">
                          Stock Quantity {getSortIcon("quantity")}
                        </div>
                      </th>
                      <th
                        style={{
                          width: "10%",
                          padding: "10px",
                          textAlign: "center",
                          fontSize: "13px",
                        }}
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          colSpan="6"
                          style={{ textAlign: "center", padding: "20px" }}
                        >
                          Loading inventory data...
                        </td>
                      </tr>
                    ) : displayItems.length === 0 ? (
                      <tr>
                        <td
                          colSpan="6"
                          style={{ textAlign: "center", padding: "20px" }}
                        >
                          No inventory items found. Add some items to get
                          started.
                        </td>
                      </tr>
                    ) : (
                      displayItems.map((item, index) => (
                        <tr key={item._id} className="hover:bg-gray-50">
                          <td
                            style={{
                              padding: "10px",
                              borderBottom: "1px solid #eee",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(item._id)}
                              onChange={(e) => handleSelectItem(e, item._id)}
                            />
                          </td>
                          <td
                            style={{
                              width: "25%",
                              padding: "10px",
                              borderBottom: "1px solid #eee",
                              fontSize: "9px",
                            }}
                          >
                            {item.product?.name || "Unknown Product"}
                          </td>
                          <td
                            style={{
                              width: "15%",
                              padding: "10px",
                              borderBottom: "1px solid #eee",
                              fontSize: "9px",
                            }}
                          >
                            {item.product?.category || "Uncategorized"}
                          </td>
                          <td
                            style={{
                              width: "15%",
                              padding: "10px",
                              borderBottom: "1px solid #eee",
                              fontSize: "9px",
                            }}
                          >
                            {item.quantity || 0} units
                          </td>
                          <td
                            style={{
                              width: "10%",
                              padding: "10px",
                              borderBottom: "1px solid #eee",
                              fontSize: "9px",
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
                                  width: "18px",
                                  height: "18px",
                                  cursor: "pointer",
                                }}
                                onClick={() => handleViewItem(item)}
                              />
                              <img
                                src={editLogo}
                                alt="Edit"
                                className="cursor-pointer"
                                onClick={() => handleEditItem(item)}
                                style={{
                                  marginRight: "10px",
                                  width: "18px",
                                  height: "18px",
                                  cursor: "pointer",
                                }}
                              />
                              <img
                                src={deleteLogo}
                                alt="delete"
                                style={{
                                  width: "18px",
                                  height: "18px",
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
              </div>
            </div>
          </div>

          <div style={{ width: "30%" }}>
            <div
              className="bg-white p-4 m-4"
              style={{ height: "200px", borderRadius: "10px", width: "90%" }}
            >
              <div>
                <div className="flex justify-content-between align-items-center">
                  <h2>Low Stock Alerts</h2>
                  {/* <Button
                    icon="pi pi-refresh"
                    className="p-button-text p-button-rounded"
                    onClick={fetchLowStockItems}
                    disabled={lowStockLoading}
                    tooltip="Refresh low stock items"
                    tooltipOptions={{ position: "left" }}
                  /> */}
                </div>

                {lowStockLoading ? (
                  <div
                    className="flex justify-content-center align-items-center"
                    style={{ height: "120px" }}
                  >
                    <p>Loading low stock items...</p>
                  </div>
                ) : lowStockItems.length === 0 ? (
                  <div
                    className="flex justify-content-center align-items-center"
                    style={{ height: "120px" }}
                  >
                    <p>No low stock items found</p>
                  </div>
                ) : (
                  lowStockItems.map((item, index) => (
                    <div
                      key={item._id || index}
                      className="flex justify-content-between"
                      style={{
                        backgroundColor:
                          index === 0 ? "#FF30211A" : "#FBBC051A",
                        padding: "10px",
                        marginBottom: "10px",
                        marginTop: index === 0 ? "20px" : "0",
                        borderRadius: "5px",
                      }}
                    >
                      <p>
                        {item.product?.name || "Unknown Product"} (
                        {item.quantity || 0} remaining)
                      </p>
                      <p
                        style={{ cursor: "pointer", color: "#0066cc" }}
                        onClick={() => handleViewItem(item)}
                      >
                        Reorder
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div
              className="bg-white p-4 m-4"
              style={{
                height: "200px",
                borderRadius: "10px",
                width: "90%",
                overflow: "auto",
              }}
            >
              <div>
                <div className="flex justify-content-between align-items-center">
                  <h2>Recent Activity</h2>
                  {/* <Button
                    icon="pi pi-refresh"
                    className="p-button-text p-button-rounded"
                    onClick={loadActivities}
                    tooltip="Refresh activities"
                    tooltipOptions={{ position: "left" }}
                  /> */}
                </div>

                {recentActivities.length === 0 ? (
                  <div
                    className="flex justify-content-center"
                    style={{ marginTop: "30px" }}
                  >
                    <p>No recent activities</p>
                  </div>
                ) : (
                  recentActivities.slice(0, 5).map((activity) => (
                    <div
                      key={activity.id}
                      className="flex justify-content-between"
                      style={{
                        marginTop: "10px",
                        marginBottom: "10px",
                      }}
                    >
                      <div className="flex items-center">
                        <img
                          src={activity.action === "deleted" ? danger : green}
                          alt={activity.action}
                          width="20px"
                          height="20px"
                          className="mr-1"
                        />
                        <p>
                          {activity.action === "viewed" &&
                            `Viewed ${activity.itemName}`}
                          {activity.action === "deleted" &&
                            `Deleted ${activity.itemName}`}
                          {activity.action === "edited" &&
                            `Updated ${activity.itemName}`}
                          {activity.action === "opened edit for" &&
                            `Editing ${activity.itemName}`}
                        </p>
                      </div>
                      <p
                        style={{
                          fontSize: "13px",
                          width: "100px",
                          textAlign: "right",
                        }}
                      >
                        {formatRelativeTime(activity.timestamp)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination Component */}
      {pagination.totalPages > 1 && (
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            totalItems={pagination.total}
            itemsPerPage={pagination.limit}
            onPageChange={handlePageChange}
            isMobile={window.innerWidth <= 768}
            isTablet={window.innerWidth > 768 && window.innerWidth <= 1024}
          />
        </div>
      )}

      <Dialog
        visible={deleteModalVisible}
        style={{ width: "450px" }}
        header="Delete Item"
        modal
        footer={
          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}
          >
            <Button
              label="No"
              onClick={cancelDelete}
              className="p-button-text"
              style={{ backgroundColor: "#6c757d", color: "white" }}
            />
            <Button
              label={deleteLoading ? "Deleting..." : "Yes"}
              onClick={confirmDelete}
              disabled={deleteLoading}
              className="p-button-danger"
              style={{ backgroundColor: "#dc3545" }}
            />
          </div>
        }
        onHide={cancelDelete}
      >
        <div
          className="confirmation-content"
          style={{ display: "flex", alignItems: "center", gap: "10px" }}
        >
          <i
            className="pi pi-exclamation-triangle"
            style={{ fontSize: "2rem", color: "#dc3545" }}
          />
          <span>Are you sure you want to delete this item?</span>
        </div>
      </Dialog>

      <Dialog
        visible={viewModalVisible}
        style={{ width: "500px" }}
        header="View Item"
        modal
        footer={
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              label="Close"
              onClick={closeViewModal}
              className="p-button-secondary"
            />
          </div>
        }
        onHide={closeViewModal}
        className="view-item-dialog"
      >
        {itemToView && (
          <div className="view-item-container">
            <div className="view-item-header">
              <h2>{itemToView.product?.name || "Unknown Product"}</h2>
            </div>

            <div className="view-item-details">
              <div className="view-item-row">
                <div className="view-item-label">ID:</div>
                <div className="view-item-value">{itemToView._id}</div>
              </div>

              <div className="view-item-row">
                <div className="view-item-label">Category:</div>
                <div className="view-item-value">
                  {itemToView.product?.category || "Uncategorized"}
                </div>
              </div>

              <div className="view-item-row">
                <div className="view-item-label">Quantity:</div>
                <div className="view-item-value">
                  {itemToView.quantity || 0} units
                </div>
              </div>

              <div className="view-item-row">
                <div className="view-item-label">Price:</div>
                <div className="view-item-value">
                  ${itemToView.price?.toFixed(2) || "0.00"}
                </div>
              </div>

              {itemToView.warehouseLocation && (
                <div className="view-item-row">
                  <div className="view-item-label">Warehouse Location:</div>
                  <div className="view-item-value">
                    {itemToView.warehouseLocation}
                  </div>
                </div>
              )}

              <div className="view-item-row">
                <div className="view-item-label">Last Updated:</div>
                <div className="view-item-value">
                  {itemToView.updatedAt
                    ? new Date(itemToView.updatedAt).toLocaleString()
                    : "Unknown"}
                </div>
              </div>
            </div>
          </div>
        )}
      </Dialog>

      <Dialog
        visible={editModalVisible}
        onHide={cancelEdit}
        header="Edit Product"
        className="add-inventory-modal"
        modal
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        style={{ width: "35vw" }}
        contentStyle={{ overflow: "visible" }}
        maskStyle={{
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          backdropFilter: "blur(4px)",
        }}
      >
        {itemToEdit && (
          <div className="p-fluid">
            <div className="form-row">
              <div
                className="form-group"
                style={{ display: "block", marginBottom: "15px" }}
              >
                <label htmlFor="productName">Product Name</label>
                <InputText
                  id="productName"
                  value={editFormData.productName}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      productName: e.target.value,
                    })
                  }
                  style={{ width: "100%" }}
                />
              </div>
              <div
                className="form-group"
                style={{ display: "block", marginBottom: "15px" }}
              >
                <label htmlFor="category">Category</label>
                <InputText
                  id="category"
                  value={editFormData.category}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      category: e.target.value,
                    })
                  }
                  style={{ width: "100%" }}
                />
              </div>
            </div>

            <div className="form-row">
              <div
                className="form-group"
                style={{ display: "block", marginBottom: "15px" }}
              >
                <label htmlFor="stockQuantity">Stock Quantity</label>
                <InputText
                  id="stockQuantity"
                  type="number"
                  value={editFormData.stockQuantity}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      stockQuantity: e.target.value,
                    })
                  }
                  style={{ width: "100%" }}
                />
              </div>
            </div>

            <div className="form-row">
              <div
                className="form-group"
                style={{ display: "block", marginBottom: "15px" }}
              >
                <label htmlFor="price">Price</label>
                <InputText
                  id="price"
                  type="number"
                  step="0.01"
                  value={editFormData.price}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, price: e.target.value })
                  }
                  style={{ width: "100%" }}
                />
              </div>
            </div>

            <div className="form-row">
              <div
                className="form-group"
                style={{ display: "block", marginBottom: "15px" }}
              >
                <label htmlFor="warehouseLocation">Warehouse Location</label>
                <InputText
                  id="warehouseLocation"
                  value={editFormData.warehouseLocation}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      warehouseLocation: e.target.value,
                    })
                  }
                  style={{ width: "100%" }}
                  placeholder="Optional"
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
                onClick={cancelEdit}
                className="p-button-text"
                autoFocus={false}
                style={{
                  backgroundColor: "#EF4444",
                  color: "#fff",
                  width: "200px",
                  outline: "none",
                }}
              />
              <Button
                label={editLoading ? "Saving..." : "Save Changes"}
                icon="pi pi-check"
                onClick={handleSaveEdit}
                disabled={editLoading}
                style={{
                  backgroundColor: "#0387D9",
                  color: "#fff",
                  width: "200px",
                }}
              />
            </div>
          </div>
        )}
      </Dialog>

      <Toast ref={toast} position="bottom-right" />
    </>
  );
};

export default Table;
