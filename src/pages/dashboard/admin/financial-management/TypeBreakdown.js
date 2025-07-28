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

const TypeBreakdown = ({ byType, totalAmount }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
      icon: <ShoppingCart sx={{ fontSize: 24, color: "#0387D9" }} />,
      color: "#0387D9",
      bgColor: "rgba(3, 135, 217, 0.1)",
    },
    booking: {
      label: "Bookings",
      icon: <Event sx={{ fontSize: 24, color: "#10B981" }} />,
      color: "#10B981",
      bgColor: "rgba(16, 185, 129, 0.1)",
    },
    quote: {
      label: "Quotes",
      icon: <Description sx={{ fontSize: 24, color: "#F59E0B" }} />,
      color: "#F59E0B",
      bgColor: "rgba(245, 158, 11, 0.1)",
    },
  };

  const types = Object.keys(byType || {}).map((type) => ({
    type,
    ...byType[type],
    ...typeConfig[type],
  }));

  return (
    <Card
      sx={{
        background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        borderRadius: 3,
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        border: "1px solid #e2e8f0",
        mb: 4,
      }}
    >
      <CardContent sx={{ p: isMobile ? 2 : 3 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: "#1f2937",
            mb: 3,
            fontSize: isMobile ? "1.125rem" : "1.25rem",
          }}
        >
          Revenue by Type
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {types.map((typeData, index) => (
            <Box key={index}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: typeData.bgColor,
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
                      }}
                    >
                      {typeData.label}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#6b7280",
                        fontSize: isMobile ? "0.75rem" : "0.875rem",
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
                    }}
                  >
                    {formatCurrency(typeData.totalAmount)}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#6b7280",
                      fontSize: isMobile ? "0.75rem" : "0.875rem",
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
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: "#e5e7eb",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: typeData.color,
                    borderRadius: 3,
                  },
                }}
              />
            </Box>
          ))}
        </Box>

        {types.length === 0 && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              py: 4,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "#6b7280",
                fontStyle: "italic",
              }}
            >
              No invoice data available
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default TypeBreakdown;
