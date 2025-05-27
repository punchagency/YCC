import React, { useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useNavigate, useParams, useLocation } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import {
  createInventoryData,
  getInventoryData,
  updateInventoryItem,
  deleteInventoryItem,
  getInventoryItemById,
} from "../../services/inventory/inventoryService";
// import lone from "../../assets/images/crew/lone.png";
// import upcomingLogo from "../../assets/images/crew/upcomingorderLogo.png";
// import iconexpire from "../../assets/images/crew/iconexpire.png";
// import iconcareer from "../../assets/images/crew/iconcareer.png";
// import { Chart as ChartJS } from "chart.js/auto";
// import { Bar, Doughnut, Line } from "react-chartjs-2";
// import sourceData from "../../data/sourceData.json";
// import analyticsData from "../../data/analyticsData.json";
import sort from "../../assets/images/crew/sort.png";
import editLogo from "../../assets/images/crew/editLogo.png";
import deleteLogo from "../../assets/images/crew/deleteLogo.png";
// import plus from "../../assets/images/crew/plus.png";
import eyesIn from "../../assets/images/crew/eyes-in.png";
// import { ProgressSpinner } from "primereact/progressspinner";
import { useTheme } from "../../context/theme/themeContext";
import { Paginator } from "primereact/paginator";
import { Dropdown } from "primereact/dropdown";

import { TableSkeleton } from "../../components/TableSkeleton";

