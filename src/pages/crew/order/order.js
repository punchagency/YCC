import { React, useState, useRef, useEffect } from "react";
import ActiveOrders from "./active";
import OrderTable from "./table";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Toast } from "primereact/toast";
import { createOrder } from "../../../services/crew/crewOrderService";

const Inventory = () => {
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const toast = useRef(null);

  // State for order form
  const [orderForm, setOrderForm] = useState({
    customerName: "",
    supplierId: null,
    products: [{ id: null, quantity: 1 }],
    deliveryDate: null,
    orderStatus: "Pending",
    notes: "",
  });

  // Sample data for dropdowns
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);

  // Status options
  const statusOptions = [
    { label: "Pending", value: "Pending" },
    { label: "Processing", value: "Processing" },
    { label: "Shipped", value: "Shipped" },
    { label: "Delivered", value: "Delivered" },
    { label: "Cancelled", value: "Cancelled" },
  ];

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch suppliers and products on component mount
  useEffect(() => {
    // Fetch suppliers and products from API
    // This is a placeholder - replace with actual API calls
    setSuppliers([
      { label: "Supplier 1", value: "1" },
      { label: "Supplier 2", value: "2" },
      { label: "Supplier 3", value: "3" },
    ]);

    setProducts([
      { label: "Product 1", value: "1" },
      { label: "Product 2", value: "2" },
      { label: "Product 3", value: "3" },
    ]);
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle dropdown changes
  const handleDropdownChange = (e, field) => {
    setOrderForm((prev) => ({
      ...prev,
      [field]: e.value,
    }));
  };

  // Handle product selection
  const handleProductChange = (e, index) => {
    const updatedProducts = [...orderForm.products];
    updatedProducts[index].id = e.value;
    setOrderForm((prev) => ({
      ...prev,
      products: updatedProducts,
    }));
  };

  // Handle product quantity change
  const handleQuantityChange = (e, index) => {
    const updatedProducts = [...orderForm.products];
    updatedProducts[index].quantity = parseInt(e.target.value) || 0;
    setOrderForm((prev) => ({
      ...prev,
      products: updatedProducts,
    }));
  };

  // Handle date change
  const handleDateChange = (e) => {
    setOrderForm((prev) => ({
      ...prev,
      deliveryDate: e.value,
    }));
  };

  // Show success toast
  const showSuccess = (message) => {
    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: message,
      life: 3000,
    });
  };

  // Show error toast
  const showError = (message) => {
    toast.current.show({
      severity: "error",
      summary: "Error",
      detail: message,
      life: 3000,
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (
      !orderForm.supplierId ||
      !orderForm.products[0].id ||
      !orderForm.customerName ||
      !orderForm.deliveryDate
    ) {
      showError("Please fill in all required fields");
      return;
    }

    if (orderForm.products[0].quantity === 0) {
      showError("Quantity cannot be 0");
      return;
    }

    try {
      setIsLoading(true);

      // Format the data for the API
      const orderData = {
        supplierId: orderForm.supplierId,
        customerName: orderForm.customerName,
        products: orderForm.products,
        deliveryDate: orderForm.deliveryDate,
        status: orderForm.orderStatus,
        additionalNotes: orderForm.notes || "",
      };

      console.log("Sending order data:", orderData);
      const response = await createOrder(orderData);
      console.log("Order response:", response);

      if (response.status) {
        showSuccess("Order created successfully");

        // Reset form
        setOrderForm({
          customerName: "",
          supplierId: null,
          products: [{ id: null, quantity: 1 }],
          deliveryDate: null,
          orderStatus: "Pending",
          notes: "",
        });

        setShowOrderModal(false);
        // Refresh orders table
        // If you have a refresh function, call it here
      } else {
        showError(response.error || "Failed to create order");
      }
    } catch (error) {
      showError(error.message || "An unexpected error occurred");
    } finally {
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
          <div className="content flex align-items-center justify-content-between">
            <h3
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                marginLeft: "10px",
              }}
            >
              Orders Management
            </h3>
            <button
              className=""
              style={{
                backgroundColor: "#0387D9",
                color: "white",
                width: "150px",
                padding: "10px  0px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                marginRight: "10px",
              }}
              onClick={() => setShowOrderModal(true)}
            >
              <i className="pi pi-plus" style={{ marginRight: "4px" }}></i>
              <span>New Order</span>
            </button>
          </div>
        </div>
      </div>
      <ActiveOrders />
      <OrderTable />

      {/* New Order Modal */}
      <Dialog
        visible={showOrderModal}
        onHide={() => setShowOrderModal(false)}
        style={{ width: isMobile ? "95vw" : "70vw" }}
        header="New Order"
        className="order-modal"
      >
        <div className="p-fluid">
          {/* Customer Name and Supplier Name */}
          <div className="p-grid p-formgrid form-row">
            <div className="p-field">
              <label htmlFor="customerName">Customer Name*</label>
              <InputText
                id="customerName"
                name="customerName"
                value={orderForm.customerName}
                onChange={handleInputChange}
                placeholder="Enter customer name"
              />
            </div>
            <div className="p-field">
              <label htmlFor="supplierId">Supplier*</label>
              <Dropdown
                id="supplierId"
                value={orderForm.supplierId}
                options={suppliers}
                onChange={(e) => handleDropdownChange(e, "supplierId")}
                placeholder="Select supplier"
                style={{ height: "45px" }}
              />
            </div>
          </div>

          {/* Product Selection */}
          <div className="p-grid p-formgrid form-row">
            <div className="p-field">
              <label htmlFor="productId">Product*</label>
              <Dropdown
                id="productId"
                value={orderForm.products[0].id}
                options={products}
                onChange={(e) => handleProductChange(e, 0)}
                placeholder="Select product"
                style={{ height: "45px" }}
              />
            </div>
            <div className="p-field">
              <label htmlFor="quantity">Quantity*</label>
              <InputText
                id="quantity"
                type="number"
                value={orderForm.products[0].quantity}
                onChange={(e) => handleQuantityChange(e, 0)}
                placeholder="Enter quantity"
                min="1"
              />
            </div>
          </div>

          {/* Order Status and Delivery Date */}
          <div className="p-grid p-formgrid form-row">
            <div className="p-field">
              <label htmlFor="orderStatus">Order Status*</label>
              <Dropdown
                id="orderStatus"
                value={orderForm.orderStatus}
                options={statusOptions}
                style={{ height: "45px" }}
                onChange={(e) => handleDropdownChange(e, "orderStatus")}
                placeholder="Select status"
              />
            </div>
            <div className="p-field">
              <label htmlFor="deliveryDate">Delivery Date*</label>
              <Calendar
                id="deliveryDate"
                value={orderForm.deliveryDate}
                onChange={handleDateChange}
                showIcon
                placeholder="Select date"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="p-field">
            <label htmlFor="notes">Notes</label>
            <InputText
              id="notes"
              name="notes"
              value={orderForm.notes}
              onChange={handleInputChange}
              placeholder="Add notes (optional)"
            />
          </div>

          <div className="dialog-footer">
            <Button
              label="Cancel"
              onClick={() => setShowOrderModal(false)}
              className="p-button-danger"
              style={{ width: "200px", padding: "10px" }}
            />
            <Button
              label={isLoading ? "Creating..." : "Create Order"}
              onClick={handleSubmit}
              disabled={isLoading}
              style={{ width: "200px", padding: "10px" }}
              className="p-button-primary"
            />
          </div>
        </div>
      </Dialog>

      <Toast ref={toast} position="bottom-right" />
    </>
  );
};

export default Inventory;
