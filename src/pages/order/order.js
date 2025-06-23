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
} from "../../services/order/orderService";
import { getUserOrders } from "../../services/supplier/supplierService"; // Add this import
// import { DataTable } from "primereact/datatable";
// import { Column } from "primereact/column";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { useToast } from "../../components/Toast";
// import { TableSkeleton } from "../../components/TableSkeleton"; // Add this import
import { useTheme } from "../../context/theme/themeContext";
import { useInventory } from "../../context/inventory/inventoryContext";
import { getProductsWithVendors } from "../../services/crew/crewOrderService";
import { getSuppliersWithInventories } from "../../services/supplier/supplierService";
// import { Skeleton } from "primereact/skeleton";
import { useOutletContext } from "react-router-dom";

const Order = () => {
  console.log("=== Order Component Mounting ===");

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
    deliveryAddress: "",
    products: [{ id: null, quantity: 1 }],
    deliveryDate: null,
    additionalNotes: "",
  });

  const resetForm = () => {
    setOrderForm({
      supplierId: null,
      deliveryAddress: "",
      products: [{ id: null, quantity: 1 }],
      deliveryDate: null,
      additionalNotes: "",
    });
    setSelectedProduct(null);
    setSelectedSupplier(null);
  };

  const runCount = useRef(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Check for token
        const token = localStorage.getItem("token");
        if (!token) {
          showError("Please login to access this page");
          return;
        }

        console.log("=== Starting fetchAllInventoryItems ===");
        const response = await fetchAllInventoryItems();
        console.log("Raw API response:", response);

        // Check if response is valid
        if (!response) {
          console.error("No response received from fetchAllInventoryItems");
          showError("Failed to load inventory data");
          setLoading(false);
          return;
        }

        // Handle both array and object response formats
        let inventoryData;
        if (Array.isArray(response)) {
          inventoryData = response;
        } else if (response.data && Array.isArray(response.data)) {
          inventoryData = response.data;
        } else {
          console.error("Invalid inventory data format:", response);
          showError("Failed to load inventory data");
          setLoading(false);
          return;
        }

        console.log("Inventory data:", inventoryData);

        const suppliersMap = new Map();
        const productsMap = new Map();

        console.log("=== Processing inventory items ===");
        inventoryData.forEach((item, index) => {
          console.log(`Processing item ${index}:`, item);
          if (item?.supplier) {
            console.log(`Found supplier for item ${index}:`, item.supplier);
            suppliersMap.set(item.supplier._id, item.supplier);
          }
          if (item?.product) {
            console.log(`Found product for item ${index}:`, item.product);
            productsMap.set(item.product._id, item.product);
          }
        });

        console.log("=== Creating supplier options ===");
        const supplierOptions = Array.from(suppliersMap.values()).map(
          (supplier) => ({
            label: supplier.businessName,
            value: supplier._id,
          })
        );
        console.log("Supplier options:", supplierOptions);

        console.log("=== Creating product options ===");
        const productOptions = Array.from(productsMap.values()).map(
          (product) => ({
            label: product.name,
            value: product._id,
          })
        );
        console.log("Product options:", productOptions);

        setSupplierOptions(supplierOptions);
        setProductOptions(productOptions);
      } catch (error) {
        console.error("Error in fetchData:", error);
        console.error("Error details:", {
          message: error.message,
          stack: error.stack,
          response: error.response,
        });
        showError(error.message || "Failed to load inventory data");
      } finally {
        setLoading(false);
      }
    };

    if (runCount.current < 1) {
      runCount.current += 1;
      fetchData();
    }
  }, [fetchAllInventoryItems, showError]);

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
        (selectedProductData.stripePriceId ? 100 : 0); // Default price if using Stripe

      console.log("Using product price:", productPrice);

      // Format the data for the API
      const orderData = {
        supplierId: selectedSupplier,
        deliveryAddress: orderForm.deliveryAddress,
        products: [
          {
            id: selectedProduct,
            quantity: parseInt(orderForm.products[0].quantity),
            price: productPrice,
          },
        ],
        deliveryDate: orderForm.deliveryDate.toISOString().split("T")[0], // Format date as YYYY-MM-DD
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
                <th>Supplier Name</th>
                <th>Quantity</th>
                <th>Delivery Address</th>
                <th>Delivery Date</th>
                <th>Status</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {orders &&
                orders.map((order) => (
                  <tr
                    key={order._id}
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

                          if (!selected && selectAll) {
                            setSelectAll(false);
                          }
                        }}
                      />
                    </td>
                    <td data-label="Supplier Name">
                      {order.supplier?.businessName || "N/A"}
                    </td>
                    <td data-label="Quantity">
                      {order.products?.reduce(
                        (sum, product) => sum + product.quantity,
                        0
                      ) || 0}
                    </td>
                    <td data-label="Delivery Address">
                      {order.deliveryAddress}
                    </td>
                    <td data-label="Delivery Date">
                      {formatDate(order.deliveryDate)}
                    </td>
                    <td data-label="Status">
                      <span
                        className={`status-badge status-${order.status.toLowerCase()}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td data-label="Total Price">
                      {formatCurrency(order.totalPrice)}
                    </td>
                  </tr>
                ))}
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

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Use a ref to track if we've already fetched data
  const hasFetchedData = useRef(false);
  const [isFetching, setIsFetching] = useState(false);

  const fetchOrders = useCallback(
    async (page = 1, limit = 10) => {
      // Skip if already fetching or if this is a duplicate mount
      if (isFetching || (hasFetchedData.current && page === 1)) {
        console.log("Skipping fetch - already fetching or duplicate mount");
        return;
      }

      try {
        setIsFetching(true);
        setLoading(true);

        const response = await getUserOrders({
          page,
          limit,
        });

        if (response.status) {
          if (!Array.isArray(response.data)) {
            console.error("Invalid orders data received:", response.data);
            showError("Invalid orders data received from server");
            return;
          }

          const validOrders = response.data.filter((order) => {
            if (!order || typeof order !== "object") {
              console.warn("Invalid order object:", order);
              return false;
            }
            if (!order._id) {
              console.warn("Order missing _id:", order);
              return false;
            }
            return true;
          });

          setOrders(validOrders);
          setPagination({
            currentPage: response.pagination.currentPage,
            totalPages: response.pagination.totalPages,
            pageSize: response.pagination.pageSize,
            totalItems: response.pagination.totalItems,
            hasNextPage: response.pagination.hasNextPage,
            hasPrevPage: response.pagination.hasPrevPage,
          });
          calculateSummary(validOrders);

          // Mark that we've successfully fetched data
          if (page === 1) {
            hasFetchedData.current = true;
          }
        } else {
          if (response.unauthorized) {
            showError("Please login to continue");
            return;
          }
          showError(response.error || "Failed to fetch orders");
          setOrders([]);
          setPagination({
            currentPage: 1,
            totalPages: 1,
            pageSize: 10,
            totalItems: 0,
            hasNextPage: false,
            hasPrevPage: false,
          });
        }
      } catch (error) {
        console.error("Error in fetchOrders:", error);
        showError("Failed to fetch orders");
        setOrders([]);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          pageSize: 10,
          totalItems: 0,
          hasNextPage: false,
          hasPrevPage: false,
        });
      } finally {
        setLoading(false);
        setIsFetching(false);
      }
    },
    [showError, isFetching]
  );

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      // Skip if we've already fetched data
      if (hasFetchedData.current) {
        console.log("Skipping initial fetch - data already fetched");
        return;
      }

      try {
        await fetchAllInventoryItems();
        await fetchOrders();
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();

    // Cleanup function
    return () => {
      // Don't reset hasFetchedData here to prevent duplicate fetches on remount
      setIsFetching(false);
    };
  }, [fetchAllInventoryItems, fetchOrders]);

  // Add pagination controls
  const handlePageChange = (newPage) => {
    fetchOrders(newPage, pagination.pageSize);
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

  // Add useEffect to fetch inventory data when component mounts
  useEffect(() => {
    console.log("=== Initial useEffect Running ===");
    console.log("runCount.current:", runCount.current);

    const fetchData = async () => {
      if (isFetching) {
        console.log("Already fetching data, skipping...");
        return;
      }

      console.log("=== fetchData Starting ===");
      try {
        await fetchAllInventoryItems(); // triggers setAllInventoryItems internally
        console.log("fetchAllInventoryItems completed");

        await fetchOrders(); // if needed
        console.log("fetchOrders completed");
      } catch (error) {
        console.error("Error in fetchData:", error);
      }
    };

    // Reset runCount if orders array is empty
    if (orders.length === 0) {
      console.log("Orders array is empty, resetting runCount");
      runCount.current = 0;
    }

    // Fetch data if runCount is 0 or if orders array is empty
    if (runCount.current < 1 || orders.length === 0) {
      console.log(
        "Fetching data - runCount:",
        runCount.current,
        "orders length:",
        orders.length
      );
      runCount.current += 1;
      fetchData();
    } else {
      console.log(
        "Skipping fetchData - runCount:",
        runCount.current,
        "orders length:",
        orders.length
      );
    }
  }, [fetchAllInventoryItems, fetchOrders, orders.length, isFetching]);

  // Add a cleanup function to reset runCount when component unmounts
  useEffect(() => {
    return () => {
      console.log("Component unmounting, resetting runCount");
      runCount.current = 0;
      setIsFetching(false);
    };
  }, []);

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

  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [supplierPagination, setSupplierPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
  });

  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  // Add this function to handle infinite scroll
  const lastSupplierElementRef = useCallback(
    (node) => {
      if (loadingSuppliers) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchSuppliers(supplierPagination.currentPage + 1, true);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loadingSuppliers, hasMore]
  );

  // Modify the fetchSuppliers function to support infinite scroll
  const fetchSuppliers = async (page = 1, append = false) => {
    try {
      setLoadingSuppliers(true);
      const response = await getSuppliersWithInventories({
        page,
        limit: supplierPagination.pageSize,
      });

      if (response.status) {
        console.log("Received suppliers data:", response.data);
        const validatedSuppliers = response.data.map((supplier) => {
          console.log("Processing supplier:", supplier);
          return {
            _id: supplier?._id,
            businessName: supplier?.businessName || "Unnamed Business",
            user: {
              email: supplier?.user?.email || "No email available",
            },
            serviceAreas: supplier?.serviceAreas || [],
            department: supplier?.department || "No department",
            totalProducts: supplier?.totalProducts || 0,
            totalStock: supplier?.totalStock || 0,
            inventories:
              supplier?.inventories?.map((inv) => ({
                _id: inv?._id,
                product: {
                  _id: inv?.product?._id,
                  name: inv?.product?.name || "Unnamed Product",
                  category: inv?.product?.category || "No category",
                  sku: inv?.product?.sku || "No SKU",
                  description: inv?.product?.description,
                  serviceArea: inv?.product?.serviceArea,
                },
                price: inv?.price || 0,
                quantity: inv?.quantity || 0,
                productImage: inv?.productImage,
              })) || [],
          };
        });

        setSuppliers((prev) =>
          append ? [...prev, ...validatedSuppliers] : validatedSuppliers
        );
        setSupplierPagination(response.pagination);
        setHasMore(
          response.pagination.currentPage < response.pagination.totalPages
        );
      } else {
        showError(response.error || "Failed to fetch suppliers");
      }
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      showError("Failed to fetch suppliers");
    } finally {
      setLoadingSuppliers(false);
    }
  };

  // Add the Skeleton component
  const SupplierSkeleton = () => (
    <div
      className="supplier-card"
      style={{
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        marginBottom: "15px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#f5f5f5",
        animation: "pulse 1.5s infinite",
      }}
    >
      <div className="supplier-info">
        <div
          style={{
            height: "24px",
            width: "70%",
            backgroundColor: "#e0e0e0",
            marginBottom: "15px",
            borderRadius: "4px",
          }}
        />
        <div
          style={{
            height: "16px",
            width: "90%",
            backgroundColor: "#e0e0e0",
            marginBottom: "10px",
            borderRadius: "4px",
          }}
        />
        <div
          style={{
            height: "16px",
            width: "80%",
            backgroundColor: "#e0e0e0",
            marginBottom: "10px",
            borderRadius: "4px",
          }}
        />
        <div
          style={{
            height: "16px",
            width: "85%",
            backgroundColor: "#e0e0e0",
            marginBottom: "10px",
            borderRadius: "4px",
          }}
        />
        <div
          style={{
            height: "16px",
            width: "75%",
            backgroundColor: "#e0e0e0",
            marginBottom: "10px",
            borderRadius: "4px",
          }}
        />
      </div>
      <div
        style={{
          height: "40px",
          width: "100%",
          backgroundColor: "#e0e0e0",
          marginTop: "20px",
          borderRadius: "4px",
        }}
      />
    </div>
  );

  // Add this style to your component
  const skeletonStyle = `
    @keyframes pulse {
      0% { opacity: 0.6; }
      50% { opacity: 0.8; }
      100% { opacity: 0.6; }
    }
  `;

  // Handle supplier selection
  const handleSupplierSelect = (supplier) => {
    setSelectedSupplier(supplier);
    setShowInventoryModal(true);
  };

  // Add useEffect to fetch suppliers when modal opens
  useEffect(() => {
    if (showSupplierModal) {
      fetchSuppliers();
    }
  }, [showSupplierModal]);

  // Update the Create Order button click handler
  const handleCreateOrderClick = () => {
    setShowSupplierModal(true);
  };

  // Add these state variables at the top with other state declarations
  const [showQuickOrderModal, setShowQuickOrderModal] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [quickOrderForm, setQuickOrderForm] = useState({
    quantity: 1,
    deliveryAddress: "",
    deliveryDate: null,
  });

  // Add this function to handle quick order submission
  const handleQuickOrderSubmit = async () => {
    // Debug logs for all required fields
    console.log("Form Validation Check:", {
      quantity: quickOrderForm.quantity,
      deliveryAddress: quickOrderForm.deliveryAddress,
      deliveryDate: quickOrderForm.deliveryDate,
      inventoryId: selectedInventory?._id,
      selectedInventory: selectedInventory,
    });

    // Check each field individually and log which one is missing
    if (!quickOrderForm.quantity) {
      console.log("Missing: quantity");
      showError("Please enter quantity");
      return;
    }
    if (!quickOrderForm.deliveryAddress) {
      console.log("Missing: delivery address");
      showError("Please enter delivery address");
      return;
    }
    if (!quickOrderForm.deliveryDate) {
      console.log("Missing: delivery date");
      showError("Please select delivery date");
      return;
    }
    if (!selectedInventory?._id) {
      console.log("Missing: inventory ID");
      console.log("Selected Inventory:", selectedInventory);
      showError("Product information is missing");
      return;
    }

    try {
      setIsLoading(true);

      // Get the token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        showError("Please login to place an order");
        return;
      }

      // Format the order data according to the API requirements
      const orderData = {
        quantity: parseInt(quickOrderForm.quantity),
        deliveryAddress: quickOrderForm.deliveryAddress,
        deliveryDate: quickOrderForm.deliveryDate.toISOString().split("T")[0],
      };

      console.log("Selected Inventory:", selectedInventory);
      console.log("Quick Order Form:", quickOrderForm);
      console.log("Inventory ID:", selectedInventory._id);
      console.log("Sending order data:", orderData);

      // Make the API call with the inventory ID in the URL and auth token
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/suppliers/inventory/${selectedInventory._id}/order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create order");
      }

      if (result.status) {
        showSuccess("Order created successfully");
        // Close all modals
        setShowQuickOrderModal(false);
        setShowInventoryModal(false);
        setShowSupplierModal(false);
        // Reset the form
        setQuickOrderForm({
          quantity: 1,
          deliveryAddress: "",
          deliveryDate: null,
        });
        // Clear selected inventory and supplier
        setSelectedInventory(null);
        setSelectedSupplier(null);

        // Refresh orders list with the latest data
        await fetchOrders(1); // Fetch first page of orders
        // Reset pagination to first page
        setPagination((prev) => ({
          ...prev,
          currentPage: 1,
        }));
      } else {
        throw new Error(result.message || "Failed to create order");
      }
    } catch (error) {
      console.error("Error in quick order submission:", error);
      showError(error.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const { setPageTitle } = useOutletContext() || {};
  useEffect(() => {
    if (setPageTitle) setPageTitle("Orders");
  }, [setPageTitle]);

  return loading ? (
    <div className="loading-container">
      <div className="loading-spinner"></div>
    </div>
  ) : (
    <>
      <style>{skeletonStyle}</style>
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
        <div className="create-order-button-container">
          <button
            onClick={handleCreateOrderClick}
            className="create-order-button"
          >
            <img src={neworder} alt="neworder" />
            <span>Create New Order</span>
          </button>
        </div>

        <div>
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
                      <th>Supplier Name</th>
                      <th>Quantity</th>
                      <th>Delivery Address</th>
                      <th>Delivery Date</th>
                      <th>Status</th>
                      <th>Total Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders &&
                      orders.map((order) => (
                        <tr
                          key={order._id}
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

                                if (!selected && selectAll) {
                                  setSelectAll(false);
                                }
                              }}
                            />
                          </td>
                          <td data-label="Supplier Name">
                            {order.supplier?.businessName || "N/A"}
                          </td>
                          <td data-label="Quantity">
                            {order.products?.reduce(
                              (sum, product) => sum + product.quantity,
                              0
                            ) || 0}
                          </td>
                          <td data-label="Delivery Address">
                            {order.deliveryAddress}
                          </td>
                          <td data-label="Delivery Date">
                            {formatDate(order.deliveryDate)}
                          </td>
                          <td data-label="Status">
                            <span
                              className={`status-badge status-${order.status.toLowerCase()}`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td data-label="Total Price">
                            {formatCurrency(order.totalPrice)}
                          </td>
                        </tr>
                      ))}
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
              {/* Delivery Address */}
              <div className="p-grid p-formgrid form-row">
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

        {/* Supplier Modal */}
        <Dialog
          visible={showSupplierModal}
          onHide={() => setShowSupplierModal(false)}
          style={{ width: "80vw" }}
          header="Select Supplier"
          className="supplier-modal"
          dismissableMask={true}
        >
          <div className="p-fluid" style={{ padding: "20px" }}>
            <div className="suppliers-grid">
              {suppliers.map((supplier, index) => (
                <div
                  key={supplier?._id || Math.random()}
                  ref={
                    index === suppliers.length - 1
                      ? lastSupplierElementRef
                      : null
                  }
                  className="supplier-card"
                  style={{
                    padding: "20px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    marginBottom: "15px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div className="supplier-info">
                    <h3>{supplier?.businessName || "Unnamed Business"}</h3>
                    <p className="mb-3">
                      <span style={{ fontWeight: "bold" }}>Email:</span>{" "}
                      {supplier?.user?.email || "No email available"}
                    </p>
                    <p className="mb-3">
                      <span style={{ fontWeight: "bold" }}>Service Areas:</span>{" "}
                      {supplier?.serviceAreas?.join(", ") || "No service areas"}
                    </p>
                    <p className="mb-3">
                      <span style={{ fontWeight: "bold" }}>Department:</span>{" "}
                      {supplier?.department || "No department"}
                    </p>
                    <p className="mb-3">
                      <span style={{ fontWeight: "bold" }}>
                        Total Products:
                      </span>{" "}
                      {supplier?.totalProducts || 0}
                    </p>
                    <p className="mb-3">
                      <span style={{ fontWeight: "bold" }}>Total Stock:</span>{" "}
                      {supplier?.totalStock || 0}
                    </p>
                  </div>
                  <Button
                    label="See All Inventories"
                    onClick={() => handleSupplierSelect(supplier)}
                    className="p-button-primary"
                    style={{ width: "100%", marginTop: "20px" }}
                  />
                </div>
              ))}
              {loadingSuppliers && (
                <>
                  <SupplierSkeleton />
                  <SupplierSkeleton />
                  <SupplierSkeleton />
                </>
              )}
            </div>
          </div>
        </Dialog>

        {/* Inventory Modal */}
        <Dialog
          visible={showInventoryModal}
          onHide={() => setShowInventoryModal(false)}
          style={{ width: "90vw", maxWidth: "1200px" }}
          header={
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <i className="pi pi-box" style={{ fontSize: "1.5rem" }} />
              <span>{`${
                selectedSupplier?.businessName || "Supplier"
              }'s Inventory`}</span>
            </div>
          }
          className="inventory-modal"
          dismissableMask={true}
        >
          <div className="p-fluid" style={{ padding: "20px" }}>
            {selectedSupplier?.inventories?.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <i
                  className="pi pi-info-circle"
                  style={{ fontSize: "3rem", color: "#666" }}
                />
                <h3 style={{ marginTop: "20px", color: "#666" }}>
                  No Inventory Available
                </h3>
                <p style={{ color: "#666" }}>
                  This supplier has no inventory items at the moment.
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: "20px",
                  padding: "20px",
                }}
              >
                {selectedSupplier?.inventories?.map((inventory) => (
                  <div
                    key={inventory?._id || Math.random()}
                    className="inventory-item"
                    style={{
                      padding: "20px",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      marginBottom: "10px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      backgroundColor: "#fff",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      cursor: "pointer",
                      ":hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                      },
                    }}
                  >
                    <div className="inventory-info">
                      <h3 style={{ marginBottom: "15px", color: "#103B57" }}>
                        {inventory?.product?.name || "Unnamed Product"}
                      </h3>
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          marginBottom: "15px",
                        }}
                      >
                        <span
                          style={{
                            padding: "4px 8px",
                            backgroundColor: "#e9ecef",
                            borderRadius: "4px",
                            fontSize: "0.9rem",
                            color: "#666",
                          }}
                        >
                          {inventory?.product?.category || "No category"}
                        </span>
                        <span
                          style={{
                            padding: "4px 8px",
                            backgroundColor:
                              inventory?.quantity > 0 ? "#d4edda" : "#f8d7da",
                            borderRadius: "4px",
                            fontSize: "0.9rem",
                            color:
                              inventory?.quantity > 0 ? "#155724" : "#721c24",
                          }}
                        >
                          {inventory?.quantity > 0
                            ? "In Stock"
                            : "Out of Stock"}
                        </span>
                      </div>
                      <p className="mb-3">
                        <span style={{ fontWeight: "bold", color: "#666" }}>
                          Price:
                        </span>{" "}
                        <span style={{ color: "#28a745", fontSize: "1.2rem" }}>
                          ${inventory?.price?.toFixed(2) || 0}
                        </span>
                      </p>
                      <p className="mb-3">
                        <span style={{ fontWeight: "bold", color: "#666" }}>
                          Quantity Available:
                        </span>{" "}
                        <span
                          style={{
                            color:
                              inventory?.quantity > 0 ? "#28a745" : "#dc3545",
                            fontWeight: "bold",
                          }}
                        >
                          {inventory?.quantity || 0}
                        </span>
                      </p>
                      <p className="mb-3">
                        <span style={{ fontWeight: "bold", color: "#666" }}>
                          SKU:
                        </span>{" "}
                        <span style={{ fontFamily: "monospace" }}>
                          {inventory?.product?.sku || "No SKU"}
                        </span>
                      </p>
                      {inventory?.product?.serviceArea && (
                        <p className="mb-3">
                          <span style={{ fontWeight: "bold", color: "#666" }}>
                            Service Area:
                          </span>{" "}
                          {inventory.product.serviceArea}
                        </p>
                      )}
                      {inventory?.product?.description && (
                        <p
                          className="mb-3"
                          style={{
                            color: "#666",
                            fontSize: "0.9rem",
                            lineHeight: "1.4",
                          }}
                        >
                          {inventory.product.description}
                        </p>
                      )}
                    </div>
                    <Button
                      label="Order Now"
                      icon="pi pi-shopping-cart"
                      onClick={() => {
                        console.log(
                          "Inventory item being selected:",
                          inventory
                        );
                        console.log("Product data:", inventory?.product);
                        setSelectedInventory(inventory);
                        setQuickOrderForm({
                          quantity: 1,
                          deliveryAddress: "",
                          deliveryDate: null,
                        });
                        setShowQuickOrderModal(true);
                      }}
                      className="p-button-primary"
                      style={{
                        width: "100%",
                        marginTop: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </Dialog>

        {/* Quick Order Modal */}
        <Dialog
          visible={showQuickOrderModal}
          onHide={() => setShowQuickOrderModal(false)}
          style={{ width: isMobile ? "95vw" : "50vw" }}
          header="Quick Order"
          className="quick-order-modal"
          dismissableMask={true}
        >
          <div className="p-fluid" style={{ padding: "20px" }}>
            {/* Product Info */}
            <div className="product-info" style={{ marginBottom: "20px" }}>
              <h3 style={{ margin: "0 0 10px 0" }}>
                {selectedInventory?.product?.name || "Product"}
              </h3>
              <p style={{ margin: "0", color: "#666" }}>
                Price: ${selectedInventory?.price || 0}
              </p>
            </div>

            {/* Quantity */}
            <div className="p-field" style={{ marginBottom: "20px" }}>
              <label htmlFor="quickOrderQuantity">Quantity*</label>
              <InputText
                id="quickOrderQuantity"
                type="number"
                value={quickOrderForm.quantity}
                onChange={(e) =>
                  setQuickOrderForm({
                    ...quickOrderForm,
                    quantity: parseInt(e.target.value) || 0,
                  })
                }
                min="1"
                style={{ width: "100%" }}
              />
            </div>

            {/* Delivery Address */}
            <div className="p-field" style={{ marginBottom: "20px" }}>
              <label htmlFor="quickOrderAddress">Delivery Address*</label>
              <InputText
                id="quickOrderAddress"
                value={quickOrderForm.deliveryAddress}
                onChange={(e) =>
                  setQuickOrderForm({
                    ...quickOrderForm,
                    deliveryAddress: e.target.value,
                  })
                }
                placeholder="Enter delivery address"
                style={{ width: "100%" }}
              />
            </div>

            {/* Delivery Date */}
            <div className="p-field" style={{ marginBottom: "20px" }}>
              <label htmlFor="quickOrderDate">Delivery Date*</label>
              <Calendar
                id="quickOrderDate"
                value={quickOrderForm.deliveryDate}
                onChange={(e) =>
                  setQuickOrderForm({
                    ...quickOrderForm,
                    deliveryDate: e.value,
                  })
                }
                showIcon
                placeholder="Select delivery date"
                style={{ width: "100%" }}
              />
            </div>

            {/* Order Summary */}
            <div
              className="order-summary"
              style={{
                backgroundColor: "#f8f9fa",
                padding: "15px",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              <h4 style={{ margin: "0 0 10px 0" }}>Order Summary</h4>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Subtotal:</span>
                <span>
                  $
                  {(
                    selectedInventory?.price * quickOrderForm.quantity || 0
                  ).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div
              className="dialog-footer"
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <Button
                label="Cancel"
                onClick={() => setShowQuickOrderModal(false)}
                className="p-button-text"
              />
              <Button
                label="Place Order"
                onClick={handleQuickOrderSubmit}
                className="p-button-primary"
                loading={isLoading}
              />
            </div>
          </div>
        </Dialog>
      </div>
    </>
  );
};

export default Order;