const InventoryTableSkeleton = () => {
  const { theme } = useTheme();
  return (
    <div className="inventory-skeleton">
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            padding: "10px",
            borderBottom: "1px solid #eaecf0",
            backgroundColor: theme === "light" ? "#FFFFFF" : "#03141F",
          }}
        >
          {[...Array(7)].map((_, j) => (
            <div
              key={j}
              style={{
                flex: j === 0 ? "2" : "1",
                height: "20px",
                backgroundColor: theme === "light" ? "#f3f4f6" : "#1f2937",
                marginRight: "10px",
                borderRadius: "4px",
                animation: "pulse 1.5s infinite",
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

const Invent = () => {
  const toast = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { inventoryId } = useParams(); // Get inventory ID from URL params
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading] = useState(true);
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
    productImage: null,
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

  const { theme } = useTheme();

  // Add pagination state
  const [first, setFirst] = useState(0);
  const [rows] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPageLoading, setIsPageLoading] = useState(false);

  // Add these state variables at the top with your other state variables
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Add this state variable with your other state variables
  const [productImage, setProductImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Add a state to track whether we should update the URL
  const [shouldUpdateURL, setShouldUpdateURL] = useState(true);

  // Inside your component, define the service area options
  const serviceAreaOptions = [
    { label: "Caribbean", value: "caribbean" },
    { label: "Mediterranean", value: "mediterranean" },
    { label: "USA", value: "usa" },
  ];

  // Add this useEffect to handle URL parameters
  useEffect(() => {
    // Check if we have an inventory ID in the URL
    if (inventoryId) {
      fetchInventoryItemById(inventoryId);
    }
  }, [inventoryId]);

  // Fetch inventory data when component mounts
  useEffect(() => {
    fetchInventoryData(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function to fetch inventory data from API
  const fetchInventoryData = async (page = 1) => {
    setIsPageLoading(true);
    try {
      const result = await getInventoryData({ page });
      console.log(result);

      if (result.success) {
        const inventoryData = result.data || [];
        const formattedItems = inventoryData.map((item) => ({
          id: item._id,
          productName: item.product?.name || "Unknown Product",
          category: item.product?.category || "Uncategorized",
          serviceArea: item.product?.serviceArea || "Not specified",
          stockQuantity: item.quantity || 0,
          price: item.price || 0,
          productImage: item.productImage || null,
        }));

        setInventoryItems(formattedItems);
        setTotalRecords(result.pagination?.totalItems || 0);
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
    } finally {
      setIsPageLoading(false);
    }
  };

  // const goCrewDashboardPage = () => {
  //   navigate("/crew/dashboard");
  // };
  // const goInventorySummaryPage = () => {
  //   navigate("/crew/inventory/summary");
  // };

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
          productImage: editItem.productImage,
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

  const handleAddProduct = () => {
    setShowAddModal(true);
  };

  // Add this function to handle image selection
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProductImage(file);

      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Update the handleSaveProduct function to use FormData for image upload
  const handleSaveProduct = async () => {
    if (!newItem.productName || !newItem.category || !newItem.serviceArea) {
      if (toast.current) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Product name, category, and service area are required",
          life: 3000,
        });
      } else {
        alert("Product name, category, and service area are required");
      }
      return;
    }

    setIsLoading(true);

    try {
      // Create a FormData object for file upload
      const formData = new FormData();
      formData.append("productName", newItem.productName);
      formData.append("category", newItem.category);
      formData.append("serviceArea", newItem.serviceArea);
      formData.append("quantity", newItem.stockQuantity);
      formData.append("price", newItem.price);

      // Append the image file if one was selected
      if (productImage) {
        formData.append("inventoryImage", productImage);
        console.log("Adding image to form data:", productImage.name);
      }

      console.log("Submitting inventory with image:", !!productImage);

      const result = await createInventoryData(formData);

      if (result.success) {
        if (toast.current) {
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Inventory added successfully",
            life: 3000,
          });
        } else {
          alert("Inventory added successfully");
        }

        // Add the new product to the beginning of the array instead of the end
        const responseData = result.data.data;
        const product = {
          id: responseData._id,
          productName: responseData.product.name,
          category: responseData.product.category,
          serviceArea: responseData.product.serviceArea,
          stockQuantity: responseData.quantity,
          price: responseData.price,
          productImage: responseData.productImage || null,
        };

        setInventoryItems([product, ...inventoryItems]);

        // Reset the form including the image
        setNewItem({
          productName: "",
          category: "",
          serviceArea: "",
          stockQuantity: "",
          price: "",
        });
        setProductImage(null);
        setImagePreview(null);

        setShowAddModal(false);
      } else {
        if (toast.current) {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: result.error || "Failed to add inventory",
            life: 3000,
          });
        } else {
          alert(result.error || "Failed to add inventory");
        }
      }
    } catch (error) {
      console.error("Error adding inventory:", error);
      if (toast.current) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "An error occurred while adding inventory",
          life: 3000,
        });
      } else {
        alert("An error occurred while adding inventory");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Update the view item handler
  const handleViewItem = (item) => {
    setViewItem(item);
    setShowViewModal(true);
    
    // Only update URL if we should
    if (shouldUpdateURL) {
      navigate(`/admin/inventory-management/${item.id}`);
    }
  };

  // Simplified modal close handler
  const handleCloseViewModal = () => {
    // Disable URL updates temporarily to prevent race conditions
    setShouldUpdateURL(false);
    
    // Close the modal
    setShowViewModal(false);
    
    // Navigate after a short delay
    setTimeout(() => {
      navigate('/admin/inventory-management', { replace: true });
      
      // Re-enable URL updates after navigation
      setTimeout(() => {
        setShouldUpdateURL(true);
      }, 50);
    }, 50);
  };

  // Effect to handle URL parameters
  useEffect(() => {
    // If we have an ID in the URL and should update
    if (inventoryId && shouldUpdateURL) {
      fetchInventoryItemById(inventoryId);
    }
  }, [inventoryId, shouldUpdateURL]);
  
  // Effect to handle browser navigation
  useEffect(() => {
    // If we navigate away and the modal is open
    if (!inventoryId && showViewModal && shouldUpdateURL) {
      setShowViewModal(false);
    }
  }, [inventoryId, showViewModal, shouldUpdateURL]);

  // Update the onPageChange function to actually fetch data for the new page
  const onPageChange = (event) => {
    const newPage = Math.floor(event.first / rows) + 1;
    setCurrentPage(newPage);
    setFirst(event.first);
    
    // Show loading state
    setIsPageLoading(true);
    
    // Fetch data for the new page
    fetchInventoryData(newPage);
  };

  // Handle select all checkbox
  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);

    if (checked) {
      // Select all items
      const allItemIds = inventoryItems.map((item) => item.id);
      setSelectedItems(allItemIds);
    } else {
      // Deselect all
      setSelectedItems([]);
    }
  };

  // Handle individual item selection
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

  // Add bulk delete function
  const handleBulkDelete = () => {
    if (selectedItems.length === 0) return;

    setItemToDelete({
      multiple: true,
      ids: selectedItems,
    });
    setShowDeleteConfirmation(true);
  };

  // Modify the existing confirmDelete function to handle bulk deletion
  const confirmDelete = async () => {
    setIsLoading(true);
    try {
      if (itemToDelete.multiple) {
        // Here you would call your API to delete multiple items
        // For example:
        // const result = await deleteMultipleInventoryItems(itemToDelete.ids);

        // For now, let's just delete them one by one
        let successCount = 0;
        for (const id of itemToDelete.ids) {
          const result = await deleteInventoryItem(id);
          if (result.success) {
            successCount++;
          }
        }

        // Refresh the inventory list
        fetchInventoryData();
        setSelectedItems([]);
        setSelectAll(false);

        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: `Successfully deleted ${successCount} items`,
          life: 3000,
        });
      } else {
        // Original single item deletion logic
        const result = await deleteInventoryItem(itemToDelete.id);
        if (result.success) {
          const updatedItems = inventoryItems.filter(
            (_, index) => index !== itemToDelete.index
          );
          setInventoryItems(updatedItems);
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Product deleted successfully",
            life: 3000,
          });
        }
      }
    } catch (error) {
      console.error("Error deleting items:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "An error occurred while deleting",
        life: 3000,
      });
    } finally {
      setIsLoading(false);
      setShowDeleteConfirmation(false);
    }
  };

  // Function to fetch a single inventory item by ID
  const fetchInventoryItemById = async (id) => {
    try {
      setIsLoading(true);
      const result = await getInventoryItemById(id);
      
      if (result.success) {
        const item = {
          id: result.data._id,
          productName: result.data.product?.name || "Unknown Product",
          category: result.data.product?.category || "Uncategorized",
          serviceArea: result.data.product?.serviceArea || "Not specified",
          stockQuantity: result.data.quantity || 0,
          price: result.data.price || 0,
          productImage: result.data.productImage || null,
        };
        
        setViewItem(item);
        setShowViewModal(true);
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: result.error || "Failed to load inventory item",
          life: 3000,
        });
      }
    } catch (error) {
      console.error("Error fetching inventory item:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error loading inventory item",
        life: 3000,
      });
    } finally {
      setIsLoading(false);
    }
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
                  onClick={() => handleViewItem(item)}
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
      // return (
      //   <div
      //     className="loading-container"
      //     style={{ display: "flex", justifyContent: "center", padding: "2rem" }}
      //   >
      //     <ProgressSpinner
      //       style={{ width: "50px", height: "50px" }}
      //       strokeWidth="4"
      //       fill="var(--surface-ground)"
      //       animationDuration=".5s"
      //     />
      //   </div>
      // );
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

  // Add this style to your component
  const dropdownStyles = {
    border: "none",
    boxShadow: "none",
  };

  // Add this to your component's useEffect
  useEffect(() => {
    // Add custom styles to remove borders from dropdown
    const style = document.createElement("style");
    style.textContent = `
      .no-border-dropdown .p-dropdown {
        border: none !important;
        box-shadow: none !important;
      }
      
      .no-border-dropdown .p-dropdown:not(.p-disabled).p-focus {
        box-shadow: none !important;
        border-color: transparent !important;
      }
      
      .no-border-dropdown .p-dropdown-panel {
        border: 1px solid #ced4da;
      }
      
      /* Make the input field have only bottom border */
      .no-border-dropdown .p-dropdown .p-dropdown-label {
        border: none;
        border-bottom: 1px solid #ced4da;
        border-radius: 0;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <>
      <div
        className="flex align-items-center justify-content-between sub-header-panel"
        style={{}}
      >
        <div className="sub-header-left sub-header-left-with-arrow">
          <div className="content">
            <h3 style={{ margin: "0 0 10px 40px" }}>Inventory</h3>
          </div>
        </div>
      </div>

      <div
        className="inventory-wrapper"
        style={{
          height: "100%",
          width: "100%",
          maxWidth: "100%",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#F8FBFF",
        }}
      >
        <div className="inventory-container">
          {isLoading ? (
            <TableSkeleton showSummary={false} />
          ) : (
            <>
              {isMobile ? (
                // Mobile view
                renderMobileInventoryCards()
              ) : (
                // Desktop view
                <div
                  className="inventory-summary"
                  style={{
                    backgroundColor: theme === "light" ? "#FFFFFF" : "#03141F",
                    color: theme === "light" ? "#103B57" : "grey",
                  }}
                >
                  <table
                    className="inventory-header-table"
                    style={{
                      width: "100%",
                      tableLayout: "fixed",
                      borderCollapse: "collapse",
                      marginBottom: "0",
                      color: theme === "light" ? "#103B57" : "#F8FBFF",
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
                              />
                            )}
                          </div>
                        </th>
                        <th
                          style={{
                            width: "20%",
                            textAlign: "left",
                            padding: "10px",
                            borderBottom: "1px solid #eee",
                          }}
                        >
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
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
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
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
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
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
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
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
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
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
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
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
                      </tr>
                    </thead>
                  </table>

                  {isPageLoading ? (
                    <InventoryTableSkeleton />
                  ) : (
                    <>
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
                                    onClick={() => handleViewItem(item)}
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
                    </>
                  )}

                  {/* Add pagination after the table */}
                  <div
                    className="custom-pagination"
                    style={{
                      padding: "1rem",
                      display: "flex",
                      justifyContent: "flex-end",
                      borderTop: "1px solid #eaecf0",
                      marginTop: "1rem",
                    }}
                  >
                    <Paginator
                      first={first}
                      rows={rows}
                      totalRecords={totalRecords}
                      onPageChange={onPageChange}
                      template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                      style={{
                        backgroundColor:
                          theme === "light" ? "#FFFFFF" : "#03141F",
                        color: theme === "light" ? "#103B57" : "grey",
                      }}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {renderInventoryItems()}

      <Toast ref={toast} />

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
              className="form-group-1"
              style={{ display: "block", marginBottom: "15px", border: "none" }}
            >
              <label htmlFor="serviceArea">Service Area</label>
              <Dropdown
                id="serviceArea"
                value={newItem.serviceArea}
                options={serviceAreaOptions}
                onChange={(e) =>
                  setNewItem({ ...newItem, serviceArea: e.value })
                }
                placeholder="Select a service area"
                style={{
                  width: "100%",
                  height: "45px",
                  alignContent: "center",
                }}
                inputStyle={dropdownStyles}
                className="no-border-dropdown"
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
            className="form-row"
            style={{ display: "block", marginBottom: "15px" }}
          >
            <label htmlFor="productImage">Product Image</label>
            <div style={{ marginTop: "8px" }}>
              {imagePreview && (
                <div style={{ marginBottom: "10px" }}>
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "200px",
                      borderRadius: "4px",
                      border: "1px solid #ced4da",
                    }}
                  />
                  <Button
                    icon="pi pi-times"
                    className="p-button-rounded p-button-danger p-button-text"
                    onClick={() => {
                      setProductImage(null);
                      setImagePreview(null);
                    }}
                    style={{ position: "absolute", top: "5px", right: "5px" }}
                    tooltip="Remove image"
                  />
                </div>
              )}
              <input
                type="file"
                id="productImage"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
              <Button
                label={imagePreview ? "Change Image" : "Upload Image"}
                icon="pi pi-upload"
                onClick={() => document.getElementById("productImage").click()}
                className="p-button-outlined"
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
              onClick={() => setShowAddModal(false)}
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
              disabled={isLoading}
            />
            <Button
              label={isLoading ? "Deleting..." : "Yes"}
              style={{
                backgroundColor: "#0387D9",
                color: "#fff",
                border: "1px solid #0387D9",
                width: "100px",
                outline: "none",
              }}
              onClick={confirmDelete}
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
          <span>
            {itemToDelete?.multiple
              ? `Are you sure you want to delete ${selectedItems.length} selected items? This action cannot be undone.`
              : "Are you sure you want to delete this product?"}
          </span>
        </div>
      </Dialog>

      <Dialog
        visible={showViewModal}
        onHide={handleCloseViewModal}
        header="Inventory Summary"
        className="view-inventory-modal"
        style={{ width: '80%', maxWidth: '800px' }}
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
                {viewItem.price}
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
                {viewItem.stockQuantity}
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
    </>
  );
};

export default Invent;
