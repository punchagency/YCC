import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  Payment,
} from "@mui/icons-material";
import { SummaryCardsSkeleton } from "../../../../components/FinancialManagementSkeletons";

const SummaryCards = ({ summary, loading }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // Show skeleton if loading
  if (loading) {
    return <SummaryCardsSkeleton />;
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount); // Amount is already in dollars
  };

  const cards = [
    {
      title: "Total Invoices",
      value: formatCurrency(summary?.totalAmount || 0),
      icon: <AccountBalance sx={{ fontSize: 28, color: "#0387D9" }} />,
      color: "#0387D9",
      bgColor: "rgba(3, 135, 217, 0.1)",
    },
    {
      title: "Paid Amount",
      value: formatCurrency(summary?.totalPaid || 0),
      icon: <TrendingUp sx={{ fontSize: 28, color: "#10B981" }} />,
      color: "#10B981",
      bgColor: "rgba(16, 185, 129, 0.1)",
    },
    {
      title: "Pending Amount",
      value: formatCurrency(summary?.totalPending || 0),
      icon: <Payment sx={{ fontSize: 28, color: "#F59E0B" }} />,
      color: "#F59E0B",
      bgColor: "rgba(245, 158, 11, 0.1)",
    },
    {
      title: "Failed Amount",
      value: formatCurrency(summary?.totalFailed || 0),
      icon: <TrendingDown sx={{ fontSize: 28, color: "#EF4444" }} />,
      color: "#EF4444",
      bgColor: "rgba(239, 68, 68, 0.1)",
    },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: isMobile
          ? "1fr"
          : isTablet
          ? "repeat(2, 1fr)"
          : "repeat(4, 1fr)",
        gap: isMobile ? 2 : 3,
        mb: 1,
      }}
    >
      {cards.map((card, index) => (
        <Card
          key={index}
          sx={{
            background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
            borderRadius: 3,
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            border: "1px solid #e2e8f0",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          <CardContent
            sx={{
              p: isMobile ? 2 : 3,
              "&:last-child": { pb: isMobile ? 2 : 3 },
            }}
          >
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
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: card.bgColor,
                }}
              >
                {card.icon}
              </Box>
            </Box>

            <Typography
              variant={isMobile ? "h6" : "h5"}
              component="div"
              sx={{
                fontWeight: 700,
                color: "#1f2937",
                mb: 1,
                fontSize: isMobile ? "1.125rem" : "1.5rem",
              }}
            >
              {card.value}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#6b7280",
                fontWeight: 500,
                fontSize: isMobile ? "0.75rem" : "0.875rem",
              }}
            >
              {card.title}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default SummaryCards;
