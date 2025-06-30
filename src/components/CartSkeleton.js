import React from "react";
import {
  Box,
  Card,
  CardContent,
  Skeleton,
  Divider,
  Grid,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  border: "none",
  backgroundColor: "rgba(255, 255, 255, 0.7)",
  backdropFilter: "blur(8px)",
  borderRadius: "12px",
  marginBottom: theme.spacing(2),
}));

const CartItemSkeleton = () => (
  <Box sx={{ display: "flex", alignItems: "center", p: 2, gap: 2 }}>
    <Skeleton
      variant="rectangular"
      width={80}
      height={80}
      sx={{ borderRadius: 2, bgcolor: "#f3f4f6" }}
    />
    
    <Box sx={{ flex: 1 }}>
      <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="40%" height={16} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="30%" height={16} />
    </Box>
    
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
      <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 1 }} />
      <Skeleton variant="text" width={60} height={20} />
    </Box>
    
    <Skeleton variant="circular" width={32} height={32} />
  </Box>
);

const SupplierGroupSkeleton = () => (
  <StyledCard>
    <CardContent sx={{ p: 0 }}>
      <Box sx={{ p: 3, pb: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="40%" height={28} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="60%" height={16} sx={{ mb: 0.5 }} />
            <Skeleton variant="text" width="50%" height={16} />
          </Box>
          <Skeleton variant="text" width={100} height={24} />
        </Box>
      </Box>
      
      <Divider />
      
      <Box>
        {[1, 2, 3].map((item) => (
          <React.Fragment key={item}>
            <CartItemSkeleton />
            {item < 3 && <Divider />}
          </React.Fragment>
        ))}
      </Box>
    </CardContent>
  </StyledCard>
);

const CartSummarySkeleton = () => (
  <StyledCard>
    <CardContent>
      <Skeleton variant="text" width="50%" height={32} sx={{ mb: 3 }} />
      
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Skeleton variant="text" width="30%" height={20} />
          <Skeleton variant="text" width="20%" height={20} />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Skeleton variant="text" width="40%" height={20} />
          <Skeleton variant="text" width="25%" height={20} />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Skeleton variant="text" width="35%" height={20} />
          <Skeleton variant="text" width="15%" height={20} />
        </Box>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Skeleton variant="text" width="40%" height={24} />
        <Skeleton variant="text" width="30%" height={24} />
      </Box>
      
      <Skeleton variant="rectangular" width="100%" height={48} sx={{ borderRadius: 2 }} />
    </CardContent>
  </StyledCard>
);

const CartSkeleton = () => {
  return (
    <Box sx={{ p: 3 }}>
      {/* Header Skeleton */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Skeleton variant="text" width={120} height={40} />
          <Skeleton variant="circular" width={24} height={24} />
        </Box>
        <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: 2 }} />
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          {[1, 2].map((group) => (
            <SupplierGroupSkeleton key={group} />
          ))}
        </Grid>
        
        <Grid item xs={12} lg={4}>
          <CartSummarySkeleton />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CartSkeleton; 