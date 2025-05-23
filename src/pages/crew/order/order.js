import { React, useState, useRef, useEffect, useCallback } from "react";
import ActiveOrders from "./active";
import OrderTable from "./table";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Toast } from "primereact/toast";

import {
  createOrder,
  getProductsWithVendors,
} from "../../../services/crew/crewOrderService";
import "./order.css";

const Order = () => {
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const toast = useRef(null);
  const [fetchingProducts, setFetchingProducts] = useState(false);

  // State variables
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [supplierOptions, setSupplierOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [productsWithVendors, setProductsWithVendors] = useState([]);

  // State for order form
  const [orderForm, setOrderForm] = useState({
    customerName: "",
    supplierId: null,
    products: [{ id: null, quantity: 1 }],
    deliveryDate: null,
    orderStatus: "Pending",
    notes: "",
  });

  // Status options
  const statusOptions = [
    { label: "Pending", value: "Pending" },
    { label: "Processing", value: "Processing" },
    { label: "Shipped", value: "Shipped" },
    { label: "Delivered", value: "Delivered" },
    { label: "Cancelled", value: "Cancelled" },
  ];

  // Add a new state for order filters
  const [orderFilters, setOrderFilters] = useState({});

  // Fetch products with vendors
  const fetchProductsWithVendors = useCallback(async () => {
    try {
      setFetchingProducts(true);
      console.log("Fetching products with vendors...");

      const response = await getProductsWithVendors();
      console.log("Products with vendors response:", response);

      if (response.status) {
        // Check the exact structure of the response data
        console.log("Response data structure:", JSON.stringify(response.data));

        // Try different possible paths to the products array
        let products = [];
        if (response.data?.products) {
          products = response.data.products;
        } else if (Array.isArray(response.data)) {
          products = response.data;
        } else if (typeof response.data === "object") {
          // If it's an object but not an array, look for any array property
          const possibleArrays = Object.values(response.data).filter((val) =>
            Array.isArray(val)
          );
          if (possibleArrays.length > 0) {
            products = possibleArrays[0];
          }
        }

        console.log("Extracted products:", products);

        if (products.length === 0) {
          console.warn("No products found in the response");
          showError("No products available");
          return;
        }

        setProductsWithVendors(products);

        // Transform products into dropdown options with more detailed logging
        const productOpts = products.map((product, index) => {
          console.log(`Product ${index}:`, product);
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

        console.log("Final product options:", productOpts);
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
        console.log("Supplier options:", supplierOpts);
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

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
      const updatedProducts = [...orderForm.products];
      updatedProducts[0].id = selectedProduct;

      // Find the selected product to get its price and auto-select supplier
      const selectedProductData = productsWithVendors.find(
        (p) => p._id === selectedProduct || p.id === selectedProduct
      );
      console.log("Selected product data:", selectedProductData);

      if (selectedProductData) {
        // Set product price if available
        updatedProducts[0].price = selectedProductData.price || 0;

        // Auto-select the supplier based on the product's creator/vendor
        const creator =
          selectedProductData.creator ||
          selectedProductData.supplier ||
          selectedProductData.vendor;

        console.log("Product creator/supplier:", creator);

        if (creator) {
          const creatorId = creator._id || creator.id;
          if (creatorId) {
            const supplierName =
              creator.businessName || creator.name || creator.companyName;
            console.log("Setting supplier to:", creatorId);
            console.log("Supplier name:", supplierName);
            setSelectedSupplier(creatorId);

            // If the supplier isn't in our options yet, add it
            if (!supplierOptions.some((s) => s.value === creatorId)) {
              setSupplierOptions((prev) => [
                ...prev,
                {
                  label: supplierName || "Unknown Supplier",
                  value: creatorId,
                  data: creator,
                },
              ]);
            }
          }
        }

        setOrderForm((prev) => ({
          ...prev,
          products: updatedProducts,
        }));
      }
    }
  }, [selectedProduct, productsWithVendors, supplierOptions]);

  // Update supplier ID when selectedSupplier changes
  useEffect(() => {
    if (selectedSupplier) {
      setOrderForm((prev) => ({
        ...prev,
        supplierId: selectedSupplier,
      }));
    }
  }, [selectedSupplier]);

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

  // Update handleQuantityChange to work with the form
  const handleQuantityChange = (e) => {
    const quantity = parseInt(e.target.value) || 0;
    const updatedProducts = [...orderForm.products];
    updatedProducts[0].quantity = quantity;
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

  // Reset form
  const resetForm = () => {
    setOrderForm({
      customerName: "",
      supplierId: null,
      products: [{ id: null, quantity: 1 }],
      deliveryDate: null,
      orderStatus: "Pending",
      notes: "",
    });
    setSelectedProduct(null);
    setSelectedSupplier(null);
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      // Validate form
      if (!orderForm.customerName) {
        showError("Customer name is required");
        return;
      }

      if (!selectedSupplier) {
        showError("Supplier is required");
        return;
      }

      if (!selectedProduct) {
        showError("Product is required");
        return;
      }

      if (
        !orderForm.products[0].quantity ||
        orderForm.products[0].quantity <= 0
      ) {
        showError("Quantity must be greater than 0");
        return;
      }

      if (!orderForm.deliveryDate) {
        showError("Delivery date is required");
        return;
      }

      setIsLoading(true);

      // Find the selected product to get its price
      const selectedProductData = productsWithVendors.find(
        (p) => p._id === selectedProduct || p.id === selectedProduct
      );

      // Find the selected supplier to get the vendor name
      const selectedSupplierData = supplierOptions.find(
        (s) => s.value === selectedSupplier
      )?.data;

      console.log("Selected supplier data:", selectedSupplierData);

      // Format data for API - EXACTLY matching the expected format
      const orderData = {
        vendorName:
          selectedSupplierData?.businessName ||
          selectedSupplierData?.name ||
          "Unknown Vendor",
        products: [
          {
            id: selectedProduct,
            quantity: parseInt(orderForm.products[0].quantity),
            price: selectedProductData?.price || 29.99, // Default price if not available
          },
        ],
        estimatedDeliveryDate: orderForm.deliveryDate.toISOString(), // Format as ISO string
        deliveryAddress: orderForm.customerName, // Using customer name as delivery address
      };

      // Add optional fields only if they have values
      if (orderForm.notes) {
        orderData.notes = orderForm.notes;
      }

      if (orderForm.orderStatus) {
        orderData.status = orderForm.orderStatus;
      }

      console.log("Submitting order data:", orderData);

      const response = await createOrder(orderData);
      console.log("Order creation response:", response);

      if (response.status) {
        showSuccess("Order created successfully");
        resetForm();
        setShowOrderModal(false);
      } else {
        showError(response.error || "Failed to create order");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      showError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle filter changes from ActiveOrders component
  const handleFilterChange = (filterCriteria) => {
    console.log("Filter criteria changed:", filterCriteria);
    setOrderFilters(filterCriteria);
  };

  return (
    <>
      <div className="">
        <div
          className="flex justify-content-between"
          style={{
            width: "100%",
            backgroundColor: "white",
            padding: "15px 30px",
          }}
        >
          <h1 className="text-2xl font-bold">Orders</h1>
          <button
            style={{
              backgroundColor: "#0387D9",
              color: "white",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer",
              border: "1px solid #0387D9",
            }}
            onClick={() => setShowOrderModal(true)}
          >
            Create Order
          </button>
        </div>

        {/* Pass the handleFilterChange function to ActiveOrders */}
        <ActiveOrders onFilterChange={handleFilterChange} />

        {/* Pass the filters to OrderTable */}
        <OrderTable filters={orderFilters} />
      </div>

      {/* Order creation modal */}
      <Dialog
        visible={showOrderModal}
        onHide={() => {
          setShowOrderModal(false);
          resetForm();
        }}
        style={{ width: isMobile ? "95vw" : "70vw" }}
        header="New Order"
        className="order-modal"
      >
        <div className="p-fluid" style={{ padding: "40px" }}>
          {/*  Customer Name and Supplier Name */}
          <div className="p-grid p-formgrid form-row">
            <div className="p-field">
              <label htmlFor="customerName">Delivery Address*</label>
              <InputText
                id="customerName"
                name="customerName"
                value={orderForm.customerName}
                onChange={handleInputChange}
                placeholder="Enter delivery address"
              />
            </div>
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
              <label htmlFor="productId">Select Product*</label>
              <Dropdown
                id="productId"
                value={selectedProduct}
                options={productOptions}
                style={{ height: "45px" }}
                onChange={(e) => setSelectedProduct(e.value)}
                placeholder={
                  fetchingProducts ? "Loading products..." : "Select a product"
                }
                disabled={fetchingProducts}
                optionLabel="label"
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
              onClick={() => {
                setShowOrderModal(false);
                resetForm();
              }}
              className="p-button-danger"
              style={{ width: "200px", padding: "10px" }}
            />
            <Button
              label={isLoading ? "Creating..." : "Create Order"}
              onClick={handleSubmit}
              disabled={isLoading || fetchingProducts}
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

export default Order;
