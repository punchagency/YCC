import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Skeleton,
  Typography,
  Select,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import { Pagination as SharedPagination } from "../../components/pagination";
import LaunchIcon from "@mui/icons-material/Launch";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { formatDate } from "../../utils/formatters";

// Using shared formatter from utils to render e.g. 28 Aug 2025

const statusChipProps = (status) => {
  const map = {
    confirmed: {
      sx: {
        backgroundColor: "rgba(3, 135, 217, 0.1)",
        color: "#0387D9",
        border: "1px solid rgba(3, 135, 217, 0.2)",
      },
    },
    completed: {
      sx: {
        backgroundColor: "#ecfdf3",
        color: "#027a48",
        border: "1px solid #d1fae5",
      },
    },
    pending: {
      sx: {
        backgroundColor: "#fffaeb",
        color: "#b54708",
        border: "1px solid #fed7aa",
      },
    },
    cancelled: {
      sx: {
        backgroundColor: "#fef3f2",
        color: "#b42318",
        border: "1px solid #fecaca",
      },
    },
    declined: {
      sx: {
        backgroundColor: "#fef3f2",
        color: "#b42318",
        border: "1px solid #fecaca",
      },
    },
    default: {
      sx: {
        backgroundColor: "#f9fafb",
        color: "#374151",
        border: "1px solid #d1d5db",
      },
    },
  };
  return map[status] || map.default;
};

const AdminBookingsTable = ({
  bookings = [],
  loading = false,
  error = null,
  pagination = { page: 1, limit: 10, total: 0, totalPages: 0 },
  onPageChange = () => {},
  onLimitChange = () => {},
}) => {
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(muiTheme.breakpoints.between("sm", "md"));
  const handlePageChange = (event, value) => {
    onPageChange(value);
  };

  const handleLimitChange = (event) => {
    onLimitChange(parseInt(event.target.value));
  };

  return (
    <Box sx={{ mt: 0 }}>
      <TableContainer
        component={Paper}
        sx={{ borderRadius: 2, boxShadow: "0 1px 2px rgba(0,0,0,0.05)", px: 1 }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Booking ID</TableCell>
              <TableCell>Crew</TableCell>
              <TableCell>Service Provider</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date/Time</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading &&
              Array.from({ length: pagination.limit || 10 }).map((_, idx) => (
                <TableRow key={`skeleton-${idx}`}>
                  <TableCell>
                    <Skeleton width={140} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={160} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={180} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={100} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={160} />
                  </TableCell>
                  <TableCell align="right">
                    <Skeleton width={120} />
                  </TableCell>
                </TableRow>
              ))}

            {!loading && error && (
              <TableRow>
                <TableCell colSpan={6}>
                  <Typography color="error">{error}</Typography>
                </TableCell>
              </TableRow>
            )}

            {!loading && !error && bookings.length === 0 && (
              <TableRow>
                <TableCell colSpan={6}>
                  <Typography color="text.secondary">
                    No bookings found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              !error &&
              bookings.map((bk) => {
                const crewName = bk.crew
                  ? `${bk.crew.firstName || ""} ${
                      bk.crew.lastName || ""
                    }`.trim()
                  : "N/A";
                const providerName =
                  bk.vendorName || bk.vendorAssigned?.businessName || "N/A";
                const invoiceUrl = bk.quote?.invoiceUrl;
                return (
                  <TableRow key={bk._id || bk.bookingId} hover>
                    <TableCell>
                      <Typography fontFamily="monospace" fontWeight={600}>
                        {bk.bookingId || bk._id}
                      </Typography>
                    </TableCell>
                    <TableCell>{crewName || "N/A"}</TableCell>
                    <TableCell>{providerName}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={bk.bookingStatus || "pending"}
                        sx={{
                          ...statusChipProps(bk.bookingStatus).sx,
                          height: 24,
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell>{formatDate(bk.dateTime)}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        title="View details"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        title="Open invoice"
                        href={invoiceUrl || "#"}
                        onClick={(e) => {
                          if (!invoiceUrl) e.preventDefault();
                        }}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <LaunchIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>

      {pagination.totalPages > 1 && (
        <SharedPagination
          currentPage={pagination.page || 1}
          totalPages={pagination.totalPages || 0}
          totalItems={pagination.total || 0}
          itemsPerPage={pagination.limit || 10}
          onPageChange={(page) => onPageChange(page)}
          onLimitChange={onLimitChange}
          isMobile={isMobile}
          isTablet={isTablet}
        />
      )}
    </Box>
  );
};

export default AdminBookingsTable;
