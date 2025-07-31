import React, { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Box, Container } from "@mui/material";
import UserStatsRow from "../../components/adminDashboard/UserStatsRow";
import PlatformTrendsRow from "../../components/adminDashboard/PlatformTrendsRow";

export default function AdminDashboard() {
  const { setPageTitle } = useOutletContext() || {};

  useEffect(() => {
    if (setPageTitle) setPageTitle("Dashboard");
  }, [setPageTitle]);

  return (
    <Container maxWidth="100%" sx={{ py: { md: 2 } }}>
      <Box sx={{ px: { sm: 0, md: 2 } }}>
        {/* First Row: User Stats */}
        <UserStatsRow />

        {/* Second Row: Charts */}
        <PlatformTrendsRow />

        {/* Third Row: Leaderboards (coming soon) */}
        {/* <LeaderboardsRow /> */}
      </Box>
    </Container>
  );
}
