import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Skeleton,
  Alert,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import {
  AttachMoney as RevenueIcon,
  People as UsersIcon,
  Inventory as InventoryIcon,
  BookOnline as BookingsIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { getReportsOverview } from "../../services/admin/adminReportsService";

const ReportsOverviewRow = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(30);

  const fetchStats = async (period = selectedPeriod) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getReportsOverview(period);
      setStats(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRefresh = () => {
    fetchStats();
  };

  const handlePeriodChange = (event) => {
    const newPeriod = event.target.value;
    setSelectedPeriod(newPeriod);
    fetchStats(newPeriod);
  };

  const getPeriodLabel = (period) => {
    switch (period) {
      case 7:
        return "Last 7 Days";
      case 30:
        return "Last 30 Days";
      case 90:
        return "Last 3 Months";
      case 180:
        return "Last 6 Months";
      default:
        return "Last 30 Days";
    }
  };

  const StatCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    color,
    loading: isLoading,
    trend,
  }) => (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        border: "1px solid #e2e8f0",
        borderRadius: 3,
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
          borderColor: color,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              {title}
            </Typography>
            {isLoading ? (
              <Skeleton variant="text" width={80} height={40} />
            ) : (
              <Typography
                variant="h3"
                component="div"
                sx={{
                  fontWeight: 700,
                  color: "text.primary",
                  fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                }}
              >
                {value}
              </Typography>
            )}
            {subtitle && !isLoading && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1, fontWeight: 500 }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: `${color}15`,
              color: color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon sx={{ fontSize: { xs: 24, sm: 28, md: 32 } }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

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
      {/* Header with period filter and refresh button */}
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
            Reports Overview
          </h2>
          <p
            style={{
              margin: "4px 0 0 0",
              color: "#6b7280",
              fontSize: "0.875rem",
            }}
          >
            Key performance indicators and insights
          </p>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          {/* Period Filter */}
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <Select
              value={selectedPeriod}
              onChange={handlePeriodChange}
              displayEmpty
              sx={{
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: 2,
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              }}
            >
              <MenuItem value={7}>Last 7 Days</MenuItem>
              <MenuItem value={30}>Last 30 Days</MenuItem>
              <MenuItem value={90}>Last 3 Months</MenuItem>
              <MenuItem value={180}>Last 6 Months</MenuItem>
            </Select>
          </FormControl>

          {/* Refresh Button */}
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

      <Grid container spacing={3}>
        {/* Revenue Card */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value={
              stats?.revenue?.current
                ? `$${stats.revenue.current.toLocaleString()}`
                : "$0"
            }
            subtitle={
              stats?.revenue?.change
                ? `${stats.revenue.change >= 0 ? "↑" : "↓"} ${Math.abs(
                    stats.revenue.change
                  ).toFixed(1)}% vs last period`
                : "No change"
            }
            icon={RevenueIcon}
            color="#10b981"
            loading={loading}
          />
        </Grid>

        {/* Active Users Card */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Users"
            value={stats?.activeUsers?.ratio || "0/0"}
            subtitle={
              stats?.activeUsers?.percentage
                ? `${stats.activeUsers.percentage.toFixed(1)}% of total users`
                : "0% of total users"
            }
            icon={UsersIcon}
            color="#3b82f6"
            loading={loading}
          />
        </Grid>

        {/* Inventory Health Card */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Inventory Status"
            value={stats?.inventory?.status || "Unknown"}
            subtitle={
              stats?.inventory?.healthScore
                ? `${stats.inventory.healthScore.toFixed(1)}% items in stock`
                : "0% items in stock"
            }
            icon={InventoryIcon}
            color={
              stats?.inventory?.status === "Good"
                ? "#10b981"
                : stats?.inventory?.status === "Warning"
                ? "#f59e0b"
                : "#ef4444"
            }
            loading={loading}
          />
        </Grid>

        {/* Booking Performance Card */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Booking Success"
            value={
              stats?.bookings?.successRate
                ? `${stats.bookings.successRate.toFixed(1)}%`
                : "0%"
            }
            subtitle={
              stats?.bookings?.total
                ? `${stats.bookings.completed}/${stats.bookings.total} completed`
                : "0/0 completed"
            }
            icon={BookingsIcon}
            color="#8b5cf6"
            loading={loading}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReportsOverviewRow;
