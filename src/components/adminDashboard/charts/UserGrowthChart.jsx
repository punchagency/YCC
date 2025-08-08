import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Box, Typography, Skeleton } from "@mui/material";
import { Group as GroupIcon } from "@mui/icons-material";

/**
 * UserGrowthChart Component
 * Displays a line chart showing user growth over the last 30 days
 *
 * @param {Object} props - Component props
 * @param {Array} props.data - Chart data array with date and users properties
 * @param {boolean} props.loading - Loading state
 * @param {string} props.error - Error message
 * @param {Function} props.onDataPointClick - Callback for data point clicks
 * @returns {JSX.Element} UserGrowthChart component
 */
const UserGrowthChart = ({
  data = [],
  loading = false,
  error = null,
  onDataPointClick,
}) => {
  // Chart configuration
  const chartConfig = {
    height: 300,
    strokeColor: "#8b5cf6",
    strokeWidth: 2,
    dotRadius: 4,
    gridColor: "#f1f5f9",
    textColor: "#64748b",
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const pointData = payload[0];
      const details = pointData.payload.details;

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
            {pointData.value} new users
          </Typography>
          {details && (
            <Box sx={{ mt: 1 }}>
              <Typography
                variant="caption"
                sx={{ color: "text.secondary", display: "block" }}
              >
                Crew: {details.crewUsers}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "text.secondary", display: "block" }}
              >
                Suppliers: {details.suppliers}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "text.secondary", display: "block" }}
              >
                Service Providers: {details.serviceProviders}
              </Typography>
            </Box>
          )}
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
        users: clickedData.value,
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
          No user growth data available
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
        <GroupIcon sx={{ color: "primary.main", fontSize: 20 }} />
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, color: "text.primary" }}
        >
          User Growth
        </Typography>
      </Box>

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
            dataKey="users"
            stroke={chartConfig.strokeColor}
            strokeWidth={chartConfig.strokeWidth}
            dot={{
              fill: chartConfig.strokeColor,
              strokeWidth: 2,
              r: chartConfig.dotRadius,
              stroke: "white",
            }}
            activeDot={{
              r: chartConfig.dotRadius + 2,
              stroke: chartConfig.strokeColor,
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

export default UserGrowthChart;
