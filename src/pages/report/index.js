import React, { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Box, Container } from "@mui/material";
import ReportsOverviewRow from "../../components/adminReports/ReportsOverviewRow";

export default function ReportsPage() {
  const { setPageTitle } = useOutletContext() || {};

  useEffect(() => {
    if (setPageTitle) setPageTitle("Reports");
  }, [setPageTitle]);

  return (
    <Container maxWidth="100%" sx={{ py: { md: 4 } }}>
      <Box sx={{ px: { sm: 0, md: 2 } }}>
        {/* First Row: Reports Overview */}
        <ReportsOverviewRow />
      </Box>
    </Container>
  );
}
