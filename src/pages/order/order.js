import React, { useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Toast } from "primereact/toast";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import lockLogo from "../../assets/images/crew/lockLogo.png";
import dropdown from "../../assets/images/crew/dropdown.png";
import cart from "../../assets/images/crew/cart.png";
import iconContainer from "../../assets/images/crew/iconContainer.png";
import neworder from "../../assets/images/crew/neworder.png";
import "./order.css"; // We'll create this CSS file for transitions
import { getInventoryData } from "../../services/inventory/inventoryService"; // Add this import
import { createOrder } from "../../services/order/orderService"; // Add this import

const Order = () => {
  const navigate = useNavigate();
  const toast = useRef(null);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [productOptions, setProductOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Add back the status options
  const statusOptions = [
    { label: "Pending", value: "pending" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Shipped", value: "shipped" },
    { label: "Delivered", value: "delivered" },
    { label: "Cancelled", value: "cancelled" },
  ];

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [orderForm, setOrderForm] = useState({
    customerName: "",
    products: [{ id: null, quantity: 1 }],
    deliveryDate: null,
    additionalNotes: "",
  });

  // Add useEffect to fetch inventory data when component mounts
  useEffect(() => {
    fetchInventoryData();
  }, []);

  // Function to fetch inventory data and format it for dropdown
  const fetchInventoryData = async () => {
    try {
      const result = await getInventoryData();
      console.log("API Response:", result);
      
      if (result.success) {
        const inventoryData = result.data.data.result || [];
        if (!Array.isArray(inventoryData)) {
          console.error("Inventory data is not an array:", inventoryData);
          return;
        }

        // Transform inventory data into product options
        const options = inventoryData.map((item) => ({
          label: item.product?.name || "Unknown Product",
          value: item._id, // This is the inventory ID
          productId: item.product?._id, // Add the actual product ID
          price: item.price,
          quantity: item.quantity,
          category: item.product?.category,
          serviceArea: item.product?.serviceArea,
        }));
        
        setProductOptions(options);
      } else {
        console.error("Failed to load inventory data:", result.error);
        if (toast.current) {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: result.error || "Failed to load product data",
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
          detail: "An unexpected error occurred while loading product data",
          life: 3000,
        });
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderForm({
      ...orderForm,
      [name]: value,
    });
  };

  const handleDropdownChange = (e, field) => {
    if (field === "selectedProduct") {
      const selectedProduct = productOptions.find((p) => p.value === e.value);
      setOrderForm({
        ...orderForm,
        products: [{
          id: selectedProduct.productId, // Use the product ID instead of inventory ID
          inventoryId: e.value, // Store inventory ID if needed
          quantity: orderForm.products[0].quantity
        }]
      });
    } else {
      setOrderForm({
        ...orderForm,
        [field]: e.value,
      });
    }
  };

  const handleQuantityChange = (e) => {
    setOrderForm({
      ...orderForm,
      products: [{
        ...orderForm.products[0],
        quantity: parseInt(e.target.value) || 1
      }]
    });
  };

  const handleDateChange = (e) => {
    setOrderForm({
      ...orderForm,
      deliveryDate: e.value,
    });
  };

  const handleSubmit = async () => {
    // Validate form
    if (
      !orderForm.customerName ||
      !orderForm.products[0].id ||
      !orderForm.deliveryDate
    ) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Please fill in all required fields",
        life: 3000,
      });
      return;
    }

    try {
      setIsLoading(true);

      // Format the data for the API
      const orderData = {
        supplierId: "67ced03d4c641a3d1af80cc6", // Replace with actual supplier ID
        customerName: orderForm.customerName,
        products: [{
          id: orderForm.products[0].id, // This is now the product ID
          quantity: parseInt(orderForm.products[0].quantity)
        }],
        deliveryDate: orderForm.deliveryDate,
        additionalNotes: orderForm.additionalNotes || ""
      };

      console.log("Sending order data:", orderData);
      const response = await createOrder(orderData);
      console.log("Order response:", response);

      if (response.success) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Order created successfully",
          life: 3000,
        });

        // Reset form
        setOrderForm({
          customerName: "",
          products: [{ id: null, quantity: 1 }],
          deliveryDate: null,
          additionalNotes: "",
        });

        setShowOrderForm(false);
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: response.error || "Failed to create order",
          life: 3000,
        });
      }
    } catch (error) {
      console.error("Error creating order:", error);
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

  const goCrewDashboardPage = () => {
    navigate("/crew/dashboard");
  };

  const goInventorySummaryPage = () => {
    navigate("/crew/inventory/summary");
  };

  // Render mobile summary boxes
  const renderMobileSummaryBoxes = () => {
    return (
      <div style={{ padding: "0 10px" }}>
        {/* First summary box */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "10px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <img
              src={lockLogo}
              alt="lockLogo"
              style={{ width: "20px", height: "20px" }}
            />
            <div style={{ display: "flex", alignItems: "center" }}>
              <p style={{ margin: 0, fontSize: "14px" }}>This week</p>
              <img
                src={dropdown}
                alt="dropdown"
                style={{ width: "12px", height: "12px", marginLeft: "5px" }}
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              textAlign: "center",
            }}
          >
            <div>
              <p
                style={{ margin: "0 0 5px 0", fontSize: "13px", color: "#666" }}
              >
                All Orders
              </p>
              <p style={{ margin: 0, fontSize: "16px", fontWeight: "bold" }}>
                0
              </p>
            </div>
            <div>
              <p
                style={{ margin: "0 0 5px 0", fontSize: "13px", color: "#666" }}
              >
                Pending
              </p>
              <p style={{ margin: 0, fontSize: "16px", fontWeight: "bold" }}>
                0
              </p>
            </div>
            <div>
              <p
                style={{ margin: "0 0 5px 0", fontSize: "13px", color: "#666" }}
              >
                Completed
              </p>
              <p style={{ margin: 0, fontSize: "16px", fontWeight: "bold" }}>
                0
              </p>
            </div>
          </div>
        </div>

        {/* Second summary box */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "10px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <img
              src={lockLogo}
              alt="lockLogo"
              style={{ width: "20px", height: "20px" }}
            />
            <div style={{ display: "flex", alignItems: "center" }}>
              <p style={{ margin: 0, fontSize: "14px" }}>This week</p>
              <img
                src={dropdown}
                alt="dropdown"
                style={{ width: "12px", height: "12px", marginLeft: "5px" }}
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              textAlign: "center",
            }}
          >
            <div>
              <p
                style={{ margin: "0 0 5px 0", fontSize: "13px", color: "#666" }}
              >
                Canceled
              </p>
              <p style={{ margin: 0, fontSize: "16px", fontWeight: "bold" }}>
                0
              </p>
            </div>
            <div>
              <p
                style={{ margin: "0 0 5px 0", fontSize: "13px", color: "#666" }}
              >
                Returned
              </p>
              <p style={{ margin: 0, fontSize: "16px", fontWeight: "bold" }}>
                0
              </p>
            </div>
            <div>
              <p
                style={{ margin: "0 0 5px 0", fontSize: "13px", color: "#666" }}
              >
                Damaged
              </p>
              <p style={{ margin: 0, fontSize: "16px", fontWeight: "bold" }}>
                0
              </p>
            </div>
          </div>
        </div>

        {/* Third summary box */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "15px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <img
              src={cart}
              alt="cart"
              style={{ width: "20px", height: "20px" }}
            />
            <div style={{ display: "flex", alignItems: "center" }}>
              <p style={{ margin: 0, fontSize: "14px" }}>This week</p>
              <img
                src={dropdown}
                alt="dropdown"
                style={{ width: "12px", height: "12px", marginLeft: "5px" }}
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              textAlign: "center",
            }}
          >
            <div>
              <p
                style={{
                  margin: "0 0 5px 0",
                  fontSize: "13px",
                  color: "#EF4444",
                }}
              >
                Abandoned Cart
              </p>
              <p style={{ margin: 0, fontSize: "16px", fontWeight: "bold" }}>
                0
              </p>
            </div>
            <div>
              <p
                style={{ margin: "0 0 5px 0", fontSize: "13px", color: "#666" }}
              >
                Customers
              </p>
              <p style={{ margin: 0, fontSize: "16px", fontWeight: "bold" }}>
                0
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Add functions to handle multiple products
  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...orderForm.products];
    updatedProducts[index][field] = field === 'quantity' ? parseInt(value) : value;
    
    setOrderForm({
      ...orderForm,
      products: updatedProducts
    });
  };

  // Add function to add more products
  const addProduct = () => {
    setOrderForm({
      ...orderForm,
      products: [...orderForm.products, { id: null, quantity: 1 }]
    });
  };

  // Add function to remove products
  const removeProduct = (index) => {
    if (orderForm.products.length > 1) {
      const updatedProducts = orderForm.products.filter((_, i) => i !== index);
      setOrderForm({
        ...orderForm,
        products: updatedProducts
      });
    }
  };

  return (
    <>
      <Toast ref={toast} />

      <div className="flex align-items-center justify-content-between sub-header-panel">
        <div className="sub-header-left sub-header-left-with-arrow">
          <div className="content">
            <h3>Orders</h3>
          </div>
        </div>
      </div>

      <div>
        <div>
          <h4 style={{ textAlign: "left", paddingLeft: "10px" }}>
            Order Summary
          </h4>
        </div>

        {isMobile ? (
          // Mobile view for summary boxes
          renderMobileSummaryBoxes()
        ) : (
          // Desktop view
          <div className="box-order-container">
            {/* Original desktop boxes */}
          </div>
        )}

        <SwitchTransition mode="out-in">
          <CSSTransition
            key={showOrderForm ? "form" : "noOrders"}
            timeout={300}
            classNames="fade"
            unmountOnExit
          >
            {showOrderForm ? (
              <div
                className="order-form-container"
                style={{
                  padding: isMobile ? "15px" : "20px",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                  margin: "20px 0",
                  width: isMobile ? "95%" : "95%",
                  minHeight: "300px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignContent: "center",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <h3 style={{ margin: 0 }}>New Order</h3>
                  <Button
                    icon="pi pi-times"
                    className="p-button-rounded p-button-text"
                    onClick={() => setShowOrderForm(false)}
                    aria-label="Close"
                  />
                </div>

                <div className="p-fluid">
                  {/* Order Name and Customer Name */}
                  <div
                    className="p-grid p-formgrid"
                    style={{
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                      gap: "15px",
                      marginBottom: "20px",
                    }}
                  >
                    {/* <div className="p-field" style={{ flex: 1 }}>
                      <label
                        htmlFor="orderName"
                        style={{
                          display: "block",
                          marginBottom: "8px",
                          fontWeight: "500",
                          textAlign: "left",
                        }}
                      >
                        Product Name*
                      </label>
                      <InputText
                        id="orderName"
                        name="orderName"
                        value={orderForm.orderName}
                        onChange={handleInputChange}
                        placeholder="Enter order name"
                        style={{ width: "100%" }}
                      />
                    </div> */}
                    <div className="p-field" style={{ flex: 1 }}>
                      <label
                        htmlFor="customerName"
                        style={{
                          display: "block",
                          marginBottom: "8px",
                          fontWeight: "500",
                          textAlign: "left",
                        }}
                      >
                        Customer Name*
                      </label>
                      <InputText
                        id="customerName"
                        name="customerName"
                        value={orderForm.customerName}
                        onChange={handleInputChange}
                        placeholder="Enter customer name"
                        style={{ width: "100%" }}
                      />
                    </div>
                  </div>

                  {/* Stock Quantity and Select Product */}
                  <div
                    className="p-grid p-formgrid"
                    style={{
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                      gap: "15px",
                      marginBottom: "20px",
                    }}
                  >
                    <div className="p-field" style={{ flex: 1 }}>
                      <label
                        htmlFor="quantity"
                        style={{
                          display: "block",
                          marginBottom: "8px",
                          fontWeight: "500",
                          textAlign: "left",
                        }}
                      >
                        Quantity*
                      </label>
                      <InputText
                        id="quantity"
                        name="quantity"
                        value={orderForm.products[0].quantity}
                        onChange={handleQuantityChange}
                        placeholder="Enter quantity"
                        keyfilter="pint"
                        style={{ width: "100%" }}
                      />
                    </div>
                    <div className="p-field" style={{ flex: 1 }}>
                      <label
                        htmlFor="selectedProduct"
                        style={{
                          display: "block",
                          marginBottom: "8px",
                          fontWeight: "500",
                          textAlign: "left",
                        }}
                      >
                        Select Product*
                      </label>
                      <Dropdown
                        id="selectedProduct"
                        value={orderForm.products[0].inventoryId}
                        options={productOptions}
                        onChange={(e) => handleDropdownChange(e, "selectedProduct")}
                        placeholder="Select a product"
                        style={{ width: "100%" }}
                      />
                    </div>
                  </div>

                  {/* Order Status and Delivery Date */}
                  <div
                    className="p-grid p-formgrid"
                    style={{
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                      gap: "15px",
                      marginBottom: "20px",
                    }}
                  >
                    <div className="p-field" style={{ flex: 1 }}>
                      <label
                        htmlFor="orderStatus"
                        style={{
                          display: "block",
                          marginBottom: "8px",
                          fontWeight: "500",
                          textAlign: "left",
                        }}
                      >
                        Order Status*
                      </label>
                      <Dropdown
                        id="orderStatus"
                        value={orderForm.orderStatus}
                        options={statusOptions}
                        onChange={(e) => handleDropdownChange(e, "orderStatus")}
                        placeholder="Select status"
                        style={{ width: "100%" }}
                      />
                    </div>
                    <div className="p-field" style={{ flex: 1 }}>
                      <label
                        htmlFor="deliveryDate"
                        style={{
                          display: "block",
                          marginBottom: "8px",
                          fontWeight: "500",
                          textAlign: "left",
                        }}
                      >
                        Delivery Date*
                      </label>
                      <Calendar
                        id="deliveryDate"
                        value={orderForm.deliveryDate}
                        onChange={handleDateChange}
                        showIcon
                        placeholder="Select date"
                        style={{ width: "100%" }}
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="p-field">
                    <label
                      htmlFor="notes"
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: "500",
                        textAlign: "left",
                      }}
                    >
                      Notes
                    </label>
                    <InputText
                      id="notes"
                      name="notes"
                      value={orderForm.notes}
                      onChange={handleInputChange}
                      placeholder="Add notes (optional)"
                      style={{ width: "100%" }}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                      justifyContent: isMobile ? "center" : "flex-end",
                      gap: "15px",
                      marginTop: "20px",
                    }}
                  >
                    <Button
                      label="Cancel"
                      icon="pi pi-times"
                      onClick={() => setShowOrderForm(false)}
                      style={{
                        backgroundColor: "#EF4444",
                        border: "none",
                        width: isMobile ? "100%" : "150px",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "12px",
                        marginBottom: isMobile ? "10px" : "0",
                      }}
                    />
                    <Button
                      label="Create Order"
                      icon="pi pi-check"
                      onClick={() => {
                        handleSubmit();
                        setShowOrderForm(false);
                      }}
                      style={{
                        backgroundColor: "#0387D9",
                        border: "none",
                        width: isMobile ? "100%" : "150px",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "12px",
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="no-order-container"
                style={{
                  padding: isMobile ? "20px 10px" : "20px",
                  textAlign: "center",
                }}
              >
                <div
                  className="no-order-container-wrapper"
                  style={{
                    maxWidth: "400px",
                    margin: "0 auto",
                  }}
                >
                  <div>
                    <img
                      src={iconContainer}
                      alt="iconContainer"
                      className="icon-container"
                      style={{
                        width: isMobile ? "80px" : "100px",
                        marginBottom: "15px",
                      }}
                    />
                  </div>
                  <div>
                    <h3 style={{ margin: "0 0 10px 0" }}>No Orders Yet?</h3>
                    <p
                      style={{
                        margin: "0 0 20px 0",
                        fontSize: "14px",
                        color: "#666",
                      }}
                    >
                      Add products to your store and start selling to see orders
                    </p>
                    <button
                      onClick={() => setShowOrderForm(true)}
                      style={{
                        backgroundColor: "#0387D9",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "10px 20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        margin: "0 auto",
                        cursor: "pointer",
                        width: isMobile ? "100%" : "auto",
                      }}
                    >
                      <img
                        src={neworder}
                        alt="neworder"
                        className="neworder-icon"
                        style={{ width: "16px", height: "16px" }}
                      />
                      <span>Create New Order</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </CSSTransition>
        </SwitchTransition>
      </div>
    </>
  );
};

export default Order;
