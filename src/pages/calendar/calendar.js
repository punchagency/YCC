import React, { useState, useEffect, useRef } from "react";
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
import { Calendar as PrimeCalendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import three from "../../assets/images/crew/three.png";

import {
  createEvent,
  fetchEvents,
  updateEvent,
  deleteEvent,
  inviteGuests
} from "../../services/calendar/calendarService";
import { Menu } from "primereact/menu";
import { Calendar } from "primereact/calendar";
import more from "../../assets/images/crew/more.png";

const EventCard = ({
  title,
  start,
  location,
  description,
  event,
  onUpdate,
  onDelete,
  onAddGuest,
}) => {
  const menuRef = useRef(null);

  const getEventMenuItems = () => [
    {
      label: "Update Event",
      icon: "pi pi-pencil",
      command: () => onUpdate(event),
    },
    {
      label: "Delete Event",
      icon: "pi pi-trash",
      command: () => onDelete(event),
    },
    {
      label: "Add Guest",
      icon: "pi pi-user-plus",
      command: () => onAddGuest(event),
    },
  ];

  // Helper function to format the date/time
  const formatEventTime = (startDate) => {
    const date = new Date(startDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };
  

  // Helper function to format location
  const formatLocation = (location) => {
    const locationMap = {
      zoom: "Virtual - Zoom Meeting",
      "google-meet": "Virtual - Google Meet",
      "ms-teams": "Virtual - Microsoft Teams",
      "in-person": "In Person Meeting",
    };
    return locationMap[location] || location;
  };

  // Add this helper function to get guest count
  const getGuestCount = (event) => {
    const emailCount = event.guestEmails?.length || 0;
    const guestCount = event.guests?.length || 0;
    return emailCount + guestCount;
  };

  return (
    <div
      className="profiles"
      style={{ display: "flex", alignItems: "flex-start", padding: "10px 0" }}
    >
      <div style={{ marginRight: "12px" }}>
        <img
          src={profilenoti}
          alt="profile"
          style={{ width: "40px", height: "40px", borderRadius: "50%" }}
        />
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <h3 style={{ margin: "0 0 5px 0", fontSize: "16px" }}>{title}</h3>
          <p style={{ margin: "0 0 5px 0", color: "#666" }}>
            {formatEventTime(start)}
          </p>
          <p style={{ margin: 0, color: "#666" }}>{formatLocation(location)}</p>
          {description && (
            <p style={{ margin: "5px 0 0 0", color: "#666" }}>{description}</p>
          )}
          
          {/* Add this to show guest count */}
          {getGuestCount(event) > 0 && (
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              marginTop: "5px",
              color: "#0387D9",
              fontSize: "12px"
            }}>
              <i className="pi pi-users" style={{ marginRight: "5px" }}></i>
              <span>{getGuestCount(event)} {getGuestCount(event) === 1 ? 'guest' : 'guests'}</span>
            </div>
          )}
        </div>
        <div className="event-actions">
          <img
            src={three}
            alt="menu"
            style={{ cursor: "pointer" }}
            onClick={(e) => menuRef.current.toggle(e)}
          />
          <Menu
            model={getEventMenuItems()}
            popup
            ref={menuRef}
            style={{ width: "150px" }}
          />
        </div>
      </div>
    </div>
  );
};

