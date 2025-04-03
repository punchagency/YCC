import { Box, Typography, styled } from "@mui/material";
import VideocamIcon from '@mui/icons-material/Videocam';
import EqualizerIcon from '@mui/icons-material/Equalizer';
const BookingSummaryInfoCard = () => {
  return (
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "start",
      gap: "10px",
      width: "100%",
      height: "100%",
    }}>


      <DateText>Today</DateText>
      <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", width: "100%"}}>

      <EventCard
      sx={{
        borderBottomLeftRadius: "0px",
        borderBottomRightRadius: "0px",
      }}
        
      >
        <Box sx={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
            <DateTimeText>03:15PM</DateTimeText>
            <DateTimeText>Mon 11th</DateTimeText>
        </Box>

        <Box sx={{display: "flex", flexDirection: "row", alignItems: "center", width: "100%"}}>
            <BookingTitleText>Research Methodology</BookingTitleText>
        </Box>
      </EventCard>
      <Box sx={{display: "flex", flexDirection: "row", backgroundColor: "#0387D91A", borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px", padding: "4px", alignItems: "center", justifyContent: "space-around", width: "100%"}}>
            <Box sx={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start", width: "80%"}}>
            <VideocamIcon  sx={{ color: "#0387D9" }} />
            <EventNameText>&nbsp;Veronica Bellucci</EventNameText>
            </Box>
            
            <EqualizerIcon sx={{ fontSize: "17px", backgroundColor: "#0387D9", borderRadius: "5px", color: "white", padding: "2px" }} />
        </Box>
      </Box>

      <DateText>Tomorrow</DateText>

      <EventCard
      >
        <Box sx={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
            <DateTimeText>03:15PM</DateTimeText>
            <DateTimeText>Mon 11th</DateTimeText>
        </Box>

        <Box sx={{display: "flex", flexDirection: "row", alignItems: "center", width: "100%"}}>
            <BookingTitleText>Order Dispatch</BookingTitleText>
        </Box>
      </EventCard>

      
      <EventCard
      >
        <Box sx={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
            <DateTimeText>03:15PM</DateTimeText>
            <DateTimeText>Mon 11th</DateTimeText>
        </Box>

        <Box sx={{display: "flex", flexDirection: "row", alignItems: "center", width: "100%"}}>
            <BookingTitleText>Bookings</BookingTitleText>
        </Box>
      </EventCard>

    </Box>
  );
};

const DateText = styled(Typography)({
    fontFamily: "Plus Jakarta Sans",
    fontWeight: 500,
    fontSize: 16,
    lineHeight: "24px",
    letterSpacing: "0px",
    verticalAlign: "middle",
    textAlign: "start",
    color: "#212121",
  });

  const EventCard = styled(Box)({
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    boxShadow: "0px 1px 10px 0px #00000014",
    padding: "15px 16px 24px 16px",
    gap: "11px",
        borderRadius: "12px",
        width: "100%",
  });

const EventNameText = styled(Typography)({
    fontFamily: "Inter",
    fontWeight: 500,
    fontSize: "11.13px",
    lineHeight: "100%",
    textAlign: "start",
    letterSpacing: "0px",
    color: "#0387D9",
});

const DateTimeText = styled(Typography)({
    fontFamily: "Plus Jakarta Sans",
    fontWeight: 400,
    fontSize: 12,
    lineHeight: "100%",
    letterSpacing: "0px",
    verticalAlign: "bottom", 
    color: "#212121",
});

const BookingTitleText = styled(Typography)({
    fontFamily: "Plus Jakarta Sans",
    fontWeight: 500,
    fontSize: "16px",
    lineHeight: "100%",
    letterSpacing: "0%",
    textAlign: "left",
    color: "#212121",
});
  
export default BookingSummaryInfoCard;
