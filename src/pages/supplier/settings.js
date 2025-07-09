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
} from "@mui/material";
import {
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Save as SaveIcon,
  Edit as EditIcon,
} from "@mui/icons-material";

const SupplierSettings = () => {
  const { user } = useUser();
  const { theme } = useTheme();
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
    address: "",
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
        address: user.supplierProfile?.address || "",
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

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
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
      // TODO: Implement API call to save settings
      console.log("Saving settings:", formData);

      setSnackbar({
        open: true,
        message: "Settings saved successfully!",
        severity: "success",
      });

      setIsEditing(false);
    } catch (error) {
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
        address: user.supplierProfile?.address || "",
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
    setIsEditing(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Removed static header, use shared SupplierLayout title bar */}

      <Grid container spacing={3}>
        {/* Business Information */}
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              background: theme === "light" ? "#ffffff" : "#1a1a1a",
              border: "1px solid",
              borderColor: theme === "light" ? "#e0e0e0" : "#333",
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Business Information
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Business Name"
                    value={formData.businessName}
                    onChange={(e) =>
                      handleInputChange("businessName", e.target.value)
                    }
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: (
                        <BusinessIcon sx={{ mr: 1, color: "text.secondary" }} />
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: (
                        <EmailIcon sx={{ mr: 1, color: "text.secondary" }} />
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: (
                        <PhoneIcon sx={{ mr: 1, color: "text.secondary" }} />
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Website"
                    value={formData.website}
                    onChange={(e) =>
                      handleInputChange("website", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    disabled={!isEditing}
                    multiline
                    rows={2}
                    InputProps={{
                      startAdornment: (
                        <LocationIcon sx={{ mr: 1, color: "text.secondary" }} />
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Business Type"
                    value={formData.businessType}
                    onChange={(e) =>
                      handleInputChange("businessType", e.target.value)
                    }
                    disabled={!isEditing}
                    select
                    SelectProps={{
                      native: true,
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
                    onChange={(e) =>
                      handleInputChange("serviceAreas", e.target.value)
                    }
                    disabled={!isEditing}
                    placeholder="e.g., Miami, Fort Lauderdale, Palm Beach"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Delivery Options"
                    value={formData.deliveryOptions}
                    onChange={(e) =>
                      handleInputChange("deliveryOptions", e.target.value)
                    }
                    disabled={!isEditing}
                    placeholder="e.g., Same Day, Next Day, Scheduled"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Notifications */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              background: theme === "light" ? "#ffffff" : "#1a1a1a",
              border: "1px solid",
              borderColor: theme === "light" ? "#e0e0e0" : "#333",
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Notifications
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.notifications.email}
                      onChange={(e) =>
                        handleNotificationChange("email", e.target.checked)
                      }
                      disabled={!isEditing}
                    />
                  }
                  label="Email Notifications"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.notifications.sms}
                      onChange={(e) =>
                        handleNotificationChange("sms", e.target.checked)
                      }
                      disabled={!isEditing}
                    />
                  }
                  label="SMS Notifications"
                />

                <Divider />

                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.notifications.lowStock}
                      onChange={(e) =>
                        handleNotificationChange("lowStock", e.target.checked)
                      }
                      disabled={!isEditing}
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
                    />
                  }
                  label="New Order Notifications"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SupplierSettings;
