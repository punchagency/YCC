import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Box, Typography, Skeleton } from "@mui/material";
import { People as PeopleIcon } from "@mui/icons-material";

/**
 * UserActivityChart Component
 * Displays a stacked bar chart showing user activity by role over time
 *
 * @param {Object} props - Component props
 * @param {Array} props.data - Chart data array with period, crew, suppliers, and vendors properties
 * @param {boolean} props.loading - Loading state
 * @param {string} props.error - Error message
 * @param {Function} props.onBarClick - Callback for bar clicks
 * @returns {JSX.Element} UserActivityChart component
 */
const UserActivityChart = ({
  data = [],
  loading = false,
  error = null,
  onBarClick,
}) => {
  // Chart configuration
  const chartConfig = {
    height: 300,
    barColors: {
      crew: "#3b82f6",
      suppliers: "#10b981",
      vendors: "#f59e0b",
    },
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
                {entry.name === "vendors" ? "Service Providers" : entry.name}:{" "}
                {entry.value} users
              </Typography>
            </Box>
          ))}
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
        period: clickedData.payload.period,
        role: clickedData.dataKey,
        count: clickedData.value,
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
          No user activity data available
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
        <PeopleIcon sx={{ color: "primary.main", fontSize: 20 }} />
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, color: "text.primary" }}
        >
          User Activity
        </Typography>
      </Box>

      {/* Chart Description */}
      <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
        Active users by role: crew, suppliers, and service providers
      </Typography>

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
            dataKey="period"
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
            dataKey="crew"
            name="Crew"
            stackId="a"
            fill={chartConfig.barColors.crew}
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="suppliers"
            name="Suppliers"
            stackId="a"
            fill={chartConfig.barColors.suppliers}
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="vendors"
            name="Service Providers"
            stackId="a"
            fill={chartConfig.barColors.vendors}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default UserActivityChart;
