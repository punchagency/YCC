import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Box, Typography, Skeleton } from "@mui/material";
import { Receipt as ReceiptIcon } from "@mui/icons-material";

/**
 * InvoicesChart Component
 * Displays a bar chart showing invoice status breakdown
 *
 * @param {Object} props - Component props
 * @param {Array} props.data - Chart data array with status and count properties
 * @param {boolean} props.loading - Loading state
 * @param {string} props.error - Error message
 * @param {Function} props.onBarClick - Callback for bar clicks
 * @returns {JSX.Element} InvoicesChart component
 */
const InvoicesChart = ({
  data = [],
  loading = false,
  error = null,
  onBarClick,
}) => {
  // Chart configuration
  const chartConfig = {
    height: 300,
    barColors: {
      Paid: "#10b981",
      Pending: "#f59e0b",
      Failed: "#ef4444",
    },
    gridColor: "#f1f5f9",
    textColor: "#64748b",
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const barData = payload[0];
      const details = barData.payload.details;

      return (
        <Box
          sx={{
            backgroundColor: "white",
            border: "1px solid #e2e8f0",
            borderRadius: 2,
            p: 2,
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            minWidth: 200,
          }}
        >
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
            {label}
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "primary.main", fontWeight: 600, mb: 1 }}
          >
            {barData.value} invoices
          </Typography>
          {details && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Total Amount: ${details.totalAmount?.toLocaleString() || 0}
              </Typography>
              <br />
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Average: ${details.averageAmount?.toLocaleString() || 0}
              </Typography>
            </Box>
          )}
        </Box>
      );
    }
    return null;
  };

  // Handle bar click
  const handleBarClick = (data) => {
    if (onBarClick && data && data.activePayload) {
      const clickedData = data.activePayload[0];
      onBarClick({
        status: clickedData.payload.status,
        count: clickedData.value,
        details: clickedData.payload.details,
      });
    }
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{ height: chartConfig.height, width: "100%" }}>
        <Skeleton variant="rectangular" height="100%" />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box
        sx={{
          height: chartConfig.height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fef2f2",
          border: "1px solid #fecaca",
          borderRadius: 2,
        }}
      >
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  // No data state
  if (!data || data.length === 0) {
    return (
      <Box
        sx={{
          height: chartConfig.height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: 2,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          No invoice data available
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      {/* Chart Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 2,
        }}
      >
        <ReceiptIcon sx={{ color: "primary.main", fontSize: 20 }} />
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, color: "text.primary" }}
        >
          Invoice Status
        </Typography>
      </Box>

      {/* Chart Container */}
      <ResponsiveContainer width="100%" height={chartConfig.height}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          onClick={handleBarClick}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={chartConfig.gridColor}
            strokeOpacity={0.5}
          />
          <XAxis
            dataKey="status"
            stroke={chartConfig.textColor}
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tick={{ fill: chartConfig.textColor }}
          />
          <YAxis
            stroke={chartConfig.textColor}
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tick={{ fill: chartConfig.textColor }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="count"
            radius={[4, 4, 0, 0]}
            fill={(entry) => chartConfig.barColors[entry.status] || "#3b82f6"}
            stroke="none"
            strokeWidth={0}
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default InvoicesChart;
