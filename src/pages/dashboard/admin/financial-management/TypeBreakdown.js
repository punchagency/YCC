import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { ShoppingCart, Event, Description } from "@mui/icons-material";
import { TypeBreakdownSkeleton } from "../../../../components/FinancialManagementSkeletons";

const TypeBreakdown = ({ byType, totalAmount, loading }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Show skeleton if loading
  if (loading) {
    return <TypeBreakdownSkeleton />;
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount / 100); // Convert from cents to dollars
  };

  // Calculate percentage
  const calculatePercentage = (typeAmount) => {
    if (!totalAmount || totalAmount === 0) return 0;
    return ((typeAmount / totalAmount) * 100).toFixed(1);
  };

  const typeConfig = {
    order: {
      label: "Orders",
      icon: <ShoppingCart sx={{ fontSize: 28, color: "#0387D9" }} />,
      color: "#0387D9",
      bgColor: "rgba(3, 135, 217, 0.1)",
    },
    booking: {
      label: "Bookings",
      icon: <Event sx={{ fontSize: 28, color: "#10B981" }} />,
      color: "#10B981",
      bgColor: "rgba(16, 185, 129, 0.1)",
    },
    quote: {
      label: "Quotes",
      icon: <Description sx={{ fontSize: 28, color: "#F59E0B" }} />,
      color: "#F59E0B",
      bgColor: "rgba(245, 158, 11, 0.1)",
    },
  };

  // Always show all three types, even if no data
  const allTypes = Object.keys(typeConfig).map((type) => {
    const typeData = byType?.[type] || { totalAmount: 0, count: 0 };
    return {
      type,
      ...typeData,
      ...typeConfig[type],
    };
  });

  return (
    <Card
      sx={{
        background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        borderRadius: 3,
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        border: "1px solid #e2e8f0",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        },
      }}
    >
      <CardContent sx={{ p: isMobile ? 3 : 4 }}>
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "#1f2937",
              mb: 1,
              fontSize: isMobile ? "1.125rem" : "1.25rem",
            }}
          >
            Invoice Breakdown
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#6b7280",
              fontSize: isMobile ? "0.875rem" : "0.875rem",
            }}
          >
            Distribution of invoices across different types
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {allTypes.map((typeData, index) => (
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
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 3,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: typeData.bgColor,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                  >
                    {typeData.icon}
                  </Box>
                  <Box>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        color: "#1f2937",
                        fontSize: isMobile ? "0.875rem" : "1rem",
                        mb: 0.5,
                      }}
                    >
                      {typeData.label}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#6b7280",
                        fontSize: isMobile ? "0.75rem" : "0.875rem",
                        fontWeight: 500,
                      }}
                    >
                      {typeData.count} invoices
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ textAlign: "right" }}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      color: "#1f2937",
                      fontSize: isMobile ? "0.875rem" : "1rem",
                      mb: 0.5,
                    }}
                  >
                    {formatCurrency(typeData.totalAmount)}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: typeData.color,
                      fontSize: isMobile ? "0.75rem" : "0.875rem",
                      fontWeight: 600,
                    }}
                  >
                    {calculatePercentage(typeData.totalAmount)}%
                  </Typography>
                </Box>
              </Box>

              <LinearProgress
                variant="determinate"
                value={parseFloat(calculatePercentage(typeData.totalAmount))}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "#e5e7eb",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: typeData.color,
                    borderRadius: 4,
                    transition: "all 0.3s ease",
                  },
                }}
              />
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default TypeBreakdown;
