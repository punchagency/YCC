import { Box, Typography, styled } from "@mui/material";
import { useEffect, useState } from "react";
import VideocamIcon from "@mui/icons-material/Videocam";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import { useTheme } from "../../context/theme/themeContext";
import { useCalendar } from "../../context/calendar/calendarContext";
import CreateEventModal from "./create-event-modal";

const BookingSummaryInfoCard = () => {
  const { eventsForTodayAndTomorrow, fetchEventsForTodayAndTomorrow } =
    useCalendar();
  const { theme } = useTheme();
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [todayEvents, setTodayEvents] = useState([]);
  const [tomorrowEvents, setTomorrowEvents] = useState([]);

  useEffect(() => {
    fetchEventsForTodayAndTomorrow();
  }, []);

  useEffect(() => {
    setTodayEvents(eventsForTodayAndTomorrow.filter((event) => {
      console.log(event);
      const eventDate = new Date(event.start);
      return eventDate >= startOfToday && eventDate <= endOfToday;
    }));
    setTomorrowEvents(eventsForTodayAndTomorrow.filter((event) => {
      const eventDate = new Date(event.start);
      return eventDate >= startOfTomorrow && eventDate <= endOfTomorrow;
    }));
  }, [eventsForTodayAndTomorrow]);

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);
  const startOfTomorrow = new Date();
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
  startOfTomorrow.setHours(0, 0, 0, 0);

  const endOfTomorrow = new Date();
  endOfTomorrow.setDate(endOfTomorrow.getDate() + 1);
  endOfTomorrow.setHours(23, 59, 59, 999);
 

  function formatDate(date) {
    let newDate = new Date(date);
    const hours = newDate.getHours();
    const minutes = newDate.getMinutes();

    // Get AM/PM
    const amPm = hours >= 12 ? "pm" : "am";

    // Convert to 12-hour format
    const formattedHour = hours % 12 || 12; // Ensure 12:00 is handled correctly
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    // Get the day with the correct suffix
    const day = newDate.getDate();
    const daySuffix = ["st", "nd", "rd", "th"][((day % 10) - 1) % 10] || "th";
    const formattedDay = `${day}${daySuffix}`;
    const dayOfWeek = newDate.toLocaleDateString("en-US", { weekday: "short" }); //MON, TUE, WED, THU, FRI, SAT, SUN

    return {
      day: `${dayOfWeek} ${formattedDay}`,
      time: `${formattedHour}:${formattedMinutes} ${amPm}`,
    };
  }
  const [openModal, setOpenModal] = useState(false);

  const handleClose = () => setOpenModal(false);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        gap: "10px",
        width: "100%",
        height: "100%",
      }}
    >
      <DateText mode={theme}>Today</DateText>
      {todayEvents.length > 0 ? (
        todayEvents.map((event) => (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <EventCard
              mode={theme}
              sx={{
                borderBottomLeftRadius:  event.location === "in-person" || event.location === "In-Person" ? "8px" : "0px",
                borderBottomRightRadius: event.location === "in-person" || event.location === "In-Person" ? "8px" : "0px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <DateTimeText mode={theme}>
                  {formatDate(event.start).time}
                </DateTimeText>
                <DateTimeText mode={theme}>
                  {formatDate(event.start).day}
                </DateTimeText>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <BookingTitleText mode={theme}>{event.title}</BookingTitleText>
              </Box>
            </EventCard>
            <Box
              sx={{
                display: event.location === "in-person"|| event.location === "In-Person" ? "none" : "flex",
                flexDirection: "row",
                backgroundColor: "#0387D91A",
                borderBottomLeftRadius: "8px",
                borderBottomRightRadius: "8px",
                padding: "4px",
                alignItems: "center",
                justifyContent: "space-around",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  width: "80%",
                }}
              >
                <VideocamIcon sx={{ color: "#0387D9" }} />
                <EventNameText mode={theme}>
                  &nbsp;{event.location}
                </EventNameText>
              </Box>

              <EqualizerIcon
                sx={{
                  fontSize: "17px",
                  backgroundColor: "#0387D9",
                  borderRadius: "5px",
                  color: "white",
                  padding: "2px",
                }}
              />
            </Box>
          </Box>
        )).slice(0, 3)
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <Typography mode={theme}>No events today</Typography>
        </Box>
      )}

      { todayEvents.length < 3 && (
        <Box>
          <DateText mode={theme}>Tomorrow</DateText>
      {tomorrowEvents.length > 0 ? (
        tomorrowEvents
          .map((event) => (
            <EventCard mode={theme}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <DateTimeText mode={theme}>
                  {formatDate(event.start).time}
                </DateTimeText>
                <DateTimeText mode={theme}>
                  {formatDate(event.start).day}
                </DateTimeText>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <BookingTitleText mode={theme}>{event.title}</BookingTitleText>
              </Box>
            </EventCard>
          ))
          .slice(0, 2)
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <Typography mode={theme}>No events tomorrow</Typography>
        </Box>
      )}
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
}));

const EventCard = styled(Box)(({ mode }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "start",
  boxShadow: "0px 1px 10px 0px #00000014",
  padding: "13px 16px 16px 16px",
  gap: "11px",
  borderRadius: "12px",
  width: "100%",
  backgroundColor: mode === "light" ? "white" : "#7A7A7A",
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
}));

const DateTimeText = styled(Typography)(({ mode }) => ({
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 400,
  fontSize: 12,
  lineHeight: "100%",
  letterSpacing: "0px",
  verticalAlign: "bottom",
  color: mode === "light" ? "#212121" : "white",
}));

const BookingTitleText = styled(Typography)(({ mode }) => ({
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 500,
  fontSize: "13px",
  lineHeight: "100%",
  letterSpacing: "0%",
  textAlign: "left",
  color: mode === "light" ? "#212121" : "white",
}));

export default BookingSummaryInfoCard;
