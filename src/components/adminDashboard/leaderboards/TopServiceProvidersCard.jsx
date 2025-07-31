import React from "react";
import {
  Box,
  Typography,
  Skeleton,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Support as SupportIcon,
  Event as BookingsIcon,
} from "@mui/icons-material";

/**
 * TopServiceProvidersCard Component
 * Displays top service providers with their bookings statistics
 *
 * @param {Object} props - Component props
 * @param {Array} props.data - Array of top service providers data
 * @param {boolean} props.loading - Loading state
 * @param {string} props.error - Error message
 * @param {Function} props.onProviderClick - Callback for service provider clicks
 * @returns {JSX.Element} TopServiceProvidersCard component
 */
const TopServiceProvidersCard = ({
  data = [],
  loading = false,
  error = null,
  onProviderClick,
}) => {
  // Ranking badge configuration
  const getRankingBadge = (index) => {
    const badges = {
      0: { color: "#FFD700", label: "1st", icon: "🥇" }, // Gold
      1: { color: "#C0C0C0", label: "2nd", icon: "🥈" }, // Silver
      2: { color: "#CD7F32", label: "3rd", icon: "🥉" }, // Bronze
    };
    return (
      badges[index] || { color: "#6B7280", label: `${index + 1}th`, icon: "🏆" }
    );
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{ width: "100%", height: "100%" }}>
        <Skeleton variant="text" width="60%" height={32} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={200} sx={{ mb: 1 }} />
        <Skeleton variant="rectangular" height={200} sx={{ mb: 1 }} />
        <Skeleton variant="rectangular" height={200} />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box
        sx={{
          height: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fef2f2",
          border: "1px solid #fecaca",
          borderRadius: 2,
        }}
      >
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  // No data state
  if (!data || data.length === 0) {
    return (
      <Box
        sx={{
          height: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: 2,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          No service provider data available
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      {/* Card Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 2,
        }}
      >
        <SupportIcon sx={{ color: "primary.main", fontSize: 20 }} />
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, color: "text.primary" }}
        >
          Top Service Providers
        </Typography>
      </Box>

      {/* Service Providers List */}
      <List sx={{ p: 0 }}>
        {data.map((provider, index) => {
          const badge = getRankingBadge(index);
          return (
            <React.Fragment key={index}>
              <ListItem
                sx={{
                  px: 0,
                  py: 1.5,
                  cursor: "pointer",
                  borderRadius: 1,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                    transform: "translateX(4px)",
                  },
                }}
                onClick={() =>
                  onProviderClick && onProviderClick(provider, index)
                }
              >
                <ListItemAvatar sx={{ minWidth: 48 }}>
                  <Box
                    sx={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        backgroundColor: "warning.50",
                        color: "warning.main",
                        fontSize: "1rem",
                        fontWeight: 600,
                      }}
                    >
                      {provider.name?.charAt(0)?.toUpperCase() || "P"}
                    </Avatar>
                    <Chip
                      label={badge.icon}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: -8,
                        right: -8,
                        backgroundColor: badge.color,
                        color: "white",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        minWidth: 20,
                        height: 20,
                        "& .MuiChip-label": {
                          px: 0.5,
                        },
                      }}
                    />
                  </Box>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        color: "text.primary",
                        fontSize: "0.9rem",
                      }}
                    >
                      {provider.name || "Unknown Provider"}
                    </Typography>
                  }
                  secondary={
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        mt: 0.5,
                      }}
                    >
                      <BookingsIcon
                        sx={{ fontSize: 14, color: "text.secondary" }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {provider.bookings || 0} bookings
                      </Typography>
                    </Box>
                  }
                />
                <Box sx={{ textAlign: "right" }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: "success.main",
                      fontSize: "0.85rem",
                    }}
                  >
                    ${(provider.totalAmount || 0).toLocaleString()}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      fontSize: "0.7rem",
                    }}
                  >
                    {badge.label}
                  </Typography>
                </Box>
              </ListItem>
              {index < data.length - 1 && (
                <Divider sx={{ my: 0.5, opacity: 0.3 }} />
              )}
            </React.Fragment>
          );
        })}
      </List>
    </Box>
  );
};

export default TopServiceProvidersCard;
