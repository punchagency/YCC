import { Box } from "@mui/material";
import Dashboard1 from "../../../components/dashboard/bookings-dashboard";
import DashboardSidebar from "../../../components/dashboard/sidebar";
import DashboardHeader from "../../../components/dashboard/header";
import DashboardTitleBar from "../../../components/dashboard/title-bar";
const AdminDashboard1 =() =>{
    return (
        <Box sx={{ 
            height: '100vh', 
            width: "100vw", 
            display: "flex", // Ensures sidebar and dashboard are side-by-side
        }}>
          {/* Sidebar - Fixed Position */}
          <DashboardSidebar />
          

            {/* Main Content Wrapper (Pushes Right of Sidebar) */}
            <Box sx={{ flexGrow: 1, marginLeft: "210px", display: "flex", flexDirection: "column" }}>
                
                {/* Header - Fixed Position */}
                <DashboardHeader />
                <DashboardTitleBar />
                {/* Scrollable Content */}
                <Box sx={{ 
                    flexGrow: 1, 
                    overflowY: "auto", // Enables scrolling for content
                    height: "100%", // Ensures it fills the remaining spac
                }}>
                 
                    <Dashboard1 />
                </Box>
            </Box>
        </Box>
    );
}

export default AdminDashboard1