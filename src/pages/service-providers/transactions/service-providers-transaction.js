import React from 'react';
import { useTheme } from "../../../context/theme/themeContext";
import { useOutletContext } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Alert,
  Snackbar,
  Paper,
  Stack,
  alpha,
  Card,
  CardContent,
  Avatar,
  Chip,
  Container,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  useMediaQuery,
  useTheme as useMuiTheme,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import {
  AttachMoney as MoneyIcon,
  Assignment as AssignmentIcon,
  AccountBalance as RevenueIcon,
  Receipt as ReceiptIcon,
  Pending as PendingIcon,
  CheckCircle as PaidIcon,
  Error as FailedIcon,
  Cancel as CancelledIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Visibility as ViewIcon,
  Close as CloseIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import { fetchFinancialAnalysis } from '../../../services/service/newServiceEndpoints';

const ServiceProvidersTransactions = () => {
  const { setPageTitle } = useOutletContext() || {};
  const { theme } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  React.useEffect(() => {
    if (setPageTitle) setPageTitle("Financial Management");
  }, [setPageTitle]);

  const [params, setParams] = React.useState({ page: 1, limit: 10, status: undefined, period: "year", startDate: null, endDate: null });
  const [financialData, setFinancialData] = React.useState({});
  const [snackbar, setSnackbar] = React.useState({ open: false, message: "", severity: "success" });
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedInvoice, setSelectedInvoice] = React.useState(null);
  const [showCustomDate, setShowCustomDate] = React.useState(false);

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const fetchAnalysis = async () => {
    setIsLoading(true);
    try {
      const response = await fetchFinancialAnalysis(params);
      if (response.status) {
        setFinancialData(response.data);
      } else {
        setSnackbar({ open: true, message: "Failed to load financial data", severity: "error" });
      }
    } catch (error) {
      console.error('Error fetching financial analysis:', error);
      setSnackbar({ open: true, message: "Error loading financial data", severity: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAnalysis();
  }, [params]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCustomDateChange = (field, value) => {
    setParams(prev => ({ ...prev, [field]: value, period: 'custom', page: 1 }));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return <PaidIcon />;
      case 'pending': return <PendingIcon />;
      case 'failed': return <FailedIcon />;
      case 'cancelled': return <CancelledIcon />;
      case 'refunded': return <RefreshIcon />;
      default: return <PendingIcon />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return '#4caf50';
      case 'pending': return '#ff9800';
      case 'failed': return '#f44336';
      case 'cancelled': return '#9e9e9e';
      case 'refunded': return '#2196f3';
      default: return '#ff9800';
    }
  };

  const MetricCard = ({ title, value, icon, color, loading }) => (
    <Card
      elevation={1}
      sx={{
        background: theme === "light" ? "#ffffff" : "#1a1a1a",
        borderRadius: 3,
        overflow: 'hidden',
        height: '100%',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)'
        }
      }}
    >
      <Box sx={{ height: '4px', width: '100%', bgcolor: color }} />
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="body1" color="text.secondary" fontWeight={500}>
            {title}
          </Typography>
          <Avatar sx={{ bgcolor: alpha(color, 0.1), width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 }, color }}>
            {icon}
          </Avatar>
        </Stack>
        {loading ? (
          <Skeleton
            variant="text"
            width={{ xs: 60, sm: 80 }}
            height={{ xs: 32, sm: 40 }}
            sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}
          />
        ) : (
          <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
            {value}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  const MobileInvoiceCard = ({ invoice }) => (
    <Card
      elevation={0}
      sx={{
        mb: 2,
        borderRadius: 2,
        background: theme === "light" ? "#ffffff" : "#1a1a1a",
        border: `1px solid ${alpha('#003366', 0.1)}`
      }}
    >
      <CardContent sx={{ p: 0.7 }}>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Invoice ID
              </Typography>
              <Typography variant="body1" fontWeight={600} sx={{ wordBreak: 'break-all' }}>
                {invoice.invoiceId.substring(0, 25)}...
              </Typography>
            </Box>
            <Chip
              icon={getStatusIcon(invoice.status)}
              label={invoice.status}
              size="small"
              sx={{
                textTransform: 'capitalize',
                bgcolor: alpha(getStatusColor(invoice.status), 0.1),
                color: getStatusColor(invoice.status),
                ml: 1
              }}
            />
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Box>
              <Typography variant="body2" color="text.secondary">Customer</Typography>
              <Typography variant="body2" fontWeight={500}>
                {invoice.userId?.email?.substring(0, 20)}... || 'N/A'
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body2" color="text.secondary">Amount</Typography>
              <Typography variant="h6" fontWeight={700} color="primary.main">
                {formatCurrency(invoice.amount)}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="body2" color="text.secondary">Date</Typography>
              <Typography variant="body2">{formatDate(invoice.invoiceDate)}</Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <IconButton
                size="small"
                onClick={() => setSelectedInvoice(invoice)}
                sx={{ color: '#003366' }}
              >
                <ViewIcon fontSize="small" />
                View Details
              </IconButton>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );

  const MobileSkeletonCard = () => (
    <Card elevation={1} sx={{ mb: 2, borderRadius: 2 }}>
      <CardContent sx={{ p: 2 }}>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between">
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width={80} height={16} />
              <Skeleton variant="text" width={200} height={24} sx={{ mt: 0.5 }} />
            </Box>
            <Skeleton variant="rounded" width={60} height={24} />
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Box>
              <Skeleton variant="text" width={60} height={16} />
              <Skeleton variant="text" width={120} height={20} sx={{ mt: 0.5 }} />
            </Box>
            <Box>
              <Skeleton variant="text" width={50} height={16} />
              <Skeleton variant="text" width={80} height={28} sx={{ mt: 0.5 }} />
            </Box>
          </Stack>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Skeleton variant="text" width={40} height={16} />
              <Skeleton variant="text" width={100} height={20} sx={{ mt: 0.5 }} />
            </Box>
            <Stack direction="row" spacing={1}>
              {/* <Skeleton variant="circular" width={32} height={32} /> */}
              <Skeleton variant="rectangular" width={80} height={32} />
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );

  const handleFilterChange = (field, value) => {
    if (field === 'period') {
      setShowCustomDate(value === 'custom');
      if (value !== 'custom') {
        setParams(prev => ({ ...prev, [field]: value, startDate: null, endDate: null, page: 1 }));
      } else {
        setParams(prev => ({ ...prev, [field]: value, page: 1 }));
      }
    } else {
      setParams(prev => ({ ...prev, [field]: value, page: 1 }));
    }
  };

  const handlePageChange = (event, newPage) => {
    setParams(prev => ({ ...prev, page: newPage }));
  };

  const summary = financialData?.summary || {};
  const invoices = financialData?.invoices || [];
  const pagination = financialData?.pagination || {};

  return (
    <>
      <Box sx={{ p: { xs: 0.8, sm: 1, md: 3 }, paddingTop: "60px" }}>
        {/* Header */}
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
          <Box sx={{ position: 'absolute', top: -20, right: -20, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', zIndex: 0 }} />
          <Box sx={{ position: 'absolute', bottom: -40, left: -40, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', zIndex: 0 }} />
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  Financial Management
                </Typography>
                <Typography sx={{ opacity: 0.9, color: '#fafafa' }}>
                  Track your revenue, invoices, and financial performance
                </Typography>
              </Box>
              <Chip
                icon={<ReceiptIcon />}
                label="Transactions Dashboard"
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

        {/* Summary Cards */}
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
          <RevenueIcon fontSize="small" color="primary" />
          Financial Overview
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Total Revenue"
              value={formatCurrency(summary.totalRevenue || 0)}
              icon={<MoneyIcon />}
              color="#003366"
              loading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Pending Revenue"
              value={formatCurrency(summary.pendingRevenue || 0)}
              icon={<PendingIcon />}
              color="#ff9800"
              loading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Total Invoices"
              value={summary.totalInvoices || 0}
              icon={<AssignmentIcon />}
              color="#4caf50"
              loading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Pending Invoices"
              value={summary.statusCounts?.pending || 0}
              icon={<ReceiptIcon />}
              color="#2196f3"
              loading={isLoading}
            />
          </Grid>
        </Grid>

        {/* Filters */}
        <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 3, background: theme === "light" ? "#ffffff" : "#1a1a1a" }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterIcon fontSize="small" color="primary" />
            Filters
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={params.status || 'all'}
                  label="Status"
                  onChange={(e) => handleFilterChange('status', e.target.value === 'all' ? undefined : e.target.value)}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                  <MenuItem value="failed">Failed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                  <MenuItem value="refunded">Refunded</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Period</InputLabel>
                <Select
                  value={params.period}
                  label="Period"
                  onChange={(e) => handleFilterChange('period', e.target.value)}
                >
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="week">This Week</MenuItem>
                  <MenuItem value="month">This Month</MenuItem>
                  <MenuItem value="year">This Year</MenuItem>
                  <MenuItem value="custom">Custom Range</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {showCustomDate && (
              <>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    size="small"
                    type="date"
                    label="Start Date"
                    value={params.startDate || ''}
                    onChange={(e) => handleCustomDateChange('startDate', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    size="small"
                    type="date"
                    label="End Date"
                    value={params.endDate || ''}
                    onChange={(e) => handleCustomDateChange('endDate', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </Paper>

        {/* Invoices Table */}
        <Card elevation={1} sx={{ background: theme === "light" ? "#ffffff" : "#1a1a1a", borderRadius: 3 }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: { xs: 2, sm: 3 }, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                <ReceiptIcon fontSize="small" color="primary" />
                Invoices ({pagination.total || 0})
              </Typography>
            </Box>

            {isLoading ? (
              <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
                {isMobile ? (
                  <Stack spacing={2}>
                    {[...Array(5)].map((_, i) => (
                      <MobileSkeletonCard key={i} />
                    ))}
                  </Stack>
                ) : (
                  <Stack spacing={2}>
                    {[...Array(5)].map((_, i) => (
                      <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Skeleton variant="rectangular" width={120} height={20} />
                        <Skeleton variant="text" width={180} height={20} />
                        <Skeleton variant="rounded" width={60} height={24} />
                        <Skeleton variant="text" width={100} height={20} />
                        <Skeleton variant="rounded" width={80} height={24} />
                        <Skeleton variant="text" width={100} height={20} />
                        <Stack direction="row" spacing={1}>
                          <Skeleton variant="circular" width={32} height={32} />
                          <Skeleton variant="circular" width={32} height={32} />
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Box>
            ) : invoices.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: { xs: 6, sm: 8 } }}>
                <ReceiptIcon sx={{ fontSize: { xs: 48, sm: 64 }, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No invoices found
                </Typography>
                <Typography color="text.secondary">
                  {params.status ? 'Try adjusting your filters' : 'Start by creating your first invoice'}
                </Typography>
              </Box>
            ) : (
              <>
                {isMobile ? (
                  <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
                    {invoices.map((invoice) => (
                      <MobileInvoiceCard key={invoice._id} invoice={invoice} />
                    ))}
                  </Box>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Invoice ID</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                          <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {invoices.map((invoice) => (
                          <TableRow key={invoice._id} hover>
                            <TableCell>
                              <Typography variant="body2" fontWeight={500}>
                                {invoice.invoiceId.substring(0, 20)}...
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {invoice.userId?.email || 'N/A'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={invoice.type}
                                size="small"
                                sx={{
                                  textTransform: 'capitalize',
                                  bgcolor: alpha('#2196f3', 0.1),
                                  color: '#2196f3'
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontWeight={600}>
                                {formatCurrency(invoice.amount)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                icon={getStatusIcon(invoice.status)}
                                label={invoice.status}
                                size="small"
                                sx={{
                                  textTransform: 'capitalize',
                                  bgcolor: alpha(getStatusColor(invoice.status), 0.1),
                                  color: getStatusColor(invoice.status),
                                  '& .MuiChip-icon': {
                                    color: getStatusColor(invoice.status)
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {formatDate(invoice.invoiceDate)}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ textAlign: 'left' }}>
                              <Stack direction="row" spacing={1}>
                                <IconButton
                                  size="small"
                                  onClick={() => setSelectedInvoice(invoice)}
                                  sx={{ color: '#003366' }}
                                >
                                  <ViewIcon fontSize="small" />
                                  View Details
                                </IconButton>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}

                {pagination.pages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: { xs: 2, sm: 3 } }}>
                    <Pagination
                      count={pagination.pages}
                      page={pagination.page}
                      onChange={handlePageChange}
                      color="primary"
                      size={isMobile ? "medium" : "large"}
                    />
                  </Box>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Enhanced Invoice Details Modal */}
      <Dialog
        open={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        maxWidth="lg"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 3,
            background: theme === "light" ? "#ffffff" : "#1a1a1a",
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: { xs: 0.6, sm: 1, md: 2 },
            position: 'relative'
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Invoice Details
            </Typography>
            {selectedInvoice && (
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                {selectedInvoice.invoiceId.substring(0, 30)}...
              </Typography>
            )}
          </Box>
          <IconButton
            onClick={() => setSelectedInvoice(null)}
            sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 0.6, sm: 1, md: 2 } }}>
          {selectedInvoice && (
            <Grid container spacing={3}>
              {/* Status Overview */}
              <Grid item xs={12}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    background: alpha(getStatusColor(selectedInvoice.status), 0.1),
                    border: `1px solid ${alpha(getStatusColor(selectedInvoice.status), 0.3)}`,
                    borderRadius: 2
                  }}
                >
                  <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
                    <Box>
                      <Typography variant="h5" fontWeight={700} color={getStatusColor(selectedInvoice.status)}>
                        {formatCurrency(selectedInvoice.amount)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Invoice Amount
                      </Typography>
                    </Box>
                    <Chip
                      icon={getStatusIcon(selectedInvoice.status)}
                      label={selectedInvoice.status}
                      size="medium"
                      sx={{
                        textTransform: 'capitalize',
                        bgcolor: getStatusColor(selectedInvoice.status),
                        color: 'white',
                        fontWeight: 600,
                        '& .MuiChip-icon': { color: 'white' }
                      }}
                    />
                  </Stack>
                </Paper>
              </Grid>

              {/* Invoice Information */}
              <Grid item xs={12} md={6}>
                <Card elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ReceiptIcon fontSize="small" color="primary" />
                    Invoice Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>Invoice ID</Typography>
                      <Typography variant="body1" fontWeight={600} sx={{ wordBreak: 'break-all', mt: 0.5 }}>
                        {selectedInvoice.invoiceId}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>Type</Typography>
                      <Chip
                        label={selectedInvoice.type}
                        size="small"
                        sx={{
                          textTransform: 'capitalize',
                          bgcolor: alpha('#2196f3', 0.1),
                          color: '#2196f3',
                          mt: 0.5
                        }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>Currency</Typography>
                      <Typography variant="body1" fontWeight={600} sx={{ textTransform: 'uppercase', mt: 0.5 }}>
                        {selectedInvoice.currency}
                      </Typography>
                    </Box>
                  </Stack>
                </Card>
              </Grid>

              {/* Customer Information */}
              <Grid item xs={12} md={6}>
                <Card elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 20, height: 20, bgcolor: 'primary.main', fontSize: '0.75rem' }}>C</Avatar>
                    Customer Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>Email</Typography>
                      <Typography variant="body1" fontWeight={600} sx={{ mt: 0.5 }}>
                        {selectedInvoice.userId?.email || 'N/A'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>Customer ID</Typography>
                      <Typography variant="body1" sx={{ fontFamily: 'monospace', fontSize: '0.875rem', mt: 0.5, wordBreak: 'break-all' }}>
                        {selectedInvoice.userId?._id || 'N/A'}
                      </Typography>
                    </Box>
                  </Stack>
                </Card>
              </Grid>

              {/* Timeline */}
              <Grid item xs={12}>
                <Card elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ScheduleIcon fontSize="small" color="primary" />
                    Timeline
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <Box>
                        <Typography variant="body2" color="text.secondary" fontWeight={500}>Invoice Date</Typography>
                        <Typography variant="body1" fontWeight={600} sx={{ mt: 0.5 }}>
                          {formatDateTime(selectedInvoice.invoiceDate)}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box>
                        <Typography variant="body2" color="text.secondary" fontWeight={500}>Due Date</Typography>
                        <Typography variant="body1" fontWeight={600} sx={{ mt: 0.5 }}>
                          {selectedInvoice.dueDate && selectedInvoice.dueDate !== '1970-01-01T00:00:00.000Z'
                            ? formatDateTime(selectedInvoice.dueDate)
                            : 'No due date set'
                          }
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box>
                        <Typography variant="body2" color="text.secondary" fontWeight={500}>Last Updated</Typography>
                        <Typography variant="body1" fontWeight={600} sx={{ mt: 0.5 }}>
                          {formatDateTime(selectedInvoice.updatedAt)}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>

              {/* Related Quote */}
              {selectedInvoice.quoteId && (
                <Grid item xs={12}>
                  <Card elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AssignmentIcon fontSize="small" color="primary" />
                      Related Quote
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>Quote ID</Typography>
                      <Typography variant="body1" sx={{ fontFamily: 'monospace', fontSize: '0.875rem', mt: 0.5, wordBreak: 'break-all' }}>
                        {selectedInvoice.quoteId._id || selectedInvoice.quoteId}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: { xs: 2, sm: 3 }, bgcolor: alpha('#f5f5f5', 0.5) }}>
          <Button
            variant="contained"
            onClick={() => setSelectedInvoice(null)}
            size="large"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

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
    </>
  )
}

export default ServiceProvidersTransactions
