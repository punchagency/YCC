import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../context/userContext";
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
  LinearProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Inventory as InventoryIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";

const SupplierDashboard = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { theme } = useTheme();
  const { lowInventory, fetchLowInventory } = useInventory();
  
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockItems: 0,
    activeOrders: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    fetchLowInventory();
    // TODO: Fetch supplier-specific stats
    setStats({
      totalProducts: 24,
      lowStockItems: 3,
      activeOrders: 8,
      totalRevenue: 15420,
    });
  }, [fetchLowInventory]);

  const handleNavigate = (path) => {
    navigate(path);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStockStatusColor = (status) => {
    switch (status) {
      case 'low':
        return '#ff9800';
      case 'out':
        return '#f44336';
      default:
        return '#4caf50';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          Welcome back, {user?.firstName || 'Supplier'}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your inventory and business operations
        </Typography>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: theme === 'light' ? '#ffffff' : '#1a1a1a',
            border: '1px solid',
            borderColor: theme === 'light' ? '#e0e0e0' : '#333',
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ 
                  bgcolor: '#003366', 
                  mr: 2,
                  width: 48,
                  height: 48,
                }}>
                  <InventoryIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {stats.totalProducts}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Products
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: theme === 'light' ? '#ffffff' : '#1a1a1a',
            border: '1px solid',
            borderColor: theme === 'light' ? '#e0e0e0' : '#333',
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ 
                  bgcolor: '#ff9800', 
                  mr: 2,
                  width: 48,
                  height: 48,
                }}>
                  <WarningIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {stats.lowStockItems}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Low Stock Items
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: theme === 'light' ? '#ffffff' : '#1a1a1a',
            border: '1px solid',
            borderColor: theme === 'light' ? '#e0e0e0' : '#333',
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ 
                  bgcolor: '#4caf50', 
                  mr: 2,
                  width: 48,
                  height: 48,
                }}>
                  <TrendingUpIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {stats.activeOrders}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Orders
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: theme === 'light' ? '#ffffff' : '#1a1a1a',
            border: '1px solid',
            borderColor: theme === 'light' ? '#e0e0e0' : '#333',
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ 
                  bgcolor: '#2196f3', 
                  mr: 2,
                  width: 48,
                  height: 48,
                }}>
                  <CheckCircleIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {formatCurrency(stats.totalRevenue)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Revenue
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Actions */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card 
            sx={{ 
              background: theme === 'light' ? '#ffffff' : '#1a1a1a',
              border: '1px solid',
              borderColor: theme === 'light' ? '#e0e0e0' : '#333',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme === 'light' 
                  ? '0 8px 25px rgba(0,0,0,0.1)' 
                  : '0 8px 25px rgba(255,255,255,0.1)',
              },
            }}
            onClick={() => handleNavigate('/supplier/inventory')}
          >
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Avatar sx={{ 
                bgcolor: '#003366', 
                width: 80, 
                height: 80, 
                mx: 'auto', 
                mb: 2,
              }}>
                <InventoryIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                Inventory Management
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Manage your products, stock levels, and pricing
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                sx={{ 
                  bgcolor: '#003366',
                  '&:hover': { bgcolor: '#002244' },
                }}
              >
                Manage Inventory
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card 
            sx={{ 
              background: theme === 'light' ? '#ffffff' : '#1a1a1a',
              border: '1px solid',
              borderColor: theme === 'light' ? '#e0e0e0' : '#333',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme === 'light' 
                  ? '0 8px 25px rgba(0,0,0,0.1)' 
                  : '0 8px 25px rgba(255,255,255,0.1)',
              },
            }}
            onClick={() => handleNavigate('/supplier/settings')}
          >
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Avatar sx={{ 
                bgcolor: '#ff9800', 
                width: 80, 
                height: 80, 
                mx: 'auto', 
                mb: 2,
              }}>
                <SettingsIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                Settings
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Configure your business settings and preferences
              </Typography>
              <Button 
                variant="contained" 
                sx={{ 
                  bgcolor: '#ff9800',
                  '&:hover': { bgcolor: '#f57c00' },
                }}
              >
                Open Settings
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card 
            sx={{ 
              background: theme === 'light' ? '#ffffff' : '#1a1a1a',
              border: '1px solid',
              borderColor: theme === 'light' ? '#e0e0e0' : '#333',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme === 'light' 
                  ? '0 8px 25px rgba(0,0,0,0.1)' 
                  : '0 8px 25px rgba(255,255,255,0.1)',
              },
            }}
            onClick={() => handleNavigate('/supplier/profile')}
          >
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Avatar sx={{ 
                bgcolor: '#4caf50', 
                width: 80, 
                height: 80, 
                mx: 'auto', 
                mb: 2,
              }}>
                <PersonIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                Profile
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                View and edit your business profile information
              </Typography>
              <Button 
                variant="contained" 
                sx={{ 
                  bgcolor: '#4caf50',
                  '&:hover': { bgcolor: '#388e3c' },
                }}
              >
                View Profile
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Low Stock Alert */}
      {lowInventory && lowInventory.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Card sx={{ 
            background: theme === 'light' ? '#fff3e0' : '#2d1b00',
            border: '1px solid #ff9800',
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: '#e65100' }}>
                ⚠️ Low Stock Alert
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                You have {lowInventory.length} items with low stock levels that need attention.
              </Typography>
              <Button 
                variant="outlined" 
                onClick={() => handleNavigate('/supplier/inventory')}
                sx={{ 
                  borderColor: '#ff9800',
                  color: '#ff9800',
                  '&:hover': { 
                    borderColor: '#f57c00',
                    bgcolor: 'rgba(255, 152, 0, 0.1)',
                  },
                }}
              >
                Review Inventory
              </Button>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default SupplierDashboard; 