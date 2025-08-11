import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Box, Typography, Skeleton } from "@mui/material";
import { TrendingUp as TrendingUpIcon } from "@mui/icons-material";

/**
 * RevenueTrendChart Component
 * Displays a line chart showing revenue trends over time
 *
 * @param {Object} props - Component props
 * @param {Array} props.data - Chart data array with date, total, orders, and bookings properties
 * @param {boolean} props.loading - Loading state
 * @param {string} props.error - Error message
 * @param {Function} props.onDataPointClick - Callback for data point clicks
 * @returns {JSX.Element} RevenueTrendChart component
 */
const RevenueTrendChart = ({
  data = [],
  loading = false,
  error = null,
  onDataPointClick,
}) => {
  // Chart configuration
  const chartConfig = {
    height: 300,
    strokeColors: {
      total: "#3b82f6",
      orders: "#10b981",
      bookings: "#8b5cf6",
    },
    strokeWidth: 2,
    dotRadius: 4,
    gridColor: "#eef2f7",
    textColor: "#64748b",
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
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
          {payload.map((entry, index) => (
            <Box key={index} sx={{ mb: 1 }}>
              <Typography
                variant="body1"
                sx={{ color: entry.color, fontWeight: 600 }}
              >
                {entry.name}: ${entry.value?.toLocaleString() || 0}
              </Typography>
            </Box>
          ))}
        </Box>
      );
    }
    return null;
  };

  // Handle data point click
  const handleDataPointClick = (data) => {
    if (onDataPointClick && data && data.activePayload) {
      const clickedData = data.activePayload[0];
      onDataPointClick({
        date: clickedData.payload.date,
        total: clickedData.payload.total,
        orders: clickedData.payload.orders,
        bookings: clickedData.payload.bookings,
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
          No revenue data available
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
        <TrendingUpIcon sx={{ color: "primary.main", fontSize: 20 }} />
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, color: "text.primary" }}
        >
          Revenue Trend
        </Typography>
      </Box>

      {/* Chart Description */}
      <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
        Revenue breakdown by orders and bookings over time
      </Typography>

      {/* Chart Container */}
      <ResponsiveContainer width="100%" height={chartConfig.height}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          onClick={handleDataPointClick}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={chartConfig.gridColor}
            strokeOpacity={0.5}
          />
          <XAxis
            dataKey="date"
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
          <Line
            type="monotone"
            dataKey="total"
            name="Total Revenue"
            stroke={chartConfig.strokeColors.total}
            strokeWidth={chartConfig.strokeWidth}
            dot={{
              fill: chartConfig.strokeColors.total,
              strokeWidth: 2,
              r: chartConfig.dotRadius,
              stroke: "white",
            }}
            activeDot={{
              r: chartConfig.dotRadius + 2,
              stroke: chartConfig.strokeColors.total,
              strokeWidth: 2,
              fill: "white",
            }}
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="orders"
            name="Orders"
            stroke={chartConfig.strokeColors.orders}
            strokeWidth={chartConfig.strokeWidth}
            dot={{
              fill: chartConfig.strokeColors.orders,
              strokeWidth: 2,
              r: chartConfig.dotRadius,
              stroke: "white",
            }}
            activeDot={{
              r: chartConfig.dotRadius + 2,
              stroke: chartConfig.strokeColors.orders,
              strokeWidth: 2,
              fill: "white",
            }}
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="bookings"
            name="Bookings"
            stroke={chartConfig.strokeColors.bookings}
            strokeWidth={chartConfig.strokeWidth}
            dot={{
              fill: chartConfig.strokeColors.bookings,
              strokeWidth: 2,
              r: chartConfig.dotRadius,
              stroke: "white",
            }}
            activeDot={{
              r: chartConfig.dotRadius + 2,
              stroke: chartConfig.strokeColors.bookings,
              strokeWidth: 2,
              fill: "white",
            }}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default RevenueTrendChart;
