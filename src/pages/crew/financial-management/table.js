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
  Pagination
} from "@mui/material";
import {
  Visibility,
  DeleteOutline
} from "@mui/icons-material";
import { Skeleton } from "@mui/material";
import { visuallyHidden } from '@mui/utils';

const FinancialTable = ({ activeFilter = "all", searchQuery = "", financeData=[], loading = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [filteredInvoices, setFilteredInvoices] = useState([]);

  // Initialize filteredInvoices with invoices data
  useEffect(() => {
    setFilteredInvoices(financeData);
  }, []);

  // Filter invoices when activeFilter or searchQuery changes
  useEffect(() => {
    if(!financeData && financeData.length === 0) return;
    let filtered = [...financeData];

    // Apply status filter
    if (activeFilter !== "all") {
      filtered = filtered.filter((invoice) => {
        switch (activeFilter) {
          case "pending":
            return invoice.status === "pending";
          case "completed":
            return invoice.status === "paid";
          case "upcoming":
            return invoice.status === "failed" || invoice.status === "cancelled";
          default:
            return true;
        }
      });
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (invoice) =>
          invoice.invoiceId.toLowerCase().includes(query) ||
          invoice.orderId.toLowerCase().includes(query) ||
          invoice.type.toLowerCase().includes(query) ||
          (invoice.suppliers && invoice.suppliers.some(supplier => supplier.toLowerCase().includes(query))) ||
          (invoice.serviceProvider && invoice.serviceProvider.toLowerCase().includes(query))
      );
    }

    setFilteredInvoices(filtered);
  }, [activeFilter, searchQuery, financeData]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return { bgcolor: '#e8f5e8', color: '#2e7d32' };
      case "pending":
        return { bgcolor: '#fff3e0', color: '#f57c00' };
      case "failed":
        return { bgcolor: '#ffebee', color: '#d32f2f' };
      case "cancelled":
        return { bgcolor: '#f3e5f5', color: '#7b1fa2' };
      case "refunded":
        return { bgcolor: '#e0f2f1', color: '#00695c' };
      default:
        return { bgcolor: '#f5f5f5', color: '#666' };
    }
  };

  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    if (!sortField) return 0;
    const aValue = a[sortField];
    const bValue = b[sortField];
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  // Handle select all checkbox
  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);

    if (checked) {
      // Select all items
      const allItemIds = financeData.map((item) => item.invoiceId);
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
    // Implement delete functionality here
    console.log("Deleting items:", selectedItems);
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const SkeletonCard = () => (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Skeleton variant="text" width="40%" height={20} />
          <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} />
        </Box>
        <Skeleton variant="text" width="80%" height={16} sx={{ mb: 0.5 }} />
        <Skeleton variant="text" width="70%" height={16} sx={{ mb: 0.5 }} />
        <Skeleton variant="text" width="60%" height={16} sx={{ mb: 0.5 }} />
        <Skeleton variant="text" width="50%" height={16} sx={{ mb: 1 }} />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Skeleton variant="rectangular" width={100} height={32} sx={{ borderRadius: 1 }} />
        </Box>
      </CardContent>
    </Card>
  );

  const SkeletonRow = () => (
    <TableRow>
      <TableCell padding="checkbox"><Skeleton variant="rectangular" width={20} height={20} /></TableCell>
      <TableCell><Skeleton variant="text" width="80%" /></TableCell>
      <TableCell><Skeleton variant="text" width="60%" /></TableCell>
      <TableCell><Skeleton variant="text" width="70%" /></TableCell>
      <TableCell><Skeleton variant="text" width="50%" /></TableCell>
      <TableCell><Skeleton variant="text" width="60%" /></TableCell>
      <TableCell><Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} /></TableCell>
    </TableRow>
  );

  if (isMobile) {
    return (
      <Box sx={{ p: 2 }}>
        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: '#333' }}>
              Payment & Invoice Tracker
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
              Monitor outstanding invoices, track completed payments, and manage upcoming expenses.
            </Typography>
            
            <Stack spacing={2}>
              {loading ? (
                Array.from({ length: 4 }).map((_, index) => <SkeletonCard key={index} />)
              ) : sortedInvoices && sortedInvoices.length > 0 ? (
                sortedInvoices.map((invoice) => {
                  const statusStyle = getStatusColor(invoice.status);
                  return (
                    <Card key={invoice.invoiceId} variant="outlined" sx={{ borderRadius: 2 }}>
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {invoice.invoiceId}
                          </Typography>
                          <Chip
                            label={invoice?.status}
                            size="small"
                            sx={{
                              bgcolor: statusStyle.bgcolor,
                              color: statusStyle.color,
                              fontWeight: 500,
                              fontSize: '0.75rem',
                              textTransform: 'capitalize'
                            }}
                          />
                        </Box>
                        <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                          Type: {invoice.type} | Order: {invoice.orderId}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                          Vendor: {invoice.type === 'booking' ? invoice.serviceProvider : invoice.suppliers?.join(', ') || 'N/A'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                          Amount: {formatCurrency(invoice.amount)}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                          Date: {new Date(invoice.invoiceDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) || 'N/A'} | Due: {new Date(invoice.dueDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) || 'N/A'}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                          <IconButton size="small" sx={{ fontSize: '14px' }} onClick={() => handleViewItem(invoice)}>
                            <Visibility fontSize="small" />
                            View Details
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Typography variant="h6" sx={{ color: '#666', fontWeight: 500, mb: 1 }}>
                    No Invoices Found
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#999' }}>
                    There are no invoices to display at the moment.
                  </Typography>
                </Box>
              )}
            </Stack>
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
                  <TableCell padding="checkbox">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Checkbox
                        checked={selectAll}
                        onChange={handleSelectAll}
                        size="small"
                      />
                      {selectedItems.length > 0 && (
                        <IconButton
                          size="small"
                          onClick={handleBulkDelete}
                          sx={{ color: '#f44336' }}
                        >
                          <DeleteOutline fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#555' }}>
                    <TableSortLabel
                      active={sortField === 'invoiceId'}
                      direction={sortField === 'invoiceId' ? sortDirection : 'asc'}
                      onClick={() => handleSort('invoiceId')}
                    >
                      Inv. No.
                      {sortField === 'invoiceId' ? (
                        <Box component="span" sx={visuallyHidden}>
                          {sortDirection === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#555' }}>
                    <TableSortLabel
                      active={sortField === 'type'}
                      direction={sortField === 'type' ? sortDirection : 'asc'}
                      onClick={() => handleSort('type')}
                    >
                      Type
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#555' }}>
                    Vendor/Provider
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#555' }}>
                    <TableSortLabel
                      active={sortField === 'invoiceDate'}
                      direction={sortField === 'invoiceDate' ? sortDirection : 'asc'}
                      onClick={() => handleSort('invoiceDate')}
                    >
                      Date
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#555' }}>
                    <TableSortLabel
                      active={sortField === 'amount'}
                      direction={sortField === 'amount' ? sortDirection : 'asc'}
                      onClick={() => handleSort('amount')}
                    >
                      Amount
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#555' }}>
                    <TableSortLabel
                      active={sortField === 'status'}
                      direction={sortField === 'status' ? sortDirection : 'asc'}
                      onClick={() => handleSort('status')}
                    >
                      Status
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600, color: '#555' }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => <SkeletonRow key={index} />)
                ) : sortedInvoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: 'center', py: 8 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <Typography variant="h6" sx={{ color: '#666', fontWeight: 500 }}>
                          No Invoices Found
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#999' }}>
                          There are no invoices to display at the moment.
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedInvoices.map((invoice, index) => {
                    const statusStyle = getStatusColor(invoice.status);
                    return (
                      <TableRow
                        key={invoice.invoiceId}
                        sx={{
                          '&:hover': { bgcolor: '#f8f9fa' },
                          '&:last-child td, &:last-child th': { border: 0 }
                        }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedItems.includes(invoice.invoiceId)}
                            onChange={(e) => handleSelectItem(e, invoice.invoiceId)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell sx={{ fontWeight: 500, color: '#333' }}>
                          {invoice.invoiceId}
                        </TableCell>
                        <TableCell sx={{ color: '#666', textTransform: 'capitalize' }}>
                          {invoice.type}
                        </TableCell>
                        <TableCell sx={{ color: '#666' }}>
                          {invoice.type === 'booking' ? invoice.serviceProvider : invoice.suppliers?.join(', ') || 'N/A'}
                        </TableCell>
                        <TableCell sx={{ color: '#666' }}>
                          {new Date(invoice.invoiceDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }) || 'N/A'}
                        </TableCell>
                        <TableCell sx={{ color: '#666', fontWeight: 500 }}>
                          {formatCurrency(invoice.amount)}
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
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={Math.ceil(filteredInvoices.length / 10)}
              page={1}
              onChange={() => {}}
              color="primary"
              sx={{
                '& .MuiPaginationItem-root': {
                  borderRadius: 2
                }
              }}
            />
          </Box>
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
              {/* Invoice Details */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, borderBottom: '1px solid #e0e0e0' }}>
                <Typography sx={{ fontWeight: 500, color: '#666' }}>Invoice No.</Typography>
                <Typography sx={{ color: '#333' }}>{selectedInvoice.invoiceId}</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, borderBottom: '1px solid #e0e0e0' }}>
                <Typography sx={{ fontWeight: 500, color: '#666' }}>Order ID</Typography>
                <Typography sx={{ color: '#333' }}>{selectedInvoice.orderId}</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, borderBottom: '1px solid #e0e0e0' }}>
                <Typography sx={{ fontWeight: 500, color: '#666' }}>Type</Typography>
                <Typography sx={{ color: '#333', textTransform: 'capitalize' }}>{selectedInvoice.type}</Typography>
              </Box>

              {/* Vendor/Provider */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, borderBottom: '1px solid #e0e0e0' }}>
                <Typography sx={{ fontWeight: 500, color: '#666' }}>
                  {selectedInvoice.type === 'booking' ? 'Service Provider' : 'Suppliers'}
                </Typography>
                <Typography sx={{ color: '#333' }}>
                  {selectedInvoice.type === 'booking' 
                    ? selectedInvoice.serviceProvider || 'N/A'
                    : selectedInvoice.suppliers?.join(', ') || 'N/A'
                  }
                </Typography>
              </Box>

              {/* Amount */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, borderBottom: '1px solid #e0e0e0' }}>
                <Typography sx={{ fontWeight: 500, color: '#666' }}>Amount</Typography>
                <Typography sx={{ color: '#333', fontWeight: 600 }}>
                  {formatCurrency(selectedInvoice.amount)}
                </Typography>
              </Box>

              {/* Dates */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, borderBottom: '1px solid #e0e0e0' }}>
                <Typography sx={{ fontWeight: 500, color: '#666' }}>Invoice Date</Typography>
                <Typography sx={{ color: '#333' }}>{new Date(selectedInvoice.invoiceDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                }) || 'N/A'}</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, borderBottom: '1px solid #e0e0e0' }}>
                <Typography sx={{ fontWeight: 500, color: '#666' }}>Due Date</Typography>
                <Typography sx={{ color: '#333' }}>{new Date(selectedInvoice.dueDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                }) || 'N/A'}</Typography>
              </Box>

              {/* Status */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
                <Typography sx={{ fontWeight: 500, color: '#666' }}>Status</Typography>
                <Chip
                  label={selectedInvoice.status}
                  size="small"
                  sx={{
                    ...getStatusColor(selectedInvoice.status),
                    fontWeight: 500,
                    textTransform: 'capitalize'
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
