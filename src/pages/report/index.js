import React, { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Box, Container } from "@mui/material";
import ReportsOverviewRow from "../../components/adminReports/ReportsOverviewRow";
import ReportsChartsRow from "../../components/adminReports/ReportsChartsRow";

export default function ReportsPage() {
  const { setPageTitle } = useOutletContext() || {};

  useEffect(() => {
    if (setPageTitle) setPageTitle("Reports");
  }, [setPageTitle]);

  return (
    <Container maxWidth="100%" sx={{ py: { md: 4 } }}>
      <Box sx={{ px: { sm: 0, md: 0 } }}>
        {/* First Row: Reports Overview */}
        <ReportsOverviewRow />
        {/* Second Row: Charts */}
        <ReportsChartsRow />
      </Box>
    </Container>
  );
}
