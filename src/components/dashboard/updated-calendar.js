import { useState } from "react";
import { Box, Typography, Button, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { useTheme } from "../../context/theme/themeContext";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";  // Optional, only if you're using list view

import "../../assets/styles/scss/components/calendar.css";

const UpdatedCalendar = () => {
  const { theme } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleDateChange = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const formattedDate = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const events = [
    { title: 'Event 1', date: '2025-04-10' }, // Example event
    { title: 'Event 2', date: '2025-04-12' }, // Example event
  ];


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
        sx={{
          "& .fc": {
            fontFamily: "Plus Jakarta Sans",
            color: theme === "light" ? "#212121" : "#fff",
          },
          "& .fc-event": {
            backgroundColor: "#0387d9",
            border: "none",
            borderRadius: "8px",
            fontSize: "0.85rem",
            padding: "4px",
          },
          "& .fc-toolbar-title": {
            fontSize: "1.2rem",
            fontWeight: 600,
          },
          "& .fc-daygrid-day-number": {
            color: theme === "light" ? "#212121" : "#fff",
          },
        }}
      >
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin, listPlugin]}
          initialView="dayGridMonth"
          events={events}
          height="300px"
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
          eventClassNames={(info) => {
            // Add a custom class to the event's cell
            return ['custom-event-cell'];
          }}
          eventContent={(eventInfo) => {
            return (
              <div style={{ width: "1px", height: "1px", borderRadius: "50%", backgroundColor: "#0387d9" }} />
            );
          }}

        />
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
            No tasks for this day.
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
        >
          Add Task
        </Button>
      </Box>
    </Box>
  );
};

export default UpdatedCalendar;
