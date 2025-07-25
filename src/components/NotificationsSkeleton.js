import React from "react";
import { Box, Card, CardContent, useMediaQuery } from "@mui/material";
import { useTheme as useMuiTheme } from "@mui/material/styles";

// Shimmer style for custom skeletons
const shimmerStyle = {
  background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.5s infinite",
};

// Keyframes for shimmer (for inline style)
const shimmerKeyframes = `
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}`;

const FilterSkeleton = ({ isMobile }) => (
  <Box
    sx={{
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      borderRadius: "12px",
      p: isMobile ? "16px" : "20px",
      mt: isMobile ? 0 : 0,
      mb: isMobile ? "6px" : "4px",
      mx: isMobile ? "16px" : "20px",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
      border: "1px solid #e2e8f0",
      display: "flex",
      alignItems: "center",
      gap: isMobile ? "12px" : "16px",
      flexWrap: isMobile ? "wrap" : "nowrap",
    }}
  >
    <style>{shimmerKeyframes}</style>
    {/* Filter label skeleton */}
    <Box
      sx={{
        width: isMobile ? 60 : 80,
        height: isMobile ? 18 : 22,
        borderRadius: 1,
        ...shimmerStyle,
      }}
    />
    {/* Priority/type dropdown skeleton */}
    <Box
      sx={{
        width: isMobile ? 120 : 160,
        height: isMobile ? 32 : 38,
        borderRadius: 2,
        ...shimmerStyle,
      }}
    />
    {/* Status dropdown skeleton */}
    <Box
      sx={{
        width: isMobile ? 120 : 160,
        height: isMobile ? 32 : 38,
        borderRadius: 2,
        ...shimmerStyle,
      }}
    />
    {/* Active filter chips skeleton (optional, only if filters are active) */}
    <Box
      sx={{
        width: isMobile ? 60 : 80,
        height: isMobile ? 22 : 26,
        borderRadius: 2,
        ...shimmerStyle,
        ml: "auto",
        display: { xs: "none", sm: "block" },
      }}
    />
  </Box>
);

const NotificationTableSkeleton = ({ isTablet, isMobile }) => {
  // Table columns: Type, Title, Message, Status, Actions
  const columns = [
    { width: isTablet ? 80 : 100 }, // Type
    { width: isTablet ? 120 : 180 }, // Title
    { width: isTablet ? 200 : 300 }, // Message
    { width: isTablet ? 120 : 150 }, // Status
    { width: isTablet ? 100 : 120 }, // Actions
  ];
  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "#F8FBFF",
        borderRadius: 2,
        mt: 0,
        mx: isMobile ? "16px" : "20px",
        mb: isMobile ? 0 : 0,
      }}
    >
      <style>{shimmerKeyframes}</style>
      <Box
        sx={{
          border: "1px solid #EAECF0",
          borderRadius: 2,
          overflow: "hidden",
          background: "#fff",
        }}
      >
        {/* Table Header Skeleton */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            background: "#F9FAFB",
            borderBottom: "1px solid #EAECF0",
            px: isTablet ? 2 : 3,
            py: isTablet ? 1.25 : 1.5,
          }}
        >
          {columns.map((col, idx) => (
            <Box
              key={idx}
              sx={{
                width: col.width,
                mr: idx !== columns.length - 1 ? (isTablet ? 1.5 : 2.5) : 0,
                height: 18,
                borderRadius: 1,
                ...shimmerStyle,
              }}
            />
          ))}
        </Box>
        {/* Table Body Skeleton Rows */}
        {Array.from({ length: 5 }).map((_, rowIdx) => (
          <Box
            key={rowIdx}
            sx={{
              display: "flex",
              alignItems: "center",
              borderBottom: rowIdx !== 4 ? "1px solid #EAECF0" : "none",
              px: isTablet ? 2 : 3,
              py: isTablet ? 1.5 : 2,
              background: "#fff",
            }}
          >
            {/* Type badge */}
            <Box
              sx={{
                width: columns[0].width,
                height: 24,
                borderRadius: 2,
                ...shimmerStyle,
                mr: isTablet ? 1.5 : 2.5,
              }}
            />
            {/* Title */}
            <Box
              sx={{
                width: columns[1].width,
                height: 16,
                borderRadius: 1,
                ...shimmerStyle,
                mr: isTablet ? 1.5 : 2.5,
              }}
            />
            {/* Message */}
            <Box
              sx={{
                width: columns[2].width,
                height: 16,
                borderRadius: 1,
                ...shimmerStyle,
                mr: isTablet ? 1.5 : 2.5,
              }}
            />
            {/* Status badge */}
            <Box
              sx={{
                width: columns[3].width,
                height: 24,
                borderRadius: 2,
                ...shimmerStyle,
                mr: isTablet ? 1.5 : 2.5,
              }}
            />
            {/* Actions button */}
            <Box
              sx={{
                width: columns[4].width,
                height: 32,
                borderRadius: 2,
                ...shimmerStyle,
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const NotificationCardSkeleton = () => (
  <Box sx={{ px: "15px", width: "100%" }}>
    <style>{shimmerKeyframes}</style>
    {Array.from({ length: 5 }).map((_, idx) => (
      <Card
        key={idx}
        sx={{
          mb: 2,
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          backgroundColor: "#F8FBFF",
          width: "100%",
        }}
      >
        <CardContent sx={{ p: 2 }}>
          {/* Top badges */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 1.5,
              alignItems: "center",
            }}
          >
            <Box
              sx={{ width: 60, height: 24, borderRadius: 2, ...shimmerStyle }}
            />
            <Box
              sx={{ width: 60, height: 24, borderRadius: 2, ...shimmerStyle }}
            />
          </Box>
          {/* Title */}
          <Box
            sx={{
              width: "60%",
              height: 16,
              borderRadius: 1,
              ...shimmerStyle,
              mb: 1,
            }}
          />
          {/* Message */}
          <Box
            sx={{
              width: "90%",
              height: 14,
              borderRadius: 1,
              ...shimmerStyle,
              mb: 2,
            }}
          />
          {/* Bottom row: date and button */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box
              sx={{ width: 80, height: 12, borderRadius: 1, ...shimmerStyle }}
            />
            <Box
              sx={{ width: 60, height: 28, borderRadius: 2, ...shimmerStyle }}
            />
          </Box>
        </CardContent>
      </Card>
    ))}
  </Box>
);

export default function NotificationsSkeleton() {
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(muiTheme.breakpoints.between("sm", "md"));

  return (
    <Box
      sx={{
        width: "100%",
        pt: isMobile ? "67px" : 0,
        bgcolor: "#F8FBFF",
        minHeight: "100vh",
      }}
    >
      <FilterSkeleton isMobile={isMobile} />
      {isMobile ? (
        <NotificationCardSkeleton />
      ) : (
        <NotificationTableSkeleton isTablet={isTablet} isMobile={isMobile} />
      )}
    </Box>
  );
}
