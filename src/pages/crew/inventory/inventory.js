import React, { useState, useRef } from "react";
import Table from "./table";
import plus from "../../../assets/images/crew/plus.png";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";

const Inventory = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newItem, setNewItem] = useState({
    productName: "",
    category: "",
    serviceArea: "",
    stockQuantity: 0,
    price: 0,
  });
  const [productImage, setProductImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const toast = useRef(null);

  const categories = [
    { label: "Food & Beverage", value: "Food & Beverage" },
    { label: "Cleaning Supplies", value: "Cleaning Supplies" },
    { label: "Safety Equipment", value: "Safety Equipment" },
    { label: "Nautical Equipment", value: "Nautical Equipment" },
    { label: "Decor & Furnishings", value: "Decor & Furnishings" },
  ];

  const serviceAreas = [
    { label: "Galley", value: "Galley" },
    { label: "Deck", value: "Deck" },
    { label: "Engine Room", value: "Engine Room" },
    { label: "Guest Areas", value: "Guest Areas" },
    { label: "Crew Areas", value: "Crew Areas" },
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

  const handleSaveProduct = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Success message
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
      });
      setProductImage(null);
      setImagePreview(null);

      setShowAddModal(false);
      setIsLoading(false);
    }, 1000);
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
      <Table />

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
        <div className="add-form" style={{ overflow: "hidden" }}>
          <div className="form-group mb-3">
            <label htmlFor="productName" className="form-label">
              Product Name
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
              Category
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
