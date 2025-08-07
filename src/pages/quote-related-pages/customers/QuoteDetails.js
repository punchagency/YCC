import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Grid,
  Chip,
  Divider,
  Alert,
  Snackbar,
  Paper,
  Stack,
  useMediaQuery,
  useTheme,
  alpha,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  LocationOn as LocationOnIcon,
  Receipt as ReceiptIcon,
  Payment as PaymentIcon,
  Description as DescriptionIcon
} from "@mui/icons-material";
import { format } from 'date-fns';
import { getQuoteById, approveQuoteAndPay, declineQuote } from "../../../services/bookings/quoteService";

// Status chip component
const StatusChip = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return { color: "#856404", bg: "#fff3cd", icon: <CalendarIcon fontSize="small" /> };
      case "quoted":
        return { color: "#155724", bg: "#d4edda", icon: <ReceiptIcon fontSize="small" /> };
      case "accepted":
        return { color: "#0c5460", bg: "#d1ecf1", icon: <CheckCircleIcon fontSize="small" /> };
      case "declined":
        return { color: "#721c24", bg: "#f8d7da", icon: <CancelIcon fontSize="small" /> };
      case "deposit_paid":
        return { color: "#6f42c1", bg: "#e2d9f3", icon: <PaymentIcon fontSize="small" /> };
      case "completed":
        return { color: "#155724", bg: "#d4edda", icon: <CheckCircleIcon fontSize="small" /> };
      case "cancelled":
        return { color: "#721c24", bg: "#f8d7da", icon: <CancelIcon fontSize="small" /> };
      default:
        return { color: "#6c757d", bg: "#f8f9fa", icon: null };
    }
  };

  const config = getStatusConfig(status);
  return (
    <Chip
      icon={config.icon}
      label={status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown'}
      size="small"
      sx={{
        backgroundColor: config.bg,
        color: config.color,
        fontWeight: 600,
        fontSize: "0.75rem",
        borderRadius: 4,
        '& .MuiChip-icon': { color: config.color }
      }}
    />
  );
};

// Section header component
const SectionHeader = ({ title, icon }) => (
  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
    {icon}
    <Typography variant="h6" fontWeight={600} color="#495057">
      {title}
    </Typography>
  </Stack>
);

// Service item component
const ServiceItem = ({ service }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2.5,
      borderRadius: 2,
      border: '1px solid #e9ecef',
      mb: 2
    }}
  >
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} md={6}>
        <Typography variant="subtitle1" fontWeight={600} color="#212529" mb={1}>
          {service.service?.name || "Unknown Service"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Item: {service.item || 'N/A'}
        </Typography>
      </Grid>
      <Grid item xs={6} md={3}>
        <Typography variant="body2" color="#6c757d">
          Quantity: <strong>{service.quantity}</strong>
        </Typography>
        <Typography variant="body2" color="#6c757d">
          Unit Price: <strong>${service.unitPrice?.toFixed(2) || '0.00'}</strong>
        </Typography>
      </Grid>
      <Grid item xs={6} md={3} textAlign="right">
        <Typography variant="subtitle1" fontWeight={600} color="primary">
          ${service.totalPrice?.toFixed(2) || '0.00'}
        </Typography>
      </Grid>
    </Grid>
  </Paper>
);

