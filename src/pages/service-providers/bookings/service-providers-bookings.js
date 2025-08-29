import React, { useState, useEffect } from 'react';
import { useUser } from "../../../context/userContext";
import { useTheme } from "../../../context/theme/themeContext";
import { useOutletContext } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Chip,
  Alert,
  Snackbar,
  Paper,
  Stack,
  useMediaQuery,
  useTheme as useMuiTheme,
  alpha,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  InputAdornment,
  Pagination,
  Skeleton,
  Tabs,
  Tab,
  Badge,
  Divider,
} from "@mui/material";
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  RoomService as ServiceIcon,
  AttachMoney as MoneyIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  Done as DoneIcon,
  Close as CloseIcon,
  BookOnline as BookingIcon,
} from "@mui/icons-material";
import { format } from 'date-fns';
import { useNavigate } from "react-router-dom";
import { getServiceProviderBookings } from '../../../services/bookings/bookingService';

const ServiceProvidersBookings = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  
  const [bookings, setBookings] = useState([]);
  const [bookingCounts, setBookingCounts] = useState({
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    declined: 0,
    total: 0
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [bookingStatus, setBookingStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const { setPageTitle } = useOutletContext() || {};
  useEffect(() => {
    if (setPageTitle) setPageTitle("Bookings");
  }, [setPageTitle]);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        ...(bookingStatus !== "all" && { status: bookingStatus }),
      };
      
      const response = await getServiceProviderBookings(params);
      if (response.status) {
        setBookings(response.data.bookings || []);
        
        // Calculate counts from summary or bookings
        const summary = response.data.summary;
        if (summary) {
          const statusCounts = summary.statusCounts || {};
          setBookingCounts({
            pending: statusCounts.pending || 0,
            confirmed: statusCounts.confirmed || 0,
            completed: statusCounts.completed || 0,
            cancelled: statusCounts.cancelled || 0,
            declined: statusCounts.declined || 0,
            total: response.data.pagination?.totalCount || 0
          });
        }
      } else {
        setSnackbar({
          open: true,
          message: response.error || "Failed to fetch bookings",
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "An error occurred while fetching bookings",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [bookingStatus, page, rowsPerPage]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleStatusChange = (event, newValue) => {
    setBookingStatus(newValue);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#ff9800";
      case "confirmed":
        return "#2196f3";
      case "completed":
        return "#4caf50";
      case "cancelled":
      case "declined":
        return "#f44336";
      default:
        return "#757575";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "#4caf50";
      case "pending":
        return "#ff9800";
      case "failed":
        return "#f44336";
      default:
        return "#757575";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <PendingIcon fontSize="small" />;
      case "confirmed":
        return <CheckCircleIcon fontSize="small" />;
      case "completed":
        return <DoneIcon fontSize="small" />;
      case "cancelled":
      case "declined":
        return <CancelIcon fontSize="small" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return "Invalid Date";
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (!searchQuery) return true;

    const searchLower = searchQuery.toLowerCase();
    return (
      booking.bookingId?.toLowerCase().includes(searchLower) ||
      booking.crew?.firstName?.toLowerCase().includes(searchLower) ||
      booking.crew?.lastName?.toLowerCase().includes(searchLower) ||
      booking.vendorName?.toLowerCase().includes(searchLower) ||
      booking.services.some(s => s.service?.name?.toLowerCase().includes(searchLower))
    );
  });

  const paginatedBookings = filteredBookings
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Mobile booking card component
  const MobileBookingCard = ({ booking }) => {
    return (
      <Card sx={{ mb: 2, borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{
          height: '8px',
          bgcolor: getStatusColor(booking.bookingStatus),
          width: '100%'
        }} />
        <CardContent sx={{ p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Typography variant="subtitle1" fontWeight={600}>
              {booking.bookingId || "N/A"}
            </Typography>
            <Stack spacing={0.5}>
              <Chip
                size="small"
                label={booking.bookingStatus.charAt(0).toUpperCase() + booking.bookingStatus.slice(1)}
                icon={getStatusIcon(booking.bookingStatus)}
                sx={{
                  bgcolor: alpha(getStatusColor(booking.bookingStatus), 0.1),
                  color: getStatusColor(booking.bookingStatus),
                  fontWeight: 500,
                  '& .MuiChip-icon': { color: getStatusColor(booking.bookingStatus) }
                }}
              />
              <Chip
                size="small"
                label={booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                sx={{
                  bgcolor: alpha(getPaymentStatusColor(booking.paymentStatus), 0.1),
                  color: getPaymentStatusColor(booking.paymentStatus),
                  fontWeight: 500,
                }}
              />
            </Stack>
          </Stack>

          <Stack spacing={2} sx={{ mt: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <PersonIcon fontSize="small" color="action" />
              <Box>
                <Typography variant="body2">
                  {`${booking.crew?.firstName || ""} ${booking.crew?.lastName || ""}`}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {booking.crew?.phone || ""}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <MoneyIcon fontSize="small" color="action" />
              <Typography variant="body2" fontWeight={500}>
                ${booking.totalAmount?.toFixed(2) || '0.00'}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="flex-start">
              <ServiceIcon fontSize="small" color="action" sx={{ mt: 0.5 }} />
              <Box>
                {booking.services.map((item, idx) => (
                  <Typography key={idx} variant="body2">
                    {item.quantity}x {item.service?.name || "Unknown Service"}
                  </Typography>
                ))}
              </Box>
            </Stack>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CalendarIcon fontSize="small" color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Booking Date</Typography>
                    <Typography variant="body2">
                      {formatDate(booking.dateTime)}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <ScheduleIcon fontSize="small" color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Created</Typography>
                    <Typography variant="body2">
                      {formatDate(booking.createdAt)}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </Stack>
        </CardContent>

        <Divider />
        <CardActions sx={{ p: 2, pt: 1, display: 'flex', justifyContent: 'end' }}>
          <Button
            onClick={() => navigate('/service-providers/bookings/details', { state: { booking } })}
            sx={{
              color: '#333',
              borderColor: '#ccc',
              borderRadius: '12px',
              '&:hover': {
                borderColor: '#999',
                backgroundColor: alpha('#ccc', 0.1)
              },
            }}
          >
            <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
            View Details
          </Button>
        </CardActions>
      </Card>
    );
  };

  return (
    <Box sx={{ p: { xs: 0.8, sm: 1, md: 2, lg: 3 }, paddingTop: "50px !important" }}>
      {/* Header with gradient background */}
      <Paper
        elevation={0}
        sx={{
          mb: 4,
          p: 3,
          borderRadius: 3,
          background: theme === "light"
            ? 'linear-gradient(135deg, #003366 0%, #0066cc 100%)'
            : 'linear-gradient(135deg, #001a33 0%, #003366 100%)',
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
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Manage Bookings
              </Typography>
              <Typography sx={{ opacity: 0.9, color: '#fafafa' }}>
                View and manage all your service bookings
              </Typography>
            </Box>
            <Chip
              icon={<BookingIcon />}
              label={`${bookingCounts.total || 0} Total Bookings`}
              sx={{
                bgcolor: 'rgba(255,255,255,0.15)',
                color: 'white',
                fontWeight: 500,
                mt: { xs: 2, sm: 0 },
                '& .MuiChip-icon': { color: 'white' }
              }}
            />
          </Stack>
        </Box>
      </Paper>

      {/* Search and Filter */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            placeholder="Search bookings by ID, customer name, or service"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              sx: { borderRadius: 2 }
            }}
          />
        </Grid>
      </Grid>

      {/* Status Tabs */}
      <Paper sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
        <Tabs
          value={bookingStatus}
          onChange={handleStatusChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              minWidth: 120,
              py: 2
            }
          }}
        >
          <Tab
            value="all"
            label={
              <Badge badgeContent={bookingCounts.total || 0} color="primary">
                <Box sx={{ pr: 2 }}>All Bookings</Box>
              </Badge>
            }
          />
          <Tab
            value="pending"
            label={
              <Badge badgeContent={bookingCounts.pending || 0} color="warning">
                <Box sx={{ pr: 2 }}>Pending</Box>
              </Badge>
            }
          />
          <Tab
            value="confirmed"
            label={
              <Badge badgeContent={bookingCounts.confirmed || 0} color="info">
                <Box sx={{ pr: 2 }}>Confirmed</Box>
              </Badge>
            }
          />
          <Tab
            value="completed"
            label={
              <Badge badgeContent={bookingCounts.completed || 0} color="success">
                <Box sx={{ pr: 2 }}>Completed</Box>
              </Badge>
            }
          />
          <Tab
            value="declined"
            label={
              <Badge badgeContent={bookingCounts.declined || 0 + bookingCounts.cancelled || 0} color="error">
                <Box sx={{ pr: 2 }}>Cancelled</Box>
              </Badge>
            }
          />
        </Tabs>
      </Paper>

      {/* Bookings - Table for Desktop, Cards for Mobile */}
      <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
        {isLoading ? (
          <Box sx={{ p: 3 }}>
            {Array.from({ length: 5 }).map((_, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 1 }} />
              </Box>
            ))}
          </Box>
        ) : filteredBookings.length === 0 ? (
          <Box sx={{
            py: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            px: 3,
            textAlign: 'center'
          }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                mb: 2,
                bgcolor: alpha(muiTheme.palette.primary.main, 0.1),
                color: muiTheme.palette.primary.main
              }}
            >
              <BookingIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
              No Bookings Found
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 500 }}>
              {searchQuery
                ? "No bookings match your search criteria. Try adjusting your search terms."
                : bookingStatus !== "all"
                  ? `You don't have any ${bookingStatus} bookings at the moment.`
                  : "You don't have any bookings yet. Bookings will appear here when customers book your services."}
            </Typography>
          </Box>
        ) : (
          <>
            {/* Desktop Table View */}
            {!isMobile && (
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Booking ID</TableCell>
                        <TableCell>Customer</TableCell>
                        <TableCell>Services</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell>Booking Date</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Payment</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedBookings.map((booking) => (
                        <TableRow key={booking.id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight={500}>
                              {booking.bookingId || "N/A"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {`${booking.crew?.firstName || ""} ${booking.crew?.lastName || ""}`}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {booking.crew?.phone || ""}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Stack spacing={1}>
                              {booking.services.map((item, idx) => (
                                <Typography key={idx} variant="body2" noWrap>
                                  {item.quantity}x {item.service?.name || "Unknown Service"}
                                </Typography>
                              ))}
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight={500}>
                              ${booking.totalAmount?.toFixed(2) || '0.00'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {formatDate(booking.dateTime)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              label={booking.bookingStatus.charAt(0).toUpperCase() + booking.bookingStatus.slice(1)}
                              icon={getStatusIcon(booking.bookingStatus)}
                              sx={{
                                bgcolor: alpha(getStatusColor(booking.bookingStatus), 0.1),
                                color: getStatusColor(booking.bookingStatus),
                                fontWeight: 500,
                                '& .MuiChip-icon': { color: getStatusColor(booking.bookingStatus) }
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              label={booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                              sx={{
                                bgcolor: alpha(getPaymentStatusColor(booking.paymentStatus), 0.1),
                                color: getPaymentStatusColor(booking.paymentStatus),
                                fontWeight: 500,
                              }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              onClick={() => navigate('/service-providers/bookings/details', { state: { booking } })}
                              sx={{
                                color: '#333',
                                borderColor: '#ccc',
                                borderRadius: '12px',
                                '&:hover': {
                                  borderColor: '#999',
                                  backgroundColor: alpha('#ccc', 0.1)
                                },
                              }}
                            >
                              <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={filteredBookings.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </>
            )}

            {/* Mobile Card View */}
            {isMobile && (
              <Box sx={{ p: 2 }}>
                {paginatedBookings.map(booking => (
                  <MobileBookingCard key={booking.id} booking={booking} />
                ))}

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Pagination
                    count={Math.ceil(filteredBookings.length / rowsPerPage)}
                    page={page + 1}
                    onChange={(e, newPage) => handleChangePage(e, newPage - 1)}
                    color="primary"
                  />
                </Box>
              </Box>
            )}
          </>
        )}
      </Paper>

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

export default ServiceProvidersBookings;
