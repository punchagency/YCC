import React, { useState, useEffect, useCallback } from "react";
import bar from "../../../assets/images/crew/bar.png";
import { getOrders } from "../../../services/crew/crewOrderService";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const ActiveOrders = ({ onFilterChange }) => {
  const [orderCounts, setOrderCounts] = useState({
    active: 0,
    completed: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("pending"); // Default tab

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

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
    <Box sx={{ 
      width: "100%", 
      bgcolor: "#F8FBFF", 
      borderRadius: 3, 
      p: isMobile ? 2 : 3,
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
      border: "1px solid #e2e8f0",
      mb: 3
    }}>
      {/* Order Summary Cards Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: isMobile ? "flex-start" : "space-between",
          alignItems: "center",
          gap: isMobile ? 2 : 0,
          overflowX: isMobile ? "auto" : "visible",
          pb: isMobile ? 1 : 0,
          px: isMobile ? 1 : 0,
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": { display: "none" },
          mb: 3
        }}
      >
        {/* Active Orders Card */}
        <Box
          sx={{
            minWidth: isMobile ? 200 : "30%",
            maxWidth: isMobile ? 220 : "32%",
            bgcolor: "#ffffff",
            borderRadius: 3,
            p: 3,
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            border: "1px solid #f1f5f9",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              transform: "translateY(-2px)",
            },
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              mr: 2,
              bgcolor: "#D5B184",
              borderRadius: "50%",
              width: 48,
              height: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 4px rgba(213, 177, 132, 0.3)",
            }}
          >
            <img src={bar} alt="bar" width="24px" height="24px" />
          </Box>
          <Box>
            <Box
              sx={{
                fontSize: isMobile ? 16 : 18,
                fontWeight: 600,
                color: "#374151",
                mb: 0.5,
              }}
            >
              Active Orders
            </Box>
            <Box
              sx={{
                fontSize: isMobile ? 24 : 28,
                fontWeight: 700,
                color: "#0387D9",
              }}
            >
              {loading ? "..." : orderCounts.active}
            </Box>
          </Box>
        </Box>

        {/* Completed Orders Card */}
        <Box
          sx={{
            minWidth: isMobile ? 200 : "30%",
            maxWidth: isMobile ? 220 : "32%",
            bgcolor: "#ffffff",
            borderRadius: 3,
            p: 3,
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            border: "1px solid #f1f5f9",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              transform: "translateY(-2px)",
            },
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              mr: 2,
              bgcolor: "#D5B184",
              borderRadius: "50%",
              width: 48,
              height: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 4px rgba(213, 177, 132, 0.3)",
            }}
          >
            <img src={bar} alt="bar" width="24px" height="24px" />
          </Box>
          <Box>
            <Box
              sx={{
                fontSize: isMobile ? 16 : 18,
                fontWeight: 600,
                color: "#374151",
                mb: 0.5,
              }}
            >
              Completed Orders
            </Box>
            <Box
              sx={{
                fontSize: isMobile ? 24 : 28,
                fontWeight: 700,
                color: "#059669",
              }}
            >
              {loading ? "..." : orderCounts.completed}
            </Box>
          </Box>
        </Box>

        {/* Pending Orders Card */}
        <Box
          sx={{
            minWidth: isMobile ? 200 : "30%",
            maxWidth: isMobile ? 220 : "32%",
            bgcolor: "#ffffff",
            borderRadius: 3,
            p: 3,
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            border: "1px solid #f1f5f9",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              transform: "translateY(-2px)",
            },
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              mr: 2,
              bgcolor: "#D5B184",
              borderRadius: "50%",
              width: 48,
              height: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 4px rgba(213, 177, 132, 0.3)",
            }}
          >
            <img src={bar} alt="bar" width="24px" height="24px" />
          </Box>
          <Box>
            <Box
              sx={{
                fontSize: isMobile ? 16 : 18,
                fontWeight: 600,
                color: "#374151",
                mb: 0.5,
              }}
            >
              Pending Orders
            </Box>
            <Box
              sx={{
                fontSize: isMobile ? 24 : 28,
                fontWeight: 700,
                color: "#D97706",
              }}
            >
              {loading ? "..." : orderCounts.pending}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Filter Tabs Section */}
      <Box
        sx={{
          width: isMobile ? "100%" : "auto",
          maxWidth: isMobile ? "100%" : 600,
          mx: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: "#ffffff",
            borderRadius: 3,
            p: 1,
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
            border: "1px solid #e2e8f0",
            overflowX: isMobile ? "auto" : "visible",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {[
            { key: "pending", label: "Pending Orders" },
            { key: "active", label: "Active Orders" },
            { key: "completed", label: "Completed Orders" },
          ].map((tab) => (
            <Box
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              sx={{
                flex: 1,
                minWidth: isMobile ? 140 : "auto",
                bgcolor: activeTab === tab.key ? "#0387D9" : "transparent",
                color: activeTab === tab.key ? "#ffffff" : "#374151",
                borderRadius: 2,
                py: 1.5,
                px: isMobile ? 2 : 3,
                textAlign: "center",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: isMobile ? 13 : 14,
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  bgcolor: activeTab === tab.key ? "#0387D9" : "#f8fafc",
                  transform: activeTab !== tab.key ? "translateY(-1px)" : "none",
                  boxShadow: activeTab !== tab.key ? "0 2px 4px rgba(0, 0, 0, 0.1)" : "none",
                },
                userSelect: "none",
                flexShrink: 0,
              }}
            >
              {tab.label}
            </Box>
          ))}
        </Box>
      </Box>

      {error && (
        <Box
          sx={{
            color: "#dc3545",
            mt: 2,
            p: 2,
            bgcolor: "#fef2f2",
            borderRadius: 2,
            border: "1px solid #fecaca",
            fontSize: 14,
          }}
        >
          Error loading order counts: {error}
        </Box>
      )}
    </Box>
  );
};

export default ActiveOrders;
