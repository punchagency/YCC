import { Outlet } from "react-router-dom";
import LandingPageHeader from "../components/landing-page-header";
import { Box } from "@mui/material";
import { LandingPageAIProvider } from "../context/AIAssistant/landingPageAIContext";
const LandingPageLayout = () => {
  return (
    <LandingPageAIProvider>
      <Box component="main" sx={{ minHeight: "100vh" }}>
        <LandingPageHeader />
        <Outlet />
      </Box>
    </LandingPageAIProvider>
  );
}

export default LandingPageLayout;
