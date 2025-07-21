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
  Container,
  Stack,
  useMediaQuery,
  useTheme as useMuiTheme,
  alpha,
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
  CheckCircleOutline as CheckIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { useOutletContext } from "react-router-dom";
import { updateSupplierProfile } from "../../services/supplier/supplierService";

const SupplierProfile = () => {
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
    if (setPageTitle) setPageTitle("Profile");
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

  const handleAddressChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
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
      formDataToSend.append("serviceAreas", formData.serviceAreas.join(", "));
      formDataToSend.append("deliveryOptions", formData.deliveryOptions.join(", "));
      formDataToSend.append("contactPerson.fullName", formData.contactPerson.fullName);
      formDataToSend.append("contactPerson.role", formData.contactPerson.role);
      formDataToSend.append("description", formData.description);
      if (profileImage) {
        formDataToSend.append("profileImage", profileImage);
      }
      const result = await updateSupplierProfile({ supplierId: user.supplierProfile._id, data: formDataToSend });
      console.log("Update result:", result);
      if (result.success) {
        setSnackbar({
          open: true,
          message: result.message,
          severity: "success",
        });
        setIsEditing(false);
      } else {
        setSnackbar({
          open: true,
          message: result.message,
          severity: "error",
        });
      }

    } catch (error) {
      console.error("Error updating profile:", error);
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
    <Box sx={{ p: 4, paddingTop: "80px" }}>
      {/* Profile Status Banner */}
      {!isEditing && (
        <Box 
          sx={{ 
            mb: 3, 
            p: 2, 
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            bgcolor: alpha(muiTheme.palette.success.main, 0.1),
            border: `1px solid ${alpha(muiTheme.palette.success.main, 0.3)}`,
          }}
        >
          <CheckIcon color="success" />
          <Typography>
            Your profile is complete and visible to yacht captains.
          </Typography>
          <Button 
            variant="outlined" 
            color="success" 
            size="small" 
            startIcon={<EditIcon />}
            onClick={() => setIsEditing(true)}
            sx={{ ml: 'auto' }}
          >
            Edit Profile
          </Button>
        </Box>
      )}

      <Grid container spacing={4}>
        {/* Profile Header */}
        <Grid item xs={12}>
          <Card
            elevation={2}
            sx={{
              background: theme === "light" ? "#ffffff" : "#1a1a1a",
              borderRadius: 2,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Background header */}
            <Box 
              sx={{ 
                height: '120px', 
                bgcolor: '#003366',
                background: 'linear-gradient(135deg, #003366 0%, #0066cc 100%)',
              }}
            />
            
            <CardContent sx={{ position: 'relative', pt: 7 }}>
              {/* Avatar positioned to overlap the header */}
              <Box 
                sx={{ 
                  position: "absolute", 
                  top: -60,
                  left: 32,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Avatar
                  src={profileImage || user?.profilePicture}
                  sx={{
                    width: 120,
                    height: 120,
                    bgcolor: "#003366",
                    fontSize: "3rem",
                    border: '4px solid white',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
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
                      bottom: -5,
                      right: -5,
                      bgcolor: "#003366",
                      color: "white",
                      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
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

              <Box sx={{ ml: { xs: 0, sm: 20 }, mt: { xs: 10, sm: 0 } }}>
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  justifyContent="space-between"
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                  spacing={2}
                  mb={2}
                >
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {formData.businessName || "Business Name"}
                  </Typography>
                  
                  {isEditing && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleSave}
                        startIcon={<SaveIcon />}
                      >
                        Save Changes
                      </Button>
                      <Button 
                        variant="outlined" 
                        color="inherit"
                        onClick={handleCancel}
                        startIcon={<CancelIcon />}
                      >
                        Cancel
                      </Button>
                    </Box>
                  )}
                </Stack>
                
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ mb: 2, fontWeight: 500 }}
                >
                  {formData.businessType || "Business Type"}
                </Typography>

                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {formData.serviceAreas.map((area, index) => (
                    <Chip
                      key={index}
                      label={area}
                      size="small"
                      sx={{ 
                        bgcolor: alpha(muiTheme.palette.primary.main, 0.1),
                        color: muiTheme.palette.primary.main,
                        fontWeight: 500,
                        borderRadius: '16px',
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

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
                    onChange={(e) =>
                      handleInputChange("businessName", e.target.value)
                    }
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
                    onChange={(e) => handleInputChange("email", e.target.value)}
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
                    onChange={(e) => handleInputChange("phone", e.target.value)}
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
                    onChange={(e) =>
                      handleInputChange("website", e.target.value)
                    }
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
                    onChange={(e) =>
                      handleInputChange("businessType", e.target.value)
                    }
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
                    value={formData.serviceAreas.join(", ")}
                    onChange={(e) => handleServiceAreasChange(e.target.value)}
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
                    value={formData.deliveryOptions.join(", ")}
                    onChange={(e) =>
                      handleDeliveryOptionsChange(e.target.value)
                    }
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
                    variant="outlined"
                    placeholder="Describe your business, services, and what makes you unique..."
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

        {/* Contact Person */}
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
                <PersonIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Contact Person
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
                <TextField
                  fullWidth
                  label="Full Name"
                  value={formData.contactPerson.fullName}
                  onChange={(e) =>
                    handleContactPersonChange("fullName", e.target.value)
                  }
                  disabled={!isEditing}
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

                <TextField
                  fullWidth
                  label="Role"
                  value={formData.contactPerson.role}
                  onChange={(e) =>
                    handleContactPersonChange("role", e.target.value)
                  }
                  disabled={!isEditing}
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
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
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

export default SupplierProfile;
