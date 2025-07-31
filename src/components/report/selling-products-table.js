import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const sellingProductsData = [
  { id: 1, name: 'Fuel', sales: 'Sold', orderType: 'Earned', trackingId: 'Placed', orderTotal: 'Processed', profit: 'Net', status: 'Confirmed' },
  { id: 2, name: 'Energy', sales: 'Delivered', orderType: 'Generated', trackingId: 'Allocated', orderTotal: 'Completed', profit: 'Gross', status: 'In Progress' },
  { id: 3, name: 'Power', sales: 'Distributed', orderType: 'Produced', trackingId: 'Assigned', orderTotal: 'Finalized', profit: 'Total', status: 'Pending' },
  { id: 4, name: 'Electricity', sales: 'Supplied', orderType: 'Achieved', trackingId: 'Settled', orderTotal: 'Executed', profit: 'Balance', status: 'Completed' },
  { id: 5, name: 'Gas', sales: 'Rendered', orderType: 'Accumulated', trackingId: 'Distributed', orderTotal: 'Confirmed', profit: 'Surplus', status: 'Flagged' },
];

const getStatusChip = (status) => {
  const statusStyles = {
    'Confirmed': { backgroundColor: '#F6FEF9', color: '#027A48', border: '1px solid #D1FADF' },
    'In Progress': { backgroundColor: '#F0F9FF', color: '#026AA2', border: '1px solid #B2DDFF' },
    'Pending': { backgroundColor: '#FFFCF5', color: '#B54708', border: '1px solid #FEF0C7' },
    'Completed': { backgroundColor: '#F0F9FF', color: '#026AA2', border: '1px solid #B2DDFF' }, // Re-using style for completed
    'Flagged': { backgroundColor: '#FFF8F7', color: '#B42318', border: '1px solid #FEE4E2' },
  };
  return <Chip label={status} size="small" sx={{ ...statusStyles[status], borderRadius: '6px', fontWeight: 500, padding: '2px 4px' }} />;
};

const tableHeaders = ["Product Name", "Sales", "Order Type", "Tracking ID", "Order Total", "Profit", "Status"];

const SellingProductsTable = () => {
  return (
    <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid #EAECF0' }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Selling Products
        </Typography>
        <Button
          variant="contained"
          startIcon={<AutoAwesomeIcon />}
          sx={{
            backgroundColor: '#175CD3',
            color: 'white',
            borderRadius: '8px',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#1550B3'
            }
          }}
        >
          AI Report Generate
        </Button>
      </Box>
      <TableContainer>
        <Table>
          <TableHead sx={{ backgroundColor: '#F9FAFB' }}>
            <TableRow>
              {tableHeaders.map(header => (
                <TableCell key={header} sx={{ color: '#475467', fontWeight: 500 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {header}
                    <IconButton size="small" sx={{ ml: 0.5 }}>
                      <FilterListIcon sx={{ fontSize: '1rem' }} />
                    </IconButton>
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sellingProductsData.map((row) => (
              <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row" sx={{ fontWeight: 500, color: '#101828' }}>{row.name}</TableCell>
                <TableCell>{row.sales}</TableCell>
                <TableCell>{row.orderType}</TableCell>
                <TableCell>{row.trackingId}</TableCell>
                <TableCell>{row.orderTotal}</TableCell>
                <TableCell>{row.profit}</TableCell>
                <TableCell>{getStatusChip(row.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default SellingProductsTable; 