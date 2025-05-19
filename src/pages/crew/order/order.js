import { React, useState, useEffect } from "react";
import ActiveOrders from "./active";
import OrderTable from "./table";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { useToast } from "../../../components/Toast";
import { useInventory } from "../../../context/inventory/inventoryContext";
import { createOrder } from "../../../services/order/orderService";
import neworder from "../../../assets/images/crew/neworder.png";

const Inventory = () => {
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useToast();
  const { allInventoryItems, fetchAllInventoryItems } = useInventory();

  const [supplierOptions, setSupplierOptions] = useState(null);
  const [productOptions, setProductOptions] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const statusOptions = [
    { label: "Pending", value: "pending" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Shipped", value: "shipped" },
    { label: "Delivered", value: "delivered" },
    { label: "Cancelled", value: "cancelled" },
  ];

  const [orderForm, setOrderForm] = useState({
    supplier: null,
    customerName: "",
    customerEmail: "",
    products: [{ id: null, quantity: 1 }],
    deliveryDate: null,
    additionalNotes: "",
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Process inventory items to get suppliers and products
  useEffect(() => {
    if (!allInventoryItems || allInventoryItems.length === 0) return;

    const suppliersMap = new Map();
    const productsMap = new Map();

    allInventoryItems.forEach((item) => {
      if (item.supplier) suppliersMap.set(item.supplier._id, item.supplier);
      if (item.product) productsMap.set(item.product._id, item.product);
    });

    const supplierOptions = Array.from(suppliersMap.values()).map(
      (supplier) => ({
        label: supplier.businessName,
        value: supplier._id,
      })
    );

    const productOptions = Array.from(productsMap.values()).map((product) => ({
      label: product.name,
      value: product._id,
    }));

    setSupplierOptions(supplierOptions);
    setProductOptions(productOptions);
  }, [allInventoryItems]);

  // Auto-select supplier based on product
  useEffect(() => {
    if (selectedProduct) {
      const match = allInventoryItems.find(
        (item) => item.product?._id === selectedProduct
      );
      if (match?.supplier?._id) {
        setSelectedSupplier(match.supplier._id);
      }
    }
  }, [selectedProduct, allInventoryItems]);

  // Load inventory data when component mounts
  useEffect(() => {
    fetchAllInventoryItems();
  }, [fetchAllInventoryItems]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderForm({
      ...orderForm,
      [name]: value,
    });
  };

  const handleQuantityChange = (e) => {
    setOrderForm({
      ...orderForm,
      products: [
        {
          ...orderForm.products[0],
          quantity: parseInt(e.target.value) || 0,
        },
      ],
    });
  };

  const handleDateChange = (e) => {
    setOrderForm({
      ...orderForm,
      deliveryDate: e.value,
    });
  };

  const handleSubmit = async () => {
    if (
      !selectedSupplier ||
      !selectedProduct ||
      !orderForm.customerName ||
      !orderForm.customerEmail ||
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

      // Format the data for the standard order API
      const orderData = {
        supplierId: selectedSupplier,
        customerName: orderForm.customerName,
        customerEmail: orderForm.customerEmail,
        products: [
          {
            id: selectedProduct,
            quantity: parseInt(orderForm.products[0].quantity),
          },
        ],
        deliveryDate: orderForm.deliveryDate,
        additionalNotes: orderForm.additionalNotes || "",
      };

      console.log("Sending order data:", orderData);
      const response = await createOrder(orderData);
      console.log("Order response:", response);

      if (response.status) {
        showSuccess("Order created successfully");

        // Reset form
        setOrderForm({
          customerName: "",
          customerEmail: "",
          products: [{ id: null, quantity: 1 }],
          deliveryDate: null,
          additionalNotes: "",
        });
        setSelectedProduct(null);
        setSelectedSupplier(null);
        setShowOrderModal(false);
        
        // Refresh orders display (assuming there's a function for this)
        // fetchOrders();
      } else {
        showError(response.error || "Failed to create order");
      }
    } catch (error) {
      console.error("Error creating order:", error);
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
          <div
            className="content flex justify-content-between align-items-center"
            style={{ width: "100%" }}
          >
            <h3
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                marginLeft: "10px",
              }}
            >
              Orders Management
            </h3>
            <button
              className="btn btn-primary mr-4"
              style={{
                backgroundColor: "#0387D9",
                border: "1px solid #0387D9",
                color: "white",
                padding: "10px 20px",
                width: "130px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={() => setShowOrderModal(true)}
            >
              {" "}
              Create order{" "}
            </button>
          </div>
        </div>
      </div>
      <ActiveOrders />
      <OrderTable />

      {/* Order Creation Modal */}
      <Dialog
        visible={showOrderModal}
        onHide={() => setShowOrderModal(false)}
        style={{ width: isMobile ? "95vw" : "70vw" }}
        header="New Order"
        className="order-modal"
      >
        <div className="p-fluid">
          {/* Customer Name and Email */}
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
              <label htmlFor="customerEmail">Customer Email*</label>
              <InputText
                id="customerEmail"
                name="customerEmail"
                value={orderForm.customerEmail}
                onChange={handleInputChange}
                placeholder="Enter customer email"
              />
            </div>
          </div>

          {/* Supplier Name */}
          <div className="p-grid p-formgrid form-row">
            <div className="p-field">
              <label htmlFor="selectedProduct">Supplier Name*</label>
              <Dropdown
                id="selectedProduct"
                disabled={true}
                value={selectedSupplier}
                options={supplierOptions}
                style={{ height: "45px" }}
                onChange={(e) => setSelectedSupplier(e.target.value)}
                placeholder="supplier generated automatically"
              />
            </div>
          </div>

          {/* Quantity and Product Selection */}
          <div className="p-grid p-formgrid form-row">
            <div className="p-field">
              <label htmlFor="quantity">Quantity*</label>
              <InputText
                id="quantity"
                name="quantity"
                value={orderForm.products[0].quantity}
                onChange={handleQuantityChange}
                placeholder="Enter quantity"
                keyfilter="pint"
              />
            </div>
            <div className="p-field">
              <label htmlFor="selectedProduct">Select Product*</label>
              <Dropdown
                id="selectedProduct"
                value={selectedProduct}
                options={productOptions}
                style={{ height: "45px" }}
                onChange={(e) => setSelectedProduct(e.target.value)}
                placeholder="Select a product"
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
                onChange={(e) => {
                  setOrderForm({
                    ...orderForm,
                    orderStatus: e.value,
                  });
                }}
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
            <label htmlFor="additionalNotes">Notes</label>
            <InputText
              id="additionalNotes"
              name="additionalNotes"
              value={orderForm.additionalNotes}
              onChange={handleInputChange}
              placeholder="Add notes (optional)"
            />
          </div>

          {/* Form Footer */}
          <div className="dialog-footer">
            <Button
              label="Cancel"
              onClick={() => setShowOrderModal(false)}
              className="p-button-danger"
              style={{ width: "200px", padding: "10px" }}
            />
            <Button
              label="Create Order"
              onClick={handleSubmit}
              style={{ width: "200px", padding: "10px" }}
              className="p-button-primary"
              loading={isLoading}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default Inventory;
