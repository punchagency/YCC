import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
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
import editLogo from "../../assets/images/crew/editLogo.png";
import deleteLogo from "../../assets/images/crew/deleteLogo.png";
import plus from "../../assets/images/crew/plus.png";
import profilenoti from "../../assets/images/crew/profilenoti.png";
import man1 from "../../assets/images/crew/Man1.png";

const EventCard = ({ title, time, location, organizer }) => {
  return (
    <div className="profiles">
      <div>
        <img src={profilenoti} alt="profile" />
      </div>
      <div>
        <p style={{ fontWeight: "bold" }} className="header">
          {title}
        </p>
        <p>{time}</p>
        <p>{location}</p>
        <p>{organizer}</p>
        <div className="profile_display">
          <img src={man1} alt="edit" />
          <img src={man1} alt="delete" />
          <img src={man1} alt="lone" />
          <div
            style={{
              border: "1px solid #4880FF",
              padding: "15px",
              height: "20px",
              width: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "50%",
            }}
          >
            <p>15+</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Calendar = () => {
  const events = [
    {
      id: 1,
      title: "Design Conference",
      time: "Today 07:00 AM",
      location: "56 Davis St, San Francisco, CA",
      organizer: "Meaghanberg",
    },
    {
      id: 2,
      title: "Team Meeting",
      time: "Tomorrow 10:30 AM",
      location: "Virtual - Zoom Meeting",
      organizer: "Project Atlantis",
    },
    {
      id: 3,
      title: "Client Presentation",
      time: "Mar 25, 2024 02:00 PM",
      location: "123 Business Ave, Miami, FL",
      organizer: "Oceanic Ventures",
    },
    {
      id: 4,
      title: "Training Workshop",
      time: "Mar 28, 2024 09:00 AM",
      location: "Training Center, Seattle, WA",
      organizer: "Maritime Skills",
    },
  ];

  const handleSeeMore = () => {
    // Handle see more action
    console.log("See more events clicked");
  };

  // Calendar component state and functions
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

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

  // Calendar navigation functions
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

  // Generate calendar days
  const generateCalendarDays = () => {
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
      nextMonthDays.push(i);
    }

    return { prevMonthDays, currentMonthDays, nextMonthDays };
  };

  const { prevMonthDays, currentMonthDays, nextMonthDays } =
    generateCalendarDays();

  // Check if a day is today
  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  return (
    <>
      <div className="flex align-items-center justify-content-between sub-header-panel">
        <div className="sub-header-left sub-header-left-with-arrow">
          <div className="content">
            <h3>Calendar</h3>
          </div>
        </div>
      </div>

      <div className="widget-container">
        <div className="event-container-display">
          <div className="new_event">
            <button>
              <img src={plus} alt="plus" />
              Add New Event
            </button>
            <h3>You Are Going To</h3>
          </div>

          {events.map((event, index) => (
            <React.Fragment key={event.id}>
              {index > 0 && <div className="event-divider"></div>}
              <EventCard
                title={event.title}
                time={event.time}
                location={event.location}
                organizer={event.organizer}
              />
            </React.Fragment>
          ))}

          <div className="see-more-container">
            <button className="see-more-button" onClick={handleSeeMore}>
              See More Events
            </button>
          </div>
        </div>
        <div
          style={{
            flex: 1,
            background: "#FFFFFF",
            borderRadius: "10px",
            padding: "20px",
            boxShadow: "1px 1px 1px #0000001A",
            marginLeft: "20px",
            marginBottom: "20px",
            marginRight: "20px",
          }}
        >
          <h3>Calendar</h3>

          {/* Large Calendar Component */}
          <div
            style={{
              width: "100%",
              height: "600px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Calendar Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <div>
                <h2 style={{ fontSize: "20px", margin: 0, color: "#344054" }}>
                  {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={goToPreviousMonth}
                  style={{
                    background: "#F9FAFB",
                    border: "1px solid #E4E7EC",
                    color: "#344054",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  <i className="pi pi-chevron-left"></i>
                </button>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  style={{
                    background: "#0387D9",
                    color: "white",
                    border: "1px solid #0387D9",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Today
                </button>
                <button
                  onClick={goToNextMonth}
                  style={{
                    background: "#F9FAFB",
                    border: "1px solid #E4E7EC",
                    color: "#344054",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  <i className="pi pi-chevron-right"></i>
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: "1px",
                backgroundColor: "#E4E7EC",
                border: "1px solid #E4E7EC",
                flex: 1,
              }}
            >
              {/* Weekday Headers */}
              {daysOfWeek.map((day, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: "#F9FAFB",
                    padding: "10px",
                    textAlign: "center",
                    fontWeight: 500,
                    color: "#667085",
                    borderBottom: "1px solid #E4E7EC",
                  }}
                >
                  {day}
                </div>
              ))}

              {/* Previous Month Days */}
              {prevMonthDays.map((day, index) => (
                <div
                  key={`prev-${index}`}
                  style={{
                    backgroundColor: "#F2F4F7",
                    padding: "8px",
                    position: "relative",
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{
                      color: "#98A2B3",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      fontWeight: 500,
                    }}
                  >
                    {day}
                  </span>
                </div>
              ))}

              {/* Current Month Days */}
              {currentMonthDays.map((day) => (
                <div
                  key={`current-${day}`}
                  style={{
                    backgroundColor: "white",
                    padding: "8px",
                    position: "relative",
                    cursor: "pointer",
                    border: day === selectedDay ? "1px solid #0387D9" : "none",
                    backgroundColor:
                      day === selectedDay ? "rgba(3, 135, 217, 0.1)" : "white",
                  }}
                  onClick={() => setSelectedDay(day)}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      fontWeight: 500,
                      backgroundColor: isToday(day) ? "#0387D9" : "transparent",
                      color: isToday(day) ? "white" : "inherit",
                    }}
                  >
                    {day}
                  </span>

                  {/* Sample Event Dots - you can make these dynamic */}
                  {day % 5 === 0 && (
                    <div style={{ marginTop: "5px" }}>
                      <div
                        style={{
                          marginBottom: "3px",
                          padding: "3px 6px",
                          borderRadius: "4px",
                          fontSize: "11px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          color: "white",
                          backgroundColor: "#0387D9",
                        }}
                      >
                        Meeting
                      </div>
                    </div>
                  )}

                  {day % 7 === 0 && (
                    <div style={{ marginTop: "5px" }}>
                      <div
                        style={{
                          marginBottom: "3px",
                          padding: "3px 6px",
                          borderRadius: "4px",
                          fontSize: "11px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          color: "white",
                          backgroundColor: "#F79009",
                        }}
                      >
                        Workshop
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Next Month Days */}
              {nextMonthDays.map((day, index) => (
                <div
                  key={`next-${index}`}
                  style={{
                    backgroundColor: "#F2F4F7",
                    padding: "8px",
                    position: "relative",
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{
                      color: "#98A2B3",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      fontWeight: 500,
                    }}
                  >
                    {day}
                  </span>
                </div>
              ))}
            </div>

            {/* Calendar Footer with Legend */}
            <div style={{ marginTop: "15px" }}>
              <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "12px",
                    color: "#667085",
                  }}
                >
                  <span
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      marginRight: "5px",
                      backgroundColor: "#0387D9",
                    }}
                  ></span>
                  <span>Meeting</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "12px",
                    color: "#667085",
                  }}
                >
                  <span
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      marginRight: "5px",
                      backgroundColor: "#7F56D9",
                    }}
                  ></span>
                  <span>Presentation</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "12px",
                    color: "#667085",
                  }}
                >
                  <span
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      marginRight: "5px",
                      backgroundColor: "#F79009",
                    }}
                  ></span>
                  <span>Workshop</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "12px",
                    color: "#667085",
                  }}
                >
                  <span
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      marginRight: "5px",
                      backgroundColor: "#F04438",
                    }}
                  ></span>
                  <span>Deadline</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Calendar;
