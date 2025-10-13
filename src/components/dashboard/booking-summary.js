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
        minHeight: "auto",
        maxHeight: "none",
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme === "light" ? "white" : "#03141F",
        overflow: "visible",
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
            height: "auto",
            width: "100%",
          }}
        >
          {/* REPLACED GRID WITH FLEXBOX FOR BETTER RELIABILITY */}
          <Box
            sx={{
              display: "flex",
              flexDirection: {
                xs: "column",
                sm: "column", 
                md: "column",
                lg: "row"
              },
              gap: { xs: 2, sm: 2, md: 2, lg: 3 },
              width: "100%",
              height: "auto",
            }}
          >
            {/* Calendar Section */}
            <Box
              sx={{
                flex: { xs: "none", lg: "1 1 60%" },
                width: { xs: "100%", lg: "auto" },
                minWidth: 0,
              }}
            >
              <UpdatedCalendar />
            </Box>
            
            {/* Info Card Section */}
            <Box
              sx={{
                flex: { xs: "none", lg: "1 1 40%" },
                width: { xs: "100%", lg: "auto" },
                minWidth: 0,
              }}
            >
              <BookingSummaryInfoCard />
            </Box>
          </Box>
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
