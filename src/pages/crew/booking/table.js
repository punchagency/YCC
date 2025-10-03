import React, { useState, useCallback } from "react";
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
  Skeleton,
  Tooltip
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
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        const margin = 20;
        let currentY = margin;

        // Helper function to add new page if needed
        const checkAndAddPage = (requiredHeight) => {
          if (currentY + requiredHeight > pageHeight - margin) {
            doc.addPage();
            currentY = margin;
          }
        };

        // Professional Header
        doc.setFillColor(41, 128, 185); // Blue background
        doc.rect(0, 0, pageWidth, 50, 'F');

        // Company logo placeholder (you can add actual logo here)
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('YACHT CARE CONNECT', pageWidth / 2, 25, { align: 'center' });

        // Subtitle
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('Professional Yacht Services', pageWidth / 2, 35, { align: 'center' });

        // Booking title
        currentY = 60;
        doc.setTextColor(41, 128, 185);
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('BOOKING DETAILS REPORT', pageWidth / 2, currentY, { align: 'center' });

        // Booking info box
        currentY += 15;
        checkAndAddPage(30);
        doc.setDrawColor(41, 128, 185);
        doc.setFillColor(248, 249, 250);
        doc.roundedRect(margin, currentY, pageWidth - 2 * margin, 25, 3, 3, 'FD');

        doc.setTextColor(52, 58, 64);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');

        const bookingId = booking.bookingId || booking._id || "N/A";
        const bookingDate = booking.dateTime
          ? new Date(booking.dateTime).toLocaleString()
          : "N/A";

        doc.text(`Booking ID: ${bookingId}`, margin + 10, currentY + 10);
        doc.text(`Generated: ${new Date().toLocaleString()}`, margin + 10, currentY + 18);
        doc.text(`Status: ${booking.bookingStatus || booking.status || "Pending"}`, pageWidth - margin - 60, currentY + 10);
        doc.text(`Date: ${bookingDate}`, pageWidth - margin - 60, currentY + 18);

        currentY += 35;

        // Customer Information Section
        checkAndAddPage(40);
        doc.setFillColor(41, 128, 185);
        doc.rect(margin, currentY, pageWidth - 2 * margin, 8, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('CUSTOMER INFORMATION', margin + 5, currentY + 6);

        currentY += 12;
        doc.setDrawColor(224, 224, 224);
        doc.setFillColor(250, 250, 250);
        doc.roundedRect(margin, currentY, pageWidth - 2 * margin, 25, 2, 2, 'FD');

        doc.setTextColor(52, 58, 64);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');

        const customerName = booking.crew
          ? `${booking.crew.firstName || ''} ${booking.crew.lastName || ''}`.trim()
          : 'N/A';

        doc.text(`Customer Name: ${customerName}`, margin + 5, currentY + 8);
        doc.text(`Contact Phone: ${booking.contactPhone || booking.crew?.phone || 'N/A'}`, margin + 5, currentY + 15);
        doc.text(`Email: ${booking.crew?.email || 'N/A'}`, margin + 5, currentY + 22);

        currentY += 30;

        // Service Details Section
        checkAndAddPage(50);
        doc.setFillColor(41, 128, 185);
        doc.rect(margin, currentY, pageWidth - 2 * margin, 8, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('SERVICE DETAILS', margin + 5, currentY + 6);

        currentY += 12;
        doc.setDrawColor(224, 224, 224);
        doc.setFillColor(250, 250, 250);
        doc.roundedRect(margin, currentY, pageWidth - 2 * margin, 35, 2, 2, 'FD');

        doc.setTextColor(52, 58, 64);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');

        doc.text(`Vendor: ${booking.vendorName || 'N/A'}`, margin + 5, currentY + 8);
        doc.text(`Service Location: ${booking.serviceLocation || booking.deliveryAddress || 'N/A'}`, margin + 5, currentY + 15);
        doc.text(`Vendor Location: ${booking.vendorLocation || 'N/A'}`, margin + 5, currentY + 22);
        doc.text(`Total Amount: $${booking.totalAmount?.toFixed(2) || '0.00'}`, margin + 5, currentY + 29);

        currentY += 40;

        // Services Table
        if (booking.services && booking.services.length > 0) {
          checkAndAddPage(60);

          doc.setFillColor(41, 128, 185);
          doc.rect(margin, currentY, pageWidth - 2 * margin, 8, 'F');

          doc.setTextColor(255, 255, 255);
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.text('SERVICES BREAKDOWN', margin + 5, currentY + 6);

          currentY += 12;

          // Table headers
          doc.setDrawColor(41, 128, 185);
          doc.setFillColor(248, 249, 250);
          doc.roundedRect(margin, currentY, pageWidth - 2 * margin, 8, 2, 2, 'FD');

          doc.setTextColor(41, 128, 185);
          doc.setFontSize(9);
          doc.setFont('helvetica', 'bold');
          doc.text('Service Name', margin + 5, currentY + 5);
          doc.text('Quantity', pageWidth / 2 - 10, currentY + 5);
          doc.text('Unit Price', pageWidth - margin - 40, currentY + 5);
          doc.text('Total', pageWidth - margin - 15, currentY + 5);

          currentY += 10;

          // Table rows
          doc.setFont('helvetica', 'normal');
          booking.services.forEach((service, index) => {
            const rowY = currentY + (index * 12);
            checkAndAddPage(12);

            if (index % 2 === 0) {
              doc.setFillColor(255, 255, 255);
              doc.roundedRect(margin, rowY - 2, pageWidth - 2 * margin, 10, 0, 0, 'F');
            }

            doc.setTextColor(52, 58, 64);
            doc.setFontSize(8);

            const serviceName = service.service?.name || 'Unknown Service';
            const quantity = service.quantity || 1;
            const unitPrice = service.service?.price || 0;
            const total = quantity * unitPrice;

            doc.text(serviceName, margin + 5, rowY + 3);
            doc.text(quantity.toString(), pageWidth / 2 - 5, rowY + 3, { align: 'center' });
            doc.text(`$${unitPrice.toFixed(2)}`, pageWidth - margin - 45, rowY + 3, { align: 'right' });
            doc.text(`$${total.toFixed(2)}`, pageWidth - margin - 10, rowY + 3, { align: 'right' });
            currentY += 12;
          });

          currentY += 5;
        }

        // Payment Information
        checkAndAddPage(30);
        doc.setFillColor(41, 128, 185);
        doc.rect(margin, currentY, pageWidth - 2 * margin, 8, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('PAYMENT INFORMATION', margin + 5, currentY + 6);

        currentY += 12;
        doc.setDrawColor(224, 224, 224);
        doc.setFillColor(250, 250, 250);
        doc.roundedRect(margin, currentY, pageWidth - 2 * margin, 20, 2, 2, 'FD');

        doc.setTextColor(52, 58, 64);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');

        doc.text(`Payment Status: ${booking.paymentStatus || 'Pending'}`, margin + 5, currentY + 8);
        doc.text(`Total Amount: $${booking.totalAmount?.toFixed(2) || '0.00'}`, margin + 5, currentY + 15);

        currentY += 25;

        // Footer
        const footerY = pageHeight - 30;
        doc.setFillColor(248, 249, 250);
        doc.rect(0, footerY, pageWidth, 30, 'F');

        doc.setDrawColor(224, 224, 224);
        doc.line(margin, footerY, pageWidth - margin, footerY);

        doc.setTextColor(128, 128, 128);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text('Generated by Yacht Care Connect System', pageWidth / 2, footerY + 10, { align: 'center' });
        doc.text(`Report generated on ${new Date().toLocaleString()}`, pageWidth / 2, footerY + 18, { align: 'center' });

        // Save the PDF
        const filename = `booking-${bookingId.replace(/[^a-zA-Z0-9]/g, '-')}-${new Date().getTime()}.pdf`;
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
                      onClick={() => handleViewDetails(item._id)}
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        '&:hover': { bgcolor: 'primary.dark' }
                      }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    {/* <IconButton
                      size="small"
                      sx={{
                        bgcolor: 'secondary.main',
                        color: 'white',
                        '&:hover': { bgcolor: 'secondary.dark' }
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton> */}
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
                    Booking Date
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>Created At</TableCell>
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
                  <TableCell sx={{ py: 2 }}>
                    <Typography variant="body2">
                    {item.createdAt ? new Date(item.createdAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      }) : 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 2, textAlign: 'center' }}>
                    <Box display="flex" justifyContent="center" gap={1}>
                      <Tooltip title="View Booking">
                        <IconButton
                          size="small"
                          onClick={() => handleViewDetails(item._id)}
                          sx={{
                            bgcolor: 'primary.main',
                            color: 'white',
                            '&:hover': { bgcolor: 'primary.dark' }
                          }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {/* <Tooltip title="Edit Booking">
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
                      </Tooltip> */}
                      <Tooltip title="Download PDF">
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
                      </Tooltip>
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