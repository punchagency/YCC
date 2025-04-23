import { Box, Typography, styled } from "@mui/material";
import { useEffect, useState } from "react";
import VideocamIcon from '@mui/icons-material/Videocam';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import { useTheme } from "../../context/theme/themeContext";
import { useCalendar } from "../../context/calendar/calendarContext";
import CreateEventModal from "./create-event-modal";

const BookingSummaryInfoCard = () => {
  const { events, fetchEventsByDate } = useCalendar();
  const { theme } = useTheme();
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  useEffect(() => {
    fetchEventsByDate();
  }, []);
  
  const todayEvents = events.filter(event => {
    const eventDate = new Date(event.start);
    return eventDate.toDateString() === today.toDateString();
  }) || [];
  
  const tomorrowEvents = events.filter(event => {
    const eventDate = new Date(event.start);
    return eventDate.toDateString() === tomorrow.toDateString();
  }) || [];

  function formatDate(date) {
    let newDate = new Date(date);
    const hours = newDate.getHours();
    const minutes = newDate.getMinutes();
    
    const amPm = hours >= 12 ? 'pm' : 'am';
    const formattedHour = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  
    const day = newDate.getDate();
    const daySuffix = ['st', 'nd', 'rd', 'th'][((day % 10) - 1) % 10] || 'th';
    const formattedDay = `${day}${daySuffix}`;
    const dayOfWeek = newDate.toLocaleDateString('en-US', { weekday: 'short' });
  
    return {day: `${dayOfWeek} ${formattedDay}`, time: `${formattedHour}:${formattedMinutes} ${amPm}`};
  }
  
  const [openModal, setOpenModal] = useState(false);
  const handleClose = () => setOpenModal(false);
  
  return (
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "start",
      gap: { xs: "8px", sm: "10px" },
      width: "100%",
      height: "auto",
      maxHeight: "400px",
      overflowY: "auto",
      overflowX: "hidden",
      padding: "5px",
      
      "&::-webkit-scrollbar": {
        width: "4px",
      },
      "&::-webkit-scrollbar-track": {
        background: "transparent",
      },
      "&::-webkit-scrollbar-thumb": {
        background: "#bbbbbb",
        borderRadius: "4px",
      },
      "&::-webkit-scrollbar-thumb:hover": {
        background: "#999999",
      },
    }}>
      <DateText mode={theme}>Today</DateText>
      
      { todayEvents.length > 0 ? todayEvents.map((event, index) => (
        <Box 
          key={index}
          sx={{
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            justifyContent: "space-between", 
            width: "100%",
            mb: { xs: 1, sm: 1.5 }
          }}
        >
          <EventCard
            mode={theme}
            sx={{
              borderBottomLeftRadius: "0px",
              borderBottomRightRadius: "0px",
              width: "100%",
              padding: { xs: "8px 12px 16px 12px", sm: "15px 16px 24px 16px" }
            }}
          >
            <Box sx={{
              display: "flex", 
              flexDirection: { xs: "column", sm: "row" }, 
              alignItems: { xs: "flex-start", sm: "center" }, 
              justifyContent: "space-between", 
              width: "100%",
              mb: { xs: 1, sm: 0 }
            }}>
              <DateTimeText mode={theme}>{formatDate(event.start).time}</DateTimeText>
              <DateTimeText mode={theme}>{formatDate(event.start).day}</DateTimeText>
            </Box>

            <Box sx={{
              display: "flex", 
              flexDirection: "row", 
              alignItems: "center", 
              width: "100%"
            }}>
              <BookingTitleText mode={theme}>{event.title}</BookingTitleText>
            </Box>
          </EventCard>
          
          <Box sx={{
            display: "flex", 
            flexDirection: "row", 
            backgroundColor: "#0387D91A", 
            borderBottomLeftRadius: "8px", 
            borderBottomRightRadius: "8px", 
            padding: { xs: "4px 8px", sm: "4px" }, 
            alignItems: "center", 
            justifyContent: "space-around", 
            width: "100%"
          }}>
            <Box sx={{
              display: "flex", 
              flexDirection: "row", 
              alignItems: "center", 
              justifyContent: "flex-start", 
              width: { xs: "70%", sm: "80%" }
            }}>
              <VideocamIcon sx={{ 
                color: "#0387D9", 
                fontSize: { xs: "16px", sm: "18px" } 
              }} />
              <EventNameText mode={theme}>&nbsp;{event.description}</EventNameText>
            </Box>
            
            <EqualizerIcon sx={{ 
              fontSize: { xs: "14px", sm: "17px" }, 
              backgroundColor: "#0387D9", 
              borderRadius: "5px", 
              color: "white", 
              padding: "2px" 
            }} />
          </Box>
        </Box>
      )) : (
        <Box sx={{
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          justifyContent: "center", 
          width: "100%", 
          py: 2
        }}>
          <Typography 
            sx={{ 
              fontSize: { xs: "14px", sm: "16px" },
              color: theme === "light" ? "#666" : "#ccc" 
            }}
          >
            No events today
          </Typography>
        </Box>
      )}

      <DateText mode={theme}>Tomorrow</DateText>
      
      { tomorrowEvents.length > 0 ? tomorrowEvents.slice(0, 2).map((event, index) => (
        <EventCard 
          key={index}
          mode={theme}
          sx={{
            width: "100%",
            padding: { xs: "8px 12px 16px 12px", sm: "15px 16px 24px 16px" },
            mb: { xs: 1, sm: 1.5 }
          }}
        >
          <Box sx={{
            display: "flex", 
            flexDirection: { xs: "column", sm: "row" }, 
            alignItems: { xs: "flex-start", sm: "center" }, 
            justifyContent: "space-between", 
            width: "100%",
            mb: { xs: 1, sm: 0 }
          }}>
            <DateTimeText mode={theme}>{formatDate(event.start).time}</DateTimeText>
            <DateTimeText mode={theme}>{formatDate(event.start).day}</DateTimeText>
          </Box>

          <Box sx={{
            display: "flex", 
            flexDirection: "row", 
            alignItems: "center", 
            width: "100%"
          }}>
            <BookingTitleText mode={theme}>{event.title}</BookingTitleText>
          </Box>
        </EventCard>
      )) : (
        <Box sx={{
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          justifyContent: "center", 
          width: "100%", 
          py: 2
        }}>
          <Typography 
            sx={{ 
              fontSize: { xs: "14px", sm: "16px" },
              color: theme === "light" ? "#666" : "#ccc" 
            }}
          >
            No events tomorrow
          </Typography>
        </Box>
      )}

      <CreateEventModal open={openModal} handleClose={handleClose} />
    </Box>
  );
};

