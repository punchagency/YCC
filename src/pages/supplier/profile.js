import React, { useState, useEffect } from "react";
import { useUser } from "../../context/userContext";
import { useTheme } from "../../context/theme/themeContext";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Chip,
  Divider,
  Alert,
  Snackbar,
  IconButton,
  Paper,
} from "@mui/material";
import {
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Language as LanguageIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  CloudUpload as UploadIcon,
} from "@mui/icons-material";

const SupplierProfile = () => {
  const { user } = useUser();
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    businessType: "",
    serviceAreas: [],
    deliveryOptions: [],
    contactPerson: {
      fullName: "",
      role: "",
    },
    description: "",
  });

  const [profileImage, setProfileImage] = useState(null);

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
        serviceAreas: user.supplierProfile?.serviceAreas || [],
        deliveryOptions: user.supplierProfile?.deliveryOptions || [],
        contactPerson: {
          fullName: user.supplierProfile?.contactPerson?.fullName || "",
          role: user.supplierProfile?.contactPerson?.role || "",
        },
        description: user.supplierProfile?.description || "",
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleContactPersonChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      contactPerson: {
        ...prev.contactPerson,
        [field]: value,
      },
    }));
  };

  const handleServiceAreasChange = (value) => {
    const areas = value
      .split(",")
      .map((area) => area.trim())
      .filter((area) => area);
    setFormData((prev) => ({
      ...prev,
      serviceAreas: areas,
    }));
  };

  const handleDeliveryOptionsChange = (value) => {
    const options = value
      .split(",")
      .map((option) => option.trim())
      .filter((option) => option);
    setFormData((prev) => ({
      ...prev,
      deliveryOptions: options,
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      // TODO: Implement API call to save profile
      console.log("Saving profile:", formData);

      setSnackbar({
        open: true,
        message: "Profile updated successfully!",
        severity: "success",
      });

      setIsEditing(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error updating profile. Please try again.",
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
        serviceAreas: user.supplierProfile?.serviceAreas || [],
        deliveryOptions: user.supplierProfile?.deliveryOptions || [],
        contactPerson: {
          fullName: user.supplierProfile?.contactPerson?.fullName || "",
          role: user.supplierProfile?.contactPerson?.role || "",
        },
        description: user.supplierProfile?.description || "",
      });
    }
    setIsEditing(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Removed static header, use shared SupplierLayout title bar */}

      <Grid container spacing={3}>
        {/* Profile Header */}
        <Grid item xs={12}>
          <Card
            sx={{
              background: theme === "light" ? "#ffffff" : "#1a1a1a",
              border: "1px solid",
              borderColor: theme === "light" ? "#e0e0e0" : "#333",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                <Box sx={{ position: "relative" }}>
                  <Avatar
                    src={profileImage || user?.profilePicture}
                    sx={{
                      width: 120,
                      height: 120,
                      bgcolor: "#003366",
                      fontSize: "3rem",
                    }}
                  >
                    {formData.businessName
                      ? formData.businessName.charAt(0).toUpperCase()
                      : "S"}
                  </Avatar>
                  {isEditing && (
                    <IconButton
                      component="label"
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        bgcolor: "#003366",
                        color: "white",
                        "&:hover": { bgcolor: "#002244" },
                      }}
                    >
                      <UploadIcon />
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </IconButton>
                  )}
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                    {formData.businessName || "Business Name"}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {formData.businessType || "Business Type"}
                  </Typography>

                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {formData.serviceAreas.map((area, index) => (
                      <Chip
                        key={index}
                        label={area}
                        size="small"
                        sx={{ bgcolor: "#003366", color: "white" }}
                      />
                    ))}
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

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
                    InputProps={{
                      startAdornment: (
                        <LanguageIcon sx={{ mr: 1, color: "text.secondary" }} />
                      ),
                    }}
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
                    value={formData.serviceAreas.join(", ")}
                    onChange={(e) => handleServiceAreasChange(e.target.value)}
                    disabled={!isEditing}
                    placeholder="e.g., Miami, Fort Lauderdale, Palm Beach"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Delivery Options"
                    value={formData.deliveryOptions.join(", ")}
                    onChange={(e) =>
                      handleDeliveryOptionsChange(e.target.value)
                    }
                    disabled={!isEditing}
                    placeholder="e.g., Same Day, Next Day, Scheduled"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Business Description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    disabled={!isEditing}
                    multiline
                    rows={4}
                    placeholder="Describe your business, services, and what makes you unique..."
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Contact Person */}
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
                Contact Person
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={formData.contactPerson.fullName}
                  onChange={(e) =>
                    handleContactPersonChange("fullName", e.target.value)
                  }
                  disabled={!isEditing}
                />

                <TextField
                  fullWidth
                  label="Role"
                  value={formData.contactPerson.role}
                  onChange={(e) =>
                    handleContactPersonChange("role", e.target.value)
                  }
                  disabled={!isEditing}
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

export default SupplierProfile;
