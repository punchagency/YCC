import { useState, useEffect } from "react";
import { Box, Typography, Button, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { useTheme } from "../../context/theme/themeContext";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";  // Optional, only if you're using list view
import CreateEventModal from "./create-event-modal";
import ViewEventModal from "./view-event-modal";

import "../../assets/styles/scss/components/calendar.css";
import { useCalendar } from "../../context/calendar/calendarContext";
const UpdatedCalendar = () => {
    const { events, selectedDate, setSelectedDate, fetchEventsByDate, startDate, endDate, setStartDate, setEndDate } = useCalendar();
  const { theme } = useTheme();
  // Start of the current month
  const currentDate = new Date();
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  
  // End of the current month
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
  const eventsForToday = events.filter((event) => {
    const eventDate = new Date(event.start);
    return (
      eventDate.getFullYear() === currentDate.getFullYear() &&
      eventDate.getMonth() === currentDate.getMonth() &&
      eventDate.getDate() === currentDate.getDate() 
    );
  });
  
  // Fetch events when component mounts
  useEffect(() => {
    fetchEventsByDate();
  }, []); 

  // Fetch events when currentDate (month) changes
 // useEffect(() => {
    //setStartDate(startOfMonth);
   // setEndDate(endOfMonth);
  //  fetchEventsByDate(startOfMonth, endOfMonth); // Fetch based on the new month
  //}, [currentDate]);

  const handleCalendarChange = (arg) => {
    // This is triggered when the calendar's view changes
    const newDate = arg.view.currentStart; // Get the start date of the new view
  
    // Get the current month and the month from the new view's start date
    const currentMonth = currentDate.getMonth();
    const newMonth = newDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const newYear = newDate.getFullYear();
  
    // Logic to fetch events from the current month to the selected month
    if (newYear < currentYear || (newYear === currentYear && newMonth < currentMonth)) {
      // Moved to previous month(s)
      const startOfSelectedMonth = new Date(newYear, newMonth, 1); // Start of selected month
      const endOfCurrentMonth = new Date(currentYear, currentMonth + 1, 0); // End of current month
      fetchEventsByDate(startOfSelectedMonth, endOfCurrentMonth); // Fetch events from selected month to current month
    } else if (newYear > currentYear || (newYear === currentYear && newMonth > currentMonth)) {
      // Moved to next month(s)
      const startOfCurrentMonth = new Date(currentYear, currentMonth, 1); // Start of current month
      const endOfSelectedMonth = new Date(newYear, newMonth + 1, 0); // End of selected month
      fetchEventsByDate(startOfCurrentMonth, endOfSelectedMonth); // Fetch events from current month to selected month
    }

  };
  
  
  // Format the current date to display month and year
  const formattedDate = currentDate.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  const [openModal, setOpenModal] = useState(false);

  const handleModal = () => {
    setOpenModal(!openModal);
  }
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const handleViewEventModal = (event) => {
    setOpenViewModal(!openViewModal);
    setSelectedEvent(event);
  }
  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: theme === "light" ? "#ffffff" : "#03141F",
        borderRadius: "24px",
        boxShadow: "0px 1px 8px 0px #0000001F",
        padding: "20px",
      }}
    >

      <Box
      >
       { events && <FullCalendar
  plugins={[dayGridPlugin, interactionPlugin, listPlugin]}
  initialView="dayGridMonth"
  datesSet={handleCalendarChange}
  events={events}
  height="250px"
  initialDate={currentDate}
  dayHeaders={false}
  dayCellClassNames={({ date }) => {
    const today = new Date();
    let classes = '';
    if (date.toDateString() === today.toDateString()) {
      classes += ' bg-blue-500'; // Highlight today's cell
    }
    classes += ' custom-day-cell'; // Add custom class for border radius and height adjustments
    return classes;
  }}
  dateClick={(info) => {
    const clickedDate = info.date;
    const sameDayEvents = events.filter((event) => {
      const eventDate = new Date(event.start);
      return (
        eventDate.getFullYear() === clickedDate.getFullYear() &&
        eventDate.getMonth() === clickedDate.getMonth() &&
        eventDate.getDate() === clickedDate.getDate()
      );
    });
    setOpenViewModal(true);
    setSelectedEvent(sameDayEvents);
  }}
  eventClick={(info) => {
    const clickedDate = new Date(info.event.start);

    const eventsForDay = events.filter((e) => {
      const eventDate = new Date(e.start);
      return (
        eventDate.getFullYear() === clickedDate.getFullYear() &&
        eventDate.getMonth() === clickedDate.getMonth() &&
        eventDate.getDate() === clickedDate.getDate()
      );
    });
    setOpenViewModal(true);
    setSelectedEvent(eventsForDay);
  }}
  eventClassNames={'custom-event-cell minimized'}
  eventContent={(eventInfo) => {
    return (
      <div style={{ width: "1px", height: "1px", borderRadius: "50%", backgroundColor: "#0387d9" }} />
    );
  }}
  eventDisplay="background"
  dayCellContent={({ date }) => {
    const eventsForDay = events.filter((event) => {
      const eventDate = new Date(event.start);
      return (
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate()
      );
    });
    
    return (
      <div>
        <span>{date.getDate()}</span>
        {eventsForDay.length > 0 && (
          <div
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#0387d9',
              margin: '4px auto 0', // Position the dot below the day number
            }}
          />
        )}
      </div>
    );
  }}
/>

}
      </Box>

      <Box mt={3} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 500,
              color: theme === "light" ? "#212121" : "white",
            }}
          >
            Tasks for {formattedDate}:
          </Typography>
          <Typography
            sx={{
              fontSize: "12px",
              color: theme === "light" ? "#6b6b6b" : "#cfcfcf",
              mt: 0.5,
            }}
          >
           { eventsForToday.length > 0 ? `${eventsForToday.length} task(s) for today.` : "No tasks for today."}
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddBoxIcon />}
          sx={{
            bgcolor: "#0387d9",
            color: "#ffffff",
            borderRadius: "10px",
            padding: "10px 20px",
            fontWeight: 500,
            textTransform: "none",
            fontSize: "12px",
            ":hover": {
              bgcolor: "rgba(3, 135, 217, 0.9)",
            },
          }}
          onClick={handleModal}
        >
          Add Task
        </Button>
      </Box>
      <CreateEventModal open={openModal} handleClose={handleModal} />
      <ViewEventModal open={openViewModal} handleClose={handleViewEventModal} event={selectedEvent} />
    </Box>
  );
};

export default UpdatedCalendar;
