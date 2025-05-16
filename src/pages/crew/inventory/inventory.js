import React, { useState, useRef, useEffect } from "react";
import Table from "./table";
import plus from "../../../assets/images/crew/plus.png";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";
import {
  getCrewInventory,
  createCrewInventory,
  bulkDeleteCrewInventory,
} from "../../../services/inventory/crewInventoryService";
import Stock from "./stock";

const Inventory = () => {
  // Add state for products to update table
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newItem, setNewItem] = useState({
    productName: "",
    category: "",
    serviceArea: "",
    stockQuantity: 0,
    price: 0,
    warehouseLocation: "",
  });
  const [productImage, setProductImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const toast = useRef(null);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    pageSize: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Get inventory data on component mount
  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async (params = {}) => {
    setLoading(true);
    try {
      // Merge with existing pagination params if not provided
      const requestParams = {
        page: params.page || pagination.currentPage,
        limit: params.limit || pagination.pageSize,
        sortField: params.sortField || "name",
        sortDirection: params.sortDirection || "asc",
      };

      const response = await getCrewInventory(requestParams);

      if (response.success) {
        // Format data from API to match table requirements
        const formattedProducts = response.data.map((item) => ({
          id: item._id,
          name: item.product ? item.product.name : "Unknown",
          category: item.product ? item.product.category : "Unknown",
          vendor: item.product ? item.product.serviceArea : "Unknown",
          quantity: item.quantity || 0,
          price: item.price || 0,
          image: item.productImage,
        }));

        setProducts(formattedProducts);

        // Update pagination information
        if (response.pagination) {
          setPagination(response.pagination);
        }
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: response.error || "Failed to fetch inventory data",
          life: 3000,
        });
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Could not retrieve inventory items",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInventory = async (inventoryIds) => {
    try {
      // Use service function instead of direct API call
      const response = await bulkDeleteCrewInventory(inventoryIds);

      if (response.success) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: response.message,
          life: 3000,
        });

        // Refresh inventory after deletion
        await fetchInventory();
      } else {
        throw new Error(response.error || "Failed to delete items");
      }
    } catch (error) {
      console.error("Error deleting inventory:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "Failed to delete inventory items",
        life: 3000,
      });
    }
  };

  const categories = [
    { label: "Food & Beverage", value: "Food & Beverage" },
    { label: "Cleaning Supplies", value: "Cleaning Supplies" },
    { label: "Safety Equipment", value: "Safety Equipment" },
    { label: "Nautical Equipment", value: "Nautical Equipment" },
    { label: "Decor & Furnishings", value: "Decor & Furnishings" },
  ];

  const serviceAreas = [
    { label: "caribbean", value: "caribbean" },
    { label: "mediterranean", value: "mediterranean" },
    { label: "usa", value: "usa" },
  ];

  const handleAddProduct = () => {
    setShowAddModal(true);
  };

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

  const handleCancel = () => {
    // Reset form
    setNewItem({
      productName: "",
      category: "",
      serviceArea: "",
      stockQuantity: 0,
      price: 0,
      warehouseLocation: "",
    });
    setProductImage(null);
    setImagePreview(null);
    setIsLoading(false);
    setShowAddModal(false);
  };

  const handleSaveProduct = async () => {
    // Validate required fields based on controller requirements
    if (!newItem.productName || !newItem.category || !newItem.serviceArea) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail:
          "Please fill in all required fields: Product Name, Category, and Service Area",
        life: 3000,
      });
      return;
    }

    setIsLoading(true);
    let timeoutId = null;

    try {
      // Create FormData object to handle file upload
      const formData = new FormData();
      formData.append("productName", newItem.productName);
      formData.append("category", newItem.category);
      formData.append("serviceArea", newItem.serviceArea);
      formData.append("quantity", newItem.stockQuantity);
      formData.append("price", newItem.price);

      if (newItem.warehouseLocation) {
        formData.append("warehouseLocation", newItem.warehouseLocation);
      }

      // Only append image if it exists
      if (productImage) {
        formData.append("inventoryImage", productImage);
      }

      // Force reset loading state after 20 seconds no matter what
      // This acts as a safety mechanism
      timeoutId = setTimeout(() => {
        console.log("Forcing reset of loading state after timeout");
        setIsLoading(false);
        setShowAddModal(false);
        toast.current.show({
          severity: "warning",
          summary: "Warning",
          detail: "Operation timed out. Please try again.",
          life: 3000,
        });
      }, 20000);

      // Call service function instead of direct API call
      const response = await createCrewInventory(formData);

      // Clear the safety timeout since we got a response
      if (timeoutId) clearTimeout(timeoutId);

      if (response.success) {
        // Show success message
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Product added successfully to inventory",
          life: 3000,
        });

        // Reset form
        setNewItem({
          productName: "",
          category: "",
          serviceArea: "",
          stockQuantity: 0,
          price: 0,
          warehouseLocation: "",
        });
        setProductImage(null);
        setImagePreview(null);

        // Close modal right after success
        setShowAddModal(false);

        // Refresh inventory data
        fetchInventory();
      } else {
        throw new Error(response.error || "Failed to add product");
      }
    } catch (error) {
      // Clear the safety timeout since we got an error response
      if (timeoutId) clearTimeout(timeoutId);

      console.error("Error adding product:", error);

      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "Failed to add product to inventory",
        life: 3000,
      });

      // Reset loading state even on error
      setIsLoading(false);
    }
  };

  
  return (
    <>
      <div className="flex align-items-center justify-content-between sub-header-panel">
        <div
          className="sub-header-left sub-header-left-with-arrow"
          style={{ width: "100%" }}
        >
          <div
            className="content flex align-items-center justify-content-between"
            style={{ width: "50rem" }}
          >
            <h3
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                marginLeft: "10px",
              }}
            >
              Inventory Management
            </h3>
            <div className="mr-5">
              <button
                className="flex align-items-center justify-content-center"
                style={{
                  borderRadius: "4px",
                  padding: "5px 10px",
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: "#0387D9",
                  color: "white",
                }}
                onClick={handleAddProduct}
              >
                <img src={plus} alt="plus" className="mr-2" />
                Add New Product
              </button>
            </div>
          </div>
        </div>
      </div>
      <Table
        products={products}
        loading={loading}
        onDelete={handleDeleteInventory}
        onRefresh={fetchInventory}
        pagination={pagination}
      />

      {/* Add Product Modal */}
      <Dialog
        visible={showAddModal}
        onHide={handleCancel}
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
          <div className="form-group mb-3">
            <label htmlFor="productName" className="form-label">
              Product Name *
            </label>
            <InputText
              id="productName"
              value={newItem.productName}
              onChange={(e) =>
                setNewItem({ ...newItem, productName: e.target.value })
              }
              className="w-full"
              placeholder="Enter product name"
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="category" className="form-label">
              Category *
            </label>
            <select
              id="category"
              value={newItem.category}
              onChange={(e) =>
                setNewItem({ ...newItem, category: e.target.value })
              }
              className="w-full"
              style={{
                padding: "0.75rem",
                borderRadius: "4px",
                border: "1px solid #ced4da",
                outline: "none",
                width: "100%",
                backgroundColor: "white",
              }}
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group mb-3">
            <label htmlFor="serviceArea" className="form-label">
              Service Area
            </label>
            <select
              id="serviceArea"
              value={newItem.serviceArea}
              onChange={(e) =>
                setNewItem({ ...newItem, serviceArea: e.target.value })
              }
              className="w-full"
              style={{
                padding: "0.75rem",
                borderRadius: "4px",
                border: "1px solid #ced4da",
                outline: "none",
                width: "100%",
                backgroundColor: "white",
              }}
            >
              <option value="" disabled>
                Select service area
              </option>
              {serviceAreas.map((area) => (
                <option key={area.value} value={area.value}>
                  {area.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="form-group ml-2">
              <label htmlFor="stockQuantity" className="form-label">
                Stock Quantity
              </label>
              <InputNumber
                id="stockQuantity"
                value={newItem.stockQuantity}
                onValueChange={(e) =>
                  setNewItem({ ...newItem, stockQuantity: e.value })
                }
                placeholder="0"
                className="w-full"
                min={0}
              />
            </div>
            <div className="form-group mr-2">
              <label htmlFor="price" className="form-label">
                Price ($)
              </label>
              <InputNumber
                id="price"
                value={newItem.price}
                onValueChange={(e) =>
                  setNewItem({ ...newItem, price: e.value })
                }
                mode="currency"
                currency="USD"
                locale="en-US"
                placeholder="$0.00"
                className="w-full"
                min={0}
              />
            </div>
          </div>

          <div className="form-group mb-3">
            <label htmlFor="warehouseLocation" className="form-label">
              Warehouse Location
            </label>
            <InputText
              id="warehouseLocation"
              value={newItem.warehouseLocation}
              onChange={(e) =>
                setNewItem({ ...newItem, warehouseLocation: e.target.value })
              }
              className="w-full"
              placeholder="Enter warehouse location (optional)"
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="productImage" className="form-label">
              Product Image
            </label>
            <div className="file-upload-container">
              <input
                type="file"
                id="productImage"
                onChange={handleImageChange}
                accept="image/*"
                style={{ display: "none" }}
              />
              <label
                htmlFor="productImage"
                className="custom-file-upload"
                style={{
                  border: "1px dashed #ccc",
                  display: "inline-block",
                  padding: "10px 20px",
                  cursor: "pointer",
                  borderRadius: "4px",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                {imagePreview ? "Change Image" : "Upload Image"}
              </label>
              {imagePreview && (
                <div
                  className="image-preview mt-2"
                  style={{ textAlign: "center" }}
                >
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      maxHeight: "150px",
                      maxWidth: "100%",
                      borderRadius: "4px",
                    }}
                  />
                </div>
              )}
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
              onClick={handleCancel}
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

      

      <Toast ref={toast} position="bottom-right" />
    </>
  );
};

export default Inventory;
