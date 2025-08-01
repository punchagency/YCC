import { Box } from "@mui/material";
import Dashboard1 from "../../../components/dashboard/bookings-dashboard";
import { useOutletContext } from "react-router-dom";
import React from "react";

const AdminDashboard1 = () => {
  const { setPageTitle } = useOutletContext() || {};
  React.useEffect(() => {
    if (setPageTitle) setPageTitle("Dashboard");
  }, [setPageTitle]);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
        position: "relative",
        backgroundColor: "white",
      }}
    >
      {/* <DashboardTitleBar title="Dashboard" /> */}
      <Dashboard1 />
    </Box>
  );
};

export default AdminDashboard1;
