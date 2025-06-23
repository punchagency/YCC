import BookingsDashboard from "../../../components/dashboard/bookings-dashboard";
import { Box } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import React from "react";

const CrewDashboard = () => {
  const { setPageTitle } = useOutletContext() || {};
  React.useEffect(() => {
    if (setPageTitle) setPageTitle("Dashboard", { backArrow: true });
  }, [setPageTitle]);

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
