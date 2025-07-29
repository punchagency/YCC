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
  TableSortLabel,
  Chip,
  Paper,
  useTheme,
  useMediaQuery,
  Stack
} from "@mui/material";
import { visuallyHidden } from '@mui/utils';

const History = () => {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  // Sample payment history data
  const payments = [
    {
      id: "INV-001",
      vendor: "John Doe",
      amount: 250.0,
      payMethod: "Credit Card",
      date: "01/01/2025",
      status: "In Progress",
    },
    {
      id: "INV-002",
      vendor: "Alice Smith",
      amount: 150.0,
      payMethod: "PayPal",
      date: "02/15/2025",
      status: "Completed",
    },
    {
      id: "INV-003",
      vendor: "Bob Johnson",
      amount: 300.0,
      payMethod: "Bank Transfer",
      date: "03/22/2025",
      status: "Pending",
    },
  ];

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
      case "In Progress":
        return { color: 'success', bgcolor: '#e8f5e8', textColor: '#2e7d32' };
      case "Completed":
        return { color: 'primary', bgcolor: '#e3f2fd', textColor: '#1976d2' };
      case "Pending":
        return { color: 'warning', bgcolor: '#fff3e0', textColor: '#f57c00' };
      default:
        return { color: 'default', bgcolor: '#f5f5f5', textColor: '#666' };
    }
  };

  const sortedPayments = [...payments].sort((a, b) => {
    if (!sortField) return 0;
    const aValue = a[sortField];
    const bValue = b[sortField];
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  if (isMobile) {
    return (
      <Box sx={{ p: 2 }}>
        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: '#333' }}>
              Payment History
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
              View detailed payment information, including status and payment method, for full transparency.
            </Typography>
            
            <Stack spacing={2}>
              {sortedPayments.map((payment) => {
                const statusStyle = getStatusColor(payment.status);
                return (
                  <Card key={payment.id} variant="outlined" sx={{ borderRadius: 2 }}>
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {payment.id}
                        </Typography>
                        <Chip
                          label={payment.status}
                          size="small"
                          sx={{
                            bgcolor: statusStyle.bgcolor,
                            color: statusStyle.textColor,
                            fontWeight: 500,
                            fontSize: '0.75rem'
                          }}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                        Vendor: {payment.vendor}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                        Amount: ${payment.amount.toFixed(2)}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                        Method: {payment.payMethod}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        Date: {payment.date}
                      </Typography>
                    </CardContent>
                  </Card>
                );
              })}
            </Stack>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: '100%' }}>
      <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: '#333' }}>
            Payment History
          </Typography>
          <Typography variant="body2" sx={{ color: '#666', mb: 4 }}>
            View detailed payment information, including status and payment method, for full transparency.
          </Typography>

          <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, color: '#555' }}>
                    <TableSortLabel
                      active={sortField === 'id'}
                      direction={sortField === 'id' ? sortDirection : 'asc'}
                      onClick={() => handleSort('id')}
                    >
                      Inv No.
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
                      active={sortField === 'amount'}
                      direction={sortField === 'amount' ? sortDirection : 'asc'}
                      onClick={() => handleSort('amount')}
                    >
                      Amount
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#555' }}>
                    <TableSortLabel
                      active={sortField === 'payMethod'}
                      direction={sortField === 'payMethod' ? sortDirection : 'asc'}
                      onClick={() => handleSort('payMethod')}
                    >
                      Pay Method
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
                      active={sortField === 'status'}
                      direction={sortField === 'status' ? sortDirection : 'asc'}
                      onClick={() => handleSort('status')}
                    >
                      Status
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedPayments.map((payment) => {
                  const statusStyle = getStatusColor(payment.status);
                  return (
                    <TableRow
                      key={payment.id}
                      sx={{
                        '&:hover': { bgcolor: '#f8f9fa' },
                        '&:last-child td, &:last-child th': { border: 0 }
                      }}
                    >
                      <TableCell sx={{ fontWeight: 500, color: '#333' }}>
                        {payment.id}
                      </TableCell>
                      <TableCell sx={{ color: '#666' }}>
                        {payment.vendor}
                      </TableCell>
                      <TableCell sx={{ color: '#666', fontWeight: 500 }}>
                        ${payment.amount.toFixed(2)}
                      </TableCell>
                      <TableCell sx={{ color: '#666' }}>
                        {payment.payMethod}
                      </TableCell>
                      <TableCell sx={{ color: '#666' }}>
                        {payment.date}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={payment.status}
                          size="small"
                          sx={{
                            bgcolor: statusStyle.bgcolor,
                            color: statusStyle.textColor,
                            fontWeight: 500,
                            fontSize: '0.75rem'
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default History;
