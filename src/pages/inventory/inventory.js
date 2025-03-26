import React, { useState } from "react";

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
import plus from "../../assets/images/crew/plus.png";
import arrowup from "../../assets/images/crew/arrowup.png";
import barup from "../../assets/images/crew/barup.png";
const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Events data (you can replace with your actual events)
  const events = [
    { date: new Date(2023, 9, 6) }, // Oct 6, 2023
    { date: new Date(2023, 9, 10) }, // Oct 10, 2023
    { date: new Date(2023, 9, 17) }, // Oct 17, 2023
  ];

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);

    // Day of the week for the first day (0-6)
    const firstDayOfWeek = firstDay.getDay();

    // Total days in the month
    const daysInMonth = lastDay.getDate();

    // Days from previous month
    const prevMonthDays = [];
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      prevMonthDays.push(prevMonthLastDay - i);
    }

    // Days from current month
    const currentMonthDays = [];
    for (let i = 1; i <= daysInMonth; i++) {
      currentMonthDays.push(i);
    }

    // Days from next month
    const nextMonthDays = [];
    const totalCells = 42; // 6 rows x 7 days
    const remainingCells =
      totalCells - (prevMonthDays.length + currentMonthDays.length);

    for (let i = 1; i <= remainingCells; i++) {
      if (nextMonthDays.length < 7) {
        // Only show one row of next month
        nextMonthDays.push(i);
      }
    }

    // Check if a date has an event
    const hasEvent = (day) => {
      return events.some(
        (event) =>
          event.date.getDate() === day &&
          event.date.getMonth() === month &&
          event.date.getFullYear() === year
      );
    };

    // Check if a date is today
    const isToday = (day) => {
      const today = new Date();
      return (
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear()
      );
    };

    return (
      <>
        {prevMonthDays.map((day, index) => (
          <div key={`prev-${index}`} className="prev-month">
            {day}
          </div>
        ))}

        {currentMonthDays.map((day) => (
          <div
            key={`current-${day}`}
            className={`
              ${isToday(day) ? "current-day" : ""}
              ${hasEvent(day) ? "has-event" : ""}
            `}
          >
            {day}
          </div>
        ))}

        {nextMonthDays.map((day, index) => (
          <div key={`next-${index}`} className="next-month">
            {day}
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button className="calendar-nav-btn" onClick={goToPreviousMonth}>
          &#10094;
        </button>
        <h3>
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <button className="calendar-nav-btn" onClick={goToNextMonth}>
          &#10095;
        </button>
      </div>
      <div className="calendar-weekdays">
        {daysOfWeek.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>
      <div className="calendar-days">{renderCalendarDays()}</div>
    </div>
  );
};

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
                <h2>Task & Delivery Calendar</h2>
                <p>Track deliveries, view task, and add new ones seamlessly.</p>
              </div>
              <div>
                <img src={lone} alt="" />
              </div>
            </div>
            <div style={{ display: "flex" }}>
              <div className="calendar-container">
                <div>
                  <Calendar />
                  <div className="calendar-container-smalls">
                    <div>
                      <h3 className="smalls-h3">Tasks for March 11th, 2025</h3>
                      <p>No tasks for this day</p>
                    </div>
                    <div>
                      <button style={{ display: "flex", alignItems: "center" }}>
                        <img
                          src={plus}
                          style={{
                            width: "10px",
                            height: "10px",
                            marginRight: "5px",
                          }}
                        />{" "}
                        Add Task
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div>
                  <p
                    style={{
                      fontSize: "12px",
                      textAlign: "left",
                      marginLeft: "5px",
                    }}
                  >
                    Tasks This Year
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexDirection: "column",
                        border: "1px solid #E6E6E6",
                        padding: "3px",
                        borderRadius: "5px",
                        marginLeft: "5px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <img
                          src={arrowup}
                          alt=""
                          style={{
                            width: "10px",
                            height: "10px",
                            marginRight: "5px",
                          }}
                        />
                        <p style={{ fontSize: "8px", color: "#78ABCA" }}>
                          9.2%
                        </p>
                      </div>
                      <p style={{ fontSize: "8px" }}>31 DAYS AGO</p>
                    </div>
                    <div>
                      <h3 style={{ fontSize: "12px", color: "#78ABCA" }}>
                        643
                      </h3>
                      <p style={{ fontSize: "8px" }}>Tasks This Week</p>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingLeft: "5px",
                      paddingRight: "5px",
                      backgroundColor: "#7FB4D480",
                      borderRadius: "0px 0px 5px 5px",
                      marginLeft: "5px",
                      marginTop: "7px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "8px",
                        color: "#78ABCA",
                        marginRight: "5px",
                      }}
                    >
                      22% Decrease from last year
                    </p>
                    <img src={barup} alt="barup" width="10px" height="10px" />
                  </div>

                  {/* Second task stats container */}
                  <p
                    style={{
                      fontSize: "12px",
                      textAlign: "left",
                      marginLeft: "5px",
                      marginTop: "15px",
                    }}
                  >
                    Tasks This Month
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexDirection: "column",
                        border: "1px solid #E6E6E6",
                        padding: "3px",
                        borderRadius: "5px",
                        marginLeft: "5px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <img
                          src={arrowup}
                          alt=""
                          style={{
                            width: "10px",
                            height: "10px",
                            marginRight: "5px",
                          }}
                        />
                        <p style={{ fontSize: "8px", color: "#78ABCA" }}>
                          12.5%
                        </p>
                      </div>
                      <p style={{ fontSize: "8px" }}>15 DAYS AGO</p>
                    </div>
                    <div>
                      <h3 style={{ fontSize: "12px", color: "#78ABCA" }}>
                        287
                      </h3>
                      <p style={{ fontSize: "8px" }}>Tasks This Month</p>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingLeft: "5px",
                      paddingRight: "5px",
                      backgroundColor: "#7DBD7D80",
                      borderRadius: "0px 0px 5px 5px",
                      marginLeft: "5px",
                      marginTop: "7px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "8px",
                        color: "#78ABCA",
                        marginRight: "5px",
                      }}
                    >
                      15% Increase from last month
                    </p>
                    <img src={barup} alt="barup" width="10px" height="10px" />
                  </div>

                  {/* Third task stats container */}
                  <p
                    style={{
                      fontSize: "12px",
                      textAlign: "left",
                      marginLeft: "5px",
                      marginTop: "15px",
                    }}
                  >
                    Tasks This Week
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexDirection: "column",
                        border: "1px solid #E6E6E6",
                        padding: "3px",
                        borderRadius: "5px",
                        marginLeft: "5px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <img
                          src={arrowup}
                          alt=""
                          style={{
                            width: "10px",
                            height: "10px",
                            marginRight: "5px",
                          }}
                        />
                        <p style={{ fontSize: "8px", color: "#78ABCA" }}>
                          18.3%
                        </p>
                      </div>
                      <p style={{ fontSize: "8px" }}>7 DAYS AGO</p>
                    </div>
                    <div>
                      <h3 style={{ fontSize: "12px", color: "#78ABCA" }}>42</h3>
                      <p style={{ fontSize: "8px" }}>Tasks This Week</p>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingLeft: "5px",
                      paddingRight: "6px",
                      backgroundColor: "#EE999980",
                      borderRadius: "0px 0px 5px 5px",
                      marginLeft: "5px",
                      marginTop: "7px",
                    }}
                  >
                    <p style={{ fontSize: "8px", color: "#000000" }}>
                      8% Increase from last week
                    </p>
                    <img src={barup} alt="barup" width="10px" height="10px" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CrewSetting;
