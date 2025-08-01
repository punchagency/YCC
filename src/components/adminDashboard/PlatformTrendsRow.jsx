import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Alert,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Refresh as RefreshIcon } from "@mui/icons-material";
import { getPlatformTrends } from "../../services/admin/adminDashboardService";
import OrdersChart from "./charts/OrdersChart";
import InvoicesChart from "./charts/InvoicesChart";
import UserGrowthChart from "./charts/UserGrowthChart";
import ChartFilter from "./charts/ChartFilter";

/**
 * PlatformTrendsRow Component
 * Displays three charts: Orders over time, Invoice status, and User growth
 * Each chart fetches its own data and handles its own state
 *
 * @returns {JSX.Element} PlatformTrendsRow component
 */
const PlatformTrendsRow = () => {
  const [chartData, setChartData] = useState({
    ordersChart: { labels: [], data: [], details: {} },
    invoicesChart: { labels: [], data: [], details: {} },
    userGrowthChart: { labels: [], data: [], details: {} },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDays, setSelectedDays] = useState(30);

  /**
   * Fetch platform trends data from the API
   * @param {number} days - Number of days to fetch data for
   */
  const fetchChartData = async (days = selectedDays) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPlatformTrends(days);
      setChartData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle refresh button click
   */
  const handleRefresh = () => {
    fetchChartData();
  };

  /**
   * Handle filter change
   * @param {number} days - New number of days to filter by
   */
  const handleFilterChange = (days) => {
    setSelectedDays(days);
    fetchChartData(days);
  };

  /**
   * Handle chart data point clicks
   * @param {string} chartType - Type of chart (orders, invoices, userGrowth)
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
    const { ordersChart, invoicesChart, userGrowthChart } = backendData;

    return {
      ordersChart: {
        data: ordersChart.labels.map((label, index) => ({
          date: label,
          orders: ordersChart.data[index],
          details: ordersChart.details[label] || {},
        })),
      },
      invoicesChart: {
        data: invoicesChart.labels.map((label, index) => ({
          status: label,
          count: invoicesChart.data[index],
          details: invoicesChart.details[label] || {},
        })),
      },
      userGrowthChart: {
        data: userGrowthChart.labels.map((label, index) => ({
          date: label,
          users: userGrowthChart.data[index],
          details: userGrowthChart.details[label] || {},
        })),
      },
    };
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchChartData();
  }, []);

  // Transform data when chartData changes
  const transformedData = transformChartData(chartData);

  // Error state
  if (error) {
    return (
      <Box sx={{ mb: 4 }}>
        <Alert
          severity="error"
          action={
            <Tooltip title="Refresh data">
              <IconButton color="inherit" size="small" onClick={handleRefresh}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      {/* Header with refresh button and filter */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "center" },
          justifyContent: "space-between",
          gap: { xs: 2, sm: 0 },
          mb: 3,
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
            Platform Trends
          </h2>
          <p
            style={{
              margin: "4px 0 0 0",
              color: "#6b7280",
              fontSize: "0.875rem",
            }}
          >
            Data overview
          </p>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            justifyContent: { xs: "space-between", sm: "flex-end" },
            width: { xs: "100%", sm: "auto" },
          }}
        >
          <ChartFilter
            selectedDays={selectedDays}
            onFilterChange={handleFilterChange}
          />
          <Tooltip title="Refresh data">
            <IconButton
              onClick={handleRefresh}
              disabled={loading}
              sx={{
                color: "primary.main",
                "&:hover": { backgroundColor: "primary.50" },
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Charts Grid */}
      <Grid container spacing={3}>
        {/* Orders Chart */}
        <Grid item xs={12} lg={4}>
          <Card
            elevation={0}
            sx={{
              height: "100%",
              background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
              border: "1px solid #e2e8f0",
              borderRadius: 3,
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
              },
            }}
          >
            <CardContent sx={{ p: 3, height: "100%" }}>
              <OrdersChart
                data={transformedData.ordersChart.data}
                loading={loading}
                error={error}
                onDataPointClick={(data) => handleChartClick("orders", data)}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Invoices Chart */}
        <Grid item xs={12} lg={4}>
          <Card
            elevation={0}
            sx={{
              height: "100%",
              background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
              border: "1px solid #e2e8f0",
              borderRadius: 3,
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
              },
            }}
          >
            <CardContent sx={{ p: 3, height: "100%" }}>
              <InvoicesChart
                data={transformedData.invoicesChart.data}
                loading={loading}
                error={error}
                onBarClick={(data) => handleChartClick("invoices", data)}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* User Growth Chart */}
        <Grid item xs={12} lg={4}>
          <Card
            elevation={0}
            sx={{
              height: "100%",
              background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
              border: "1px solid #e2e8f0",
              borderRadius: 3,
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
              },
            }}
          >
            <CardContent sx={{ p: 3, height: "100%" }}>
              <UserGrowthChart
                data={transformedData.userGrowthChart.data}
                loading={loading}
                error={error}
                onDataPointClick={(data) =>
                  handleChartClick("userGrowth", data)
                }
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PlatformTrendsRow;
