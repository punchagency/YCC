import React, { useEffect, useState, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { getDashboardSummary, generateReport } from "../../../services/crew/crewReport";
import "jspdf-autotable";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Chip from "@mui/material/Chip";
import LockIcon from "@mui/icons-material/Lock";
import { Button, Select, MenuItem, Skeleton } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useOutletContext } from "react-router-dom";

// Register the components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Helper for table header cells with filter icons
const TableHeaderCell = ({ children }) => (
  <TableCell
    sx={{
      fontWeight: 500,
      color: "#475467",
      backgroundColor: "#F9FAFB",
      borderBottom: "1px solid #EAECF0",
      whiteSpace: "nowrap",
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {children}
      <FilterListIcon sx={{ fontSize: "16px" }} />
    </Box>
  </TableCell>
);

// Skeleton components
const StatsSkeleton = () => (
  <Grid container spacing={2}>
    {[...Array(6)].map((_, index) => (
      <Grid item xs={4} lg={2} key={index}>
        <Skeleton variant="text" width={60} height={16} sx={{ mb: 0.5 }} />
        <Skeleton variant="text" width={40} height={24} />
      </Grid>
    ))}
  </Grid>
);

const TableSkeleton = () => (
  <TableBody>
    {[...Array(5)].map((_, index) => (
      <TableRow key={index}>
        {[...Array(7)].map((_, cellIndex) => (
          <TableCell key={cellIndex}>
            <Skeleton variant="text" width={cellIndex === 4 ? 60 : 80} height={20} />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </TableBody>
);

const Reports = () => {
  const { setPageTitle } = useOutletContext() || {};
  React.useEffect(() => {
    if (setPageTitle) setPageTitle("Reports");
  }, [setPageTitle]);
  const [orderStatsPeriod, setOrderStatsPeriod] = React.useState({
    orderPeriod: 'all',
    orderStartDate: null,
    orderEndDate: null
  });
  const [bookingStatsPeriod, setBookingStatsPeriod] = React.useState({
    bookingPeriod: 'all',
    bookingStartDate: null,
    bookingEndDate: null
  });
  const [activityStatsPeriod, setActivityStatsPeriod] = React.useState({
    activityPeriod: 'all',
    activityStartDate: null,
    activityEndDate: null
  });

  // Move all state hooks and functions inside the component
  const [dashboardSummary, setDashboardSummary] = useState({
    bookings: {
      inProgress: 0,
      pending: 0,
      completed: 0,
    },
    orders: {
      inProgress: 0,
      pending: 0,
      completed: 0,
    },
    financial: {
      revenue: 0,
      expenses: 0,
      profit: 0,
    },
    customerSatisfaction: 0,
  });
  const [loading, setLoading] = useState(true);

  const getStatusChip = (status) => {
    let sxProps = {};
    const normalizedStatus = status.toLowerCase();

    if (normalizedStatus.includes("confirm")) {
      sxProps = {
        backgroundColor: "#FFFAEB",
        color: "#B54708",
        label: "Confirmed",
      };
    } else if (normalizedStatus.includes("in progress")) {
      sxProps = {
        backgroundColor: "#ECFDF3",
        color: "#027A48",
        label: "In Progress",
      };
    } else if (normalizedStatus.includes("complete")) {
      sxProps = {
        backgroundColor: "#EFF8FF",
        color: "#175CD3",
        label: "Completed",
      };
    } else if (normalizedStatus.includes("pending")) {
      sxProps = {
        backgroundColor: "#FFFAEB",
        color: "#B54708",
        label: "Pending",
      };
    } else if (normalizedStatus.includes("flagged")) {
      sxProps = {
        backgroundColor: "#FEF3F2",
        color: "#B42318",
        label: "Flagged",
      };
    } else {
      sxProps = { backgroundColor: "#F2F4F7", color: "#364152", label: status };
    }

    return (
      <Chip
        label={sxProps.label}
        size="small"
        sx={{
          ...sxProps,
          fontWeight: 500,
          borderRadius: "16px",
          height: "22px",
        }}
      />
    );
  };

  const fetchDashboardSummary = async (params = {}) => {
    try {
      setLoading(true);
      console.log("Fetching dashboard summary...", params);
      const response = await getDashboardSummary(params);
      console.log("Dashboard Response:", response);

      if (response.status && response.data && response.data.data) {
        setDashboardSummary(response.data.data);
        if (!startDate && response.data.data.startDate) {
          setStartDate(response.data.data.startDate);
        }
      }
    } catch (error) {
      console.error("Error fetching dashboard summary:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch dashboard summary with filters
  useEffect(() => {
    const params = {};
    
    // Add order filters
    if (orderStatsPeriod.orderPeriod !== 'all') {
      params.orderPeriod = orderStatsPeriod.orderPeriod;
    }
    if (orderStatsPeriod.orderStartDate) {
      params.orderStartDate = orderStatsPeriod.orderStartDate.toISOString().split('T')[0];
    }
    if (orderStatsPeriod.orderEndDate) {
      params.orderEndDate = orderStatsPeriod.orderEndDate.toISOString().split('T')[0];
    }
    
    // Add booking filters
    if (bookingStatsPeriod.bookingPeriod !== 'all') {
      params.bookingPeriod = bookingStatsPeriod.bookingPeriod;
    }
    if (bookingStatsPeriod.bookingStartDate) {
      params.bookingStartDate = bookingStatsPeriod.bookingStartDate.toISOString().split('T')[0];
    }
    if (bookingStatsPeriod.bookingEndDate) {
      params.bookingEndDate = bookingStatsPeriod.bookingEndDate.toISOString().split('T')[0];
    }
    
    // Add activity filters
    if (activityStatsPeriod.activityPeriod !== 'all') {
      params.activityPeriod = activityStatsPeriod.activityPeriod;
    }
    if (activityStatsPeriod.activityStartDate) {
      params.activityStartDate = activityStatsPeriod.activityStartDate.toISOString().split('T')[0];
    }
    if (activityStatsPeriod.activityEndDate) {
      params.activityEndDate = activityStatsPeriod.activityEndDate.toISOString().split('T')[0];
    }
    
    fetchDashboardSummary(params);
  }, [orderStatsPeriod, bookingStatsPeriod, activityStatsPeriod]);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reportType, setReportType] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const toast = useRef(null);

  const reportTypeOptions = [
    { label: "All", value: "all" },
    { label: "Bookings", value: "bookings" },
    { label: "Orders", value: "orders" },
    { label: "Activities", value: "activities" },
  ];

  const fileTypeOption = [
    { label: "CSV", value: "csv" },
    { label: "PDF", value: "pdf" },
  ];
  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Please select both start and end dates",
        life: 3000,
      });
      return;
    }

    if (!reportType) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Please select a report type",
        life: 3000,
      });
      return;
    }

    if (!fileType) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Please select a file to generate the report into.",
        life: 3000,
      });
      return;
    }

    setIsGeneratingReport(true);
    try {
      const params = {
        reportType: reportType.toLowerCase(),
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        fileType: fileType
      };

      const response = await generateReport(params);
      
      if (response.status) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: response.message,
          life: 3000,
        });
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: response.message,
          life: 3000,
        });
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to generate report",
        life: 3000,
      });
    } finally {
      setIsGeneratingReport(false);
    }
  };
  // Add this function to format the recent activity data for the table
  const formatRecentActivity = () => {
    if (!dashboardSummary || !dashboardSummary.recentActivity) {
      return [];
    }

    // Format orders
    const orders = dashboardSummary.recentActivity.orders?.map((order) => ({
      type: "Order",
      id: order.orderId || order._id,
      name: order.subOrders?.[0]?.supplier?.businessName || "Order",
      vendor: order.subOrders?.[0]?.supplier?.businessName || "Unknown Vendor",
      total: order.totalPrice || 0,
      status: order.overallStatus || order.subOrders?.[0]?.status || "Pending",
      date: new Date(order.orderDate || order.createdAt).toLocaleDateString(),
    })) || [];

    // Format bookings
    const bookings = dashboardSummary.recentActivity.bookings?.map((booking) => ({
      type: "Booking",
      id: booking.bookingId || booking._id,
      name: booking.serviceName || booking.services?.[0]?.name || "Service",
      vendor: booking.vendorName || booking.vendor?.businessName || "Unknown Vendor",
      total: booking.totalAmount || booking.totalPrice || 0,
      status: booking.status || "Pending",
      date: new Date(booking.bookingDate || booking.createdAt).toLocaleDateString(),
    })) || [];

    // Combine and sort by date (newest first)
    return [...orders, ...bookings].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  };

  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div>
      <Toast ref={toast} />
      {/* Export Summary Section */}
      <Box sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
        <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
          {/* Date Range Section */}
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ mb: { xs: 1, sm: 1.5 } }}>
              <Typography variant="h6" sx={{ fontSize: { xs: '16px', sm: '18px', md: '20px' }, fontWeight: 600 }}>
                Date Range
              </Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: 0.5, sm: 1 },
                  flexDirection: { xs: "column", sm: "row" },
                  width: "100%",
                }}
              >
                <Calendar
                  value={startDate}
                  onChange={(e) => setStartDate(e.value)}
                  dateFormat="yy-mm-dd"
                  placeholder="Start Date"
                  showIcon
                  minDate={new Date(2000, 0, 1)}
                  maxDate={endDate || new Date(2100, 11, 31)}
                  icon={<CalendarMonthIcon width={18} height={18} />}
                  style={{ width: '100%' }}
                />
                <Typography sx={{ fontSize: { xs: '12px', sm: '14px' }, fontWeight: 600, py: { xs: 0.5, sm: 0 } }}>
                  to
                </Typography>
                <Calendar
                  value={endDate}
                  onChange={(e) => setEndDate(e.value)}
                  dateFormat="yy-mm-dd"
                  placeholder="End Date"
                  showIcon
                  minDate={startDate || new Date(2000, 0, 1)}
                  maxDate={new Date(2100, 11, 31)}
                  icon={<CalendarMonthIcon width={18} height={18} />}
                  style={{ width: '100%' }}
                />
              </Box>
              <Typography sx={{ color: "#666", fontSize: { xs: '11px', sm: '12px' } }}>
                Select both start and end dates to generate report
              </Typography>
            </Box>
          </Grid>

          {/* Report Type Section */}
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ mb: { xs: 1, sm: 1.5 } }}>
              <Typography variant="h6" sx={{ fontSize: { xs: '16px', sm: '18px', md: '20px' }, fontWeight: 600 }}>
                Report Type
              </Typography>
            </Box>
            <Box
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: "10px",
                p: { xs: 0.8, sm: 1 },
              }}
            >
              <Dropdown
                value={reportType}
                onChange={(e) => setReportType(e.value)}
                options={reportTypeOptions}
                placeholder="Select Report Type"
                className="w-full"
              />
            </Box>
          </Grid>

          {/* File Type selection Section */}
          <Grid item xs={12} sm={12} md={4}>
            <Box sx={{ mb: { xs: 1, sm: 1.5 } }}>
              <Typography variant="h6" sx={{ fontSize: { xs: '16px', sm: '18px', md: '20px' }, fontWeight: 600 }}>
                File Type
              </Typography>
            </Box>
            <Box
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: "10px",
                p: { xs: 0.8, sm: 1 },
              }}
            >
              <Dropdown
                value={fileType}
                onChange={(e) => setFileType(e.value)}
                options={fileTypeOption}
                placeholder="Select file type"
                className="w-full"
              />
            </Box>
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "center", sm: "flex-end" },
                gap: { xs: 1.5, sm: 2 },
                flexDirection: { xs: "column", sm: "row" },
                mt: { xs: 1, sm: 0 },
              }}
            >
              <Button
                variant="contained"
                onClick={handleGenerateReport}
                disabled={isGeneratingReport}
                sx={{
                  width: { xs: "100%", sm: "160px", md: "180px" },
                  height: { xs: "44px", sm: "40px" },
                  textTransform: "none",
                  fontSize: { xs: '14px', sm: '15px' },
                  backgroundColor: "#0387D9",
                  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                  "&:hover": {
                    backgroundColor: "#0277bd",
                    transform: { xs: "none", sm: "scale(1.05)" },
                    boxShadow: "0 4px 20px 0 rgba(0,0,0,0.12)",
                  },
                  "&:disabled": {
                    backgroundColor: "#ccc",
                    color: "#666",
                  },
                }}
              >
                {isGeneratingReport ? "Generating..." : "Generate Report"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Report Summary Section */}
      <Box sx={{ p: 3, backgroundColor: "white" }}>
        <Typography
          variant="h6"
          sx={{ mb: 3, color: "#0A2647", fontWeight: 600 }}
        >
          Report Summary
        </Typography>

        <Grid container spacing={3}>
          {/* All Orders Card */}
          <Grid item xs={12} sm={6} lg={6}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                height: "100%",
                borderRadius: 2,
                border: "1px solid #E0E7ED",
                transition:
                  "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0 4px 20px 0 rgba(0,0,0,0.12)",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 3,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LockIcon sx={{ color: "#2563EB", fontSize: 20 }} />
                  <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                    All Orders
                  </Typography>
                </Box>
                <Select
                  value={orderStatsPeriod.orderPeriod}
                  onChange={(e) => setOrderStatsPeriod(prev => ({ ...prev, orderPeriod: e.target.value }))}
                  variant="standard"
                  disableUnderline
                  sx={{
                    bgcolor: "#F8FAFC",
                    borderRadius: 1,
                    px: 1,
                    py: 0.5,
                    "& .MuiSelect-select": {
                      color: "#64748B",
                      fontSize: "caption.fontSize",
                      paddingRight: "24px !important",
                      display: "flex",
                      alignItems: "center",
                    },
                    "& .MuiSvgIcon-root": {
                      color: "#64748B",
                    },
                  }}
                >
                  <MenuItem value="all">All time</MenuItem>
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="week">This week</MenuItem>
                  <MenuItem value="month">This month</MenuItem>
                  <MenuItem value="year">This year</MenuItem>
                  <MenuItem value="custom">Custom</MenuItem>
                </Select>
              </Box>

              {loading ? (
                <StatsSkeleton />
              ) : (
                <Grid container spacing={2}>
                  <Grid item xs={4} lg={2} >
                    <Typography
                      variant="caption"
                      sx={{ color: "#64748B", display: "block", mb: 0.5 }}
                    >
                      Confirmed
                    </Typography>
                    <Typography sx={{ fontWeight: 600, fontSize: "15px" }}>
                      {dashboardSummary.orders?.confirmed || 0}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} lg={2}>
                    <Typography
                      variant="caption"
                      sx={{ color: "#64748B", display: "block", mb: 0.5 }}
                    >
                      Pending
                    </Typography>
                    <Typography sx={{ fontWeight: 600, fontSize: "15px" }}>
                      {dashboardSummary.orders?.pending || 0}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} lg={2}>
                    <Typography
                      variant="caption"
                      sx={{ color: "#64748B", display: "block", mb: 0.5 }}
                    >
                      Shipped
                    </Typography>
                    <Typography sx={{ fontWeight: 600, fontSize: "15px" }}>
                      {dashboardSummary.orders?.shipped || 0}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} lg={2}>
                    <Typography
                      variant="caption"
                      sx={{ color: "#64748B", display: "block", mb: 0.5 }}
                    >
                      Delivered
                    </Typography>
                    <Typography sx={{ fontWeight: 600, fontSize: "15px" }}>
                      {dashboardSummary.orders?.delivered || 0}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} lg={2}>
                    <Typography
                      variant="caption"
                      sx={{ color: "#64748B", display: "block", mb: 0.5 }}
                    >
                      Cancelled
                    </Typography>
                    <Typography sx={{ fontWeight: 600, fontSize: "15px" }}>
                      {dashboardSummary.orders?.cancelled || 0}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} lg={2}>
                    <Typography
                      variant="caption"
                      sx={{ color: "#64748B", display: "block", mb: 0.5 }}
                    >
                      Total
                    </Typography>
                    <Typography sx={{ fontWeight: 600, fontSize: "15px" }}>
                      {dashboardSummary.orders?.total || 0}
                    </Typography>
                  </Grid>
                </Grid>
              )}
              
              {/* Custom Date Range for Orders */}
              {orderStatsPeriod.orderPeriod === 'custom' && (
                <Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Calendar
                    value={orderStatsPeriod.orderStartDate}
                    onChange={(e) => setOrderStatsPeriod(prev => ({ ...prev, orderStartDate: e.value }))}
                    dateFormat="yy-mm-dd"
                    placeholder="Start Date"
                    showIcon
                    icon={<CalendarMonthIcon width={18} height={18} />}
                  />
                  <span style={{ fontSize: '12px' }}>to</span>
                  <Calendar
                    value={orderStatsPeriod.orderEndDate}
                    onChange={(e) => setOrderStatsPeriod(prev => ({ ...prev, orderEndDate: e.value }))}
                    dateFormat="yy-mm-dd"
                    placeholder="End Date"
                    showIcon
                    icon={<CalendarMonthIcon width={18} height={18} />}
                  />
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Bookings Card */}
          <Grid item xs={12} sm={6} lg={6}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                height: "100%",
                borderRadius: 2,
                border: "1px solid #E0E7ED",
                transition:
                  "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0 4px 20px 0 rgba(0,0,0,0.12)",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 3,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LockIcon sx={{ color: "#2563EB", fontSize: 20 }} />
                  <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                    Bookings
                  </Typography>
                </Box>
                <Select
                  value={bookingStatsPeriod.bookingPeriod}
                  onChange={(e) => setBookingStatsPeriod(prev => ({ ...prev, bookingPeriod: e.target.value }))}
                  variant="standard"
                  disableUnderline
                  sx={{
                    bgcolor: "#F8FAFC",
                    borderRadius: 1,
                    px: 1,
                    py: 0.5,
                    "& .MuiSelect-select": {
                      color: "#64748B",
                      fontSize: "caption.fontSize",
                      paddingRight: "24px !important",
                      display: "flex",
                      alignItems: "center",
                    },
                    "& .MuiSvgIcon-root": {
                      color: "#64748B",
                    },
                  }}
                >
                  <MenuItem value="all">All time</MenuItem>
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="week">This week</MenuItem>
                  <MenuItem value="month">This month</MenuItem>
                  <MenuItem value="year">This year</MenuItem>
                  <MenuItem value="custom">Custom</MenuItem>
                </Select>
              </Box>

              {loading ? (
                <StatsSkeleton />
              ) : (
                <Grid container spacing={2}>
                  <Grid item xs={4} lg={2}>
                    <Typography
                      variant="caption"
                      sx={{ color: "#64748B", display: "block", mb: 0.5 }}
                    >
                      Confirmed
                    </Typography>
                    <Typography sx={{ fontWeight: 600, fontSize: "15px" }}>
                      {dashboardSummary.bookings?.confirmed || 0}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} lg={2}>
                    <Typography
                      variant="caption"
                      sx={{ color: "#64748B", display: "block", mb: 0.5 }}
                    >
                      Pending
                    </Typography>
                    <Typography sx={{ fontWeight: 600, fontSize: "15px" }}>
                      {dashboardSummary.bookings?.pending || 0}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} lg={2}>
                    <Typography
                      variant="caption"
                      sx={{ color: "#64748B", display: "block", mb: 0.5 }}
                    >
                      Completed
                    </Typography>
                    <Typography sx={{ fontWeight: 600, fontSize: "15px" }}>
                      {dashboardSummary.bookings?.completed || 0}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} lg={2}>
                    <Typography
                      variant="caption"
                      sx={{ color: "#64748B", display: "block", mb: 0.5 }}
                    >
                      Cancelled
                    </Typography>
                    <Typography sx={{ fontWeight: 600, fontSize: "15px" }}>
                      {dashboardSummary.bookings?.cancelled || 0}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} lg={2}>
                    <Typography
                      variant="caption"
                      sx={{ color: "#64748B", display: "block", mb: 0.5 }}
                    >
                      Declined
                    </Typography>
                    <Typography sx={{ fontWeight: 600, fontSize: "15px" }}>
                      {dashboardSummary.bookings?.declined || 0}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} lg={2}>
                    <Typography
                      variant="caption"
                      sx={{ color: "#64748B", display: "block", mb: 0.5 }}
                    >
                      Total
                    </Typography>
                    <Typography sx={{ fontWeight: 600, fontSize: "15px" }}>
                      {dashboardSummary.bookings?.total || 0}
                    </Typography>
                  </Grid>
                </Grid>
              )}
              
              {/* Custom Date Range for Bookings */}
              {bookingStatsPeriod.bookingPeriod === 'custom' && (
                <Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Calendar
                    value={bookingStatsPeriod.bookingStartDate}
                    onChange={(e) => setBookingStatsPeriod(prev => ({ ...prev, bookingStartDate: e.value }))}
                    dateFormat="yy-mm-dd"
                    placeholder="Start Date"
                    showIcon
                    icon={<CalendarMonthIcon width={18} height={18} />}
                  />
                  <span style={{ fontSize: '12px' }}>to</span>
                  <Calendar
                    value={bookingStatsPeriod.bookingEndDate}
                    onChange={(e) => setBookingStatsPeriod(prev => ({ ...prev, bookingEndDate: e.value }))}
                    dateFormat="yy-mm-dd"
                    placeholder="End Date"
                    showIcon
                    icon={<CalendarMonthIcon width={18} height={18} />}
                  />
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
        
        {/* Recent Activities Section with Filter */}
        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ color: "#0A2647", fontWeight: 600 }}>
              Recent Activities
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Select
                value={activityStatsPeriod.activityPeriod}
                onChange={(e) => setActivityStatsPeriod(prev => ({ ...prev, activityPeriod: e.target.value }))}
                variant="standard"
                disableUnderline
                sx={{
                  bgcolor: "#F8FAFC",
                  borderRadius: 1,
                  px: 1,
                  py: 0.5,
                  "& .MuiSelect-select": {
                    color: "#64748B",
                    fontSize: "caption.fontSize",
                    paddingRight: "24px !important",
                    display: "flex",
                    alignItems: "center",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#64748B",
                  },
                }}
              >
                <MenuItem value="all">All time</MenuItem>
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="week">This week</MenuItem>
                <MenuItem value="month">This month</MenuItem>
                <MenuItem value="year">This year</MenuItem>
                <MenuItem value="custom">Custom</MenuItem>
              </Select>
            </Box>
          </Box>
          
          {/* Custom Date Range for Activities */}
          {activityStatsPeriod.activityPeriod === 'custom' && (
            <Box sx={{ mb: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
              <Calendar
                value={activityStatsPeriod.activityStartDate}
                onChange={(e) => setActivityStatsPeriod(prev => ({ ...prev, activityStartDate: e.value }))}
                dateFormat="yy-mm-dd"
                placeholder="Start Date"
                showIcon
                icon={<CalendarMonthIcon width={18} height={18} />}
              />
              <span style={{ fontSize: '12px' }}>to</span>
              <Calendar
                value={activityStatsPeriod.activityEndDate}
                onChange={(e) => setActivityStatsPeriod(prev => ({ ...prev, activityEndDate: e.value }))}
                dateFormat="yy-mm-dd"
                placeholder="End Date"
                showIcon
                icon={<CalendarMonthIcon width={18} height={18} />}
              />
            </Box>
          )}
          
          {/* Recent Activities Table */}
          <TableContainer component={Paper} sx={{ borderRadius: 2, border: "1px solid #E0E7ED" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Type</TableHeaderCell>
                  <TableHeaderCell>ID</TableHeaderCell>
                  <TableHeaderCell>Name</TableHeaderCell>
                  <TableHeaderCell>Vendor</TableHeaderCell>
                  <TableHeaderCell>Total</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Date</TableHeaderCell>
                </TableRow>
              </TableHead>
              {loading ? (
                <TableSkeleton />
              ) : (
                <TableBody>
                  {formatRecentActivity().slice(0, 10).map((activity, index) => (
                    <TableRow key={index}>
                      <TableCell>{activity.type}</TableCell>
                      <TableCell>{activity.id.substring(0, 8)}</TableCell>
                      <TableCell>{activity.name}</TableCell>
                      <TableCell>{activity.vendor}</TableCell>
                      <TableCell>${activity.total}</TableCell>
                      <TableCell>{getStatusChip(activity.status)}</TableCell>
                      <TableCell>{activity.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </div>
  );
};

export default Reports;
// Create and add a stylesheet element for responsive design
const responsiveStyle = document.createElement("style");
responsiveStyle.innerHTML = `
  /* Ensure the report container respects viewport height */
  .report-container {
    height: 100%;
    overflow: auto;
    display: flex;
    flex-direction: column;
  }
  
  @media screen and (max-width: 768px) {
    /* Main layout - stack everything vertically */
    .report-container-inventory-reports-and-bar-graph {
      display: flex !important;
      flex-direction: column !important;
      width: 100% !important;
      padding-left: 10px !important;
      padding-right: 10px !important;
    }
    
    /* Make all sections the EXACT same width on mobile */
    .report-container-inventory-reports,
    .report-container-bar-graph,
    .metrics-container {
      width: 92% !important;
      margin-left: auto !important;
      margin-right: auto !important;
      margin-bottom: 20px !important;
    }
    
    /* Make sure the chart container itself has the right styling */
    .report-container-bar-graph {
      background-color: #FFFFFF !important;
      border-radius: 8px !important;
      padding: 10px !important;
      box-shadow: 0px 2px 5px rgba(0,0,0,0.05) !important;
    }
    
    /* Style the chart's inner container */
    .report-container-bar-graph > div {
      width: 100% !important;
      height: 250px !important;
      padding: 5px !important;
    }
    
    /* Stack order summary boxes vertically */
    .box-order-container {
      display: flex !important;
      flex-direction: column !important;
      min-width: unset !important;
      width: 96% !important;
      margin: 0 auto !important;
    }
    
    .box1-order {
      width: 100% !important;
      min-width: unset !important;
      margin-bottom: 15px !important;
    }
    
    /* Fix selling products section */
    .selling-products-container {
      margin-top: 20px !important;
      width: 96% !important;
      margin-left: auto !important;
      margin-right: auto !important;
    }
    
    .selling-products-header {
      display: flex !important;
      flex-direction: column !important;
      align-items: flex-start !important;
    }
    
    .selling-products-header .p-button {
      width: 100% !important;
      margin-top: 10px !important;
    }
    
    /* Make table horizontally scrollable */
    .selling-products-container {
      overflow-x: auto !important;
    }
    
    .selling-products-table {
      min-width: 600px !important;
    }
    
    /* Adjust font sizes for better mobile readability */
    h3 {
      font-size: 20px !important;
    }
    
    h2 {
      font-size: 18px !important;
    }
    
    .metric-header span {
      font-size: 12px !important;
    }
    
    .metric-header h2 {
      font-size: 18px !important;
    }
    
    /* Add margin to order summary title */
    .order-summary-text-header {
      margin-top: 15px !important;
      padding-left: 2% !important;
    }
    
    /* Ensure proper height constraints on mobile */
    .report-container {
      height: 100vh !important;
      overflow: auto !important;
    }
  }
`;

// Add style element to document head
if (typeof document !== "undefined") {
  document.head.appendChild(responsiveStyle);
}