import { Box, Typography, styled, Grid } from "@mui/material";
import BookingCalenderCard from "./booking-calender-card";
import BookingSummaryInfoCard from "./booking-summary-info-card";
import { useTheme } from "../../context/theme/themeContext";
import UpdatedCalendar from "./updated-calendar";
const BookingSummary = () => {
  const { theme } = useTheme();
  return (
    <Box
      sx={{
        backgroundColor: theme === "light" ? "white" : "#03141F",
        borderRadius: "8px",
        padding: "15px",
        boxShadow: "0px 2px 8px 0px #0000001A",
        textAlign: "start",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <DashBoardTitleText mode={theme}>Booking Summary</DashBoardTitleText>
        <DashBoardDescriptionText mode={theme}>
        Track deliveries, view tasks, and add new ones seamlessly.
        </DashBoardDescriptionText>

        <Box sx={{display: "flex", padding: "10px", flexDirection: "row", gap: "20px", height: "100%", width: "100%"}}>
        
        <Grid container spacing={2} >
          <Grid item xs={12} md={6} lg={7.5} sx={{height: "100%", width: "100%"}}>
            {/* <BookingCalenderCard /> */}
            <UpdatedCalendar />
          </Grid>
          <Grid item xs={12} md={6} lg={4.5} sx={{height: "100%", width: "100%"}}>
            <BookingSummaryInfoCard />
          </Grid>
        </Grid>


        </Box>


      </Box>
    </Box>
  );
};

const DashBoardTitleText = styled(Typography)(({ mode }) => ({
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 600,
  fontSize: "20px",
  lineHeight: "32px",
  letterSpacing: "0%",
  color: mode === "light" ? "#212121" : "white",
}));

const DashBoardDescriptionText = styled(Typography)(({ mode }) => ({
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 400,
  fontSize: "12px",
  color: mode === "light" ? "#212121" : "white",
}));


export default BookingSummary;
