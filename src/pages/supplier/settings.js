import React, { useState, useEffect } from "react";
import { useUser } from "../../context/userContext";
import { useTheme } from "../../context/theme/themeContext";
import { useOutletContext } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Snackbar,
  Avatar,
  IconButton,
  Stack,
  Chip,
  Paper,
  Container,
  useMediaQuery,
  useTheme as useMuiTheme,
  alpha,
} from "@mui/material";
import {
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  Cancel as CancelIcon,
  Notifications as NotificationsIcon,
  CheckCircleOutline as CheckIcon,
  Language as LanguageIcon,
} from "@mui/icons-material";
import { updateSupplierProfile } from "../../services/supplier/supplierService";

const SupplierSettings = () => {
  const { user } = useUser();
  const { theme } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const { setPageTitle } = useOutletContext() || {};
  useEffect(() => {
    if (setPageTitle) setPageTitle("Settings");
  }, [setPageTitle]);

  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    phone: "",
    address: {
      street: "",
      street2: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
    website: "",
    businessType: "",
    serviceAreas: "",
    deliveryOptions: "",
    notifications: {
      email: true,
      sms: false,
      lowStock: true,
      newOrders: true,
    },
  });

  useEffect(() => {
    // Load user data
    if (user) {
      setFormData({
        businessName: user.supplierProfile?.businessName || "",
        email: user.email || "",
        phone: user.supplierProfile?.phone || "",
        address: {
          street: user.supplierProfile?.address?.street || "",
          street2: user.supplierProfile?.address?.street2 || "",
          city: user.supplierProfile?.address?.city || "",
          state: user.supplierProfile?.address?.state || "",
          zip: user.supplierProfile?.address?.zip || "",
          country: user.supplierProfile?.address?.country || "",
        },
        website: user.supplierProfile?.website || "",
        businessType: user.supplierProfile?.businessType || "",
        serviceAreas: user.supplierProfile?.serviceAreas?.join(", ") || "",
        deliveryOptions:
          user.supplierProfile?.deliveryOptions?.join(", ") || "",
        notifications: {
          email: true,
          sms: false,
          lowStock: true,
          newOrders: true,
        },
      });
    }
  }, [user]);

    const handleAddressChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }));
  };

  const handleNotificationChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("businessName", formData.businessName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("address.street", formData.address.street);
      formDataToSend.append("address.street2", formData.address.street2);
      formDataToSend.append("address.city", formData.address.city);
      formDataToSend.append("address.state", formData.address.state);
      formDataToSend.append("address.zip", formData.address.zip);
      formDataToSend.append("address.country", formData.address.country);
      formDataToSend.append("website", formData.website);
      formDataToSend.append("businessType", formData.businessType);
      
      // Convert arrays to strings for API
      const serviceAreasStr = typeof formData.serviceAreas === 'string' ? 
        formData.serviceAreas : formData.serviceAreas.join(", ");
      const deliveryOptionsStr = typeof formData.deliveryOptions === 'string' ? 
        formData.deliveryOptions : formData.deliveryOptions.join(", ");
      
      formDataToSend.append("serviceAreas", serviceAreasStr);
      formDataToSend.append("deliveryOptions", deliveryOptionsStr);
      
      // Add notification settings
      formDataToSend.append("notifications.email", formData.notifications.email);
      formDataToSend.append("notifications.sms", formData.notifications.sms);
      formDataToSend.append("notifications.lowStock", formData.notifications.lowStock);
      formDataToSend.append("notifications.newOrders", formData.notifications.newOrders);
      
      const result = await updateSupplierProfile({ supplierId: user.supplierProfile._id, data: formDataToSend });
      
      if (result.success) {
        setSnackbar({
          open: true,
          message: result.message || "Settings saved successfully!",
          severity: "success",
        });
        setIsEditing(false);
      } else {
        setSnackbar({
          open: true,
          message: result.message || "Error saving settings",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      setSnackbar({
        open: true,
        message: "Error saving settings. Please try again.",
        severity: "error",
      });
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    if (user) {
      setFormData({
        businessName: user.supplierProfile?.businessName || "",
        email: user.email || "",
        phone: user.supplierProfile?.phone || "",
        address: {
          street: user.supplierProfile?.address?.street || "",
          street2: user.supplierProfile?.address?.street2 || "",
          city: user.supplierProfile?.address?.city || "",
          state: user.supplierProfile?.address?.state || "",
          zip: user.supplierProfile?.address?.zip || "",
          country: user.supplierProfile?.address?.country || "",
        },
        website: user.supplierProfile?.website || "",
        businessType: user.supplierProfile?.businessType || "",
        serviceAreas: user.supplierProfile?.serviceAreas?.join(", ") || "",
        deliveryOptions:
          user.supplierProfile?.deliveryOptions?.join(", ") || "",
        notifications: {
          email: user.supplierProfile?.notifications?.email || true,
          sms: user.supplierProfile?.notifications?.sms || false,
          lowStock: user.supplierProfile?.notifications?.lowStock || true,
          newOrders: user.supplierProfile?.notifications?.newOrders || true,
        },
      });
    }
    setIsEditing(false);
  };

  return (
    <Box sx={{ p: { xs: 0.8, sm: 1, md: 2, lg: 3 }, paddingTop: "50px !important" }}>
      {/* Settings Status Banner */}
      {!isEditing && (
        <Box 
          sx={{ 
            mb: 3, 
            p: 2, 
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            bgcolor: alpha(muiTheme.palette.info.main, 0.1),
            border: `1px solid ${alpha(muiTheme.palette.info.main, 0.3)}`,
          }}
        >
          <CheckIcon color="info" />
          <Typography>
            Your settings are up to date.
          </Typography>
          <Button 
            variant="outlined" 
            color="info" 
            size="small" 
            startIcon={<EditIcon />}
            onClick={() => setIsEditing(true)}
            sx={{ ml: 'auto' }}
          >
            Edit Settings
          </Button>
        </Box>
      )}

      <Grid container spacing={4}>
        {/* Business Information */}
        <Grid item xs={12} md={8}>
          <Card
            elevation={2}
            sx={{
              background: theme === "light" ? "#ffffff" : "#1a1a1a",
              borderRadius: 2,
              height: '100%',
              transition: 'all 0.3s ease',
              ...(isEditing && {
                boxShadow: `0 0 0 2px ${muiTheme.palette.primary.main}`,
              }),
            }}
          >
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} mb={3}>
                <BusinessIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Business Information
                </Typography>
                {isEditing && (
                  <Chip 
                    label="Editing" 
                    size="small" 
                    color="primary" 
                    sx={{ ml: 'auto' }} 
                  />
                )}
              </Stack>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Business Name"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    disabled={!isEditing}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <BusinessIcon sx={{ mr: 1, color: "primary.main" }} />
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.3s',
                        '&.Mui-focused': {
                          boxShadow: '0 0 0 3px rgba(0, 102, 204, 0.2)',
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <EmailIcon sx={{ mr: 1, color: "primary.main" }} />
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.3s',
                        '&.Mui-focused': {
                          boxShadow: '0 0 0 3px rgba(0, 102, 204, 0.2)',
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!isEditing}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <PhoneIcon sx={{ mr: 1, color: "primary.main" }} />
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.3s',
                        '&.Mui-focused': {
                          boxShadow: '0 0 0 3px rgba(0, 102, 204, 0.2)',
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Website"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    disabled={!isEditing}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <LanguageIcon sx={{ mr: 1, color: "primary.main" }} />
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.3s',
                        '&.Mui-focused': {
                          boxShadow: '0 0 0 3px rgba(0, 102, 204, 0.2)',
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                    Address Information
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Street Address"
                    value={formData.address.street}
                    onChange={(e) =>
                      handleAddressChange("street", e.target.value)
                    }
                    disabled={!isEditing}
                    required
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <LocationIcon sx={{ mr: 1, color: "primary.main" }} />
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.3s',
                        '&.Mui-focused': {
                          boxShadow: '0 0 0 3px rgba(0, 102, 204, 0.2)',
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Street Address 2"
                    value={formData.address.street2}
                    onChange={(e) =>
                      handleAddressChange("street2", e.target.value)
                    }
                    disabled={!isEditing}
                    variant="outlined"
                    placeholder="Apt, Suite, Unit, etc."
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.3s',
                        '&.Mui-focused': {
                          boxShadow: '0 0 0 3px rgba(0, 102, 204, 0.2)',
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="City"
                    value={formData.address.city}
                    onChange={(e) =>
                      handleAddressChange("city", e.target.value)
                    }
                    disabled={!isEditing}
                    required
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.3s',
                        '&.Mui-focused': {
                          boxShadow: '0 0 0 3px rgba(0, 102, 204, 0.2)',
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="State/Province"
                    value={formData.address.state}
                    onChange={(e) =>
                      handleAddressChange("state", e.target.value)
                    }
                    disabled={!isEditing}
                    required
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.3s',
                        '&.Mui-focused': {
                          boxShadow: '0 0 0 3px rgba(0, 102, 204, 0.2)',
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="ZIP/Postal Code"
                    value={formData.address.zip}
                    onChange={(e) =>
                      handleAddressChange("zip", e.target.value)
                    }
                    disabled={!isEditing}
                    required
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.3s',
                        '&.Mui-focused': {
                          boxShadow: '0 0 0 3px rgba(0, 102, 204, 0.2)',
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Country"
                    value={formData.address.country}
                    onChange={(e) =>
                      handleAddressChange("country", e.target.value)
                    }
                    disabled={!isEditing}
                    required
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.3s',
                        '&.Mui-focused': {
                          boxShadow: '0 0 0 3px rgba(0, 102, 204, 0.2)',
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Business Type"
                    value={formData.businessType}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                    disabled={!isEditing}
                    select
                    variant="outlined"
                    SelectProps={{
                      native: true,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.3s',
                        '&.Mui-focused': {
                          boxShadow: '0 0 0 3px rgba(0, 102, 204, 0.2)',
                        },
                      },
                    }}
                  >
                    <option value="">Select Business Type</option>
                    <option value="Food Provisions">Food Provisions</option>
                    <option value="Marine Equipment">Marine Equipment</option>
                    <option value="Cleaning Supplies">Cleaning Supplies</option>
                    <option value="Fuel">Fuel</option>
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Service Areas"
                    value={formData.serviceAreas}
                    onChange={(e) => setFormData({ ...formData, serviceAreas: e.target.value })}
                    disabled={!isEditing}
                    variant="outlined"
                    placeholder="e.g., Miami, Fort Lauderdale, Palm Beach"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.3s',
                        '&.Mui-focused': {
                          boxShadow: '0 0 0 3px rgba(0, 102, 204, 0.2)',
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Delivery Options"
                    value={formData.deliveryOptions}
                    onChange={(e) => setFormData({ ...formData, deliveryOptions: e.target.value })}
                    disabled={!isEditing}
                    variant="outlined"
                    placeholder="e.g., Same Day, Next Day, Scheduled"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.3s',
                        '&.Mui-focused': {
                          boxShadow: '0 0 0 3px rgba(0, 102, 204, 0.2)',
                        },
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Notifications */}
        <Grid item xs={12} md={4}>
          <Card
            elevation={2}
            sx={{
              background: theme === "light" ? "#ffffff" : "#1a1a1a",
              borderRadius: 2,
              height: '100%',
              transition: 'all 0.3s ease',
              ...(isEditing && {
                boxShadow: `0 0 0 2px ${muiTheme.palette.primary.main}`,
              }),
            }}
          >
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} mb={3}>
                <NotificationsIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Notifications
                </Typography>
                {isEditing && (
                  <Chip 
                    label="Editing" 
                    size="small" 
                    color="primary" 
                    sx={{ ml: 'auto' }} 
                  />
                )}
              </Stack>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    bgcolor: alpha(muiTheme.palette.primary.main, 0.05),
                    mb: 1
                  }}
                >
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
                    Notification Channels
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.notifications.email}
                        onChange={(e) =>
                          handleNotificationChange("email", e.target.checked)
                        }
                        disabled={!isEditing}
                        color="primary"
                      />
                    }
                    label={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <EmailIcon fontSize="small" color={formData.notifications.email ? "primary" : "disabled"} />
                        <Typography>Email Notifications</Typography>
                      </Stack>
                    }
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.notifications.sms}
                        onChange={(e) =>
                          handleNotificationChange("sms", e.target.checked)
                        }
                        disabled={!isEditing}
                        color="primary"
                      />
                    }
                    label={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <PhoneIcon fontSize="small" color={formData.notifications.sms ? "primary" : "disabled"} />
                        <Typography>SMS Notifications</Typography>
                      </Stack>
                    }
                  />
                </Paper>

                <Divider sx={{ my: 1 }} />
                
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    bgcolor: alpha(muiTheme.palette.primary.main, 0.05)
                  }}
                >
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
                    Notification Types
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.notifications.lowStock}
                        onChange={(e) =>
                          handleNotificationChange("lowStock", e.target.checked)
                        }
                        disabled={!isEditing}
                        color="primary"
                      />
                    }
                    label="Low Stock Alerts"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.notifications.newOrders}
                        onChange={(e) =>
                          handleNotificationChange("newOrders", e.target.checked)
                        }
                        disabled={!isEditing}
                        color="primary"
                      />
                    }
                    label="New Order Notifications"
                  />
                </Paper>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Action buttons for desktop */}
      {isEditing && !isMobile && (
        <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-end' }}>
          <Button 
            variant="outlined" 
            color="inherit"
            onClick={handleCancel}
            startIcon={<CancelIcon />}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSave}
            startIcon={<SaveIcon />}
          >
            Save Changes
          </Button>
        </Box>
      )}
      
      {/* Bottom action bar for mobile */}
      {isEditing && isMobile && (
        <Paper 
          elevation={3}
          sx={{ 
            position: 'fixed', 
            bottom: 0, 
            left: 0, 
            right: 0, 
            p: 2,
            zIndex: 10,
            display: 'flex',
            justifyContent: 'space-between',
            borderTop: `1px solid ${theme === "light" ? "#e0e0e0" : "#333"}`,
          }}
        >
          <Button 
            variant="outlined" 
            color="inherit"
            onClick={handleCancel}
            startIcon={<CancelIcon />}
            sx={{ flex: 1, mr: 1 }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSave}
            startIcon={<SaveIcon />}
            sx={{ flex: 1 }}
          >
            Save Changes
          </Button>
        </Paper>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SupplierSettings;
