import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Alert,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { Refresh as RefreshIcon } from "@mui/icons-material";
import { getReportsCharts } from "../../services/admin/adminReportsService";
import RevenueTrendChart from "./charts/RevenueTrendChart";
import UserActivityChart from "./charts/UserActivityChart";
import InventoryHealthChart from "./charts/InventoryHealthChart";

const chartCardSx = {
  height: "100%",
  background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
  border: "1px solid #e2e8f0",
  borderRadius: 3,
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
    borderColor: "primary.main",
  },
};

/**
 * ReportsChartsRow Component
 * Displays three charts: Revenue trend, User activity, and Inventory health
 * Each chart is a separate component for better organization
 *
 * @returns {JSX.Element} ReportsChartsRow component
 */
export default function ReportsChartsRow() {
  const [selectedPeriod, setSelectedPeriod] = useState(30);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch charts data from the API
   * @param {number} period - Number of days to fetch data for
   */
  const fetchCharts = async (period = selectedPeriod) => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching charts data for period:", period);

      const res = await getReportsCharts(period);
      console.log("Charts API response:", res);

      if (res && res.data) {
        setData(res.data);
        console.log("Charts data set:", res.data);
      } else {
        console.error("Invalid API response structure:", res);
        setError("Invalid data structure received from API");
      }
    } catch (err) {
      console.error("Error fetching charts:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle refresh button click
   */
  const handleRefresh = () => {
    fetchCharts();
  };

  /**
   * Handle period filter change
   * @param {Event} e - Select change event
   */
  const handlePeriodChange = (e) => {
    const p = e.target.value;
    setSelectedPeriod(p);
    fetchCharts(p);
  };

  /**
   * Handle chart data point clicks
   * @param {string} chartType - Type of chart (revenue, userActivity, inventory)
   * @param {Object} data - Clicked data point information
   */
  const handleChartClick = (chartType, data) => {
    console.log(`${chartType} chart clicked:`, data);
    // TODO: Implement detailed view modal or navigation
  };

  /**
   * Transform backend data to chart format
   * @param {Object} backendData - Raw data from backend
   * @returns {Object} Formatted data for charts
   */
  const transformChartData = (backendData) => {
    if (!backendData) {
      console.warn("No backend data received for charts");
      return {
        revenueTrend: { data: [] },
        userActivity: { data: [] },
        inventoryHealth: { data: [], total: 0 },
      };
    }

    const { revenueTrend, userActivity, inventoryHealth } = backendData;

    return {
      revenueTrend: {
        data:
          revenueTrend?.labels?.map((label, idx) => ({
            date: label,
            total: revenueTrend.series.total[idx] || 0,
            orders: revenueTrend.series.orders[idx] || 0,
            bookings: revenueTrend.series.bookings[idx] || 0,
          })) || [],
      },
      userActivity: {
        data:
          userActivity?.labels?.map((label, idx) => ({
            period: label,
            crew: userActivity.series.crew[idx] || 0,
            suppliers: userActivity.series.suppliers[idx] || 0,
            vendors: userActivity.series.vendors[idx] || 0,
          })) || [],
      },
      inventoryHealth: {
        data: [
          { name: "In Stock", value: inventoryHealth?.inStock || 0 },
          { name: "Low/Out of Stock", value: inventoryHealth?.lowStock || 0 },
        ],
        total: inventoryHealth?.total || 0,
      },
    };
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchCharts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Transform data when data changes
  const transformedData = transformChartData(data);

  return (
    <Box sx={{ mt: 4 }}>
      {/* Header with refresh button and filter */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <h2
            style={{
              margin: 0,
              fontSize: "1.5rem",
              fontWeight: 600,
              color: "#1f2937",
            }}
          >
            Trends & Analytics
          </h2>
          <p
            style={{
              margin: "4px 0 0 0",
              color: "#6b7280",
              fontSize: "0.875rem",
            }}
          >
            Revenue trends, user activity patterns, and inventory health
            overview
          </p>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <Select
              value={selectedPeriod}
              onChange={handlePeriodChange}
              sx={{
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: 2,
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              }}
            >
              <MenuItem value={7}>Last 7 Days</MenuItem>
              <MenuItem value={30}>Last 30 Days</MenuItem>
              <MenuItem value={90}>Last 3 Months</MenuItem>
              <MenuItem value={180}>Last 6 Months</MenuItem>
            </Select>
          </FormControl>
          <Tooltip title="Refresh data">
            <IconButton
              onClick={handleRefresh}
              disabled={loading}
              sx={{ color: "primary.main" }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Error state */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Charts Grid */}
      <Grid container spacing={3}>
        {/* Revenue Trend Chart */}
        <Grid item xs={12} md={6} lg={4}>
          <Card elevation={0} sx={chartCardSx}>
            <CardContent sx={{ p: 3, height: "100%" }}>
              <RevenueTrendChart
                data={transformedData.revenueTrend.data}
                loading={loading}
                error={error}
                onDataPointClick={(data) => handleChartClick("revenue", data)}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* User Activity Chart */}
        <Grid item xs={12} md={6} lg={4}>
          <Card elevation={0} sx={chartCardSx}>
            <CardContent sx={{ p: 3, height: "100%" }}>
              <UserActivityChart
                data={transformedData.userActivity.data}
                loading={loading}
                error={error}
                onBarClick={(data) => handleChartClick("userActivity", data)}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Inventory Health Chart */}
        <Grid item xs={12} md={6} lg={4}>
          <Card elevation={0} sx={chartCardSx}>
            <CardContent sx={{ p: 3, height: "100%" }}>
              <InventoryHealthChart
                data={transformedData.inventoryHealth.data}
                total={transformedData.inventoryHealth.total}
                loading={loading}
                error={error}
                onSliceClick={(data) => handleChartClick("inventory", data)}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
