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

const CrewSetting = () => {
  const navigate = useNavigate();
  const goCrewDashboardPage = () => {
    navigate("/crew/dashboard");
  };
  const goInventorySummaryPage = () => {
    navigate("/crew/inventory/summary");
  };
  return (
    <>
      <div className="flex align-items-center justify-content-between sub-header-panel">
        <div className="sub-header-left sub-header-left-with-arrow">
          <div className="content">
            <h3>Dashboard</h3>
          </div>
        </div>
        {/* <div className="sub-header-right">
          <Button
            label="Cancel"
            onClick={goVasselPage}
            icon="pi pi-times-circle"
            severity="secondary"
            outlined
            className="p-button-secondary mr-3"
          />
          <Button
            onClick={goVasselPage}
            label="Save"
            icon="pi pi-save"
            className="p-button-primary"
            type="button"
          />
        </div> */}
      </div>
      {/* <div className="card-wrapper-gap">
        <TabView className="v-tab v-tab-two">
          <TabPanel header="Account Settings">
            <div className="form-container">
              <h5>User Profile</h5>
              <form>
                <div className="grid">
                  <div className="col-12 md:col-6">
                    <label htmlFor="fname">First Name</label>
                    <InputText
                      id="fname"
                      placeholder="Courtney"
                      className="w-full mt-2 p-inputtext p-component"
                    />
                  </div>

                  <div className="col-12 md:col-6">
                    <label htmlFor="lname">Last Name</label>
                    <InputText
                      id="lname"
                      placeholder="Henry"
                      className="w-full mt-2 p-inputtext p-component"
                    />
                  </div>

                  <div className="col-12">
                    <label htmlFor="email">Email</label>
                    <InputText
                      id="email"
                      placeholder="courtneyhenry@yachtcrewcenter.com"
                      className="w-full mt-2 p-inputtext p-component"
                    />
                  </div>
                  <div className="flex align-items-center justify-content-between ml-auto mt-4">
                    <div className="actions">
                      <Button
                        label="Cancel"
                        onClick={goCrewDashboardPage}
                        icon="pi pi-times-circle"
                        severity="secondary"
                        outlined
                        className="p-button-secondary mr-3"
                      />
                      <Button
                        onClick={goCrewDashboardPage}
                        label="Save Changes"
                        icon="pi pi-save"
                        className="p-button-primary"
                        type="button"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </TabPanel>
          <TabPanel header="Change Password">
            <div className="form-container">
              <h5>Change Password</h5>
              <form>
                <div className="grid">
                  <div className="col-12">
                    <label htmlFor="oldPassword">Current Password</label>
                    <InputText
                      id="oldPassword"
                      placeholder="Enter Old Password"
                      className="w-full mt-2 p-inputtext p-component"
                    />
                  </div>

                  <div className="col-12 md:col-6">
                    <label htmlFor="newPassword">
                      New Password<span>*</span>
                    </label>
                    <InputText
                      id="oldPassword"
                      placeholder="Enter New Password"
                      className="w-full mt-2 p-inputtext p-component"
                    />
                  </div>

                  <div className="col-12 md:col-6">
                    <label htmlFor="confirmPassword">
                      Confirm Password<span>*</span>
                    </label>
                    <InputText
                      id="confirmPassword"
                      placeholder="Rewnter your Password"
                      className="w-full mt-2 p-inputtext p-component"
                    />
                  </div>
                  <div className="flex align-items-center justify-content-between ml-auto mt-4">
                    <div className="actions">
                      <Button
                        label="Cancel"
                        onClick={goCrewDashboardPage}
                        icon="pi pi-times-circle"
                        severity="secondary"
                        outlined
                        className="p-button-secondary mr-3"
                      />
                      <Button
                        onClick={goCrewDashboardPage}
                        label="Save Changes"
                        icon="pi pi-save"
                        className="p-button-primary"
                        type="button"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </TabPanel>
        </TabView>
      </div> */}
      <div className="inventory-dashboard-container">
        <div className="inventory-dashboard-container-wrapper">
          <div className="summary-container">
            <div>
              <h3>AI Summary</h3>
              <p>
                Highlights what needs attention (eg., upcoming orders, expiring
                certificates, career, suggestions, etc.)
              </p>
            </div>
            <div>
              <img src={lone} alt="" />
            </div>
          </div>
          <div className="boxes-container">
            <div>
              <img src={upcomingLogo} alt="" />
              <span>$1k</span>
              <span>Upcoming Orders</span>
              <span style={{ fontSize: "9px" }}>+8% from yesterday</span>
            </div>
            <div>
              <img src={iconexpire} alt="" />
              <span>5</span>
              <span>Expiring Certifications</span>
              <span style={{ fontSize: "9px" }}>+12% from yesterday</span>
            </div>
            <div>
              <img src={iconcareer} alt="" />
              <span>10</span>
              <span>Career Suggestions</span>
              <span style={{ fontSize: "9px" }}>+0.5% from yesterday</span>
            </div>
          </div>
        </div>
        <div className="orders-analytics-container">
          <div>
            <div>
              <h3>Orders Analytics</h3>
            </div>
            <div className="orders">
              <p>Offline orders</p>
              <p>Online orders</p>
              <p>Monthly</p>
            </div>
          </div>
          <div>
            <Line
              data={{
                labels: analyticsData.map((item) => item.labels),
                datasets: [
                  {
                    label: "Revenue",
                    data: analyticsData.map((item) => item.revenue),
                    borderColor: "#FF9500",
                    backgroundColor: "transparent",
                    tension: 0.8,
                    fill: false,
                    cubicInterpolationMode: "default",
                    pointStyle: "circle",
                    borderWidth: 3,
                  },
                  {
                    label: "Cost",
                    data: analyticsData.map((item) => item.cost),
                    borderColor: "#347AE2",
                    backgroundColor: "transparent",
                    tension: 0.8,
                    fill: false,
                    cubicInterpolationMode: "default",
                    pointStyle: "circle",
                    borderWidth: 3,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      display: true,
                      drawBorder: false,
                      color: "#f0f0f0",
                    },
                  },
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                },
                elements: {
                  line: {
                    tension: 0.4,
                    borderWidth: 3,
                    capBezierPoints: true,
                  },
                  point: {
                    radius: 0,
                    hoverRadius: 0,
                  },
                },
              }}
            />
          </div>
        </div>
        <div className="bottom-container">
          <div className="current-order-summary">
            <div className="current-order">
              <div>
                <h2>Current Order Summary</h2>
                <p>
                  Display real-time updates on placed, pending, and completing
                  orders.
                </p>
              </div>
              <div>
                <img src={lone} alt="" />
              </div>
            </div>
            <div className="total-orders">
              <div className="total-order-box">
                <h3>522</h3>
                <p>Total Orders</p>
              </div>
              <div className="total-order-box">
                <h3>120</h3>
                <p>Pending Orders</p>
              </div>
              <div className="total-order-box">
                <h3>402</h3>
                <p>Completed Orders</p>
              </div>
            </div>
            <div className="sort">
              <div>
                <p>Order ID</p>
                <img src={sort} alt="okay" />
              </div>
              <div>
                <p>Customer</p>
                <img src={sort} alt="okay" />
              </div>
              <div>
                <p>Status</p>
                <img src={sort} alt="okay" />
              </div>
              <div>
                <p>Amount</p>
                <img src={sort} alt="okay" />
              </div>
              <div>
                <p>Date</p>
                <img src={sort} alt="okay" />
              </div>
            </div>
            <div>
              <table className="order-table">
                <tbody>
                  <tr>
                    <td>#YCC-156</td>
                    <td>John Smith</td>
                    <td>
                      <span className="status pending">Pending</span>
                    </td>
                    <td>$2,500.00</td>
                    <td>2024-03-15</td>
                  </tr>
                  <tr>
                    <td>#YCC-157</td>
                    <td>Sarah Johnson</td>
                    <td>
                      <span className="status completed">Completed</span>
                    </td>
                    <td>$1,800.00</td>
                    <td>2024-03-14</td>
                  </tr>
                  <tr>
                    <td>#YCC-158</td>
                    <td>Mike Wilson</td>
                    <td>
                      <span className="status processing">Processing</span>
                    </td>
                    <td>$3,200.00</td>
                    <td>2024-03-14</td>
                  </tr>
                  <tr>
                    <td>#YCC-159</td>
                    <td>Emma Davis</td>
                    <td>
                      <span className="status pending">Pending</span>
                    </td>
                    <td>$950.00</td>
                    <td>2024-03-13</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="progressionBar">
            <div className="progress">
              <div>
                <h2>Career Progression & Training Suggestion</h2>
                <p>
                  Crew members see recomended career paths and available
                  courses.
                </p>
              </div>
              <div>
                <img src={lone} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CrewSetting;