const DayEventsModal = ({ visible, onHide, events, selectedDate }) => {
  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={`Events for ${selectedDate?.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })}`}
      style={{ width: "600px" }}
    >
      <div className="day-events-content">
        {events.length === 0 ? (
          <p>No events scheduled for this day.</p>
        ) : (
          events.map((event, index) => (
            <div key={event._id} className="event-item">
              <h3
                style={{
                  margin: "0 0 10px 0",
                  fontSize: "18px",
                  color: "#344054",
                }}
              >
                {event.title}
              </h3>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <i
                  className="pi pi-calendar"
                  style={{ marginRight: "8px", color: "#667085" }}
                ></i>
                <span style={{ fontSize: "14px", color: "#475467" }}>
                  {new Date(event.start).toLocaleString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <i
                  className="pi pi-map-marker"
                  style={{ marginRight: "8px", color: "#667085" }}
                ></i>
                <span style={{ fontSize: "14px", color: "#475467" }}>
                  {event.location}
                </span>
              </div>
              {event.description && (
                <p
                  style={{
                    margin: "10px 0 0 0",
                    fontSize: "14px",
                    color: "#475467",
                    padding: "10px",
                    backgroundColor: "#fff",
                    borderRadius: "4px",
                  }}
                >
                  {event.description}
                </p>
              )}
              
              {/* Add this section to display guests */}
              {(event.guests?.length > 0 || event.guestEmails?.length > 0) && (
                <div className="event-guests" style={{ 
                  marginTop: "15px", 
                  padding: "10px", 
                  backgroundColor: "#f8f9fa", 
                  borderRadius: "4px" 
                }}>
                  <h4 style={{ 
                    fontSize: "14px", 
                    fontWeight: "600", 
                    marginBottom: "8px",
                    color: "#344054" 
                  }}>
                    Guests
                  </h4>
                  
                  <div className="guest-list">
                    {event.guestEmails && event.guestEmails.map((email, idx) => (
                      <div key={`email-${idx}`} className="guest-item" style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "5px"
                      }}>
                        <i className="pi pi-envelope" style={{ 
                          marginRight: "8px", 
                          color: "#667085",
                          fontSize: "12px" 
                        }}></i>
                        <span style={{ fontSize: "13px", color: "#475467" }}>{email}</span>
                      </div>
                    ))}
                    
                    {event.guests && event.guests.map((guest, idx) => (
                      <div key={`guest-${idx}`} className="guest-item" style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "5px"
                      }}>
                        <i className="pi pi-user" style={{ 
                          marginRight: "8px", 
                          color: "#667085",
                          fontSize: "12px" 
                        }}></i>
                        <span style={{ fontSize: "13px", color: "#475467" }}>
                          {guest.email || guest.name || `Guest ${idx + 1}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </Dialog>
  );
};

const AllEventsModal = ({ visible, onHide, events, onEventUpdate, onAddGuest }) => {
  const [showUpdateEventModal, setShowUpdateEventModal] = useState(false);
  const [showDeleteEventModal, setShowDeleteEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const toast = useRef(null);

  const handleUpdateClick = (event) => {
    setSelectedEvent({ ...event }); // Create a copy of the event
    setShowUpdateEventModal(true);
  };

  const handleDeleteClick = (event) => {
    setSelectedEvent({ ...event });
    setShowDeleteEventModal(true);
  };

  const handleUpdateEvent = async () => {
    try {
      const result = await updateEvent(selectedEvent._id, {
        title: selectedEvent.title,
        start: selectedEvent.start,
        end: selectedEvent.end,
        location: selectedEvent.location,
        description: selectedEvent.description,
        type: selectedEvent.type,
      });

      if (result.success) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Event updated successfully",
        });
        setShowUpdateEventModal(false);
        onHide(); // Close the all events modal
        onEventUpdate(); // Refresh the events
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: result.error || "Failed to update event",
        });
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "An error occurred while updating the event",
      });
    }
  };

  const handleDeleteEvent = async () => {
    try {
      const result = await deleteEvent(selectedEvent._id);

      if (result.success) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Event deleted successfully",
        });
        setShowDeleteEventModal(false);
        onHide(); // Close the all events modal
        onEventUpdate(); // Refresh the events list
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: result.error || "Failed to delete event",
        });
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "An error occurred while deleting the event",
      });
    }
  };

  return (
    <>
      <Dialog
        visible={visible}
        onHide={onHide}
        header="All Events"
        className="day-events-modal"
        style={{ width: "500px" }}
      >
        <div className="day-events-content">
          {events.map((event, index) => (
            <React.Fragment key={event._id}>
              {index > 0 && (
                <div
                  className="event-divider"
                  style={{
                    height: "1px",
                    background: "#E4E7EC",
                    margin: "10px 0",
                  }}
                ></div>
              )}
              <EventCard
                title={event.title}
                start={event.start}
                location={event.location}
                description={event.description}
                event={event}
                onUpdate={handleUpdateClick}
                onDelete={handleDeleteClick}
                onAddGuest={onAddGuest}
              />
            </React.Fragment>
          ))}
        </div>
      </Dialog>

      {/* Update Event Modal */}
      <Dialog
        visible={showUpdateEventModal}
        onHide={() => {
          setShowUpdateEventModal(false);
          setSelectedEvent(null);
        }}
        header="Update Event"
        style={{ width: "500px" }}
      >
        {selectedEvent && (
          <div className="update-event-form">
            <div className="field">
              <label>Title</label>
              <InputText
                value={selectedEvent.title}
                onChange={(e) =>
                  setSelectedEvent({ ...selectedEvent, title: e.target.value })
                }
                className="w-full"
              />
            </div>
            <div className="field">
              <label>Location</label>
              <InputText
                value={selectedEvent.location}
                onChange={(e) =>
                  setSelectedEvent({
                    ...selectedEvent,
                    location: e.target.value,
                  })
                }
                className="w-full"
              />
            </div>
            <div className="field">
              <label>Description</label>
              <InputTextarea
                value={selectedEvent.description}
                onChange={(e) =>
                  setSelectedEvent({
                    ...selectedEvent,
                    description: e.target.value,
                  })
                }
                rows={3}
                className="w-full"
              />
            </div>
            <div className="field">
              <label>Start Date</label>
              <Calendar
                value={new Date(selectedEvent.start)}
                onChange={(e) =>
                  setSelectedEvent({ ...selectedEvent, start: e.value })
                }
                showTime
                className="w-full"
              />
            </div>
            <div className="field">
              <label>End Date</label>
              <Calendar
                value={new Date(selectedEvent.end)}
                onChange={(e) =>
                  setSelectedEvent({ ...selectedEvent, end: e.value })
                }
                showTime
                className="w-full"
              />
            </div>
            <div className="field">
              <label>Current Guests</label>
              <div className="current-guests" style={{ 
                padding: "10px", 
                backgroundColor: "#f8f9fa", 
                borderRadius: "4px",
                marginBottom: "15px" 
              }}>
                {selectedEvent.guestEmails && selectedEvent.guestEmails.map((email, idx) => (
                  <div key={`email-${idx}`} style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "5px"
                  }}>
                    <i className="pi pi-envelope" style={{ 
                      marginRight: "8px", 
                      color: "#667085",
                      fontSize: "12px" 
                    }}></i>
                    <span style={{ fontSize: "13px", color: "#475467" }}>{email}</span>
                  </div>
                ))}
                
                {selectedEvent.guests && selectedEvent.guests.map((guest, idx) => (
                  <div key={`guest-${idx}`} style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "5px"
                  }}>
                    <i className="pi pi-user" style={{ 
                      marginRight: "8px", 
                      color: "#667085",
                      fontSize: "12px" 
                    }}></i>
                    <span style={{ fontSize: "13px", color: "#475467" }}>
                      {guest.email || guest.name || `Guest ${idx + 1}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "0.5rem",
                marginTop: "1rem",
              }}
            >
              <Button
                label="Cancel"
                onClick={() => setShowUpdateEventModal(false)}
                className="p-button-text"
              />
              <Button label="Update" onClick={handleUpdateEvent} />
            </div>
          </div>
        )}
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        visible={showDeleteEventModal}
        onHide={() => setShowDeleteEventModal(false)}
        header="Confirm Delete"
        style={{ width: "400px" }}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle"
            style={{ fontSize: "2rem", color: "#ff9800", marginRight: "10px" }}
          />
          <span>Are you sure you want to delete this event?</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.5rem",
            marginTop: "1rem",
          }}
        >
          <Button
            label="No"
            onClick={() => setShowDeleteEventModal(false)}
            className="p-button-text"
          />
          <Button
            label="Yes"
            onClick={handleDeleteEvent}
            className="p-button-danger"
          />
        </div>
      </Dialog>

      <Toast ref={toast} />
    </>
  );
};

