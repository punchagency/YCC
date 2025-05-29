import React, { useState, useEffect, useRef, useCallback } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
// import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
// import { Toast } from "primereact/toast";
// import { SwitchTransition, CSSTransition } from "react-transition-group";
import lockLogo from "../../assets/images/crew/lockLogo.png";
import dropdown from "../../assets/images/crew/dropdown.png";
import cart from "../../assets/images/crew/cart.png";
// import iconContainer from "../../assets/images/crew/iconContainer.png";
import neworder from "../../assets/images/crew/neworder.png";
import "./order.css"; // We'll create this CSS file for transitions
// import { getInventoryData } from "../../services/inventory/inventoryService";
import {
  createOrder,
  getOrders,
  deleteOrder,
  bulkDeleteOrders,
} from "../../services/order/orderService"; // Add this import
// import { DataTable } from "primereact/datatable";
// import { Column } from "primereact/column";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { useToast } from "../../components/Toast";
// import { TableSkeleton } from "../../components/TableSkeleton"; // Add this import
import { useTheme } from "../../context/theme/themeContext";
import { useInventory } from "../../context/inventory/inventoryContext";
import { getProductsWithVendors } from "../../services/crew/crewOrderService";
// import { Skeleton } from "primereact/skeleton";

const Order = () => {
  // const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [setShowOrderForm] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchingProducts, setFetchingProducts] = useState(false);
  const [productsWithVendors, setProductsWithVendors] = useState([]);
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

  const [supplierOptions, setSupplierOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // let allSuppliersMap = new Map();
  // let allProductsMap = new Map();

  // let allSupplierOptions = [];
  // let allProductOptions = [];

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
    supplierId: null,
    customerName: "",
    deliveryAddress: "",
    products: [{ id: null, quantity: 1, price: 0 }],
    deliveryDate: null,
    additionalNotes: "",
  });

  const resetForm = () => {
    setOrderForm({
      supplierId: null,
      customerName: "",
      deliveryAddress: "",
      products: [{ id: null, quantity: 1, price: 0 }],
      deliveryDate: null,
      additionalNotes: "",
    });
    setSelectedProduct(null);
    setSelectedSupplier(null);
  };

  const runCount = useRef(0);

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
    setLoading(false);
  }, [allInventoryItems]);

  useEffect(() => {
    if (selectedProduct) {
      console.log("selectedProduct", selectedProduct);
      const match = allInventoryItems.find(
        (item) => item.product?._id === selectedProduct
      );
      console.log("match", match);
      if (match?.supplier?._id) {
        setSelectedSupplier(match.supplier._id);
      }
    }
  }, [selectedProduct, allInventoryItems]);

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
        allInventoryItems: allInventoryItems.find(
          (item) => item.product?._id === e.value
        ),
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
    console.log("Starting order submission...");

    // Validate required fields
    if (
      !selectedSupplier ||
      !selectedProduct ||
      !orderForm.deliveryAddress ||
      !orderForm.deliveryDate
    ) {
      console.log("Missing required fields:", {
        supplier: selectedSupplier,
        product: selectedProduct,
        address: orderForm.deliveryAddress,
        date: orderForm.deliveryDate,
      });
      showError("Please fill in all required fields");
      return;
    }

    if (orderForm.products[0].quantity <= 0) {
      console.log("Invalid quantity:", orderForm.products[0].quantity);
      showError("Quantity must be greater than 0");
      return;
    }

    try {
      setIsLoading(true);
      console.log("Fetching product data...");

      // Get the selected product data
      const selectedProductData = productsWithVendors.find(
        (p) => p._id === selectedProduct || p.id === selectedProduct
      );

      if (!selectedProductData) {
        console.error("Selected product not found in productsWithVendors");
        showError("Selected product not found");
        return;
      }

      console.log("Selected product data:", selectedProductData);

      // Get price from the correct field
      const productPrice =
        selectedProductData.price ||
        selectedProductData.product?.price ||
        selectedProductData.stripePriceId
          ? 100
          : 0; // Default price if using Stripe

      console.log("Using product price:", productPrice);

      // Format the data for the API
      const orderData = {
        supplierId: selectedSupplier,
        customerName: orderForm.customerName || null,
        deliveryAddress: orderForm.deliveryAddress,
        products: [
          {
            id: selectedProduct,
            quantity: parseInt(orderForm.products[0].quantity),
            price: productPrice,
          },
        ],
        deliveryDate: orderForm.deliveryDate,
        additionalNotes: orderForm.additionalNotes || "",
      };

      console.log("Sending order data to API:", orderData);

      const response = await createOrder(orderData);
      console.log("Order creation response:", response);

      if (response.status) {
        console.log("Order created successfully");
        showSuccess("Order created successfully");
        resetForm();
        setShowOrderModal(false);
        fetchOrders();
      } else {
        console.error("Failed to create order:", response.error);
        showError(response.error || "Failed to create order");
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      showError(error.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // const goCrewDashboardPage = () => {
  //   navigate("/crew/dashboard");
  // };

  // const goInventorySummaryPage = () => {
  //   navigate("/crew/inventory/summary");
  // };

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
        <div
          className="table-container"
          style={{ backgroundColor: theme === "light" ? "#FFFFFF" : "#03141F" }}
        >
          <table
            className="orders-table"
            style={{
              backgroundColor: theme === "light" ? "#FFFFFF" : "#03141F",
            }}
          >
            <thead
              style={{
                backgroundColor: theme === "light" ? "#FFFFFF" : "#03141F",
              }}
            >
              <tr
                style={{
                  backgroundColor: theme === "light" ? "#FFFFFF" : "#03141F",
                }}
              >
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
              {orders &&
                orders.map((order) => (
                  <tr
                    key={order.id}
                    style={{
                      backgroundColor:
                        theme === "light" ? "#FFFFFF" : "#03141F",
                      cursor: "pointer",
                    }}
                    onClick={() => handleViewOrder(order)}
                  >
                    <td
                      data-label="Select"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order)}
                        onChange={(e) => {
                          const selected = e.target.checked;
                          setSelectedOrders(
                            selected
                              ? [...selectedOrders, order]
                              : selectedOrders.filter(
                                  (o) => o._id !== order._id
                                )
                          );

                          // If we're unchecking an item, also uncheck the "select all" checkbox
                          if (!selected && selectAll) {
                            setSelectAll(false);
                          }
                        }}
                      />
                    </td>
                    <td data-label="Customer Name">{order.customerName}</td>
                    <td data-label="Order Date">
                      {formatDate(order.orderDate)}
                    </td>
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
                    <span>Create New Orders</span>
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
  // const handleProductChange = (index, field, value) => {
  //   const updatedProducts = [...orderForm.products];
  //   updatedProducts[index][field] =
  //     field === "quantity" ? parseInt(value) : value;

  //   setOrderForm({
  //     ...orderForm,
  //     products: updatedProducts,
  //   });
  // };

  // Add function to add more products
  // const addProduct = () => {
  //   setOrderForm({
  //     ...orderForm,
  //     products: [...orderForm.products, { id: null, quantity: 1 }],
  //   });
  // };

  // Add function to remove products
  // const removeProduct = (index) => {
  //   if (orderForm.products.length > 1) {
  //     const updatedProducts = orderForm.products.filter((_, i) => i !== index);
  //     setOrderForm({
  //       ...orderForm,
  //       products: updatedProducts,
  //     });
  //   }
  // };

  const fetchOrders = useCallback(async () => {
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
  }, []);

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

  // Add useEffect to fetch inventory data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      await fetchAllInventoryItems(); // triggers setAllInventoryItems internally
      await fetchOrders(); // if needed
    };

    if (runCount.current < 1) {
      runCount.current += 1;
      fetchData();
    }
  }, [fetchAllInventoryItems, fetchOrders]);

  // const statusBodyTemplate = (rowData) => {
  //   return (
  //     <span className={`status-badge status-${rowData.status.toLowerCase()}`}>
  //       {rowData.status}
  //     </span>
  //   );
  // };

  // const actionBodyTemplate = (rowData) => {
  //   return (
  //     <div className="action-buttons">
  //       <Button icon="pi pi-eye" className="p-button-rounded p-button-text" />
  //       <Button
  //         icon="pi pi-pencil"
  //         className="p-button-rounded p-button-text"
  //       />
  //     </div>
  //   );
  // };

  const [selectAll, setSelectAll] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);

    if (checked) {
      // Select all orders
      setSelectedOrders(orders);
    } else {
      // Deselect all
      setSelectedOrders([]);
    }
  };

  const handleBulkDelete = () => {
    if (selectedOrders.length === 0) return;

    setOrderToDelete({
      multiple: true,
      ids: selectedOrders.map((order) => order._id),
    });
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    try {
      if (orderToDelete.multiple) {
        const result = await bulkDeleteOrders(orderToDelete.ids);

        if (result.success) {
          // Refresh the orders list
          fetchOrders();
          setSelectedOrders([]);
          setSelectAll(false);

          showSuccess(
            `Successfully deleted ${orderToDelete.ids.length} orders`
          );
        } else {
          showError(result.error || "Failed to delete orders");
        }
      } else {
        // Original single order deletion logic
        const result = await deleteOrder(orderToDelete._id);
        if (result.success) {
          fetchOrders();
          showSuccess("Order deleted successfully");
        } else {
          showError(result.error || "Failed to delete order");
        }
      }
    } catch (error) {
      console.error("Error deleting orders:", error);
      showError("An error occurred while deleting");
    } finally {
      setIsLoading(false);
      setShowDeleteConfirmation(false);
    }
  };

  // Add these state variables at the top with your other state variables
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);

  // Add this function to handle viewing order details
  const handleViewOrder = (order) => {
    console.log("Viewing order details:", order);
    setSelectedOrder(order);
    setShowOrderDetailsModal(true);
  };

  // Fetch products with vendors
  const fetchProductsWithVendors = useCallback(async () => {
    try {
      setFetchingProducts(true);
      console.log("Fetching products with vendors...");

      const response = await getProductsWithVendors();
      console.log("Products with vendors response:", response);

      if (response.status) {
        let products = [];
        if (response.data?.products) {
          products = response.data.products;
        } else if (Array.isArray(response.data)) {
          products = response.data;
        } else if (typeof response.data === "object") {
          const possibleArrays = Object.values(response.data).filter((val) =>
            Array.isArray(val)
          );
          if (possibleArrays.length > 0) {
            products = possibleArrays[0];
          }
        }

        if (products.length === 0) {
          console.warn("No products found in the response");
          showError("No products available");
          return;
        }

        setProductsWithVendors(products);

        // Transform products into dropdown options
        const productOpts = products.map((product) => {
          const label =
            product.name ||
            product.productName ||
            (product.product ? product.product.name : "Unknown Product");
          const value = product._id || product.id;
          return {
            label,
            value,
            data: product,
          };
        });

        setProductOptions(productOpts);

        // Extract unique suppliers from products
        const uniqueSuppliers = new Map();
        products.forEach((product) => {
          const creator = product.creator || product.supplier || product.vendor;
          if (creator && (creator._id || creator.id)) {
            const creatorId = creator._id || creator.id;
            uniqueSuppliers.set(creatorId, {
              label:
                creator.businessName ||
                creator.name ||
                creator.companyName ||
                "Unknown Supplier",
              value: creatorId,
              data: creator,
            });
          }
        });

        const supplierOpts = Array.from(uniqueSuppliers.values());
        setSupplierOptions(supplierOpts);
      } else {
        console.error("Failed to fetch products with vendors:", response.error);
        showError("Failed to load products");
      }
    } catch (error) {
      console.error("Error fetching products with vendors:", error);
      showError("An error occurred while loading products");
    } finally {
      setFetchingProducts(false);
    }
  }, []);

  // Fetch products when modal opens
  useEffect(() => {
    if (showOrderModal) {
      fetchProductsWithVendors();
    }
  }, [showOrderModal, fetchProductsWithVendors]);

  // Update product selection when selectedProduct changes
  useEffect(() => {
    if (selectedProduct) {
      console.log("Product selected:", selectedProduct);

      const updatedProducts = [...orderForm.products];
      updatedProducts[0].id = selectedProduct;

      // Find the selected product to get its price and auto-select supplier
      const selectedProductData = productsWithVendors.find(
        (p) => p._id === selectedProduct || p.id === selectedProduct
      );

      console.log("Found product data:", selectedProductData);

      if (selectedProductData) {
        // Get price from the correct field
        const productPrice =
          selectedProductData.price ||
          selectedProductData.product?.price ||
          selectedProductData.stripePriceId
            ? 100
            : 0; // Default price if using Stripe

        console.log("Product price:", productPrice);
        updatedProducts[0].price = productPrice;

        // Auto-select the supplier based on the product's creator/vendor
        const creator =
          selectedProductData.creator ||
          selectedProductData.supplier ||
          selectedProductData.vendor;
        if (creator) {
          const creatorId = creator._id || creator.id;
          if (creatorId) {
            console.log("Auto-selecting supplier:", creatorId);
            setSelectedSupplier(creatorId);
          }
        }

        setOrderForm((prev) => ({
          ...prev,
          products: updatedProducts,
        }));
      } else {
        console.warn("Product data not found for selected product");
      }
    }
  }, [selectedProduct, productsWithVendors]);

  return loading ? (
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
        <div className="sub-header-left sub-header-left-with-arrow flex justify-content-between align-items-center">
          <div className="content">
            <h3 style={{ marginLeft: "40px" }}>Orders</h3>
          </div>
          <div className="mr-3">
            <button
              onClick={() => setShowOrderModal(true)}
              className="create-order-button"
            >
              <img src={neworder} alt="neworder" />
              <span>Create New Order</span>
            </button>
          </div>
        </div>
      </div>

      <div
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
                      // backgroundColor:
                      //   theme === "light" ? "#FFFFFF" : "#03141F",
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
                      // backgroundColor:
                      //   theme === "light" ? "#FFFFFF" : "#03141F",
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
                      // backgroundColor:
                      //   theme === "light" ? "#FFFFFF" : "#03141F",
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
              <div
                className="table-container"
                style={{
                  backgroundColor: theme === "light" ? "#FFFFFF" : "#03141F",
                }}
              >
                <table
                  className="orders-table"
                  style={{
                    backgroundColor: theme === "light" ? "#FFFFFF" : "#03141F",
                  }}
                >
                  <thead
                    style={{
                      backgroundColor:
                        theme === "light" ? "#FFFFFF" : "#03141F",
                    }}
                  >
                    <tr
                      style={{
                        backgroundColor:
                          theme === "light" ? "#FFFFFF" : "#03141F",
                      }}
                    >
                      <th style={{ width: "5%" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleSelectAll}
                            style={{
                              margin: 0,
                              width: "16px",
                              height: "16px",
                            }}
                          />
                          {selectedOrders.length > 0 && (
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
                          backgroundColor:
                            theme === "light" ? "#FFFFFF" : "#03141F",
                        }}
                      >
                        Customer Name
                      </th>
                      <th
                        style={{
                          backgroundColor:
                            theme === "light" ? "#FFFFFF" : "#03141F",
                        }}
                      >
                        Order Date
                      </th>
                      <th
                        style={{
                          backgroundColor:
                            theme === "light" ? "#FFFFFF" : "#03141F",
                        }}
                      >
                        Tracking ID
                      </th>
                      <th
                        style={{
                          backgroundColor:
                            theme === "light" ? "#FFFFFF" : "#03141F",
                        }}
                      >
                        Order Total
                      </th>
                      <th
                        style={{
                          backgroundColor:
                            theme === "light" ? "#FFFFFF" : "#03141F",
                        }}
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders &&
                      orders.map((order) => (
                        <tr
                          key={order.id}
                          style={{
                            backgroundColor:
                              theme === "light" ? "#FFFFFF" : "#03141F",
                            cursor: "pointer",
                          }}
                          onClick={() => handleViewOrder(order)}
                        >
                          <td
                            data-label="Select"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              checked={selectedOrders.includes(order)}
                              onChange={(e) => {
                                const selected = e.target.checked;
                                setSelectedOrders(
                                  selected
                                    ? [...selectedOrders, order]
                                    : selectedOrders.filter(
                                        (o) => o._id !== order._id
                                      )
                                );

                                // If we're unchecking an item, also uncheck the "select all" checkbox
                                if (!selected && selectAll) {
                                  setSelectAll(false);
                                }
                              }}
                            />
                          </td>
                          <td data-label="Customer Name">
                            {order.customerName}
                          </td>
                          <td data-label="Order Date">
                            {formatDate(order.orderDate)}
                          </td>
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
                      ></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <Dialog
            visible={showOrderModal}
            onHide={() => {
              setShowOrderModal(false);
              resetForm();
            }}
            style={{ width: isMobile ? "95vw" : "70vw" }}
            header="New Order"
            className="order-modal"
            dismissableMask={true}
          >
            <div className="p-fluid" style={{ padding: "40px" }}>
              {/* Customer Name and Delivery Address */}
              <div className="p-grid p-formgrid form-row">
                <div className="p-field">
                  <label htmlFor="customerName">Customer Name</label>
                  <InputText
                    id="customerName"
                    name="customerName"
                    value={orderForm.customerName}
                    onChange={handleInputChange}
                    placeholder="Enter customer name (optional)"
                  />
                </div>
                <div className="p-field">
                  <label htmlFor="deliveryAddress">Delivery Address*</label>
                  <InputText
                    id="deliveryAddress"
                    name="deliveryAddress"
                    value={orderForm.deliveryAddress}
                    onChange={handleInputChange}
                    placeholder="Enter delivery address"
                  />
                </div>
              </div>

              {/* Supplier and Product Selection */}
              <div className="p-grid p-formgrid form-row">
                <div className="p-field">
                  <label htmlFor="supplierId">Supplier Name*</label>
                  <Dropdown
                    id="supplierId"
                    value={selectedSupplier}
                    options={supplierOptions}
                    style={{ height: "45px" }}
                    onChange={(e) => setSelectedSupplier(e.value)}
                    placeholder={
                      fetchingProducts
                        ? "Loading suppliers..."
                        : "Select a supplier"
                    }
                    disabled={fetchingProducts || selectedProduct !== null}
                    optionLabel="label"
                  />
                </div>
                <div className="p-field">
                  <label htmlFor="productId">Select Product*</label>
                  <Dropdown
                    id="productId"
                    value={selectedProduct}
                    options={productOptions}
                    style={{ height: "45px" }}
                    onChange={(e) => setSelectedProduct(e.value)}
                    placeholder={
                      fetchingProducts
                        ? "Loading products..."
                        : "Select a product"
                    }
                    disabled={fetchingProducts}
                    optionLabel="label"
                  />
                </div>
              </div>

              {/* Quantity and Delivery Date */}
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

              {/* Additional Notes */}
              <div className="p-field">
                <label htmlFor="additionalNotes">Additional Notes</label>
                <InputText
                  id="additionalNotes"
                  name="additionalNotes"
                  value={orderForm.additionalNotes}
                  onChange={handleInputChange}
                  placeholder="Add notes (optional)"
                />
              </div>

              <div className="dialog-footer">
                <Button
                  label="Cancel"
                  onClick={() => {
                    setShowOrderModal(false);
                    resetForm();
                  }}
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
        </div>

        <Dialog
          visible={showDeleteConfirmation}
          onHide={() => setShowDeleteConfirmation(false)}
          header="Confirm Deletion"
          dismissableMask={true}
          footer={
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <Button
                label="No"
                icon="pi pi-times"
                onClick={() => setShowDeleteConfirmation(false)}
                className="p-button-text"
              />
              <Button
                label="Yes"
                icon="pi pi-check"
                onClick={confirmDelete}
                loading={isLoading}
                className="p-button-danger"
              />
            </div>
          }
        >
          <div className="confirmation-content">
            <i
              className="pi pi-exclamation-triangle"
              style={{
                fontSize: "2rem",
                color: "#ff9800",
                marginRight: "10px",
              }}
            />
            <span>
              {orderToDelete?.multiple
                ? `Are you sure you want to delete ${orderToDelete.ids.length} selected orders? This action cannot be undone.`
                : "Are you sure you want to delete this order?"}
            </span>
          </div>
        </Dialog>

        <Dialog
          visible={showOrderDetailsModal}
          onHide={() => setShowOrderDetailsModal(false)}
          header="Order Details"
          style={{ width: isMobile ? "95vw" : "50vw" }}
          className="order-details-modal"
          dismissableMask={true}
        >
          {selectedOrder && (
            <div className="order-details-container">
              {/* Order ID and Status */}
              <div className="detail-header" style={{ marginBottom: "20px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h2 style={{ margin: 0 }}>
                    Order #{selectedOrder.orderNumber || selectedOrder._id}
                  </h2>
                  <span
                    style={{
                      padding: "6px 12px",
                      borderRadius: "4px",
                      backgroundColor:
                        selectedOrder.status === "delivered"
                          ? "#D1FAE5"
                          : selectedOrder.status === "shipped"
                          ? "#EFF6FF"
                          : selectedOrder.status === "confirmed"
                          ? "#FEF3C7"
                          : selectedOrder.status === "cancelled"
                          ? "#FEE2E2"
                          : "#F3F4F6",
                      color:
                        selectedOrder.status === "delivered"
                          ? "#065F46"
                          : selectedOrder.status === "shipped"
                          ? "#1E40AF"
                          : selectedOrder.status === "confirmed"
                          ? "#92400E"
                          : selectedOrder.status === "cancelled"
                          ? "#B91C1C"
                          : "#374151",
                      fontWeight: "500",
                      textTransform: "capitalize",
                    }}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
                <p style={{ margin: "5px 0 0 0", color: "#6B7280" }}>
                  Created on{" "}
                  {new Date(selectedOrder.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Order Details */}
              <div
                className="details-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                  marginBottom: "20px",
                }}
              >
                <div className="detail-item">
                  <h4
                    style={{
                      margin: "0 0 5px 0",
                      color: "#6B7280",
                      fontWeight: "500",
                      fontSize: "14px",
                    }}
                  >
                    Customer
                  </h4>
                  <p style={{ margin: 0, fontWeight: "500", fontSize: "16px" }}>
                    {selectedOrder.customerName}
                  </p>
                </div>

                {/* <div className="detail-item">
                  <h4 style={{ margin: "0 0 5px 0", color: "#6B7280", fontWeight: "500", fontSize: "14px" }}>Supplier</h4>
                  <p style={{ margin: 0, fontWeight: "500", fontSize: "16px" }}>{selectedOrder.supplier?.businessName || "Not specified"}</p>
                </div> */}

                <div className="detail-item">
                  <h4
                    style={{
                      margin: "0 0 5px 0",
                      color: "#6B7280",
                      fontWeight: "500",
                      fontSize: "14px",
                    }}
                  >
                    Order Date
                  </h4>
                  <p style={{ margin: 0, fontWeight: "500", fontSize: "16px" }}>
                    {new Date(selectedOrder.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="detail-item">
                  <h4
                    style={{
                      margin: "0 0 5px 0",
                      color: "#6B7280",
                      fontWeight: "500",
                      fontSize: "14px",
                    }}
                  >
                    Delivery Date
                  </h4>
                  <p style={{ margin: 0, fontWeight: "500", fontSize: "16px" }}>
                    {selectedOrder.deliveryDate
                      ? new Date(
                          selectedOrder.deliveryDate
                        ).toLocaleDateString()
                      : "Not specified"}
                  </p>
                </div>
              </div>

              {/* Products Section */}
              {/* <div className="products-section" style={{ marginBottom: "20px" }}>
                <h3 style={{ margin: "0 0 10px 0" }}>Products</h3>
                <div className="products-table" style={{ border: "1px solid #E5E7EB", borderRadius: "8px", overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
                        <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "14px", color: "#374151" }}>Product</th>
                        <th style={{ padding: "12px 16px", textAlign: "right", fontSize: "14px", color: "#374151" }}>Quantity</th>
                        <th style={{ padding: "12px 16px", textAlign: "right", fontSize: "14px", color: "#374151" }}>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.products && selectedOrder.products.map((product, index) => (
                        <tr key={index} style={{ borderBottom: index < selectedOrder.products.length - 1 ? "1px solid #E5E7EB" : "none" }}>
                          <td style={{ padding: "12px 16px", fontSize: "14px" }}>
                            {product.product?.name || "Unknown Product"}
                          </td>
                          <td style={{ padding: "12px 16px", fontSize: "14px", textAlign: "right" }}>
                            {product.quantity || 1}
                          </td>
                          <td style={{ padding: "12px 16px", fontSize: "14px", textAlign: "right" }}>
                            {product.price ? `$${product.price.toFixed(2)}` : "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div> */}

              {/* Notes Section */}
              {selectedOrder.notes && (
                <div className="notes-section">
                  <h3 style={{ margin: "0 0 10px 0" }}>Notes</h3>
                  <div
                    style={{
                      padding: "12px 16px",
                      backgroundColor: "#F9FAFB",
                      borderRadius: "8px",
                      fontSize: "14px",
                      color: "#374151",
                    }}
                  >
                    {selectedOrder.notes}
                  </div>
                </div>
              )}
            </div>
          )}
        </Dialog>
      </div>
    </>
  );
};

export default Order;
