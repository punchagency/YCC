import * as React from "react";
import { styled } from "@mui/material/styles";
import { Typography, Box, useMediaQuery, Chip } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import { useTheme } from "../../context/theme/themeContext";

const StyledTableCell = styled(TableCell)(({ mode }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: mode === "light" ? "#F8FAFC" : "#1F2937",
    color: mode === "light" ? "#374151" : "#F9FAFB",
    fontSize: "12px",
    padding: "12px 16px",
    fontWeight: 600,
    borderBottom: mode === "light" ? "1px solid #E5E7EB" : "1px solid #374151",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: "12px",
    padding: "12px 16px",
    borderBottom: mode === "light" ? "1px solid #F3F4F6" : "1px solid #374151",
    color: mode === "light" ? "#374151" : "#F9FAFB",
  },
  "@media (max-width: 600px)": {
    [`&.${tableCellClasses.head}`]: {
      fontSize: "10px",
      padding: "8px 6px",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: "10px",
      padding: "8px 6px",
    },
  },
}));

const StyledTableRow = styled(TableRow)(({ mode }) => ({
  backgroundColor: mode === "light" ? "white" : "#111827",
  transition: "background-color 0.2s ease",
  "&:hover": {
    backgroundColor: mode === "light" ? "#F9FAFB" : "#1F2937",
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const statusColors = {
  pending: { backgroundColor: "#FEF3C7", color: "#92400E", darkBg: "#451A03", darkColor: "#FED7AA" },
  confirmed: { backgroundColor: "#D1FAE5", color: "#059669", darkBg: "#064E3B", darkColor: "#A7F3D0" },
  cancelled: { backgroundColor: "#FEE2E2", color: "#991B1B", darkBg: "#7F1D1D", darkColor: "#FECACA" },
  completed: { backgroundColor: "#DBEAFE", color: "#1E40AF", darkBg: "#1E3A8A", darkColor: "#BFDBFE" },
  in_progress: { backgroundColor: "#E0E7FF", color: "#3730A3", darkBg: "#312E81", darkColor: "#C7D2FE" },
  default: { backgroundColor: "#E0E7FF", color: "#3730A3", darkBg: "#312E81", darkColor: "#C7D2FE" },
};

export default function BasicTable({ orders }) {
  const { theme } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));

  const handleCopyOrderId = (orderId) => {
    navigator.clipboard.writeText(orderId);
  };

  return (
    <TableContainer
      // component={Paper}
      sx={{
        overflowX: "auto",
        overflowY: "hidden",
        maxHeight: "400px",
        borderRadius: "8px",
        boxShadow: theme === "light" 
          ? "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
          : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        border: theme === "light" ? "1px solid #E5E7EB" : "1px solid #374151",
        "&::-webkit-scrollbar": {
          height: "4px",
          width: "4px",
        },
        "&::-webkit-scrollbar-track": {
          background: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: theme === "light" ? "#D1D5DB" : "#6B7280",
          borderRadius: "4px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: theme === "light" ? "#9CA3AF" : "#4B5563",
        },
      }}
    >
      <Table
        aria-label="orders table"
        size="small"
        sx={{ 
          minWidth: 280,
          "@media (max-width: 600px)": {
            minWidth: 240,
          },
        }}
      >
        <TableHead>
          <TableRow>
            <StyledTableCell mode={theme}>
              <TableTitleText mode={theme}>Order ID</TableTitleText>
            </StyledTableCell>
            <StyledTableCell mode={theme} align="left">
              <TableTitleText mode={theme}>Customer</TableTitleText>
            </StyledTableCell>
            <StyledTableCell mode={theme} align="center">
              <TableTitleText mode={theme}>Status</TableTitleText>
            </StyledTableCell>
            <StyledTableCell mode={theme} align="right">
              <TableTitleText mode={theme}>Amount</TableTitleText>
            </StyledTableCell>
            {!isMobile && (
              <StyledTableCell mode={theme} align="right">
                <TableTitleText mode={theme}>Date</TableTitleText>
              </StyledTableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {orders && orders.length > 0 ? (
            orders.map((order) => (
              <StyledTableRow key={order.orderId} mode={theme}>
                <StyledTableCell component="th" scope="row" mode={theme}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <TableBodyText mode={theme}>
                      {isMobile ? order.orderId.substring(0, 6) + "..." : order.orderId.substring(0, 10) + "..."}
                    </TableBodyText>
                    <FileCopyOutlinedIcon
                      onClick={() => handleCopyOrderId(order.orderId)}
                      sx={{
                        fontSize: isMobile ? "12px" : "14px",
                        color: theme === "light" ? "#6B7280" : "#9CA3AF",
                        cursor: "pointer",
                        transition: "color 0.2s ease",
                        "&:hover": {
                          color: theme === "light" ? "#374151" : "#F3F4F6",
                        },
                      }}
                    />
                  </Box>
                </StyledTableCell>
                <StyledTableCell align="left" mode={theme}>
                  <TableBodyText mode={theme}>
                    {isMobile
                      ? (
                          order?.customerName ||
                          order?.customer?.name ||
                          "N/A"
                        ).split(" ")[0]
                      : (order?.customerName || order?.customer?.name || "N/A").substring(0, 15) + 
                        ((order?.customerName || order?.customer?.name || "").length > 15 ? "..." : "")}
                  </TableBodyText>
                </StyledTableCell>
                <StyledTableCell align="center" mode={theme}>
                  <StatusChip
                    label={order?.overallStatus || "pending"}
                    mode={theme}
                    status={order?.overallStatus || "pending"}
                    isMobile={isMobile}
                  />
                </StyledTableCell>
                <StyledTableCell align="right" mode={theme}>
                  <AmountText mode={theme}>
                    ${parseFloat(order?.totalPrice || 0).toFixed(0)}
                  </AmountText>
                </StyledTableCell>
                {!isMobile && (
                  <StyledTableCell align="right" mode={theme}>
                    <TableBodyText mode={theme}>
                      {order?.orderDate
                        ? new Date(order.orderDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        : "N/A"}
                    </TableBodyText>
                  </StyledTableCell>
                )}
              </StyledTableRow>
            ))
          ) : (
            <StyledTableRow mode={theme}>
              <StyledTableCell colSpan={isMobile ? 4 : 5} mode={theme}>
                <EmptyStateContainer>
                  <EmptyStateText mode={theme}>
                    No orders found
                  </EmptyStateText>
                  <EmptyStateSubText mode={theme}>
                    Orders will appear here once they are created
                  </EmptyStateSubText>
                </EmptyStateContainer>
              </StyledTableCell>
            </StyledTableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

const TableTitleText = styled(Typography)(({ mode }) => ({
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 600,
  fontSize: "11px",
  lineHeight: "16px",
  letterSpacing: "-0.01em",
  color: mode === "light" ? "#374151" : "#F9FAFB",
  textTransform: "uppercase",
  "@media (max-width: 600px)": {
    fontSize: "9px",
    lineHeight: "12px",
  },
}));

const TableBodyText = styled(Typography)(({ mode }) => ({
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 500,
  fontSize: "11px",
  lineHeight: "16px",
  letterSpacing: "-0.01em",
  color: mode === "light" ? "#374151" : "#F9FAFB",
  "@media (max-width: 600px)": {
    fontSize: "9px",
    lineHeight: "12px",
  },
}));

const AmountText = styled(Typography)(({ mode }) => ({
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 600,
  fontSize: "11px",
  lineHeight: "16px",
  letterSpacing: "-0.01em",
  color: mode === "light" ? "#059669" : "#10B981",
  "@media (max-width: 600px)": {
    fontSize: "9px",
    lineHeight: "12px",
  },
}));

const StatusChip = styled(Chip)(({ mode, status, isMobile }) => {
  const statusConfig = statusColors[status] || statusColors.pending;
  return {
    backgroundColor: mode === "light" ? statusConfig.backgroundColor : statusConfig.darkBg,
    color: mode === "light" ? statusConfig.color : statusConfig.darkColor,
    borderRadius: "12px",
    height: isMobile ? "18px" : "22px",
    fontSize: isMobile ? "8px" : "9px",
    fontWeight: 600,
    textTransform: "capitalize",
    fontFamily: "Plus Jakarta Sans",
    letterSpacing: "-0.01em",
    border: "none",
    minWidth: isMobile ? "50px" : "60px",
    "& .MuiChip-label": {
      padding: isMobile ? "0 4px" : "0 6px",
    },
  };
});

const EmptyStateContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "32px 16px",
  gap: "6px",
});

const EmptyStateText = styled(Typography)(({ mode }) => ({
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 600,
  fontSize: "14px",
  lineHeight: "20px",
  color: mode === "light" ? "#374151" : "#F9FAFB",
}));

const EmptyStateSubText = styled(Typography)(({ mode }) => ({
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 400,
  fontSize: "12px",
  lineHeight: "16px",
  color: mode === "light" ? "#6B7280" : "#9CA3AF",
}));
