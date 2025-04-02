import React, { useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { TabView, TabPanel } from "primereact/tabview";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import {
  createInventoryData,
  getInventoryData,
  updateInventoryItem,
  deleteInventoryItem,
} from "../../services/inventory/inventoryService";
import lone from "../../assets/images/crew/lone.png";
import upcomingLogo from "../../assets/images/crew/upcomingorderLogo.png";
import iconexpire from "../../assets/images/crew/iconexpire.png";
import iconcareer from "../../assets/images/crew/iconcareer.png";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import sourceData from "../../data/sourceData.json";
import analyticsData from "../../data/analyticsData.json";
import sort from "../../assets/images/crew/sort.png";
import editLogo from "../../assets/images/crew/editLogo.png";
import deleteLogo from "../../assets/images/crew/deleteLogo.png";
import plus from "../../assets/images/crew/plus.png";
import eyesIn from "../../assets/images/crew/eyes-in.png";
import { ProgressSpinner } from "primereact/progressspinner";

const Invent = () => {
  const navigate = useNavigate();
  const toast = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [viewItem, setViewItem] = useState({
    id: null,
    productName: "",
    category: "",
    serviceArea: "",
    stockQuantity: "",
    price: "",
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Initialize with empty array
  const [inventoryItems, setInventoryItems] = useState([]);

  const [editItem, setEditItem] = useState({
    id: null,
    index: null,
    productName: "",
    category: "",
    serviceArea: "",
    stockQuantity: "",
    price: "",
  });

  const [newItem, setNewItem] = useState({
    productName: "",
    category: "",
    serviceArea: "",
    stockQuantity: "",
    price: "",
  });

  // Fetch inventory data when component mounts
  useEffect(() => {
    fetchInventoryData();
  }, []);

  // Function to fetch inventory data from API
  const fetchInventoryData = async () => {
    setIsDataLoading(true);
    try {
      const result = await getInventoryData();
      console.log("API Response:", result);
      console.log("Data structure:", result.data);

      if (result.success) {
        // The inventory array is in result.data.data.result
        const inventoryData = result.data.data.result || [];
        if (!Array.isArray(inventoryData)) {
          console.error("Inventory data is not an array:", inventoryData);
          return;
        }

        // Transform API data to match the format expected by the component
        const formattedItems = inventoryData.map((item) => ({
          id: item._id,
          productName: item.product?.name || "Unknown Product",
          category: item.product?.category || "Uncategorized",
          serviceArea: item.product?.serviceArea || "Not specified",
          stockQuantity: item.quantity || 0,
          price: item.price || 0,
        }));

        setInventoryItems(formattedItems);
        console.log("Inventory data loaded:", formattedItems);
      } else {
        console.error("Failed to load inventory data:", result.error);
        if (toast.current) {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: result.error || "Failed to load inventory data",
            life: 3000,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching inventory data:", error);
      if (toast.current) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "An unexpected error occurred while loading data",
          life: 3000,
        });
      }
    } finally {
      setIsDataLoading(false);
    }
  };

  const goCrewDashboardPage = () => {
    navigate("/crew/dashboard");
  };
  const goInventorySummaryPage = () => {
    navigate("/crew/inventory/summary");
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleEdit = (index) => {
    const item = inventoryItems[index];
    setEditItem({
      id: item.id,
      index: index,
      productName: item.productName,
      category: item.category,
      serviceArea: item.serviceArea,
      stockQuantity: item.stockQuantity.toString(),
      price: item.price.toFixed(2),
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    setIsLoading(true);

    try {
      // Format the data for the API - make sure this matches your API's expected structure
      const updateData = {
        productName: editItem.productName,
        category: editItem.category,
        serviceArea: editItem.serviceArea,
        quantity: parseInt(editItem.stockQuantity),
        price: parseFloat(editItem.price),
      };

      console.log("Sending update with data:", updateData);

      // Call the API to update the item
      const result = await updateInventoryItem(editItem.id, updateData);

      if (result.success) {
        // Update the local state with the updated item
        const updatedItems = [...inventoryItems];
        const updatedItem = {
          id: editItem.id,
          productName: editItem.productName,
          category: editItem.category,
          serviceArea: editItem.serviceArea,
          stockQuantity: parseInt(editItem.stockQuantity),
          price: parseFloat(editItem.price),
        };

        updatedItems[editItem.index] = updatedItem;
        setInventoryItems(updatedItems);

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
      setIsLoading(false);
    }
  };

  const handleDelete = (index) => {
    const item = inventoryItems[index];
    setItemToDelete({
      id: item.id,
      index: index,
    });
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    setIsLoading(true);

    try {
      // Call the API to delete the item
      const result = await deleteInventoryItem(itemToDelete.id);

      if (result.success) {
        // Update the local state by removing the deleted item
        const updatedItems = inventoryItems.filter(
          (_, index) => index !== itemToDelete.index
        );
        setInventoryItems(updatedItems);

        // Show success message
        if (toast.current) {
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Product deleted successfully",
            life: 3000,
          });
        }
      } else {
        // Show error message
        if (toast.current) {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: result.error || "Failed to delete product",
            life: 3000,
          });
        }
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      if (toast.current) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "An unexpected error occurred while deleting the product",
          life: 3000,
        });
      }
    } finally {
      setIsLoading(false);
      setShowDeleteConfirmation(false);
    }
  };

  const handleAddProduct = () => {
    setShowAddModal(true);
  };

  const handleSaveProduct = async () => {
    // Validate form
    if (
      !newItem.productName ||
      !newItem.category ||
      !newItem.serviceArea ||
      !newItem.stockQuantity ||
      !newItem.price
    ) {
      if (toast.current) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Please fill in all required fields",
          life: 3000,
        });
      } else {
        alert("Please fill in all required fields");
      }
      return;
    }

    setIsLoading(true);

    try {
      // Call the API to create a new product
      const result = await createInventoryData({
        productName: newItem.productName,
        category: newItem.category,
        serviceArea: newItem.serviceArea,
        quantity: parseInt(newItem.stockQuantity),
        price: parseFloat(newItem.price),
      });

      if (result.success) {
        if (toast.current) {
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Product added successfully",
            life: 3000,
          });
        } else {
          alert("Product added successfully");
        }

        // Add the new product to the local state with data from API response
        const responseData = result.data.data;
        const product = {
          id: responseData._id,
          productName: responseData.product.name,
          category: responseData.product.category,
          serviceArea: responseData.product.serviceArea,
          stockQuantity: responseData.quantity,
          price: responseData.price,
        };

        setInventoryItems([...inventoryItems, product]);

        // Reset the form
        setNewItem({
          productName: "",
          category: "",
          serviceArea: "",
          stockQuantity: "",
          price: "",
        });

        setShowAddModal(false);
      } else {
        if (toast.current) {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: result.error || "Failed to add product",
            life: 3000,
          });
        } else {
          alert(result.error || "Failed to add product");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      if (toast.current) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail:
            "An unexpected error occurred: " +
            (error.message || "Unknown error"),
          life: 3000,
        });
      } else {
        alert(
          "An unexpected error occurred: " + (error.message || "Unknown error")
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (index) => {
    const item = inventoryItems[index];
    setViewItem({
      id: index,
      productName: item.productName,
      category: item.category,
      serviceArea: item.serviceArea,
      stockQuantity: item.stockQuantity.toString(),
      price: item.price.toFixed(2),
    });
    setShowViewModal(true);
  };

  // Render mobile card view for inventory items
  const renderMobileInventoryCards = () => {
    return (
      <div style={{ padding: "0 10px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "15px",
            marginTop: "10px",
          }}
        >
          <Button
            label="Add New Product"
            icon="pi pi-plus"
            onClick={handleAddProduct}
            style={{
              backgroundColor: "#0387D9",
              border: "none",
              borderRadius: "5px",
              color: "#fff",
              width: "100%",
              maxWidth: "250px",
            }}
          />
        </div>

        {inventoryItems.map((item, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "10px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                {item.productName}
              </h3>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
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
                  onClick={() => handleView(index)}
                />
                <img
                  src={editLogo}
                  alt="edit"
                  style={{
                    width: "18px",
                    height: "18px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleEdit(index)}
                />
                <img
                  src={deleteLogo}
                  alt="delete"
                  style={{
                    width: "18px",
                    height: "18px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleDelete(index)}
                />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px",
                fontSize: "14px",
              }}
            >
              <div>
                <span style={{ color: "#666" }}>Category: </span>
                <span>{item.category}</span>
              </div>
              <div>
                <span style={{ color: "#666" }}>Area: </span>
                <span>{item.serviceArea}</span>
              </div>
              <div>
                <span style={{ color: "#666" }}>Stock: </span>
                <span>{item.stockQuantity} units</span>
              </div>
              <div>
                <span style={{ color: "#666" }}>Price: </span>
                <span>${item.price.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render inventory items with loading state
  const renderInventoryItems = () => {
    if (isDataLoading) {
      return (
        <div
          className="loading-container"
          style={{ display: "flex", justifyContent: "center", padding: "2rem" }}
        >
          <ProgressSpinner
            style={{ width: "50px", height: "50px" }}
            strokeWidth="4"
            fill="var(--surface-ground)"
            animationDuration=".5s"
          />
        </div>
      );
    }

    if (inventoryItems.length === 0) {
      return (
        <div
          className="empty-state"
          style={{ textAlign: "center", padding: "2rem" }}
        >
          <p>No inventory items found. Add your first product!</p>
          <Button
            label="Add New Product"
            icon="pi pi-plus"
            onClick={handleAddProduct}
            style={{
              backgroundColor: "#0387D9",
              border: "none",
              borderRadius: "5px",
              marginTop: "1rem",
            }}
          />
        </div>
      );
    }
  };

  return (
    <>
      <div className="flex align-items-center justify-content-between sub-header-panel">
        <div className="sub-header-left sub-header-left-with-arrow">
          <div className="content">
            <h3>Inventory</h3>
          </div>
        </div>
      </div>

      <div className="inventory-container">
        {isMobile ? (
          // Mobile view
          renderMobileInventoryCards()
        ) : (
          // Desktop view
          <div className="inventory-summary">
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
                      width: "20%",
                      textAlign: "left",
                      padding: "10px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img
                        src={sort}
                        alt="sort"
                        style={{
                          width: "15px",
                          height: "15px",
                          marginRight: "5px",
                        }}
                      />
                      <p style={{ margin: 0, flex: 1, fontSize: "12px" }}>
                        Product Name
                      </p>
                    </div>
                  </th>
                  <th
                    style={{
                      width: "15%",
                      textAlign: "left",
                      padding: "10px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img
                        src={sort}
                        alt="sort"
                        style={{
                          width: "15px",
                          height: "15px",
                          marginRight: "5px",
                        }}
                      />
                      <p style={{ margin: 0, flex: 1, fontSize: "12px" }}>
                        Category
                      </p>
                    </div>
                  </th>
                  <th
                    style={{
                      width: "15%",
                      textAlign: "left",
                      padding: "10px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img
                        src={sort}
                        alt="sort"
                        style={{
                          width: "15px",
                          height: "15px",
                          marginRight: "5px",
                        }}
                      />
                      <p style={{ margin: 0, flex: 1, fontSize: "12px" }}>
                        Service Area
                      </p>
                    </div>
                  </th>
                  <th
                    style={{
                      width: "15%",
                      textAlign: "left",
                      padding: "10px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img
                        src={sort}
                        alt="sort"
                        style={{
                          width: "15px",
                          height: "15px",
                          marginRight: "5px",
                        }}
                      />
                      <p style={{ margin: 0, flex: 1, fontSize: "12px" }}>
                        Stock Quantity
                      </p>
                    </div>
                  </th>
                  <th
                    style={{
                      width: "15%",
                      textAlign: "left",
                      padding: "10px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img
                        src={sort}
                        alt="sort"
                        style={{
                          width: "15px",
                          height: "15px",
                          marginRight: "5px",
                        }}
                      />
                      <p style={{ margin: 0, flex: 1, fontSize: "12px" }}>
                        Price
                      </p>
                    </div>
                  </th>
                  <th
                    style={{
                      width: "15%",
                      textAlign: "left",
                      padding: "10px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img
                        src={sort}
                        alt="sort"
                        style={{
                          width: "15px",
                          height: "15px",
                          marginRight: "5px",
                        }}
                      />
                      <p style={{ margin: 0, flex: 1, fontSize: "12px" }}>
                        Manage
                      </p>
                    </div>
                  </th>
                  <th
                    style={{
                      width: "5%",
                      textAlign: "center",
                      padding: "10px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <input
                      type="checkbox"
                      style={{
                        margin: 0,
                        width: "14px",
                        height: "14px",
                      }}
                    />
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
                {inventoryItems.map((item, index) => (
                  <tr key={index}>
                    <td
                      style={{
                        width: "20%",
                        padding: "10px",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      {item.productName}
                    </td>
                    <td
                      style={{
                        width: "15%",
                        padding: "10px",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      {item.category}
                    </td>
                    <td
                      style={{
                        width: "15%",
                        padding: "10px",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      {item.serviceArea}
                    </td>
                    <td
                      style={{
                        width: "15%",
                        padding: "10px",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      {item.stockQuantity} units
                    </td>
                    <td
                      style={{
                        width: "15%",
                        padding: "10px",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      ${item.price.toFixed(2)}
                    </td>
                    <td
                      style={{
                        width: "15%",
                        padding: "10px",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
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
                          onClick={() => handleView(index)}
                        />
                        <img
                          src={editLogo}
                          alt="edit"
                          style={{
                            width: "18px",
                            height: "18px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleEdit(index)}
                        />
                        <img
                          src={deleteLogo}
                          alt="delete"
                          style={{
                            width: "18px",
                            height: "18px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleDelete(index)}
                        />
                      </div>
                    </td>
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
                        style={{
                          width: "12px",
                          height: "12px",
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              <Button
                label="Add New Product"
                icon="pi pi-plus"
                onClick={handleAddProduct}
                style={{
                  backgroundColor: "#0387D9",
                  border: "none",
                  borderRadius: "5px",
                }}
              />
            </div>
          </div>
        )}
      </div>

      {renderInventoryItems()}

      <Toast ref={toast} />

      <Dialog
        visible={showEditModal}
        onHide={() => setShowEditModal(false)}
        header="Edit Inventory Item"
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
              disabled={isLoading}
              style={{
                backgroundColor: "#EF4444",
                color: "#fff",
                width: "200px",
              }}
            />
            <Button
              label={isLoading ? "Updating..." : "Update Product"}
              icon="pi pi-check"
              onClick={handleUpdate}
              disabled={isLoading}
              style={{
                backgroundColor: "#0387D9",
                color: "#fff",
                width: "200px",
              }}
            />
          </div>
        </div>
      </Dialog>

      <Dialog
        visible={showAddModal}
        onHide={() => setShowAddModal(false)}
        header="Add New Product"
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
        <div className="add-form" style={{ overflow: "hidden" }}>
          <div className="form-row">
            <div
              className="form-group"
              style={{ display: "block", marginBottom: "15px" }}
            >
              <label htmlFor="productName">Product Name</label>
              <InputText
                id="productName"
                value={newItem.productName}
                onChange={(e) =>
                  setNewItem({ ...newItem, productName: e.target.value })
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
                value={newItem.category}
                onChange={(e) =>
                  setNewItem({ ...newItem, category: e.target.value })
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
              <label htmlFor="serviceArea">Service Area</label>
              <InputText
                id="serviceArea"
                value={newItem.serviceArea}
                onChange={(e) =>
                  setNewItem({ ...newItem, serviceArea: e.target.value })
                }
                style={{ width: "100%" }}
              />
            </div>
            <div
              className="form-group"
              style={{ display: "block", marginBottom: "15px" }}
            >
              <label htmlFor="stockQuantity">Stock Quantity</label>
              <InputText
                id="stockQuantity"
                type="number"
                value={newItem.stockQuantity}
                onChange={(e) =>
                  setNewItem({ ...newItem, stockQuantity: e.target.value })
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
                value={newItem.price}
                onChange={(e) =>
                  setNewItem({ ...newItem, price: e.target.value })
                }
                style={{ width: "100%" }}
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
              onClick={() => setShowAddModal(false)}
              className="p-button-text"
              style={{
                backgroundColor: "#EF4444",
                color: "#fff",
                width: "200px",
              }}
            />
            <Button
              label={isLoading ? "Saving..." : "Save Product"}
              icon="pi pi-check"
              onClick={handleSaveProduct}
              disabled={isLoading}
              style={{
                backgroundColor: "#0387D9",
                color: "#fff",
                width: "200px",
              }}
            />
          </div>
        </div>
      </Dialog>

      <Dialog
        visible={showDeleteConfirmation}
        onHide={() => setShowDeleteConfirmation(false)}
        header="Confirm Deletion"
        modal
        maskStyle={{
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          backdropFilter: "blur(4px)",
        }}
        footer={
          <div>
            <Button
              label="No"
              icon="pi pi-times"
              onClick={() => setShowDeleteConfirmation(false)}
              className="p-button-text"
              disabled={isLoading}
            />
            <Button
              label={isLoading ? "Deleting..." : "Yes"}
              icon="pi pi-check"
              onClick={confirmDelete}
              autoFocus
              className="p-button-danger"
              disabled={isLoading}
            />
          </div>
        }
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle"
            style={{ fontSize: "2rem", color: "#ff9800", marginRight: "10px" }}
          ></i>
          <span>Are you sure you want to delete this product?</span>
        </div>
      </Dialog>

      <Dialog
        visible={showViewModal}
        onHide={() => setShowViewModal(false)}
        header="Inventory Details"
        className="view-inventory-modal"
        modal
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        style={{ width: "30vw" }}
        maskStyle={{
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          backdropFilter: "blur(4px)",
        }}
      >
        <div
          className="view-form"
          style={{
            border: "1px solid #E0E0E9",
            borderRadius: "10px",
            padding: "20px",
          }}
        >
          <div className="form-row">
            <div
              className="form-group"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <label htmlFor="productName">Product Name</label>
              <div className="view-field">{viewItem.productName}</div>
            </div>
            <div
              className="form-group"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <label htmlFor="category">Category</label>
              <div className="view-field">{viewItem.category}</div>
            </div>
          </div>

          <div className="form-row">
            <div
              className="form-group"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <label htmlFor="serviceArea">Service Area</label>
              <div className="view-field">{viewItem.serviceArea}</div>
            </div>
            <div
              className="form-group"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <label htmlFor="stockQuantity">Stock Quantity</label>
              <div className="view-field">{viewItem.stockQuantity}</div>
            </div>
          </div>

          <div className="form-row">
            <div
              className="form-group"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <label htmlFor="price">Price</label>
              <div className="view-field">${viewItem.price}</div>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default Invent;
