import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Visibility,
  Description,
  ContentCopy,
  CheckCircle,
} from "@mui/icons-material";
import { Pagination } from "../../../../components/pagination";
import { InvoiceTableSkeleton } from "../../../../components/FinancialManagementSkeletons";

const InvoiceTable = ({ invoices, pagination, onPageChange, loading }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // State to track which invoice ID was just copied (for visual feedback)
  const [copiedInvoiceId, setCopiedInvoiceId] = useState(null);

  // Format currency for display
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount / 100);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status color configuration
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return { bgColor: "#dcfce7", color: "#166534" };
      case "pending":
        return { bgColor: "#fef3c7", color: "#92400e" };
      case "failed":
        return { bgColor: "#fee2e2", color: "#991b1b" };
      default:
        return { bgColor: "#f3f4f6", color: "#374151" };
    }
  };

  // Get type color configuration
  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case "order":
        return { bgColor: "#dbeafe", color: "#1e40af" };
      case "booking":
        return { bgColor: "#f3e8ff", color: "#7c3aed" };
      case "quote":
        return { bgColor: "#ecfdf5", color: "#047857" };
      default:
        return { bgColor: "#f3f4f6", color: "#374151" };
    }
  };

  // Handle invoice view action
  const handleViewInvoice = (invoiceUrl) => {
    if (invoiceUrl) {
      window.open(invoiceUrl, "_blank");
    }
  };

  /**
   * Copy text to clipboard with visual feedback
   * @param {string} text - The text to copy
   * @param {string} invoiceId - The invoice ID for feedback tracking
   */
  const handleCopyToClipboard = async (text, invoiceId) => {
    try {
      // Copy text to clipboard
      await navigator.clipboard.writeText(text);

      // Set visual feedback state
      setCopiedInvoiceId(invoiceId);

      // Clear feedback after 2 seconds
      setTimeout(() => {
        setCopiedInvoiceId(null);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // Show skeleton if loading
  if (loading) {
    return <InvoiceTableSkeleton />;
  }

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
      <CardContent sx={{ p: isMobile ? 1 : 3 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: "#1f2937",
            mb: 3,
            fontSize: isMobile ? "1.125rem" : "1.25rem",
          }}
        >
          Recent Invoices
        </Typography>

        {invoices && invoices.length > 0 ? (
          <>
            {/* Scrollable container for mobile */}
            <Box
              sx={{
                overflowX: isMobile ? "auto" : "hidden",
                borderRadius: 3,
                border: "1px solid #e5e7eb",
                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
              }}
            >
              <TableContainer
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  // Set minimum width to prevent squishing on mobile
                  minWidth: isMobile ? "800px" : "auto",
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f9fafb" }}>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          color: "#374151",
                          fontSize: isMobile ? "0.75rem" : "0.875rem",
                          py: 2,
                        }}
                      >
                        Invoice
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          color: "#374151",
                          fontSize: isMobile ? "0.75rem" : "0.875rem",
                          py: 2,
                        }}
                      >
                        Customer
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          color: "#374151",
                          fontSize: isMobile ? "0.75rem" : "0.875rem",
                          py: 2,
                        }}
                      >
                        Amount
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          color: "#374151",
                          fontSize: isMobile ? "0.75rem" : "0.875rem",
                          py: 2,
                        }}
                      >
                        Status
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          color: "#374151",
                          fontSize: isMobile ? "0.75rem" : "0.875rem",
                          py: 2,
                        }}
                      >
                        Type
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          color: "#374151",
                          fontSize: isMobile ? "0.75rem" : "0.875rem",
                          py: 2,
                        }}
                      >
                        Date
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          color: "#374151",
                          fontSize: isMobile ? "0.75rem" : "0.875rem",
                          py: 2,
                        }}
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invoices.map((invoice) => {
                      const statusStyle = getStatusColor(invoice.status);
                      const typeStyle = getTypeColor(invoice.type);

                      return (
                        <TableRow
                          key={invoice._id}
                          sx={{
                            "&:hover": {
                              backgroundColor: "#f9fafb",
                            },
                          }}
                        >
                          <TableCell
                            sx={{
                              fontSize: isMobile ? "0.75rem" : "0.875rem",
                              color: "#1f2937",
                              fontWeight: 500,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Tooltip title={invoice.invoiceId}>
                                <Typography
                                  sx={{
                                    fontFamily: "monospace",
                                    fontSize: isMobile ? "0.75rem" : "0.875rem",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    maxWidth: "120px",
                                  }}
                                >
                                  {invoice.invoiceId}
                                </Typography>
                              </Tooltip>
                              <Tooltip
                                title={
                                  copiedInvoiceId === invoice.invoiceId
                                    ? "Copied!"
                                    : "Copy Invoice ID"
                                }
                              >
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleCopyToClipboard(
                                      invoice.invoiceId,
                                      invoice.invoiceId
                                    )
                                  }
                                  sx={{
                                    color:
                                      copiedInvoiceId === invoice.invoiceId
                                        ? "#10b981"
                                        : "#6b7280",
                                    "&:hover": {
                                      backgroundColor:
                                        copiedInvoiceId === invoice.invoiceId
                                          ? "rgba(16, 185, 129, 0.1)"
                                          : "rgba(107, 114, 128, 0.1)",
                                      color:
                                        copiedInvoiceId === invoice.invoiceId
                                          ? "#059669"
                                          : "#374151",
                                    },
                                    transition: "all 0.2s ease-in-out",
                                  }}
                                >
                                  {copiedInvoiceId === invoice.invoiceId ? (
                                    <CheckCircle sx={{ fontSize: 16 }} />
                                  ) : (
                                    <ContentCopy sx={{ fontSize: 16 }} />
                                  )}
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: isMobile ? "0.75rem" : "0.875rem",
                              color: "#1f2937",
                            }}
                          >
                            <Tooltip title={invoice.customer?.email || "N/A"}>
                              <Typography
                                sx={{
                                  fontSize: isMobile ? "0.75rem" : "0.875rem",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  maxWidth: "150px",
                                }}
                              >
                                {invoice.customer?.email || "N/A"}
                              </Typography>
                            </Tooltip>
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: isMobile ? "0.75rem" : "0.875rem",
                              color: "#1f2937",
                              fontWeight: 600,
                            }}
                          >
                            {formatCurrency(invoice.amount)}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={invoice.status}
                              size="small"
                              sx={{
                                backgroundColor: statusStyle.bgColor,
                                color: statusStyle.color,
                                fontWeight: 600,
                                fontSize: isMobile ? "0.625rem" : "0.75rem",
                                textTransform: "capitalize",
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={invoice.type}
                              size="small"
                              sx={{
                                backgroundColor: typeStyle.bgColor,
                                color: typeStyle.color,
                                fontWeight: 600,
                                fontSize: isMobile ? "0.625rem" : "0.75rem",
                                textTransform: "capitalize",
                              }}
                            />
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: isMobile ? "0.75rem" : "0.875rem",
                              color: "#6b7280",
                            }}
                          >
                            {formatDate(invoice.invoiceDate)}
                          </TableCell>
                          <TableCell>
                            <Tooltip title="View Invoice">
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleViewInvoice(invoice.invoiceUrl)
                                }
                                disabled={!invoice.invoiceUrl}
                                sx={{
                                  color: "#0387D9",
                                  "&:hover": {
                                    backgroundColor: "rgba(3, 135, 217, 0.1)",
                                  },
                                }}
                              >
                                <Visibility sx={{ fontSize: 18 }} />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {pagination && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalInvoices}
                itemsPerPage={5}
                onPageChange={onPageChange}
                isMobile={isMobile}
                isTablet={isTablet}
              />
            )}
          </>
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              py: 8,
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(3, 135, 217, 0.1)",
                mb: 2,
              }}
            >
              <Description sx={{ fontSize: 32, color: "#0387D9" }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: "#374151",
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              No Invoices Found
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#6b7280",
                textAlign: "center",
                maxWidth: "400px",
                lineHeight: 1.5,
              }}
            >
              When invoices are created, they will appear here for easy
              management and tracking. You can view, track payments, and manage
              all your financial transactions from this dashboard.
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default InvoiceTable;
