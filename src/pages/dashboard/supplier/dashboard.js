import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useInventory } from "../../../context/inventory/inventoryContext";
import { useTheme } from "../../../context/theme/themeContext";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Chip,
  Stack,
  alpha,
  Paper,
} from "@mui/material";
import {
  Inventory as InventoryIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  Dashboard as DashboardIcon,
  ArrowForward as ArrowForwardIcon,
  ShoppingCart as ShoppingCartIcon,
} from "@mui/icons-material";
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import { getSupplierDashboardStats } from "../../../services/supplier/supplierService";

const SupplierDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const { theme } = useTheme();
  const { lowInventory, fetchLowInventory } = useInventory();
  const { setPageTitle } = useOutletContext() || {};
  React.useEffect(() => {
    if (setPageTitle) setPageTitle("Dashboard");
  }, [setPageTitle]);

  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockCount: 0,
    activeOrders: 0,
    totalRevenue: 0,
  });

  const fetchSupplierDashboardStats = async () => {
    const result = await getSupplierDashboardStats({supplierId: user.supplierProfile._id});

    if (result.success) {
      setStats(result.data);
    }
  }

  useEffect(() => {
    fetchLowInventory();
    fetchSupplierDashboardStats();
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStockStatusColor = (status) => {
    switch (status) {
      case "low":
        return "#ff9800";
      case "out":
        return "#f44336";
      default:
        return "#4caf50";
    }
  };
  return (
    <Box sx={{ p: { xs: 0.8, sm: 1, md: 2, lg: 3 }, paddingTop: "50px !important" }}>
      {/* Header with gradient background */}
      <Paper 
        elevation={0}
        sx={{ 
          mb: 4, 
          p: 3,
          borderRadius: 3,
          background: theme === "light" 
            ? 'linear-gradient(135deg, #003366 0%, #0066cc 100%)'
            : 'linear-gradient(135deg, #001a33 0%, #003366 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box 
          sx={{ 
            position: 'absolute', 
            top: -20, 
            right: -20, 
            width: 200, 
            height: 200, 
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            zIndex: 0
          }} 
        />
        <Box 
          sx={{ 
            position: 'absolute', 
            bottom: -40, 
            left: -40, 
            width: 150, 
            height: 150, 
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            zIndex: 0
          }} 
        />
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Welcome back, {user?.supplierProfile?.contactPerson?.fullName || "Supplier"}!
              </Typography>
              <Typography sx={{ opacity: 0.9, color: '#fafafa' }}>
                Manage your inventory and business operations
              </Typography>
            </Box>
            <Chip 
              icon={<DashboardIcon />} 
              label="Supplier Dashboard" 
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.15)', 
                color: 'white',
                fontWeight: 500,
                mt: { xs: 2, sm: 0 },
                '& .MuiChip-icon': { color: 'white' }
              }} 
            />
          </Stack>
        </Box>
      </Paper>

      {/* Quick Stats */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
        <TrendingUpIcon fontSize="small" color="primary" />
        Business Overview
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={2}
            sx={{
              background: theme === "light" ? "#ffffff" : "#1a1a1a",
              borderRadius: 3,
              overflow: 'hidden',
              position: 'relative',
              height: '100%',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)'
              }
            }}
          >
            <Box 
              sx={{ 
                height: '4px', 
                width: '100%', 
                bgcolor: '#003366',
              }}
            />
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  Total Products
                </Typography>
                <Avatar
                  sx={{
                    bgcolor: alpha('#003366', 0.1),
                    width: 40,
                    height: 40,
                    color: '#003366'
                  }}
                >
                  <InventoryIcon />
                </Avatar>
              </Stack>
              <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                {stats.totalProducts}
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                <Chip 
                  size="small" 
                  label="View Inventory" 
                  onClick={() => handleNavigate("/supplier/inventory")} 
                  sx={{ 
                    bgcolor: alpha('#003366', 0.1), 
                    color: '#003366',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }} 
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={2}
            sx={{
              background: theme === "light" ? "#ffffff" : "#1a1a1a",
              borderRadius: 3,
              overflow: 'hidden',
              position: 'relative',
              height: '100%',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)'
              }
            }}
          >
            <Box 
              sx={{ 
                height: '4px', 
                width: '100%', 
                bgcolor: '#ff9800',
              }}
            />
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  Low Stock Items
                </Typography>
                <Avatar
                  sx={{
                    bgcolor: alpha('#ff9800', 0.1),
                    width: 40,
                    height: 40,
                    color: '#ff9800'
                  }}
                >
                  <WarningIcon />
                </Avatar>
              </Stack>
              <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                {stats.lowStockCount}
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                <Chip 
                  size="small" 
                  label="Review Stock" 
                  onClick={() => handleNavigate("/supplier/inventory")} 
                  sx={{ 
                    bgcolor: alpha('#ff9800', 0.1), 
                    color: '#ff9800',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }} 
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={2}
            sx={{
              background: theme === "light" ? "#ffffff" : "#1a1a1a",
              borderRadius: 3,
              overflow: 'hidden',
              position: 'relative',
              height: '100%',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)'
              }
            }}
          >
            <Box 
              sx={{ 
                height: '4px', 
                width: '100%', 
                bgcolor: '#4caf50',
              }}
            />
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  Active Orders
                </Typography>
                <Avatar
                  sx={{
                    bgcolor: alpha('#4caf50', 0.1),
                    width: 40,
                    height: 40,
                    color: '#4caf50'
                  }}
                >
                  <ShoppingCartIcon />
                </Avatar>
              </Stack>
              <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                {stats.activeOrders}
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                <Chip 
                  size="small" 
                  label="View Orders" 
                  onClick={() => handleNavigate("/supplier/orders")} 
                  sx={{ 
                    bgcolor: alpha('#4caf50', 0.1), 
                    color: '#4caf50',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }} 
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={2}
            sx={{
              background: theme === "light" ? "#ffffff" : "#1a1a1a",
              borderRadius: 3,
              overflow: 'hidden',
              position: 'relative',
              height: '100%',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)'
              }
            }}
          >
            <Box 
              sx={{ 
                height: '4px', 
                width: '100%', 
                bgcolor: '#2196f3',
              }}
            />
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  Total Revenue
                </Typography>
                <Avatar
                  sx={{
                    bgcolor: alpha('#2196f3', 0.1),
                    width: 40,
                    height: 40,
                    color: '#2196f3'
                  }}
                >
                  <CurrencyExchangeIcon />
                </Avatar>
              </Stack>
              <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                {formatCurrency(stats.totalRevenue)}
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                <Chip 
                  size="small" 
                  label="View Reports" 
                  onClick={() => handleNavigate("/supplier/reports")} 
                  sx={{ 
                    bgcolor: alpha('#2196f3', 0.1), 
                    color: '#2196f3',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }} 
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Actions */}
      <Typography variant="h6" sx={{ mb: 2, mt: 4, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
        <SettingsIcon fontSize="small" color="primary" />
        Quick Actions
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card
            elevation={2}
            sx={{
              background: theme === "light" ? "#ffffff" : "#1a1a1a",
              borderRadius: 3,
              cursor: "pointer",
              transition: "all 0.3s ease",
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                '& .action-button': {
                  transform: 'translateY(0)',
                  opacity: 1
                }
              },
            }}
            onClick={() => handleNavigate("/supplier/inventory")}
          >
            <Box 
              sx={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '120px',
                background: 'linear-gradient(135deg, #003366 0%, #0066cc 100%)',
                zIndex: 0
              }}
            />
            <CardContent sx={{ position: 'relative', zIndex: 1, p: 3, pt: 10 }}>
              <Avatar
                sx={{
                  bgcolor: "white",
                  color: "#003366",
                  width: 70,
                  height: 70,
                  position: 'absolute',
                  top: 25,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  border: '4px solid white'
                }}
              >
                <InventoryIcon sx={{ fontSize: 36 }} />
              </Avatar>
              
              <Box sx={{ textAlign: "center", mt: 8 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  Inventory Management
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Manage your products, stock levels, and pricing
                </Typography>
                <Button
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  className="action-button"
                  sx={{
                    bgcolor: "#003366",
                    "&:hover": { bgcolor: "#002244" },
                    borderRadius: 8,
                    px: 3,
                    py: 1,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  Manage Inventory
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card
            elevation={2}
            sx={{
              background: theme === "light" ? "#ffffff" : "#1a1a1a",
              borderRadius: 3,
              cursor: "pointer",
              transition: "all 0.3s ease",
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                '& .action-button': {
                  transform: 'translateY(0)',
                  opacity: 1
                }
              },
            }}
            onClick={() => handleNavigate("/supplier/settings")}
          >
            <Box 
              sx={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '120px',
                background: 'linear-gradient(135deg, #ff9800 0%, #ff5722 100%)',
                zIndex: 0
              }}
            />
            <CardContent sx={{ position: 'relative', zIndex: 1, p: 3, pt: 10 }}>
              <Avatar
                sx={{
                  bgcolor: "white",
                  color: "#ff9800",
                  width: 70,
                  height: 70,
                  position: 'absolute',
                  top: 25,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  border: '4px solid white'
                }}
              >
                <SettingsIcon sx={{ fontSize: 36 }} />
              </Avatar>
              
              <Box sx={{ textAlign: "center", mt: 8 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  Settings
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Configure your business settings and preferences
                </Typography>
                <Button
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  className="action-button"
                  sx={{
                    bgcolor: "#ff9800",
                    "&:hover": { bgcolor: "#f57c00" },
                    borderRadius: 8,
                    px: 3,
                    py: 1,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  Open Settings
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card
            elevation={2}
            sx={{
              background: theme === "light" ? "#ffffff" : "#1a1a1a",
              borderRadius: 3,
              cursor: "pointer",
              transition: "all 0.3s ease",
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                '& .action-button': {
                  transform: 'translateY(0)',
                  opacity: 1
                }
              },
            }}
            onClick={() => handleNavigate("/supplier/profile")}
          >
            <Box 
              sx={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '120px',
                background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
                zIndex: 0
              }}
            />
            <CardContent sx={{ position: 'relative', zIndex: 1, p: 3, pt: 10 }}>
              <Avatar
                sx={{
                  bgcolor: "white",
                  color: "#4caf50",
                  width: 70,
                  height: 70,
                  position: 'absolute',
                  top: 25,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  border: '4px solid white'
                }}
              >
                <PersonIcon sx={{ fontSize: 36 }} />
              </Avatar>
              
              <Box sx={{ textAlign: "center", mt: 8 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  Profile
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  View and edit your business profile information
                </Typography>
                <Button
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  className="action-button"
                  sx={{
                    bgcolor: "#4caf50",
                    "&:hover": { bgcolor: "#388e3c" },
                    borderRadius: 8,
                    px: 3,
                    py: 1,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  View Profile
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Low Stock Alert */}
      {lowInventory && lowInventory.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Paper
            elevation={0}
            sx={{
              background: theme === "light" ? alpha('#ff9800', 0.08) : alpha('#ff9800', 0.15),
              borderRadius: 3,
              border: `1px solid ${alpha('#ff9800', 0.3)}`,
              p: 3,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box 
              sx={{ 
                position: 'absolute', 
                top: -30, 
                right: -30, 
                width: 120, 
                height: 120, 
                borderRadius: '50%',
                background: alpha('#ff9800', 0.1),
                zIndex: 0
              }} 
            />
            
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              justifyContent="space-between"
              sx={{ position: 'relative', zIndex: 1 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#ff9800', color: 'white' }}>
                  <WarningIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: theme === "light" ? "#e65100" : "#ff9800" }}>
                    Low Stock Alert
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    You have <b>{lowInventory.length}</b> items with low stock levels that need attention.
                  </Typography>
                </Box>
              </Box>
              
              <Button
                variant="contained"
                onClick={() => handleNavigate("/supplier/inventory")}
                startIcon={<InventoryIcon />}
                sx={{
                  bgcolor: "#ff9800",
                  color: "white",
                  borderRadius: 8,
                  px: 3,
                  "&:hover": {
                    bgcolor: "#f57c00",
                  },
                  boxShadow: '0 4px 12px rgba(255, 152, 0, 0.3)',
                  whiteSpace: 'nowrap'
                }}
              >
                Review Inventory
              </Button>
            </Stack>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default SupplierDashboard;
