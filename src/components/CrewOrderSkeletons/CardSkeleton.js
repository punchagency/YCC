import React from "react";
import Box from "@mui/material/Box";
import { Skeleton } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const CardSkeleton = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        minWidth: isMobile ? 200 : "30%",
        maxWidth: isMobile ? 220 : "32%",
        bgcolor: "#ffffff",
        borderRadius: 3,
        p: 3,
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        border: "1px solid #f1f5f9",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Skeleton
        variant="circular"
        width={48}
        height={48}
        sx={{ mr: 2, bgcolor: "#D5B184" }}
      />
      <Box sx={{ flex: 1 }}>
        <Skeleton variant="text" width="60%" height={20} sx={{ mb: 0.5 }} />
        <Skeleton variant="text" width="40%" height={32} />
      </Box>
    </Box>
  );
};

export default CardSkeleton; 