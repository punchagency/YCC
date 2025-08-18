import React from "react";
import { keyframes } from "@mui/material/styles";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Stack,
  Grid,
  Button,
  Chip,
  Divider,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating,
  useMediaQuery,
  Avatar
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Report as ReportIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  RoomService as ServiceIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon
} from "@mui/icons-material";
import { approveCompletedBooking, objectCompletedBooking } from "../../../services/bookings/quoteService";

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;



const InfoRow = ({ icon, label, value }) => (
  <Stack direction="row" spacing={1} alignItems="center">
    {icon}
    <Box>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant="body1" fontWeight={500}>{value}</Typography>
    </Box>
  </Stack>
);

const CompletedBookingDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { setPageTitle } = useOutletContext() || {};
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const booking = state?.booking;

  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });
  const [approveDialog, setApproveDialog] = React.useState(false);
  const [objectDialog, setObjectDialog] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [rating, setRating] = React.useState(5);
  const [ratingHover, setRatingHover] = React.useState(-1);
  const [feedback, setFeedback] = React.useState("");
  const [objectionReason, setObjectionReason] = React.useState("");
  const [details, setDetails] = React.useState("");

  const ratingLabels = {
    1: { text: "Poor", color: "#f44336", emoji: "😞" },
    2: { text: "Fair", color: "#ff9800", emoji: "😐" },
    3: { text: "Good", color: "#2196f3", emoji: "🙂" },
    4: { text: "Very Good", color: "#4caf50", emoji: "😊" },
    5: { text: "Excellent", color: "#0387d9", emoji: "🤩" }
  };

  const quickFeedbackTags = [
    "Professional service",
    "On time arrival",
    "Great communication",
    "High quality work",
    "Friendly staff",
    "Clean workspace",
    "Would recommend"
  ];

  const [selectedTags, setSelectedTags] = React.useState([]);

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  React.useEffect(() => {
    if (setPageTitle) setPageTitle("Review Completed Booking");
  }, [setPageTitle]);

  if (!booking) {
    return (
      <Box sx={{ p: 3, paddingTop: "70px !important" }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          No booking selected. Please return to dashboard and choose a completed booking to review.
        </Alert>
        <Button variant="contained" onClick={() => navigate('/crew/dashboard')} sx={{ bgcolor: '#0387d9', '&:hover': { bgcolor: '#0275bf' } }}>
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  const handleApprove = async () => {
    setSubmitting(true);
    try {
      const tagsText = selectedTags.length ? `[${selectedTags.join(", ")}] ` : "";
      const combinedFeedback = `${tagsText}${feedback}`.trim();
      
      const res = await approveCompletedBooking({ 
        bookingId: booking._id, 
        rating, 
        feedback: combinedFeedback 
      });
      
      if (res.status) {
        setSnackbar({ open: true, message: 'Booking approved successfully! 🎉', severity: 'success' });
        setApproveDialog(false);
        setTimeout(() => navigate('/crew/dashboard'), 1500);
      } else {
        setSnackbar({ open: true, message: res.message || 'Failed to approve booking', severity: 'error' });
      }
    } catch (e) {
      setSnackbar({ open: true, message: e.message || 'An error occurred while approving', severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleObject = async () => {
    setSubmitting(true);
    try {
      const res = await objectCompletedBooking({ bookingId: booking._id, objectionReason, details });
      if (res.status) {
        setSnackbar({ open: true, message: 'Objection submitted', severity: 'success' });
        setObjectDialog(false);
        navigate('/crew/dashboard');
      } else {
        setSnackbar({ open: true, message: res.message || 'Failed to submit objection', severity: 'error' });
      }
    } catch (e) {
      setSnackbar({ open: true, message: e.message || 'An error occurred while sending objection', severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDateTime = (d) => { try { return new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch { return '—'; } };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafe 0%, #e3f2fd 100%)',
      p: { xs: 0.8, md: 2 }, 
      paddingTop: "50px !important" 
    }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate(-1)} 
          sx={{ 
            textTransform: 'none',
            color: '#0387d9',
            fontWeight: 600,
            bgcolor: 'rgba(3,135,217,0.08)',
            px: 3,
            py: 1,
            borderRadius: 2,
            '&:hover': { 
              bgcolor: 'rgba(3,135,217,0.12)',
              transform: 'translateX(-2px)'
            },
            transition: 'all 0.2s ease'
          }}
        >
          Back
        </Button>
        <Chip 
          label={booking.bookingStatus} 
          sx={{ 
            textTransform: 'capitalize', 
            fontWeight: 600,
            fontSize: '0.875rem',
            bgcolor: '#4caf50',
            color: 'white',
            px: 2,
            py: 1,
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(76,175,80,0.3)'
          }} 
        />
      </Stack>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: isMobile ? 2.5 : 4, 
              borderRadius: 4,
              background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
              border: '1px solid rgba(3,135,217,0.1)',
              boxShadow: '0 8px 25px rgba(3,135,217,0.08)',
              mb: 3,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(135deg, #0387d9 0%, #0275bf 100%)'
              }
            }}
          >
            <Box sx={{ mb: 3, position: 'relative', zIndex: 1 }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Avatar sx={{ 
                  width: 56, 
                  height: 56, 
                  background: 'linear-gradient(135deg, #0387d9 0%, #0275bf 100%)',
                  boxShadow: '0 4px 12px rgba(3,135,217,0.3)'
                }}>
                  <ServiceIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" fontWeight={800} sx={{ color: '#1a1a1a', letterSpacing: '-0.5px' }}>
                    Booking #{booking.bookingId}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                    <Typography variant="body1" sx={{ color: '#6c757d' }}>
                      Completed by
                    </Typography>
                    <Chip 
                      label={booking.vendorName}
                      variant="outlined"
                      sx={{ 
                        borderColor: '#0387d9',
                        color: '#0387d9',
                        fontWeight: 600,
                        bgcolor: 'rgba(3,135,217,0.05)'
                      }}
                    />
                  </Stack>
                </Box>
              </Stack>
            </Box>

            <Divider sx={{ my: 3, borderColor: 'rgba(3,135,217,0.1)' }} />

            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Box sx={{ 
                  p: 2.5, 
                  borderRadius: 3, 
                  bgcolor: 'rgba(3,135,217,0.02)',
                  border: '1px solid rgba(3,135,217,0.1)'
                }}>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5, color: '#0387d9' }}>
                    Service Details
                  </Typography>
                  <Stack spacing={2.5}>
                    <InfoRow 
                      icon={<BusinessIcon sx={{ color: '#0387d9' }} />} 
                      label="Vendor" 
                      value={booking.vendorName || 'N/A'} 
                    />
                    <InfoRow 
                      icon={<LocationIcon sx={{ color: '#0387d9' }} />} 
                      label="Service Location" 
                      value={booking.serviceLocation || 'N/A'} 
                    />
                    <InfoRow 
                      icon={<CalendarIcon sx={{ color: '#0387d9' }} />} 
                      label="Service Date & Time" 
                      value={formatDateTime(booking.dateTime)} 
                    />
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ 
                  p: 2.5, 
                  borderRadius: 3, 
                  bgcolor: 'rgba(76,175,80,0.02)',
                  border: '1px solid rgba(76,175,80,0.1)'
                }}>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5, color: '#4caf50' }}>
                    Services Provided
                  </Typography>
                  <Stack spacing={2}>
                    {booking.services?.map((s, index) => (
                      <Paper
                        key={s._id}
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          border: '1px solid rgba(76,175,80,0.1)',
                          background: 'linear-gradient(135deg, #ffffff 0%, rgba(76,175,80,0.02) 100%)',
                          position: 'relative',
                          overflow: 'hidden',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: '3px',
                            background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)'
                          }
                        }}
                      >
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar sx={{ 
                            width: 32, 
                            height: 32, 
                            bgcolor: '#4caf50',
                            color: 'white',
                            fontSize: '0.875rem'
                          }}>
                            {index + 1}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2" fontWeight={600} sx={{ color: '#1a1a1a' }}>
                              {s.service?.name}
                            </Typography>
                            <Stack direction="row" spacing={2} sx={{ mt: 0.5 }}>
                              <Typography variant="caption" sx={{ color: '#6c757d' }}>
                                Qty: {s.quantity}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#6c757d' }}>
                                Unit: ${Number(s.service?.price || 0).toFixed(2)}
                              </Typography>
                            </Stack>
                          </Box>
                          <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#4caf50' }}>
                            ${(Number(s.service?.price || 0) * Number(s.quantity || 1)).toFixed(2)}
                          </Typography>
                        </Stack>
                      </Paper>
                    ))}
                    
                    <Box sx={{ 
                      mt: 2, 
                      p: 2, 
                      borderRadius: 2,
                      bgcolor: 'rgba(3,135,217,0.05)',
                      border: '1px solid rgba(3,135,217,0.2)'
                    }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" fontWeight={700} sx={{ color: '#0387d9' }}>
                          Total Amount
                        </Typography>
                        <Typography variant="h5" fontWeight={800} sx={{ color: '#0387d9' }}>
                          ${booking.services?.reduce((sum, s) => sum + (Number(s.service?.price || 0) * Number(s.quantity || 1)), 0).toFixed(2)}
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          <Paper 
            elevation={0} 
            sx={{ 
              p: isMobile ? 3 : 4, 
              borderRadius: 4,
              background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
              border: '1px solid rgba(255,193,7,0.2)',
              boxShadow: '0 8px 25px rgba(255,193,7,0.08)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)'
              }
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <Avatar sx={{ 
                  width: 48, 
                  height: 48, 
                  background: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)',
                  boxShadow: '0 4px 12px rgba(255,193,7,0.3)'
                }}>
                  <CheckCircleIcon sx={{ fontSize: 24, color: 'white' }} />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={800} sx={{ color: '#1a1a1a', letterSpacing: '-0.5px' }}>
                    Review & Confirm
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#6c757d', mt: 0.5 }}>
                    Please confirm if the service has been completed to your satisfaction
                  </Typography>
                </Box>
              </Stack>
              
              <Box sx={{ 
                p: 2.5, 
                borderRadius: 3, 
                bgcolor: 'rgba(255,193,7,0.05)',
                border: '1px dashed rgba(255,193,7,0.3)',
                mb: 3
              }}>
                <Typography variant="body2" sx={{ color: '#e65100', fontWeight: 500, textAlign: 'center' }}>
                  ⚡ Your feedback helps us maintain quality and supports our service providers
                </Typography>
              </Box>
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
                <Button
                  variant="contained"
                  startIcon={<CheckCircleIcon />}
                  size="large"
                  sx={{ 
                    bgcolor: '#4caf50',
                    minWidth: 200,
                    px: 4,
                    borderRadius: 3,
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    textTransform: 'none',
                    boxShadow: '0 6px 20px rgba(76,175,80,0.4)',
                    '&:hover': { 
                      bgcolor: '#45a049',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 8px 25px rgba(76,175,80,0.5)'
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  onClick={() => setApproveDialog(true)}
                >
                  Approve Completion
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ReportIcon />}
                  size="large"
                  sx={{ 
                    color: '#f44336',
                    borderColor: '#f44336',
                    borderWidth: 2,
                    minWidth: 200,
                    borderRadius: 3,
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    textTransform: 'none',
                    '&:hover': {
                      borderWidth: 2,
                      borderColor: '#d32f2f',
                      bgcolor: 'rgba(244,67,54,0.05)',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 8px 25px rgba(244,67,54,0.2)'
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  onClick={() => setObjectDialog(true)}
                >
                  Report Issue
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                borderRadius: 4,
                background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
                border: '1px solid rgba(156,39,176,0.1)',
                boxShadow: '0 8px 25px rgba(156,39,176,0.08)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(135deg, #9c27b0 0%, #673ab7 100%)'
                }
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <Avatar sx={{ 
                  width: 40, 
                  height: 40, 
                  background: 'linear-gradient(135deg, #9c27b0 0%, #673ab7 100%)',
                  boxShadow: '0 4px 12px rgba(156,39,176,0.3)'
                }}>
                  <BusinessIcon sx={{ fontSize: 20, color: 'white' }} />
                </Avatar>
                <Typography variant="h6" fontWeight={700} sx={{ color: '#9c27b0' }}>
                  Booking Information
                </Typography>
              </Stack>
              <Stack spacing={2.5}>
                <InfoRow 
                  icon={<BusinessIcon sx={{ color: '#9c27b0' }} />} 
                  label="Booking ID" 
                  value={booking.bookingId} 
                />
                <InfoRow 
                  icon={<CalendarIcon sx={{ color: '#9c27b0' }} />} 
                  label="Completed At" 
                  value={formatDateTime(booking.completedAt)} 
                />
                <InfoRow 
                  icon={<CalendarIcon sx={{ color: '#9c27b0' }} />} 
                  label="Created" 
                  value={formatDateTime(booking.createdAt)} 
                />
              </Stack>
            </Paper>

            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                borderRadius: 4,
                background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
                border: '1px solid rgba(255,87,34,0.1)',
                boxShadow: '0 8px 25px rgba(255,87,34,0.08)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(135deg, #ff5722 0%, #f4511e 100%)'
                }
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <Avatar sx={{ 
                  width: 40, 
                  height: 40, 
                  background: 'linear-gradient(135deg, #ff5722 0%, #f4511e 100%)',
                  boxShadow: '0 4px 12px rgba(255,87,34,0.3)'
                }}>
                  <CalendarIcon sx={{ fontSize: 20, color: 'white' }} />
                </Avatar>
                <Typography variant="h6" fontWeight={700} sx={{ color: '#ff5722' }}>
                  Timeline
                </Typography>
              </Stack>
              <Stack spacing={2}>
                {booking.statusHistory?.slice(-3).map((status, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      p: 2, 
                      borderRadius: 2,
                      bgcolor: 'rgba(255,87,34,0.05)',
                      border: '1px solid rgba(255,87,34,0.1)',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: '3px',
                        bgcolor: '#ff5722'
                      }
                    }}
                  >
                    <Typography variant="caption" sx={{ color: '#ff5722', fontWeight: 600, textTransform: 'uppercase' }}>
                      {status.toStatus}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6c757d', mt: 0.5 }}>
                      {formatDateTime(status.changedAt)}
                    </Typography>
                    {status.reason && (
                      <Typography variant="caption" sx={{ color: '#6c757d', mt: 0.5, display: 'block' }}>
                        {status.reason}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Stack>
        </Grid>
      </Grid>

      {/* Enhanced Approve Dialog */}
      <Dialog 
        open={approveDialog} 
        onClose={() => setApproveDialog(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          fontWeight: 700, 
          fontSize: '1.5rem',
          bgcolor: '#f8fafe',
          borderBottom: '1px solid #e3f2fd',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          py: 2.5
        }}>
          <CheckCircleIcon sx={{ color: '#0387d9', fontSize: 28 }} />
          <Box>
            <Typography variant="h6" fontWeight={700} sx={{ color: '#212529' }}>
              Rate Your Experience
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {booking.vendorName} • #{booking.bookingId}
            </Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ p: 3 }}>
            {/* Rating Section */}
            <Box sx={{ 
              textAlign: 'center', 
              mb: 4,
              p: 3,
              bgcolor: '#fafbfc',
              borderRadius: 2,
              border: '1px solid #e9ecef'
            }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: '#495057' }}>
                How was the service?
              </Typography>
              
              {/* Custom Rating with Animation and Colors */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: 1, 
                mb: 2,
                '& .MuiRating-root': {
                  fontSize: '2.5rem'
                }
              }}>
                <Rating
                  value={rating}
                  onChange={(_, newValue) => setRating(newValue || 0)}
                  onChangeActive={(_, newHover) => setRatingHover(newHover)}
                  icon={<StarIcon sx={{ 
                    color: ratingLabels[ratingHover !== -1 ? ratingHover : rating]?.color || '#0387d9',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                    transition: 'all 0.2s ease'
                  }} />}
                  emptyIcon={<StarBorderIcon sx={{ 
                    color: '#d1d5db',
                    transition: 'all 0.2s ease'
                  }} />}
                  sx={{
                    '& .MuiRating-iconFilled': {
                      transform: 'scale(1.1)',
                      transition: 'transform 0.2s ease'
                    }
                  }}
                />
              </Box>
              
              {/* Rating Label with Emoji */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: 1,
                minHeight: 40
              }}>
                {(ratingHover !== -1 || rating > 0) && (
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    animation: `${fadeIn} 0.3s ease`
                  }}>
                    <Typography 
                      variant="h4" 
                      sx={{ fontSize: '1.8rem' }}
                    >
                      {ratingLabels[ratingHover !== -1 ? ratingHover : rating]?.emoji}
                    </Typography>
                    <Typography 
                      variant="h6" 
                      fontWeight={600}
                      sx={{ 
                        color: ratingLabels[ratingHover !== -1 ? ratingHover : rating]?.color,
                        transition: 'color 0.2s ease'
                      }}
                    >
                      {ratingLabels[ratingHover !== -1 ? ratingHover : rating]?.text}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>

            {/* Quick Feedback Tags */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: '#495057' }}>
                What stood out? (Optional)
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 1,
                maxHeight: 120,
                overflowY: 'auto',
                pr: 1
              }}>
                {quickFeedbackTags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onClick={() => toggleTag(tag)}
                    variant={selectedTags.includes(tag) ? 'filled' : 'outlined'}
                    sx={{
                      borderColor: selectedTags.includes(tag) ? '#0387d9' : '#d1d5db',
                      bgcolor: selectedTags.includes(tag) ? '#0387d9' : 'transparent',
                      color: selectedTags.includes(tag) ? '#fff' : '#6c757d',
                      fontWeight: selectedTags.includes(tag) ? 600 : 400,
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: selectedTags.includes(tag) ? '#0275bf' : '#f8f9fa',
                        borderColor: '#0387d9',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 2px 8px rgba(3,135,217,0.15)'
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Additional Feedback */}
            <Box>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: '#495057' }}>
                Additional Comments (Optional)
              </Typography>
              <TextField
                placeholder="Share more details about your experience..."
                fullWidth
                multiline
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: '#0387d9'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#0387d9',
                      borderWidth: 2
                    }
                  }
                }}
                inputProps={{ maxLength: 500 }}
                helperText={`${feedback.length}/500 characters`}
                FormHelperTextProps={{
                  sx: { 
                    textAlign: 'right',
                    color: feedback.length > 450 ? 'warning.main' : 'text.secondary'
                  }
                }}
              />
            </Box>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ 
          p: 3, 
          pt: 0,
          bgcolor: '#fafbfc',
          borderTop: '1px solid #e9ecef'
        }}>
          <Button 
            onClick={() => setApproveDialog(false)} 
            disabled={submitting}
            sx={{ 
              textTransform: 'none',
              fontWeight: 500,
              color: '#6c757d',
              px: 3
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleApprove} 
            disabled={submitting || rating === 0}
            startIcon={submitting ? null : <CheckCircleIcon />}
            sx={{ 
              bgcolor: '#0387d9',
              '&:hover': { bgcolor: '#0275bf' },
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
              py: 1.2,
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(3,135,217,0.3)'
            }}
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Enhanced Object Dialog */}
      <Dialog 
        open={objectDialog} 
        onClose={() => setObjectDialog(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          fontWeight: 700,
          fontSize: '1.3rem',
          bgcolor: '#fef7f7',
          borderBottom: '1px solid #ffebee',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          py: 2.5
        }}>
          <ReportIcon sx={{ color: '#f44336', fontSize: 28 }} />
          <Box>
            <Typography variant="h6" fontWeight={700} sx={{ color: '#212529' }}>
              Report an Issue
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Help us understand what went wrong
            </Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Box sx={{
                p: 2,
                bgcolor: '#fff3e0',
                borderRadius: 2,
                border: '1px solid #ffe0b2'
              }}>
                <Typography variant="body2" color="#e65100" fontWeight={500}>
                  💡 Your feedback helps us maintain service quality and resolve issues quickly.
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5, color: '#495057' }}>
                  What was the issue? *
                </Typography>
                <TextField
                  fullWidth
                  value={objectionReason}
                  onChange={(e) => setObjectionReason(e.target.value)}
                  placeholder="e.g., Work not completed, Quality issues, Damage to property"
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: '#f44336'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#f44336',
                        borderWidth: 2
                      }
                    }
                  }}
                />
              </Box>
              
              <Box>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5, color: '#495057' }}>
                  Please provide details
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={5}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Please describe the issue in detail. Include any relevant information that will help us understand and resolve the problem."
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: '#f44336'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#f44336',
                        borderWidth: 2
                      }
                    }
                  }}
                  inputProps={{ maxLength: 1000 }}
                  helperText={`${details.length}/1000 characters`}
                  FormHelperTextProps={{
                    sx: { 
                      textAlign: 'right',
                      color: details.length > 900 ? 'warning.main' : 'text.secondary'
                    }
                  }}
                />
              </Box>
            </Stack>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ 
          p: 3, 
          pt: 0,
          bgcolor: '#fafbfc',
          borderTop: '1px solid #e9ecef'
        }}>
          <Button 
            onClick={() => setObjectDialog(false)} 
            disabled={submitting}
            sx={{ 
              textTransform: 'none',
              fontWeight: 500,
              color: '#6c757d',
              px: 3
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="error"
            onClick={handleObject} 
            disabled={submitting || !objectionReason.trim()}
            startIcon={submitting ? null : <ReportIcon />}
            sx={{ 
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
              py: 1.2,
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(244,67,54,0.3)'
            }}
          >
            {submitting ? 'Submitting...' : 'Submit Report'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CompletedBookingDetails;


