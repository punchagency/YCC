import React from "react";
import {
  Box,
  Card,
  CardContent,
  Skeleton,
  useTheme,
  useMediaQuery,
} from "@mui/material";

// Summary Cards Skeleton
export const SummaryCardsSkeleton = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box>
      {/* Cards Grid Skeleton */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "1fr"
            : isTablet
            ? "repeat(2, 1fr)"
            : "repeat(4, 1fr)",
          gap: isMobile ? 3 : 4,
        }}
      >
        {[1, 2, 3, 4].map((index) => (
          <Card
            key={index}
            sx={{
              background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
              borderRadius: 4,
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              border: "1px solid #e2e8f0",
            }}
          >
            <CardContent sx={{ p: isMobile ? 3 : 4 }}>
              {/* Icon Skeleton */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 3,
                }}
              >
                <Skeleton
                  variant="rectangular"
                  width={56}
                  height={56}
                  sx={{ borderRadius: 3 }}
                />
              </Box>

              {/* Amount Skeleton */}
              <Skeleton
                variant="text"
                width={isMobile ? "80%" : "70%"}
                height={isMobile ? "32px" : "40px"}
                sx={{ mb: 1 }}
              />

              {/* Title Skeleton */}
              <Skeleton
                variant="text"
                width="60%"
                height={isMobile ? "24px" : "28px"}
                sx={{ mb: 1 }}
              />

              {/* Description Skeleton */}
              <Skeleton variant="text" width="80%" height="20px" />
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

// Type Breakdown Skeleton
export const TypeBreakdownSkeleton = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Card
      sx={{
        background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        borderRadius: 3,
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        border: "1px solid #e2e8f0",
      }}
    >
      <CardContent sx={{ p: isMobile ? 3 : 4 }}>
        {/* Header Skeleton */}
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Skeleton
            variant="text"
            width={isMobile ? "150px" : "200px"}
            height={isMobile ? "28px" : "32px"}
            sx={{ mx: "auto", mb: 1 }}
          />
          <Skeleton
            variant="text"
            width={isMobile ? "200px" : "300px"}
            height="20px"
            sx={{ mx: "auto" }}
          />
        </Box>

        {/* Type Items Skeleton */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {[1, 2, 3].map((index) => (
            <Box key={index}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                  }}
                >
                  {/* Icon Container Skeleton */}
                  <Skeleton
                    variant="rectangular"
                    width={48}
                    height={48}
                    sx={{ borderRadius: 3 }}
                  />
                  <Box>
                    {/* Type Label Skeleton */}
                    <Skeleton
                      variant="text"
                      width={isMobile ? "80px" : "100px"}
                      height={isMobile ? "20px" : "24px"}
                      sx={{ mb: 0.5 }}
                    />
                    {/* Count Skeleton */}
                    <Skeleton
                      variant="text"
                      width={isMobile ? "60px" : "80px"}
                      height="16px"
                    />
                  </Box>
                </Box>

                <Box sx={{ textAlign: "right" }}>
                  {/* Amount Skeleton */}
                  <Skeleton
                    variant="text"
                    width={isMobile ? "80px" : "100px"}
                    height={isMobile ? "20px" : "24px"}
                    sx={{ mb: 0.5 }}
                  />
                  {/* Percentage Skeleton */}
                  <Skeleton
                    variant="text"
                    width={isMobile ? "40px" : "50px"}
                    height="16px"
                  />
                </Box>
              </Box>

              {/* Progress Bar Skeleton */}
              <Skeleton
                variant="rectangular"
                width="100%"
                height={8}
                sx={{ borderRadius: 4 }}
              />
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

// Invoice Table Skeleton
export const InvoiceTableSkeleton = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Card
      sx={{
        background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        borderRadius: 3,
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        border: "1px solid #e2e8f0",
      }}
    >
      <CardContent sx={{ p: isMobile ? 2 : 4 }}>
        {/* Header Skeleton */}
        <Box sx={{ mb: 4 }}>
          <Skeleton
            variant="text"
            width={isMobile ? "150px" : "200px"}
            height={isMobile ? "28px" : "32px"}
            sx={{ mb: 1 }}
          />
          <Skeleton
            variant="text"
            width={isMobile ? "250px" : "350px"}
            height="20px"
          />
        </Box>

        {/* Table Header Skeleton */}
        <Box
          sx={{
            overflowX: isMobile ? "auto" : "hidden",
            borderRadius: 3,
            border: "1px solid #e5e7eb",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "1fr"
                : "1fr 1.5fr 1fr 1fr 1fr 1fr 80px",
              gap: 2,
              mb: 2,
              p: 2,
              backgroundColor: "#f8fafc",
              borderRadius: 2,
              // Set minimum width to prevent squishing on mobile
              minWidth: isMobile ? "800px" : "auto",
            }}
          >
            {[
              "Invoice",
              "Customer",
              "Amount",
              "Status",
              "Type",
              "Date",
              "Actions",
            ].map((header, index) => (
              <Skeleton
                key={index}
                variant="text"
                width="100%"
                height={isMobile ? "20px" : "24px"}
                sx={{ fontWeight: 600 }}
              />
            ))}
          </Box>

          {/* Table Rows Skeleton */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              // Set minimum width to prevent squishing on mobile
              minWidth: isMobile ? "800px" : "auto",
            }}
          >
            {[1, 2, 3, 4, 5].map((rowIndex) => (
              <Box
                key={rowIndex}
                sx={{
                  display: "grid",
                  gridTemplateColumns: isMobile
                    ? "1fr"
                    : "1fr 1.5fr 1fr 1fr 1fr 1fr 80px",
                  gap: 2,
                  p: 2,
                  borderBottom: "1px solid #e5e7eb",
                  "&:last-child": { borderBottom: "none" },
                }}
              >
                {/* Invoice ID */}
                <Skeleton variant="text" width="100%" height="20px" />

                {/* Customer */}
                <Box>
                  <Skeleton
                    variant="text"
                    width="80%"
                    height="20px"
                    sx={{ mb: 0.5 }}
                  />
                  <Skeleton variant="text" width="60%" height="16px" />
                </Box>

                {/* Amount */}
                <Skeleton variant="text" width="100%" height="20px" />

                {/* Status */}
                <Skeleton
                  variant="rectangular"
                  width={isMobile ? "60px" : "80px"}
                  height="24px"
                  sx={{ borderRadius: "12px" }}
                />

                {/* Type */}
                <Skeleton
                  variant="rectangular"
                  width={isMobile ? "60px" : "80px"}
                  height="24px"
                  sx={{ borderRadius: "12px" }}
                />

                {/* Date */}
                <Skeleton variant="text" width="100%" height="20px" />

                {/* Actions */}
                <Skeleton
                  variant="circular"
                  width={32}
                  height={32}
                  sx={{ mx: "auto" }}
                />
              </Box>
            ))}
          </Box>
        </Box>

        {/* Pagination Skeleton */}
        <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
          <Skeleton
            variant="rectangular"
            width={isMobile ? "280px" : "320px"}
            height="40px"
            sx={{ borderRadius: 2 }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

// Main Financial Management Skeleton (for the entire page)
export const FinancialManagementSkeleton = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#F8FBFF",
        p: isMobile ? 2 : isTablet ? 3 : 4,
      }}
    >
      <Box sx={{ maxWidth: "100%", mx: "auto" }}>
        {/* Summary Cards Skeleton */}
        <Box sx={{ mb: 4 }}>
          <SummaryCardsSkeleton />
        </Box>

        {/* Type Breakdown Skeleton */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Box sx={{ width: "100%", maxWidth: "600px" }}>
              <TypeBreakdownSkeleton />
            </Box>
          </Box>
        </Box>

        {/* Invoice Table Skeleton */}
        <Box>
          <InvoiceTableSkeleton />
        </Box>
      </Box>
    </Box>
  );
};
