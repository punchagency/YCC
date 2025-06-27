import React, { useState, useEffect } from "react";
import bar from "../../../assets/images/crew/bar.png";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { CardSkeleton } from "../../../components/CrewOrderSkeletons";

// Modern Compact Filter Component with Dropdown
const OrderFilter = ({ activeFilter, onFilterChange, isMobile }) => {
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);

  const orderFilters = [
    { key: "all", label: "All Orders", icon: "pi pi-list", color: "#6b7280" },
    { key: "pending", label: "Pending Orders", icon: "pi pi-clock", color: "#D97706" },
    { key: "active", label: "Active Orders", icon: "pi pi-play-circle", color: "#0387D9" },
    { key: "completed", label: "Completed Orders", icon: "pi pi-check-circle", color: "#059669" },
  ];

  const getActiveFilterLabel = (filters, activeKey) => {
    const filter = filters.find((f) => f.key === activeKey);
    return filter ? filter.label : "Select...";
  };

  const getActiveFilterIcon = (filters, activeKey) => {
    const filter = filters.find((f) => f.key === activeKey);
    return filter ? filter.icon : "pi pi-list";
  };

  const getActiveFilterColor = (filters, activeKey) => {
    const filter = filters.find((f) => f.key === activeKey);
    return filter ? filter.color : "#6b7280";
  };

  // Custom click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".custom-dropdown")) {
        setFilterDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFilterSelect = (key) => {
    onFilterChange(key);
    setFilterDropdownOpen(false);
  };

  return (
    <>
      <style>
        {`
          .filter-dropdown-button {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: ${isMobile ? "10px 14px" : "12px 16px"};
            border-radius: 8px;
            border: 1px solid #e2e8f0;
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
            color: #374151;
            font-size: ${isMobile ? "13px" : "14px"};
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
            min-width: ${isMobile ? "160px" : "180px"};
            justify-content: space-between;
          }

          .filter-dropdown-button:hover {
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            border-color: #cbd5e1;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }

          .filter-dropdown-button:active {
            transform: translateY(0);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .filter-dropdown-content {
            display: flex;
            align-items: center;
            gap: 6px;
            flex: 1;
          }

          .filter-dropdown-chevron {
            font-size: 12px;
            color: #6b7280;
            transition: transform 0.2s ease;
          }

          .filter-dropdown-button:hover .filter-dropdown-chevron {
            color: #374151;
          }

          .custom-dropdown {
            position: relative;
          }

          .custom-dropdown-menu {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(0, 0, 0, 0.05);
            z-index: 1000;
            margin-top: 4px;
            padding: 4px;
            min-width: 100%;
          }

          .custom-dropdown-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s ease;
            color: #374151;
            font-size: ${isMobile ? "13px" : "14px"};
          }

          .custom-dropdown-item:hover {
            background-color: #f8fafc;
          }

          .custom-dropdown-item.active {
            background-color: #eff6ff;
            color: #1d4ed8;
            font-weight: 600;
          }

          .custom-dropdown-item i {
            font-size: ${isMobile ? "12px" : "14px"};
          }
        `}
      </style>

      <div
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          borderRadius: "12px",
          padding: isMobile ? "16px" : "20px",
          margin: isMobile ? "0 16px 6px 16px" : "0 20px 4px 20px",
          boxShadow:
            "0 1px 2px rgba(0, 0, 0, 0.05), 0 1px 1px rgba(0, 0, 0, 0.03)",
          border: "1px solid #e2e8f0",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: isMobile ? "12px" : "16px",
            flexWrap: isMobile ? "wrap" : "nowrap",
          }}
        >
          {/* Filter Label */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#374151",
              fontWeight: "600",
              fontSize: isMobile ? "14px" : "16px",
              minWidth: "fit-content",
            }}
          >
            <i
              className="pi pi-filter"
              style={{ fontSize: isMobile ? "14px" : "16px", color: "#6b7280" }}
            />
            <span>Filter Orders</span>
          </div>

          {/* Order Status Filter Dropdown */}
          <div className="custom-dropdown">
            <button
              className="filter-dropdown-button"
              onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
            >
              <div className="filter-dropdown-content">
                <i
                  className={getActiveFilterIcon(orderFilters, activeFilter)}
                  style={{
                    fontSize: isMobile ? "12px" : "14px",
                    color: getActiveFilterColor(orderFilters, activeFilter),
                  }}
                />
                <span>
                  {getActiveFilterLabel(orderFilters, activeFilter)}
                </span>
              </div>
              <i
                className={`pi pi-chevron-down filter-dropdown-chevron ${
                  filterDropdownOpen ? "rotate-180" : ""
                }`}
                style={{
                  transform: filterDropdownOpen
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                }}
              />
            </button>
            {filterDropdownOpen && (
              <div className="custom-dropdown-menu">
                {orderFilters.map((filter) => (
                  <div
                    key={filter.key}
                    className={`custom-dropdown-item ${
                      activeFilter === filter.key ? "active" : ""
                    }`}
                    onClick={() => handleFilterSelect(filter.key)}
                  >
                    <i
                      className={filter.icon}
                      style={{ color: filter.color || "#6b7280" }}
                    />
                    <span>{filter.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Filter Indicator */}
          {activeFilter !== "all" && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginLeft: isMobile ? "0" : "auto",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #0387D9 0%, #0369A1 100%)",
                  color: "#ffffff",
                  padding: "4px 8px",
                  borderRadius: "12px",
                  fontSize: "11px",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                {activeFilter}
                <button
                  onClick={() => onFilterChange("all")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#ffffff",
                    cursor: "pointer",
                    padding: "0",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <i className="pi pi-times" style={{ fontSize: "10px" }} />
                </button>
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const ActiveOrders = ({ onFilterChange, statusCounts = { pending: 0, active: 0, completed: 0, total: 0 }, loading = false, currentStatus = 'all' }) => {
  const [activeFilter, setActiveFilter] = useState(currentStatus); // Initialize with currentStatus

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // Update activeFilter when currentStatus changes (from URL)
  useEffect(() => {
    setActiveFilter(currentStatus);
  }, [currentStatus]);

  // Handle filter change and notify parent component
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);

    // Define filter criteria based on selected filter
    let filterCriteria = {};

    if (filter === "active") {
      // Active orders: partially_confirmed, confirmed, shipped
      filterCriteria = {
        status: ["partially_confirmed", "confirmed", "shipped"],
      };
    } else if (filter === "completed") {
      // Completed orders: delivered
      filterCriteria = {
        status: ["delivered"],
      };
    } else if (filter === "pending") {
      // Pending orders: pending
      filterCriteria = {
        status: ["pending"],
      };
    } else if (filter === "all") {
      // All orders: no filter
      filterCriteria = {};
    }

    // Notify parent component about the filter change
    if (onFilterChange) {
      onFilterChange(filterCriteria);
    }
  };

  return (
    <Box sx={{ 
      width: "100%", 
      bgcolor: "#ffffff", 
      borderRadius: 3, 
      p: isMobile ? 2 : 3,
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05), 0 1px 1px rgba(0, 0, 0, 0.03)",
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
                boxShadow: "0 2px 4px -1px rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.03)",
                border: "1px solid #f1f5f9",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  boxShadow: "0 4px 8px -2px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
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
                boxShadow: "0 2px 4px -1px rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.03)",
                border: "1px solid #f1f5f9",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  boxShadow: "0 4px 8px -2px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
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
                boxShadow: "0 2px 4px -1px rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.03)",
                border: "1px solid #f1f5f9",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  boxShadow: "0 4px 8px -2px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
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

      {/* Filter Component */}
      <OrderFilter 
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        isMobile={isMobile}
      />
    </Box>
  );
};

export default ActiveOrders;
