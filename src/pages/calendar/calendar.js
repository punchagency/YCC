import React, { useState, useEffect, useRef, useCallback } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
// import { useNavigate } from "react-router-dom";
// import { TabView, TabPanel } from "primereact/tabview";
import { InputText } from "primereact/inputtext";
// import lone from "../../assets/images/crew/lone.png";
// import upcomingLogo from "../../assets/images/crew/upcomingorderLogo.png";
// import iconexpire from "../../assets/images/crew/iconexpire.png";
// import iconcareer from "../../assets/images/crew/iconcareer.png";
// import { Chart as ChartJS } from "chart.js/auto";
// import { Bar, Doughnut, Line } from "react-chartjs-2";
// import sourceData from "../../data/sourceData.json";
// import analyticsData from "../../data/analyticsData.json";
// import sort from "../../assets/images/crew/sort.png";
// import editLogo from "../../assets/images/crew/editLogo.png";
// import deleteLogo from "../../assets/images/crew/deleteLogo.png";
import plus from "../../assets/images/crew/plus.png";
import profilenoti from "../../assets/images/crew/profilenoti.png";
// import man1 from "../../assets/images/crew/Man1.png";
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
  inviteGuests,
} from "../../services/calendar/calendarService";
import { Calendar } from "primereact/calendar";
// import more from "../../assets/images/crew/more.png";
import { useOutletContext } from "react-router-dom";
import {
  Dialog as MUIDialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  IconButton,
  Button as MUIButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Close as CloseIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Send as SendIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  PersonAdd as PersonAddIcon,
  Event as EventIcon,
} from "@mui/icons-material";
import { Slide } from "@mui/material";

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
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUpdate = () => {
    onUpdate(event);
    handleClose();
  };

  const handleDelete = () => {
    onDelete(event);
    handleClose();
  };

  const handleAddGuest = () => {
    onAddGuest(event);
    handleClose();
  };

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
      style={{
        display: "flex",
        alignItems: "flex-start",
        padding: "10px 0",
        boxShadow: "0 4px 16px rgba(3,135,217,0.08)",
        borderRadius: "14px",
        padding: "18px 20px",
        marginBottom: "18px",
        background: "#fff",
        transition: "box-shadow 0.2s, transform 0.2s",
        ":hover": {
          boxShadow: "0 8px 24px rgba(3,135,217,0.13)",
          transform: "translateY(-2px) scale(1.01)",
        },
      }}
    >
      <div style={{ marginRight: "12px" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: "#F0F4FF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #E4E7EC",
          }}
        >
          <EventIcon
            style={{
              color: "#0387D9",
              fontSize: "20px",
            }}
          />
        </div>
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "5px",
                color: "#0387D9",
                fontSize: "12px",
              }}
            >
              <i className="pi pi-users" style={{ marginRight: "5px" }}></i>
              <span>
                {getGuestCount(event)}{" "}
                {getGuestCount(event) === 1 ? "guest" : "guests"}
              </span>
            </div>
          )}
        </div>
        <div className="event-actions">
          <div
            style={{
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              cursor: "pointer",
              transition: "background-color 0.2s ease",
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(3, 135, 217, 0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <MoreVertIcon
              fontSize="small"
              onClick={handleClick}
              style={{
                color: "#667085",
              }}
            />
          </div>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            PaperProps={{
              sx: {
                borderRadius: 2,
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                minWidth: "180px",
                mt: 1,
              },
            }}
          >
            <MenuItem
              onClick={handleUpdate}
              sx={{
                py: 1.5,
                px: 2,
                "&:hover": {
                  backgroundColor: "rgba(3, 135, 217, 0.08)",
                },
              }}
            >
              <ListItemIcon>
                <EditIcon fontSize="small" sx={{ color: "#0387D9" }} />
              </ListItemIcon>
              <ListItemText
                primary="Update Event"
                primaryTypographyProps={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#344054",
                }}
              />
            </MenuItem>
            <MenuItem
              onClick={handleDelete}
              sx={{
                py: 1.5,
                px: 2,
                "&:hover": {
                  backgroundColor: "rgba(240, 68, 56, 0.08)",
                },
              }}
            >
              <ListItemIcon>
                <DeleteIcon fontSize="small" sx={{ color: "#F04438" }} />
              </ListItemIcon>
              <ListItemText
                primary="Delete Event"
                primaryTypographyProps={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#344054",
                }}
              />
            </MenuItem>
            <MenuItem
              onClick={handleAddGuest}
              sx={{
                py: 1.5,
                px: 2,
                "&:hover": {
                  backgroundColor: "rgba(3, 135, 217, 0.08)",
                },
              }}
            >
              <ListItemIcon>
                <PersonAddIcon fontSize="small" sx={{ color: "#0387D9" }} />
              </ListItemIcon>
              <ListItemText
                primary="Add Guest"
                primaryTypographyProps={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#344054",
                }}
              />
            </MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
};

