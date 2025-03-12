import React from "react";

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
        data: [320, 280, 150, 200, 350, 290, 220, 190, 280, 390, 250, 380],
        backgroundColor: "#1B59F8",
        barThickness: 8,
        borderRadius: 4,
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
            size: 10,
          },
          color: "#666",
        },
        grid: {
          color: "#F2F7FF",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 10,
          },
          color: "#666",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    elements: {
      point: {
        radius: 0,
      },
      line: {
        tension: 0.4,
      },
    },
  };

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
            <div>
              <img src={lockLogo} alt="lockLogo" />
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
              <p>All Orders</p>
              <p>0</p>
            </div>
            <div>
              <p>Pending</p>
              <p>0</p>
            </div>
            <div>
              <p>Completed</p>
              <p>0</p>
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
            <div>
              <img src={lockLogo} alt="lockLogo" />
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
              <p>Canceled</p>
              <p>0</p>
            </div>
            <div>
              <p>Returned</p>
              <p>0</p>
            </div>
            <div>
              <p>Damaged</p>
              <p>0</p>
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
            <div>
              <img src={cart} alt="cart" />
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
              <p style={{ color: "#EF4444" }}>Abandoned Cart</p>
              <p>0</p>
            </div>
            <div>
              <p>Customers</p>
              <p>0</p>
            </div>
          </div>
        </div>
      </div>

      <div className="report-container">
        <div className="report-container-1">
          <div className="reportdiv">
            <div className="fbox">
              <p style={{ textAlign: "left", fontSize: "11px" }}>
                Strongest Topics
              </p>
              <div className="progress-container">
                <img src={doctor} alt="lone" />
                <div className="progress-container-1">
                  <div className="progress-container-1-1"></div>
                </div>
                <div className="progress-value">
                  <span style={{ fontSize: "10px" }}>95%</span>
                  <span style={{ fontSize: "10px" }}>correct</span>
                </div>
              </div>

              {/* Second Progress Bar */}
              <div className="progress-container" style={{ marginTop: "20px" }}>
                <img src={iconcontainer} alt="container" />
                <div className="progress-container-1">
                  <div
                    className="progress-container-1-1"
                    style={{ width: "65%" }}
                  ></div>
                </div>
                <div className="progress-value">
                  <span style={{ fontSize: "10px" }}>65%</span>
                  <span style={{ fontSize: "10px" }}>correct</span>
                </div>
              </div>

              {/* Third Progress Bar */}
              <div className="progress-container" style={{ marginTop: "20px" }}>
                <img src={neworder} alt="neworder" />
                <div className="progress-container-1">
                  <div
                    className="progress-container-1-1"
                    style={{ width: "45%" }}
                  ></div>
                </div>
                <div className="progress-value">
                  <span style={{ fontSize: "10px" }}>45%</span>
                  <span style={{ fontSize: "10px" }}>correct</span>
                </div>
              </div>
            </div>
            <div className="activity-container-1">
              <div className="activity-container">
                <h3>Activity</h3>
                <p>Month</p>
              </div>
              <div style={{ height: "150px", marginTop: "10px" }}>
                <Bar data={activityChartData} options={chartOptions} />
              </div>
            </div>
          </div>
          <div className="report-table-container">
            <table className="report-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Sales</th>
                  <th>Order Type</th>
                  <th>Tracking ID</th>
                  <th>Order Total</th>
                  <th>Profit</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Safety Vest #1</td>
                  <td>245</td>
                  <td>Standard</td>
                  <td>#TRK-001</td>
                  <td>$3,500.00</td>
                  <td>$875.00</td>
                </tr>
                <tr>
                  <td>First Aid Kit Pro</td>
                  <td>189</td>
                  <td>Express</td>
                  <td>#TRK-002</td>
                  <td>$4,725.00</td>
                  <td>$1,181.25</td>
                </tr>
                <tr>
                  <td>Engine Oil Filter</td>
                  <td>312</td>
                  <td>Standard</td>
                  <td>#TRK-003</td>
                  <td>$2,808.00</td>
                  <td>$702.00</td>
                </tr>
                <tr>
                  <td>Navigation Compass</td>
                  <td>156</td>
                  <td>Express</td>
                  <td>#TRK-004</td>
                  <td>$5,460.00</td>
                  <td>$1,365.00</td>
                </tr>
                <tr>
                  <td>Life Jacket Type III</td>
                  <td>278</td>
                  <td>Standard</td>
                  <td>#TRK-005</td>
                  <td>$3,475.00</td>
                  <td>$868.75</td>
                </tr>
                <tr>
                  <td>Hydraulic Fluid</td>
                  <td>423</td>
                  <td>Express</td>
                  <td>#TRK-006</td>
                  <td>$2,780.25</td>
                  <td>$695.06</td>
                </tr>
                <tr>
                  <td>LED Floodlight</td>
                  <td>167</td>
                  <td>Standard</td>
                  <td>#TRK-007</td>
                  <td>$3,172.33</td>
                  <td>$793.08</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <div className="active-users-container-1">
            <div className="active-users-container">
              <span>Active users</span>
              <span>
                27/<i>80</i>
              </span>
              <div
                style={{
                  backgroundImage: `url(${wavyback})`,
                  width: "100%",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <img src={wavyline} alt="wavyline" />
              </div>
            </div>
            <div className="active-users-container">
              <span>Active users</span>
              <span>
                27/<i>80</i>
              </span>
              <div
                style={{
                  backgroundImage: `url(${wavyback})`,
                  width: "100%",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <img src={wavyline} alt="wavyline" />
              </div>
            </div>
            <div className="active-users-container">
              <span>Active users</span>
              <span>
                27/<i>80</i>
              </span>
              <div
                style={{
                  backgroundImage: `url(${wavyback})`,
                  width: "100%",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <img src={wavyline} alt="wavyline" />
              </div>
            </div>
            <div className="active-users-container">
              <span>Active users</span>
              <span>
                27/<i>80</i>
              </span>
              <div
                style={{
                  backgroundImage: `url(${wavyback})`,
                  width: "100%",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <img src={wavyline} alt="wavyline" />
              </div>
            </div>
            <div className="active-users-container">
              <span>Active users</span>
              <span>
                27/<i>80</i>
              </span>
              <div
                style={{
                  backgroundImage: `url(${wavyback})`,
                  width: "100%",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <img src={wavyline} alt="wavyline" />
              </div>
            </div>
            <div className="active-users-container">
              <span>Active users</span>
              <span>
                27/<i>80</i>
              </span>
              <div
                style={{
                  backgroundImage: `url(${wavyback})`,
                  width: "100%",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <img src={wavyline} alt="wavyline" />
              </div>
            </div>
            <div className="active-users-container">
              <span>Active users</span>
              <span>
                27/<i>80</i>
              </span>
              <div
                style={{
                  backgroundImage: `url(${wavyback})`,
                  width: "100%",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <img src={wavyline} alt="wavyline" />
              </div>
            </div>
            <div className="active-users-container">
              <span>Active users</span>
              <span>
                27/<i>80</i>
              </span>
              <div
                style={{
                  backgroundImage: `url(${wavyback})`,
                  width: "100%",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <img src={wavyline} alt="wavyline" />
              </div>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Reports;
