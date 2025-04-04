import { Box, Typography } from "@mui/material";
import DashboardTitleBar from "../../../../components/dashboard/title-bar";
import Section1FinancialManagement from "./section1-financial-management";
import Section2FinancialManagement from "./section2-financial-management";
import Section3FinancialManagement from "./section3-financial-management";


const AdminFinancialManagement = () => {
  return (
    <Box
    sx={{
      height: "100%",
      width: "100%",
      maxWidth: "100%",
      display: "flex",
      flexDirection: "column",
    }}
  >
      <DashboardTitleBar title="Financial Management" />
      <Section1FinancialManagement />
      <Section2FinancialManagement />
      <Section3FinancialManagement />
  </Box>
  );
};

export default AdminFinancialManagement;

