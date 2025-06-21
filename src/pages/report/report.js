import React, { useEffect, useState, useRef } from "react";
import DashboardTitleBar from "../../components/dashboard/title-bar";

import { Bar, Line } from "react-chartjs-2";
import {
  getInventoryHealthReport,
  getSystemChartData,
  getSystemMetrics,
} from "../../services/reports/reports";

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
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Select,
  MenuItem,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { linearProgressClasses } from "@mui/material/LinearProgress";
import doctorImage from "../../assets/images/crew/doctor.png";

// --- Icons ---
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import ScienceIcon from "@mui/icons-material/Science";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InventoryIcon from "@mui/icons-material/Inventory";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import PaidIcon from "@mui/icons-material/Paid";
import SellingProductsTable from '../../components/report/selling-products-table';

// Register Chart.js components
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

// Styled component for the progress bars
const GradientLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    background: "linear-gradient(90deg, #34D399, #6EE7B7)",
  },
}));

// A single metric card component for the right-hand side
const MetricCard = ({ title, value, data }) => {
  const chartRef = useRef(null);
  const sparklineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { x: { display: false }, y: { display: false } },
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    elements: {
      point: { radius: 0 },
      line: {
        tension: 0.4,
        borderWidth: 2,
        borderColor: "#0387D9",
        fill: true,
        backgroundColor: "rgba(3, 135, 217, 0.1)",
      },
    },
  };
  const sparklineData = {
    labels: data.map((_, i) => i),
    datasets: [{ data: data }],
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        borderRadius: 3,
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        height: "100%",
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 600, my: 1 }}>
        {value}
      </Typography>
      <Box sx={{ height: 40 }}>
        <Line ref={chartRef} data={sparklineData} options={sparklineOptions} />
      </Box>
    </Paper>
  );
};

