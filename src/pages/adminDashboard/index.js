import React, { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Box, Container } from "@mui/material";
import UserStatsRow from "../../components/adminDashboard/UserStatsRow";

export default function AdminDashboard() {
  const { setPageTitle } = useOutletContext() || {};

  useEffect(() => {
    if (setPageTitle) setPageTitle("Dashboard");
  }, [setPageTitle]);

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Box sx={{ px: { xs: 0, sm: 0, md: 2 } }}>
        {/* First Row: User Stats */}
        <UserStatsRow />

        {/* Second Row: Charts (coming soon) */}
        {/* <PlatformTrendsRow /> */}

        {/* Third Row: Leaderboards (coming soon) */}
        {/* <LeaderboardsRow /> */}
      </Box>
    </Container>
  );
}
