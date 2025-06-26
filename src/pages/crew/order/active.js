import React, { useState } from "react";
import bar from "../../../assets/images/crew/bar.png";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { CardSkeleton } from "../../../components/CrewOrderSkeletons";

const ActiveOrders = ({ onFilterChange, statusCounts = { pending: 0, active: 0, completed: 0, total: 0 }, loading = false }) => {
  const [activeTab, setActiveTab] = useState("pending"); // Default tab

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // Handle tab change and notify parent component
  const handleTabChange = (tab) => {
    setActiveTab(tab);

    // Define filter criteria based on selected tab
    let filterCriteria = {};

    if (tab === "active") {
      // Active orders: partially_confirmed, confirmed, shipped
      filterCriteria = {
        status: ["partially_confirmed", "confirmed", "shipped"],
      };
    } else if (tab === "completed") {
      // Completed orders: delivered
      filterCriteria = {
        status: ["delivered"],
      };
    } else if (tab === "pending") {
      // Pending orders: pending
      filterCriteria = {
        status: ["pending"],
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
      mb: 2,
      mt: 2
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
        {/* Show skeleton loading or actual cards */}
        {loading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
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
                  {statusCounts.active || 0}
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
                  {statusCounts.completed || 0}
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
                  {statusCounts.pending || 0}
                </Box>
              </Box>
            </Box>
          </>
        )}
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
    </Box>
  );
};

export default ActiveOrders;