const DateText = styled(Typography)(({ mode }) => ({
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 500,
  fontSize: 16,
  lineHeight: "24px",
  letterSpacing: "0px",
  verticalAlign: "middle",
  textAlign: "start",
  color: mode === "light" ? "#212121" : "white",
  '@media (max-width: 600px)': {
    fontSize: 14,
    lineHeight: "20px",
  },
}));

const EventCard = styled(Box)(({ mode }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "start",
  boxShadow: "0px 1px 10px 0px #00000014",
  padding: "15px 16px 24px 16px",
  gap: "11px",
  borderRadius: "12px",
  width: "100%",
  
  '@media (max-width: 600px)': {
    padding: "10px 12px 16px 12px",
    gap: "8px",
  },
}));

const EventNameText = styled(Typography)(({ mode }) => ({
  fontFamily: "Inter",
  fontWeight: 500,
  fontSize: "11.13px",
  lineHeight: "100%",
  textAlign: "start",
  letterSpacing: "0px",
  color: mode === "light" ? "#0387D9" : "white",
  whiteSpace: "nowrap",
  overflow: "hidden",        
  textOverflow: "ellipsis",
  '@media (max-width: 600px)': {
    fontSize: "10px",
  },
}));

const DateTimeText = styled(Typography)(({ mode }) => ({
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 400,
  fontSize: 12,
  lineHeight: "100%",
  letterSpacing: "0px",
  verticalAlign: "bottom", 
  color: mode === "light" ? "#212121" : "white",
  '@media (max-width: 600px)': {
    fontSize: 10,
  },
}));

const BookingTitleText = styled(Typography)(({ mode }) => ({
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 500,
  fontSize: "16px",
  lineHeight: "100%",
  letterSpacing: "0%",
  textAlign: "left",
  color: mode === "light" ? "#212121" : "white",
  '@media (max-width: 600px)': {
    fontSize: "14px",
  },
}));

export default BookingSummaryInfoCard;
