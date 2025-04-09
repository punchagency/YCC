import React, { useState, useEffect } from "react";
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
    <div className="profiles" style={{ display: 'flex', alignItems: 'flex-start', padding: '10px 0' }}>
      <div style={{ marginRight: '12px' }}>
        <img src={profilenoti} alt="profile" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontWeight: "bold", margin: '0 0 5px 0', fontSize: '16px' }} className="header">
          {title}
        </p>
        <p style={{ margin: '0 0 3px 0', fontSize: '14px', color: '#666' }}>{time}</p>
        <p style={{ margin: '0 0 3px 0', fontSize: '14px', color: '#666' }}>{location}</p>
        <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#666' }}>{organizer}</p>
        <div className="profile_display" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src={man1} alt="attendee" style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
          <img src={man1} alt="attendee" style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
          <img src={man1} alt="attendee" style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
          <div
            style={{
              border: "1px solid #4880FF",
              padding: "0",
              height: "24px",
              width: "24px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "50%",
              fontSize: '10px',
              color: '#4880FF'
            }}
          >
            <p style={{ margin: 0 }}>15+</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Calendar = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeView, setActiveView] = useState('events'); // 'events' or 'calendar'
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // Mobile view toggle buttons
  const renderMobileViewToggle = () => {
    if (!isMobile) return null;
    
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        margin: '15px 0',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid #E4E7EC'
      }}>
        <button 
          onClick={() => setActiveView('events')}
          style={{
            flex: 1,
            padding: '10px',
            background: activeView === 'events' ? '#0387D9' : '#F9FAFB',
            color: activeView === 'events' ? 'white' : '#344054',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          Events
        </button>
        <button 
          onClick={() => setActiveView('calendar')}
          style={{
            flex: 1,
            padding: '10px',
            background: activeView === 'calendar' ? '#0387D9' : '#F9FAFB',
            color: activeView === 'calendar' ? 'white' : '#344054',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          Calendar
        </button>
      </div>
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

      {renderMobileViewToggle()}

      <div className="widget-container" style={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        gap: '20px'
      }}>
        <div 
          className="event-container-display" 
          style={{ 
            flex: isMobile ? 'auto' : '0 0 350px',
            display: isMobile && activeView !== 'events' ? 'none' : 'block',
            background: '#FFFFFF',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '1px 1px 1px #0000001A',
            marginBottom: '20px'
          }}
        >
          <div className="new_event" style={{ marginBottom: '20px' }}>
            <button style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              padding: '12px',
              background: '#0387D9',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 500,
              marginBottom: '20px'
            }}>
              <img src={plus} alt="plus" style={{ marginRight: '8px', width: '16px', height: '16px' }} />
              Add New Event
            </button>
            <h3 style={{ fontSize: '18px', margin: '0 0 15px 0' }}>You Are Going To</h3>
          </div>

          {events.map((event, index) => (
            <React.Fragment key={event.id}>
              {index > 0 && <div className="event-divider" style={{ height: '1px', background: '#E4E7EC', margin: '10px 0' }}></div>}
              <EventCard
                title={event.title}
                time={event.time}
                location={event.location}
                organizer={event.organizer}
              />
            </React.Fragment>
          ))}

          <div className="see-more-container" style={{ marginTop: '20px', textAlign: 'center' }}>
            <button 
              className="see-more-button" 
              onClick={handleSeeMore}
              style={{
                width: '100%',
                padding: '12px',
                background: 'transparent',
                color: '#0387D9',
                border: '1px solid #0387D9',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
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
            display: isMobile && activeView !== 'calendar' ? 'none' : 'block'
          }}
        >
          <h3 style={{ fontSize: '18px', margin: '0 0 15px 0' }}>Calendar</h3>

          {/* Large Calendar Component */}
          <div
            style={{
              width: "100%",
              height: isMobile ? '450px' : '600px',
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
                flexWrap: isMobile ? 'wrap' : 'nowrap',
                gap: isMobile ? '10px' : '0'
              }}
            >
              <div>
                <h2 style={{ fontSize: isMobile ? '16px' : '20px', margin: 0, color: "#344054" }}>
                  {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
              </div>
              <div style={{ 
                display: "flex", 
                gap: "10px",
                width: isMobile ? '100%' : 'auto',
                justifyContent: isMobile ? 'space-between' : 'flex-end',
                marginTop: isMobile ? '10px' : '0'
              }}>
                <button
                  onClick={goToPreviousMonth}
                  style={{
                    background: "#F9FAFB",
                    border: "1px solid #E4E7EC",
                    color: "#344054",
                    padding: isMobile ? '6px 12px' : '8px 16px',
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: isMobile ? '12px' : '14px',
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
                    padding: isMobile ? '6px 12px' : '8px 16px',
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: isMobile ? '12px' : '14px',
                    flex: isMobile ? '1' : 'none'
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
                    padding: isMobile ? '6px 12px' : '8px 16px',
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: isMobile ? '12px' : '14px',
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
                fontSize: isMobile ? '12px' : '14px'
              }}
            >
              {/* Weekday Headers */}
              {daysOfWeek.map((day, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: "#F9FAFB",
                    padding: isMobile ? '5px 2px' : '10px',
                    textAlign: "center",
                    fontWeight: 500,
                    color: "#667085",
                    borderBottom: "1px solid #E4E7EC",
                  }}
                >
                  {isMobile ? day.charAt(0) : day}
                </div>
              ))}

              {/* Previous Month Days */}
              {prevMonthDays.map((day, index) => (
                <div
                  key={`prev-${index}`}
                  style={{
                    backgroundColor: "#F2F4F7",
                    padding: isMobile ? '4px 2px' : '8px',
                    position: "relative",
                    cursor: "pointer",
                    fontSize: isMobile ? '11px' : 'inherit'
                  }}
                >
                  <span
                    style={{
                      color: "#98A2B3",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: isMobile ? '20px' : '28px',
                      height: isMobile ? '20px' : '28px',
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
                    padding: isMobile ? '4px 2px' : '8px',
                    position: "relative",
                    cursor: "pointer",
                    border: day === selectedDay ? "1px solid #0387D9" : "none",
                    backgroundColor:
                      day === selectedDay ? "rgba(3, 135, 217, 0.1)" : "white",
                    fontSize: isMobile ? '11px' : 'inherit',
                    overflow: 'hidden'
                  }}
                  onClick={() => setSelectedDay(day)}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: isMobile ? '20px' : '28px',
                      height: isMobile ? '20px' : '28px',
                      borderRadius: "50%",
                      fontWeight: 500,
                      backgroundColor: isToday(day) ? "#0387D9" : "transparent",
                      color: isToday(day) ? "white" : "inherit",
                    }}
                  >
                    {day}
                  </span>

                  {/* Sample Event Dots - you can make these dynamic */}
                  {day % 5 === 0 && !isMobile && (
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

                  {/* For mobile, just show a colored dot instead of text */}
                  {day % 5 === 0 && isMobile && (
                    <div style={{ 
                      width: '4px', 
                      height: '4px', 
                      borderRadius: '50%', 
                      backgroundColor: '#0387D9',
                      margin: '2px auto 0'
                    }}></div>
                  )}

                  {day % 7 === 0 && !isMobile && (
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

                  {/* For mobile, just show a colored dot instead of text */}
                  {day % 7 === 0 && isMobile && (
                    <div style={{ 
                      width: '4px', 
                      height: '4px', 
                      borderRadius: '50%', 
                      backgroundColor: '#F79009',
                      margin: '2px auto 0'
                    }}></div>
                  )}
                </div>
              ))}

              {/* Next Month Days */}
              {nextMonthDays.map((day, index) => (
                <div
                  key={`next-${index}`}
                  style={{
                    backgroundColor: "#F2F4F7",
                    padding: isMobile ? '4px 2px' : '8px',
                    position: "relative",
                    cursor: "pointer",
                    fontSize: isMobile ? '11px' : 'inherit'
                  }}
                >
                  <span
                    style={{
                      color: "#98A2B3",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: isMobile ? '20px' : '28px',
                      height: isMobile ? '20px' : '28px',
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
              <div style={{ 
                display: "flex", 
                gap: isMobile ? "10px" : "15px", 
                flexWrap: "wrap",
                justifyContent: isMobile ? 'center' : 'flex-start'
              }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: isMobile ? "10px" : "12px",
                    color: "#667085",
                  }}
                >
                  <span
                    style={{
                      width: isMobile ? "10px" : "12px",
                      height: isMobile ? "10px" : "12px",
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
                    fontSize: isMobile ? "10px" : "12px",
                    color: "#667085",
                  }}
                >
                  <span
                    style={{
                      width: isMobile ? "10px" : "12px",
                      height: isMobile ? "10px" : "12px",
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
                    fontSize: isMobile ? "10px" : "12px",
                    color: "#667085",
                  }}
                >
                  <span
                    style={{
                      width: isMobile ? "10px" : "12px",
                      height: isMobile ? "10px" : "12px",
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
                    fontSize: isMobile ? "10px" : "12px",
                    color: "#667085",
                  }}
                >
                  <span
                    style={{
                      width: isMobile ? "10px" : "12px",
                      height: isMobile ? "10px" : "12px",
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
