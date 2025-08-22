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
  ListItem,
  ListItemText,
  ListItemIcon,
  List,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  TrendingUp as TrendingUpIcon,
  Business as BusinessIcon,
  Event as EventIcon,
  Star as StarIcon,
  AttachMoney as MoneyIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  CalendarToday as CalendarIcon,
  Assessment as AssessmentIcon,
  Today as TodayIcon,
  DateRange as DateRangeIcon,
  AccountBalance as RevenueIcon,
} from "@mui/icons-material";
import { fetchServiceProviderDashboard } from '../../../services/service/newServiceEndpoints';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);


const Dashboard = () => {
  const { setPageTitle } = useOutletContext() || {};
  React.useEffect(() => {
    if (setPageTitle) setPageTitle("Dashboard");
  }, [setPageTitle]);
  const [dashboardData, setDashboardData] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const { theme } = useTheme();
  const [snackbar, setSnackbar] = React.useState({ open: false, message: "", severity: "success" });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetchServiceProviderDashboard();

      if (response.status) {
        setDashboardData(response.data);
      } else {
        setSnackbar({ open: true, message: "Failed to load dashboard data", severity: "error" });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setSnackbar({ open: true, message: "Error loading dashboard", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchDashboardData();
  }, []);

  const popularServicesChart = React.useMemo(() => {
    const services = dashboardData?.popularServices || [];
    if (!services.length) return null;

    const labelColor = theme === 'light' ? '#2b2b2b' : '#e0e0e0';
    const gridColor = theme === 'light' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.12)';
    const borderColor = theme === 'light' ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.2)';

    const palette = ['#003366', '#0066cc', '#4caf50', '#ff9800', '#9c27b0', '#2196f3', '#795548'];
    const topServices = services.slice(0, 10);

    const labels = topServices.map((s) => (s.name?.length > 20 ? `${s.name.substring(0, 20)}...` : s.name));
    const dataPoints = topServices.map((s) => s.bookings || 0);
    const backgroundColors = topServices.map((_, i) => alpha(palette[i % palette.length], 0.8));
    const hoverBackgroundColors = topServices.map((_, i) => alpha(palette[i % palette.length], 1));

    return {
      data: {
        labels,
        datasets: [
          {
            label: 'Bookings',
            data: dataPoints,
            backgroundColor: backgroundColors,
            hoverBackgroundColor: hoverBackgroundColors,
            borderColor,
            borderWidth: 1,
            borderRadius: 6,
            maxBarThickness: 36,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: (items) => items[0]?.label || '',
              label: (item) => `Bookings: ${item.parsed.y}`,
            },
          },
        },
        scales: {
          x: {
            grid: { color: gridColor, drawBorder: false },
            ticks: { color: labelColor, maxRotation: 0, autoSkip: true },
          },
          y: {
            beginAtZero: true,
            grid: { color: gridColor, drawBorder: false },
            ticks: { color: labelColor, precision: 0 },
          },
        },
      },
    };
  }, [dashboardData?.popularServices, theme]);
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
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const MetricCard = ({ title, value, icon, color, loading }) => (
    <Card
      elevation={2}
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
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {title}
          </Typography>
          <Avatar sx={{ bgcolor: alpha(color, 0.1), width: 40, height: 40, color }}>
            {icon}
          </Avatar>
        </Stack>
        {loading ? (
          <Skeleton variant="text" width={80} height={40} />
        ) : (
          <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
            {value}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  return (
    <>
      <Container maxWidth="xl" sx={{ py: 4, paddingTop: "80px" }}>
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
                  Welcome back, {loading ? <Skeleton variant="text" width={150} sx={{ display: 'inline-block' }} /> : dashboardData?.vendor?.businessName || "Service Provider"}!
                </Typography>
                <Typography sx={{ opacity: 0.9, color: '#fafafa' }}>
                  Manage your services and business operations
                </Typography>
              </Box>
              <Chip
                icon={<DashboardIcon />}
                label="Service Provider Dashboard"
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

        {/* Business Overview */}
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
          <BusinessIcon fontSize="small" color="primary" />
          Business Overview
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Total Services"
              value={dashboardData?.metrics?.totalServices || 0}
              icon={<AssignmentIcon />}
              color="#003366"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Total Bookings"
              value={dashboardData?.metrics?.totalBookings || 0}
              icon={<ScheduleIcon />}
              color="#4caf50"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Total Revenue"
              value={formatCurrency(dashboardData?.metrics?.totalRevenue || 0)}
              icon={<MoneyIcon />}
              color="#2196f3"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Customer Rating"
              value={dashboardData?.vendor?.customerSatisfaction?.averageScore?.toFixed(1) || "0.0"}
              icon={<StarIcon />}
              color="#ff9800"
              loading={loading}
            />
          </Grid>
        </Grid>

        {/* Time-based Metrics */}
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingUpIcon fontSize="small" color="primary" />
          Performance Metrics
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Today's Bookings"
              value={dashboardData?.timeMetrics?.todayBookings || 0}
              icon={<TodayIcon />}
              color="#9c27b0"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="This Week"
              value={dashboardData?.timeMetrics?.weekBookings || 0}
              icon={<DateRangeIcon />}
              color="#ff5722"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="This Month"
              value={dashboardData?.timeMetrics?.monthBookings || 0}
              icon={<CalendarIcon />}
              color="#795548"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Monthly Revenue"
              value={formatCurrency(dashboardData?.timeMetrics?.monthRevenue || 0)}
              icon={<RevenueIcon />}
              color="#607d8b"
              loading={loading}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Popular Services */}
          <Grid item xs={12} md={6}>
            <Card elevation={2} sx={{ background: theme === "light" ? "#ffffff" : "#1a1a1a", borderRadius: 3, height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AssessmentIcon fontSize="small" color="primary" />
                  Popular Services
                </Typography>
                {loading ? (
                  <Stack spacing={2}>
                    {[...Array(5)].map((_, i) => (
                      <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Skeleton variant="text" width={100} />
                        <Skeleton variant="rectangular" width={150} height={20} />
                      </Box>
                    ))}
                  </Stack>
                ) : dashboardData?.popularServices?.length > 0 ? (
                  <Box sx={{ mt: 1, height: 300 }}>
                    {popularServicesChart && (
                      <Bar data={popularServicesChart.data} options={popularServicesChart.options} />
                    )}
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <AssessmentIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography color="text.secondary">No popular services data available</Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Upcoming Bookings */}
          <Grid item xs={12} md={6}>
            <Card elevation={2} sx={{ background: theme === "light" ? "#ffffff" : "#1a1a1a", borderRadius: 3, height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ScheduleIcon fontSize="small" color="primary" />
                  Upcoming Bookings
                </Typography>
                {loading ? (
                  <Stack spacing={2}>
                    {[...Array(5)].map((_, i) => (
                      <Box key={i}>
                        <Skeleton variant="text" width="100%" />
                        <Skeleton variant="text" width={150} />
                      </Box>
                    ))}
                  </Stack>
                ) : dashboardData?.upcomingBookings?.length > 0 ? (
                  <List sx={{ p: 0, maxHeight: 300, overflow: 'auto' }}>
                    {dashboardData.upcomingBookings.slice(0, 5).map((booking) => (
                      <ListItem key={booking._id} sx={{ px: 0, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: alpha('#4caf50', 0.1), color: '#4caf50' }}>
                            <EventIcon fontSize="small" />
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={booking.bookingId}
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {formatDate(booking.date)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                {booking.serviceName.length > 50 ? `${booking.serviceName.substring(0, 50)}...` : booking.serviceName}
                              </Typography>
                            </Box>
                          }
                          primaryTypographyProps={{ fontWeight: 500 }}
                        />
                        <Chip
                          label={booking.status}
                          size="small"
                          sx={{
                            bgcolor: alpha('#4caf50', 0.1),
                            color: '#4caf50',
                            textTransform: 'capitalize'
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <ScheduleIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography color="text.secondary">No upcoming bookings</Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Business Info */}
        {!loading && dashboardData?.vendor && (
          <Paper
            elevation={0}
            sx={{
              mt: 4,
              background: theme === "light" ? alpha('#003366', 0.08) : alpha('#003366', 0.15),
              borderRadius: 3,
              border: `1px solid ${alpha('#003366', 0.3)}`,
              p: 3,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
              <BusinessIcon fontSize="small" color="primary" />
              Business Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>Business Name</Typography>
                    <Typography variant="body1" fontWeight={600}>{dashboardData.vendor.businessName}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>Address</Typography>
                    <Typography variant="body1">{(() => {
                      const address = dashboardData?.address;
                      if (address && typeof address === "object") {
                        const parts = [];
                        if (address.street) parts.push(address.street);
                        if (address.city) parts.push(address.city);
                        if (address.state) parts.push(address.state);
                        if (address.zip) parts.push(address.zip);
                        return parts.length > 0 ? parts.join(", ") : "Address not provided";
                      }
                      return "Address not provided";
                    })()}</Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>Service Areas</Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
                      {dashboardData.vendor.serviceAreas.map((area, index) => (
                        <Chip key={index} label={area} size="small" sx={{ mb: 1 }} />
                      ))}
                    </Stack>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>Customer Satisfaction</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                      <StarIcon sx={{ color: '#ff9800', fontSize: 20 }} />
                      <Typography variant="body1" fontWeight={600}>
                        {dashboardData.vendor.customerSatisfaction.averageScore.toFixed(1)}
                        <Typography component="span" color="text.secondary">({dashboardData.vendor.customerSatisfaction.totalRatings} ratings)</Typography>
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        )}
      </Container>
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

export default Dashboard
