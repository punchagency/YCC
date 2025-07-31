import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import React from "react";

const AdminFinancialManagement = () => {
  const { setPageTitle } = useOutletContext() || {};

  React.useEffect(() => {
    if (setPageTitle) setPageTitle("Financial Management");
  }, [setPageTitle]);

  useEffect(() => {
    try {
      console.log("UseEffect");
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F8FBFF",
      }}
    >
      <Typography>Financial Management Page under construction</Typography>
    </Box>
  );
};

export default AdminFinancialManagement;
