import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  TextField,
  CircularProgress,
  Avatar,
  Rating,
  Skeleton
} from "@mui/material";

import { fetchVendorsByServiceCategories, fetchServicesByVendor, createBooking } from "../../../services/crew/crewBookingService";
import { useToast } from "../../../components/Toast";

const CreateBooking = ({
  openSelectServiceCategories, setOpenSelectServiceCategories,
  openSelectVendors, setOpenSelectVendors,
  openVendorServices, setOpenVendorServices,
  openVendorProfile, setOpenVendorProfile,
  openCreateBookingForm, setOpenCreateBookingForm,
  selectedServiceCategories, setSelectedServiceCategories,
  selectedVendor, setSelectedVendor,
  selectedServices, setSelectedServices,
  vendors, setVendors,
  vendorServices, setVendorServices,
  loading, setLoading, fetchBookings, searchTerm, setSearchTerm
}) => {
  const { showSuccess, showError } = useToast();
  const [bookingForm, setBookingForm] = React.useState({
    serviceLocation: '',
    contactPhone: '',
    dateTime: null,
    internalNotes: ''
  });


  // Get all service categories
  const getAllServiceCategories = () => {
    const allCategories = [];
    Object.values(departmentServiceOptions).forEach(categories => {
      allCategories.push(...categories);
    });
    return allCategories.filter((category, index, self) =>
      index === self.findIndex(c => c.value === category.value)
    );
  };

  // Filter categories based on search term
  const getFilteredCategories = () => {
    const allCategories = getAllServiceCategories();
    if (!searchTerm.trim()) return allCategories;
    return allCategories.filter(category =>
      category.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Handle service category selection
  const handleCategorySelect = (category) => {
    setSelectedServiceCategories(prev => {
      const isSelected = prev.includes(category.value);
      if (isSelected) {
        return prev.filter(c => c !== category.value);
      } else {
        return [...prev, category.value];
      }
    });
  };

  // Find service providers
  const handleFindProviders = async () => {
    if (selectedServiceCategories.length === 0) {
      showError('Please select at least one service category');
      return;
    }

    setLoading(true);
    try {
      const response = await fetchVendorsByServiceCategories({ serviceCategories: selectedServiceCategories });

      if (response.status) {
        setVendors(response.data.vendors || []);
        setOpenSelectServiceCategories(false);
        setOpenSelectVendors(true);
      } else {
        showError(response.error || 'Failed to fetch vendors');
      }
    } catch (error) {
      showError('An error occurred while fetching vendors');
    } finally {
      setLoading(false);
    }
  };

  // Handle vendor selection
  const handleVendorSelect = async (vendor) => {
    setSelectedVendor(vendor);
    setLoading(true);
    try {
      const response = await fetchServicesByVendor({ vendorId: vendor._id });
      if (response.status) {
        setVendorServices(response.data.services || []);
        setOpenSelectVendors(false);
        setOpenVendorServices(true);
      } else {
        showError(response.error || 'Failed to fetch vendor services');
      }
    } catch (error) {
      showError('An error occurred while fetching services');
    } finally {
      setLoading(false);
    }
  };

  // Handle service selection (multiple)
  const handleServiceSelect = (service) => {
    setSelectedServices(prev => {
      const isSelected = prev.some(s => s._id === service._id);
      if (isSelected) {
        return prev.filter(s => s._id !== service._id);
      } else {
        return [...prev, service];
      }
    });
  };

  // Proceed to booking form
  const handleProceedToBooking = () => {
    if (selectedServices.length === 0) {
      showError('Please select at least one service');
      return;
    }
    setOpenVendorServices(false);
    setOpenCreateBookingForm(true);
  };

  // Handle booking creation
  const handleCreateBooking = async () => {
    // Validate required fields
    const missingFields = [];
    if (!bookingForm.serviceLocation.trim()) missingFields.push('Service Location');
    if (!bookingForm.contactPhone.trim()) missingFields.push('Contact Phone');
    if (!bookingForm.dateTime) missingFields.push('Date & Time');

    if (missingFields.length > 0) {
      showError(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      return;
    }

    if (selectedServices.length === 0) {
      showError('Please select at least one service');
      return;
    }

    setLoading(true);
    try {
      const bookingData = {
        services: selectedServices.map(service => service._id),
        vendorAssigned: selectedVendor._id,
        vendorName: selectedVendor.businessName,
        vendorLocation: selectedVendor.address ?
          [selectedVendor.address.street, selectedVendor.address.city, selectedVendor.address.state, selectedVendor.address.zip]
            .filter(Boolean)
            .join(', ') || 'Not specified'
          : 'Not specified',
        dateTime: bookingForm.dateTime,
        internalNotes: bookingForm.internalNotes || '',
        serviceLocation: bookingForm.serviceLocation,
        contactPhone: bookingForm.contactPhone
      };

      const response = await createBooking(bookingData);

      if (response.status) {
        showSuccess(`Booking created successfully with ${selectedServices.length} service(s)!`);
        handleCloseAll();
        fetchBookings();
      } else {
        showError(response.error || response.message || 'Failed to create booking');
      }
    } catch (error) {
      showError('An error occurred while creating the booking');
    } finally {
      setLoading(false);
    }
  };

  // Navigation functions
  const goBackToCategories = () => {
    setOpenSelectVendors(false);
    setOpenSelectServiceCategories(true);
  };

  const goBackToVendors = () => {
    setOpenVendorServices(false);
    setOpenSelectVendors(true);
  };

  const goBackToServices = () => {
    setOpenCreateBookingForm(false);
    setOpenVendorServices(true);
  };

  // Close all dialogs and reset state
  const handleCloseAll = () => {
    setOpenSelectServiceCategories(false);
    setOpenSelectVendors(false);
    setOpenVendorServices(false);
    setOpenVendorProfile(false);
    setOpenCreateBookingForm(false);
    setSelectedServiceCategories([]);
    setSelectedVendor(null);
    setSelectedServices([]);
    setVendors([]);
    setVendorServices([]);
    setBookingForm({
      serviceLocation: '',
      contactPhone: '',
      dateTime: null,
      internalNotes: ''
    });
    setSearchTerm('');
  };

  // Empty state component
  const EmptyState = ({ message }) => (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <Typography variant="h6" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );

  // Loading skeleton component
  const LoadingSkeleton = ({ count = 3 }) => (
    <Grid container spacing={2}>
      {Array.from({ length: count }).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card>
            <CardContent>
              <Skeleton variant="text" width="60%" height={24} />
              <Skeleton variant="text" width="80%" height={20} sx={{ mt: 1 }} />
              <Skeleton variant="rectangular" width="100%" height={40} sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <>
      {/* Step 1: Service Categories Selection */}
      <Dialog
        open={openSelectServiceCategories}
        onClose={() => { }}
        disableEscapeKeyDown
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            backgroundColor: '#fff'
          }
        }}
      >
        <DialogTitle sx={{
          textAlign: 'center',
          fontSize: '1.5rem',
          fontWeight: 600,
          py: 2,
          color: '#0387d9'
        }}>
          Select Service Categories
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body1" sx={{ mb: 2, textAlign: 'center', color: 'text.secondary' }}>
            Choose the service categories you need for your booking
          </Typography>
          <TextField
            fullWidth
            placeholder="Search service categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 3 }}
          />
          <Grid container spacing={2}>
            {getFilteredCategories().map((category) => (
              <Grid item xs={12} sm={6} md={4} key={category.value}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    backgroundColor: selectedServiceCategories.includes(category.value) ? '#0387d9' : 'white',
                    color: selectedServiceCategories.includes(category.value) ? 'white' : 'inherit',
                    border: selectedServiceCategories.includes(category.value) ? '2px solid #0387d9' : '1px solid #e0e0e0',
                    borderRadius: 2,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(3,135,217,0.15)'
                    }
                  }}
                  onClick={() => handleCategorySelect(category)}
                >
                  <CardContent sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body2" sx={{
                      fontWeight: selectedServiceCategories.includes(category.value) ? 600 : 400,
                      fontSize: '0.9rem',
                      color: selectedServiceCategories.includes(category.value) ? 'white' : 'inherit'
                    }}>
                      {category.label}
                    </Typography>
                    {/* {selectedServiceCategories.includes(category.value) && (
                      <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                        ✓ Selected
                      </Typography>
                    )} */}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          {selectedServiceCategories.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2">Selected Categories:</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {selectedServiceCategories.map((category) => (
                  <Chip key={category} label={category} size="small" />
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 2 }}>
          <Button
            onClick={handleCloseAll}
            sx={{
              px: '20px',
              py: '10px',
              borderRadius: 1,
              backgroundColor: '#f5f5f5',
              color: '#666',
              '&:hover': { backgroundColor: '#e0e0e0' }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleFindProviders}
            variant="contained"
            disabled={selectedServiceCategories.length === 0 || loading}
            sx={{
              px: '20px',
              py: '10px',
              borderRadius: 1,
              backgroundColor: '#0387d9',
              '&:hover': { backgroundColor: '#0277bd' }
            }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Find Service Providers'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Step 2: Vendor Selection */}
      <Dialog
        open={openSelectVendors}
        onClose={() => { }}
        disableEscapeKeyDown
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            backgroundColor: 'white'
          }
        }}
      >
        <DialogTitle sx={{
          textAlign: 'center',
          fontSize: '1.5rem',
          fontWeight: 600,
          py: 2,
          color: '#0387d9'
        }}>
          Select Vendor
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body1" sx={{ mb: 2, textAlign: 'center', color: 'text.secondary' }}>
            Choose a vendor from the available service providers
          </Typography>
          {loading ? (
            <LoadingSkeleton />
          ) : vendors.length === 0 ? (
            <EmptyState message="No vendors found for the selected service categories" />
          ) : (
            <Grid container spacing={2}>
              {vendors.map((vendor) => (
                <Grid item xs={12} sm={6} key={vendor._id}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      backgroundColor: 'white',
                      borderRadius: 2,
                      border: '1px solid #e0e0e0',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(3,135,217,0.15)',
                        borderColor: '#0387d9'
                      }
                    }}
                    onClick={() => handleVendorSelect(vendor)}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ mr: 2, bgcolor: '#1976d2', width: 48, height: 48 }}>
                          {vendor.businessName?.charAt(0)}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {vendor.businessName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {vendor?.address?.street || ""} {vendor?.address?.city || ""} {vendor?.address?.state || ""} {vendor?.address?.zip || ""}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Rating value={vendor.customerSatisfaction.totalRatings || 2} readOnly size="small" />
                        <Chip
                          label={`${vendor.services?.length || 0} services`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'space-between', gap: 2 }}>
          <Button
            onClick={goBackToCategories}
            sx={{
              px: '20px', py: '10px', borderRadius: 1,
              backgroundColor: '#f5f5f5',
              color: '#666',
              '&:hover': { backgroundColor: '#e0e0e0' }
            }}
          >
            Back
          </Button>
          <Button
            onClick={handleCloseAll}
            sx={{
              px: '20px', py: '10px', borderRadius: 1,
              backgroundColor: '#f44336',
              color: 'white',
              '&:hover': { backgroundColor: '#d32f2f' }
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Step 3: Service Selection */}
      <Dialog
        open={openVendorServices}
        onClose={() => { }}
        disableEscapeKeyDown
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            backgroundColor: 'white'
          }
        }}
      >
        <DialogTitle sx={{
          textAlign: 'center',
          fontSize: '1.5rem',
          fontWeight: 600,
          py: 2,
          color: '#0387d9'
        }}>
          Select Services
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body1" sx={{ mb: 2, textAlign: 'center', color: 'text.secondary' }}>
            Choose services from {selectedVendor?.businessName} (You can select multiple services)
          </Typography>
          {loading ? (
            <LoadingSkeleton />
          ) : vendorServices.length === 0 ? (
            <EmptyState message="No services available from this vendor" />
          ) : (
            <>
              <Grid container spacing={2}>
                {vendorServices.map((service) => {
                  const isSelected = selectedServices.some(s => s._id === service._id);
                  return (
                    <Grid item xs={12} sm={6} key={service._id}>
                      <Card
                        sx={{
                          cursor: 'pointer',
                          backgroundColor: isSelected ? 'rgba(3,135,217,0.1)' : 'white',
                          border: isSelected ? '2px solid #0387d9' : '1px solid #e0e0e0',
                          borderRadius: 2,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(3,135,217,0.15)',
                            borderColor: '#0387d9'
                          }
                        }}
                        onClick={() => handleServiceSelect(service)}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, textTransform: 'capitalize', color: isSelected ? '#0387d9' : 'inherit' }}>
                            {service.name}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 2, minHeight: 40, opacity: 0.8 }}>
                            {service.description || 'No description available'}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#0387d9' }}>
                              ${service.price || 'Price on request'}
                            </Typography>
                            <Chip
                              label={service.duration || 'Duration TBD'}
                              size="small"
                              variant="outlined"
                              color={isSelected ? 'primary' : 'default'}
                            />
                          </Box>
                          {/* {isSelected && (
                            <Typography variant="caption" sx={{ mt: 1, display: 'block', color: '#0387d9', fontWeight: 600 }}>
                              ✓ Selected
                            </Typography>
                          )} */}
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
              {selectedServices.length > 0 && (
                <Box sx={{ mt: 3, p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, color: '#0387d9' }}>
                    Selected Services ({selectedServices.length}):
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedServices.map((service) => (
                      <Chip
                        key={service._id}
                        label={service.name}
                        size="medium"
                        color="primary"
                        onDelete={() => handleServiceSelect(service)}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              onClick={goBackToVendors}
              sx={{
                px: '20px', py: '10px', borderRadius: 1,
                backgroundColor: '#f5f5f5',
                color: '#666',
                '&:hover': { backgroundColor: '#e0e0e0' }
              }}
            >
              Back
            </Button>
            <Button
              onClick={() => setOpenVendorProfile(true)}
              variant="outlined"
              sx={{
                px: '20px', py: '10px', borderRadius: 1,
                borderColor: '#0387d9',
                color: '#0387d9',
                '&:hover': { backgroundColor: 'rgba(3,135,217,0.1)' }
              }}
            >
              View Profile
            </Button>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              onClick={handleCloseAll}
              sx={{
                px: '20px', py: '10px', borderRadius: 1,
                backgroundColor: '#f44336',
                color: 'white',
                '&:hover': { backgroundColor: '#d32f2f' }
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleProceedToBooking}
              variant="contained"
              disabled={selectedServices.length === 0}
              sx={{
                px: '30px', py: '10px', borderRadius: 1,
                backgroundColor: '#0387d9',
                fontWeight: 600,
                '&:hover': { backgroundColor: '#0277bd' },
                '&:disabled': { backgroundColor: '#ccc' }
              }}
            >
              Continue ({selectedServices.length} selected)
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* Step 4: Vendor Profile */}
      <Dialog
        open={openVendorProfile}
        onClose={() => { }}
        disableEscapeKeyDown
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Vendor Profile</DialogTitle>
        <DialogContent>
          {selectedVendor && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ width: 64, height: 64, mr: 2 }}>
                  {selectedVendor.businessName?.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h5">{selectedVendor.contactPerson.fullName}</Typography>
                  <Typography variant="subtitle1">{selectedVendor.contactPerson.role}</Typography>
                  <Rating value={selectedVendor.customerSatisfaction.totalRating || 2} readOnly />
                </Box>
              </Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedVendor.description || 'No description available'}
              </Typography>
              <Typography variant="subtitle2">Contact Information:</Typography>
              <Typography variant="body2">Email: {selectedVendor.user.email}</Typography>
              <Typography variant="body2">Phone: {selectedVendor.phone}</Typography>
              <Typography variant="body2">Address: {(() => {
                const address = selectedVendor?.address;
                if (address && typeof address === "object") {
                  const parts = [];
                  if (address.street) parts.push(address.street);
                  if (address.city) parts.push(address.city);
                  if (address.state) parts.push(address.state);
                  if (address.zip) parts.push(address.zip);
                  return parts.length > 0 ? parts.join(", ") : "Address not provided";
                }
                return "Address not provided";
              })()}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenVendorProfile(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Step 5: Booking Form */}
      <Dialog
        open={openCreateBookingForm}
        onClose={() => { }}
        disableEscapeKeyDown
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            backgroundColor: 'white'
          }
        }}
      >
        <DialogTitle sx={{
          textAlign: 'center',
          fontSize: '1.5rem',
          fontWeight: 600,
          py: 2,
          color: '#0387d9'
        }}>
          Create Booking
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{
            backgroundColor: 'white',
            borderRadius: 2,
            p: 3,
            border: '1px solid #e0e0e0'
          }}>
            <Typography variant="subtitle2" sx={{ mb: 2, color: '#333', cursor: 'pointer', textTransform: 'capitalize', fontWeight: 600 }}>
              Selected Services: {selectedServices.map(s => s.name).join(', ')}
            </Typography>
            <Typography variant="subtitle2" sx={{ mb: 3 }}>
              Vendor: {selectedVendor?.businessName}
            </Typography>

            <TextField
              fullWidth
              label="Service Location *"
              value={bookingForm.serviceLocation}
              onChange={(e) => setBookingForm(prev => ({ ...prev, serviceLocation: e.target.value }))}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Contact Phone *"
              value={bookingForm.contactPhone}
              onChange={(e) => setBookingForm(prev => ({ ...prev, contactPhone: e.target.value }))}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Date & Time *"
              type="datetime-local"
              value={bookingForm.dateTime ? new Date(bookingForm.dateTime).toISOString().slice(0, 16) : ''}
              onChange={(e) => setBookingForm(prev => ({ ...prev, dateTime: new Date(e.target.value) }))}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Internal Notes"
              multiline
              rows={3}
              value={bookingForm.internalNotes}
              onChange={(e) => setBookingForm(prev => ({ ...prev, internalNotes: e.target.value }))}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
          <Button
            onClick={goBackToServices}
            sx={{
              px: '20px', py: '10px', borderRadius: 1,
              backgroundColor: '#f5f5f5',
              color: '#666',
              '&:hover': { backgroundColor: '#e0e0e0' }
            }}
          >
            Back
          </Button>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              onClick={handleCloseAll}
              sx={{
                px: '20px', py: '10px', borderRadius: 1,
                backgroundColor: '#f44336',
                color: 'white',
                '&:hover': { backgroundColor: '#d32f2f' }
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateBooking}
              variant="contained"
              disabled={loading || !bookingForm.serviceLocation || !bookingForm.contactPhone || !bookingForm.dateTime}
              sx={{
                px: '30px', py: '10px', borderRadius: 1,
                backgroundColor: '#0387d9',
                fontWeight: 600,
                '&:hover': { backgroundColor: '#0277bd' },
                '&:disabled': { backgroundColor: '#ccc' }
              }}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : 'Create Booking'}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateBooking;


