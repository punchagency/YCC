import { Outlet } from "react-router-dom";
import LandingPageHeader from "../components/landing-page-header";
import { useState } from "react";
import { Box } from "@mui/material";
import SimpleBar from 'simplebar-react'
import "simplebar-react/dist/simplebar.min.css";

export default function LandingPageLayout() {
  return (
    <Box component="main" sx={{ minHeight: "100vh"}}>
     {/*<LandingPageHeader/>  */}
     <LandingPageHeader />
   

   {/*  <SimpleBar style={{ maxHeight: "100vh", width: "100vw", overflowX: "hidden" }}> */}
    
      <Outlet />
       {/*</SimpleBar> */}
   
    </Box>
  );
}
