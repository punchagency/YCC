import React, { useState, useRef, useEffect, useCallback } from "react";
import Table from "./table";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import {
  createCrewInventoryData,
  getCrewInventoryData,
} from "../../../services/crew/crewInventoryService";
import { useOutletContext } from "react-router-dom";
import "./inventory.css";

const Inventory = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [refreshTableFn, setRefreshTableFn] = useState(null);
  const [newItem, setNewItem] = useState({
    productName: "",
    category: "",
    serviceArea: "",
    stockQuantity: 0,
    price: 0,
    warehouseLocation: "",
  });
  const toast = useRef(null);

  const { setPageTitle } = useOutletContext() || {};
  useEffect(() => {
    if (setPageTitle) setPageTitle("Inventory");

    // Add event listener for create inventory button in title bar
    const handleCreateInventoryModal = () => {
      handleAddProduct();
    };

    window.addEventListener(
      "openCreateInventoryModal",
      handleCreateInventoryModal
    );

    return () => {
      window.removeEventListener(
        "openCreateInventoryModal",
        handleCreateInventoryModal
      );
    };
  }, [setPageTitle]);

  // const categories = [
  //   { label: "Food & Beverage", value: "Food & Beverage" },
  //   { label: "Cleaning Supplies", value: "Cleaning Supplies" },
  //   { label: "Safety Equipment", value: "Safety Equipment" },
  //   { label: "Nautical Equipment", value: "Nautical Equipment" },
  //   { label: "Decor & Furnishings", value: "Decor & Furnishings" },
  // ];

  const serviceAreaOptions = [
    { label: "Caribbean", value: "caribbean" },
    { label: "Mediterranean", value: "mediterranean" },
    { label: "USA", value: "usa" },
  ];

  // Add this style to your component
  const dropdownStyles = {
    border: "none",
    boxShadow: "none",
  };

  // Store the refresh function from Table component
  // Use useCallback to prevent creating a new function on every render
  const handleRefreshFunction = useCallback((refreshFn) => {
    setRefreshTableFn(() => refreshFn);
  }, []);

  // Function to fetch inventory data from API
  const fetchInventoryData = useCallback(async () => {
    try {
      const result = await getCrewInventoryData();

      if (result.success) {
        const inventoryData = result.data?.result || [];
        setInventoryItems(inventoryData);
      } else {
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
    }
  }, []);

  // Fetch inventory data when component mounts
  useEffect(() => {
    fetchInventoryData();
  }, [fetchInventoryData]);

  const handleAddProduct = () => {
    setShowAddModal(true);
  };

  const handleSaveProduct = async () => {
    // Validate required fields
    if (!newItem.productName || !newItem.category || !newItem.serviceArea) {
      toast.current.show({
        severity: "error",
        summary: "Required Fields",
        detail: "Product name, category, and service area are required",
        life: 3000,
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create a regular object instead of FormData
      const inventoryData = {
        productName: newItem.productName,
        category: newItem.category,
        serviceArea: newItem.serviceArea,
        quantity: Number(newItem.stockQuantity) || 0,
        price: Number(newItem.price) || 0,
      };

      // Add warehouse location if provided
      if (newItem.warehouseLocation) {
        inventoryData.warehouseLocation = newItem.warehouseLocation;
      }

      // Call the inventory service to create the inventory item
      const result = await createCrewInventoryData(inventoryData);

      if (result.success) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Product added successfully",
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

        setShowAddModal(false);

        // Refresh the table data
        if (refreshTableFn) {
          refreshTableFn();
        } else {
          // Fallback method to trigger refresh
          setRefreshTrigger((prev) => prev + 1);
        }
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: result.error || "Failed to add product",
          life: 3000,
        });
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "An unexpected error occurred",
        life: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Table
        inventoryItems={inventoryItems}
        onRefresh={handleRefreshFunction}
        refreshTrigger={refreshTrigger}
      />

      {/* Add Product Modal */}
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
        <div className="p-fluid">
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

          <div className="form-row">
            <div
              className="form-group"
              style={{ display: "block", marginBottom: "15px" }}
            >
              <label htmlFor="warehouseLocation">Warehouse Location</label>
              <InputText
                id="warehouseLocation"
                value={newItem.warehouseLocation}
                onChange={(e) =>
                  setNewItem({ ...newItem, warehouseLocation: e.target.value })
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

      <Toast ref={toast} position="bottom-right" />
    </>
  );
};

export default Inventory;
