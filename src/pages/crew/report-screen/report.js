import React, { useEffect, useState, useRef } from "react";
import lockLogo from "../../../assets/images/crew/lockLogo.png";
import dropdown from "../../../assets/images/crew/dropdown.png";
import profileReport from "../../../assets/images/crew/profile-report.png";
import downloadIcon from "../../../assets/images/crew/downloadIcon.png";
import sortIcon from "../../../assets/images/crew/sort.png";
import {
  getInventoryHealthReport,
  getSystemChartData,
  getSystemMetrics,
} from "../../../services/reports/reports";
// Import and register Chart.js components
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

import { getDashboardSummary } from "../../../services/crew/crewReport";

import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Chip from '@mui/material/Chip';
import LockIcon from '@mui/icons-material/Lock';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Dashboard1 from "../../../components/dashboard/bookings-dashboard";
import DashboardTitleBar from "../../../components/dashboard/title-bar";

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

const Reports = () => {
  // Move all state hooks and functions inside the component
  const [dashboardSummary, setDashboardSummary] = useState({
    inventory: {
      inProgress: 0,
      pending: 0,
      completed: 0,
    },
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

  const fetchDashboardSummary = async () => {
    try {
      console.log("Fetching summary dashboard summary...");
      const response = await getDashboardSummary();
      console.log("Dashboard Response:", response);

      // The response has a nested structure, so we need to navigate to the correct data
      if (response.status && response.data && response.data.data) {
        console.log("Setting dashboard data:", response.data.data);
        setDashboardSummary(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard summary:", error);
    }
  };

  // All useEffect hooks must be inside the component
  useEffect(() => {
    fetchDashboardSummary();
  }, []);

  const [activityData, setActivityData] = useState({
    labels: [],
    datasets: [
      {
        label: "Bookings",
        data: [],
        backgroundColor: "#4318FF",
        borderRadius: 8,
        barThickness: 15,
        maxBarThickness: 8,
      },
      {
        label: "Orders",
        data: [],
        backgroundColor: "#6AD2FF",
        borderRadius: 8,
        barThickness: 15,
        maxBarThickness: 8,
      },
    ],
  });

  const [healthReports, setHealthReports] = useState({
    stockLevels: { rate: 0, correct: 0 },
    supplierAvailability: { rate: 0, correct: 0 },
    customerSatisfaction: { rate: 0, correct: 0 },
    loading: true,
    error: null,
  });

  const [systemMetrics, setSystemMetrics] = useState([]);

  // Add refs for your charts
  const barChartRef = useRef(null);
  const lineChartRefs = useRef([]);

  useEffect(() => {
    fetchHealthReports();
    fetchSystemActivity();
    fetchSystemMetrics();

    // Copy refs to local variables for proper cleanup
    const currentBarChart = barChartRef.current;
    const currentLineCharts = [...lineChartRefs.current];

    // Cleanup function to destroy charts when component unmounts
    return () => {
      if (currentBarChart) {
        currentBarChart.destroy();
      }

      currentLineCharts.forEach((chart) => {
        if (chart) chart.destroy();
      });
    };
  }, []);

  const fetchHealthReports = async () => {
    try {
      const response = await getInventoryHealthReport();
      console.log("Response", response);
      if (response.success) {
        setHealthReports({
          stockLevels: {
            rate: Math.round(response.data.data.stockLevels) || 0,
          },
          supplierAvailability: {
            rate: Math.round(response.data.data.supplierAvailability) || 0,
          },
          customerSatisfaction: {
            rate: Math.round(response.data.data.customerSatisfaction) || 0,
          },
          loading: false,
          error: null,
        });
      } else {
        setHealthReports((prev) => ({
          ...prev,
          loading: false,
          error: response.error || "Failed to fetch inventory health report",
        }));
      }
    } catch (error) {
      setHealthReports((prev) => ({
        ...prev,
        loading: false,
        error:
          error.message ||
          "An error occurred while fetching inventory health report",
      }));
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
              label: "Bookings",
              data: chartData.map((item) => item.bookings),
              backgroundColor: "#4318FF",
              borderRadius: 8,
              barThickness: 15,
              maxBarThickness: 8,
            },
            {
              label: "Orders",
              data: chartData.map((item) => item.orders),
              backgroundColor: "#6AD2FF",
              borderRadius: 8,
              barThickness: 15,
              maxBarThickness: 8,
            },
          ],
        });
      }
    } catch (error) {
      console.error("Error fetching system activity:", error);
    }
  };

  const fetchSystemMetrics = async () => {
    try {
      const response = await getSystemMetrics();
      if (response.success) {
        // Map the titles to your preferred display names
        const mappedMetrics = response.data.map((metric) => {
          const customTitles = {
            Users: "Active Users",
            "Customer Satisfaction": "Customer Rating",
            "Resolved Complaints": "Issues Resolved",
            "Total Revenue": "Revenue",
          };

          return {
            ...metric,
            title: customTitles[metric.title] || metric.title,
          };
        });

        setSystemMetrics(mappedMetrics);
      }
    } catch (error) {
      console.error("Error fetching system metrics:", error);
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 5,
          font: {
            size: 12,
            family: "Plus Jakarta Sans",
          },
          color: "#A3AED0",
        },
        grid: {
          color: "#F4F7FE",
          drawBorder: false,
        },
        border: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 12,
            family: "Plus Jakarta Sans",
          },
          color: "#A3AED0",
        },
        border: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          font: {
            size: 12,
            family: "Plus Jakarta Sans",
          },
          color: "#A3AED0",
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "#ffffff",
        titleColor: "#000000",
        bodyColor: "#000000",
        borderColor: "#F4F7FE",
        borderWidth: 1,
        padding: 12,
        titleFont: {
          size: 12,
          family: "Plus Jakarta Sans",
        },
        bodyFont: {
          size: 12,
          family: "Plus Jakarta Sans",
        },
      },
    },
  };

  const sparklineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { display: false },
      y: {
        display: false,
        min: 0,
        max: 10,
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    elements: {
      point: { radius: 0 },
      line: {
        tension: 0.4,
        borderWidth: 1.5,
        borderColor: "#0D6EFD",
        fill: true,
        backgroundColor: "rgba(13, 110, 253, 0.1)",
      },
    },
  };

  const sparklineData = {
    labels: ["", "", "", "", "", "", "", "", "", "", "", ""],
    datasets: [
      {
        data: [5, 6, 4, 7, 5, 6, 8, 7, 6, 7, 8, 9],
        borderColor: "#0D6EFD",
        fill: true,
        backgroundColor: "rgba(13, 110, 253, 0.1)",
      },
    ],
  };

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reportType, setReportType] = useState(null);
  const [frequency, setFrequency] = useState(null);
  const toast = useRef(null);

  const reportTypeOptions = [
    { label: "Inventory", value: "Inventory" },
    { label: "Bookings", value: "Bookings" },
    { label: "Orders", value: "Orders" },
  ];

  const frequencyOptions = [
    { label: "One-Time", value: "One-Time" },
    { label: "Daily", value: "Daily" },
    { label: "Weekly", value: "Weekly" },
    { label: "Monthly", value: "Monthly" },
  ];

  const generatePDFReport = (data) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let yPosition = 20;

    // Add company logo or header
    doc.setFontSize(24);
    doc.setTextColor(3, 135, 217);
    doc.text("YCC Reports", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 15;

    // Add report title
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text(`${reportType.toUpperCase()} REPORT`, pageWidth / 2, yPosition, {
      align: "center",
    });
    yPosition += 15;

    // Add report details
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, margin, yPosition);
    yPosition += 10;
    doc.text(
      `Date Range: ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`,
      margin,
      yPosition
    );
    yPosition += 10;
    doc.text(`Frequency: ${frequency}`, margin, yPosition);
    yPosition += 20;

    // Add summary section
    doc.setFontSize(16);
    doc.text("Summary", margin, yPosition);
    yPosition += 10;

    // Add summary data based on report type
    switch (reportType.toLowerCase()) {
      case "orders":
        generateOrdersPDF(doc, data, margin, yPosition, pageWidth);
        break;
      case "bookings":
        generateBookingsPDF(doc, data, margin, yPosition, pageWidth);
        break;
      case "inventory":
        generateInventoryPDF(doc, data, margin, yPosition, pageWidth);
        break;
    }

    // Save the PDF
    const filename = `${reportType}_Report_${
      startDate.toISOString().split("T")[0]
    }_to_${endDate.toISOString().split("T")[0]}.pdf`;
    doc.save(filename);
  };

  const generateOrdersPDF = (doc, data, margin, yPosition, pageWidth) => {
    // Add summary statistics
    const summaryData = [
      ["Metric", "Value"],
      ["Total Orders", data.orders?.total || 0],
      ["Confirmed Orders", data.orders?.confirmed || 0],
      ["Pending Orders", data.orders?.pending || 0],
    ];

    // Create table manually
    doc.setFontSize(12);
    doc.text("Summary Statistics", margin, yPosition);
    yPosition += 10;

    // Calculate column widths for wider table
    const colWidth1 = (pageWidth - margin * 2) * 0.6;
    const colWidth2 = (pageWidth - margin * 2) * 0.4;

    // Draw table header
    doc.setFillColor(3, 135, 217);
    doc.rect(margin, yPosition, colWidth1, 10, "F");
    doc.rect(margin + colWidth1, yPosition, colWidth2, 10, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text("Metric", margin + 5, yPosition + 7);
    doc.text("Value", margin + colWidth1 + 5, yPosition + 7);
    yPosition += 10;

    // Draw table rows
    doc.setTextColor(0, 0, 0);
    summaryData.slice(1).forEach((row) => {
      doc.rect(margin, yPosition, colWidth1, 10);
      doc.rect(margin + colWidth1, yPosition, colWidth2, 10);
      doc.text(row[0], margin + 5, yPosition + 7);
      doc.text(row[1].toString(), margin + colWidth1 + 5, yPosition + 7);
      yPosition += 10;
    });

    // Add recent orders if available
    const recentOrders = data.recentActivity?.orders || [];
    if (recentOrders.length > 0) {
      doc.addPage();
      yPosition = 20;
      doc.setFontSize(16);
      doc.text("Recent Orders", margin, yPosition);
      yPosition += 15;

      // Calculate column widths for wider table
      const colWidths = [
        (pageWidth - margin * 2) * 0.15, // ID
        (pageWidth - margin * 2) * 0.25, // Product
        (pageWidth - margin * 2) * 0.25, // Vendor
        (pageWidth - margin * 2) * 0.15, // Date
        (pageWidth - margin * 2) * 0.2, // Total
      ];

      // Draw table header
      doc.setFillColor(3, 135, 217);
      let currentX = margin;
      colWidths.forEach((width) => {
        doc.rect(currentX, yPosition, width, 10, "F");
        currentX += width;
      });

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      currentX = margin;
      doc.text("ID", currentX + 5, yPosition + 7);
      currentX += colWidths[0];
      doc.text("Product", currentX + 5, yPosition + 7);
      currentX += colWidths[1];
      doc.text("Vendor", currentX + 5, yPosition + 7);
      currentX += colWidths[2];
      doc.text("Date", currentX + 5, yPosition + 7);
      currentX += colWidths[3];
      doc.text("Total", currentX + 5, yPosition + 7);
      yPosition += 10;

      // Draw table rows
      doc.setTextColor(0, 0, 0);
      recentOrders.forEach((order) => {
        currentX = margin;
        colWidths.forEach((width) => {
          doc.rect(currentX, yPosition, width, 10);
          currentX += width;
        });

        currentX = margin;
        doc.text(order._id.substring(0, 8), currentX + 5, yPosition + 7);
        currentX += colWidths[0];
        doc.text(
          order.products?.[0]?.name || "Product",
          currentX + 5,
          yPosition + 7
        );
        currentX += colWidths[1];
        doc.text(order.vendorName, currentX + 5, yPosition + 7);
        currentX += colWidths[2];
        doc.text(
          new Date(order.createdAt).toLocaleDateString(),
          currentX + 5,
          yPosition + 7
        );
        currentX += colWidths[3];
        doc.text(`$${order.totalPrice || 0}`, currentX + 5, yPosition + 7);
        yPosition += 10;
      });
    }
  };

  const generateBookingsPDF = (doc, data, margin, yPosition, pageWidth) => {
    // Add summary statistics
    const summaryData = [
      ["Metric", "Value"],
      ["Total Bookings", data.bookings?.total || 0],
      ["Confirmed Bookings", data.bookings?.confirmed || 0],
      ["Pending Bookings", data.bookings?.pending || 0],
    ];

    // Create table manually
    doc.setFontSize(12);
    doc.text("Summary Statistics", margin, yPosition);
    yPosition += 10;

    // Calculate column widths for wider table
    const colWidth1 = (pageWidth - margin * 2) * 0.6;
    const colWidth2 = (pageWidth - margin * 2) * 0.4;

    // Draw table header
    doc.setFillColor(3, 135, 217);
    doc.rect(margin, yPosition, colWidth1, 10, "F");
    doc.rect(margin + colWidth1, yPosition, colWidth2, 10, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text("Metric", margin + 5, yPosition + 7);
    doc.text("Value", margin + colWidth1 + 5, yPosition + 7);
    yPosition += 10;

    // Draw table rows
    doc.setTextColor(0, 0, 0);
    summaryData.slice(1).forEach((row) => {
      doc.rect(margin, yPosition, colWidth1, 10);
      doc.rect(margin + colWidth1, yPosition, colWidth2, 10);
      doc.text(row[0], margin + 5, yPosition + 7);
      doc.text(row[1].toString(), margin + colWidth1 + 5, yPosition + 7);
      yPosition += 10;
    });

    // Add recent bookings if available
    const recentBookings = data.recentActivity?.bookings || [];
    if (recentBookings.length > 0) {
      doc.addPage();
      yPosition = 20;
      doc.setFontSize(10);
      doc.text("Recent Bookings", margin, yPosition);
      yPosition += 15;

      // Calculate column widths for wider table
      const colWidths = [
        (pageWidth - margin * 2) * 0.15, // ID
        (pageWidth - margin * 2) * 0.25, // Service
        (pageWidth - margin * 2) * 0.25, // Vendor
        (pageWidth - margin * 2) * 0.15, // Date
        (pageWidth - margin * 2) * 0.2, // Total
      ];

      // Draw table header
      doc.setFillColor(3, 135, 217);
      let currentX = margin;
      colWidths.forEach((width) => {
        doc.rect(currentX, yPosition, width, 10, "F");
        currentX += width;
      });

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      currentX = margin;
      doc.text("ID", currentX + 5, yPosition + 7);
      currentX += colWidths[0];
      doc.text("Service", currentX + 5, yPosition + 7);
      currentX += colWidths[1];
      doc.text("Vendor", currentX + 5, yPosition + 7);
      currentX += colWidths[2];
      doc.text("Date", currentX + 5, yPosition + 7);
      currentX += colWidths[3];
      doc.text("Total", currentX + 5, yPosition + 7);
      yPosition += 10;

      // Draw table rows
      doc.setTextColor(0, 0, 0);
      recentBookings.forEach((booking) => {
        currentX = margin;
        colWidths.forEach((width) => {
          doc.rect(currentX, yPosition, width, 10);
          currentX += width;
        });

        currentX = margin;
        doc.text(booking._id.substring(0, 8), currentX + 5, yPosition + 7);
        currentX += colWidths[0];
        doc.text(
          booking.services?.[0]?.name || "Service",
          currentX + 5,
          yPosition + 7
        );
        currentX += colWidths[1];
        doc.text(booking.vendorName, currentX + 5, yPosition + 7);
        currentX += colWidths[2];
        doc.text(
          new Date(booking.createdAt).toLocaleDateString(),
          currentX + 5,
          yPosition + 7
        );
        currentX += colWidths[3];
        doc.text(`$${booking.totalAmount || 0}`, currentX + 5, yPosition + 7);
        yPosition += 10;
      });
    }
  };

  const generateInventoryPDF = (doc, data, margin, yPosition, pageWidth) => {
    // Add summary statistics
    const summaryData = [
      ["Metric", "Value"],
      ["Low Stock Items", data.inventory?.lowStockItems || 0],
      ["Total Items", data.inventory?.totalItems || 0],
      ["Total Value", `$${data.inventory?.totalValue || 0}`],
    ];

    // Create table manually
    doc.setFontSize(10);
    doc.text("Summary Statistics", margin, yPosition);
    yPosition += 10;

    // Calculate column widths for wider table
    const colWidth1 = (pageWidth - margin * 2) * 0.6;
    const colWidth2 = (pageWidth - margin * 2) * 0.4;

    // Draw table header
    doc.setFillColor(3, 135, 217);
    doc.rect(margin, yPosition, colWidth1, 10, "F");
    doc.rect(margin + colWidth1, yPosition, colWidth2, 10, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text("Metric", margin + 5, yPosition + 7);
    doc.text("Value", margin + colWidth1 + 5, yPosition + 7);
    yPosition += 10;

    // Draw table rows
    doc.setTextColor(0, 0, 0);
    summaryData.slice(1).forEach((row) => {
      doc.rect(margin, yPosition, colWidth1, 10);
      doc.rect(margin + colWidth1, yPosition, colWidth2, 10);
      doc.text(row[0], margin + 5, yPosition + 7);
      doc.text(row[1].toString(), margin + colWidth1 + 5, yPosition + 7);
      yPosition += 10;
    });

    // Add health metrics if available
    if (data.healthReports) {
      doc.addPage();
      yPosition = 20;
      doc.setFontSize(10);
      doc.text("Inventory Health Metrics", margin, yPosition);
      yPosition += 15;

      // Draw table header
      doc.setFillColor(3, 135, 217);
      doc.rect(margin, yPosition, colWidth1, 10, "F");
      doc.rect(margin + colWidth1, yPosition, colWidth2, 10, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.text("Metric", margin + 5, yPosition + 7);
      doc.text("Rate", margin + colWidth1 + 5, yPosition + 7);
      yPosition += 10;

      // Draw table rows
      doc.setTextColor(0, 0, 0);
      const healthData = [
        ["Stock Levels", `${data.healthReports.stockLevels?.rate || 0}%`],
        [
          "Supplier Availability",
          `${data.healthReports.supplierAvailability?.rate || 0}%`,
        ],
        [
          "Customer Satisfaction",
          `${data.healthReports.customerSatisfaction?.rate || 0}%`,
        ],
      ];

      healthData.forEach((row) => {
        doc.rect(margin, yPosition, colWidth1, 10);
        doc.rect(margin + colWidth1, yPosition, colWidth2, 10);
        doc.text(row[0], margin + 5, yPosition + 7);
        doc.text(row[1], margin + colWidth1 + 5, yPosition + 7);
        yPosition += 10;
      });
    }
  };

  const handleGenerateReport = () => {
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

    if (!frequency) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Please select a frequency",
        life: 3000,
      });
      return;
    }

    // Filter data based on date range
    const filteredData = {
      ...dashboardSummary,
      recentActivity: {
        orders:
          dashboardSummary.recentActivity?.orders?.filter((order) => {
            const orderDate = new Date(order.createdAt);
            return orderDate >= startDate && orderDate <= endDate;
          }) || [],
        bookings:
          dashboardSummary.recentActivity?.bookings?.filter((booking) => {
            const bookingDate = new Date(booking.createdAt);
            return bookingDate >= startDate && bookingDate <= endDate;
          }) || [],
      },
    };

    // Calculate summary statistics for the filtered data
    switch (reportType.toLowerCase()) {
      case "orders":
        filteredData.orders = {
          total: filteredData.recentActivity.orders.length,
          confirmed: filteredData.recentActivity.orders.filter(
            (order) => order.status === "Confirmed"
          ).length,
          pending: filteredData.recentActivity.orders.filter(
            (order) => order.status === "Pending"
          ).length,
        };
        break;
      case "bookings":
        filteredData.bookings = {
          total: filteredData.recentActivity.bookings.length,
          confirmed: filteredData.recentActivity.bookings.filter(
            (booking) => booking.status === "Confirmed"
          ).length,
          pending: filteredData.recentActivity.bookings.filter(
            (booking) => booking.status === "Pending"
          ).length,
        };
        break;
      case "inventory":
        // For inventory, we'll keep the current stats but you might want to filter these based on your business logic
        filteredData.inventory = {
          ...dashboardSummary.inventory,
          // Add any date-based filtering for inventory if needed
        };
        break;
    }

    // Generate PDF using the filtered data
    generatePDFReport(filteredData);
  };

  const handleExport = () => {
    if (!startDate || !endDate) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Please select both start and end dates",
        life: 3000,
      });
      return;
    }

    // Use the same filtering logic as handleGenerateReport
    const filteredData = {
      ...dashboardSummary,
      recentActivity: {
        orders:
          dashboardSummary.recentActivity?.orders?.filter((order) => {
            const orderDate = new Date(order.createdAt);
            return orderDate >= startDate && orderDate <= endDate;
          }) || [],
        bookings:
          dashboardSummary.recentActivity?.bookings?.filter((booking) => {
            const bookingDate = new Date(booking.createdAt);
            return bookingDate >= startDate && bookingDate <= endDate;
          }) || [],
      },
    };

    // Calculate summary statistics for the filtered data
    switch (reportType.toLowerCase()) {
      case "orders":
        filteredData.orders = {
          total: filteredData.recentActivity.orders.length,
          confirmed: filteredData.recentActivity.orders.filter(
            (order) => order.status === "Confirmed"
          ).length,
          pending: filteredData.recentActivity.orders.filter(
            (order) => order.status === "Pending"
          ).length,
        };
        break;
      case "bookings":
        filteredData.bookings = {
          total: filteredData.recentActivity.bookings.length,
          confirmed: filteredData.recentActivity.bookings.filter(
            (booking) => booking.status === "Confirmed"
          ).length,
          pending: filteredData.recentActivity.bookings.filter(
            (booking) => booking.status === "Pending"
          ).length,
        };
        break;
      case "inventory":
        filteredData.inventory = {
          ...dashboardSummary.inventory,
          // Add any date-based filtering for inventory if needed
        };
        break;
    }

    // Generate PDF using the filtered data
    generatePDFReport(filteredData);
  };

  // Add the renderInventoryStats function
  const renderInventoryStats = () => {
    if (!dashboardSummary || !dashboardSummary.inventory) {
      return (
        <div className="pending-order-container">
          <div style={{ marginRight: "5px" }}>
            <p style={{ fontSize: "13px" }}>Low Stock</p>
            <p style={{ fontSize: "12px" }}>--</p>
          </div>
          <div style={{ marginRight: "5px" }}>
            <p style={{ fontSize: "13px" }}>Total Items</p>
            <p style={{ fontSize: "12px" }}>--</p>
          </div>
          <div style={{ marginRight: "5px" }}>
            <p style={{ fontSize: "13px" }}>Total value</p>
            <p style={{ fontSize: "12px" }}>--</p>
          </div>
        </div>
      );
    }

    const { lowStockItems, totalItems, totalValue } =
      dashboardSummary.inventory;

    return (
      <div className="pending-order-container">
        <div style={{ marginRight: "5px" }}>
          <p
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              minWidth: "50px",
              fontSize: "13px",
            }}
          >
            Low Stock
          </p>
          <p style={{ fontSize: "12px" }}>{lowStockItems || 0}</p>
        </div>
        <div style={{ marginRight: "5px" }}>
          <p style={{ fontSize: "13px" }}>Total Items</p>
          <p style={{ fontSize: "12px" }}>{totalItems || 0}</p>
        </div>
        <div style={{ marginRight: "5px" }}>
          <p style={{ fontSize: "13px" }}>Total value</p>
          <p style={{ fontSize: "12px" }}>
            ${totalValue ? totalValue.toLocaleString() : 0}
          </p>
        </div>
      </div>
    );
  };

  // Add this function to format the recent activity data for the table
  const formatRecentActivity = () => {
    if (!dashboardSummary || !dashboardSummary.recentActivity) {
      return [];
    }

    // Combine orders and bookings into one array
    const orders =
      dashboardSummary.recentActivity.orders?.map((order) => ({
        type: "Order",
        id: order._id,
        name: order.products?.[0]?.name || "Product",
        vendor: order.vendorName,
        total: order.totalPrice || 0,
        status: order.status || "Pending",
        date: new Date(order.createdAt || Date.now()).toLocaleDateString(),
        tracking: order.trackingId || "N/A",
      })) || [];

    const bookings =
      dashboardSummary.recentActivity.bookings?.map((booking) => ({
        type: "Booking",
        id: booking._id,
        name: booking.services?.[0]?.name || "Service",
        vendor: booking.vendorName,
        total: booking.totalAmount || 0,
        status: booking.status || "Pending",
        date: new Date(booking.createdAt || Date.now()).toLocaleDateString(),
        tracking: "N/A",
      })) || [];

    // Combine and sort by date (newest first)
    return [...orders, ...bookings].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  };

  return (
    <div
      className="report-container"
      style={{
        height: '100%', 
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <DashboardTitleBar title="Reports" />
      
      <Box sx={{ p: 3, backgroundColor: "white" }}>
        <Grid container spacing={3}>
          {/* Date Range Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 1 }}>
              <h3>Date Range</h3>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: { xs: "wrap", sm: "nowrap" } }}>
                  <Calendar
                    value={startDate}
                    onChange={(e) => setStartDate(e.value)}
                    dateFormat="yy-mm-dd"
                    placeholder="Start Date"
                    showIcon
                  className="p-inputtext-sm w-full"
                    minDate={new Date(2000, 0, 1)}
                    maxDate={endDate || new Date(2100, 11, 31)}
                  />
                  <span className="font-bold">to</span>
                  <Calendar
                    value={endDate}
                    onChange={(e) => setEndDate(e.value)}
                    dateFormat="yy-mm-dd"
                    placeholder="End Date"
                    showIcon
                  className="p-inputtext-sm w-full"
                    minDate={startDate || new Date(2000, 0, 1)}
                    maxDate={new Date(2100, 11, 31)}
                  />
              </Box>
                <small style={{ color: "#666", fontSize: "12px" }}>
                  Select both start and end dates to generate report
                </small>
            </Box>
          </Grid>

          {/* Report Type Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 1 }}>
              <h3>Report Type</h3>
            </Box>
            <Box sx={{ 
              border: "1px solid #e0e0e0", 
              borderRadius: "10px",
              p: 1
            }}>
                <Dropdown
                  value={reportType}
                  onChange={(e) => setReportType(e.value)}
                  options={reportTypeOptions}
                  placeholder="Select Report Type"
                  className="w-full"
              />
            </Box>
          </Grid>

          {/* Frequency Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 1 }}>
              <h3>Frequency</h3>
            </Box>
            <Box sx={{ 
              border: "1px solid #e0e0e0", 
              borderRadius: "10px",
              p: 1
            }}>
                <Dropdown
                  value={frequency}
                  onChange={(e) => setFrequency(e.value)}
                  options={frequencyOptions}
                  placeholder="Select Frequency"
                  className="w-full"
              />
            </Box>
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12} md={12} sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <button
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid #21212133",
                padding: "8px 16px",
                  borderRadius: "3px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                minWidth: "120px",
                }}
                onClick={handleExport}
              >
                <img
                  src={downloadIcon}
                  alt="downloadIcon"
                  style={{ width: "20px", height: "20px", marginRight: "5px" }}
                />
                Export
              </button>
              <button
                style={{
                  backgroundColor: "#0387D9",
                padding: "8px 16px",
                minWidth: "150px",
                  color: "white",
                  borderRadius: "3px",
                }}
                onClick={handleGenerateReport}
              >
                Generate Report
              </button>
          </Grid>
        </Grid>
      </Box>

      {/* Report Summary Section */}
      <Box sx={{ p: 3, backgroundColor: "white" }}>
        <Typography variant="h6" sx={{ mb: 3, color: '#0A2647', fontWeight: 600 }}>
          Report Summary
        </Typography>
        
        <Grid container spacing={3}>
          {/* All Orders Card */}
          <Grid item xs={12} sm={6} lg={3}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 2.5,
                height: '100%',
                borderRadius: 2,
                border: '1px solid #E0E7ED'
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                mb: 3
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LockIcon sx={{ color: '#2563EB', fontSize: 20 }} />
                  <Typography sx={{ fontSize: '15px', fontWeight: 500 }}>
                    All Orders
                  </Typography>
                </Box>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  bgcolor: '#F8FAFC',
                  borderRadius: 1,
                  px: 1,
                  py: 0.5
                }}>
                  <Typography variant="caption" sx={{ color: '#64748B', mr: 0.5 }}>
                    This week
                  </Typography>
                  <KeyboardArrowDownIcon sx={{ fontSize: 16, color: '#64748B' }} />
                </Box>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 0.5 }}>
                    Confirmed
                  </Typography>
                  <Typography sx={{ fontWeight: 600, fontSize: '15px' }}>
                    {dashboardSummary.loading ? "--" : dashboardSummary.orders?.confirmed || 0}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 0.5 }}>
                    Pending
                  </Typography>
                  <Typography sx={{ fontWeight: 600, fontSize: '15px' }}>
                    {dashboardSummary.loading ? "--" : dashboardSummary.orders?.pending || 0}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 0.5 }}>
                    Total
                  </Typography>
                  <Typography sx={{ fontWeight: 600, fontSize: '15px' }}>
                    {dashboardSummary.loading ? "--" : 
                      (dashboardSummary.orders?.confirmed || 0) + (dashboardSummary.orders?.pending || 0)}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Inventory Card */}
          <Grid item xs={12} sm={6} lg={3}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 2.5,
                height: '100%',
                borderRadius: 2,
                border: '1px solid #E0E7ED'
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                mb: 3
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LockIcon sx={{ color: '#2563EB', fontSize: 20 }} />
                  <Typography sx={{ fontSize: '15px', fontWeight: 500 }}>
                    Inventory
                  </Typography>
                </Box>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  bgcolor: '#F8FAFC',
                  borderRadius: 1,
                  px: 1,
                  py: 0.5
                }}>
                  <Typography variant="caption" sx={{ color: '#64748B', mr: 0.5 }}>
                    This week
                  </Typography>
                  <KeyboardArrowDownIcon sx={{ fontSize: 16, color: '#64748B' }} />
                </Box>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 0.5 }}>
                    Low Stock
                  </Typography>
                  <Typography sx={{ fontWeight: 600, fontSize: '15px' }}>
                    {dashboardSummary.loading ? "--" : dashboardSummary.inventory?.lowStockItems || 0}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 0.5 }}>
                    Total Items
                  </Typography>
                  <Typography sx={{ fontWeight: 600, fontSize: '15px' }}>
                    {dashboardSummary.loading ? "--" : dashboardSummary.inventory?.totalItems || 0}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 0.5 }}>
                    Total value
                  </Typography>
                  <Typography sx={{ fontWeight: 600, fontSize: '15px' }}>
                    ${dashboardSummary.loading ? "--" : 
                      (dashboardSummary.inventory?.totalValue || 0).toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Bookings Card */}
          <Grid item xs={12} sm={6} lg={3}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 2.5,
                height: '100%',
                borderRadius: 2,
                border: '1px solid #E0E7ED'
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                mb: 3
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LockIcon sx={{ color: '#2563EB', fontSize: 20 }} />
                  <Typography sx={{ fontSize: '15px', fontWeight: 500 }}>
                    Bookings
                  </Typography>
                </Box>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  bgcolor: '#F8FAFC',
                  borderRadius: 1,
                  px: 1,
                  py: 0.5
                }}>
                  <Typography variant="caption" sx={{ color: '#64748B', mr: 0.5 }}>
                    This week
                  </Typography>
                  <KeyboardArrowDownIcon sx={{ fontSize: 16, color: '#64748B' }} />
                </Box>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 0.5 }}>
                Confirmed
                  </Typography>
                  <Typography sx={{ fontWeight: 600, fontSize: '15px' }}>
                    {dashboardSummary.loading ? "--" : dashboardSummary.bookings?.confirmed || 0}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 0.5 }}>
                    Pending
                  </Typography>
                  <Typography sx={{ fontWeight: 600, fontSize: '15px' }}>
                    {dashboardSummary.loading ? "--" : dashboardSummary.bookings?.pending || 0}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 0.5 }}>
                    Total
                  </Typography>
                  <Typography sx={{ fontWeight: 600, fontSize: '15px' }}>
                    {dashboardSummary.loading ? "--" : 
                      (dashboardSummary.bookings?.confirmed || 0) + (dashboardSummary.bookings?.pending || 0)}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Financial Card */}
          <Grid item xs={12} sm={6} lg={3}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 2.5,
                height: '100%',
                borderRadius: 2,
                border: '1px solid #E0E7ED'
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                mb: 3
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LockIcon sx={{ color: '#2563EB', fontSize: 20 }} />
                  <Typography sx={{ fontSize: '15px', fontWeight: 500 }}>
                    Financial
                  </Typography>
                </Box>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  bgcolor: '#F8FAFC',
                  borderRadius: 1,
                  px: 1,
                  py: 0.5
                }}>
                  <Typography variant="caption" sx={{ color: '#64748B', mr: 0.5 }}>
                    This week
                  </Typography>
                  <KeyboardArrowDownIcon sx={{ fontSize: 16, color: '#64748B' }} />
                </Box>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 0.5 }}>
                    In progress
                  </Typography>
                  <Typography sx={{ fontWeight: 600, fontSize: '15px' }}>
                    0
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 0.5 }}>
                    Pending
                  </Typography>
                  <Typography sx={{ fontWeight: 600, fontSize: '15px' }}>
                    0
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 0.5 }}>
                    Completed
                  </Typography>
                  <Typography sx={{ fontWeight: 600, fontSize: '15px' }}>
                    0
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Weekly & Monthly Reports Section */}
      <Box sx={{ p: 3, mt: 3, backgroundColor: "white" }}>
        <Typography variant="h6" sx={{ mb: 3, color: '#0A2647', fontWeight: 600 }}>
          Weekly & Monthly Reports
        </Typography>
        
        <Box sx={{ overflowX: "auto" }}>
          <TableContainer 
            component={Paper} 
            elevation={0}
            sx={{ 
              border: '1px solid #E0E7ED',
              borderRadius: 2,
              minWidth: {
                xs: '100%',
                sm: '650px'
              }
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#F8FAFC' }}>
                  <TableCell 
                    sx={{ 
                      fontWeight: 600,
                      color: '#475569',
                      borderBottom: '1px solid #E0E7ED',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Type
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      fontWeight: 600,
                      color: '#475569',
                      borderBottom: '1px solid #E0E7ED',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Name
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      fontWeight: 600,
                      color: '#475569',
                      borderBottom: '1px solid #E0E7ED',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Vendor
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      fontWeight: 600,
                      color: '#475569',
                      borderBottom: '1px solid #E0E7ED',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Date
                  </TableCell>
                  <TableCell 
                    align="right"
                    sx={{ 
                      fontWeight: 600,
                      color: '#475569',
                      borderBottom: '1px solid #E0E7ED',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Total
                  </TableCell>
                  <TableCell 
                    align="center"
                    sx={{ 
                      fontWeight: 600,
                      color: '#475569',
                      borderBottom: '1px solid #E0E7ED',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Status
                  </TableCell>
                  <TableCell 
                    align="center"
                    sx={{ 
                      fontWeight: 600,
                      color: '#475569',
                      borderBottom: '1px solid #E0E7ED',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    ID
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
            {dashboardSummary && dashboardSummary.recentActivity ? (
              formatRecentActivity().map((activity, index) => (
                    <TableRow 
                      key={activity.id || index}
                      sx={{ 
                        '&:last-child td, &:last-child th': { border: 0 },
                        '&:hover': { backgroundColor: '#F8FAFC' }
                      }}
                    >
                      <TableCell 
                        sx={{ 
                          borderBottom: '1px solid #E0E7ED',
                          whiteSpace: 'nowrap',
                          '@media (max-width: 900px)': {
                            maxWidth: '80px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }
                        }}
                      >
                        {activity.type}
                      </TableCell>
                      <TableCell
                        sx={{ 
                          borderBottom: '1px solid #E0E7ED',
                          '@media (max-width: 900px)': {
                            maxWidth: '120px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }
                        }}
                      >
                        {activity.name}
                      </TableCell>
                      <TableCell
                        sx={{ 
                          borderBottom: '1px solid #E0E7ED',
                          '@media (max-width: 900px)': {
                            maxWidth: '100px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }
                        }}
                      >
                        {activity.vendor}
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #E0E7ED' }}>
                        {activity.date}
                      </TableCell>
                      <TableCell 
                        align="right"
                        sx={{ 
                          borderBottom: '1px solid #E0E7ED',
                          fontWeight: 500
                        }}
                      >
                        ${activity.total.toFixed(2)}
                      </TableCell>
                      <TableCell 
                        align="center"
                        sx={{ borderBottom: '1px solid #E0E7ED' }}
                      >
                        <Chip
                          label={activity.status}
                          size="small"
                          sx={{
                            backgroundColor: activity.status.toLowerCase() === 'completed' ? '#E8F5E9' : '#FFF3E0',
                            color: activity.status.toLowerCase() === 'completed' ? '#2E7D32' : '#ED6C02',
                            fontWeight: 500,
                            fontSize: '12px',
                            height: '24px',
                            borderRadius: '12px'
                          }}
                        />
                      </TableCell>
                      <TableCell 
                        align="center"
                        sx={{ 
                          borderBottom: '1px solid #E0E7ED',
                          fontFamily: 'monospace',
                          color: '#64748B',
                          '@media (max-width: 900px)': {
                            maxWidth: '80px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }
                        }}
                      >
                        {activity.id.substring(0, 8)}...
                      </TableCell>
                    </TableRow>
              ))
            ) : (
                  <TableRow>
                    <TableCell 
                      colSpan={7} 
                      align="center"
                      sx={{ 
                        borderBottom: '1px solid #E0E7ED',
                        py: 4,
                        color: '#64748B'
                      }}
                    >
                  Loading data...
                    </TableCell>
                  </TableRow>
            )}

            {dashboardSummary &&
              dashboardSummary.recentActivity &&
              formatRecentActivity().length === 0 && (
                    <TableRow>
                      <TableCell 
                        colSpan={7} 
                        align="center"
                        sx={{ 
                          borderBottom: '1px solid #E0E7ED',
                          py: 4,
                          color: '#64748B'
                        }}
                      >
                    No recent activity found.
                      </TableCell>
                    </TableRow>
                  )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </div>
  );
};

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

export default Reports;
