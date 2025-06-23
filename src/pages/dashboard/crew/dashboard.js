import BookingsDashboard from "../../../components/dashboard/bookings-dashboard";
import DashboardTitleBar from "../../../components/dashboard/title-bar";
import { Box } from "@mui/material";
const CrewDashboard = () => {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
        backgroundColor: "white",
      }}
    >
      <BookingsDashboard />
    </Box>
  );
};

export default CrewDashboard;
