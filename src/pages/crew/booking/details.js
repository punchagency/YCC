import React, { useState, useEffect, useCallback } from "react";
import {
  useParams,
  useLocation,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import { getBookingById } from "../../../services/crew/crewBookingService";
import { useToast } from "../../../components/Toast";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  TextField,
  IconButton,
  Paper,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stepper,
  Step,
  StepLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { approveQuoteAndPay } from "../../../services/bookings/quoteService";
import {
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Phone as PhoneIcon,
  History as HistoryIcon,
  ReportProblem as ReportIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Payment as PaymentIcon,
  Description as DescriptionIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';

const BookingDetails = () => {
  const { bookingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();
  const outletContext = useOutletContext();

  const [bookingDetails, setBookingDetails] = useState({});
  const [loading, setLoading] = useState(!location.state?.bookingDetails);
  const [error, setError] = useState(null);
  const [showModificationHistory, setShowModificationHistory] = useState(false);
  const [responding, setResponding] = useState(false);
  const [actionDialog, setActionDialog] = useState({ open: false, action: null });
  const [issueDescription, setIssueDescription] = useState('');

  const fetchBookingById = useCallback(
    async (id) => {
      try {
        const response = await getBookingById(id);
        if (response.status) {
          setBookingDetails(response.data.data);
        } else {
          setError(response.error || "Failed to fetch booking details");
          showError(response.error || "Failed to fetch booking details");
        }
      } catch (error) {
        setError("An unexpected error occurred");
        showError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    },
    [showError]
  );

  useEffect(() => {
    fetchBookingById(bookingId);
  }, [bookingId, fetchBookingById]);

  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  useEffect(() => {
    if (outletContext && outletContext.setPageTitle) {
      outletContext.setPageTitle("Booking Details", { backArrow: true });
    }
  }, [outletContext]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'warning';
      case 'confirmed': return 'info';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      case 'declined': return 'error';
      case 'paid': return 'success';
      case 'partially_paid': return 'warning';
      default: return 'default';
    }
  };

  const getQuoteTotal = (quote) => {
    if (!quote || !quote.services) return 'N/A';
    const total = quote.services.reduce((sum, item) => {
      return sum + (item.totalPrice || item.unitPrice * item.quantity || 0);
    }, 0);
    return `$${total}`;
  };

  const getBookingSteps = (booking) => {
    const steps = ['Requested', 'Quoted', 'Confirmed', 'In Progress', 'Completed'];
    const currentStep = getCurrentStep(booking);
    const isCancelled = booking && (booking.bookingStatus?.toLowerCase() === 'cancelled' || booking.bookingStatus?.toLowerCase() === 'declined');

    return steps.map((step, index) => ({
      label: isCancelled && index === 0 ? 'Cancelled' : step,
      completed: index < currentStep && !isCancelled,
      current: index === currentStep,
      cancelled: isCancelled && index === 0
    }));
  };

  const getCurrentStep = (booking) => {
    if (!booking) return 0;

    const status = booking.bookingStatus?.toLowerCase();

    // Handle different booking statuses
    switch (status) {
      case 'completed':
        return 4; // Completed step
      case 'confirmed':
        return 2; // Confirmed step
      case 'pending':
        // Check if there's a quote available to determine if we're at quoted step or just requested
        if (booking.quoteStatus === 'quoted' || booking.hasQuote) return 2;
        if (booking.quoteStatus === 'pending') return 1;
        return 0; // Requested step
      case 'cancelled':
      case 'declined':
        return 0; // Keep at requested state for cancelled/declined bookings
      default:
        // Fallback to original logic for backward compatibility
        if (booking.confirmedAt) return 3;
        if (booking.quoteStatus === 'quoted' || booking.hasQuote) return 2;
        if (booking.quoteStatus === 'pending') return 1;
        return 0;
    }
  };

  const handleSubmitIssue = () => {
    if (!issueDescription.trim()) return;
    // Handle issue submission logic here
    setIssueDescription('');
    showSuccess('Issue reported successfully');
  };

  const canMakePayment = (booking) => {
    return booking && (booking.paymentStatus === 'pending' || booking.paymentStatus === 'partially_paid');
  };

  const handleApproveAndPay = async () => {
    try {
      setResponding(true);
      const response = await approveQuoteAndPay(bookingDetails.quote._id);
      if (response.status) {
        showSuccess("Quote approved successfully! Redirecting to payment...");
        // Open invoice URL in new tab
        if (response.data.invoiceUrl) {
          window.open(response.data.invoiceUrl, '_blank');
        }
      } else {
        throw new Error(response.error || "Failed to approve quote");
      }
    } catch (err) {
      showError(err.message || "Failed to approve quote");
    } finally {
      setResponding(false);
      setActionDialog({ open: false, action: null });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={50} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={handleGoBack}>
              Back to Bookings
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, md: 2 }, mx: 'auto' }}>
      {/* Header Section with Status and Actions */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #003366 0%, #0066cc 100%)',
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
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Booking {bookingDetails.bookingId || bookingDetails._id || "N/A"}
            </Typography>
            <Box display="flex" gap={2} flexWrap="wrap">
              <Chip
                label={`Status: ${bookingDetails.bookingStatus || 'Pending'}`}
                color={getStatusColor(bookingDetails.bookingStatus)}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 600,
                  textTransform: 'capitalize'
                }}
              />
              <Chip
                label={`Payment: ${bookingDetails.paymentStatus || 'N/A'}`}
                color={getStatusColor(bookingDetails.paymentStatus)}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 600,
                  textTransform: 'capitalize'
                }}
              />
              {bookingDetails.hasQuote && (
                <Chip
                  label="Quote Available"
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 600
                  }}
                />
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box display="flex" gap={2} justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3} >
        {/* Main Content */}
        <Grid item xs={12} lg={8}>
          {/* Booking Progress */}
          <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <ScheduleIcon sx={{ mr: 1, color: 'primary.main', fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
                Booking Progress
              </Typography>

              {/* Desktop and Tablet View */}
              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <Stepper activeStep={getCurrentStep(bookingDetails)} sx={{ mt: 2 }}>
                  {getBookingSteps(bookingDetails).map((step, index) => (
                    <Step key={index} completed={step.completed}>
                      <StepLabel
                        sx={{
                          '& .MuiStepLabel-label': {
                            fontWeight: step.current ? 600 : 400,
                            color: step.cancelled ? 'error.main' : step.current ? 'primary.main' : 'text.secondary',
                            fontSize: { sm: '0.875rem', lg: '1rem' }
                          },
                          '& .MuiStepIcon-root': {
                            color: step.cancelled ? 'error.main' : step.current ? 'primary.main' : step.completed ? 'success.main' : 'grey.400',
                            filter: step.current || step.cancelled ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' : 'none',
                            transition: 'all 0.3s ease'
                          }
                        }}
                      >
                        {step.label}
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>

              {/* Mobile View - Vertical Steps */}
              <Box sx={{ display: { xs: 'block', md: 'none' }, mt: 2 }}>
                {getBookingSteps(bookingDetails).map((step, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      mb: 2,
                      pb: 2,
                      borderBottom: index < getBookingSteps(bookingDetails).length - 1 ? '1px dashed rgba(0,0,0,0.1)' : 'none'
                    }}
                  >
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: step.cancelled ? 'error.main' : step.current ? 'primary.main' : step.completed ? 'success.main' : 'grey.200',
                        color: step.cancelled || step.current || step.completed ? 'white' : 'grey.500',
                        mr: 2,
                        boxShadow: step.current || step.cancelled ? '0 2px 8px rgba(0,0,0,0.2)' : 'none',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {step.completed ? <CheckCircleIcon fontSize="small" /> : index + 1}
                    </Box>
                    <Box>
                      <Typography
                        variant="body1"
                        fontWeight={step.current ? 600 : 400}
                        color={step.cancelled ? 'error.main' : step.current ? 'primary.main' : 'text.primary'}
                      >
                        {step.label}
                      </Typography>
                      {step.current && !step.cancelled && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                          Current stage
                        </Typography>
                      )}
                      {step.cancelled && (
                        <Typography variant="caption" color="error.main" sx={{ display: 'block', mt: 0.5 }}>
                          Booking cancelled
                        </Typography>
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Services & Quote Section */}
          <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <DescriptionIcon sx={{ mr: 1, color: 'primary.main' }} />
                Services & Pricing
              </Typography>

              {bookingDetails.hasQuote && bookingDetails.quote ? (
                <>
                  <Alert
                    severity="info"
                    icon={<CheckCircleIcon fontSize="inherit" />}
                    sx={{
                      mb: 3,
                      borderRadius: 2,
                      '& .MuiAlert-icon': {
                        color: '#2196f3'
                      }
                    }}
                  >
                    A quote has been provided for this booking. Review the details below.
                  </Alert>

                  <Box
                    sx={{
                      border: '1px solid rgba(0,0,0,0.08)',
                      borderRadius: 2,
                      overflow: 'hidden',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: 'primary.light',
                        color: 'primary.contrastText',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PaymentIcon sx={{ mr: 1.5 }} />
                        <Typography variant="h6" fontWeight={600}>
                          Quote Details
                        </Typography>
                      </Box>
                      <Typography variant="h6" fontWeight={700}>
                        {getQuoteTotal(bookingDetails.quote)}
                      </Typography>
                    </Box>

                    {/* Responsive Table Container */}
                    <Box sx={{ p: { xs: 1, sm: 2 } }}>
                      {/* Desktop and Tablet View */}
                      <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        <TableContainer>
                          <Table size="medium">
                            <TableHead>
                              <TableRow sx={{ bgcolor: 'grey.50' }}>
                                <TableCell sx={{ fontWeight: 600 }}>Service</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Item</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600 }}>Qty</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600 }}>Unit Price</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600 }}>Total</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {bookingDetails.quote.services?.map((item, index) => (
                                <TableRow key={index} sx={{ '&:nth-of-type(odd)': { bgcolor: 'rgba(0,0,0,0.02)' } }}>
                                  <TableCell sx={{ py: 1.5 }}>
                                    {bookingDetails.services?.find(s => s.service?._id === item.service)?.service?.name || 'Service'}
                                  </TableCell>
                                  <TableCell sx={{ py: 1.5 }}>{item.item || 'Service Item'}</TableCell>
                                  <TableCell align="right" sx={{ py: 1.5 }}>{item.quantity || 1}</TableCell>
                                  <TableCell align="right" sx={{ py: 1.5 }}>${item.unitPrice || 0}</TableCell>
                                  <TableCell align="right" sx={{ py: 1.5 }}>${item.totalPrice || (item.unitPrice * item.quantity) || 0}</TableCell>
                                </TableRow>
                              ))}
                              <TableRow>
                                <TableCell colSpan={4} align="right" sx={{ fontWeight: 600, py: 2 }}>Total Amount:</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.main', py: 2 }}>{getQuoteTotal(bookingDetails.quote)}</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Box>

                      {/* Mobile View */}
                      <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                        {bookingDetails.quote.services?.map((item, index) => (
                          <Paper
                            key={index}
                            elevation={0}
                            sx={{
                              p: 2,
                              mb: 2,
                              border: '1px solid rgba(0,0,0,0.08)',
                              borderRadius: 2
                            }}
                          >
                            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                              {bookingDetails.services?.find(s => s.service?._id === item.service)?.service?.name || 'Service'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {item.item || 'Service Item'}
                            </Typography>
                            <Grid container spacing={1} sx={{ mt: 1 }}>
                              <Grid item xs={4}>
                                <Typography variant="caption" color="text.secondary">Quantity</Typography>
                                <Typography variant="body2">{item.quantity || 1}</Typography>
                              </Grid>
                              <Grid item xs={4}>
                                <Typography variant="caption" color="text.secondary">Unit Price</Typography>
                                <Typography variant="body2">${item.unitPrice || 0}</Typography>
                              </Grid>
                              <Grid item xs={4}>
                                <Typography variant="caption" color="text.secondary">Total</Typography>
                                <Typography variant="body2" fontWeight={600}>${item.totalPrice || (item.unitPrice * item.quantity) || 0}</Typography>
                              </Grid>
                            </Grid>
                          </Paper>
                        ))}
                        <Box sx={{
                          p: 2,
                          bgcolor: 'primary.light',
                          color: 'primary.contrastText',
                          borderRadius: 2,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <Typography variant="subtitle1" fontWeight={600}>Total Amount</Typography>
                          <Typography variant="h6" fontWeight={700}>{getQuoteTotal(bookingDetails.quote)}</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </>
              ) : (
                <>
                  <Alert
                    severity="info"
                    icon={<CheckCircleIcon fontSize="inherit" />}
                    sx={{
                      mb: 3,
                      borderRadius: 2,
                      '& .MuiAlert-icon': {
                        color: '#2196f3'
                      }
                    }}
                  >
                    No quote has been provided for this booking.
                  </Alert>

                  <Box
                    sx={{
                      border: '1px solid rgba(0,0,0,0.08)',
                      borderRadius: 2,
                      overflow: 'hidden',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: 'primary.light',
                        color: 'primary.contrastText',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PaymentIcon sx={{ mr: 1.5 }} />
                        <Typography variant="h6" fontWeight={600}>
                          Service Details
                        </Typography>
                      </Box>
                    </Box>

                    {/* Responsive Table Container */}
                    <Box sx={{ p: { xs: 1, sm: 2 } }}>
                      {/* Desktop and Tablet View */}
                      <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        <TableContainer>
                          <Table size="medium">
                            <TableHead>
                              <TableRow sx={{ bgcolor: 'grey.50' }}>
                                <TableCell ></TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Service</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600 }}>Price</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {bookingDetails.services?.map((item, index) => (
                                <TableRow key={index} sx={{ '&:nth-of-type(odd)': { bgcolor: 'rgba(0,0,0,0.02)' } }}>
                                  <TableCell sx={{ py: 1.5 }}>
                                    <img src={item.service.image} alt={item.service.name} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                                  </TableCell>
                                  <TableCell sx={{ py: 1.5 }}>{item.service.name || 'Service'}</TableCell>
                                  <TableCell align="left" sx={{ py: 1.5 }}>{item.service.category || 'Category'}</TableCell>
                                  <TableCell align="right" sx={{ py: 1.5 }}>${item.service.price || 0}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Box>

                      {/* Mobile View */}
                      <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                        {bookingDetails.services?.map((item, index) => (
                          <Paper
                            key={index}
                            elevation={0}
                            sx={{
                              p: 2,
                              mb: 2,
                              border: '1px solid rgba(0,0,0,0.08)',
                              borderRadius: 2
                            }}
                          >
                            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                              {item.service.name || 'Service'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {item.service.category || 'Category'}
                            </Typography>
                            <Grid container spacing={1} sx={{ mt: 1 }}>
                              <Grid item xs={4}>
                                <Typography variant="caption" color="text.secondary">Price</Typography>
                                <Typography variant="body2">${item.service.price || 0}</Typography>
                              </Grid>
                            </Grid>
                          </Paper>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>

          {/* Vendor Information */}
          <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
                Vendor Information
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Typography variant="h5" color="primary" gutterBottom fontWeight={600}>
                    {bookingDetails.vendorName || "N/A"}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    Service Provider
                  </Typography>
                  <Box display="flex" alignItems="center" mb={2}>
                    <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {bookingDetails.vendorLocation || 'Location not specified'}
                    </Typography>
                  </Box>
                  {bookingDetails.vendorAssigned?.phone && (
                    <Box display="flex" alignItems="center">
                      <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {bookingDetails.vendorAssigned.phone}
                      </Typography>
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  <Box display="flex" flexDirection="column" gap={2}>
                    <Button
                      variant="contained"
                      startIcon={<PhoneIcon />}
                      onClick={() => window.open(`tel:${bookingDetails.vendorAssigned?.phone}`)}
                      fullWidth
                      disabled={!bookingDetails.vendorAssigned?.phone}
                      sx={{
                        py: 1.5,
                        px: 2,
                        bgcolor: 'primary.main',
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'primary.dark'
                        },
                        '&:disabled': {
                          bgcolor: 'action.disabledBackground',
                          color: 'text.disabled'
                        },
                        borderRadius: 2,
                        boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {bookingDetails.vendorAssigned?.phone ? 'Call Vendor' : 'No Phone Available'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Booking Details */}
          <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <DescriptionIcon sx={{ mr: 1, color: 'primary.main' }} />
                Booking Information
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Service Location
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {bookingDetails.serviceLocation || 'Not specified'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Contact Phone
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {bookingDetails.contactPhone || 'Not specified'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Scheduled Date
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {bookingDetails.dateTime
                        ? new Date(bookingDetails.dateTime).toLocaleDateString()
                        : 'Not scheduled'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Scheduled Time
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {bookingDetails.dateTime
                        ? new Date(bookingDetails.dateTime).toLocaleTimeString()
                        : 'Not scheduled'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {bookingDetails.internalNotes && (
                <Box mt={3}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Additional Notes
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                    <Typography variant="body2">
                      {bookingDetails.internalNotes}
                    </Typography>
                  </Paper>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          {/* Quick Actions */}
          <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Quick Actions
              </Typography>

              <Box display="flex" flexDirection="column" gap={2}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<HistoryIcon />}
                  onClick={() => setShowModificationHistory(true)}
                  fullWidth
                  sx={{
                    justifyContent: 'center',
                    borderRadius: 2,
                    py: 1.5,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      transition: 'all 0.3s ease'
                    }
                  }}
                >
                  View History
                </Button>
                {bookingDetails.paymentStatus === 'pending' && bookingDetails.hasQuote && (
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<PaymentIcon />}
                  onClick={() => setActionDialog({ open: true, action: { action: 'accept', label: 'Make Payment', color: 'success', handler: handleApproveAndPay } })}
                  disabled={!canMakePayment(bookingDetails)}
                  fullWidth
                  sx={{
                    justifyContent: 'center',
                    borderRadius: 2,
                    py: 1.5,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      transition: 'all 0.3s ease'
                    },
                    '&.Mui-disabled': {
                      backgroundColor: 'rgba(0, 0, 0, 0.12)',
                      color: 'rgba(0, 0, 0, 0.26)'
                    }
                  }}
                >
                  Make Payment
                </Button>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Status History Preview */}
          <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <AccessTimeIcon sx={{ mr: 1, color: 'primary.main' }} />
                Recent Activity
              </Typography>

              {bookingDetails.statusHistory && bookingDetails.statusHistory.length > 0 ? (
                <List dense>
                  {bookingDetails.statusHistory.slice(0, 3).map((history, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        {history.toStatus === 'confirmed' ? (
                          <CheckCircleIcon color="success" fontSize="small" />
                        ) : (
                          <AccessTimeIcon color="primary" fontSize="small" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2" fontWeight={500}>
                            Status changed to {history.toStatus}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            {new Date(history.changedAt).toLocaleDateString()}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No status changes recorded yet.
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* Report Issue */}
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <ReportIcon sx={{ mr: 1, color: 'error.main' }} />
                Need Help?
              </Typography>

              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Describe any issues you're experiencing..."
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                variant="outlined"
                size="small"
                sx={{
                  mb: 2,
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

              <Button
                variant="contained"
                color="error"
                onClick={handleSubmitIssue}
                disabled={!issueDescription.trim()}
                fullWidth
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    transition: 'all 0.3s ease'
                  }
                }}
              >
                Report Issue
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialogs */}
      {/* Modification History Dialog */}
      <Dialog
        open={showModificationHistory}
        onClose={() => setShowModificationHistory(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight={600}>
              Booking History
            </Typography>
            <IconButton onClick={() => setShowModificationHistory(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Booking #{bookingDetails.bookingId || bookingDetails._id || "N/A"}
          </Typography>
        </DialogTitle>

        <DialogContent>
          {bookingDetails.statusHistory && bookingDetails.statusHistory.length > 0 ? (
            <List>
              {bookingDetails.statusHistory.map((history, index) => (
                <Paper key={index} sx={{ p: 3, mb: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Status Change
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Chip label={history.fromStatus} size="small" color="default" />
                        <Typography>→</Typography>
                        <Chip label={history.toStatus} size="small" color={getStatusColor(history.toStatus)} />
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Changed By
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {history.userRole === 'service_provider' ? 'Vendor' : 'System'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Date & Time
                      </Typography>
                      <Typography variant="body1">
                        {new Date(history.changedAt).toLocaleString()}
                      </Typography>
                    </Grid>
                    {history.notes && (
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Notes
                        </Typography>
                        <Typography variant="body1">
                          {history.notes}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Paper>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No status changes recorded yet.
            </Typography>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setShowModificationHistory(false)} variant="contained"
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
              transition: 'all 0.3s ease',
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog
        open={actionDialog.open}
        onClose={() => setActionDialog({ open: false, action: null })}
        PaperProps={{
          elevation: 0,
          sx: {
            borderRadius: 2,
            border: '1px solid #e0e0e0',
            maxWidth: '400px',
            width: '100%'
          }
        }}
      >
        <DialogTitle sx={{
          borderBottom: '1px solid #f0f0f0',
          py: 2,
          px: 3,
          fontWeight: 500
        }}>
          {actionDialog.action?.label || "Confirm Action"}
        </DialogTitle>
        <DialogContent sx={{ py: 3, px: 3 }}>
          <Typography variant="body1" sx={{ fontWeight: 400, mt: 1 }}>
            Are you sure you want to {actionDialog.action?.label?.toLowerCase()}?
          </Typography>
          {actionDialog.action?.action === 'accept' && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              This will approve the quote and initiate the payment process.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #f0f0f0' }}>
          <Button
            onClick={() => setActionDialog({ open: false, action: null })}
            disabled={responding}
            sx={{
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={actionDialog.action?.handler}
            variant="contained"
            color={actionDialog.action?.color || "primary"}
            disabled={responding}
            disableElevation
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              px: 3
            }}
          >
            {responding ? "Processing..." : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookingDetails;