import React, { useEffect, useState } from "react";

import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { TabView, TabPanel } from "primereact/tabview";
import { InputText } from "primereact/inputtext";
import lone from "../../assets/images/crew/lone.png";
import upcomingLogo from "../../assets/images/crew/upcomingorderLogo.png";
import iconexpire from "../../assets/images/crew/iconexpire.png";
import iconcareer from "../../assets/images/crew/iconcareer.png";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import sourceData from "../../data/sourceData.json";
import analyticsData from "../../data/analyticsData.json";
import sort from "../../assets/images/crew/sort.png";
import lockLogo from "../../assets/images/crew/lockLogo.png";
import dropdown from "../../assets/images/crew/dropdown.png";
import cart from "../../assets/images/crew/cart.png";
import iconcontainer from "../../assets/images/crew/iconContainer.png";
import neworder from "../../assets/images/crew/neworder.png";
import doctor from "../../assets/images/crew/doctor.png";
import wavyline from "../../assets/images/crew/wavyline.png";
import wavyback from "../../assets/images/crew/wavyback.png";
import profileReport from "../../assets/images/crew/profile-report.png";
import profileReport2 from "../../assets/images/crew/profile-report2.png";
import sortIcon from "../../assets/images/crew/sort.png";
import { getInventoryHealthReport } from "../../services/reports/reports";

const Reports = () => {
  const navigate = useNavigate();
  const goCrewDashboardPage = () => {
    navigate("/crew/dashboard");
  };
  const goInventorySummaryPage = () => {
    navigate("/crew/inventory/summary");
  };

  const activityChartData = {
    labels: [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ],
    datasets: [
      {
        data: [100, 140, 130, 220, 260, 190, 220, 100, 270, 320, 350, 370],
        backgroundColor: "#4318FF",
        borderRadius: 8,
        barThickness: 15,
        maxBarThickness: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 400,
        ticks: {
          stepSize: 100,
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
        display: false,
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
        displayColors: false,
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

  // const [healthReports, setHealthReports] = useState({
  //   stockLevels: { rate: 0, correct: 0 },
  //   supplierAvailability: { rate: 0, correct: 0 },
  //   customerSatisfaction: { rate: 0, correct: 0 },
  //   loading: true,
  //   error: null,
  // });

  //  useEffect(() => {
  //    fetchHealthReports();
  //  }, []);

  //  const fetchHealthReports = async () => {
  //   try {
  //       const response = await getInventoryHealthReport();  
  //       if(response.success){
  //           setHealthReports({
  //             vaccinationRate: {
  //           });
  //       }
  //   } catch (error) {
        
  //   }
  //  }

  return (
    <>
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

      <div className="report-container-inventory-reports-and-bar-graph">
        <div className="report-container-inventory-reports">
          <div>
            <h2>Inventory Report</h2>
            <div>
              <div className="report-container-flop">
                <div>
                  <img src={profileReport} alt="iconcontainer" />
                </div>
                <div className="report-container-flop-2">
                  <div>
                    <p style={{ color: "#212121", fontWeight: "bold" }}>
                      Vaccination Rate
                    </p>
                    <div className="report-progress-outer-bar">
                      <div className="report-progress-inner-bar"></div>
                    </div>
                  </div>
                  <div className="report-progress-text">
                    <p>88% Correct</p>
                  </div>
                </div>
              </div>
              <div className="report-container-flop">
                <div>
                  <img src={profileReport} alt="iconcontainer" />
                </div>
                <div className="report-container-flop-2">
                  <div>
                    <p style={{ color: "#212121", fontWeight: "bold" }}>
                      Health Screening
                    </p>
                    <div className="report-progress-outer-bar">
                      <div className="report-progress-inner-bar"></div>
                    </div>
                  </div>
                  <div className="report-progress-text">
                    <p>92% Correct</p>
                  </div>
                </div>
              </div>
              <div className="report-container-flop">
                <div>
                  <img src={profileReport} alt="iconcontainer" />
                </div>
                <div className="report-container-flop-2">
                  <div>
                    <p style={{ color: "#212121", fontWeight: "bold" }}>
                      Testing Availability
                    </p>
                    <div className="report-progress-outer-bar">
                      <div className="report-progress-inner-bar"></div>
                    </div>
                  </div>
                  <div className="report-progress-text">
                    <p>89% Correct</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="report-container-bar-graph">
          <div style={{ width: "100%", height: "100%", padding: "10px" }}>
            <Bar data={activityChartData} options={chartOptions} />
          </div>
        </div>

        <div className="metrics-container">
          <div className="metric-card">
            <div className="metric-header">
              <span>Active Users</span>
              <h2>27/80</h2>
            </div>
            <div className="sparkline">
              <Line
                data={sparklineData}
                options={sparklineOptions}
                style={{
                  height: "45px",
                  marginTop: "-10px",
                  marginBottom: "-10px",
                }}
              />
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <span>Questions Answered</span>
              <h2>3,298</h2>
            </div>
            <div className="sparkline">
              <Line
                data={sparklineData}
                options={sparklineOptions}
                style={{
                  height: "45px",
                  marginTop: "-10px",
                  marginBottom: "-10px",
                }}
              />
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <span>Av. Session Length</span>
              <h2>2m 34s</h2>
            </div>
            <div className="sparkline">
              <Line
                data={sparklineData}
                options={sparklineOptions}
                style={{
                  height: "45px",
                  marginTop: "-10px",
                  marginBottom: "-10px",
                }}
              />
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <span>Current Knowledge</span>
              <h2>86%</h2>
            </div>
            <div className="sparkline">
              <Line
                data={sparklineData}
                options={sparklineOptions}
                style={{
                  height: "25px",
                  marginTop: "-5px",
                  marginBottom: "-5px",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="order-summary-text-header">
        <h2>Order Summary</h2>
      </div>

      <div className="box-order-container">
        <div className="box1-order">
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
            <div>
              <p>In progress</p>
              <p>885</p>
            </div>
            <div>
              <p>Pending</p>
              <p>579</p>
            </div>
            <div>
              <p>Completed</p>
              <p>9981</p>
            </div>
          </div>
        </div>
        <div className="box1-order">
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
            <div>
              <p>In progress</p>
              <p>885</p>
            </div>
            <div>
              <p>Pending</p>
              <p>5</p>
            </div>
            <div>
              <p>Completed</p>
              <p>22</p>
            </div>
          </div>
        </div>
        <div className="box1-order">
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
            <div>
              <p>In progress</p>
              <p>457</p>
            </div>
            <div>
              <p>Pending </p>
              <p>25</p>
            </div>
            <div>
              <p>Completed</p>
              <p>232</p>
            </div>
          </div>
        </div>
        <div className="box1-order">
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
            <div>
              <p>In progress</p>
              <p>457</p>
            </div>
            <div>
              <p>Pending </p>
              <p>25</p>
            </div>
            <div>
              <p>Completed</p>
              <p>232</p>
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
    </>
  );
};

export default Reports;
