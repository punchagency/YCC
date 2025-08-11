import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Box, Typography, Skeleton } from "@mui/material";
import { Inventory as InventoryIcon } from "@mui/icons-material";

/**
 * InventoryHealthChart Component
 * Displays a pie chart showing inventory health status
 *
 * @param {Object} props - Component props
 * @param {Array} props.data - Chart data array with name and value properties
 * @param {number} props.total - Total inventory items count
 * @param {boolean} props.loading - Loading state
 * @param {string} props.error - Error message
 * @param {Function} props.onSliceClick - Callback for pie slice clicks
 * @returns {JSX.Element} InventoryHealthChart component
 */
const InventoryHealthChart = ({
  data = [],
  total = 0,
  loading = false,
  error = null,
  onSliceClick,
}) => {
  // Chart configuration
  const chartConfig = {
    height: 300,
    colors: ["#10b981", "#ef4444"],
    gridColor: "#eef2f7",
    textColor: "#64748b",
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <Box
          sx={{
            backgroundColor: "white",
            border: "1px solid #e2e8f0",
            borderRadius: 2,
            p: 2,
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            minWidth: 150,
          }}
        >
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
            {data.name}
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: data.color, fontWeight: 600 }}
          >
            {data.value} items
          </Typography>
        </Box>
      );
    }
    return null;
  };

  // Handle slice click
  const handleSliceClick = (data) => {
    if (onSliceClick && data) {
      onSliceClick({
        name: data.name,
        value: data.value,
        percentage: data.percent,
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
          No inventory data available
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
        <InventoryIcon sx={{ color: "primary.main", fontSize: 20 }} />
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, color: "text.primary" }}
        >
          Inventory Health
        </Typography>
      </Box>

      {/* Chart Description */}
      <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
        Current inventory status and stock level distribution
      </Typography>

      {/* Chart Container */}
      <ResponsiveContainer width="100%" height={chartConfig.height}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
            labelLine={false}
            onClick={handleSliceClick}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={chartConfig.colors[index]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default InventoryHealthChart;
