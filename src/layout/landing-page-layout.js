import { Outlet } from "react-router-dom";
import LandingPageHeader from "../components/landing-page-header";
import { useState } from "react";
import { Box } from "@mui/material";

export default function LandingPageLayout() {
  return (
    <Box component="main" sx={{ minHeight: "100vh"}}>
     {/* <LandingPageHeader/> */}
      <Outlet />
   
    </Box>
  );
}