// --- A single inventory report item ---
const InventoryReportItem = ({ icon, name, value }) => (
  <Box sx={{ mb: 2.5 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      <Box component="img" src={icon} sx={{ width: 40, height: 40, borderRadius: 2, mr: 1.5 }} />
      <Typography sx={{ flexGrow: 1, fontWeight: 500 }}>
        {name}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {value}% Correct
      </Typography>
    </Box>
    <GradientLinearProgress variant="determinate" value={value} />
  </Box>
);

const Reports = () => {
  const [activityData, setActivityData] = useState({ labels: [], datasets: [] });
  const [activityDateRange, setActivityDateRange] = useState("year");
  const [inventoryDateRange, setInventoryDateRange] = useState("week");
  const barChartRef = useRef(null);
  
  const [healthReports, setHealthReports] = useState({
    stockLevels: { rate: 0 },
    supplierAvailability: { rate: 0 },
    customerSatisfaction: { rate: 0 },
    loading: true,
  });
  
  const [dateRange, setDateRange] = useState("month");
  const [summaryDateRange, setSummaryDateRange] = useState("week");
  const [ordersDateRange, setOrdersDateRange] = useState("week");
  const [inventorySummaryDateRange, setInventorySummaryDateRange] = useState("week");
  const [bookingsDateRange, setBookingsDateRange] = useState("week");
  const [financialDateRange, setFinancialDateRange] = useState("week");

  useEffect(() => {
    fetchHealthReports();
    fetchSystemActivity();
  }, []);

  const fetchHealthReports = async () => {
    try {
      const response = await getInventoryHealthReport();
      if (response.success) {
        setHealthReports({
          vaccinationRate: { rate: response.data.data.vaccinationRate || 88 },
          healthScreening: { rate: response.data.data.healthScreening || 92 },
          testingAvailability: { rate: response.data.data.testingAvailability || 89 },
          loading: false,
        });
      }
    } catch (error) {
      console.error("Error fetching health reports:", error);
      // Set loading to false even on error to not show loading state indefinitely
      setHealthReports(prev => ({...prev, loading: false}));
    }
  };

  const fetchSystemActivity = async () => {
    try {
      const response = await getSystemChartData();
      if (response.success) {
        const chartData = response.data;
        setActivityData({
          labels: chartData.map((item) => item.month),
          datasets: [
            {
              label: "Activity",
              data: chartData.map((item) => item.bookings + item.orders), // Example aggregation
              backgroundColor: "rgba(3, 135, 217, 0.6)",
              hoverBackgroundColor: "rgba(3, 135, 217, 1)",
              borderRadius: 8,
              barThickness: 15,
            },
          ],
        });
      }
    } catch (error) {
      console.error("Error fetching system activity:", error);
    }
  };

  useEffect(() => {
    // This function simulates fetching data for the selected time range.
    // Replace this with your actual backend API calls.
    const generateChartData = (range) => {
      let labels = [];
      let data = [];
      switch (range) {
        case "day":
          labels = ["12a", "3a", "6a", "9a", "12p", "3p", "6p", "9p"];
          data = [12, 15, 25, 45, 55, 48, 30, 20];
          break;
        case "week":
          labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
          data = [150, 210, 180, 250, 220, 300, 280];
          break;
        case "month":
          labels = Array.from({ length: 30 }, (_, i) => `${i + 1}`);
          data = Array.from({ length: 30 }, () => Math.floor(Math.random() * 50) + 10);
          break;
        case "year":
        default:
          labels = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
          data = [100, 150, 140, 210, 200, 280, 250, 230, 120, 280, 310, 350];
          break;
      }

      setActivityData({
        labels,
        datasets: [
          {
            label: "Activity",
            data,
            backgroundColor: "rgba(3, 135, 217, 0.6)",
            hoverBackgroundColor: "rgba(3, 135, 217, 1)",
            borderRadius: 8,
            barThickness: 15,
          },
        ],
      });
    };

    generateChartData(activityDateRange);
  }, [activityDateRange]); // Re-run when the date range changes

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true, grid: { drawBorder: false, display: false } },
      x: { grid: { display: false } },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: "#0A2647",
        titleColor: "white",
        bodyColor: "white",
        padding: 10,
        cornerRadius: 6,
        displayColors: false,
        callbacks: {
          title: () => null, // Hide title
          label: (context) => `Activity: ${context.parsed.y}`,
        },
      },
    },
    animation: {
      duration: 400,
      easing: "easeInOutQuad",
    },
  };

  const inventoryReportsData = {
    day: [
      { name: 'Vaccination Rate', value: 25, icon: doctorImage },
      { name: 'Health Screening', value: 40, icon: doctorImage },
      { name: 'Testing Availability', value: 60, icon: doctorImage },
    ],
    week: [
      { name: 'Vaccination Rate', value: 88, icon: doctorImage },
      { name: 'Health Screening', value: 92, icon: doctorImage },
      { name: 'Testing Availability', value: 89, icon: doctorImage },
    ],
    month: [
      { name: 'Vaccination Rate', value: 75, icon: doctorImage },
      { name: 'Health Screening', value: 85, icon: doctorImage },
      { name: 'Testing Availability', value: 80, icon: doctorImage },
    ],
    year: [
      { name: 'Vaccination Rate', value: 95, icon: doctorImage },
      { name: 'Health Screening', value: 98, icon: doctorImage },
      { name: 'Testing Availability', value: 92, icon: doctorImage },
    ],
  };

  const metricsData = [
    { title: 'Active Users', value: '27/80', data: [5, 6, 4, 7, 5, 6, 8, 7, 6, 7, 8, 9] },
    { title: 'Questions Answered', value: '3,298', data: [4, 5, 6, 8, 7, 6, 5, 6, 7, 8, 9, 7] },
    { title: 'Av. Session Length', value: '2m 34s', data: [8, 7, 6, 5, 6, 7, 8, 9, 8, 7, 6, 5] },
    { title: 'Current Knowledge', value: '86%', data: [6, 7, 8, 9, 8, 7, 6, 5, 6, 7, 8, 9] },
  ];

  const sellingProductsData = [
      { id: 1, name: 'Fuel', sales: 'Sold', orderType: 'Earned', trackingId: 'Placed', orderTotal: 'Processed', profit: 'Net', status: 'Confirmed' },
      { id: 2, name: 'Energy', sales: 'Delivered', orderType: 'Generated', trackingId: 'Allocated', orderTotal: 'Completed', profit: 'Gross', status: 'In Progress' },
      { id: 3, name: 'Power', sales: 'Distributed', orderType: 'Produced', trackingId: 'Assigned', orderTotal: 'Finalized', profit: 'Total', status: 'Pending' },
      { id: 4, name: 'Electricity', sales: 'Supplied', orderType: 'Achieved', trackingId: 'Settled', orderTotal: 'Executed', profit: 'Balance', status: 'Completed' },
      { id: 5, name: 'Gas', sales: 'Rendered', orderType: 'Accumulated', trackingId: 'Distributed', orderTotal: 'Confirmed', profit: 'Surplus', status: 'Flagged' },
  ];
  
  const getStatusChip = (status) => {
    const statusStyles = {
      'Confirmed': { backgroundColor: '#ECFDF3', color: '#027A48' },
      'In Progress': { backgroundColor: '#EFF8FF', color: '#175CD3' },
      'Pending': { backgroundColor: '#FFFAEB', color: '#B54708' },
      'Completed': { backgroundColor: '#F0F9FF', color: '#026AA2' },
      'Flagged': { backgroundColor: '#FEF3F2', color: '#B42318' },
    };
    return <Chip label={status} size="small" sx={{ ...statusStyles[status], borderRadius: '16px', fontWeight: 500 }} />;
  };

  const cardHoverStyle = {
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 25px 0 rgba(0,0,0,0.1)',
    }
  };

  const summaryData = {
    day: {
      orders: { inProgress: 45, pending: 20, completed: 512 },
      inventory: { inProgress: 45, pending: 2, completed: 3 },
      bookings: { inProgress: 22, pending: 8, completed: 40 },
      financial: { inProgress: 10, pending: 15, completed: 9 },
    },
    week: {
      orders: { inProgress: 885, pending: 579, completed: 9981 },
      inventory: { inProgress: 885, pending: 5, completed: 22 },
      bookings: { inProgress: 457, pending: 25, completed: 232 },
      financial: { inProgress: 125, pending: 458, completed: 89 },
    },
    month: {
      orders: { inProgress: 2500, pending: 1200, completed: 25000 },
      inventory: { inProgress: 2500, pending: 20, completed: 80 },
      bookings: { inProgress: 1200, pending: 100, completed: 900 },
      financial: { inProgress: 500, pending: 1000, completed: 400 },
    },
    year: {
        orders: { inProgress: 15000, pending: 5000, completed: 120000 },
        inventory: { inProgress: 15000, pending: 100, completed: 500 },
        bookings: { inProgress: 8000, pending: 800, completed: 5000 },
        financial: { inProgress: 3000, pending: 4000, completed: 2000 },
    }
  };
  
  const summaryCardsMeta = [
      { 
        title: 'All Orders', 
        dataKey: 'orders', 
        icon: <ShoppingCartIcon sx={{ color: '#175CD3' }} />,
        dateRange: ordersDateRange,
        setDateRange: setOrdersDateRange
      },
      { 
        title: 'Inventory', 
        dataKey: 'inventory', 
        icon: <InventoryIcon sx={{ color: '#175CD3' }} />,
        dateRange: inventorySummaryDateRange,
        setDateRange: setInventorySummaryDateRange
      },
      { 
        title: 'Bookings', 
        dataKey: 'bookings', 
        icon: <BookOnlineIcon sx={{ color: '#175CD3' }} />,
        dateRange: bookingsDateRange,
        setDateRange: setBookingsDateRange
      },
      { 
        title: 'Financial', 
        dataKey: 'financial', 
        icon: <PaidIcon sx={{ color: '#175CD3' }} />,
        dateRange: financialDateRange,
        setDateRange: setFinancialDateRange
      },
  ];

  // This new effect handles the master filter logic for the summary cards
  useEffect(() => {
    if (ordersDateRange) {
      setInventorySummaryDateRange(ordersDateRange);
      setBookingsDateRange(ordersDateRange);
      setFinancialDateRange(ordersDateRange);
    }
  }, [ordersDateRange]); // This runs whenever the "All Orders" date range changes

  return (
    <Box>
      <DashboardTitleBar title="Reports" />
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Grid container spacing={3}>
          {/* Inventory Reports Card */}
          <Grid item xs={12} md={6} lg={3}>
            <Paper elevation={2} sx={{ p: 2, borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", height: '100%', ...cardHoverStyle }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Inventory Reports
                </Typography>
                <Select
                  value={inventoryDateRange}
                  onChange={(e) => setInventoryDateRange(e.target.value)}
                  size="small"
                  variant="outlined"
                  sx={{'.MuiOutlinedInput-notchedOutline': { border: 0 } }}
                >
                  <MenuItem value="day">Day</MenuItem>
                  <MenuItem value="week">Week</MenuItem>
                  <MenuItem value="month">Month</MenuItem>
                  <MenuItem value="year">Year</MenuItem>
                </Select>
              </Box>
              {inventoryReportsData[inventoryDateRange].map((report) => (
                <InventoryReportItem key={report.name} {...report} />
              ))}
            </Paper>
          </Grid>

          {/* Activity Chart */}
          <Grid item xs={12} md={6} lg={5}>
            <Paper elevation={2} sx={{ p: 2, borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", height: '100%', ...cardHoverStyle }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Activity
                </Typography>
                <Select
                  value={activityDateRange}
                  onChange={(e) => setActivityDateRange(e.target.value)}
                  size="small"
                  variant="outlined"
                  sx={{'.MuiOutlinedInput-notchedOutline': { border: 0 } }}
                >
                  <MenuItem value="day">Day</MenuItem>
                  <MenuItem value="week">Week</MenuItem>
                  <MenuItem value="month">Month</MenuItem>
                  <MenuItem value="year">Year</MenuItem>
                </Select>
              </Box>
              <Box sx={{ height: 250 }}>
                <Bar ref={barChartRef} data={activityData} options={chartOptions} />
              </Box>
            </Paper>
          </Grid>

          {/* Metrics Cards */}
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
                {metricsData.map(metric => (
                    <Grid item xs={12} sm={6} key={metric.title}>
                        <Box sx={{...cardHoverStyle, height: '100%'}}>
                          <MetricCard title={metric.title} value={metric.value} data={metric.data} />
                        </Box>
                    </Grid>
                ))}
            </Grid>
          </Grid>

          {/* Orders Summary Section */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Orders Summary
            </Typography>
            <Grid container spacing={3}>
                {summaryCardsMeta.map(card => (
                    <Grid item xs={12} sm={6} md={6} lg={4} xl={3} key={card.title}>
                        <Paper elevation={2} sx={{ p: 2, borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", ...cardHoverStyle }}>
                           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 1 }}>
                               <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: { xs: '0.9rem', sm: '1.1rem' }, flexShrink: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                   {card.title}
                               </Typography>
                               <Box sx={{ flexShrink: 0 }}>
                                   <Select
                                       value={card.dateRange}
                                       onChange={(e) => card.setDateRange(e.target.value)}
                                       size="small"
                                       sx={{
                                           fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                           '.MuiOutlinedInput-notchedOutline': { border: 0 },
                                           '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 0 },
                                           boxShadow: 'none',
                                           '.MuiSelect-select': {
                                               paddingRight: '24px !important',
                                           }
                                       }}
                                   >
                                       <MenuItem value="day">This Day</MenuItem>
                                       <MenuItem value="week">This Week</MenuItem>
                                       <MenuItem value="month">This Month</MenuItem>
                                       <MenuItem value="year">This Year</MenuItem>
                                   </Select>
                               </Box>
                           </Box>
                           <Box sx={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center', gap: 1 }}>
                                <Box>
                                   <Typography variant="body2" color="text.secondary">In Progress</Typography>
                                   <Typography sx={{ fontWeight: 600, fontSize: { xs: '0.875rem', sm: '1rem', md: '1.1rem', lg: '1.25rem' } }}>
                                       {summaryData[card.dateRange][card.dataKey].inProgress.toLocaleString()}
                                   </Typography>
                                </Box>
                                <Box>
                                   <Typography variant="body2" color="text.secondary">Pending</Typography>
                                   <Typography sx={{ fontWeight: 600, fontSize: { xs: '0.875rem', sm: '1rem', md: '1.1rem', lg: '1.25rem' } }}>
                                       {summaryData[card.dateRange][card.dataKey].pending.toLocaleString()}
                                   </Typography>
                                </Box>
                                <Box>
                                   <Typography variant="body2" color="text.secondary">Completed</Typography>
                                   <Typography sx={{ fontWeight: 600, fontSize: { xs: '0.875rem', sm: '1rem', md: '1.1rem', lg: '1.25rem' } }}>
                                       {summaryData[card.dateRange][card.dataKey].completed.toLocaleString()}
                                   </Typography>
                                </Box>
                           </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
          </Grid>
          
          {/* Selling Products Table */}
          <Grid item xs={12}>
            <SellingProductsTable />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Reports;
