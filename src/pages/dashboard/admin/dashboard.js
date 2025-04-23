import { Box } from "@mui/material";
import Dashboard1 from "../../../components/dashboard/bookings-dashboard";
import DashboardSidebar from "../../../components/dashboard/sidebar";
import DashboardHeader from "../../../components/dashboard/header";
import DashboardTitleBar from "../../../components/dashboard/title-bar";

const AdminDashboard1 = () => {
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
      <DashboardTitleBar title="Dashboard" />
      <Dashboard1 />
    </Box>
  );
};

export default AdminDashboard1;
