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
} from "@mui/material";
import {
  People as PeopleIcon,
  Business as BusinessIcon,
  Support as SupportIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { getUserStats } from "../../services/admin/adminDashboardService";

const UserStatsRow = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserStats();
      setStats(data);
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

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    loading: isLoading,
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
                {value?.toLocaleString()}
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
      {/* Header with refresh button */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
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
            User Statistics
          </h2>
          <p
            style={{
              margin: "4px 0 0 0",
              color: "#6b7280",
              fontSize: "0.875rem",
            }}
          >
            Platform user overview
          </p>
        </Box>
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

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Crew Users"
            value={stats?.totalCrewUsers}
            icon={PeopleIcon}
            color="#3b82f6"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Suppliers"
            value={stats?.totalSuppliers}
            icon={BusinessIcon}
            color="#10b981"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Service Providers"
            value={stats?.totalServiceProviders}
            icon={SupportIcon}
            color="#f59e0b"
            loading={loading}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserStatsRow;
