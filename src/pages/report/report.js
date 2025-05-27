import React, { useEffect, useState, useRef } from "react";

import { Button } from "primereact/button";
// import { useNavigate } from "react-router-dom";
// import { TabView, TabPanel } from "primereact/tabview";
// import { InputText } from "primereact/inputtext";
// import lone from "../../assets/images/crew/lone.png";
// import upcomingLogo from "../../assets/images/crew/upcomingorderLogo.png";
// import iconexpire from "../../assets/images/crew/iconexpire.png";
// import iconcareer from "../../assets/images/crew/iconcareer.png";
// import { Chart as ChartJS } from "chart.js/auto";
import { Bar, Line } from "react-chartjs-2";
// import sourceData from "../../data/sourceData.json";
// import analyticsData from "../../data/analyticsData.json";
// import sort from "../../assets/images/crew/sort.png";
import lockLogo from "../../assets/images/crew/lockLogo.png";
import dropdown from "../../assets/images/crew/dropdown.png";
// import cart from "../../assets/images/crew/cart.png";
// import iconcontainer from "../../assets/images/crew/iconContainer.png";
// import neworder from "../../assets/images/crew/neworder.png";
// import doctor from "../../assets/images/crew/doctor.png";
// import wavyline from "../../assets/images/crew/wavyline.png";
// import wavyback from "../../assets/images/crew/wavyback.png";
import profileReport from "../../assets/images/crew/profile-report.png";
// import profileReport2 from "../../assets/images/crew/profile-report2.png";
import sortIcon from "../../assets/images/crew/sort.png";
import {
  getInventoryHealthReport,
  getSystemChartData,
  getSystemMetrics,
} from "../../services/reports/reports";

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
  // const navigate = useNavigate();
  // const goCrewDashboardPage = () => {
  //   navigate("/crew/dashboard");
  // };
  // const goInventorySummaryPage = () => {
  //   navigate("/crew/inventory/summary");
  // };

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
          <div className="content" style={{marginLeft:"40px"}}>
            <h3>Reports</h3>
          </div>
        </div>
      </div>

      <div
        className="report-container-inventory-reports-and-bar-graph"
        style={{ width: "100%", paddingLeft: "20px" }}
      >
        <div
          className="report-container-inventory-reports"
          style={{ width: "35%" }}
        >
          <div>
            <h2>Inventory Report</h2>
            <div>
              <div className="report-container-flop" style={{ width: "100%" }}>
                <div>
                  <img src={profileReport} alt="iconcontainer" />
                </div>
                <div
                  className="report-container-flop-2"
                  style={{ width: "100%" }}
                >
                  <div style={{ width: "90%" }}>
                    <p style={{ color: "#212121", fontWeight: "bold" }}>
                      Customer Satisfaction
                    </p>
                    <div
                      className="report-progress-outer-bar"
                      style={{ width: "100%" }}
                    >
                      <div
                        className="report-progress-inner-bar"
                        style={{
                          width: `${healthReports.customerSatisfaction.rate}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="report-progress-text">
                    <p>{healthReports.customerSatisfaction.rate}% </p>
                  </div>
                </div>
              </div>
              <div className="report-container-flop" style={{ width: "100%" }}>
                <div>
                  <img src={profileReport} alt="iconcontainer" />
                </div>
                <div
                  className="report-container-flop-2"
                  style={{ width: "100%" }}
                >
                  <div style={{ width: "90%" }}>
                    <p style={{ color: "#212121", fontWeight: "bold" }}>
                      Supplier Availability
                    </p>
                    <div
                      className="report-progress-outer-bar"
                      style={{ width: "100%" }}
                    >
                      <div
                        className="report-progress-inner-bar"
                        style={{
                          width: `${healthReports.supplierAvailability.rate}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="report-progress-text">
                    <p>{healthReports.supplierAvailability.rate}%</p>
                  </div>
                </div>
              </div>
              <div className="report-container-flop" style={{ width: "100%" }}>
                <div>
                  <img src={profileReport} alt="iconcontainer" />
                </div>
                <div
                  className="report-container-flop-2"
                  style={{ width: "100%" }}
                >
                  <div style={{ width: "100%" }}>
                    <p style={{ color: "#212121", fontWeight: "bold" }}>
                      Stock Levels
                    </p>
                    <div
                      className="report-progress-outer-bar"
                      style={{ width: "100%" }}
                    >
                      <div
                        className="report-progress-inner-bar"
                        style={{
                          width: `${healthReports.stockLevels.rate}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="report-progress-text">
                    <p>{healthReports.stockLevels.rate}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="report-container-bar-graph" style={{ width: "33%" }}>
          <div style={{ width: "100%", height: "100%", padding: "10px" }}>
            <Bar data={activityData} options={chartOptions} ref={barChartRef} />
          </div>
        </div>

        <div className="metrics-container" style={{ width: "33%" }}>
          {systemMetrics.map((metric, index) => (
            <div
              key={index}
              className="metric-card"
              style={{
                width: "90%",
                overflow: "hidden",
                position: "relative",
                boxSizing: "border-box",
              }}
            >
              <div className="metric-header">
                <span style={{ fontSize: "15px" }}>{metric.title}</span>
                <h2 style={{ fontSize: "25px" }}>{metric.value}</h2>
              </div>
              <div
                className="sparkline"
                style={{
                  height: "40px",
                  width: "100%",
                  overflow: "hidden",
                  position: "relative",
                  paddingBottom: "10px",
                  marginBottom: "10px",
                  boxSizing: "border-box",
                }}
              >
                <Line
                  data={sparklineData}
                  options={sparklineOptions}
                  ref={(el) => {
                    if (el) lineChartRefs.current[index] = el;
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="order-summary-text-header">
        <h2>Order Summary</h2>
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
                In progress
              </p>
              <p style={{ fontSize: "12px" }}>885</p>
            </div>
            <div style={{ marginRight: "5px" }}>
              <p style={{ fontSize: "13px" }}>Pending</p>
              <p style={{ fontSize: "12px" }}>579</p>
            </div>
            <div style={{ marginRight: "5px" }}>
              <p style={{ fontSize: "13px" }}>Completed</p>
              <p style={{ fontSize: "12px" }}>9981</p>
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
              <p style={{ fontSize: "12px" }}>885</p>
            </div>
            <div style={{ marginRight: "5px" }}>
              <p style={{ fontSize: "13px" }}>Pending</p>
              <p style={{ fontSize: "12px" }}>5</p>
            </div>
            <div style={{ marginRight: "5px" }}>
              <p style={{ fontSize: "13px" }}>Completed</p>
              <p style={{ fontSize: "12px" }}>22</p>
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
                In progress
              </p>
              <p style={{ fontSize: "12px" }}>457</p>
            </div>
            <div style={{ marginRight: "5px" }}>
              <p style={{ fontSize: "13px" }}>Pending </p>
              <p style={{ fontSize: "12px" }}>25</p>
            </div>
            <div style={{ marginRight: "5px" }}>
              <p style={{ fontSize: "13px" }}>Completed</p>
              <p style={{ fontSize: "12px" }}>232</p>
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
              <p style={{ fontSize: "12px" }}>457</p>
            </div>
            <div style={{ marginRight: "5px" }}>
              <p style={{ fontSize: "13px" }}>Pending </p>
              <p style={{ fontSize: "12px" }}>25</p>
            </div>
            <div style={{ marginRight: "5px" }}>
              <p style={{ fontSize: "13px" }}>Completed</p>
              <p style={{ fontSize: "12px" }}>232</p>
            </div>
          </div>
        </div>
      </div>

      <div className="selling-products-container">
        <div className="selling-products-header">
          <h2>Selling Products</h2>
          <Button
            label="AI Report Generate"
            icon="pi pi-file"
            className="p-button-primary"
          />
        </div>

        <table className="selling-products-table">
          <thead>
            <tr>
              <th>
                Product Name <img src={sortIcon} alt="sortIcon" />
              </th>
              <th>
                Sales <img src={sortIcon} alt="sortIcon" />
              </th>
              <th>
                Order Type <img src={sortIcon} alt="sortIcon" />
              </th>
              <th>
                Tracking ID <img src={sortIcon} alt="sortIcon" />
              </th>
              <th>
                Order Total <img src={sortIcon} alt="sortIcon" />
              </th>
              <th>
                Profit <img src={sortIcon} alt="sortIcon" />
              </th>
              <th>
                1500 <img src={sortIcon} alt="sortIcon" />
              </th>
              <th>
                Status <img src={sortIcon} alt="sortIcon" />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Fuel</td>
              <td>Sold</td>
              <td>Earned</td>
              <td>Placed</td>
              <td>Processed</td>
              <td>Net</td>
              <td>Widgets Pro</td>
              <td>
                <span className="status-confirmed">Confirmed</span>
              </td>
            </tr>
            <tr>
              <td>Energy</td>
              <td>Delivered</td>
              <td>Generated</td>
              <td>Allocated</td>
              <td>Completed</td>
              <td>Gross</td>
              <td>Widgets Plus</td>
              <td>
                <span className="status-in-progress">In Progress</span>
              </td>
            </tr>
            <tr>
              <td>Power</td>
              <td>Distributed</td>
              <td>Produced</td>
              <td>Assigned</td>
              <td>Finalized</td>
              <td>Total</td>
              <td>Widgets Max</td>
              <td>
                <span className="status-pending">Pending</span>
              </td>
            </tr>
            <tr>
              <td>Electricity</td>
              <td>Supplied</td>
              <td>Achieved</td>
              <td>Settled</td>
              <td>Executed</td>
              <td>Balance</td>
              <td>Widgets Elite</td>
              <td>
                <span className="status-completed">Completed</span>
              </td>
            </tr>
            <tr>
              <td>Gas</td>
              <td>Rendered</td>
              <td>Accumulated</td>
              <td>Distributed</td>
              <td>Confirmed</td>
              <td>Surplus</td>
              <td>Widgets Standard</td>
              <td>
                <span className="status-flagged">Flagged</span>
              </td>
            </tr>
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
