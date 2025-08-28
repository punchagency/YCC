import React, { useState, useEffect, useRef, useCallback } from "react";
import { Dialog as PrimeDialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import plus from "../../../assets/images/crew/plus.png";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { EventCard } from "./components/EventCard";
import { AllEventsModal } from "./components/AllEventsModal";
import { DayEventsModal } from "./components/DayEventsModal";
import three from "../../../assets/images/crew/three.png";
import {
  createEvent,
  fetchEvents,
  updateEvent,
  deleteEvent,
  inviteGuests,
} from "../../../services/calendar/calendarService";
import { Calendar } from "primereact/calendar";
import { useOutletContext } from "react-router-dom";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";






export default function CrewCalendarPage() {
  const { setPageTitle } = useOutletContext() || {};
  useEffect(() => {
    if (setPageTitle) setPageTitle("Calendar");
  }, [setPageTitle]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeView, setActiveView] = useState("events");
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
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
  const [guestEmails, setGuestEmails] = useState([""]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [dragOverDay, setDragOverDay] = useState(null);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");


  // Success animation component
  const SuccessAnimation = ({ message, visible, onComplete }) => {
    useEffect(() => {
      if (visible) {
        const timer = setTimeout(() => {
          onComplete();
        }, 2000);
        return () => clearTimeout(timer);
      }
    }, [visible, onComplete]);

    if (!visible) return null;

    return (
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#4CAF50",
          color: "white",
          padding: "20px 30px",
          borderRadius: "10px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          zIndex: 9999,
          animation: "slideInOut 2s ease-in-out",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <i className="pi pi-check-circle" style={{ fontSize: "24px" }}></i>
        <span style={{ fontSize: "16px", fontWeight: "500" }}>{message}</span>
        <style>
          {`
            @keyframes slideInOut {
              0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
              20% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
              80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
              100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            }
          `}
        </style>
      </div>
    );
  };

  // Loading spinner component
  const LoadingSpinner = ({ size = "medium" }) => {
    const sizeMap = {
      small: "16px",
      medium: "24px",
      large: "32px",
    };

    return (
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: sizeMap[size],
          height: sizeMap[size],
        }}
      >
        <i
          className="pi pi-spin pi-spinner"
          style={{
            fontSize: sizeMap[size],
            color: "#0387D9",
          }}
        ></i>
      </div>
    );
  };

  // Enhanced calendar day component with drag and drop hints
  const CalendarDay = ({
    day,
    events,
    isCurrentMonth,
    isToday,
    onClick,
    onDragOver,
    onDrop,
  }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDragOver = (e) => {
      e.preventDefault();
      setIsDragOver(true);
      onDragOver?.(day);
    };

    const handleDragLeave = () => {
      setIsDragOver(false);
    };

    const handleDrop = (e) => {
      e.preventDefault();
      setIsDragOver(false);
      onDrop?.(day, e);
    };

    return (
      <div
        className={`calendar-day ${isCurrentMonth ? "current-month" : "other-month"
          } ${isToday ? "today" : ""} ${isDragOver ? "drag-over" : ""}`}
        onClick={() => onClick(day)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          position: "relative",
          minHeight: "120px",
          padding: "8px",
          border: "1px solid #e0e0e0",
          cursor: "pointer",
          transition: "all 0.3s ease",
          backgroundColor: isDragOver
            ? "#e3f2fd"
            : isHovered
              ? "#f5f5f5"
              : "transparent",
          transform: isHovered ? "scale(1.02)" : "scale(1)",
          boxShadow: isHovered ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
          borderRadius: "8px",
          borderColor: isDragOver ? "#0387D9" : "#e0e0e0",
        }}
      >
        <div
          style={{
            fontWeight: isToday ? "bold" : "normal",
            color: isCurrentMonth ? "#333" : "#ccc",
            fontSize: "14px",
            marginBottom: "5px",
            transition: "color 0.3s ease",
          }}
        >
          {day.getDate()}
        </div>

        {events.length > 0 && (
          <div style={{ marginTop: "5px" }}>
            {events.slice(0, 2).map((event, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: "#0387D9",
                  color: "white",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontSize: "10px",
                  marginBottom: "2px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  transition: "all 0.3s ease",
                  transform: isHovered ? "scale(1.05)" : "scale(1)",
                }}
                title={event.title}
              >
                {event.title}
              </div>
            ))}
            {events.length > 2 && (
              <div
                style={{
                  color: "#0387D9",
                  fontSize: "10px",
                  fontWeight: "bold",
                  textAlign: "center",
                  transition: "color 0.3s ease",
                }}
              >
                +{events.length - 2} more
              </div>
            )}
          </div>
        )}

        {/* Drag and drop hint */}
        {isDragOver && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "rgba(3, 135, 217, 0.9)",
              color: "white",
              padding: "8px 12px",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: "bold",
              zIndex: 10,
              animation: "pulse 1s infinite",
            }}
          >
            Drop here
            <style>
              {`
                @keyframes pulse {
                  0% { opacity: 0.7; transform: translate(-50%, -50%) scale(1); }
                  50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
                  100% { opacity: 0.7; transform: translate(-50%, -50%) scale(1); }
                }
              `}
            </style>
          </div>
        )}
      </div>
    );
  };

  // Clean up function for modals
  const cleanupModals = () => {
    setShowEventModal(false);
    setShowDayEventsModal(false);
    setShowAllEventsModal(false);
    setShowUpdateEventModal(false);
    setShowDeleteEventModal(false);
    setShowAddGuestModal(false);
    setSelectedEvent(null);
    setSelectedDateEvents([]);
    setSelectedModalDate(null);
  };

  // Safe modal hide handlers
  const handleDayEventsModalHide = () => {
    setShowDayEventsModal(false);
    setSelectedDateEvents([]);
    setSelectedModalDate(null);
  };

  const handleAllEventsModalHide = () => {
    setShowAllEventsModal(false);
  };


  const handleUpdateEventModalHide = () => {
    setShowUpdateEventModal(false);
    setSelectedEvent(null);
  };

  const handleDeleteEventModalHide = () => {
    setShowDeleteEventModal(false);
    setSelectedEvent(null);
  };

  const handleAddGuestModalHide = () => {
    setShowAddGuestModal(false);
    setSelectedEvent(null);
    setGuestEmails([""]);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupModals();
    };
  }, []);

  const loadEvents = useCallback(async () => {
    setLoading(true);
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
      if (response.success) {
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
    } finally {
      setLoading(false);
    }
  }, [currentDate]);

  useEffect(() => {
    loadEvents();

    // Fallback: ensure loading is set to false after 10 seconds
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 10000);

    return () => clearTimeout(timeout);
  }, [currentDate, loadEvents]);

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
          width: "97%",
          marginLeft: "5px",
          marginRight: "5px",
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
            // marginLeft:"5px"
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
            // marginRight: "5px",
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

    setSaving(true);
    try {
      const response = await createEvent(newEvent);

      if (response.success) {
        // Show success animation
        setSuccessMessage("Event created successfully!");
        setShowSuccessAnimation(true);

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
    } finally {
      setSaving(false);
    }
  };

  const renderEventModal = () => {
    return (
      <PrimeDialog
        visible={showEventModal}
        onHide={() => setShowEventModal(false)}
        header="Add New Event"
        className="event-modal"
        style={{ width: "500px" }}
        maskClosable={true}
        closable={true}
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
            <Calendar
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
            <Calendar
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
            <Button
              label={saving ? "Saving..." : "Save"}
              icon={saving ? null : "pi pi-check"}
              onClick={handleSaveEvent}
              disabled={saving}
              loading={saving}
            />
          </div>
        </div>
      </PrimeDialog>
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
    const eventCopy = { ...event };
    setSelectedEvent(eventCopy);
    setShowUpdateEventModal(true);
  };

  const handleEventDelete = async (event) => {
    setSelectedEvent({ ...event });
    setShowDeleteEventModal(true);
  };

  const handleAddGuest = (event) => {
    setSelectedEvent({ ...event });
    setShowAddGuestModal(true);
  };

  const addEmailField = () => {
    setGuestEmails([...guestEmails, ""]);
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
      const validEmails = guestEmails.filter((email) => email.trim() !== "");

      if (validEmails.length === 0) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Please enter at least one email address",
        });
        return;
      }

      setInviting(true);
      // Call API to send invites
      const result = await inviteGuests(selectedEvent._id, validEmails);

      if (result.success) {
        // Show success animation
        setSuccessMessage("Invitations sent successfully!");
        setShowSuccessAnimation(true);

        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: result.message || "Invitations sent successfully",
        });

        setShowAddGuestModal(false);
        setGuestEmails([""]); // Reset the email list
        loadEvents(); // Refresh events to show updated guest list
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: result.error || "Failed to send invitations",
        });
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "An error occurred while sending invitations",
      });
    } finally {
      setInviting(false);
    }
  };

  // Confirm update event from main modal
  const handleUpdateEventConfirm = async () => {
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
        setSelectedEvent(null);
        await loadEvents();
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

  // Confirm delete event from main modal
  const handleDeleteEventConfirm = async () => {
    setDeleting(true);
    try {
      const result = await deleteEvent(selectedEvent._id);
      if (result.success) {
        // Show success animation
        setSuccessMessage("Event deleted successfully!");
        setShowSuccessAnimation(true);

        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Event deleted successfully",
        });
        setShowDeleteEventModal(false);
        setSelectedEvent(null);
        // Close the parent modal (DayEventsModal or AllEventsModal)
        setShowDayEventsModal(false);
        setShowAllEventsModal(false);
        await loadEvents();
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
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      style={{
        background: "#F8FBFF",
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        maxWidth: "100%",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
        overflowY: "hidden",
      }}
    >
      <Toast ref={toast} />

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          margin: "20px 20px 0 20px",
        }}
      >
        <Button
          label="Add Event"
          className="p-button-primary"
          icon="pi pi-plus"
          onClick={() => setShowEventModal(true)}
          style={{
            transition: "all 0.3s ease",
            transform: "scale(1)",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.05)";
            e.target.style.boxShadow = "0 4px 12px rgba(3, 135, 217, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = "none";
          }}
        />
      </div>

      {renderMobileViewToggle()}

      <div
        className="widget-container"
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: "20px",
          padding: "0 20px 20px 20px",
          overflowY: "auto",
          flex: 1,
          "&::-webkit-scrollbar": {
            width: "0px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "transparent",
          },
          msOverflowStyle: "none",
          scrollbarWidth: "none",
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
            {/* <h3 style={{ fontSize: "18px", margin: "0 0 15px 0" }}>
              You Are Going To
            </h3> */}
          </div>

          {loading ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px",
                color: "#666",
              }}
            >
              <LoadingSpinner size="large" />
              <span style={{ marginLeft: "10px" }}>Loading events...</span>
            </div>
          ) : !calendarEvents?.data?.length ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px",
                color: "#666",
                fontStyle: "italic",
              }}
            >
              No events found. Create your first event!
            </div>
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

              {/* Upcoming Reminders: show the three soonest upcoming events */}
              <div>
                <h4>Upcoming Reminders</h4>
                <div>
                  {calendarEvents?.data &&
                    calendarEvents.data.length > 0 &&
                    calendarEvents.data
                      .filter((event) => new Date(event.start) > new Date())
                      .sort((a, b) => new Date(a.start) - new Date(b.start))
                      .slice(0, 3)
                      .map((event, idx) => (
                        <div
                          key={event._id || idx}
                          className="flex items-center justify-between bg-#FFFFFF-500 p-2 mb-2"
                          style={{
                            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <div className="flex items-center justify-center">
                            <div>
                              <h3 className="text-2xl font-bold">
                                {new Date(event.start).getDate()}
                              </h3>
                            </div>
                            <div className="mt-3 ml-3">
                              <p>
                                {new Date(event.start).toLocaleDateString(
                                  undefined,
                                  {
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </p>
                              <p>{event.title}</p>
                            </div>
                          </div>
                          <div className="mt-3">
                            <div className="flex items-center justify-flex-end">
                              <img
                                src={three}
                                alt="menu"
                                style={{
                                  cursor: "pointer",
                                  marginBottom: "10px",
                                  marginLeft: "55px",
                                }}
                              />
                            </div>
                            <span>
                              <span>
                                {new Date(event.start).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </span>
                          </div>
                        </div>
                      ))}
                </div>
              </div>

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
              {prevMonthDays.map((day, index) => {
                const prevMonthDate = new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth() - 1,
                  day
                );
                return (
                  <CalendarDay
                    key={`prev-${index}`}
                    day={prevMonthDate}
                    events={[]}
                    isCurrentMonth={false}
                    isToday={false}
                    onClick={() => { }}
                  />
                );
              })}

              {/* Current Month Days */}
              {currentMonthDays.map((day) => {
                const currentMonthDate = new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  day
                );
                const dayEvents = getEventsForDay(day);

                return (
                  <CalendarDay
                    key={`current-${day}`}
                    day={currentMonthDate}
                    events={dayEvents}
                    isCurrentMonth={true}
                    isToday={isToday(day)}
                    onClick={() => handleDayClick(day)}
                    onDragOver={(day) => setDragOverDay(day)}
                    onDrop={(day, e) => {
                      // Handle drag and drop functionality here
                    }}
                  />
                );
              })}

              {/* Next Month Days */}
              {nextMonthDays.map((day, index) => {
                const nextMonthDate = new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth() + 1,
                  day
                );
                return (
                  <CalendarDay
                    key={`next-${index}`}
                    day={nextMonthDate}
                    events={[]}
                    isCurrentMonth={false}
                    isToday={false}
                    onClick={() => { }}
                  />
                );
              })}
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
        onHide={handleDayEventsModalHide}
        events={selectedDateEvents}
        selectedDate={selectedModalDate}
        onUpdate={handleEventUpdate}
        onDelete={handleEventDelete}
        onAddGuest={handleAddGuest}
      />

      <AllEventsModal
        visible={showAllEventsModal}
        onHide={handleAllEventsModalHide}
        events={calendarEvents?.data || []}
        onEventUpdate={loadEvents}
        onAddGuest={handleAddGuest}
      />

      {/* Add the Update and Delete Modals */}
      <Dialog
        open={showUpdateEventModal && Boolean(selectedEvent)}
        onClose={handleUpdateEventModalHide}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Event</DialogTitle>
        <DialogContent>
          <div className="update-event-form">
            <div className="field">
              <label>Title</label>
              <InputText
                value={selectedEvent?.title}
                onChange={(e) =>
                  setSelectedEvent({ ...selectedEvent, title: e.target.value })
                }
                className="w-full"
              />
            </div>
            <div className="field">
              <label>Location</label>
              <InputText
                value={selectedEvent?.location}
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
                value={selectedEvent?.description}
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
                value={new Date(selectedEvent?.start)}
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
                value={new Date(selectedEvent?.end)}
                onChange={(e) =>
                  setSelectedEvent({ ...selectedEvent, end: e.value })
                }
                showTime
                className="w-full"
              />
            </div>
            <div className="field">
              <label>Current Guests</label>
              <div
                className="current-guests"
                style={{
                  padding: "10px",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "4px",
                  marginBottom: "15px",
                }}
              >
                {selectedEvent?.guestEmails &&
                  selectedEvent?.guestEmails?.map((email, idx) => (
                    <div
                      key={`email-${idx}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "5px",
                      }}
                    >
                      <i
                        className="pi pi-envelope"
                        style={{
                          marginRight: "8px",
                          color: "#667085",
                          fontSize: "12px",
                        }}
                      ></i>
                      <span style={{ fontSize: "13px", color: "#475467" }}>
                        {email}
                      </span>
                    </div>
                  ))}

                {selectedEvent?.guests &&
                  selectedEvent.guests.map((guest, idx) => (
                    <div
                      key={`guest-${idx}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "5px",
                      }}
                    >
                      <i
                        className="pi pi-user"
                        style={{
                          marginRight: "8px",
                          color: "#667085",
                          fontSize: "12px",
                        }}
                      ></i>
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
                label={saving ? "Updating..." : "Update"}
                icon={saving ? null : "pi pi-check"}
                onClick={handleUpdateEventConfirm}
                disabled={saving}
                loading={saving}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showDeleteEventModal}
        onClose={handleDeleteEventModalHide}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
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
              label={deleting ? "Deleting..." : "Yes"}
              icon={deleting ? null : "pi pi-trash"}
              onClick={handleDeleteEventConfirm}
              className="p-button-danger"
              disabled={deleting}
              loading={deleting}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showAddGuestModal}
        onClose={handleAddGuestModalHide}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Guests</DialogTitle>
        <DialogContent>
          <div className="add-guest-form">
            {guestEmails.map((email, index) => (
              <div
                key={index}
                className="email-input-container"
                style={{
                  display: "flex",
                  gap: "10px",
                  marginBottom: "10px",
                  alignItems: "center",
                }}
              >
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
              style={{ marginBottom: "20px" }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "0.5rem",
              }}
            >
              <Button
                label="Cancel"
                onClick={() => {
                  setShowAddGuestModal(false);
                  setGuestEmails([""]);
                }}
                className="p-button-text"
              />
              <Button
                label={inviting ? "Sending..." : "Send Invites"}
                icon={inviting ? null : "pi pi-send"}
                onClick={handleInviteGuests}
                disabled={
                  guestEmails.every((email) => email.trim() === "") || inviting
                }
                loading={inviting}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Animation */}
      {showSuccessAnimation && (
        <SuccessAnimation
          message={successMessage}
          visible={showSuccessAnimation}
          onComplete={() => setShowSuccessAnimation(false)}
        />
      )}
    </div>
  );
}
