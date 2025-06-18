import { Box, Typography, styled, Grid } from "@mui/material";
import BookingSummaryInfoCard from "./booking-summary-info-card";
import { useTheme } from "../../context/theme/themeContext";
import UpdatedCalendar from "./updated-calendar";

const BookingSummary = () => {
  const { theme } = useTheme();
  return (
    <Box
      sx={{
        borderRadius: "8px",
        padding: { xs: "10px", sm: "12px", md: "15px" },
        boxShadow: "0px 2px 8px 0px #0000001A",
        textAlign: "start",
        height: "auto",
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme === "light" ? "white" : "#03141F",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: { xs: "5px", sm: "8px", md: "10px" },
        }}
      >
        <DashBoardTitleText mode={theme}>Booking Summary</DashBoardTitleText>
        <DashBoardDescriptionText mode={theme}>
          Track deliveries, view tasks, and add new ones seamlessly.
        </DashBoardDescriptionText>

        <Box
          sx={{
            display: "flex",
            padding: { xs: "5px", sm: "8px", md: "10px" },
            flexDirection: "column",
            gap: { xs: "10px", sm: "15px", md: "20px" },
            height: "100%",
            width: "100%",
          }}
        >
          <Grid
            spacing={{ xs: 1, sm: 1.5, md: 2 }}
            sx={{ height: "100%" }}
          >
            <Grid
              xs={12}
              md={6}
              lg={7.5}
              sx={{
                height: { xs: "auto", md: "100%" },
                width: "100%",
                mb: { xs: 2, md: 0 },
              }}
            >
              <UpdatedCalendar />
            </Grid>
            <Grid
              xs={12}
              md={6}
              lg={4.5}
              sx={{
                height: { xs: "auto", md: "100%" },
                width: "100%",
              }}
            >
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
  fontWeight: 700,
  fontSize: "15px",
  lineHeight: "111.00000000000001%",
  letterSpacing: "0%",
  color: mode === "light" ? "#212121" : "white",
  "@media (max-width: 600px)": {
    fontSize: "18px",
    lineHeight: "24px",
  },
}));

const DashBoardDescriptionText = styled(Typography)(({ mode }) => ({
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 400,
  fontSize: "12px",
  color: mode === "light" ? "#212121" : "white",
}));

export default BookingSummary;