const departmentServiceOptions = {
  captain: [
    {
      value: "Vessel Management & Administration",
      label: "Vessel Management & Administration",
    },
    {
      value: "Maritime Legal & Compliance Assistance",
      label: "Maritime Legal & Compliance Assistance",
    },
    {
      value: "Crew Recruitment & Placement Services",
      label: "Crew Recruitment & Placement Services",
    },
    {
      value: "Customs & Immigration Assistance",
      label: "Customs & Immigration Assistance",
    },
    {
      value: "Insurance & Risk Management",
      label: "Insurance & Risk Management",
    },
    {
      value: "Security & Anti-Piracy Training",
      label: "Security & Anti-Piracy Training",
    },
    {
      value: "Safety Equipment Inspections & Compliance",
      label: "Safety Equipment Inspections & Compliance",
    },
    {
      value: "IT & Cybersecurity Services for Yachts",
      label: "IT & Cybersecurity Services for Yachts",
    },
    {
      value: "Charter & Itinerary Planning Assistance",
      label: "Charter & Itinerary Planning Assistance",
    },
    {
      value: "Satellite & Internet Connectivity Solutions",
      label: "Satellite & Internet Connectivity Solutions",
    },
  ],
  galley: [
    {
      value: "Fresh Produce & Gourmet Food Provisioning",
      label: "Fresh Produce & Gourmet Food Provisioning",
    },
    {
      value: "Butcher & Seafood Supply Services",
      label: "Butcher & Seafood Supply Services",
    },
    {
      value: "Specialty Ingredient Sourcing",
      label: "Specialty Ingredient Sourcing",
    },
    {
      value: "Custom Catering & Onboard Chef Services",
      label: "Custom Catering & Onboard Chef Services",
    },
    {
      value: "Galley Equipment Maintenance & Repair",
      label: "Galley Equipment Maintenance & Repair",
    },
    {
      value: "Wine, Spirits & Specialty Beverages Supply",
      label: "Wine, Spirits & Specialty Beverages Supply",
    },
    {
      value: "Specialty Coffee & Tea Provisioning",
      label: "Specialty Coffee & Tea Provisioning",
    },
    {
      value: "Dry & Frozen Goods Supply",
      label: "Dry & Frozen Goods Supply",
    },
    {
      value: "Galley Deep Cleaning & Sanitation Services",
      label: "Galley Deep Cleaning & Sanitation Services",
    },
    {
      value: "Kitchenware & Culinary Equipment Supply",
      label: "Kitchenware & Culinary Equipment Supply",
    },
  ],
  engineering: [
    {
      value: "Marine Engine Servicing & Repairs",
      label: "Marine Engine Servicing & Repairs",
    },
    {
      value: "Generator Installation & Maintenance",
      label: "Generator Installation & Maintenance",
    },
    {
      value: "HVAC & Refrigeration Services",
      label: "HVAC & Refrigeration Services",
    },
    {
      value: "Watermaker Installation & Repairs",
      label: "Watermaker Installation & Repairs",
    },
    {
      value: "Fuel System Cleaning & Maintenance",
      label: "Fuel System Cleaning & Maintenance",
    },
    {
      value: "Electrical System Troubleshooting",
      label: "Electrical System Troubleshooting",
    },
    {
      value: "Navigation & Communication System Setup",
      label: "Navigation & Communication System Setup",
    },
    {
      value: "Hydraulic System Servicing",
      label: "Hydraulic System Servicing",
    },
    {
      value: "Welding & Metal Fabrication Services",
      label: "Welding & Metal Fabrication Services",
    },
    {
      value: "Spare Parts Sourcing & Logistics",
      label: "Spare Parts Sourcing & Logistics",
    },
  ],
  interior: [
    {
      value: "Yacht Interior Cleaning & Housekeeping",
      label: "Yacht Interior Cleaning & Housekeeping",
    },
    {
      value: "Laundry & Dry Cleaning Services",
      label: "Laundry & Dry Cleaning Services",
    },
    {
      value: "Custom Interior Design & Refurbishment",
      label: "Custom Interior Design & Refurbishment",
    },
    {
      value: "Florist & Fresh Flower Arrangements",
      label: "Florist & Fresh Flower Arrangements",
    },
    {
      value: "Carpet & Upholstery Cleaning",
      label: "Carpet & Upholstery Cleaning",
    },
    {
      value: "Event & Party Planning Services",
      label: "Event & Party Planning Services",
    },
    {
      value: "Provisioning for Guest Supplies",
      label: "Provisioning for Guest Supplies",
    },
    {
      value: "Bar & Beverage Supply Services",
      label: "Bar & Beverage Supply Services",
    },
    {
      value: "AV & Entertainment System Installation",
      label: "AV & Entertainment System Installation",
    },
    {
      value: "Crew Uniform Tailoring & Embroidery",
      label: "Crew Uniform Tailoring & Embroidery",
    },
  ],
  exterior: [
    {
      value: "Yacht Detailing & Washdowns",
      label: "Yacht Detailing & Washdowns",
    },
    {
      value: "Teak Deck Sanding & Restoration",
      label: "Teak Deck Sanding & Restoration",
    },
    {
      value: "Varnishing & Paintwork Services",
      label: "Varnishing & Paintwork Services",
    },
    {
      value: "Fiberglass & Gelcoat Repairs",
      label: "Fiberglass & Gelcoat Repairs",
    },
    {
      value: "Docking & Line Handling Assistance",
      label: "Docking & Line Handling Assistance",
    },
    {
      value: "Diving & Underwater Hull Cleaning",
      label: "Diving & Underwater Hull Cleaning",
    },
    {
      value: "Fender & Rope Supply & Maintenance",
      label: "Fender & Rope Supply & Maintenance",
    },
    {
      value: "Tender & Jet Ski Servicing",
      label: "Tender & Jet Ski Servicing",
    },
    {
      value: "Watersports Equipment Rental & Repairs",
      label: "Watersports Equipment Rental & Repairs",
    },
    {
      value: "Exterior Upholstery & Canvas Work",
      label: "Exterior Upholstery & Canvas Work",
    },
  ],
  // Add options for other departments as needed
  default: [
    { value: "Mental Health Support", label: "Mental Health Support" },
    { value: "Confidential Therapy", label: "Confidential Therapy" },
    { value: "Career Guidance", label: "Career Guidance" },
    { value: "Legal Consultation", label: "Legal Consultation" },
    { value: "Financial Advisory", label: "Financial Advisory" },
  ],
};