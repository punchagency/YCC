import React from 'react';
import { Box, Skeleton, Grid, Card, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  border: "none",
  backgroundColor: "rgba(255, 255, 255, 0.7)",
  backdropFilter: "blur(8px)",
  borderRadius: "12px",
}));

const OrderDetailsSkeleton = () => {
  return (
    <Box
      sx={{
        background: "linear-gradient(to bottom right, #f8fafc, rgba(59, 130, 246, 0.05))",
        minHeight: "100vh",
        p: { md: 3 },
      }}
    >
      {/* Order ID Section Skeleton */}
      <Box sx={{ mb: 4, mt: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Skeleton variant="text" width={80} height={24} />
          <Skeleton 
            variant="rectangular" 
            width={200} 
            height={32} 
            sx={{ borderRadius: "8px" }}
          />
          <Skeleton variant="circular" width={32} height={32} />
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} lg={8}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            
            {/* Order Summary Skeleton */}
            <StyledCard>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
                  <Skeleton variant="circular" width={24} height={24} />
                  <Skeleton variant="text" width={150} height={32} />
                </Box>

                <Grid container spacing={4}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                      <Skeleton variant="text" width={100} height={16} />
                      <Skeleton variant="text" width={120} height={24} />
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                      <Skeleton variant="text" width={100} height={16} />
                      <Skeleton variant="text" width={140} height={32} />
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                      <Skeleton variant="text" width={100} height={16} />
                      <Skeleton variant="rectangular" width={100} height={28} sx={{ borderRadius: "14px" }} />
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                      <Skeleton variant="text" width={100} height={16} />
                      <Skeleton variant="text" width={80} height={24} />
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </StyledCard>

            {/* Order Items Skeleton */}
            <StyledCard>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
                  <Skeleton variant="circular" width={24} height={24} />
                  <Skeleton variant="text" width={120} height={32} />
                </Box>

                {/* Item 1 */}
                <Box sx={{ mb: 3 }}>
                  <Skeleton variant="text" width={80} height={20} sx={{ mb: 2 }} />
                  <Box sx={{ pl: 2, mb: 2 }}>
                    <Skeleton variant="text" width={200} height={16} />
                    <Skeleton variant="text" width={150} height={16} />
                    <Skeleton variant="text" width={100} height={16} />
                  </Box>
                  
                  {/* Products table skeleton */}
                  <Box sx={{ pl: 2 }}>
                    <Skeleton variant="rectangular" width="100%" height={32} sx={{ mb: 1, borderRadius: "4px" }} />
                    <Skeleton variant="rectangular" width="100%" height={24} sx={{ mb: 1, borderRadius: "4px" }} />
                    <Skeleton variant="rectangular" width="100%" height={24} sx={{ mb: 1, borderRadius: "4px" }} />
                  </Box>
                </Box>

                {/* Item 2 */}
                <Box sx={{ mb: 3 }}>
                  <Skeleton variant="text" width={80} height={20} sx={{ mb: 2 }} />
                  <Box sx={{ pl: 2, mb: 2 }}>
                    <Skeleton variant="text" width={180} height={16} />
                    <Skeleton variant="text" width={140} height={16} />
                    <Skeleton variant="text" width={90} height={16} />
                  </Box>
                  
                  {/* Products table skeleton */}
                  <Box sx={{ pl: 2 }}>
                    <Skeleton variant="rectangular" width="100%" height={32} sx={{ mb: 1, borderRadius: "4px" }} />
                    <Skeleton variant="rectangular" width="100%" height={24} sx={{ mb: 1, borderRadius: "4px" }} />
                  </Box>
                </Box>
              </CardContent>
            </StyledCard>
          </Box>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            
            {/* Export PDF Button Skeleton */}
            <StyledCard>
              <CardContent sx={{ p: 3 }}>
                <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: "8px" }} />
              </CardContent>
            </StyledCard>

            {/* Order Information Skeleton */}
            <StyledCard>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
                  <Skeleton variant="circular" width={24} height={24} />
                  <Skeleton variant="text" width={140} height={32} />
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <Box>
                    <Skeleton variant="text" width={120} height={16} />
                    <Skeleton variant="text" width="100%" height={16} />
                    <Skeleton variant="text" width="80%" height={16} />
                  </Box>

                  <Box>
                    <Skeleton variant="text" width={80} height={16} />
                    <Skeleton variant="text" width="100%" height={16} />
                    <Skeleton variant="text" width="60%" height={16} />
                  </Box>

                  <Box>
                    <Skeleton variant="text" width={100} height={16} />
                    <Skeleton variant="text" width={120} height={16} />
                  </Box>

                  <Box>
                    <Skeleton variant="text" width={80} height={16} />
                    <Skeleton variant="text" width={100} height={16} />
                  </Box>
                </Box>
              </CardContent>
            </StyledCard>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderDetailsSkeleton; 