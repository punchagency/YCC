import { Box, Typography, styled, Grid } from "@mui/material";
import BookingCalenderCard from "./booking-calender-card";
const BookingSummary = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "white",
        borderRadius: "8px",
        padding: "20px",
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
        <DashBoardTitleText>Booking Summary</DashBoardTitleText>
        <DashBoardDescriptionText>
        Track deliveries, view tasks, and add new ones seamlessly.
        </DashBoardDescriptionText>

        <Box sx={{display: "flex", padding: "20px", flexDirection: "row", gap: "20px", height: "300px", width: "100%"}}>
        
        <Grid container sx={{ display: "flex", gap: "20px", height: "100%", width: "100%"}}>
          <Grid item xs={12} md={6} lg={6.5} sx={{height: "100%", backgroundColor: "red"}}>
            <BookingCalenderCard />
          </Grid>
          <Grid item xs={12} md={6} lg={5} sx={{height: "100%", backgroundColor: "blue"}}>
            <Typography>
                Booking Summary
            </Typography>
          </Grid>
        </Grid>


        </Box>


      </Box>
    </Box>
  );
};

const DashBoardTitleText = styled(Typography)({
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 600,
  fontSize: "20px",
  lineHeight: "32px",
  letterSpacing: "0%",
  color: "#212121",
});

const DashBoardDescriptionText = styled(Typography)({
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 400,
  fontSize: "12px",
});
const CurrentSummarySubText = styled(Typography)({
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 500,
  fontSize: 14,
  marginTop: "10px",
  padding: 0,
  letterSpacing: 0,
  color: "#212121",
});

const SummaryWidgetBox = styled(Box)({
    display: "flex",
    width: 232,
    height: 106,
    gap: 10,
    paddingTop: 14,
    paddingRight: 20,
    paddingBottom: 14,
    paddingLeft: 20,
    borderRadius: 12,
    boxShadow: "0px 1px 6px 0px #00000024",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
});


export default BookingSummary;