export default function CalendarPage() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeView, setActiveView] = useState("events");
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const toast = useRef(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    start: null,
    end: null,
    location: "",
  });
  const [showDayEventsModal, setShowDayEventsModal] = useState(false);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [selectedModalDate, setSelectedModalDate] = useState(null);
  const [showAllEventsModal, setShowAllEventsModal] = useState(false);
  const [showUpdateEventModal, setShowUpdateEventModal] = useState(false);
  const [showDeleteEventModal, setShowDeleteEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showAddGuestModal, setShowAddGuestModal] = useState(false);
  const [guestEmails, setGuestEmails] = useState(['']);

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const firstDay = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      const lastDay = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0,
        23,
        59,
        59
      );
      const response = await fetchEvents(firstDay, lastDay);
      console.log("response", response);
      if (response.success) {
        console.log("fetched events", response.data);
        setCalendarEvents(response.data);
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: response.error || "Failed to fetch events",
          life: 3000,
        });
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "An unexpected error occurred",
        life: 3000,
      });
      console.error("Error fetching events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("currentDate", currentDate);
    loadEvents();
  }, [currentDate]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSeeMore = () => {
    setShowAllEventsModal(true);
  };

  // Calendar component state and functions
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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "15px 0",
          borderRadius: "8px",
          overflow: "hidden",
          border: "1px solid #E4E7EC",
        }}
      >
        <button
          onClick={() => setActiveView("events")}
          style={{
            flex: 1,
            padding: "10px",
            background: activeView === "events" ? "#0387D9" : "#F9FAFB",
            color: activeView === "events" ? "white" : "#344054",
            border: "none",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          Events
        </button>
        <button
          onClick={() => setActiveView("calendar")}
          style={{
            flex: 1,
            padding: "10px",
            background: activeView === "calendar" ? "#0387D9" : "#F9FAFB",
            color: activeView === "calendar" ? "white" : "#344054",
            border: "none",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          Calendar
        </button>
      </div>
    );
  };

  const locationOptions = [
    { label: "Zoom", value: "zoom" },
    { label: "Google Meet", value: "google-meet" },
    { label: "Microsoft Teams", value: "ms-teams" },
    { label: "In Person", value: "in-person" },
  ];

  const handleAddNewEvent = () => {
    setShowEventModal(true);
  };

  const handleSaveEvent = async () => {
    // Validate required fields
    if (!newEvent.title || !newEvent.start) {
      toast.current.show({
        severity: "error",
        summary: "Required Fields",
        detail: "Please fill in all required fields",
        life: 3000,
      });
      return;
    }

    try {
      const response = await createEvent(newEvent);

      if (response.success) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Event created successfully",
          life: 3000,
        });

        setShowEventModal(false);
        setNewEvent({
          title: "",
          description: "",
          start: null,
          end: null,
          location: "",
        });

        // Reload events after successful creation
        await loadEvents();
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: response.error || "Failed to create event",
          life: 3000,
        });
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "An unexpected error occurred",
        life: 3000,
      });
    }
  };

  const renderEventModal = () => {
    return (
      <Dialog
        visible={showEventModal}
        onHide={() => setShowEventModal(false)}
        header="Add New Event"
        className="event-modal"
        style={{ width: "500px" }}
      >
        <div className="event-form p-fluid">
          <div className="field">
            <label htmlFor="title">Title *</label>
            <InputText
              id="title"
              value={newEvent.title}
              onChange={(e) =>
                setNewEvent({ ...newEvent, title: e.target.value })
              }
              placeholder="Enter event title"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="description">Description</label>
            <InputTextarea
              id="description"
              value={newEvent.description}
              onChange={(e) =>
                setNewEvent({ ...newEvent, description: e.target.value })
              }
              rows={3}
              placeholder="Enter event description"
            />
          </div>

          <div className="field">
            <label htmlFor="start">Start Date & Time *</label>
            <PrimeCalendar
              id="start"
              value={newEvent.start}
              onChange={(e) => setNewEvent({ ...newEvent, start: e.value })}
              showTime
              showSeconds={false}
              placeholder="Select start date and time"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="end">End Date & Time</label>
            <PrimeCalendar
              id="end"
              value={newEvent.end}
              onChange={(e) => setNewEvent({ ...newEvent, end: e.value })}
              showTime
              showSeconds={false}
              placeholder="Select end date and time"
              minDate={newEvent.start}
            />
          </div>

          <div className="field">
            <label htmlFor="location">Location</label>
            <Dropdown
              id="location"
              value={newEvent.location}
              options={locationOptions}
              onChange={(e) => setNewEvent({ ...newEvent, location: e.value })}
              placeholder="Select location type"
            />
          </div>

          <div className="field flex justify-content-end gap-2">
            <Button
              label="Cancel"
              icon="pi pi-times"
              className="p-button-text"
              onClick={() => setShowEventModal(false)}
            />
            <Button label="Save" icon="pi pi-check" onClick={handleSaveEvent} />
          </div>
        </div>
      </Dialog>
    );
  };

  // Add this helper function to get events for a specific day
  const getEventsForDay = (day) => {
    if (!calendarEvents?.data) return [];

    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );

    return calendarEvents.data.filter((event) => {
      const eventDate = new Date(event.start);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Add this helper function after getEventsForDay
  const getUniqueEventTypes = () => {
    if (!calendarEvents?.data) return [];

    // Get unique event types from the events data
    const types = new Set(
      calendarEvents.data.map((event) => event.type || "other")
    );
    return Array.from(types);
  };

  // Update the click handler for calendar days
  const handleDayClick = (day) => {
    setSelectedDay(day);
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    const dayEvents = getEventsForDay(day);
    setSelectedDateEvents(dayEvents);
    setSelectedModalDate(date);
    setShowDayEventsModal(true);
  };

  const handleEventUpdate = async (event) => {
    setSelectedEvent({ ...event });
    setShowUpdateEventModal(true);
  };

  const handleEventDelete = async (event) => {
    setSelectedEvent({ ...event });
    setShowDeleteEventModal(true);
  };

  const handleAddGuest = (event) => {
    setSelectedEvent({...event});
    setShowAddGuestModal(true);
  };
  
  const addEmailField = () => {
    setGuestEmails([...guestEmails, '']);
  };
  
  const removeEmailField = (index) => {
    const newEmails = guestEmails.filter((_, i) => i !== index);
    setGuestEmails(newEmails);
  };
  
  const handleEmailChange = (index, value) => {
    const newEmails = [...guestEmails];
    newEmails[index] = value;
    setGuestEmails(newEmails);
  };
  
  const handleInviteGuests = async () => {
    try {
      // Filter out empty emails
      const validEmails = guestEmails.filter(email => email.trim() !== '');
      
      if (validEmails.length === 0) {
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Please enter at least one email address',
        });
        return;
      }
      
      // Call API to send invites
      const result = await inviteGuests(selectedEvent._id, validEmails);
      
      if (result.success) {
        toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: result.message || 'Invitations sent successfully',
        });
        
        setShowAddGuestModal(false);
        setGuestEmails(['']); // Reset the email list
        loadEvents(); // Refresh events to show updated guest list
      } else {
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: result.error || 'Failed to send invitations',
        });
      }
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'An error occurred while sending invitations',
      });
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="flex align-items-center justify-content-between sub-header-panel">
        <div className="sub-header-left sub-header-left-with-arrow">
          <div className="content">
            <h3>Calendar</h3>
          </div>
        </div>
      </div>

      {renderMobileViewToggle()}

      <div
        className="widget-container"
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: "20px",
        }}
      >
        <div
          className="event-container-display"
          style={{
            flex: isMobile ? "auto" : "0 0 350px",
            display: isMobile && activeView !== "events" ? "none" : "block",
            background: "#FFFFFF",
            borderRadius: "10px",
            padding: "20px",
            boxShadow: "1px 1px 1px #0000001A",
            marginBottom: "20px",
          }}
        >
          <div className="new_event" style={{ marginBottom: "20px" }}>
            <button
              onClick={handleAddNewEvent}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                padding: "12px",
                background: "#0387D9",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: 500,
                marginBottom: "20px",
              }}
            >
              <img
                src={plus}
                alt="plus"
                style={{ marginRight: "8px", width: "16px", height: "16px" }}
              />
              Add New Event
            </button>
            <h3 style={{ fontSize: "18px", margin: "0 0 15px 0" }}>
              You Are Going To
            </h3>
          </div>

          {isLoading ? (
            <div>Loading events...</div>
          ) : !calendarEvents?.data?.length ? (
            <div>No events found</div>
          ) : (
            <>
              {/* Show only first 2 events */}
              {calendarEvents.data.slice(0, 2).map((event, index) => (
                <React.Fragment key={event._id}>
                  {index > 0 && (
                    <div
                      className="event-divider"
                      style={{
                        height: "1px",
                        background: "#E4E7EC",
                        margin: "10px 0",
                      }}
                    ></div>
                  )}
                  <EventCard
                    title={event.title}
                    start={event.start}
                    location={event.location}
                    description={event.description}
                    event={event}
                    onUpdate={handleEventUpdate}
                    onDelete={handleEventDelete}
                    onAddGuest={handleAddGuest}
                  />
                </React.Fragment>
              ))}

              {/* Show See More button if there are more than 2 events */}
              {calendarEvents.data.length > 2 && (
                <div
                  className="see-more-container"
                  style={{ marginTop: "20px", textAlign: "center" }}
                >
                  <button
                    className="see-more-button"
                    onClick={handleSeeMore}
                    style={{
                      width: "100%",
                      padding: "12px",
                      background: "transparent",
                      color: "#0387D9",
                      border: "1px solid #0387D9",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: 500,
                    }}
                  >
                    See More Events
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <div
          style={{
            flex: 1,
            background: "#FFFFFF",
            borderRadius: "10px",
            padding: "20px",
            boxShadow: "1px 1px 1px #0000001A",
            display: isMobile && activeView !== "calendar" ? "none" : "block",
          }}
        >
          <h3 style={{ fontSize: "18px", margin: "0 0 15px 0" }}>Calendar</h3>

          {/* Large Calendar Component */}
          <div
            style={{
              width: "100%",
              height: isMobile ? "450px" : "600px",
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
                flexWrap: isMobile ? "wrap" : "nowrap",
                gap: isMobile ? "10px" : "0",
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: isMobile ? "16px" : "20px",
                    margin: 0,
                    color: "#344054",
                  }}
                >
                  {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  width: isMobile ? "100%" : "auto",
                  justifyContent: isMobile ? "space-between" : "flex-end",
                  marginTop: isMobile ? "10px" : "0",
                }}
              >
                <button
                  onClick={goToPreviousMonth}
                  style={{
                    background: "#F9FAFB",
                    border: "1px solid #E4E7EC",
                    color: "#344054",
                    padding: isMobile ? "6px 12px" : "8px 16px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: isMobile ? "12px" : "14px",
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
                    padding: isMobile ? "6px 12px" : "8px 16px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: isMobile ? "12px" : "14px",
                    flex: isMobile ? "1" : "none",
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
                    padding: isMobile ? "6px 12px" : "8px 16px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: isMobile ? "12px" : "14px",
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
                fontSize: isMobile ? "12px" : "14px",
              }}
            >
              {/* Weekday Headers */}
              {daysOfWeek.map((day, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: "#F9FAFB",
                    padding: isMobile ? "5px 2px" : "10px",
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
                    padding: isMobile ? "4px 2px" : "8px",
                    position: "relative",
                    cursor: "pointer",
                    fontSize: isMobile ? "11px" : "inherit",
                  }}
                >
                  <span
                    style={{
                      color: "#98A2B3",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: isMobile ? "20px" : "28px",
                      height: isMobile ? "20px" : "28px",
                      borderRadius: "50%",
                      fontWeight: 500,
                    }}
                  >
                    {day}
                  </span>
                </div>
              ))}

              {/* Current Month Days */}
              {currentMonthDays.map((day) => {
                const dayEvents = getEventsForDay(day);

                return (
                  <div
                    key={`current-${day}`}
                    style={{
                      backgroundColor: "white",
                      padding: isMobile ? "4px 2px" : "8px",
                      position: "relative",
                      cursor: "pointer",
                      border:
                        day === selectedDay ? "1px solid #0387D9" : "none",
                      backgroundColor:
                        day === selectedDay
                          ? "rgba(3, 135, 217, 0.1)"
                          : "white",
                      fontSize: isMobile ? "11px" : "inherit",
                      overflow: "hidden",
                    }}
                    onClick={() => handleDayClick(day)}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: isMobile ? "20px" : "28px",
                        height: isMobile ? "20px" : "28px",
                        borderRadius: "50%",
                        fontWeight: 500,
                        backgroundColor: isToday(day)
                          ? "#0387D9"
                          : "transparent",
                        color: isToday(day) ? "white" : "inherit",
                      }}
                    >
                      {day}
                    </span>

                    {/* Show actual events instead of static ones */}
                    {!isMobile &&
                      dayEvents.map((event, index) => (
                        <div
                          key={event._id}
                          style={{ marginTop: index === 0 ? "5px" : "2px" }}
                        >
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
                              backgroundColor:
                                event.type === "meeting"
                                  ? "#0387D9"
                                  : event.type === "presentation"
                                  ? "#7F56D9"
                                  : event.type === "workshop"
                                  ? "#F79009"
                                  : "#F04438",
                            }}
                          >
                            {event.title}
                          </div>
                        </div>
                      ))}

                    {/* For mobile, just show a dot if there are events */}
                    {isMobile && dayEvents.length > 0 && (
                      <div
                        style={{
                          width: "4px",
                          height: "4px",
                          borderRadius: "50%",
                          backgroundColor: "#0387D9",
                          margin: "2px auto 0",
                        }}
                      ></div>
                    )}
                  </div>
                );
              })}

              {/* Next Month Days */}
              {nextMonthDays.map((day, index) => (
                <div
                  key={`next-${index}`}
                  style={{
                    backgroundColor: "#F2F4F7",
                    padding: isMobile ? "4px 2px" : "8px",
                    position: "relative",
                    cursor: "pointer",
                    fontSize: isMobile ? "11px" : "inherit",
                  }}
                >
                  <span
                    style={{
                      color: "#98A2B3",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: isMobile ? "20px" : "28px",
                      height: isMobile ? "20px" : "28px",
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
              <div
                style={{
                  display: "flex",
                  gap: isMobile ? "10px" : "15px",
                  flexWrap: "wrap",
                  justifyContent: isMobile ? "center" : "flex-start",
                }}
              >
                {getUniqueEventTypes().map((type) => (
                  <div
                    key={type}
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
                        backgroundColor:
                          type === "meeting"
                            ? "#0387D9"
                            : type === "presentation"
                            ? "#7F56D9"
                            : type === "workshop"
                            ? "#F79009"
                            : "#F04438",
                      }}
                    ></span>
                    <span style={{ textTransform: "capitalize" }}>{type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {renderEventModal()}

      <DayEventsModal
        visible={showDayEventsModal}
        onHide={() => setShowDayEventsModal(false)}
        events={selectedDateEvents}
        selectedDate={selectedModalDate}
      />

      <AllEventsModal
        visible={showAllEventsModal}
        onHide={() => setShowAllEventsModal(false)}
        events={calendarEvents?.data || []}
        onEventUpdate={loadEvents}
        onAddGuest={handleAddGuest}
      />

      {/* Add the Update and Delete Modals */}
      <Dialog
        visible={showUpdateEventModal}
        onHide={() => {
          setShowUpdateEventModal(false);
          setSelectedEvent(null);
        }}
        header="Update Event"
        style={{ width: "500px" }}
      >
        {selectedEvent && (
          <div className="update-event-form">
            <div className="field">
              <label>Title</label>
              <InputText
                value={selectedEvent.title}
                onChange={(e) =>
                  setSelectedEvent({ ...selectedEvent, title: e.target.value })
                }
                className="w-full"
              />
            </div>
            <div className="field">
              <label>Location</label>
              <InputText
                value={selectedEvent.location}
                onChange={(e) =>
                  setSelectedEvent({
                    ...selectedEvent,
                    location: e.target.value,
                  })
                }
                className="w-full"
              />
            </div>
            <div className="field">
              <label>Description</label>
              <InputTextarea
                value={selectedEvent.description}
                onChange={(e) =>
                  setSelectedEvent({
                    ...selectedEvent,
                    description: e.target.value,
                  })
                }
                rows={3}
                className="w-full"
              />
            </div>
            <div className="field">
              <label>Start Date</label>
              <Calendar
                value={new Date(selectedEvent.start)}
                onChange={(e) =>
                  setSelectedEvent({ ...selectedEvent, start: e.value })
                }
                showTime
                className="w-full"
              />
            </div>
            <div className="field">
              <label>End Date</label>
              <Calendar
                value={new Date(selectedEvent.end)}
                onChange={(e) =>
                  setSelectedEvent({ ...selectedEvent, end: e.value })
                }
                showTime
                className="w-full"
              />
            </div>
            <div className="field">
              <label>Current Guests</label>
              <div className="current-guests" style={{ 
                padding: "10px", 
                backgroundColor: "#f8f9fa", 
                borderRadius: "4px",
                marginBottom: "15px" 
              }}>
                {selectedEvent.guestEmails && selectedEvent.guestEmails.map((email, idx) => (
                  <div key={`email-${idx}`} style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "5px"
                  }}>
                    <i className="pi pi-envelope" style={{ 
                      marginRight: "8px", 
                      color: "#667085",
                      fontSize: "12px" 
                    }}></i>
                    <span style={{ fontSize: "13px", color: "#475467" }}>{email}</span>
                  </div>
                ))}
                
                {selectedEvent.guests && selectedEvent.guests.map((guest, idx) => (
                  <div key={`guest-${idx}`} style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "5px"
                  }}>
                    <i className="pi pi-user" style={{ 
                      marginRight: "8px", 
                      color: "#667085",
                      fontSize: "12px" 
                    }}></i>
                    <span style={{ fontSize: "13px", color: "#475467" }}>
                      {guest.email || guest.name || `Guest ${idx + 1}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "0.5rem",
                marginTop: "1rem",
              }}
            >
              <Button
                label="Cancel"
                onClick={() => setShowUpdateEventModal(false)}
                className="p-button-text"
              />
              <Button
                label="Update"
                onClick={async () => {
                  const result = await updateEvent(
                    selectedEvent._id,
                    selectedEvent
                  );
                  if (result.success) {
                    toast.current.show({
                      severity: "success",
                      summary: "Success",
                      detail: "Event updated successfully",
                    });
                    setShowUpdateEventModal(false);
                    loadEvents();
                  } else {
                    toast.current.show({
                      severity: "error",
                      summary: "Error",
                      detail: result.error || "Failed to update event",
                    });
                  }
                }}
              />
            </div>
          </div>
        )}
      </Dialog>

      <Dialog
        visible={showDeleteEventModal}
        onHide={() => setShowDeleteEventModal(false)}
        header="Confirm Delete"
        style={{ width: "400px" }}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle"
            style={{ fontSize: "2rem", color: "#ff9800", marginRight: "10px" }}
          />
          <span>Are you sure you want to delete this event?</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.5rem",
            marginTop: "1rem",
          }}
        >
          <Button
            label="No"
            onClick={() => setShowDeleteEventModal(false)}
            className="p-button-text"
          />
          <Button
            label="Yes"
            onClick={async () => {
              const result = await deleteEvent(selectedEvent._id);
              if (result.success) {
                toast.current.show({
                  severity: "success",
                  summary: "Success",
                  detail: "Event deleted successfully",
                });
                setShowDeleteEventModal(false);
                loadEvents();
              } else {
                toast.current.show({
                  severity: "error",
                  summary: "Error",
                  detail: result.error || "Failed to delete event",
                });
              }
            }}
            className="p-button-danger"
          />
        </div>
      </Dialog>

      <Dialog
        visible={showAddGuestModal}
        onHide={() => {
          setShowAddGuestModal(false);
          setGuestEmails(['']);
        }}
        header="Add Guests"
        style={{ width: '500px' }}
      >
        <div className="add-guest-form">
          {guestEmails.map((email, index) => (
            <div key={index} className="email-input-container" style={{ 
              display: 'flex', 
              gap: '10px', 
              marginBottom: '10px',
              alignItems: 'center'
            }}>
              <InputText
                value={email}
                onChange={(e) => handleEmailChange(index, e.target.value)}
                placeholder="Enter guest email"
                className="w-full"
                style={{ flex: 1 }}
              />
              {guestEmails.length > 1 && (
                <Button
                  icon="pi pi-times"
                  onClick={() => removeEmailField(index)}
                  className="p-button-rounded p-button-danger p-button-text"
                />
              )}
            </div>
          ))}
          
          <Button
            label="Add Another Guest"
            icon="pi pi-plus"
            onClick={addEmailField}
            className="p-button-text"
            style={{ marginBottom: '20px' }}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <Button
              label="Cancel"
              onClick={() => {
                setShowAddGuestModal(false);
                setGuestEmails(['']);
              }}
              className="p-button-text"
            />
            <Button
              label="Send Invites"
              onClick={handleInviteGuests}
              disabled={guestEmails.every(email => email.trim() === '')}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
}
