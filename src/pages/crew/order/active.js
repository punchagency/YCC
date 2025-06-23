import React, { useState, useEffect, useCallback } from "react";
import bar from "../../../assets/images/crew/bar.png";
import { getOrders } from "../../../services/crew/crewOrderService";

const ActiveOrders = ({ onFilterChange }) => {
  const [orderCounts, setOrderCounts] = useState({
    active: 0,
    completed: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("pending"); // Default tab

  // Fetch all orders to count by status
  const fetchOrderCounts = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Fetching orders for counts...");

      // Get all orders without pagination to count totals
      const response = await getOrders({ limit: 1000 });
      console.log("Orders count response:", response);

      if (response.status) {
        let orders = [];

        // Extract orders from the response based on structure
        if (response.data?.data && Array.isArray(response.data.data)) {
          orders = response.data.data;
        } else if (
          response.data?.data?.data &&
          Array.isArray(response.data.data.data)
        ) {
          orders = response.data.data.data;
        } else if (Array.isArray(response.data)) {
          orders = response.data;
        }

        console.log(`Found ${orders.length} total orders`);

        // Get current date for comparing with estimated delivery dates
        const currentDate = new Date();

        // Count orders by status
        const counts = {
          active: 0,
          completed: 0,
          pending: 0,
        };

        orders.forEach((order) => {
          const status = (order.status || "").toLowerCase();
          const estimatedDelivery = order.estimatedDeliveryDate
            ? new Date(order.estimatedDeliveryDate)
            : null;

          // Active orders: delivery date is in the future and status is not completed/cancelled
          if (
            estimatedDelivery &&
            estimatedDelivery > currentDate &&
            status !== "delivered" &&
            status !== "completed" &&
            status !== "cancelled"
          ) {
            counts.active++;
          }
          // Completed orders: status is delivered or completed
          else if (status === "delivered" || status === "completed") {
            counts.completed++;
          }
          // Pending orders: status is pending or processing
          else if (status === "pending" || status === "processing") {
            counts.pending++;
          }
        });

        console.log("Order counts:", counts);
        setOrderCounts(counts);
      } else {
        console.error("Failed to fetch orders:", response.error);
        setError("Failed to load order counts");
      }
    } catch (error) {
      console.error("Error fetching order counts:", error);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch order counts on component mount
  useEffect(() => {
    fetchOrderCounts();
  }, [fetchOrderCounts]);

  // Handle tab change and notify parent component
  const handleTabChange = (tab) => {
    setActiveTab(tab);

    // Define filter criteria based on selected tab
    let filterCriteria = {};

    if (tab === "active") {
      // Active orders: future delivery date and not completed/cancelled
      filterCriteria = {
        status: ["pending", "processing", "shipped"],
        futureDelivery: true,
      };
    } else if (tab === "completed") {
      // Completed orders
      filterCriteria = {
        status: ["delivered", "completed"],
      };
    } else if (tab === "pending") {
      // Pending orders
      filterCriteria = {
        status: ["pending", "processing"],
      };
    }

    // Notify parent component about the filter change
    if (onFilterChange) {
      onFilterChange(filterCriteria);
    }
  };

  return (
    <>
      <div
        style={{
          marginTop: "15px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ width: "30%" }}>
          <div
            className="flex bg-white p-4"
            style={{ width: "200px", borderRadius: "10px" }}
          >
            <div
              style={{
                backgroundColor: "#D5B184",
                borderRadius: "50%",
                width: "35px",
                height: "35px",
                padding: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              className="mr-3"
            >
              <img src={bar} alt="bar" width="20px" height="20px" />
            </div>
            <div>
              <h2 style={{ fontSize: "20px" }}>Active Orders</h2>
              <h1 className="text-2xl font-bold">
                {loading ? "..." : orderCounts.active}
              </h1>
            </div>
          </div>
        </div>
        <div style={{ width: "30%" }}>
          <div
            className="flex bg-white p-4"
            style={{ width: "200px", borderRadius: "10px" }}
          >
            <div
              style={{
                backgroundColor: "#D5B184",
                borderRadius: "50%",
                width: "35px",
                height: "35px",
                padding: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              className="mr-3"
            >
              <img src={bar} alt="bar" width="20px" height="20px" />
            </div>
            <div>
              <h2 style={{ fontSize: "20px" }}>Completed Orders</h2>
              <h1 className="text-2xl font-bold">
                {loading ? "..." : orderCounts.completed}
              </h1>
            </div>
          </div>
        </div>
        <div style={{ width: "30%" }}>
          <div
            className="flex bg-white p-4"
            style={{ width: "200px", borderRadius: "10px" }}
          >
            <div
              style={{
                backgroundColor: "#D5B184",
                borderRadius: "50%",
                width: "35px",
                height: "35px",
                padding: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              className="mr-3"
            >
              <img src={bar} alt="bar" width="20px" height="20px" />
            </div>
            <div>
              <h2 style={{ fontSize: "20px" }}>Pending Orders</h2>
              <h1 className="text-2xl font-bold">
                {loading ? "..." : orderCounts.pending}
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div style={{ width: "30%" }}>
        <div
          className="flex justify-content-between align-items-center bg-white mt-4 p-2"
          style={{ borderRadius: "10px", height: "100%" }}
        >
          <div
            style={{
              backgroundColor:
                activeTab === "pending" ? "#0387D9" : "transparent",
              borderRadius: "10px",
              padding: "5px",
              color: activeTab === "pending" ? "white" : "inherit",
              cursor: "pointer",
            }}
            onClick={() => handleTabChange("pending")}
          >
            Pending Orders
          </div>
          <div
            style={{
              backgroundColor:
                activeTab === "active" ? "#0387D9" : "transparent",
              borderRadius: "10px",
              padding: "5px",
              color: activeTab === "active" ? "white" : "inherit",
              cursor: "pointer",
            }}
            onClick={() => handleTabChange("active")}
          >
            Active Orders
          </div>
          <div
            style={{
              backgroundColor:
                activeTab === "completed" ? "#0387D9" : "transparent",
              borderRadius: "10px",
              padding: "5px",
              color: activeTab === "completed" ? "white" : "inherit",
              cursor: "pointer",
            }}
            onClick={() => handleTabChange("completed")}
          >
            Completed Orders
          </div>
        </div>
      </div>
      {error && (
        <div className="text-red-500 ml-5 mt-2">
          Error loading order counts: {error}
        </div>
      )}
    </>
  );
};

export default ActiveOrders;
