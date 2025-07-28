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
  Edit,
  Delete,
  DeleteOutline
} from "@mui/icons-material";
import { visuallyHidden } from '@mui/utils';

const FinancialTable = ({ activeFilter = "all", searchQuery = "" }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [filteredInvoices, setFilteredInvoices] = useState([]);

  // Sample invoice data
  const invoices = [
    {
      id: "INV-001",
      vendor: "John Doe",
      date: "01/03/2025",
      amount: 12000.0,
      status: "In Progress",
      details: {
        invoiceNo: "INV-001",
        serviceName: "Yacht Maintenance",
        serviceFee: 11500,
        taxRate: 5,
        taxAmount: 575,
        discount: 75,
        total: 12000,
        bookingDate: "01/03/2025",
        paymentMethod: "Credit Card",
        cardEnding: "4321",
        paymentStatus: "In Progress",
      },
    },
    {
      id: "INV-002",
      vendor: "Jane Smith",
      date: "01/04/2025",
      amount: 8500.0,
      status: "Completed",
      details: {
        invoiceNo: "INV-002",
        serviceName: "Crew Training",
        serviceFee: 8000,
        taxRate: 5,
        taxAmount: 400,
        discount: 0,
        total: 8500,
        bookingDate: "01/04/2025",
        paymentMethod: "Bank Transfer",
        cardEnding: "N/A",
        paymentStatus: "Completed",
      },
    },
    {
      id: "INV-003",
      vendor: "Alice Johnson",
      date: "01/05/2025",
      amount: 15200.0,
      status: "Pending",
      details: {
        invoiceNo: "INV-003",
        serviceName: "Engine Repair",
        serviceFee: 14500,
        taxRate: 5,
        taxAmount: 725,
        discount: 25,
        total: 15200,
        bookingDate: "01/05/2025",
        paymentMethod: "Visa",
        cardEnding: "7890",
        paymentStatus: "Pending",
      },
    },
    {
      id: "INV-004",
      vendor: "Bob Brown",
      date: "01/06/2025",
      amount: 9750.0,
      status: "In Progress",
      details: {
        invoiceNo: "INV-004",
        serviceName: "Interior Design",
        serviceFee: 9500,
        taxRate: 5,
        taxAmount: 475,
        discount: 225,
        total: 9750,
        bookingDate: "01/06/2025",
        paymentMethod: "Mastercard",
        cardEnding: "5678",
        paymentStatus: "In Progress",
      },
    },
    {
      id: "INV-005",
      vendor: "Carol White",
      date: "01/07/2025",
      amount: 22300.0,
      status: "Completed",
      details: {
        invoiceNo: "INV-005",
        serviceName: "Hull Painting",
        serviceFee: 21000,
        taxRate: 5,
        taxAmount: 1050,
        discount: 0,
        total: 22300,
        bookingDate: "01/07/2025",
        paymentMethod: "American Express",
        cardEnding: "9012",
        paymentStatus: "Completed",
      },
    },
    {
      id: "INV-006",
      vendor: "David Green",
      date: "01/08/2025",
      amount: 5600.0,
      status: "Pending",
      details: {
        invoiceNo: "INV-006",
        serviceName: "Safety Inspection",
        serviceFee: 5500,
        taxRate: 5,
        taxAmount: 275,
        discount: 175,
        total: 5600,
        bookingDate: "01/08/2025",
        paymentMethod: "Visa",
        cardEnding: "3456",
        paymentStatus: "Pending",
      },
    },
  ];

  // Initialize filteredInvoices with invoices data
  useEffect(() => {
    setFilteredInvoices(invoices);
  }, []);

  // Filter invoices when activeFilter or searchQuery changes
  useEffect(() => {
    let filtered = [...invoices];

    // Apply status filter
    if (activeFilter !== "all") {
      filtered = filtered.filter((invoice) => {
        switch (activeFilter) {
          case "pending":
            return invoice.status === "Pending";
          case "completed":
            return invoice.status === "Completed";
          case "upcoming":
            return invoice.status === "In Progress";
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
          invoice.id.toLowerCase().includes(query) ||
          invoice.vendor.toLowerCase().includes(query) ||
          invoice.details?.serviceName.toLowerCase().includes(query)
      );
    }

    setFilteredInvoices(filtered);
  }, [activeFilter, searchQuery]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // const getSortIcon = (field) => {
  //   if (sortField === field) {
  //     return sortDirection === "asc" ? (
  //       <FaSortAmountUp className="ml-1" />
  //     ) : (
  //       <FaSortAmountDown className="ml-1" />
  //     );
  //   }
  //   return <FaSortAmountUp className="ml-1 opacity-30" />;
  // };

  const getStatusColor = (status) => {
    switch (status) {
      case "In Progress":
        return { bgcolor: '#e8f5e8', color: '#2e7d32' };
      case "Completed":
        return { bgcolor: '#e3f2fd', color: '#1976d2' };
      case "Pending":
        return { bgcolor: '#fff3e0', color: '#f57c00' };
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
      const allItemIds = invoices.map((item) => item.id);
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

  // Edit handler
  const handleEdit = (index) => {
    console.log("Editing item:", invoices[index]);
    // Implement edit functionality
  };

  // Delete handler
  const handleDelete = (index) => {
    console.log("Deleting item:", invoices[index]);
    // Implement delete functionality
  };

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
              {sortedInvoices.map((invoice) => {
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
                      active={sortField === 'id'}
                      direction={sortField === 'id' ? sortDirection : 'asc'}
                      onClick={() => handleSort('id')}
                    >
                      Inv. No.
                      {sortField === 'id' ? (
                        <Box component="span" sx={visuallyHidden}>
                          {sortDirection === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#555' }}>
                    <TableSortLabel
                      active={sortField === 'vendor'}
                      direction={sortField === 'vendor' ? sortDirection : 'asc'}
                      onClick={() => handleSort('vendor')}
                    >
                      Vendor
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#555' }}>
                    <TableSortLabel
                      active={sortField === 'date'}
                      direction={sortField === 'date' ? sortDirection : 'asc'}
                      onClick={() => handleSort('date')}
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
                {sortedInvoices.map((invoice, index) => {
                  const statusStyle = getStatusColor(invoice.status);
                  return (
                    <TableRow
                      key={invoice.id}
                      sx={{
                        '&:hover': { bgcolor: '#f8f9fa' },
                        '&:last-child td, &:last-child th': { border: 0 }
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedItems.includes(invoice.id)}
                          onChange={(e) => handleSelectItem(e, invoice.id)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500, color: '#333' }}>
                        {invoice.id}
                      </TableCell>
                      <TableCell sx={{ color: '#666' }}>
                        {invoice.vendor}
                      </TableCell>
                      <TableCell sx={{ color: '#666' }}>
                        {invoice.date}
                      </TableCell>
                      <TableCell sx={{ color: '#666', fontWeight: 500 }}>
                        ${invoice.amount.toLocaleString('en-US', {
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
                            fontSize: '0.75rem'
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
                    ? `${selectedInvoice.details.paymentMethod}${
                        selectedInvoice.details.cardEnding !== "N/A"
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