const DayEventsModal = ({ visible, onHide, events, selectedDate }) => {
  return (
    <MUIDialog
      open={visible}
      onClose={onHide}
      maxWidth="md"
      fullWidth
      TransitionComponent={Slide}
      transitionDuration={300}
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 1,
          borderBottom: "1px solid #E4E7EC",
          backgroundColor: "#F8FBFF",
          mb: 3,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#344054",
              fontSize: "1.25rem",
            }}
          >
            Events for{" "}
            {selectedDate?.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </Typography>
          <IconButton
            onClick={onHide}
            size="small"
            sx={{
              color: "#667085",
              "&:hover": {
                backgroundColor: "rgba(3, 135, 217, 0.08)",
                color: "#0387D9",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ pt: 2, pb: 2 }}>
        {events.length === 0 ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            py={4}
            textAlign="center"
          >
            <Typography
              variant="body1"
              sx={{
                color: "#667085",
                fontSize: "16px",
                fontWeight: 500,
              }}
            >
              No events scheduled for this day.
            </Typography>
          </Box>
        ) : (
          <Box display="flex" flexDirection="column" gap={3}>
            {events.map((event, index) => (
              <Box
                key={event._id}
                sx={{
                  p: 3,
                  border: "1px solid #E4E7EC",
                  borderRadius: 2,
                  backgroundColor: "#FFFFFF",
                  "&:hover": {
                    borderColor: "#0387D9",
                    boxShadow: "0 2px 8px rgba(3, 135, 217, 0.08)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: "#344054",
                    fontSize: "18px",
                    mb: 2,
                  }}
                >
                  {event.title}
                </Typography>

                <Box display="flex" flexDirection="column" gap={1.5}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <EventIcon
                      sx={{
                        fontSize: "16px",
                        color: "#667085",
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "14px",
                        color: "#475467",
                        fontWeight: 500,
                      }}
                    >
                      {new Date(event.start).toLocaleString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      })}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1}>
                    <Box
                      sx={{
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        backgroundColor: "#F0F4FF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Box
                        sx={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          backgroundColor: "#0387D9",
                        }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "14px",
                        color: "#475467",
                        fontWeight: 500,
                      }}
                    >
                      {event.location}
                    </Typography>
                  </Box>

                  {event.description && (
                    <Box
                      sx={{
                        mt: 2,
                        p: 2,
                        backgroundColor: "#F8FBFF",
                        borderRadius: 2,
                        border: "1px solid #E4E7EC",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: "14px",
                          color: "#475467",
                          lineHeight: 1.5,
                        }}
                      >
                        {event.description}
                      </Typography>
                    </Box>
                  )}

                  {(event.guests?.length > 0 ||
                    event.guestEmails?.length > 0) && (
                    <Box
                      sx={{
                        mt: 2,
                        p: 2,
                        backgroundColor: "#F9FAFB",
                        borderRadius: 2,
                        border: "1px solid #E4E7EC",
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "#344054",
                          mb: 1.5,
                        }}
                      >
                        Guests
                      </Typography>

                      <Box display="flex" flexDirection="column" gap={1}>
                        {event.guestEmails &&
                          event.guestEmails.map((email, idx) => (
                            <Box
                              key={`email-${idx}`}
                              display="flex"
                              alignItems="center"
                              gap={1}
                            >
                              <Box
                                sx={{
                                  width: "12px",
                                  height: "12px",
                                  borderRadius: "50%",
                                  backgroundColor: "#F0F4FF",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <Box
                                  sx={{
                                    width: "4px",
                                    height: "4px",
                                    borderRadius: "50%",
                                    backgroundColor: "#0387D9",
                                  }}
                                />
                              </Box>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontSize: "13px",
                                  color: "#475467",
                                }}
                              >
                                {email}
                              </Typography>
                            </Box>
                          ))}

                        {event.guests &&
                          event.guests.map((guest, idx) => (
                            <Box
                              key={`guest-${idx}`}
                              display="flex"
                              alignItems="center"
                              gap={1}
                            >
                              <Box
                                sx={{
                                  width: "12px",
                                  height: "12px",
                                  borderRadius: "50%",
                                  backgroundColor: "#F0F4FF",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <Box
                                  sx={{
                                    width: "4px",
                                    height: "4px",
                                    borderRadius: "50%",
                                    backgroundColor: "#0387D9",
                                  }}
                                />
                              </Box>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontSize: "13px",
                                  color: "#475467",
                                }}
                              >
                                {guest.email ||
                                  guest.name ||
                                  `Guest ${idx + 1}`}
                              </Typography>
                            </Box>
                          ))}
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>
    </MUIDialog>
  );
};

const AllEventsModal = ({
  visible,
  onHide,
  events,
  onEventUpdate,
  onEventDelete,
  onAddGuest,
}) => {
  return (
    <MUIDialog
      open={visible}
      onClose={onHide}
      maxWidth="md"
      fullWidth
      TransitionComponent={Slide}
      transitionDuration={300}
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 1,
          borderBottom: "1px solid #E4E7EC",
          backgroundColor: "#F8FBFF",
          mb: 3,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#344054",
              fontSize: "1.25rem",
            }}
          >
            All Events
          </Typography>
          <IconButton
            onClick={onHide}
            size="small"
            sx={{
              color: "#667085",
              "&:hover": {
                backgroundColor: "rgba(3, 135, 217, 0.08)",
                color: "#0387D9",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ pt: 2, pb: 2 }}>
        {events.length === 0 ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            py={4}
            textAlign="center"
          >
            <Typography
              variant="body1"
              sx={{
                color: "#667085",
                fontSize: "16px",
                fontWeight: 500,
              }}
            >
              No events found.
            </Typography>
          </Box>
        ) : (
          <Box display="flex" flexDirection="column" gap={2}>
            {events.map((event, index) => (
              <React.Fragment key={event._id}>
                {index > 0 && (
                  <Box
                    sx={{
                      height: "1px",
                      background: "#E4E7EC",
                      my: 2,
                    }}
                  />
                )}
                <EventCard
                  title={event.title}
                  start={event.start}
                  location={event.location}
                  description={event.description}
                  event={event}
                  onUpdate={onEventUpdate}
                  onDelete={onEventDelete}
                  onAddGuest={onAddGuest}
                />
              </React.Fragment>
            ))}
          </Box>
        )}
      </DialogContent>
    </MUIDialog>
  );
};

export default function CalendarPage() {
  const { setPageTitle } = useOutletContext() || {};
  useEffect(() => {
    if (setPageTitle) setPageTitle("Calendar");
  }, [setPageTitle]);
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
  const [guestEmails, setGuestEmails] = useState([""]);

  const loadEvents = useCallback(async () => {
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

      if (response.success) {
        // Fix: Set calendarEvents to the events array directly
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
  }, [currentDate]);

  useEffect(() => {
    loadEvents();
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
          margin: "12px 12px 16px 12px",
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid #E4E7EC",
          backgroundColor: "#FFFFFF",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
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
            borderRadius: "8px",
            transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
            boxShadow: "0 2px 8px rgba(3,135,217,0.08)",
            ":hover": {
              boxShadow: "0 4px 16px rgba(3,135,217,0.13)",
              background: "#056bb3",
            },
            ":active": { transform: "scale(0.97)" },
            ":focus": { outline: "2px solid #0387D9", outlineOffset: "2px" },
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
            borderRadius: "8px",
            transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
            boxShadow: "0 2px 8px rgba(3,135,217,0.08)",
            ":hover": {
              boxShadow: "0 4px 16px rgba(3,135,217,0.13)",
              background: "#056bb3",
            },
            ":active": { transform: "scale(0.97)" },
            ":focus": { outline: "2px solid #0387D9", outlineOffset: "2px" },
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
      <MUIDialog
        open={showEventModal}
        onClose={() => setShowEventModal(false)}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Slide}
        transitionDuration={300}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
          },
        }}
      >
        <DialogTitle
          sx={{
            pb: 1,
            borderBottom: "1px solid #E4E7EC",
            backgroundColor: "#F8FBFF",
            mb: 3,
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "#344054",
                fontSize: "1.25rem",
              }}
            >
              Add New Event
            </Typography>
            <IconButton
              onClick={() => setShowEventModal(false)}
              size="small"
              sx={{
                color: "#667085",
                "&:hover": {
                  backgroundColor: "rgba(3, 135, 217, 0.08)",
                  color: "#0387D9",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 2, pb: 2 }}>
          <Box display="flex" flexDirection="column" gap={2.5}>
            <TextField
              label="Event Title *"
              value={newEvent.title}
              onChange={(e) =>
                setNewEvent({ ...newEvent, title: e.target.value })
              }
              placeholder="Enter event title"
              fullWidth
              variant="outlined"
              size="medium"
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#0387D9",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#0387D9",
                    borderWidth: 2,
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#0387D9",
                },
              }}
            />

            <TextField
              label="Description"
              value={newEvent.description}
              onChange={(e) =>
                setNewEvent({ ...newEvent, description: e.target.value })
              }
              placeholder="Enter event description"
              fullWidth
              variant="outlined"
              size="medium"
              multiline
              rows={3}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#0387D9",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#0387D9",
                    borderWidth: 2,
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#0387D9",
                },
              }}
            />

            <Box display="flex" gap={2}>
              <TextField
                label="Start Date & Time *"
                value={
                  newEvent.start
                    ? new Date(newEvent.start).toISOString().slice(0, 16)
                    : ""
                }
                onChange={(e) =>
                  setNewEvent({ ...newEvent, start: e.target.value })
                }
                fullWidth
                type="datetime-local"
                variant="outlined"
                size="medium"
                required
                InputLabelProps={{ shrink: true }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#0387D9",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#0387D9",
                      borderWidth: 2,
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#0387D9",
                  },
                }}
              />

              <TextField
                label="End Date & Time"
                value={
                  newEvent.end
                    ? new Date(newEvent.end).toISOString().slice(0, 16)
                    : ""
                }
                onChange={(e) =>
                  setNewEvent({ ...newEvent, end: e.target.value })
                }
                fullWidth
                type="datetime-local"
                variant="outlined"
                size="medium"
                InputLabelProps={{ shrink: true }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#0387D9",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#0387D9",
                      borderWidth: 2,
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#0387D9",
                  },
                }}
              />
            </Box>

            <TextField
              select
              label="Location"
              value={newEvent.location}
              onChange={(e) =>
                setNewEvent({ ...newEvent, location: e.target.value })
              }
              fullWidth
              variant="outlined"
              size="medium"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#0387D9",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#0387D9",
                    borderWidth: 2,
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#0387D9",
                },
              }}
            >
              {locationOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1.5 }}>
          <MUIButton
            onClick={() => setShowEventModal(false)}
            variant="outlined"
            sx={{
              color: "#667085",
              borderColor: "#D0D5DD",
              borderRadius: 2,
              px: 3,
              py: 1,
              textTransform: "none",
              fontWeight: 500,
              "&:hover": {
                borderColor: "#667085",
                backgroundColor: "#F9FAFB",
              },
            }}
          >
            Cancel
          </MUIButton>
          <MUIButton
            onClick={handleSaveEvent}
            variant="contained"
            sx={{
              backgroundColor: "#0387D9",
              borderRadius: 2,
              px: 3,
              py: 1,
              textTransform: "none",
              fontWeight: 500,
              boxShadow: "0 2px 8px rgba(3, 135, 217, 0.25)",
              "&:hover": {
                backgroundColor: "#056bb3",
                boxShadow: "0 4px 16px rgba(3, 135, 217, 0.35)",
                transform: "translateY(-1px)",
              },
              "&:active": {
                transform: "translateY(0)",
              },
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            Save Event
          </MUIButton>
        </DialogActions>
      </MUIDialog>
    );
  };

  // Add this helper function to get events for a specific day
  const getEventsForDay = (day) => {
    if (!calendarEvents) return [];

    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );

    return calendarEvents.filter((event) => {
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
    if (!calendarEvents) return [];

    // Get unique event types from the events data
    const types = new Set(calendarEvents.map((event) => event.type || "other"));
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

      // Call API to send invites
      const result = await inviteGuests(selectedEvent._id, validEmails);

      if (result.success) {
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
        marginTop: "10px",
      }}
    >
      <Toast ref={toast} />

      {renderMobileViewToggle()}

      <div
        className="widget-container"
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? "16px" : "20px",
          padding: isMobile ? "0 12px 20px 12px" : "0",
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
            borderRadius: isMobile ? "16px" : "10px",
            padding: isMobile ? "16px" : "20px",
            boxShadow: isMobile
              ? "0 4px 16px rgba(0, 0, 0, 0.08)"
              : "1px 1px 1px #0000001A",
            marginBottom: isMobile ? "0" : "20px",
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
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: 500,
                marginBottom: "20px",
                transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
                boxShadow: "0 2px 8px rgba(3,135,217,0.08)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#056bb3";
                e.currentTarget.style.boxShadow =
                  "0 4px 16px rgba(3,135,217,0.13)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#0387D9";
                e.currentTarget.style.boxShadow =
                  "0 2px 8px rgba(3,135,217,0.08)";
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = "scale(0.97)";
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
              onFocus={(e) => {
                e.currentTarget.style.outline = "2px solid #0387D9";
                e.currentTarget.style.outlineOffset = "2px";
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

          {isLoading ? (
            <div>Loading events...</div>
          ) : (
            (() => {
              if (!calendarEvents?.length) {
                return <div>No events found</div>;
              }

              return (
                <>
                  {/* Show only first 3 events */}
                  {calendarEvents.slice(0, 3).map((event, index) => (
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

                  {/* Show See More button if there are more than 3 events */}
                  {calendarEvents.length > 3 && (
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
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontWeight: 500,
                          transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
                          boxShadow: "0 2px 8px rgba(3,135,217,0.08)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#0387D9";
                          e.currentTarget.style.color = "white";
                          e.currentTarget.style.boxShadow =
                            "0 4px 16px rgba(3,135,217,0.13)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = "#0387D9";
                          e.currentTarget.style.boxShadow =
                            "0 2px 8px rgba(3,135,217,0.08)";
                        }}
                        onMouseDown={(e) => {
                          e.currentTarget.style.transform = "scale(0.97)";
                        }}
                        onMouseUp={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.outline = "2px solid #0387D9";
                          e.currentTarget.style.outlineOffset = "2px";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.outline = "none";
                        }}
                      >
                        See More Events
                      </button>
                    </div>
                  )}
                </>
              );
            })()
          )}
        </div>

        <div
          style={{
            flex: 1,
            background: "#FFFFFF",
            borderRadius: isMobile ? "16px" : "10px",
            padding: isMobile ? "16px" : "20px",
            boxShadow: isMobile
              ? "0 4px 16px rgba(0, 0, 0, 0.08)"
              : "1px 1px 1px #0000001A",
            display: isMobile && activeView !== "calendar" ? "none" : "block",
          }}
        >
          <h3
            style={{
              fontSize: isMobile ? "20px" : "18px",
              margin: "0 0 15px 0",
              fontWeight: isMobile ? "600" : "500",
              color: "#344054",
            }}
          >
            Calendar
          </h3>

          {/* Large Calendar Component */}
          <div
            style={{
              width: "100%",
              height: isMobile ? "500px" : "600px",
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
                    fontSize: isMobile ? "18px" : "20px",
                    margin: 0,
                    color: "#344054",
                    fontWeight: isMobile ? "600" : "500",
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
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: isMobile ? "12px" : "14px",
                    transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
                    boxShadow: "0 2px 8px rgba(3,135,217,0.08)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#0387D9";
                    e.currentTarget.style.color = "white";
                    e.currentTarget.style.borderColor = "#0387D9";
                    e.currentTarget.style.boxShadow =
                      "0 4px 16px rgba(3,135,217,0.13)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#F9FAFB";
                    e.currentTarget.style.color = "#344054";
                    e.currentTarget.style.borderColor = "#E4E7EC";
                    e.currentTarget.style.boxShadow =
                      "0 2px 8px rgba(3,135,217,0.08)";
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = "scale(0.97)";
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.outline = "2px solid #0387D9";
                    e.currentTarget.style.outlineOffset = "2px";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.outline = "none";
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
                    borderRadius: "8px",
                    transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
                    boxShadow: "0 2px 8px rgba(3,135,217,0.08)",
                    ":hover": {
                      boxShadow: "0 4px 16px rgba(3,135,217,0.13)",
                      background: "#056bb3",
                    },
                    ":active": { transform: "scale(0.97)" },
                    ":focus": {
                      outline: "2px solid #0387D9",
                      outlineOffset: "2px",
                    },
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
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: isMobile ? "12px" : "14px",
                    transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
                    boxShadow: "0 2px 8px rgba(3,135,217,0.08)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#0387D9";
                    e.currentTarget.style.color = "white";
                    e.currentTarget.style.borderColor = "#0387D9";
                    e.currentTarget.style.boxShadow =
                      "0 4px 16px rgba(3,135,217,0.13)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#F9FAFB";
                    e.currentTarget.style.color = "#344054";
                    e.currentTarget.style.borderColor = "#E4E7EC";
                    e.currentTarget.style.boxShadow =
                      "0 2px 8px rgba(3,135,217,0.08)";
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = "scale(0.97)";
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.outline = "2px solid #0387D9";
                    e.currentTarget.style.outlineOffset = "2px";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.outline = "none";
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
                      // backgroundColor:
                      //   day === selectedDay
                      //     ? "rgba(3, 135, 217, 0.1)"
                      //     : "white",
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
                                  : "#0387D9",
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
                            : "#0387D9",
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
        events={calendarEvents || []}
        onEventUpdate={handleEventUpdate}
        onEventDelete={handleEventDelete}
        onAddGuest={handleAddGuest}
      />

      {/* Add the Update and Delete Modals */}
      <MUIDialog
        open={showUpdateEventModal}
        onClose={() => {
          setShowUpdateEventModal(false);
          setSelectedEvent(null);
        }}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Slide}
        transitionDuration={300}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
          },
        }}
      >
        <DialogTitle
          sx={{
            pb: 1,
            borderBottom: "1px solid #E4E7EC",
            backgroundColor: "#F8FBFF",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "#344054",
                fontSize: "1.25rem",
              }}
            >
              Update Event
            </Typography>
            <IconButton
              onClick={() => {
                setShowUpdateEventModal(false);
                setSelectedEvent(null);
              }}
              size="small"
              sx={{
                color: "#667085",
                "&:hover": {
                  backgroundColor: "rgba(3, 135, 217, 0.08)",
                  color: "#0387D9",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Box
            display="flex"
            flexDirection="column"
            gap={2.5}
            sx={{ mb: 3, mt: 3 }}
          >
            <TextField
              label="Event Title"
              value={selectedEvent?.title || ""}
              onChange={(e) =>
                setSelectedEvent({ ...selectedEvent, title: e.target.value })
              }
              fullWidth
              variant="outlined"
              size="medium"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#0387D9",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#0387D9",
                    borderWidth: 2,
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#0387D9",
                },
              }}
            />

            <TextField
              label="Location"
              value={selectedEvent?.location || ""}
              onChange={(e) =>
                setSelectedEvent({
                  ...selectedEvent,
                  location: e.target.value,
                })
              }
              fullWidth
              variant="outlined"
              size="medium"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#0387D9",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#0387D9",
                    borderWidth: 2,
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#0387D9",
                },
              }}
            />

            <TextField
              label="Description"
              value={selectedEvent?.description || ""}
              onChange={(e) =>
                setSelectedEvent({
                  ...selectedEvent,
                  description: e.target.value,
                })
              }
              fullWidth
              variant="outlined"
              size="medium"
              multiline
              rows={3}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#0387D9",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#0387D9",
                    borderWidth: 2,
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#0387D9",
                },
              }}
            />

            <Box display="flex" gap={2}>
              <TextField
                label="Start Date & Time"
                value={
                  selectedEvent?.start
                    ? new Date(selectedEvent.start).toISOString().slice(0, 16)
                    : ""
                }
                onChange={(e) =>
                  setSelectedEvent({ ...selectedEvent, start: e.target.value })
                }
                fullWidth
                type="datetime-local"
                variant="outlined"
                size="medium"
                InputLabelProps={{ shrink: true }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#0387D9",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#0387D9",
                      borderWidth: 2,
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#0387D9",
                  },
                }}
              />

              <TextField
                label="End Date & Time"
                value={
                  selectedEvent?.end
                    ? new Date(selectedEvent.end).toISOString().slice(0, 16)
                    : ""
                }
                onChange={(e) =>
                  setSelectedEvent({ ...selectedEvent, end: e.target.value })
                }
                fullWidth
                type="datetime-local"
                variant="outlined"
                size="medium"
                InputLabelProps={{ shrink: true }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#0387D9",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#0387D9",
                      borderWidth: 2,
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#0387D9",
                  },
                }}
              />
            </Box>

            <TextField
              label="Current Guests"
              value={
                selectedEvent?.guestEmails?.join(", ") +
                (selectedEvent?.guests?.length > 0
                  ? `, ${selectedEvent.guests
                      .map((g) => g.email || g.name)
                      .join(", ")}`
                  : "")
              }
              fullWidth
              variant="outlined"
              size="medium"
              disabled
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "#F9FAFB",
                },
                "& .MuiInputLabel-root": {
                  color: "#667085",
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1.5 }}>
          <MUIButton
            onClick={() => {
              setShowUpdateEventModal(false);
              setSelectedEvent(null);
            }}
            variant="outlined"
            sx={{
              color: "#667085",
              borderColor: "#D0D5DD",
              borderRadius: 2,
              px: 3,
              py: 1,
              textTransform: "none",
              fontWeight: 500,
              "&:hover": {
                borderColor: "#667085",
                backgroundColor: "#F9FAFB",
              },
            }}
          >
            Cancel
          </MUIButton>
          <MUIButton
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
            variant="contained"
            sx={{
              backgroundColor: "#0387D9",
              borderRadius: 2,
              px: 3,
              py: 1,
              textTransform: "none",
              fontWeight: 500,
              boxShadow: "0 2px 8px rgba(3, 135, 217, 0.25)",
              "&:hover": {
                backgroundColor: "#056bb3",
                boxShadow: "0 4px 16px rgba(3, 135, 217, 0.35)",
                transform: "translateY(-1px)",
              },
              "&:active": {
                transform: "translateY(0)",
              },
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            Update Event
          </MUIButton>
        </DialogActions>
      </MUIDialog>

      <MUIDialog
        open={showDeleteEventModal}
        onClose={() => setShowDeleteEventModal(false)}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Slide}
        transitionDuration={300}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
          },
        }}
      >
        <DialogTitle
          sx={{
            pb: 1,
            borderBottom: "1px solid #E4E7EC",
            backgroundColor: "#F8FBFF",
            mb: 3,
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "#344054",
                fontSize: "1.25rem",
              }}
            >
              Delete Event
            </Typography>
            <IconButton
              onClick={() => setShowDeleteEventModal(false)}
              size="small"
              sx={{
                color: "#667085",
                "&:hover": {
                  backgroundColor: "rgba(3, 135, 217, 0.08)",
                  color: "#0387D9",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Box
            display="flex"
            flexDirection="column"
            gap={2}
            alignItems="center"
            textAlign="center"
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                backgroundColor: "#FEF3F2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 1,
              }}
            >
              <DeleteIcon sx={{ fontSize: 32, color: "#F04438" }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "#344054",
                mb: 1,
              }}
            >
              Delete "{selectedEvent?.title}"?
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ maxWidth: 400 }}
            >
              This action cannot be undone. The event will be permanently
              deleted from your calendar.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1.5 }}>
          <MUIButton
            onClick={() => setShowDeleteEventModal(false)}
            variant="outlined"
            sx={{
              color: "#667085",
              borderColor: "#D0D5DD",
              borderRadius: 2,
              px: 3,
              py: 1,
              textTransform: "none",
              fontWeight: 500,
              "&:hover": {
                borderColor: "#667085",
                backgroundColor: "#F9FAFB",
              },
            }}
          >
            Cancel
          </MUIButton>
          <MUIButton
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
            variant="contained"
            sx={{
              backgroundColor: "#F04438",
              borderRadius: 2,
              px: 3,
              py: 1,
              textTransform: "none",
              fontWeight: 500,
              boxShadow: "0 2px 8px rgba(240, 68, 56, 0.25)",
              "&:hover": {
                backgroundColor: "#D92D20",
                boxShadow: "0 4px 16px rgba(240, 68, 56, 0.35)",
                transform: "translateY(-1px)",
              },
              "&:active": {
                transform: "translateY(0)",
              },
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            Delete Event
          </MUIButton>
        </DialogActions>
      </MUIDialog>

      <MUIDialog
        open={showAddGuestModal}
        onClose={() => {
          setShowAddGuestModal(false);
          setGuestEmails([""]);
        }}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Slide}
        transitionDuration={300}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
          },
        }}
      >
        <DialogTitle
          sx={{
            pb: 1,
            borderBottom: "1px solid #E4E7EC",
            backgroundColor: "#F8FBFF",
            mb: 3,
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "#344054",
                fontSize: "1.25rem",
              }}
            >
              Invite Guests
            </Typography>
            <IconButton
              onClick={() => {
                setShowAddGuestModal(false);
                setGuestEmails([""]);
              }}
              size="small"
              sx={{
                color: "#667085",
                "&:hover": {
                  backgroundColor: "rgba(3, 135, 217, 0.08)",
                  color: "#0387D9",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Box display="flex" flexDirection="column" gap={2.5}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Add email addresses of guests you'd like to invite to "
              {selectedEvent?.title}".
            </Typography>

            {guestEmails.map((email, index) => (
              <Box key={index} display="flex" gap={1.5} alignItems="center">
                <TextField
                  label={`Guest Email ${index + 1}`}
                  value={email}
                  onChange={(e) => handleEmailChange(index, e.target.value)}
                  fullWidth
                  type="email"
                  variant="outlined"
                  size="medium"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#0387D9",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#0387D9",
                        borderWidth: 2,
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#0387D9",
                    },
                  }}
                />
                <IconButton
                  onClick={() => removeEmailField(index)}
                  color="error"
                  size="small"
                  disabled={guestEmails.length === 1}
                  sx={{
                    backgroundColor: "#FEF3F2",
                    color: "#F04438",
                    "&:hover": {
                      backgroundColor: "#FEE4E2",
                    },
                    "&:disabled": {
                      backgroundColor: "#F9FAFB",
                      color: "#D0D5DD",
                    },
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}

            <MUIButton
              onClick={addEmailField}
              startIcon={<AddIcon />}
              variant="outlined"
              sx={{
                alignSelf: "flex-start",
                color: "#0387D9",
                borderColor: "#0387D9",
                borderRadius: 2,
                px: 2,
                py: 1,
                textTransform: "none",
                fontWeight: 500,
                "&:hover": {
                  borderColor: "#056bb3",
                  backgroundColor: "#F0F4FF",
                },
              }}
            >
              Add Another Guest
            </MUIButton>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1.5 }}>
          <MUIButton
            onClick={() => {
              setShowAddGuestModal(false);
              setGuestEmails([""]);
            }}
            variant="outlined"
            sx={{
              color: "#667085",
              borderColor: "#D0D5DD",
              borderRadius: 2,
              px: 3,
              py: 1,
              textTransform: "none",
              fontWeight: 500,
              "&:hover": {
                borderColor: "#667085",
                backgroundColor: "#F9FAFB",
              },
            }}
          >
            Cancel
          </MUIButton>
          <MUIButton
            onClick={handleInviteGuests}
            disabled={guestEmails.every((email) => email.trim() === "")}
            startIcon={<SendIcon />}
            variant="contained"
            sx={{
              backgroundColor: "#0387D9",
              borderRadius: 2,
              px: 3,
              py: 1,
              textTransform: "none",
              fontWeight: 500,
              boxShadow: "0 2px 8px rgba(3, 135, 217, 0.25)",
              "&:hover": {
                backgroundColor: "#056bb3",
                boxShadow: "0 4px 16px rgba(3, 135, 217, 0.35)",
                transform: "translateY(-1px)",
              },
              "&:active": {
                transform: "translateY(0)",
              },
              "&:disabled": {
                backgroundColor: "#E4E7EC",
                color: "#98A2B3",
                boxShadow: "none",
                transform: "none",
              },
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            Send Invites
          </MUIButton>
        </DialogActions>
      </MUIDialog>
    </div>
  );
}
