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

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportType, setReportType] = useState("Inventory");
  const [frequency, setFrequency] = useState("One-Time");

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
    const orders = dashboardSummary.recentActivity.orders?.map(order => ({
      type: 'Order',
      id: order._id,
      name: order.products?.[0]?.name || 'Product',
      vendor: order.vendorName,
      total: order.totalPrice || 0,
      status: order.status || 'Pending',
      date: new Date(order.createdAt || Date.now()).toLocaleDateString(),
      tracking: order.trackingId || 'N/A'
    })) || [];

    const bookings = dashboardSummary.recentActivity.bookings?.map(booking => ({
      type: 'Booking',
      id: booking._id,
      name: booking.services?.[0]?.name || 'Service',
      vendor: booking.vendorName,
      total: booking.totalAmount || 0,
      status: booking.status || 'Pending',
      date: new Date(booking.createdAt || Date.now()).toLocaleDateString(),
      tracking: 'N/A'
    })) || [];

    // Combine and sort by date (newest first)
    return [...orders, ...bookings]
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  return (
    <div
      style={{
        background: "#F8FBFF",
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        className="flex align-items-center justify-content-between sub-header-panel"
        style={{ marginBottom: "30px" }}
      >
        <div className="sub-header-left sub-header-left-with-arrow">
          <div className="content">
            <h3>Reports</h3>
          </div>
        </div>
      </div>

      <div
        className="bg-white"
        style={{
          width: "95%",
          marginLeft: "30px",
          padding: "20px 15px 20px 15px",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="flex items-center justify-between ">
          <div className="flex items-center justify-between">
            <div className="mr-3">
              <h3>Date Range</h3>
              <div
                className="border-1 border-gray-200 p-2 rounded-lg"
                style={{ borderRadius: "10px" }}
              >
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border-none mr-2"
                />
                <span className="mr-2 font-bold">to</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border-none "
                />
              </div>
            </div>
            <div className="mr-3">
              <h3>Report Type</h3>
              <div
                className="border-1 border-gray-200 p-2 rounded-lg"
                style={{ width: "300px", borderRadius: "10px" }}
              >
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="border-none w-full outline-none"
                  style={{ width: "100%" }}
                >
                  <option value="Inventory">Inventory</option>
                  <option value="Bookings">Bookings</option>
                </select>
              </div>
            </div>
            <div className="mr-3">
              <h3>Frequency</h3>
              <div
                className="border-1 border-gray-200 p-2 rounded-lg"
                style={{ width: "300px", borderRadius: "10px" }}
              >
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="border-none w-full outline-none"
                  style={{ width: "100%" }}
                >
                  <option value="One-Time">One-Time</option>
                  <option value="Daily">Daily</option>
                </select>
              </div>
            </div>
          </div>
          <div
            className=""
            style={{
              width: "200px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "400px",
            }}
          >
            <div className="flex items-center justify-center ">
              <button
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid #21212133",
                  paddingLeft: "7px",
                  paddingRight: "7px",
                  borderRadius: "3px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "120px",
                }}
              >
                <img
                  src={downloadIcon}
                  alt="downloadIcon"
                  style={{ width: "20px", height: "20px", marginRight: "5px" }}
                />
                Export
              </button>
              <button
                className="p-2"
                style={{
                  backgroundColor: "#0387D9",
                  width: "150px",
                  color: "white",
                  border: "1px solid #0387D9",
                  borderRadius: "3px",
                  marginLeft: "10px",
                }}
              >
                Generate Report
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="order-summary-text-header">
        <h2>Report Summary</h2>
      </div>

      <div className="box-order-container" style={{ minWidth: "800px" }}>
        <div className="box1-order" style={{ minWidth: "180px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0px 9px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <img src={lockLogo} alt="lockLogo" />
              <h3>All Orders</h3>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <p style={{ marginRight: "5px" }}>This week</p>
              <img
                src={dropdown}
                alt="dropdown"
                style={{ width: "15px", height: "15px" }}
              />
            </div>
          </div>
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
                Confirmed
              </p>
              <p style={{ fontSize: "12px" }}>
                {dashboardSummary.loading
                  ? "Loading..."
                  : dashboardSummary.orders.confirmed}
              </p>
            </div>
            <div style={{ marginRight: "5px" }}>
              <p style={{ fontSize: "13px" }}>Pending</p>
              <p style={{ fontSize: "12px" }}>
                {dashboardSummary.loading
                  ? "Loading..."
                  : dashboardSummary.orders.pending}
              </p>
            </div>
            <div style={{ marginRight: "5px" }}>
              <p style={{ fontSize: "13px" }}>Total</p>
              <p style={{ fontSize: "12px" }}>
                {dashboardSummary.loading
                  ? "Loading..."
                  : dashboardSummary.orders.total}
              </p>
            </div>
          </div>
        </div>
        <div className="box1-order" style={{ minWidth: "180px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0px 9px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <img src={lockLogo} alt="lockLogo" />
              <h3>Inventory</h3>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <p style={{ marginRight: "5px" }}>This week</p>
              <img
                src={dropdown}
                alt="dropdown"
                style={{ width: "15px", height: "15px" }}
              />
            </div>
          </div>
          {renderInventoryStats()}
        </div>
        <div className="box1-order" style={{ minWidth: "180px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0px 9px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <img src={lockLogo} alt="lockLogo" />
              <h3>Bookings</h3>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <p style={{ marginRight: "5px" }}>This week</p>
              <img
                src={dropdown}
                alt="dropdown"
                style={{ width: "15px", height: "15px" }}
              />
            </div>
          </div>
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
                Comfirmed
              </p>
              <p style={{ fontSize: "12px" }}>
                {dashboardSummary.loading
                  ? "Loading..."
                  : dashboardSummary.bookings.confirmed}
              </p>
            </div>
            <div style={{ marginRight: "5px" }}>
              <p style={{ fontSize: "13px" }}>Pending </p>
              <p style={{ fontSize: "12px" }}>
                {dashboardSummary.loading
                  ? "Loading..."
                  : dashboardSummary.bookings.pending}
              </p>
            </div>
            <div style={{ marginRight: "5px" }}>
              <p style={{ fontSize: "13px" }}>Total</p>
              <p style={{ fontSize: "12px" }}>
                {dashboardSummary.loading
                  ? "Loading..."
                  : dashboardSummary.bookings.total}
              </p>
            </div>
          </div>
        </div>
        <div className="box1-order" style={{ minWidth: "180px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0px 9px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <img src={lockLogo} alt="lockLogo" />
              <h3>Financial</h3>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <p style={{ marginRight: "5px" }}>This week</p>
              <img
                src={dropdown}
                alt="dropdown"
                style={{ width: "15px", height: "15px" }}
              />
            </div>
          </div>
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
                In progress
              </p>
              <p style={{ fontSize: "12px" }}>0</p>
            </div>
            <div style={{ marginRight: "5px" }}>
              <p style={{ fontSize: "13px" }}>Pending </p>
              <p style={{ fontSize: "12px" }}>0</p>
            </div>
            <div style={{ marginRight: "5px" }}>
              <p style={{ fontSize: "13px" }}>Completed</p>
              <p style={{ fontSize: "12px" }}>0</p>
            </div>
          </div>
        </div>
      </div>

      <div className="selling-products-container">
        <div className="selling-products-header">
          <h2>Weekly & Monthly Reports</h2>
        </div>

        <table className="selling-products-table">
          <thead>
            <tr>
              <th>Type <img src={sortIcon} alt="sortIcon" /></th>
              <th>Name <img src={sortIcon} alt="sortIcon" /></th>
              <th>Vendor <img src={sortIcon} alt="sortIcon" /></th>
              <th>Date <img src={sortIcon} alt="sortIcon" /></th>
              <th>Total <img src={sortIcon} alt="sortIcon" /></th>
              <th>Status <img src={sortIcon} alt="sortIcon" /></th>
              <th>ID <img src={sortIcon} alt="sortIcon" /></th>
            </tr>
          </thead>
          <tbody>
            {dashboardSummary && dashboardSummary.recentActivity ? (
              formatRecentActivity().map((activity, index) => (
                <tr key={activity.id || index}>
                  <td>{activity.type}</td>
                  <td className="product-cell">{activity.name}</td>
                  <td>{activity.vendor}</td>
                  <td>{activity.date}</td>
                  <td>${activity.total.toFixed(2)}</td>
                  <td>
                    <span className={`status-${activity.status.toLowerCase()}`}>
                      {activity.status}
                    </span>
                  </td>
                  <td>{activity.id.substring(0, 8)}...</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  Loading data...
                </td>
              </tr>
            )}
            {dashboardSummary && 
             dashboardSummary.recentActivity &&
             formatRecentActivity().length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No recent activity found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Create and add a stylesheet element for responsive design
const responsiveStyle = document.createElement("style");
responsiveStyle.innerHTML = `
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
  }
`;

// Add style element to document head
if (typeof document !== "undefined") {
  document.head.appendChild(responsiveStyle);
}

export default Reports;
