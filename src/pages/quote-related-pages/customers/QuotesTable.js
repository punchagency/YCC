import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  Select,
  MenuItem,
  FormControl,
  Alert,
  useTheme,
  useMediaQuery,
  Divider,
  Skeleton
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import { getCrewQuotes } from "../../../services/bookings/quoteService";

const QuotesTable = () => {
  const [quotes, setQuotes] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const pageSize = 10;
  const navigate = useNavigate();

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "quoted", label: "Quoted" },
    { value: "accepted", label: "Accepted" },
    { value: "declined", label: "Declined" },
    { value: "deposit_paid", label: "Deposit Paid" },
    { value: "final_payment_due", label: "Final Payment Due" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" }
  ];

  const fetchQuotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page: currentPage, limit: pageSize };
      if (statusFilter) params.status = statusFilter;
      
      const response = await getCrewQuotes(params);
      if (response.status) {
        setQuotes(response.data.result);
        setTotalPages(response.data.totalPages);
        setTotalItems(response.data.totalData);
      } else {
        setQuotes([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    } catch (err) {
      console.error('Error fetching quotes:', err);
      setError(err.message || 'Failed to fetch quotes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, [currentPage, statusFilter]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };



  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending": return "warning";
      case "quoted": return "success";
      case "accepted": return "info";
      case "declined": return "error";
      case "deposit_paid": return "success";
      case "final_payment_due": return "warning";
      case "completed": return "success";
      case "cancelled": return "error";
      default: return "default";
    }
  };

  const sortedQuotes = [...quotes].sort((a, b) => {
    if (!sortField) return 0;
    const aValue = sortField.includes('.')
      ? sortField.split('.').reduce((obj, key) => obj?.[key], a)
      : a[sortField];
    const bValue = sortField.includes('.')
      ? sortField.split('.').reduce((obj, key) => obj?.[key], b)
      : b[sortField];

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const formatServices = (services) => {
    if (!services || services.length === 0) return 'N/A';
    return services.map(s => s.service?.name).filter(Boolean).join(', ') || 'N/A';
  };

  const handleViewDetails = (quoteId) => {
    const quoteDetails = quotes.find(quote => quote._id === quoteId);
    navigate(`/crew/quotes/${quoteId}`, { state: { quoteDetails } });
  };

  const renderLoadingSkeleton = () => (
    isMobile ? (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
        {[...Array(3)].map((_, index) => (
          <Card key={index} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Skeleton variant="text" width={120} height={20} />
                <Skeleton variant="rounded" width={80} height={24} />
              </Box>
              <Skeleton variant="text" width="100%" height={16} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="80%" height={16} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="60%" height={16} sx={{ mb: 1 }} />
              <Divider sx={{ my: 1.5 }} />
              <Skeleton variant="rounded" width="100%" height={36} />
            </CardContent>
          </Card>
        ))}
      </Box>
    ) : (
      <TableContainer sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: 'grey.50' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Quote ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Services</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Vendor</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton variant="text" width={100} /></TableCell>
                <TableCell><Skeleton variant="text" width={150} /></TableCell>
                <TableCell><Skeleton variant="text" width={120} /></TableCell>
                <TableCell><Skeleton variant="text" width={80} /></TableCell>
                <TableCell><Skeleton variant="text" width={100} /></TableCell>
                <TableCell><Skeleton variant="rounded" width={80} height={24} /></TableCell>
                <TableCell sx={{ textAlign: 'center' }}><Skeleton variant="rounded" width={60} height={32} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
  );

  const renderEmptyState = () => (
    isMobile ? (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No Quotes Found
        </Typography>
        <Typography color="text.secondary">
          {statusFilter ? 'No quotes match the selected filter.' : "You haven't made any quote requests yet."}
        </Typography>
      </Box>
    ) : (
      <TableContainer sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: 'grey.50' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>
                <TableSortLabel
                  active={sortField === '_id'}
                  direction={sortField === '_id' ? sortDirection : 'asc'}
                  onClick={() => handleSort('_id')}
                >
                  Quote ID
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Services</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>
                <TableSortLabel
                  active={sortField === 'vendor.businessName'}
                  direction={sortField === 'vendor.businessName' ? sortDirection : 'asc'}
                  onClick={() => handleSort('vendor.businessName')}
                >
                  Vendor
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>
                <TableSortLabel
                  active={sortField === 'amount'}
                  direction={sortField === 'amount' ? sortDirection : 'asc'}
                  onClick={() => handleSort('amount')}
                >
                  Amount
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>
                <TableSortLabel
                  active={sortField === 'createdAt'}
                  direction={sortField === 'createdAt' ? sortDirection : 'asc'}
                  onClick={() => handleSort('createdAt')}
                >
                  Date
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell colSpan={7} sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No Quotes Found
                </Typography>
                <Typography color="text.secondary">
                  {statusFilter ? 'No quotes match the selected filter.' : "You haven't made any quote requests yet."}
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    )
  );

  if (error) {
    return (
      <Alert 
        severity="error" 
        action={
          <Button color="inherit" size="small" onClick={fetchQuotes} startIcon={<RefreshIcon />}>
            Retry
          </Button>
        }
        sx={{ borderRadius: 3 }}
      >
        {error}
      </Alert>
    );
  }

  return (
    <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
      {/* Header with Filter */}
      <Box sx={{ 
        p: 2, 
        borderBottom: 1, 
        borderColor: 'divider', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Typography variant="h6" fontWeight={600}>Quotes</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterListIcon color="action" />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              displayEmpty
            >
              {statusOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Box sx={{ p: 3 }}>
        {loading ? (
          renderLoadingSkeleton()
        ) : !sortedQuotes.length ? (
          renderEmptyState()
        ) : (
          isMobile ? (
            // Mobile Card Layout
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {sortedQuotes.map((quote) => (
                <Card key={quote._id} sx={{ 
                  borderRadius: 3,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                    transform: 'translateY(-2px)'
                  }
                }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                      <Typography variant="body2" fontWeight={600} color="primary">
                        {quote._id}
                      </Typography>
                      <Chip 
                        label={quote.status} 
                        color={getStatusColor(quote.status)}
                        size="small"
                        sx={{ textTransform: 'capitalize', fontWeight: 500 }}
                      />
                    </Box>
                    
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="caption" color="text.secondary">Services</Typography>
                      <Typography variant="body2" fontWeight={500}>{formatServices(quote.services)}</Typography>
                    </Box>
                    
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="caption" color="text.secondary">Vendor</Typography>
                      <Typography variant="body2">{quote.vendor?.businessName || 'N/A'}</Typography>
                    </Box>
                    
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="caption" color="text.secondary">Amount</Typography>
                      <Typography variant="body2" fontWeight={600} color="success.main">${quote.amount || 0}</Typography>
                    </Box>
                    
                    <Box sx={{ mb: 1.5 }}>
                      <Typography variant="caption" color="text.secondary">Date</Typography>
                      <Typography variant="body2">{new Date(quote.createdAt).toLocaleDateString()}</Typography>
                    </Box>
                    
                    <Divider sx={{ my: 1.5 }} />
                    <Button
                      onClick={() => handleViewDetails(quote._id)}
                      variant="contained"
                      fullWidth
                      startIcon={<VisibilityIcon />}
                      sx={{ borderRadius: 2 }}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : (
            // Desktop Table Layout
            <TableContainer sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead sx={{ bgcolor: 'grey.50' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>
                      <TableSortLabel
                        active={sortField === '_id'}
                        direction={sortField === '_id' ? sortDirection : 'asc'}
                        onClick={() => handleSort('_id')}
                      >
                        Quote ID
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Services</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      <TableSortLabel
                        active={sortField === 'vendor.businessName'}
                        direction={sortField === 'vendor.businessName' ? sortDirection : 'asc'}
                        onClick={() => handleSort('vendor.businessName')}
                      >
                        Vendor
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      <TableSortLabel
                        active={sortField === 'amount'}
                        direction={sortField === 'amount' ? sortDirection : 'asc'}
                        onClick={() => handleSort('amount')}
                      >
                        Amount
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      <TableSortLabel
                        active={sortField === 'createdAt'}
                        direction={sortField === 'createdAt' ? sortDirection : 'asc'}
                        onClick={() => handleSort('createdAt')}
                      >
                        Date
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedQuotes.map((quote, idx) => (
                    <TableRow 
                      key={quote._id}
                      sx={{ 
                        '&:hover': { bgcolor: 'grey.50' },
                        bgcolor: idx % 2 === 1 ? 'grey.25' : 'transparent'
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight={500} color="primary">
                          {quote._id}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 200 }}>
                        <Typography variant="body2" noWrap>
                          {formatServices(quote.services)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {quote.vendor?.businessName || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600} color="success.main">
                          ${quote.amount || 0}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(quote.createdAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={quote.status} 
                          color={getStatusColor(quote.status)}
                          size="small"
                          sx={{ textTransform: 'capitalize', fontWeight: 500 }}
                        />
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Button
                          onClick={() => handleViewDetails(quote._id)}
                          variant="contained"
                          size="small"
                          startIcon={<VisibilityIcon />}
                          sx={{ borderRadius: 2 }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )
        )}

        {/* Pagination */}
        {!loading && sortedQuotes.length > 0 && (
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: 1,
            borderColor: 'divider',
            pt: 2,
            mt: 2,
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Typography variant="body2" color="text.secondary">
              {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, totalItems)} of {totalItems} items
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                startIcon={<ChevronLeftIcon />}
                variant="outlined"
                size="small"
              >
                Previous
              </Button>
              <Typography variant="body2" color="text.secondary" sx={{ px: 1 }}>
                Page {currentPage} of {totalPages}
              </Typography>
              <Button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                endIcon={<ChevronRightIcon />}
                variant="outlined"
                size="small"
              >
                Next
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default QuotesTable; 