const QuoteDetails = () => {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [responding, setResponding] = useState(false);
  const [actionDialog, setActionDialog] = useState({ open: false, action: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const navigate = useNavigate();
  const { quoteId } = useParams();
  const { state } = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchQuote = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getQuoteById(quoteId);
      if (response.status) {
        setQuote(response.data);
      } else {
        setError(response.error || "Failed to fetch quote details");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch quote details");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveAndPay = async () => {
    try {
      setResponding(true);
      const response = await approveQuoteAndPay(quoteId);
      if (response.status) {
        setSnackbar({
          open: true,
          message: "Quote approved successfully! Redirecting to payment...",
          severity: "success"
        });
        // TODO: Open invoice URL in new tab if provided
        window.open(response.data.invoiceUrl, '_blank');
        // setTimeout(() => navigate('/crew/booking'), 2000);
      } else {
        throw new Error(response.error || "Failed to approve quote");
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Failed to approve quote",
        severity: "error"
      });
    } finally {
      setResponding(false);
      setActionDialog({ open: false, action: null });
    }
  };

  const handleDeclineQuote = async () => {
    try {
      setResponding(true);

      const response = await declineQuote(quoteId, "Declined by customer");
      if(response.status) {
        setSnackbar({
          open: true,
          message: response.message,
          severity: "info"
        });
        setTimeout(() => navigate('/crew/booking'), 2000);
      }else{
        throw new Error(response.error || "Failed to decline quote");
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to decline quote",
        severity: "error"
      });
    } finally {
      setResponding(false);
      setActionDialog({ open: false, action: null });
    }
  };

  useEffect(() => {
    fetchQuote();
  }, [quoteId]);

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return "Invalid Date";
    }
  };

  const getAvailableActions = (status, awaitingPayment) => {
    console.log({ status, awaitingPayment });
    if (status === "quoted" && !awaitingPayment) {
      return [
        { action: "accept", label: "Accept & Pay", color: "success", handler: handleApproveAndPay },
        { action: "decline", label: "Decline Quote", color: "error", handler: handleDeclineQuote }
      ];
    } else if (status === 'accepted' && awaitingPayment === true){
      return [
        { action: "accept", label: "Finalized Payment", color: "success", handler: handleApproveAndPay },
        // { action: "decline", label: "Decline Quote", color: "error", handler: handleDeclineQuote }
      ];
    } else {
      return [];
    }
  }


  if (loading) {
    return (
      <Box sx={{ p: 4, paddingTop: "80px", textAlign: "center" }}>
        <CircularProgress sx={{ mb: 2 }} />
        <Typography color="text.secondary">Loading quote details...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, paddingTop: "80px" }}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => navigate('/crew/quotes')} startIcon={<ArrowBackIcon />}>
              Back to Quotes
            </Button>
          }
          sx={{ borderRadius: 3 }}
        >
          {error}
        </Alert>
      </Box>
    );
  }

  if (!quote) return null;

  const availableActions = getAvailableActions(quote.status, quote.paymentInfo.awaitingPayment);

  return (
    <Box sx={{ p: { xs: 1, sm: 1.4, lg: 4 }, paddingTop: "80px" }}>
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
        flexWrap="wrap"
        gap={1}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/crew/booking')}
          sx={{ mb: { xs: 1, sm: 0 } }}
        >
          Back to Quotes
        </Button>
        <StatusChip status={quote.status} />
      </Stack>

      <Grid container spacing={4}>
        {/* Left column - Quote details */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: '1px solid #e9ecef',
              mb: 3
            }}
          >
            {/* Quote header */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" fontWeight={700} color="#212529">
                Quote #{quote._id}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Created on {formatDate(quote.createdAt)}
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Services section */}
            <Box sx={{ mb: 4 }}>
              <SectionHeader
                title="Services"
                icon={<DescriptionIcon sx={{ color: theme.palette.primary.main }} />}
              />

              {quote.services?.map((service, index) => (
                <ServiceItem key={service._id || index} service={service} />
              ))}

              {/* Quote total */}
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  borderRadius: 2
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary">Total Amount</Typography>
                    <Typography variant="h6" fontWeight={600} color="primary">
                      ${quote.amount?.toFixed(2) || '0.00'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary">Deposit Amount</Typography>
                    <Typography variant="subtitle1" fontWeight={600}>
                      ${quote.depositAmount?.toFixed(2) || '0.00'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary">Balance Amount</Typography>
                    <Typography variant="subtitle1" fontWeight={600}>
                      ${quote.balanceAmount?.toFixed(2) || '0.00'}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Box>

            {/* Booking information */}
            <Box>
              <SectionHeader
                title="Booking Information"
                icon={<LocationOnIcon sx={{ color: theme.palette.primary.main }} />}
              />

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: 2,
                      border: '1px solid #e9ecef',
                      height: '100%'
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight={600} mb={2} color="#495057">
                      Crew Details
                    </Typography>

                    <Stack spacing={1}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <PersonIcon fontSize="small" color="action" />
                        <Typography variant="body1" fontWeight={500}>
                          {quote.crew?.firstName} {quote.crew?.lastName}
                        </Typography>
                      </Stack>

                      <Stack direction="row" spacing={1} alignItems="center">
                        <PhoneIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          {quote.crew?.phone || 'N/A'}
                        </Typography>
                      </Stack>

                      <Stack direction="row" spacing={1} alignItems="center">
                        <BusinessIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          Position: {quote.crew?.position || 'N/A'}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: 2,
                      border: '1px solid #e9ecef',
                      height: '100%'
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight={600} mb={2} color="#495057">
                      Booking Details
                    </Typography>

                    <Stack spacing={2}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CalendarIcon fontSize="small" color="action" />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Service Date
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {formatDate(quote.crewBooking?.dateTime)}
                          </Typography>
                        </Box>
                      </Stack>

                      <Stack direction="row" spacing={1} alignItems="flex-start">
                        <LocationOnIcon fontSize="small" color="action" sx={{ mt: 0.5 }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Service Location
                          </Typography>
                          <Typography variant="body2">
                            {quote.crewBooking?.serviceLocation || 'N/A'}
                          </Typography>
                        </Box>
                      </Stack>
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>

        {/* Right column - Actions and info */}
        <Grid item xs={12} md={4}>
          {/* Quote actions */}
          {availableActions.length > 0 && (
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                border: '1px solid #e9ecef',
                mb: 3
              }}
            >
              <Typography variant="h6" fontWeight={600} mb={2}>
                Quote Actions
              </Typography>

              <Stack spacing={2}>
                {availableActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="contained"
                    color={action.color}
                    fullWidth
                    onClick={() => setActionDialog({ open: true, action })}
                    disabled={responding}
                    sx={{ borderRadius: 2 }}
                  >
                    {action.label}
                  </Button>
                ))}
              </Stack>
            </Paper>
          )}

          {/* Quote information */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: '1px solid #e9ecef'
            }}
          >
            <Typography variant="h6" fontWeight={600} mb={2}>
              Quote Information
            </Typography>

            <Stack spacing={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <BusinessIcon fontSize="small" color="action" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Vendor
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {quote.vendor?.businessName || 'N/A'}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <CalendarIcon fontSize="small" color="action" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Valid Until
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {formatDate(quote.validUntil)}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <CalendarIcon fontSize="small" color="action" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Last Updated
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {formatDate(quote.updatedAt)}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Action confirmation dialog */}
      <Dialog open={actionDialog.open} onClose={() => setActionDialog({ open: false, action: null })}>
        <DialogTitle>
          {actionDialog.action?.label || "Confirm Action"}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to {actionDialog.action?.label.toLowerCase()}?
            {actionDialog.action?.action === 'accept' && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                This will approve the quote and initiate the payment process.
              </Typography>
            )}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialog({ open: false, action: null })} disabled={responding}>
            Cancel
          </Button>
          <Button
            onClick={actionDialog.action?.handler}
            variant="contained"
            color={actionDialog.action?.color || "primary"}
            disabled={responding}
          >
            {responding ? "Processing..." : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
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

export default QuoteDetails;