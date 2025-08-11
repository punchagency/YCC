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
  Divider,
  IconButton,
  Paper,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Business as BusinessIcon,
  Message as MessageIcon,
  Phone as PhoneIcon,
  History as HistoryIcon,
  ReportProblem as ReportIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const BookingDetails = () => {
  const { bookingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { showError } = useToast();
  const outletContext = useOutletContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [bookingDetails, setBookingDetails] = useState(
    location.state?.bookingDetails || {}
  );
  const [loading, setLoading] = useState(!location.state?.bookingDetails);
  const [error, setError] = useState(null);
  const [showModificationHistory, setShowModificationHistory] = useState(false);
  const [issueDescription, setIssueDescription] = useState('');

  const fetchBookingById = useCallback(
    async (id) => {
      try {
        const response = await getBookingById(id);
        if (response.status) {
          setBookingDetails(response.data);
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
    if (!location.state?.bookingDetails && bookingId) {
      fetchBookingById(bookingId);
    }
  }, [bookingId, location.state, fetchBookingById]);

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
      default: return 'default';
    }
  };

  const formatServices = (services) => {
    if (!services || services.length === 0) return 'N/A';
    return services.map(s => s.service?.name).filter(Boolean).join(', ') || 'N/A';
  };

  const getTotalPrice = (services) => {
    if (!services || services.length === 0) return 'N/A';
    const total = services.reduce((sum, s) => {
      return sum + (s.service?.price || 0) * (s.quantity || 1);
    }, 0);
    return `$${total}`;
  };

  const handleSubmitIssue = () => {
    if (!issueDescription.trim()) return;
    // Handle issue submission logic here
    console.log('Issue submitted:', issueDescription);
    setIssueDescription('');
    // Show success message
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
    <Box sx={{ p: 0, mx: 'auto' }}>
      <Grid container spacing={3}>
        {/* Main Booking Details Card */}
        <Grid item xs={12} lg={8}>
          <Card 
            sx={{ 
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              mb: 3
            }}
          >
            <CardContent sx={{ p: isMobile ? 2 : 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
                <Box>
                  <Typography variant="h4" fontWeight={600} color="primary" gutterBottom>
                    Booking {bookingDetails.bookingId || bookingDetails._id || "N/A"}
                  </Typography>
                  <Chip 
                    label={`Payment: ${bookingDetails.paymentStatus || 'N/A'}`}
                    color={getStatusColor(bookingDetails.paymentStatus)}
                    sx={{ textTransform: 'capitalize' }}
                  />
                </Box>
                <Chip 
                  label={bookingDetails.bookingStatus || 'Pending'}
                  color={getStatusColor(bookingDetails.bookingStatus)}
                  size="large"
                  sx={{ 
                    textTransform: 'capitalize',
                    fontWeight: 600,
                    fontSize: '0.875rem'
                  }}
                />
              </Box>

              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Service Details
                  </Typography>
                  
                  <Box display="flex" alignItems="center" mb={2}>
                    <BusinessIcon sx={{ color: 'primary.main', mr: 2 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Services
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {formatServices(bookingDetails.services)}
                      </Typography>
                    </Box>
                  </Box>

                  <Box display="flex" alignItems="center" mb={2}>
                    <CalendarIcon sx={{ color: 'primary.main', mr: 2 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Date & Time
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {bookingDetails.dateTime
                          ? new Date(bookingDetails.dateTime).toLocaleString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true
                            })
                          : "N/A"}
                      </Typography>
                    </Box>
                  </Box>

                  <Box display="flex" alignItems="center" mb={2}>
                    <LocationIcon sx={{ color: 'primary.main', mr: 2 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Location
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {bookingDetails.serviceLocation ||
                          bookingDetails.vendorLocation ||
                          "N/A"}
                      </Typography>
                    </Box>
                  </Box>

                  <Box display="flex" alignItems="center">
                    <MoneyIcon sx={{ color: 'primary.main', mr: 2 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Total Price
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {getTotalPrice(bookingDetails.services)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Vendor Information
                  </Typography>
                  
                  <Box mb={3}>
                    <Typography variant="h6" color="primary" gutterBottom>
                      {bookingDetails.vendorName || "N/A"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Service Provider
                    </Typography>
                    {bookingDetails.vendorLocation && (
                      <Typography variant="body2" color="text.secondary">
                        {bookingDetails.vendorLocation}
                      </Typography>
                    )}
                  </Box>

                  <Box display="flex" gap={2} flexWrap="wrap">
                    <Button
                      variant="contained"
                      startIcon={<MessageIcon />}
                      sx={{
                        bgcolor: '#1A9E6D',
                        '&:hover': { bgcolor: '#16875A' },
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600
                      }}
                      onClick={() => alert("Message vendor")}
                    >
                      Message
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<PhoneIcon />}
                      sx={{
                        bgcolor: '#0387D9',
                        '&:hover': { bgcolor: '#0369A1' },
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600
                      }}
                      onClick={() => alert("Call vendor")}
                    >
                      Call
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Booking History Card */}
        <Grid item xs={12} lg={4}>
          <Card 
            sx={{ 
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              mb: 3
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" mb={3}>
                <HistoryIcon sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="h6" fontWeight={600}>
                  Booking History
                </Typography>
              </Box>
              
              <Paper 
                sx={{ 
                  p: 2, 
                  bgcolor: 'grey.50',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'grey.200'
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {bookingDetails.vendorName || "N/A"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {bookingDetails.dateTime
                        ? new Date(bookingDetails.dateTime).toLocaleString()
                        : "N/A"}
                    </Typography>
                  </Box>
                  <Chip 
                    label={bookingDetails.bookingStatus || 'N/A'}
                    color={getStatusColor(bookingDetails.bookingStatus)}
                    size="small"
                    sx={{ textTransform: 'capitalize' }}
                  />
                </Box>
              </Paper>

              <Button
                variant="outlined"
                fullWidth
                sx={{ mt: 2, textTransform: 'none' }}
                onClick={() => setShowModificationHistory(true)}
              >
                View Full History
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Report Issue Card */}
        <Grid item xs={12}>
          <Card 
            sx={{ 
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box display="flex" alignItems="center" mb={3}>
                <ReportIcon sx={{ color: 'error.main', mr: 1 }} />
                <Typography variant="h6" fontWeight={600}>
                  Report an Issue
                </Typography>
              </Box>
              
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Describe the issue you're experiencing..."
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                sx={{ mb: 3 }}
                variant="outlined"
              />
              
              <Button
                variant="contained"
                color="error"
                onClick={handleSubmitIssue}
                disabled={!issueDescription.trim()}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 4
                }}
              >
                Submit Report
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Modification History Dialog */}
      <Dialog
        open={showModificationHistory}
        onClose={() => setShowModificationHistory(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight={600}>
              Modification History
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
          <Box mb={2}>
            <Chip 
              label={`Modification In ${bookingDetails.bookingStatus || 'N/A'}`}
              color="info"
              sx={{ mb: 2 }}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Sample modification entries */}
          <Box mb={3}>
            <Paper sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Requested:
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {bookingDetails.dateTime
                      ? new Date(bookingDetails.dateTime).toLocaleString()
                      : "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Status:
                  </Typography>
                  <Chip label="Sent" color="success" size="small" />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Response:
                  </Typography>
                  <Chip label="Pending" color="warning" size="small" />
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={() => setShowModificationHistory(false)}
            variant="outlined"
            sx={{ textTransform: 'none' }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookingDetails;