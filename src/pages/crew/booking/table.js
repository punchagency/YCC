import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useToast } from "../../../components/Toast";
import { Pagination } from "../../../components/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Box,
  Grid,
  Divider,
  Alert,
  Button,
  useTheme,
  useMediaQuery,
  TableSortLabel,
  Skeleton
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  GetApp as GetAppIcon,
  Edit as EditIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon
} from '@mui/icons-material';

const BookingTable = ({ bookings, loading, error, fetchBookings, page, setPage, limit, setLimit, totalPages, totalItems }) => {
  const { showError } = useToast();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = useCallback((field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField, sortDirection]);

  const getStatusColor = useCallback((status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'warning';
      case 'confirmed': return 'info';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      case 'declined': return 'error';
      default: return 'default';
    }
  }, []);

  const formatServices = useCallback((services) => {
    if (!services || services.length === 0) return 'N/A';
    return services.map(s => s.service?.name).filter(Boolean).join(', ') || 'N/A';
  }, []);

  const handleViewDetails = useCallback(
    (bookingId) => {
      const bookingDetails = bookings.find(
        (booking) =>
          booking.bookingId === bookingId || booking._id === bookingId
      );

      if (bookingDetails) {
        navigate(`/crew/booking/details/${bookingId}`, {
          state: { bookingDetails },
        });
      } else {
        console.error("Booking not found with ID:", bookingId);
      }
    },
    [bookings, navigate]
  );

  const handleDownloadPDF = useCallback(
    (booking) => {
      try {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text("Booking Details", 14, 22);
        doc.setFontSize(12);
        doc.text(
          `Booking ID: ${booking.bookingId || booking._id || "N/A"}`,
          14,
          32
        );
        doc.text(
          `Date: ${
            booking.dateTime
              ? new Date(booking.dateTime).toLocaleString()
              : "N/A"
          }`,
          14,
          38
        );

        doc.setFontSize(16);
        doc.text("Vendor Information", 14, 48);
        doc.setFontSize(12);
        doc.text(`Vendor: ${booking.vendorName || "N/A"}`, 14, 54);

        doc.setFontSize(16);
        doc.text("Service Details", 14, 64);
        doc.setFontSize(12);

        const serviceName =
          booking.services &&
          booking.services.length > 0 &&
          booking.services[0].service
            ? booking.services[0].service.name
            : "N/A";

        const servicePrice =
          booking.services &&
          booking.services.length > 0 &&
          booking.services[0].service
            ? `$${booking.services[0].service.price}`
            : "N/A";

        doc.text(`Service: ${serviceName}`, 14, 70);
        doc.text(
          `Location: ${
            booking.serviceLocation || booking.deliveryAddress || "N/A"
          }`,
          14,
          76
        );
        doc.text(`Price: ${servicePrice}`, 14, 82);
        doc.text(`Status: ${booking.status || "Pending"}`, 14, 88);

        const filename = `booking-${
          booking.bookingId || booking._id || "details"
        }.pdf`;

        doc.save(filename);
      } catch (error) {
        console.error("Error generating PDF:", error);
        showError("Failed to generate PDF. Please try again.");
      }
    },
    [showError]
  );

  if (loading) {
    return (
      <Box sx={{ marginTop: 2 }}>
        {isMobile ? (
          <Grid container spacing={2}>
            {[...Array(3)].map((_, index) => (
              <Grid item xs={12} key={index}>
                <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Skeleton variant="text" width={120} height={28} />
                      <Skeleton variant="rounded" width={80} height={24} />
                    </Box>
                    <Box mb={2}>
                      <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
                      <Skeleton variant="text" width="80%" height={20} sx={{ mb: 1 }} />
                      <Skeleton variant="text" width="90%" height={20} sx={{ mb: 1 }} />
                      <Skeleton variant="text" width="70%" height={20} />
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Box display="flex" justifyContent="flex-end" gap={1}>
                      <Skeleton variant="circular" width={32} height={32} />
                      <Skeleton variant="circular" width={32} height={32} />
                      <Skeleton variant="circular" width={32} height={32} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <Table>
              <TableHead sx={{ bgcolor: 'grey.50' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Booking ID</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Services</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Vendor</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Location</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Date & Time</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2, textAlign: 'center' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton variant="text" width={100} /></TableCell>
                    <TableCell><Skeleton variant="text" width={150} /></TableCell>
                    <TableCell><Skeleton variant="text" width={120} /></TableCell>
                    <TableCell><Skeleton variant="text" width={130} /></TableCell>
                    <TableCell><Skeleton variant="text" width={140} /></TableCell>
                    <TableCell><Skeleton variant="rounded" width={80} height={24} /></TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Box display="flex" justifyContent="center" gap={1}>
                        <Skeleton variant="circular" width={32} height={32} />
                        <Skeleton variant="circular" width={32} height={32} />
                        <Skeleton variant="circular" width={32} height={32} />
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    );
  }

  if (error) {
    return (
      <Alert 
        severity="error" 
        action={
          <Button color="inherit" size="small" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        }
        sx={{ m: 2 }}
      >
        {error}
      </Alert>
    );
  }

  if (bookings.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
        <Typography variant="h6" color="text.secondary">
          No bookings found
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ mt: 1 }}>
      {isMobile ? (
        // Mobile Card Layout
        <Grid container spacing={2}>
          {bookings.map((item, index) => (
            <Grid item xs={12} key={index}>
              <Card 
                sx={{ 
                  borderRadius: 3,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Typography variant="h6" fontWeight={600} color="primary">
                      {item.bookingId || 'N/A'}
                    </Typography>
                    <Chip 
                      label={item.bookingStatus || 'Pending'} 
                      color={getStatusColor(item.bookingStatus)}
                      size="small"
                      sx={{ textTransform: 'capitalize', fontWeight: 500 }}
                    />
                  </Box>
                  
                  <Box mb={2}>
                    <Box display="flex" alignItems="center" mb={1}>
                      <BusinessIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
                      <Typography variant="body2" fontWeight={500}>
                        {formatServices(item.services)}
                      </Typography>
                    </Box>
                    
                    <Box display="flex" alignItems="center" mb={1}>
                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 60 }}>
                        Vendor:
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {item.vendorName || 'N/A'}
                      </Typography>
                    </Box>
                    
                    <Box display="flex" alignItems="center" mb={1}>
                      <LocationIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
                      <Typography variant="body2" noWrap>
                        {item.serviceLocation || item.deliveryAddress || 'N/A'}
                      </Typography>
                    </Box>
                    
                    <Box display="flex" alignItems="center">
                      <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
                      <Typography variant="body2">
                        {item.dateTime ? new Date(item.dateTime).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        }) : 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box display="flex" justifyContent="flex-end" gap={1}>
                    <IconButton 
                      size="small" 
                      onClick={() => handleViewDetails(item.bookingId || item._id)}
                      sx={{ 
                        bgcolor: 'primary.main', 
                        color: 'white',
                        '&:hover': { bgcolor: 'primary.dark' }
                      }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small"
                      sx={{ 
                        bgcolor: 'secondary.main', 
                        color: 'white',
                        '&:hover': { bgcolor: 'secondary.dark' }
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => handleDownloadPDF(item)}
                      sx={{ 
                        bgcolor: 'success.main', 
                        color: 'white',
                        '&:hover': { bgcolor: 'success.dark' }
                      }}
                    >
                      <GetAppIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        // Desktop Table Layout
        <TableContainer 
          component={Paper} 
          sx={{ 
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            overflow: 'hidden'
          }}
        >
          <Table>
            <TableHead sx={{ bgcolor: 'grey.50' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>
                  <TableSortLabel
                    active={sortField === 'bookingId'}
                    direction={sortField === 'bookingId' ? sortDirection : 'asc'}
                    onClick={() => handleSort('bookingId')}
                  >
                    Booking ID
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>
                  <TableSortLabel
                    active={sortField === 'serviceType'}
                    direction={sortField === 'serviceType' ? sortDirection : 'asc'}
                    onClick={() => handleSort('serviceType')}
                  >
                    Services
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>
                  <TableSortLabel
                    active={sortField === 'vendorName'}
                    direction={sortField === 'vendorName' ? sortDirection : 'asc'}
                    onClick={() => handleSort('vendorName')}
                  >
                    Vendor
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>Location</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>
                  <TableSortLabel
                    active={sortField === 'dateTime'}
                    direction={sortField === 'dateTime' ? sortDirection : 'asc'}
                    onClick={() => handleSort('dateTime')}
                  >
                    Date & Time
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2, textAlign: 'center' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((item, index) => (
                <TableRow 
                  key={index}
                  sx={{ 
                    '&:hover': { bgcolor: 'grey.50' },
                    transition: 'background-color 0.2s ease'
                  }}
                >
                  <TableCell sx={{ py: 2 }}>
                    <Typography variant="body2" fontWeight={500} color="primary">
                      {item.bookingId || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 2, maxWidth: 200 }}>
                    <Typography variant="body2" noWrap>
                      {formatServices(item.services)}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 2, maxWidth: 150 }}>
                    <Typography variant="body2" noWrap>
                      {item.vendorName || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 2, maxWidth: 150 }}>
                    <Typography variant="body2" noWrap>
                      {item.serviceLocation || item.deliveryAddress || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Typography variant="body2">
                      {item.dateTime ? new Date(item.dateTime).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      }) : 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Chip 
                      label={item.bookingStatus || 'Pending'} 
                      color={getStatusColor(item.bookingStatus)}
                      size="small"
                      sx={{ textTransform: 'capitalize', fontWeight: 500 }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 2, textAlign: 'center' }}>
                    <Box display="flex" justifyContent="center" gap={1}>
                      <IconButton 
                        size="small" 
                        onClick={() => handleViewDetails(item.bookingId || item._id)}
                        sx={{ 
                          bgcolor: 'primary.main', 
                          color: 'white',
                          '&:hover': { bgcolor: 'primary.dark' }
                        }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small"
                        sx={{ 
                          bgcolor: 'secondary.main', 
                          color: 'white',
                          '&:hover': { bgcolor: 'secondary.dark' }
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => handleDownloadPDF(item)}
                        sx={{ 
                          bgcolor: 'success.main', 
                          color: 'white',
                          '&:hover': { bgcolor: 'success.dark' }
                        }}
                      >
                        <GetAppIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      <Box mt={3}>
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={limit}
          onPageChange={(newPage) => {
            setPage(newPage);
            fetchBookings({ page: newPage, limit });
          }}
          onItemsPerPageChange={(newLimit) => {
            setLimit(newLimit);
            setPage(1);
            fetchBookings({ page: 1, limit: newLimit });
          }}
          isMobile={isMobile}
        />
      </Box>
    </Box>
  );
};

export default BookingTable;