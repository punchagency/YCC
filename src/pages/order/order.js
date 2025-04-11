import React, { useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
// import { Toast } from "primereact/toast";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import lockLogo from "../../assets/images/crew/lockLogo.png";
import dropdown from "../../assets/images/crew/dropdown.png";
import cart from "../../assets/images/crew/cart.png";
import iconContainer from "../../assets/images/crew/iconContainer.png";
import neworder from "../../assets/images/crew/neworder.png";
import "./order.css"; // We'll create this CSS file for transitions
import { getInventoryData } from "../../services/inventory/inventoryService"; // Add this import
import { createOrder, getOrders } from "../../services/order/orderService"; // Add this import
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { useToast } from "../../components/Toast";
import { TableSkeleton } from "../../components/TableSkeleton"; // Add this import
import { useTheme } from "../../context/theme/themeContext";
import { useInventory } from "../../context/inventory/inventoryContext";
import { Skeleton } from "primereact/skeleton";

const Order = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState({
    allOrders: 0,
    pending: 0,
    completed: 0,
    cancelled: 0,
    returned: 0,
    damaged: 0,
  });
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const { theme } = useTheme();
  const { allInventoryItems, fetchAllInventoryItems } = useInventory();

  const [supplierOptions, setSupplierOptions] = useState(null);
  const [productOptions, setProductOptions] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

let allSuppliersMap = new Map();
let allProductsMap = new Map();


let allSupplierOptions = []
let allProductOptions = []

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
    supplier:null,
    customerName: "",
    products: [{ id: null, quantity: 1 }],
    deliveryDate: null,
    additionalNotes: "",
  });

  // Add useEffect to fetch inventory data when component mounts
  useEffect(() => {
    fetchInventoryData();
    fetchOrders();
    fetchAllInventoryItems();
  
    // Store full supplier and product objects in the maps
    allInventoryItems.forEach((item) => {
      if (item.supplier) allSuppliersMap.set(item.supplier._id, item.supplier); // Store entire supplier object
      if (item.product) allProductsMap.set(item.product._id, item.product); // Store entire product object
    });
  
    // Convert the maps to arrays, including both ID and name
    const allSupplierOptions = Array.from(allSuppliersMap.values()).map((supplier) => ({
      label: supplier.businessName,
      value: supplier._id, // Use _id as the value
    }));
  
    const allProductOptions = Array.from(allProductsMap.values()).map((product) => ({
      label: product.name,
      value: product._id, // Use _id as the value
    }));
  
    // Set the state for both dropdown options
    setSupplierOptions(allSupplierOptions);
    setProductOptions(allProductOptions);
  
  }, [allInventoryItems]);
  
    useEffect(() => {
      if (selectedSupplier) {
        const filteredProducts = allInventoryItems
          .filter(item => item.supplier?._id === selectedSupplier._id)
          .map(item => item.product);
    
        const uniqueProducts = Array.from(
          new Map(filteredProducts.map(p => [p._id, p])).values()
        );
    
        setProductOptions(uniqueProducts);
      } else {
        setProductOptions(allProductOptions);
      }
    }, [selectedSupplier]);
    
    useEffect(() => {
      if (selectedProduct) {
        const filteredSuppliers = allInventoryItems
          .filter(item => item.product?._id === selectedProduct._id)
          .map(item => item.supplier);
    
        const uniqueSuppliers = Array.from(
          new Map(filteredSuppliers.map(s => [s._id, s])).values()
        );
    
        setSupplierOptions(uniqueSuppliers);
      } else {
        setSupplierOptions(allSupplierOptions);
      }
    }, [selectedProduct]);
    



  // Function to fetch inventory data and format it for dropdown
  const fetchInventoryData = async () => {
    try {
      const result = await getInventoryData();
      //console.log("API Response:", result);

      if (result.success) {
        const inventoryData = result.data || [];
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

      } else {
        console.error("Failed to load inventory data:", result.error);
        {
          showError("Failed to load product data");
        }
      }
    } catch (error) {
      console.error("Error fetching inventory data:", error);
      {
        showError("An unexpected error occurred while loading product data");
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
        products: [
          {
            id: selectedProduct.productId, // Use the product ID instead of inventory ID
            inventoryId: e.value, // Store inventory ID if needed
            quantity: orderForm.products[0].quantity,
          },
        ],
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
      products: [
        {
          ...orderForm.products[0],
          quantity: parseInt(e.target.value) || 1,
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
      !orderForm.deliveryDate
    ) {
      showError("Please fill in all required fields");
      return;
    }

    try {
      setIsLoading(true);

      // Format the data for the API
      const orderData = {
        supplierId: selectedSupplier, // Replace with actual supplier ID
        customerName: orderForm.customerName,
        products: [
          {
            id: selectedProduct, // This is now the product ID
            quantity: parseInt(orderForm.products[0].quantity),
          },
        ],
        deliveryDate: orderForm.deliveryDate,
        additionalNotes: orderForm.additionalNotes || "",
      };

      console.log("Sending order data:", orderData);
   /*   const response = await createOrder(orderData);
      console.log("Order response:", response);

      if (response.success) {
        showSuccess("Order created successfully");

        // Reset form
        setOrderForm({
          customerName: "",
          products: [{ id: null, quantity: 1 }],
          deliveryDate: null,
          additionalNotes: "",
        });

        setShowOrderForm(false);
       
      } else {
        showError(response.error || "Failed to create order");
      }
        */
    } catch (error) {
      console.error("Error creating order:", error);
      showError("An unexpected error occurred");
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
                {summaryData.allOrders}
              </p>
            </div>
            <div>
              <p
                style={{ margin: "0 0 5px 0", fontSize: "13px", color: "#666" }}
              >
                Pending
              </p>
              <p style={{ margin: 0, fontSize: "16px", fontWeight: "bold" }}>
                {summaryData.pending}
              </p>
            </div>
            <div>
              <p
                style={{ margin: "0 0 5px 0", fontSize: "13px", color: "#666" }}
              >
                Completed
              </p>
              <p style={{ margin: 0, fontSize: "16px", fontWeight: "bold" }}>
                {summaryData.completed}
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
                Cancelled
              </p>
              <p style={{ margin: 0, fontSize: "16px", fontWeight: "bold" }}>
                {summaryData.cancelled}
              </p>
            </div>
            <div>
              <p
                style={{ margin: "0 0 5px 0", fontSize: "13px", color: "#666" }}
              >
                Returned
              </p>
              <p style={{ margin: 0, fontSize: "16px", fontWeight: "bold" }}>
                {summaryData.returned}
              </p>
            </div>
            <div>
              <p
                style={{ margin: "0 0 5px 0", fontSize: "13px", color: "#666" }}
              >
                Damaged
              </p>
              <p style={{ margin: 0, fontSize: "16px", fontWeight: "bold" }}>
                {summaryData.damaged}
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
        <div className="table-container" style={{backgroundColor:theme === "light" ? "#FFFFFF" : "#03141F"}}>
          <table className="orders-table" style={{backgroundColor:theme === "light" ? "#FFFFFF" : "#03141F"}}>
            <thead style={{backgroundColor:theme === "light" ? "#FFFFFF" : "#03141F"}}>
              <tr style={{backgroundColor:theme === "light" ? "#FFFFFF" : "#03141F"}}>
                <th>Select</th>
                <th>Customer Name</th>
                <th>Order Date</th>
                <th>Order Type</th>
                <th>Tracking ID</th>
                <th>Order Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>  
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td data-label="Select">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order)}
                      onChange={(e) => {
                        const selected = e.target.checked;
                        setSelectedOrders(
                          selected
                            ? [...selectedOrders, order]
                            : selectedOrders.filter((o) => o.id !== order.id)
                        );
                      }}
                    />
                  </td>
                  <td data-label="Customer Name">{order.customerName}</td>
                  <td data-label="Order Date">{formatDate(order.orderDate)}</td>
                  <td data-label="Order Type">{order.orderType}</td>
                  <td data-label="Tracking ID">
                    <div className="tracking-id">
                      <span>{order.orderId}</span>
                      <i className="pi pi-copy" />
                    </div>
                  </td>
                  <td data-label="Order Total">
                    {formatCurrency(order.totalPrice)}
                  </td>
                  <td data-label="Status">
                    <span
                      className={`status-badge status-${order.status.toLowerCase()}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td data-label="Actions">
                    <div className="action-buttons">
                      <button className="action-btn" title="View Details">
                        <i className="pi pi-eye" />
                      </button>
                      <button className="action-btn" title="Edit Order">
                        <i className="pi pi-pencil" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              <tr>
                <td
                  colSpan="8"
                  style={{
                    textAlign: "right",
                    border: "none",
                    padding: "16px 0",
                  }}
                >
                  <button
                    onClick={() => setShowOrderModal(true)}
                    className="create-order-button"
                  >
                    <img src={neworder} alt="neworder" />
                    <span>Create New Order</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // end of mobile view

  // Add functions to handle multiple products
  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...orderForm.products];
    updatedProducts[index][field] =
      field === "quantity" ? parseInt(value) : value;

    setOrderForm({
      ...orderForm,
      products: updatedProducts,
    });
  };

  // Add function to add more products
  const addProduct = () => {
    setOrderForm({
      ...orderForm,
      products: [...orderForm.products, { id: null, quantity: 1 }],
    });
  };

  // Add function to remove products
  const removeProduct = (index) => {
    if (orderForm.products.length > 1) {
      const updatedProducts = orderForm.products.filter((_, i) => i !== index);
      setOrderForm({
        ...orderForm,
        products: updatedProducts,
      });
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await getOrders();
      if (response.success) {
        setOrders(response.data.data.result);
        calculateSummary(response.data.data.result);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = (orders) => {
    const summary = orders.reduce(
      (acc, order) => {
        acc.allOrders++;
        acc[order.status.toLowerCase()]++;
        return acc;
      },
      {
        allOrders: 0,
        pending: 0,
        completed: 0,
        cancelled: 0,
        returned: 0,
        damaged: 0,
      }
    );
    setSummaryData(summary);
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <span className={`status-badge status-${rowData.status.toLowerCase()}`}>
        {rowData.status}
      </span>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="action-buttons">
        <Button icon="pi pi-eye" className="p-button-rounded p-button-text" />
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-text"
        />
      </div>
    );
  };

  return allInventoryItems.length === 0 ? (
    <div className="loading-container">
      <div className="loading-spinner"></div>
    </div>
  ) : (
    <>
      <div
        className="flex align-items-center justify-content-between sub-header-panel"
        style={{
          backgroundColor: theme === "light" ? "#FFFFFF" : "#03141F",
          color: theme === "light" ? "#103B57" : "#FFFFFF",
        }}
      >
        <div className="sub-header-left sub-header-left-with-arrow">
          <div className="content">
            <h3>Orders</h3>
          </div>
        </div>
      </div>

      <div
        style={{
          height: "100%",
          width: "100%",
          maxWidth: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: theme === "light" ? "#F8FBFF" : "#103B57",
          color: theme === "light" ? "#103B57" : "#FFFFFF",
        }}
      >
        <div>
          <div>
            <h4
              style={{
                textAlign: "left",
                paddingLeft: "10px",
                color: theme === "light" ? "#103B57" : "#FFFFFF",
              }}
            >
              Order Summary
            </h4>
          </div>

          {isMobile ? (
            // Mobile view for summary boxes
            renderMobileSummaryBoxes()
          ) : (
            // Desktop view

            <div className="orders-summary">
              <div style={{ padding: "0 10px" }}>
                {/* First summary box */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "white",
                      borderRadius: "8px",
                      padding: "15px",
                      marginBottom: "10px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      width: "100%",
                      marginRight: "10px",
                      backgroundColor:
                        theme === "light" ? "#FFFFFF" : "#03141F",
                        color: theme === "light" ? "#103B57" : "#FFFFFF",
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
                          style={{
                            width: "12px",
                            height: "12px",
                            marginLeft: "5px",
                          }}
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
                          style={{
                            margin: "0 0 5px 0",
                            fontSize: "13px",
                            color: "#666",
                          }}
                        >
                          All Orders
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                        >
                          {summaryData.allOrders}
                        </p>
                      </div>
                      <div>
                        <p
                          style={{
                            margin: "0 0 5px 0",
                            fontSize: "13px",
                            color: "#666",
                          }}
                        >
                          Pending
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                        >
                          {summaryData.pending}
                        </p>
                      </div>
                      <div>
                        <p
                          style={{
                            margin: "0 0 5px 0",
                            fontSize: "13px",
                            color: "#666",
                          }}
                        >
                          Completed
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                        >
                          {summaryData.completed}
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
                      width: "100%",
                      marginLeft: "10px",
                      backgroundColor:
                        theme === "light" ? "#FFFFFF" : "#03141F",
                        color: theme === "light" ? "#103B57" : "#FFFFFF",
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
                          style={{
                            width: "12px",
                            height: "12px",
                            marginLeft: "5px",
                          }}
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
                          style={{
                            margin: "0 0 5px 0",
                            fontSize: "13px",
                            color: "#666",
                          }}
                        >
                          Cancelled
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                        >
                          {summaryData.cancelled}
                        </p>
                      </div>
                      <div>
                        <p
                          style={{
                            margin: "0 0 5px 0",
                            fontSize: "13px",
                            color: "#666",
                          }}
                        >
                          Returned
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                        >
                          {summaryData.returned}
                        </p>
                      </div>
                      <div>
                        <p
                          style={{
                            margin: "0 0 5px 0",
                            fontSize: "13px",
                            color: "#666",
                          }}
                        >
                          Damaged
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                        >
                          {summaryData.damaged}
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
                      width: "100%",
                      marginLeft: "10px",
                      backgroundColor:
                        theme === "light" ? "#FFFFFF" : "#03141F",
                        color: theme === "light" ? "#103B57" : "#FFFFFF",

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
                          style={{
                            width: "12px",
                            height: "12px",
                            marginLeft: "5px",
                          }}
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
                        <p
                          style={{
                            margin: 0,
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                        >
                          0
                        </p>
                      </div>
                      <div>
                        <p
                          style={{
                            margin: "0 0 5px 0",
                            fontSize: "13px",
                            color: "#666",
                          }}
                        >
                          Customers
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                        >
                          0
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="table-container" style={{backgroundColor:theme === "light" ? "#FFFFFF" : "#03141F"}}>
                <table className="orders-table" style={{backgroundColor:theme === "light" ? "#FFFFFF" : "#03141F"}}>
                  <thead style={{backgroundColor:theme === "light" ? "#FFFFFF" : "#03141F"}}>
                    <tr style={{backgroundColor:theme === "light" ? "#FFFFFF" : "#03141F"}}>
                      {/* <th>Select</th> */}
                      <th style={{backgroundColor:theme === "light" ? "#FFFFFF" : "#03141F"}}>Customer Name</th>
                      <th style={{backgroundColor:theme === "light" ? "#FFFFFF" : "#03141F"}}>Order Date</th>
                      {/* <th>Order Type</th> */}
                      <th style={{backgroundColor:theme === "light" ? "#FFFFFF" : "#03141F"}}>Tracking ID</th>
                      <th style={{backgroundColor:theme === "light" ? "#FFFFFF" : "#03141F"}}>Order Total</th>
                      <th style={{backgroundColor:theme === "light" ? "#FFFFFF" : "#03141F"}}>Status</th>
                      <th style={{backgroundColor:theme === "light" ? "#FFFFFF" : "#03141F"}}>
                        <input type="checkbox" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} style={{backgroundColor:theme === "light" ? "#FFFFFF" : "#03141F"}}>
                        <td data-label="Customer Name">{order.customerName}</td>
                        <td data-label="Order Date">
                          {formatDate(order.orderDate)}
                        </td>
                        {/* <td data-label="Order Type">{order.orderType}</td> */}
                        <td data-label="Tracking ID">
                          <div className="tracking-id">
                            <span>{order.orderId}</span>
                            <i className="pi pi-copy" />
                          </div>
                        </td>
                        <td data-label="Order Total">
                          {formatCurrency(order.totalPrice)}
                        </td>
                        <td data-label="Status">
                          <span
                            className={`status-badge status-${order.status.toLowerCase()}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td data-label="Select">
                          <input
                            type="checkbox"
                            checked={selectedOrders.includes(order)}
                            onChange={(e) => {
                              const selected = e.target.checked;
                              setSelectedOrders(
                                selected
                                  ? [...selectedOrders, order]
                                  : selectedOrders.filter(
                                      (o) => o.id !== order.id
                                    )
                              );
                            }}
                          />
                        </td>
                        {/* <td data-label="Actions">
                          <div className="action-buttons">
                            <button className="action-btn" title="View Details">
                              <i className="pi pi-eye" />
                            </button>
                            <button className="action-btn" title="Edit Order">
                              <i className="pi pi-pencil" />
                            </button>
                          </div>
                        </td> */}
                      </tr>
                    ))}
                    <tr style={{ marginRight: "20px" }}>
                      <td
                        colSpan="6"
                        style={{
                          textAlign: "right",
                          border: "none",
                          padding: "16px 0",
                        }}
                      >
                        <button
                          onClick={() => setShowOrderModal(true)}
                          className="create-order-button"
                        >
                          <img src={neworder} alt="neworder" />
                          <span>Create New Order</span>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <Dialog
            visible={showOrderModal}
            onHide={() => setShowOrderModal(false)}
            style={{ width: isMobile ? "95vw" : "70vw" }}
            header="New Order"
            className="order-modal"
          >
            <div className="p-fluid">
              {/*  Customer Name and Supplier Name */}
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
                  <label htmlFor="selectedProduct">Supplier Name*</label>
                 {supplierOptions.length > 0 ? <Dropdown
                    id="selectedProduct"
                    value={selectedSupplier}
                    options={supplierOptions}
                    onChange={(e) => setSelectedSupplier(e.target.value)}
                    placeholder="Select a supplier"
                  /> : <Skeleton width="100%" height="40px" />}
                </div>
              </div>

              {/* Stock Quantity and Select Product */}
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
                  icon="pi pi-times"
                  onClick={() => setShowOrderModal(false)}
                  className="p-button-danger"
                />
                <Button
                  label="Create Order"
                  icon="pi pi-check"
                  onClick={() => {
                    handleSubmit();
                    setShowOrderModal(false);
                  }}
                  className="p-button-primary"
                />
              </div>
            </div>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default Order;
