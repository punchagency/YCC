import { Box } from "@mui/material";
import Dashboard1 from "../../../components/dashboard/bookings-dashboard";
import DashboardSidebar from "../../../components/dashboard/sidebar";
import DashboardHeader from "../../../components/dashboard/header";
import DashboardTitleBar from "../../../components/dashboard/title-bar";
const AdminDashboard1 = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <DashboardTitleBar />
      <Dashboard1 />
    </Box>
  );
};

export default AdminDashboard1;
