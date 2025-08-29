import React from "react";
import { Box, Skeleton, Grid, Card, CardContent } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  border: "none",
  backgroundColor: "rgba(255, 255, 255, 0.7)",
  backdropFilter: "blur(8px)",
  borderRadius: "12px",
}));

const BookingDetailsSkeleton = () => {
  return (
    <Box
      sx={{
        background:
          "linear-gradient(to bottom right, #f8fafc, rgba(59, 130, 246, 0.05))",
        minHeight: "100vh",
        p: { md: 3 },
      }}
    >
      {/* Booking ID + Copy icon */}
      <Box sx={{ mb: 3, mt: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Skeleton variant="text" width={90} height={20} />
          <Skeleton
            variant="rectangular"
            width={220}
            height={32}
            sx={{ borderRadius: "8px" }}
          />
          <Skeleton variant="circular" width={32} height={32} />
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Main Column */}
        <Grid item xs={12} lg={8}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Summary */}
            <StyledCard>
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
                >
                  <Skeleton variant="circular" width={24} height={24} />
                  <Skeleton variant="text" width={140} height={30} />
                </Box>
                <Grid container spacing={2}>
                  {[1, 2, 3].map((i) => (
                    <Grid item xs={12} sm={6} key={`sum-${i}`}>
                      <Skeleton variant="text" width={100} height={16} />
                      <Skeleton variant="text" width={160} height={24} />
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </StyledCard>

            {/* Services */}
            <StyledCard>
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
                >
                  <Skeleton variant="circular" width={24} height={24} />
                  <Skeleton variant="text" width={120} height={28} />
                </Box>
                {[1, 2, 3].map((i) => (
                  <Box
                    key={`svc-${i}`}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      py: 1,
                      borderBottom: "1px solid #eef2f7",
                    }}
                  >
                    <Skeleton variant="text" width={220} height={20} />
                    <Skeleton variant="text" width={80} height={20} />
                  </Box>
                ))}
              </CardContent>
            </StyledCard>

            {/* Quote */}
            <StyledCard>
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
                >
                  <Skeleton variant="circular" width={24} height={24} />
                  <Skeleton variant="text" width={100} height={28} />
                </Box>
                <Grid container spacing={2}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Grid item xs={12} sm={6} key={`q-${i}`}>
                      <Skeleton variant="text" width={100} height={16} />
                      <Skeleton variant="text" width={140} height={24} />
                    </Grid>
                  ))}
                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                      <Skeleton
                        variant="rectangular"
                        width={140}
                        height={36}
                        sx={{ borderRadius: "8px" }}
                      />
                      <Skeleton
                        variant="rectangular"
                        width={160}
                        height={36}
                        sx={{ borderRadius: "8px" }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </StyledCard>
          </Box>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Service Provider */}
            <StyledCard>
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
                >
                  <Skeleton variant="circular" width={20} height={20} />
                  <Skeleton variant="text" width={160} height={26} />
                </Box>
                <Skeleton variant="text" width={200} height={22} />
                <Skeleton variant="text" width={120} height={18} />
              </CardContent>
            </StyledCard>

            {/* Crew */}
            <StyledCard>
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
                >
                  <Skeleton variant="circular" width={20} height={20} />
                  <Skeleton variant="text" width={80} height={26} />
                </Box>
                <Skeleton variant="text" width={180} height={22} />
                <Skeleton variant="text" width={120} height={18} />
              </CardContent>
            </StyledCard>

            {/* Location & Contact */}
            <StyledCard>
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
                >
                  <Skeleton variant="circular" width={20} height={20} />
                  <Skeleton variant="text" width={160} height={26} />
                </Box>
                <Skeleton variant="text" width={120} height={16} />
                <Skeleton variant="text" width={220} height={20} />
                <Skeleton
                  variant="text"
                  width={140}
                  height={16}
                  sx={{ mt: 1 }}
                />
                <Skeleton variant="text" width={160} height={20} />
              </CardContent>
            </StyledCard>

            {/* Notes & Attachments */}
            <StyledCard>
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
                >
                  <Skeleton variant="circular" width={20} height={20} />
                  <Skeleton variant="text" width={180} height={26} />
                </Box>
                <Skeleton variant="text" width="100%" height={18} />
                <Skeleton variant="text" width="80%" height={18} />
                <Skeleton
                  variant="rectangular"
                  width={160}
                  height={16}
                  sx={{ mt: 1, borderRadius: "4px" }}
                />
                <Skeleton
                  variant="rectangular"
                  width={180}
                  height={16}
                  sx={{ mt: 1, borderRadius: "4px" }}
                />
              </CardContent>
            </StyledCard>

            {/* Status History */}
            <StyledCard>
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
                >
                  <Skeleton variant="circular" width={20} height={20} />
                  <Skeleton variant="text" width={140} height={26} />
                </Box>
                {[1, 2, 3].map((i) => (
                  <Box key={`hist-${i}`} sx={{ mb: 1.5 }}>
                    <Skeleton variant="text" width={200} height={18} />
                    <Skeleton variant="text" width={160} height={14} />
                  </Box>
                ))}
              </CardContent>
            </StyledCard>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BookingDetailsSkeleton;
