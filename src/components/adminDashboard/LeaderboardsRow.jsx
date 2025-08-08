import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Alert,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Refresh as RefreshIcon } from "@mui/icons-material";
import { getLeaderboards } from "../../services/admin/adminDashboardService";
import TopUsersCard from "./leaderboards/TopUsersCard";
import TopSuppliersCard from "./leaderboards/TopSuppliersCard";
import TopServiceProvidersCard from "./leaderboards/TopServiceProvidersCard";

/**
 * LeaderboardsRow Component
 * Displays three leaderboard cards: Top Users, Top Suppliers, and Top Service Providers
 * Each card shows ranked data with badges and statistics
 *
 * @returns {JSX.Element} LeaderboardsRow component
 */
const LeaderboardsRow = () => {
  const [leaderboardData, setLeaderboardData] = useState({
    topUsers: [],
    topSuppliers: [],
    topServiceProviders: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch leaderboard data from the API
   */
  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getLeaderboards();
      setLeaderboardData(data);
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
    fetchLeaderboardData();
  };

  /**
   * Handle user click in leaderboard
   * @param {Object} user - User data
   * @param {number} index - User rank index
   */
  const handleUserClick = (user, index) => {
    console.log(`User clicked: ${user.name} (Rank ${index + 1})`, user);
    // TODO: Implement detailed user view modal or navigation
  };

  /**
   * Handle supplier click in leaderboard
   * @param {Object} supplier - Supplier data
   * @param {number} index - Supplier rank index
   */
  const handleSupplierClick = (supplier, index) => {
    console.log(
      `Supplier clicked: ${supplier.name} (Rank ${index + 1})`,
      supplier
    );
    // TODO: Implement detailed supplier view modal or navigation
  };

  /**
   * Handle service provider click in leaderboard
   * @param {Object} provider - Service provider data
   * @param {number} index - Provider rank index
   */
  const handleProviderClick = (provider, index) => {
    console.log(
      `Service provider clicked: ${provider.name} (Rank ${index + 1})`,
      provider
    );
    // TODO: Implement detailed provider view modal or navigation
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchLeaderboardData();
  }, []);

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
            Leaderboards
          </h2>
          <p
            style={{
              margin: "4px 0 0 0",
              color: "#6b7280",
              fontSize: "0.875rem",
            }}
          >
            Top performers across the platform
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

      {/* Leaderboards Grid */}
      <Grid container spacing={3}>
        {/* Top Users Card */}
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
              <TopUsersCard
                data={leaderboardData.topUsers}
                loading={loading}
                error={error}
                onUserClick={handleUserClick}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Top Suppliers Card */}
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
              <TopSuppliersCard
                data={leaderboardData.topSuppliers}
                loading={loading}
                error={error}
                onSupplierClick={handleSupplierClick}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Top Service Providers Card */}
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
              <TopServiceProvidersCard
                data={leaderboardData.topServiceProviders}
                loading={loading}
                error={error}
                onProviderClick={handleProviderClick}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LeaderboardsRow;
