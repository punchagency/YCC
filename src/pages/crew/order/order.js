import { React, useState, useRef, useEffect, useCallback } from "react";
import ActiveOrders from "./active";
import OrderTable from "./table";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Toast } from "primereact/toast";
import { getSuppliersWithInventories } from "../../../services/supplier/supplierService";
import { createOrder } from "../../../services/crew/crewOrderService";
import "./order.css";
import DashboardTitleBar from "../../../components/dashboard/title-bar";
import { useOutletContext } from "react-router-dom";
import neworder from "../../../assets/images/crew/neworder.png";

const Order = () => {
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [showQuickOrderModal, setShowQuickOrderModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const toast = useRef(null);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [supplierPagination, setSupplierPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
  });
  const tableRef = useRef(null);

  // State for quick order form
  const [quickOrderForm, setQuickOrderForm] = useState({
    quantity: 1,
    deliveryAddress: "",
    deliveryDate: null,
  });

  // Add a new state for order filters
  const [orderFilters, setOrderFilters] = useState({});

  // Add a new state for hover effect
  const [isHovered, setIsHovered] = useState(false);

  const outletContext = useOutletContext();
  useEffect(() => {
    if (outletContext && outletContext.setPageTitle) {
      outletContext.setPageTitle("Orders");
    }
  }, [outletContext]);

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch suppliers with inventories
  const fetchSuppliers = async (page = 1, append = false) => {
    try {
      setLoadingSuppliers(true);
      const response = await getSuppliersWithInventories({
        page,
        limit: supplierPagination.pageSize,
      });

      if (response.status) {
        console.log("Received suppliers data:", response.data);
        const validatedSuppliers = response.data.map((supplier) => ({
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
                name: inv?.product?.name || "Unnamed Product",
                category: inv?.product?.category || "No category",
                sku: inv?.product?.sku || "No SKU",
                description: inv?.product?.description,
              },
              price: inv?.price || 0,
              quantity: inv?.quantity || 0,
            })) || [],
        }));

        setSuppliers((prev) =>
          append ? [...prev, ...validatedSuppliers] : validatedSuppliers
        );
        setSupplierPagination(response.pagination);
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

  // Handle supplier selection
  const handleSupplierSelect = (supplier) => {
    setSelectedSupplier(supplier);
    setShowInventoryModal(true);
  };

  // Handle quick order submission
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
        // Refresh orders list
        if (tableRef.current?.fetchOrders) {
          tableRef.current.fetchOrders();
        }
      } else {
        showError(result.message || "Failed to create order");
      }
    } catch (error) {
      console.error("Error in quick order submission:", error);
      showError(error.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle filter changes from ActiveOrders component
  const handleFilterChange = (filterCriteria) => {
    console.log("Filter criteria changed:", filterCriteria);
    setOrderFilters(filterCriteria);
  };

  // Add useEffect to fetch suppliers when modal opens
  useEffect(() => {
    if (showSupplierModal) {
      fetchSuppliers();
    }
  }, [showSupplierModal]);

  // Create Orders Button
  const createOrdersButton = () => {
    return (
        <button
          onClick={() => setShowSupplierModal(true)}
          style={{
            backgroundColor: "#0387D9",
            color: "white",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            border: "1px solid #0387D9",
            boxShadow: isHovered ? "0 6px 24px rgba(3,135,217,0.18)" : "0 2px 8px rgba(3,135,217,0.08)",
            transform: isHovered ? "translateY(-2px)" : "translateY(0)",
            transition: "all 0.18s cubic-bezier(.4,0,.2,1)",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          Create Order
        </button>
    )
  }

  return (
    <>
      <div className="">
        <div className="w-full">
          <DashboardTitleBar title="Orders" backArrow={true} button={createOrdersButton()} />
        </div>
        {/* <div
          className="flex justify-content-between"
          style={{
            width: "100%",
            backgroundColor: "white",
            padding: "15px 30px",
          }}
        >
          <h1 className="text-2xl font-bold">Orders</h1>
          <button
            onClick={() => setShowSupplierModal(true)}
            className="create-order-button"
          >
            <img src={neworder} alt="neworder" />
            <span>Create New Order</span>
          </button>
        </div> */}

        {/* Pass the handleFilterChange function to ActiveOrders */}
        <ActiveOrders onFilterChange={handleFilterChange} />
        {/* Pass the filters to OrderTable and get the ref */}
        <OrderTable
          filters={orderFilters}
          onRef={(ref) => {
            tableRef.current = ref;
          }}
        />
      </div>

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
          <div
            className="suppliers-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "20px",
              padding: "20px",
            }}
          >
            {suppliers.map((supplier) => (
              <div
                key={supplier?._id}
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
                    <span style={{ fontWeight: "bold" }}>Total Products:</span>{" "}
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
                  style={{ width: "300px", marginTop: "20px" }}
                />
              </div>
            ))}
            {loadingSuppliers && (
              <>
                <div className="supplier-card skeleton" />
                <div className="supplier-card skeleton" />
                <div className="supplier-card skeleton" />
              </>
            )}
          </div>
        </div>
      </Dialog>

      {/* Inventory Modal */}
      <Dialog
        visible={showInventoryModal}
        onHide={() => setShowInventoryModal(false)}
        style={{ width: "80vw" }}
        header={`${selectedSupplier?.businessName || "Supplier"}'s Inventory`}
        className="inventory-modal"
        dismissableMask={true}
      >
        <div className="p-fluid" style={{ padding: "20px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "20px",
              padding: "20px",
            }}
          >
            {selectedSupplier?.inventories?.map((inventory) => (
              <div
                key={inventory?._id}
                className="inventory-item"
                style={{
                  padding: "20px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  marginBottom: "10px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div className="inventory-info">
                  <h3 style={{ marginBottom: "15px" }}>
                    {inventory?.product?.name || "Unnamed Product"}
                  </h3>
                  <p className="mb-3">
                    <span style={{ fontWeight: "bold" }}>Category:</span>{" "}
                    {inventory?.product?.category || "No category"}
                  </p>
                  <p className="mb-3">
                    <span style={{ fontWeight: "bold" }}>Price:</span> $
                    {inventory?.price || 0}
                  </p>
                  <p className="mb-3">
                    <span style={{ fontWeight: "bold" }}>
                      Quantity Available:
                    </span>{" "}
                    {inventory?.quantity || 0}
                  </p>
                  <p className="mb-3">
                    <span style={{ fontWeight: "bold" }}>SKU:</span>{" "}
                    {inventory?.product?.sku || "No SKU"}
                  </p>
                  {inventory?.product?.description && (
                    <p className="mb-3">
                      <span style={{ fontWeight: "bold" }}>Description:</span>{" "}
                      {inventory.product.description}
                    </p>
                  )}
                </div>
                <Button
                  label="Order Now"
                  icon="pi pi-shopping-cart"
                  onClick={() => {
                    const token = localStorage.getItem("token");
                    if (!token) {
                      window.location.href = "/login";
                      return;
                    }
                    console.log("Inventory item being selected:", inventory);
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

      <Toast ref={toast} position="bottom-right" />
    </>
  );
};

export default Order;
