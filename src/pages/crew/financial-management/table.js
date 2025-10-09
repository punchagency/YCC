import React, { useState, useEffect } from "react";
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
  TableSortLabel,
  Chip,
  Paper,
  Checkbox,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  Stack,
  useTheme,
  useMediaQuery,
  Skeleton
} from "@mui/material";
import {
  Visibility,
  DeleteOutline
} from "@mui/icons-material";
import { visuallyHidden } from '@mui/utils';
import { formatDateTime } from "../../../utils/formatters";

const FinancialTable = ({ invoices = [], loading = false, currentSortField, currentSortDirection, onSortChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  // Removed local sort state
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  // Removed local filtering and sorting

  // Removed local sorting

  // Handle select all checkbox
  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);

    if (checked) {
      // Select all items
      const allItemIds = invoices.map((item) => item.invoiceId);
      setSelectedItems(allItemIds);
    } else {
      // Deselect all
      setSelectedItems([]);
    }
  };

  // Handle individual item selection
  const handleSelectItem = (e, itemId) => {
    const checked = e.target.checked;

    if (checked) {
      setSelectedItems((prev) => [...prev, itemId]);
    } else {
      setSelectedItems((prev) => prev.filter((id) => id !== itemId));

      // If we're unchecking an item, also uncheck the "select all" checkbox
      if (selectAll) {
        setSelectAll(false);
      }
    }
  };

  // Handle bulk delete function
  const handleBulkDelete = () => {
    if (selectedItems.length === 0) return;
    // TODO: Implement delete functionality here
  };

  // View item handler
  const handleViewItem = (invoice) => {
    setSelectedInvoice(invoice);
    setShowDetailsModal(true);
  };

  // Function to close the modal
  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedInvoice(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return { color: "success", bgcolor: "#dcfce7", textColor: "#166534" };
      case "pending":
        return { color: "warning", bgcolor: "#fef3c7", textColor: "#92400e" };
      case "failed":
        return { color: "error", bgcolor: "#fee2e2", textColor: "#991b1b" };
      default:
        return { color: "default", bgcolor: "#f3f4f6", textColor: "#374151" };
    }
  };

  // Edit handler
  const handleEdit = (index) => {
    // TODO: Implement edit functionality
  };

  // Delete handler
  const handleDelete = (index) => {
    // TODO: Implement delete functionality
  };

  if (isMobile) {
    return (
      <Box sx={{ p: 2 }}>
        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <CardContent sx={{ p: 3 }}>
            {loading ? (
              <>
                <Skeleton variant="text" width="60%" height={28} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="80%" height={16} sx={{ mb: 3 }} />
                <Stack spacing={2}>
                  {[1, 2, 3, 4, 5].map((index) => (
                    <Card key={index} variant="outlined" sx={{ borderRadius: 2 }}>
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Skeleton variant="text" width="40%" height={20} />
                          <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 12 }} />
                        </Box>
                        <Skeleton variant="text" width="50%" height={16} sx={{ mb: 0.5 }} />
                        <Skeleton variant="text" width="60%" height={16} sx={{ mb: 0.5 }} />
                        <Skeleton variant="text" width="45%" height={16} sx={{ mb: 1 }} />
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                          <Skeleton variant="rectangular" width={90} height={32} sx={{ borderRadius: 1 }} />
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </>
            ) : (
              <>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: '#333' }}>
                  Payment & Invoice Tracker
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
                  Monitor outstanding invoices, track completed payments, and manage upcoming expenses.
                </Typography>

                <Stack spacing={2}>
                  {invoices.map((invoice) => {
                    const statusStyle = getStatusColor(invoice.status);
                    return (
                      <Card key={invoice.id} variant="outlined" sx={{ borderRadius: 2 }}>
                        <CardContent sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {invoice.id}
                            </Typography>
                            <Chip
                              label={invoice.status}
                              size="small"
                              sx={{
                                bgcolor: statusStyle.bgcolor,
                                color: statusStyle.color,
                                fontWeight: 500,
                                fontSize: '0.75rem'
                              }}
                            />
                          </Box>
                          <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                            Vendor: {invoice.vendor}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                            Amount: ${invoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                            Date: {invoice.date}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                            <IconButton size="small" sx={{ fontSize: '14px' }} onClick={() => handleViewItem(invoice)}>
                              <Visibility fontSize="small" />
                              View Details
                            </IconButton>
                            {/* <IconButton size="small" onClick={() => handleEdit(0)}>
                              <Edit fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={() => handleDelete(0)}>
                              <Delete fontSize="small" color="error" />
                            </IconButton> */}
                          </Box>
                        </CardContent>
                      </Card>
                    );
                  })}
                </Stack>
              </>
            )}
          </CardContent>
        </Card>
        {renderDetailsModal()}
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <CardContent sx={{ p: 4 }}>
          {loading ? (
            <>
              <Skeleton variant="text" width="60%" height={28} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="80%" height={16} sx={{ mb: 4 }} />

              <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0', borderRadius: 2 }}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                    <TableRow>
                      {['checkbox', 'Inv. No.', 'Invoice Type', 'Date', 'Amount', 'Status', 'Actions'].map((header, index) => (
                        <TableCell key={index} sx={{ fontWeight: 600, color: '#555' }}>
                          <Skeleton variant="text" width="80%" height={20} />
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {[1, 2, 3, 4, 5].map((rowIndex) => (
                      <TableRow key={rowIndex} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell padding="checkbox">
                          <Skeleton variant="rectangular" width={20} height={20} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width="80%" height={20} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width="70%" height={20} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width="60%" height={20} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width="50%" height={20} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 12 }} />
                        </TableCell>
                        <TableCell align="center">
                          <Skeleton variant="circular" width={32} height={32} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Skeleton variant="rectangular" width={300} height={40} sx={{ borderRadius: 2 }} />
              </Box>
            </>
          ) : (
            <>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: '#333' }}>
                Payment & Invoice Tracker
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mb: 4 }}>
                Monitor outstanding invoices, track completed payments, and manage upcoming expenses. Use filters and sorting options for easy navigation and quick access to financial details.
              </Typography>

              <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0', borderRadius: 2 }}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                    <TableRow>

                      <TableCell sx={{ fontWeight: 600, color: '#555' }}>
                        <TableSortLabel
                          active={currentSortField === 'id'}
                          direction={currentSortField === 'id' ? currentSortDirection : 'asc'}
                        // onClick={() => handleSort('id')}
                        >
                          Inv. No.
                          {currentSortField === 'id' ? (
                            <Box component="span" sx={visuallyHidden}>
                              {currentSortDirection === 'desc' ? 'sorted descending' : 'sorted ascending'}
                            </Box>
                          ) : null}
                        </TableSortLabel>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#555' }}>
                        Invoice Type
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#555' }}>
                        Date
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#555' }}>
                        Amount
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#555' }}>
                        Status
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600, color: '#555' }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {invoices.map((invoice, index) => {
                      const statusStyle = getStatusColor(invoice.status);
                      return (
                        <TableRow
                          key={invoice?.invoiceId}
                          sx={{
                            '&:hover': { bgcolor: '#f8f9fa' },
                            '&:last-child td, &:last-child th': { border: 0 }
                          }}
                        >
                          <TableCell sx={{ fontWeight: 500, color: '#333' }}>
                            {invoice?.invoiceId}
                          </TableCell>
                          <TableCell sx={{ color: '#666', textTransform: 'capitalize' }}>
                            {invoice.type}
                          </TableCell>
                          <TableCell sx={{ color: '#666' }}>
                            {invoice?.invoiceDate && formatDateTime(invoice.invoiceDate)}
                          </TableCell>
                          <TableCell sx={{ color: '#666', fontWeight: 500 }}>
                            ${invoice?.amount.toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={invoice.status}
                              size="small"
                              sx={{
                                bgcolor: statusStyle.bgcolor,
                                color: statusStyle.color,
                                fontWeight: 500,
                                fontSize: '0.75rem',
                                textTransform: 'capitalize'
                              }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                              <IconButton
                                size="small"
                                onClick={() => handleViewItem(invoice)}
                                sx={{ fontSize: '14px' }}
                              >
                                <Visibility fontSize="small" />
                                View Details
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                {/* Removed local pagination */}
              </Box>
            </>
          )}
        </CardContent>
      </Card>
      {renderDetailsModal()}
    </Box>
  );

  function renderDetailsModal() {
    return (

      <Dialog
        open={showDetailsModal}
        onClose={closeDetailsModal}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 3,
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle
          sx={{
            pb: 1,
            fontSize: '1.25rem',
            fontWeight: 600,
            borderBottom: '1px solid #e0e0e0'
          }}
        >
          Payment & Invoice Tracker Details
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {selectedInvoice && (
            <Box>
              {/* Invoice Number */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, borderBottom: '1px solid #e0e0e0' }}>
                <Typography sx={{ fontWeight: 500, color: '#666' }}>Invoice No.</Typography>
                <Typography sx={{ color: '#333' }}>
                  {selectedInvoice.details?.invoiceNo || selectedInvoice.id}
                </Typography>
              </Box>

              {/* Service Name */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, borderBottom: '1px solid #e0e0e0' }}>
                <Typography sx={{ fontWeight: 500, color: '#666' }}>Service Name</Typography>
                <Typography sx={{ color: '#333' }}>
                  {selectedInvoice.details?.serviceName || "Service details not available"}
                </Typography>
              </Box>

              {/* Amount Breakdown */}
              <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
                <Typography sx={{ fontWeight: 600, mb: 1.5 }}>Amount Breakdown</Typography>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">1. Service Fee</Typography>
                    <Typography variant="body2">
                      ${selectedInvoice.details?.serviceFee || selectedInvoice.amount}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">
                      2. Tax ({selectedInvoice.details?.taxRate || 5}%)
                    </Typography>
                    <Typography variant="body2">
                      ${selectedInvoice.details?.taxAmount || 0}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">3. Discount Applied</Typography>
                    <Typography variant="body2" sx={{ color: '#f44336' }}>
                      -${selectedInvoice.details?.discount || 0}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontWeight: 600 }}>4. Total</Typography>
                    <Typography sx={{ fontWeight: 600 }}>${selectedInvoice.amount}</Typography>
                  </Box>
                </Stack>
              </Box>

              {/* Linked Booking Date */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, borderBottom: '1px solid #e0e0e0' }}>
                <Typography sx={{ fontWeight: 500, color: '#666' }}>Linked Booking Date</Typography>
                <Typography sx={{ color: '#333' }}>
                  {selectedInvoice.details?.bookingDate || selectedInvoice.date}
                </Typography>
              </Box>

              {/* Payment Method */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, borderBottom: '1px solid #e0e0e0' }}>
                <Typography sx={{ fontWeight: 500, color: '#666' }}>Payment Method</Typography>
                <Typography sx={{ color: '#333' }}>
                  {selectedInvoice.details?.paymentMethod
                    ? `${selectedInvoice.details.paymentMethod}${selectedInvoice.details.cardEnding !== "N/A"
                      ? ` - Ending ${selectedInvoice.details.cardEnding}`
                      : ""
                    }`
                    : "Payment method not specified"}
                </Typography>
              </Box>

              {/* Payment Status */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
                <Typography sx={{ fontWeight: 500, color: '#666' }}>Payment Status</Typography>
                <Chip
                  label={selectedInvoice.status}
                  size="small"
                  sx={{
                    ...getStatusColor(selectedInvoice.status),
                    fontWeight: 500
                  }}
                />
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    );
  }
};

export default FinancialTable;
