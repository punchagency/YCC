import BookingsDashboard from "../../../components/dashboard/bookings-dashboard";
import { Box, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Typography, IconButton, Stack, Button, Paper, Chip, Avatar } from "@mui/material";
import { useNavigate, useOutletContext } from "react-router-dom";
import React from "react";
import { CalendarToday as CalendarIcon, RoomService as ServiceIcon, Close as CloseIcon } from "@mui/icons-material";

import { getUnapprovedBookings } from "../../../services/bookings/quoteService";

const CrewDashboard = () => {
  const [unapprovedBookings, setUnapprovedBookings] = React.useState([]);
  const [showUnapprovedDialog, setShowUnapprovedDialog] = React.useState(true);
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });
  const { setPageTitle } = useOutletContext() || {};
  const navigate = useNavigate();
  React.useEffect(() => {
    if (setPageTitle) setPageTitle("Dashboard");
  }, [setPageTitle]);
  const fetchUnapprovedBookings = async () => {
    try {
      const response = await getUnapprovedBookings();
      if (response.status) {
        setUnapprovedBookings(response.data.result);
      } else {
        setSnackbar({ open: true, message: response.message, severity: "error" });
      }
    } catch (error) {
      setSnackbar({ open: true, message: "Error fetching unapproved bookings", severity: "error" });
    }
  };
  React.useEffect(() => {
    fetchUnapprovedBookings();
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
        position: "relative",
        backgroundColor: "white",
      }}
    >
      {unapprovedBookings.length > 0 && showUnapprovedDialog && (
        <Dialog
          open={true}
          onClose={() => { }}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 4,
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              overflow: 'hidden'
            }
          }}
          sx={{
            '& .MuiBackdrop-root': {
              backgroundColor: 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(4px)'
            }
          }}
        >
          <DialogTitle sx={{ 
            background: 'linear-gradient(135deg, #0387d9 0%, #0275bf 100%)',
            color: 'white',
            py: 3,
            px: 3,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="3"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              opacity: 0.1
            }
          }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
              <Box sx={{ 
                p: 1.5, 
                borderRadius: 2, 
                bgcolor: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)'
              }}>
                <ServiceIcon sx={{ fontSize: 28, color: 'white' }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" fontWeight={800} sx={{ color: 'white', letterSpacing: '-0.5px' }}>
                  Pending Reviews
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                    {unapprovedBookings.length} completed service{unapprovedBookings.length !== 1 ? 's' : ''} awaiting your approval
                  </Typography>
                  <Chip 
                    label={unapprovedBookings.length} 
                    size="small" 
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)', 
                      color: 'white', 
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.3)'
                    }} 
                  />
                </Stack>
              </Box>
              <IconButton 
                onClick={() => setShowUnapprovedDialog(false)}
                sx={{ 
                  color: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                  backdropFilter: 'blur(10px)'
                }}
              >
                <CloseIcon />
              </IconButton>
            </Stack>
          </DialogTitle>
          
          <DialogContent sx={{ 
            p: 0, 
            bgcolor: '#fafbfc',
            background: 'linear-gradient(135deg, #fafbfc 0%, #f8f9fa 100%)'
          }}>
            <Box sx={{ p: 3 }}>
              <Stack spacing={2}>
                {unapprovedBookings.map((booking, index) => {
                  const servicesCount = Array.isArray(booking.services) ? booking.services.length : 0;
                  const serviceNames = Array.isArray(booking.services) ? booking.services.slice(0, 2).map(s => s?.service?.name).filter(Boolean).join(', ') : '';
                  const totalAmount = Array.isArray(booking.services) ? booking.services.reduce((sum, s) => sum + (s.service?.price || 0) * (s.quantity || 1), 0) : 0;
                  
                  return (
                    <Paper
                      key={booking._id || booking.bookingId}
                      elevation={0}
                      sx={{
                        p: 2.5,
                        borderRadius: 3,
                        border: '1px solid #e3f2fd',
                        background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': { 
                          borderColor: '#0387d9', 
                          boxShadow: '0 8px 25px rgba(3,135,217,0.15)',
                          transform: 'translateY(-2px)',
                          '&::before': {
                            opacity: 1
                          }
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(135deg, rgba(3,135,217,0.02) 0%, rgba(3,135,217,0.05) 100%)',
                          opacity: 0,
                          transition: 'opacity 0.3s ease'
                        },
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '4px',
                          height: '100%',
                          background: 'linear-gradient(135deg, #0387d9 0%, #0275bf 100%)',
                          opacity: 0,
                          transition: 'opacity 0.3s ease'
                        },
                        '&:hover::after': {
                          opacity: 1
                        }
                      }}
                      onClick={() => navigate('/crew/bookings/completed/details', { state: { booking } })}
                    >
                      <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Avatar sx={{ 
                          bgcolor: 'linear-gradient(135deg, #0387d9 0%, #0275bf 100%)', 
                          color: 'white', 
                          width: 48, 
                          height: 48,
                          boxShadow: '0 4px 12px rgba(3,135,217,0.3)'
                        }}>
                          <ServiceIcon fontSize="small" />
                        </Avatar>
                        <Box sx={{
                          position: 'absolute',
                          top: -2,
                          right: -2,
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          bgcolor: '#4caf50',
                          border: '2px solid white',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                          animation: 'pulse 2s infinite'
                        }} />
                      </Box>
                      
                      <Box sx={{ flex: 1, minWidth: 0, position: 'relative', zIndex: 1 }}>
                        <Typography variant="h6" fontWeight={700} sx={{ color: '#1a1a1a', mb: 0.5 }} noWrap>
                          {booking.vendorName || 'Service Provider'}
                        </Typography>
                        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                          <Chip
                            label={`#${booking.bookingId}`}
                            size="small"
                            variant="outlined"
                            sx={{ 
                              borderColor: '#0387d9',
                              color: '#0387d9',
                              fontWeight: 600,
                              fontSize: '0.75rem'
                            }}
                          />
                          <Typography variant="body2" sx={{ color: '#6c757d' }}>
                            {servicesCount} service{servicesCount !== 1 ? 's' : ''}
                          </Typography>
                          {serviceNames && (
                            <Typography variant="body2" sx={{ color: '#6c757d' }} noWrap>
                              {serviceNames}{servicesCount > 2 ? '...' : ''}
                            </Typography>
                          )}
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                          <CalendarIcon fontSize="small" sx={{ color: '#9e9e9e' }} />
                          <Typography variant="caption" sx={{ color: '#6c757d', fontWeight: 500 }}>
                            {(() => { 
                              try { 
                                return new Date(booking.dateTime).toLocaleString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric', 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                }); 
                              } catch { 
                                return '—'; 
                              } 
                            })()}
                          </Typography>
                          {totalAmount > 0 && (
                            <>
                              <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#d1d5db' }} />
                              <Typography variant="caption" sx={{ color: '#6c757d', fontWeight: 600 }}>
                                ${totalAmount.toFixed(2)}
                              </Typography>
                            </>
                          )}
                        </Stack>
                      </Box>
                      
                      <Stack alignItems="flex-end" spacing={1} sx={{ position: 'relative', zIndex: 1 }}>
                        <Button
                          variant="contained"
                          size="medium"
                          sx={{
                            bgcolor: '#0387d9',
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: 2,
                            px: 3,
                            py: 1,
                            minWidth: 90,
                            boxShadow: '0 4px 12px rgba(3,135,217,0.3)',
                            '&:hover': { 
                              bgcolor: '#0275bf',
                              boxShadow: '0 6px 16px rgba(3,135,217,0.4)',
                              transform: 'translateY(-1px)'
                            },
                            transition: 'all 0.2s ease'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/crew/bookings/completed/details', { state: { booking } });
                          }}
                        >
                          Review
                        </Button>
                        <Typography variant="caption" sx={{ color: '#9e9e9e', fontStyle: 'italic' }}>
                          Tap to review
                        </Typography>
                      </Stack>
                    </Paper>
                  );
                })}
              </Stack>
              
              <Box sx={{ 
                mt: 3, 
                p: 2, 
                borderRadius: 2, 
                bgcolor: 'rgba(3,135,217,0.05)',
                border: '1px dashed rgba(3,135,217,0.2)',
                textAlign: 'center'
              }}>
                <Typography variant="body2" sx={{ color: '#0387d9', fontWeight: 500 }}>
                  💡 Quick reviews help maintain service quality and support our vendors
                </Typography>
              </Box>
            </Box>
          </DialogContent>
          
          <DialogActions sx={{ 
            p: 3, 
            bgcolor: 'white',
            borderTop: '1px solid #e9ecef',
            gap: 1
          }}>
            <Button 
              onClick={() => setShowUnapprovedDialog(false)} 
              sx={{ 
                textTransform: 'none',
                color: '#6c757d',
                fontWeight: 500,
                px: 3,
                py: 1,
                borderRadius: 2,
                '&:hover': { 
                  bgcolor: '#f8f9fa',
                  color: '#495057'
                }
              }}
            >
              Review Later
            </Button>
            <Button
              variant="outlined"
              sx={{ 
                borderColor: '#0387d9',
                color: '#0387d9',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1,
                borderRadius: 2,
                '&:hover': { 
                  bgcolor: 'rgba(3,135,217,0.05)',
                  borderColor: '#0275bf'
                }
              }}
              onClick={() => navigate('/crew/booking')}
            >
              View All Bookings
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <BookingsDashboard />
      {/* Snackbar */}
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

export default CrewDashboard;
