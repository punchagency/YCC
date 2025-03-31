import React, { useState, useEffect } from "react";

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
import { useUser } from "../../context/userContext";
// import { getUserProfie } from "../../services/authService";

const Calendar = () => {
  const { userProfile, setUserProfile, user } = useUser();

  // getUserProfie(user.id);

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

const Inventory = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sample data for the charts
  const lineChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Online orders",
        data: [100, 150, 250, 350, 500, 650, 800],
        borderColor: "#4880FF",
        backgroundColor: "rgba(72, 128, 255, 0.1)",
        tension: 0.4,
        fill: false,
      },
      {
        label: "Offline orders",
        data: [50, 75, 100, 125, 150, 175, 200],
        borderColor: "#FFA500",
        backgroundColor: "rgba(255, 165, 0, 0.1)",
        tension: 0.4,
        fill: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          font: {
            size: isMobile ? 8 : 10,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: isMobile ? 8 : 10,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          boxWidth: 10,
          font: {
            size: isMobile ? 10 : 12,
          },
        },
      },
    },
  };

  // Render mobile dashboard
  const renderMobileDashboard = () => {
    return (
      <div style={{ padding: "10px" }}>
        {/* AI Summary Section */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "10px",
            padding: "15px",
            marginBottom: "15px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <h3
            style={{
              fontSize: "16px",
              margin: "0 0 5px 0",
              fontWeight: "600",
            }}
          >
            AI Summary
          </h3>
          <p
            style={{
              fontSize: "12px",
              color: "#666",
              margin: "0 0 15px 0",
            }}
          >
            Highlights what needs attention (e.g., upcoming orders, expiring
            certificates, career suggestions, etc.)
          </p>

          {/* Upcoming Orders Card */}
          <div
            style={{
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                backgroundColor: "#e6f0ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "12px",
              }}
            >
              <span style={{ color: "#4880FF", fontSize: "14px" }}>$</span>
            </div>
            <div style={{ flex: 1 }}>
              <h4
                style={{
                  margin: "0 0 3px 0",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              >
                $1k
              </h4>
              <p style={{ margin: "0", fontSize: "12px", color: "#666" }}>
                Upcoming Orders
              </p>
              <p
                style={{
                  margin: "3px 0 0 0",
                  fontSize: "11px",
                  color: "#4880FF",
                }}
              >
                +9% from yesterday
              </p>
            </div>
          </div>

          {/* Expiring Certifications Card */}
          <div
            style={{
              backgroundColor: "#fffde7",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                backgroundColor: "#fff8e1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "12px",
              }}
            >
              <span style={{ color: "#FFA000", fontSize: "14px" }}>5</span>
            </div>
            <div style={{ flex: 1 }}>
              <h4
                style={{
                  margin: "0 0 3px 0",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              >
                5
              </h4>
              <p style={{ margin: "0", fontSize: "12px", color: "#666" }}>
                Expiring Certifications
              </p>
              <p
                style={{
                  margin: "3px 0 0 0",
                  fontSize: "11px",
                  color: "#FFA000",
                }}
              >
                +7% from yesterday
              </p>
            </div>
          </div>

          {/* Career Suggestions Card */}
          <div
            style={{
              backgroundColor: "#e8f5e9",
              borderRadius: "8px",
              padding: "12px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                backgroundColor: "#c8e6c9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "12px",
              }}
            >
              <span style={{ color: "#43A047", fontSize: "14px" }}>10</span>
            </div>
            <div style={{ flex: 1 }}>
              <h4
                style={{
                  margin: "0 0 3px 0",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              >
                10
              </h4>
              <p style={{ margin: "0", fontSize: "12px", color: "#666" }}>
                Career Suggestions
              </p>
              <p
                style={{
                  margin: "3px 0 0 0",
                  fontSize: "11px",
                  color: "#43A047",
                }}
              >
                +5.5% from yesterday
              </p>
            </div>
          </div>
        </div>

        {/* Orders Analytics Section */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "10px",
            padding: "15px",
            marginBottom: "15px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <h3
            style={{
              fontSize: "16px",
              margin: "0 0 5px 0",
              fontWeight: "600",
            }}
          >
            Orders Analytics
          </h3>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <div style={{ fontSize: "12px", color: "#666" }}>Monthly</div>
          </div>

          <div style={{ height: "200px", marginBottom: "10px" }}>
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>

        {/* Current Order Summary Section */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "10px",
            padding: "15px",
            marginBottom: "15px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <h3
            style={{
              fontSize: "16px",
              margin: "0 0 5px 0",
              fontWeight: "600",
            }}
          >
            Current Order Summary
          </h3>
          <p
            style={{
              fontSize: "12px",
              color: "#666",
              margin: "0 0 15px 0",
            }}
          >
            Display real-time updates on placed, pending, and completing orders.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              marginBottom: "15px",
            }}
          >
            <div
              style={{
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
                padding: "15px",
                textAlign: "center",
              }}
            >
              <h4
                style={{
                  margin: "0 0 5px 0",
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
              >
                522
              </h4>
              <p style={{ margin: "0", fontSize: "12px", color: "#666" }}>
                Total Orders
              </p>
            </div>
            <div
              style={{
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
                padding: "15px",
                textAlign: "center",
              }}
            >
              <h4
                style={{
                  margin: "0 0 5px 0",
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
              >
                120
              </h4>
              <p style={{ margin: "0", fontSize: "12px", color: "#666" }}>
                Pending Orders
              </p>
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
              padding: "15px",
              textAlign: "center",
              marginBottom: "15px",
            }}
          >
            <h4
              style={{
                margin: "0 0 5px 0",
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              402
            </h4>
            <p style={{ margin: "0", fontSize: "12px", color: "#666" }}>
              Completed Orders
            </p>
          </div>

          {/* Recent Orders */}
          <div>
            {[
              {
                id: "#YCC-156",
                name: "John Smith",
                status: "Pending",
                amount: "$2,500.00",
                date: "2024-03-15",
              },
              {
                id: "#YCC-157",
                name: "Sarah Johnson",
                status: "Completed",
                amount: "$1,800.00",
                date: "2024-03-14",
              },
              {
                id: "#YCC-158",
                name: "Mike Wilson",
                status: "Processing",
                amount: "$1,200.00",
                date: "2024-03-14",
              },
              {
                id: "#YCC-159",
                name: "Emma Davis",
                status: "Pending",
                amount: "$950.00",
                date: "2024-03-13",
              },
            ].map((order, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom: index < 3 ? "1px solid #eee" : "none",
                }}
              >
                <div>
                  <p
                    style={{
                      margin: "0 0 3px 0",
                      fontSize: "13px",
                      fontWeight: "500",
                    }}
                  >
                    {order.id}
                  </p>
                  <p style={{ margin: "0", fontSize: "12px", color: "#666" }}>
                    {order.name}
                  </p>
                </div>
                <div>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "3px 8px",
                      borderRadius: "4px",
                      fontSize: "11px",
                      fontWeight: "500",
                      backgroundColor:
                        order.status === "Completed"
                          ? "#e8f5e9"
                          : order.status === "Processing"
                          ? "#e3f2fd"
                          : "#fff8e1",
                      color:
                        order.status === "Completed"
                          ? "#43A047"
                          : order.status === "Processing"
                          ? "#1976D2"
                          : "#FFA000",
                      marginBottom: "3px",
                    }}
                  >
                    {order.status}
                  </span>
                  <p
                    style={{
                      margin: "0",
                      fontSize: "12px",
                      textAlign: "right",
                    }}
                  >
                    {order.amount}
                  </p>
                  <p
                    style={{
                      margin: "0",
                      fontSize: "11px",
                      color: "#666",
                      textAlign: "right",
                    }}
                  >
                    {order.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Task & Delivery Calendar Section */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "10px",
            padding: "15px",
            marginBottom: "15px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <h3
              style={{
                fontSize: "16px",
                margin: "0",
                fontWeight: "600",
              }}
            >
              Task & Delivery Calendar
            </h3>
            <Button
              icon="pi pi-ellipsis-v"
              className="p-button-text p-button-rounded p-button-plain"
              style={{ width: "30px", height: "30px" }}
            />
          </div>
          <p
            style={{
              fontSize: "12px",
              color: "#666",
              margin: "0 0 15px 0",
            }}
          >
            Track deliveries, view task, and add new ones seamlessly.
          </p>

          {/* Calendar header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <Button
              icon="pi pi-chevron-left"
              className="p-button-text p-button-rounded"
              style={{ width: "30px", height: "30px" }}
            />
            <h4 style={{ margin: "0", fontSize: "14px" }}>March 2025</h4>
            <Button
              icon="pi pi-chevron-right"
              className="p-button-text p-button-rounded"
              style={{ width: "30px", height: "30px" }}
            />
          </div>

          {/* Calendar days header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              textAlign: "center",
              marginBottom: "5px",
            }}
          >
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
              (day, index) => (
                <div
                  key={index}
                  style={{ fontSize: "12px", color: "#666", padding: "5px 0" }}
                >
                  {day}
                </div>
              )
            )}
          </div>

          {/* Calendar grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: "5px",
              marginBottom: "15px",
            }}
          >
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <div
                key={day}
                style={{
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  fontSize: "12px",
                  backgroundColor: day === 24 ? "#4880FF" : "transparent",
                  color:
                    day === 24
                      ? "white"
                      : day === new Date().getDate()
                      ? "#4880FF"
                      : "inherit",
                  border:
                    day === new Date().getDate() && day !== 24
                      ? "1px solid #4880FF"
                      : "none",
                }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Task stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              marginBottom: "15px",
            }}
          >
            <div
              style={{
                backgroundColor: "#f0f7ff",
                borderRadius: "8px",
                padding: "10px",
              }}
            >
              <h5 style={{ margin: "0 0 5px 0", fontSize: "13px" }}>
                Tasks This Year
              </h5>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                  643
                </span>
                <span style={{ fontSize: "11px", color: "#4880FF" }}>
                  Tasks Completed
                </span>
              </div>
            </div>
            <div
              style={{
                backgroundColor: "#f0f7ff",
                borderRadius: "8px",
                padding: "10px",
              }}
            >
              <h5 style={{ margin: "0 0 5px 0", fontSize: "13px" }}>
                Tasks This Month
              </h5>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                  287
                </span>
                <span style={{ fontSize: "11px", color: "#4880FF" }}>
                  Tasks This Month
                </span>
              </div>
            </div>
          </div>

          {/* Add task button */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            <Button
              label="Add Task"
              icon="pi pi-plus"
              style={{
                backgroundColor: "#4880FF",
                border: "none",
                borderRadius: "4px",
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {isMobile ? (
        // Mobile view
        renderMobileDashboard()
      ) : (
        // Desktop view - keep existing layout
        <>
          <div className="flex align-items-center justify-content-between sub-header-panel">
            <div className="sub-header-left sub-header-left-with-arrow">
              <div className="content">
                <h3>Dashboard</h3>
              </div>
            </div>
          </div>
          <div className="inventory-dashboard-container">
            <div className="inventory-dashboard-container-wrapper">
              <div className="summary-container">
                <div>
                  <h3>AI Summary</h3>
                  <p>
                    Highlights what needs attention (eg., upcoming orders,
                    expiring certificates, career, suggestions, etc.)
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
              <div style={{ width: "100%" }}>
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
                    maintainAspectRatio: false,
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
                      Display real-time updates on placed, pending, and
                      completing orders.
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
                    <p>
                      Track deliveries, view task, and add new ones seamlessly.
                    </p>
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
                          <h3 className="smalls-h3">
                            Tasks for March 11th, 2025
                          </h3>
                          <p>No tasks for this day</p>
                        </div>
                        <div>
                          <button
                            style={{ display: "flex", alignItems: "center" }}
                          >
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
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
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
                        <img
                          src={barup}
                          alt="barup"
                          width="10px"
                          height="10px"
                        />
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
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
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
                        <img
                          src={barup}
                          alt="barup"
                          width="10px"
                          height="10px"
                        />
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
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <img
                              src={arrowup}
                              alt="arrowup"
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
                          <h3 style={{ fontSize: "12px", color: "#78ABCA" }}>
                            42
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
                        <img
                          src={barup}
                          alt="barup"
                          width="10px"
                          height="10px"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Inventory;
