import React, { useState, useRef } from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";

import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { TabView, TabPanel } from "primereact/tabview";
import { InputText } from "primereact/inputtext";
import lone from "../../assets/images/crew/lone.png";
import upcomingLogo from "../../assets/images/crew/upcomingorderLogo.png";
import iconexpire from "../../assets/images/crew/iconexpire.png";
import iconcareer from "../../assets/images/crew/iconcareer.png";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import sourceData from "../../data/sourceData.json";
import analyticsData from "../../data/analyticsData.json";
import lockLogo from "../../assets/images/crew/lockLogo.png";
import dropdown from "../../assets/images/crew/dropdown.png";
import cart from "../../assets/images/crew/cart.png";
import iconcontainer from "../../assets/images/crew/iconContainer.png";
import neworder from "../../assets/images/crew/neworder.png";
import buttonorder from "../../assets/images/crew/buttonorder.png";
import { Sidebar } from "primereact/sidebar";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import "./order.css"; // We'll create this CSS file for transitions

const Order = () => {
  const navigate = useNavigate();
  const toast = useRef(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderForm, setOrderForm] = useState({
    orderName: "",
    customerName: "",
    stockQuantity: "",
    selectedProduct: null,
    orderStatus: null,
    deliveryDate: null,
  });

  // Sample product options
  const productOptions = [
    { label: "Diesel Fuel", value: "diesel" },
    { label: "Engine Oil", value: "engine_oil" },
    { label: "First Aid Kit", value: "first_aid" },
    { label: "Life Jackets", value: "life_jackets" },
    { label: "Navigation Equipment", value: "navigation" },
  ];

  // Order status options
  const statusOptions = [
    { label: "Pending", value: "pending" },
    { label: "Processing", value: "processing" },
    { label: "Shipped", value: "shipped" },
    { label: "Delivered", value: "delivered" },
    { label: "Cancelled", value: "cancelled" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderForm({
      ...orderForm,
      [name]: value,
    });
  };

  const handleDropdownChange = (e, field) => {
    setOrderForm({
      ...orderForm,
      [field]: e.value,
    });
  };

  const handleDateChange = (e) => {
    setOrderForm({
      ...orderForm,
      deliveryDate: e.value,
    });
  };

  const handleSubmit = () => {
    // Validate form
    if (
      !orderForm.orderName ||
      !orderForm.customerName ||
      !orderForm.stockQuantity ||
      !orderForm.selectedProduct ||
      !orderForm.orderStatus ||
      !orderForm.deliveryDate
    ) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Please fill all required fields",
        life: 3000,
      });
      return;
    }

    // Process form submission
    console.log("Order submitted:", orderForm);
    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: "Order created successfully",
      life: 3000,
    });

    // Reset form
    setOrderForm({
      orderName: "",
      customerName: "",
      stockQuantity: "",
      selectedProduct: null,
      orderStatus: null,
      deliveryDate: null,
    });

    // Hide the form
    setShowOrderForm(false);
  };

  const goCrewDashboardPage = () => {
    navigate("/crew/dashboard");
  };

  const goInventorySummaryPage = () => {
    navigate("/crew/inventory/summary");
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
        <div className="box-order-container">
          <div className="box1-order">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0px 9px",
              }}
            >
              <div>
                <img src={lockLogo} alt="lockLogo" />
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <p style={{ marginRight: "5px" }}>This week</p>
                <img
                  src={dropdown}
                  alt="dropdown"
                  style={{ width: "15px", height: "15px" }}
                />
              </div>
            </div>
            <div className="pending-order-container">
              <div>
                <p>All Orders</p>
                <p>0</p>
              </div>
              <div>
                <p>Pending</p>
                <p>0</p>
              </div>
              <div>
                <p>Completed</p>
                <p>0</p>
              </div>
            </div>
          </div>
          <div className="box1-order">
            <div  
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0px 9px",
              }}
            >
              <div>
                <img src={lockLogo} alt="lockLogo" />
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <p style={{ marginRight: "5px" }}>This week</p>
                <img
                  src={dropdown}
                  alt="dropdown"
                  style={{ width: "15px", height: "15px" }}
                />
              </div>
            </div>
            <div className="pending-order-container">
              <div>
                <p>Canceled</p>
                <p>0</p>
              </div>
              <div>
                <p>Returned</p>
                <p>0</p>
              </div>
              <div>
                <p>Damaged</p>
                <p>0</p>
              </div>
            </div>
          </div>
          <div className="box1-order">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0px 9px",
              }}
            >
              <div>
                <img src={cart} alt="cart" />
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <p style={{ marginRight: "5px" }}>This week</p>
                <img
                  src={dropdown}
                  alt="dropdown"
                  style={{ width: "15px", height: "15px" }}
                />
              </div>
            </div>
            <div className="pending-order-container">
              <div>
                <p style={{ color: "#EF4444" }}>Abandoned Cart</p>
                <p>0</p>
              </div>
              <div>
                <p>Customers</p>
                <p>0</p>
              </div>
            </div>
          </div>
        </div>
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
                  padding: "20px",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                  margin: "20px 0",
                  width: "95%",
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
                      gap: "15px",
                      marginBottom: "20px",
                    }}
                  >
                    <div className="p-field" style={{ flex: 1 }}>
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
                    </div>
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
                      gap: "15px",
                      marginBottom: "20px",
                    }}
                  >
                    <div className="p-field" style={{ flex: 1 }}>
                      <label
                        htmlFor="stockQuantity"
                        style={{
                          display: "block",
                          marginBottom: "8px",
                          fontWeight: "500",
                          textAlign: "left",
                        }}
                      >
                        Stock Quantity*
                      </label>
                      <InputText
                        id="stockQuantity"
                        name="stockQuantity"
                        value={orderForm.stockQuantity}
                        onChange={handleInputChange}
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
                        value={orderForm.selectedProduct}
                        options={productOptions}
                        onChange={(e) =>
                          handleDropdownChange(e, "selectedProduct")
                        }
                        placeholder="Select a product"
                        style={{ width: "100%" }}
                        className="no-dropdown-scrollbar"
                      />
                    </div>
                  </div>

                  {/* Order Status and Delivery Date */}
                  <div
                    className="p-grid p-formgrid"
                    style={{
                      display: "flex",
                      gap: "15px",
                      marginBottom: "30px",
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
                        className="no-dropdown-scrollbar"
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

                  {/* Submit and Cancel Buttons */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
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
                        width: "150px",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "12px",
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
                        width: "150px",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "12px",
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-order-container">
                <div className="no-order-container-wrapper">
                  <div>
                    <img
                      src={iconcontainer}
                      alt="iconcontainer"
                      className="icon-container"
                    />
                  </div>
                  <div>
                    <h3>No Orders Yet?</h3>
                    <p>
                      Add products to your store and start selling to see orders
                    </p>
                    <button onClick={() => setShowOrderForm(true)}>
                      <img
                        src={neworder}
                        alt="neworder"
                        className="neworder-icon"
                      />{" "}
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
