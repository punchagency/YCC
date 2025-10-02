import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Box,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  TextField,
  Button,
  Chip,
  Paper,
  Alert,
  Divider,
  Skeleton,
  Rating,
  TextareaAutosize
} from '@mui/material';
import {
  LocationOn,
  Phone,
  Business,
  ArrowBack,
  CheckCircle,
  Schedule,
  Place,
} from '@mui/icons-material';
import { createBooking } from '../../../services/crew/crewBookingService';
import { useToast } from '../../../components/Toast';

// DatePicker custom styles
const datePickerStyles = `
  .full-width-datepicker .react-datepicker-wrapper {
    width: 100% !important;
  }
  .full-width-datepicker .react-datepicker__input-container  .react-datepicker-wrapper .full-width-datepicker {
    width: 100% !important;
  }
`;

const ConfirmBookingForm = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const service = state?.service;
  const { showSuccess, showError } = useToast();

  // Form states
  const [loading, setLoading] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    serviceLocation: state?.formData?.address || '',
    contactPhone: state?.formData?.phone || '',
    dateTime: null,
    internalNotes: '',
  });

  // Validation states
  const [errors, setErrors] = useState({});
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Handle image loading
  useEffect(() => {
    if (service?.image) {
      const img = new Image();
      img.onload = () => setImageLoading(false);
      img.onerror = () => {
        setImageLoading(false);
        setImageError(true);
      };
      img.src = service.image;
    } else {
      setImageLoading(false);
    }
  }, [service?.image]);

  // Redirect if no service data
  useEffect(() => {
    if (!service) {
      navigate('/crew/booking');
      showError('No service selected for booking');
    }
  }, [service, navigate, showError]);

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!bookingForm.serviceLocation.trim()) {
      newErrors.serviceLocation = 'Service location is required';
    }

    if (!bookingForm.contactPhone.trim()) {
      newErrors.contactPhone = 'Contact phone is required';
    } else if (bookingForm.contactPhone.trim().length < 10) {
      newErrors.contactPhone = 'Please enter a valid phone number';
    }

    if (!bookingForm.dateTime) {
      newErrors.dateTime = 'Date and time are required';
    } else if (new Date(bookingForm.dateTime) <= new Date()) {
      newErrors.dateTime = 'Please select a future date and time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setBookingForm(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleCreateBooking = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    const bookingData = {
      services: [service._id],
      vendorAssigned: service.vendor._id,
      vendorName: service.vendor.businessName,
      vendorLocation: service.vendor.address ?
        [service.vendor.address.street, service.vendor.address.city, service.vendor.address.state, service.vendor.address.zip]
          .filter(Boolean)
          .join(', ') || 'Not specified'
        : 'Not specified',
      dateTime: bookingForm.dateTime ? bookingForm.dateTime.toISOString() : null,
      internalNotes: bookingForm.internalNotes || '',
      serviceLocation: bookingForm.serviceLocation,
      contactPhone: `+${bookingForm.contactPhone}`,
    };

    try {
      const response = await createBooking(bookingData);
      if (response.status) {
        showSuccess('Booking created successfully! You will receive a confirmation shortly.');
        navigate('/crew/booking', {
          state: {
            newBooking: response.booking,
            message: 'Your booking has been submitted successfully'
          }
        });
      } else {
        showError(response.error || response.message || 'Failed to create booking');
      }
    } catch (error) {
      showError(error.message || 'An error occurred while creating the booking');
    } finally {
      setLoading(false);
    }
  };


  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [])

  if (!service) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          No service selected. Redirecting...
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <style>{datePickerStyles}</style>
      <Box sx={{ py: { xs: 1, md: 4 }, px: { xs: 0, md: 4 } }}>
        {/* Header */}
        <Box sx={{ mb: { xs: 2, md: 4 } }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/crew/booking/new-create-booking')}
            sx={{
              mb: 2,
              textTransform: 'none',
              color: '#0387d9',
              fontWeight: 500,
              '&:hover': { bgcolor: 'grey.100' }
            }}
          >
            Back to Services
          </Button>

          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontWeight: 600,
              mb: { xs: 0.5, md: 1 },
              background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Confirm Your Booking
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: { xs: 0.5, md: 2 } }}>
            Review details and complete your service booking
          </Typography>
        </Box>

        {/* Service Information Card */}
        <Card
          sx={{
            mb: { xs: 2, md: 4 },
            borderRadius: 3,
            boxShadow: (theme) => `0 8px 32px ${theme.palette.primary.main}15`,
            overflow: 'hidden',
          }}
        >
          <Grid container>
            {/* Service Image */}
            <Grid item xs={12} md={4}>
              <Box sx={{ position: 'relative', height: { xs: 250, md: '100%' } }}>
                {imageLoading && (
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height="100%"
                    sx={{ position: 'absolute', top: 0, left: 0 }}
                  />
                )}
                {!imageError && !imageLoading && (
                  <CardMedia
                    component="img"
                    src={service.image || '/placeholder-service.jpg'}
                    alt={service.name}
                    onLoad={() => setImageLoading(false)}
                    onError={() => setImageError(true)}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: imageLoading ? 'none' : 'block',
                    }}
                  />
                )}
                {imageError && (
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      bgcolor: 'grey.200',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                    }}
                  >
                    <Business sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
                    <Typography variant="caption" color="text.secondary">
                      Service Image
                    </Typography>
                  </Box>
                )}
                {service.category && (
                  <Chip
                    label={service.category}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 16,
                      left: 16,
                      bgcolor: 'primary.main',
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  />
                )}
              </Box>
            </Grid>

            {/* Service Details */}
            <Grid item xs={12} md={8}>
              <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 1 }}>
                  {service.name}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                  Professional service provided by experienced crew members with expertise in {service.category}.
                </Typography>

                <Divider sx={{ my: 2 }} />

                {/* Vendor Information */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Business sx={{ fontSize: 20, color: 'primary.main', mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {service.vendor?.businessName || 'Service Provider'}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating
                      value={service.vendor?.customerSatisfaction?.averageScore || 0}
                      size="small"
                      readOnly
                      precision={0.5}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      ({service.vendor?.customerSatisfaction?.totalRatings || 0} reviews)
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOn sx={{ fontSize: 18, color: 'text.secondary', mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {service.vendor?.address?.city || 'Location'}, {service.vendor?.address?.country || 'Country'}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Phone sx={{ fontSize: 18, color: 'text.secondary', mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {service.vendor?.phone || 'Contact available after booking'}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Price and Booking Method */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h4" color="primary.main" sx={{ fontWeight: 700 }}>
                      ${service.price}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      per service
                    </Typography>
                  </Box>
                  <Chip
                    label={service.vendor?.bookingMethod === 'instant booking' ? 'Instant Booking' : 'Booking Required'}
                    color={service.vendor?.bookingMethod === 'instant booking' ? 'success' : 'default'}
                    variant="outlined"
                    sx={{ fontWeight: 500 }}
                  />
                </Box>
              </CardContent>
            </Grid>
          </Grid>
        </Card>
        <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
            <Schedule sx={{ mr: 1, color: 'primary.main' }} />
            Booking Information
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <TextField
                fullWidth
                label="Service Location *"
                placeholder="Enter the address where service is needed"
                value={bookingForm.serviceLocation}
                onChange={handleInputChange('serviceLocation')}
                error={!!errors.serviceLocation}
                helperText={errors.serviceLocation}
                InputProps={{
                  startAdornment: <Place sx={{ color: 'action.active', mr: 1 }} />,
                }}
                size="medium"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    backgroundColor: "#F9FAFB",
                    "& fieldset": {
                      borderColor: "#E5E7EB",
                    },
                    "&:hover fieldset": {
                      borderColor: "#D1D5DB",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#0387D9",
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Box>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: 'rgba(0, 0, 0, 0.87)' }}>
                  Contact Phone *
                </label>
                <PhoneInput
                  country={'us'}
                  value={bookingForm.contactPhone}
                  onChange={(phone) => {
                    setBookingForm(prev => ({ ...prev, contactPhone: phone }));
                    // Clear error when user starts typing
                    if (errors.contactPhone) {
                      setErrors(prev => ({ ...prev, contactPhone: null }));
                    }
                  }}
                  containerStyle={{
                    width: '100%',
                  }}
                  inputStyle={{
                    width: '100%',
                    height: "55px",
                    borderRadius: '10px',
                    backgroundColor: '#F9FAFB',
                    border: '2px solid #E5E7EB',
                    fontSize: '16px',
                    padding: '16.5px 14px 16.5px 58px',
                    outline: 'none',
                    transition: 'border-color 0.2s ease-in-out',
                  }}
                  buttonStyle={{
                    height: "55px",
                    border: '2px solid #E5E7EB',
                    borderRadius: '10px 0 0 10px',
                    backgroundColor: '#F9FAFB',
                  }}
                  specialLabel=""
                />
                {errors.contactPhone && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                    {errors.contactPhone}
                  </Typography>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ width: '100%' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: 'rgba(0, 0, 0, 0.87)' }}>
                  Preferred Date & Time *
                </label>
                <DatePicker
                  selected={bookingForm.dateTime ? new Date(bookingForm.dateTime) : null}
                  onChange={(date) => {
                    setBookingForm(prev => ({ ...prev, dateTime: date }));
                    // Clear error when user selects a date
                    if (errors.dateTime) {
                      setErrors(prev => ({ ...prev, dateTime: null }));
                    }
                  }}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={30}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  timeCaption="Time"
                  placeholderText="Select date and time"
                  minDate={new Date()}
                  wrapperClassName="full-width-datepicker"
                  customInput={
                    <input
                      style={{
                        width: '100%',
                        height: "55px",
                        borderRadius: '10px',
                        backgroundColor: '#F9FAFB',
                        border: '2px solid #E5E7EB',
                        fontSize: '16px',
                        padding: '16.5px 14px',
                        outline: 'none',
                        transition: 'border-color 0.2s ease-in-out',
                        cursor: 'pointer',
                        boxSizing: 'border-box',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#0387D9';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#E5E7EB';
                      }}
                      onMouseEnter={(e) => {
                        if (document.activeElement !== e.target) {
                          e.target.style.borderColor = '#D1D5DB';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (document.activeElement !== e.target) {
                          e.target.style.borderColor = '#E5E7EB';
                        }
                      }}
                    />
                  }
                />
                {errors.dateTime && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                    {errors.dateTime}
                  </Typography>
                )}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <TextareaAutosize
                fullWidth
                label="Additional Notes or Requirements"
                placeholder="Any special instructions or requirements for the service..."
                rows={4}
                value={bookingForm.internalNotes}
                onChange={handleInputChange('internalNotes')}

                style={{
                  width: '100%',
                  borderRadius: "10px",
                  backgroundColor: "#F9FAFB",
                  border: "2px solid #E5E7EB",
                  padding: "12px",
                  fontFamily: 'inherit',
                  fontSize: '14px',
                  resize: 'none',
                  outline: 'none',
                  height: '100px',
                  transition: 'border-color 0.2s ease-in-out',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#0387D9";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#E5E7EB";
                }}
                onMouseEnter={(e) => {
                  if (document.activeElement !== e.target) {
                    e.target.style.borderColor = "#D1D5DB";
                  }
                }}
                onMouseLeave={(e) => {
                  if (document.activeElement !== e.target) {
                    e.target.style.borderColor = "#E5E7EB";
                  }
                }}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
            <Button
              variant="contained"
              onClick={handleCreateBooking}
              disabled={loading}
              startIcon={loading ? <div /> : <CheckCircle />}
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1.5,
                background: loading ? 'grey.400' : 'linear-gradient(45deg, #1976d2, #42a5f5)',
              }}
            >
              {loading ? 'Creating Booking...' : 'Confirm Booking'}
            </Button>
          </Box>
        </Paper>

      </Box>
    </>
  );
};

export default ConfirmBookingForm;