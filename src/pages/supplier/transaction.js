import React, { useState, useEffect } from 'react';
import { useUser } from "../../context/userContext";
import { useTheme } from "../../context/theme/themeContext";
import { useOutletContext } from "react-router-dom";
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Grid,
    Avatar,
    Chip,
    Divider,
    Alert,
    Snackbar,
    Paper,
    Stack,
    useMediaQuery,
    useTheme as useMuiTheme,
    alpha,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    InputAdornment,
    CircularProgress,
    Pagination,
} from "@mui/material";
import {
    Search as SearchIcon,
    Visibility as VisibilityIcon,
    Receipt as ReceiptIcon,
    Person as PersonIcon,
    CalendarToday as CalendarIcon,
    AttachMoney as MoneyIcon,
    AccountBalance as AccountBalanceIcon,
    ReceiptLong as ReceiptLongIcon,
    PriceCheck as PriceCheckIcon,
    Payment as PaymentIcon,
} from "@mui/icons-material";
import { format } from 'date-fns';
import { getTransactionsService } from '../../services/transaction/transactionService';

const SupplierTransaction = () => {
    const { user } = useUser();
    const { theme } = useTheme();
    const muiTheme = useMuiTheme();
    const [transactions, setTransactions] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [transactionStatus, setTransactionStatus] = useState("all");
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    // Mock data for transactions
    const mockTransactions = [
        {
            orderId: "507f1f77bcf86cd799439011",
            bookingId: "507f1f77bcf86cd799439012",
            customerName: "John Doe",
            customerEmail: "john.doe@example.com",
            customerId: "507f1f77bcf86cd799439013",
            supplierId: "507f1f77bcf86cd799439014",
            vendorId: "507f1f77bcf86cd799439015",
            transactionId: "TR-5e9f8b3a2c",
            transactionDate: "2023-10-01T12:00:00Z",
            transactionAmount: 150.75,
            transactionStatus: "completed",
            stripeInvoiceId: "in_123456789",
            invoicePdfUrl: "https://example.com/invoices/invoice123.pdf",
            invoiceUrl: "https://example.com/invoices/invoice123",
            platformFee: 5.75,
            netAmount: 145.00,
            quoteId: "507f1f77bcf86cd799439016",
            createdAt: "2023-10-01T12:00:00Z",
            updatedAt: "2023-10-01T12:00:00Z"
        },
        {
            orderId: "507f1f77bcf86cd799439021",
            bookingId: "507f1f77bcf86cd799439022",
            customerName: "Jane Smith",
            customerEmail: "jane.smith@example.com",
            customerId: "507f1f77bcf86cd799439023",
            supplierId: "507f1f77bcf86cd799439024",
            vendorId: "507f1f77bcf86cd799439025",
            transactionId: "TR-6f9e8d3b2a",
            transactionDate: "2023-10-02T10:30:00Z",
            transactionAmount: 200.50,
            transactionStatus: "pending",
            stripeInvoiceId: "in_987654321",
            invoicePdfUrl: "https://example.com/invoices/invoice456.pdf",
            invoiceUrl: "https://example.com/invoices/invoice456",
            platformFee: 7.50,
            netAmount: 193.00,
            quoteId: "507f1f77bcf86cd799439026",
            createdAt: "2023-10-02T10:30:00Z",
            updatedAt: "2023-10-02T10:30:00Z"
        }
    ];

    const { setPageTitle } = useOutletContext() || {};
    useEffect(() => {
        if (setPageTitle) setPageTitle("Transactions");
    }, [setPageTitle]);

    const fetchTransactions = async () => {
        setIsLoading(true);
        try {
            // In a real app, we would use the service to fetch data
            // const response = await getTransactionsService({
            //     page: page + 1,
            //     limit: rowsPerPage,
            //     transactionStatus: transactionStatus !== "all" ? transactionStatus : undefined,
            //     search: searchQuery || undefined
            // });
            
            // Using mock data instead
            setTimeout(() => {
                setTransactions(mockTransactions);
                setIsLoading(false);
            }, 800);
        } catch (error) {
            console.error("Error fetching transactions:", error);
            setSnackbar({
                open: true,
                message: "An error occurred while fetching transactions",
                severity: "error",
            });
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [page, rowsPerPage, transactionStatus]);

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "completed":
                return "#4caf50";
            case "pending":
                return "#ff9800";
            case "failed":
                return "#f44336";
            case "refunded":
                return "#9c27b0";
            default:
                return "#757575";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "completed":
                return <PriceCheckIcon fontSize="small" />;
            case "pending":
                return <ReceiptIcon fontSize="small" />;
            case "failed":
                return <PaymentIcon fontSize="small" />;
            case "refunded":
                return <MoneyIcon fontSize="small" />;
            default:
                return <ReceiptLongIcon fontSize="small" />;
        }
    };

    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'MMM dd, yyyy');
        } catch (error) {
            return "Invalid Date";
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    const filteredTransactions = transactions.filter(transaction => {
        if (!searchQuery) return true;

        const searchLower = searchQuery.toLowerCase();
        return (
            transaction.transactionId?.toLowerCase().includes(searchLower) ||
            transaction.customerName?.toLowerCase().includes(searchLower) ||
            transaction.orderId?.toLowerCase().includes(searchLower)
        );
    });

    const paginatedTransactions = filteredTransactions
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    // Mobile transaction card component
    const MobileTransactionCard = ({ transaction }) => {
        return (
            <Card sx={{ mb: 2, borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{
                    height: '8px',
                    bgcolor: getStatusColor(transaction.transactionStatus),
                    width: '100%'
                }} />
                <CardContent sx={{ p: 2 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Typography variant="subtitle1" fontWeight={600}>
                            {transaction.transactionId}
                        </Typography>
                        <Chip
                            size="small"
                            label={transaction.transactionStatus.charAt(0).toUpperCase() + transaction.transactionStatus.slice(1)}
                            icon={getStatusIcon(transaction.transactionStatus)}
                            sx={{
                                bgcolor: alpha(getStatusColor(transaction.transactionStatus), 0.1),
                                color: getStatusColor(transaction.transactionStatus),
                                fontWeight: 500,
                                '& .MuiChip-icon': { color: getStatusColor(transaction.transactionStatus) }
                            }}
                        />
                    </Stack>

                    <Stack spacing={2} sx={{ mt: 2 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <PersonIcon fontSize="small" color="action" />
                            <Box>
                                <Typography variant="body2">
                                    {transaction.customerName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {transaction.customerEmail}
                                </Typography>
                            </Box>
                        </Stack>

                        <Stack direction="row" spacing={1} alignItems="center">
                            <MoneyIcon fontSize="small" color="action" />
                            <Box>
                                <Typography variant="body2" fontWeight={500}>
                                    {formatCurrency(transaction.transactionAmount)}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Net: {formatCurrency(transaction.netAmount)}
                                </Typography>
                            </Box>
                        </Stack>

                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <CalendarIcon fontSize="small" color="action" />
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Transaction Date</Typography>
                                        <Typography variant="body2">
                                            {formatDate(transaction.transactionDate)}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Grid>
                            <Grid item xs={6}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <ReceiptLongIcon fontSize="small" color="action" />
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Order ID</Typography>
                                        <Typography variant="body2" noWrap sx={{ maxWidth: '120px' }}>
                                            {transaction.orderId}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Stack>
                </CardContent>

                <Divider />
                <Box sx={{ p: 2, pt: 1, display: 'flex', justifyContent: 'end' }}>
                    <Button
                        href={transaction.invoiceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            color: '#333',
                            borderColor: '#ccc',
                            borderRadius: '12px',
                            '&:hover': {
                                borderColor: '#999',
                                backgroundColor: alpha('#ccc', 0.1)
                            },
                        }}
                    >
                        <ListItemIcon>
                            <VisibilityIcon fontSize="small" />
                        </ListItemIcon>
                        View Invoice
                    </Button>
                </Box>
            </Card>
        );
    };

    return (
        <Box sx={{ p: {xs: 1, sm: 1.4, lg: 4}, paddingTop: "80px" }}>
            {/* Header with gradient background */}
            <Paper
                elevation={0}
                sx={{
                    mb: 4,
                    p: 3,
                    borderRadius: 3,
                    background: theme === "light"
                        ? 'linear-gradient(135deg, #003366 0%, #0066cc 100%)'
                        : 'linear-gradient(135deg, #001a33 0%, #003366 100%)',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: -20,
                        right: -20,
                        width: 200,
                        height: 200,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)',
                        zIndex: 0
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: -40,
                        left: -40,
                        width: 150,
                        height: 150,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.05)',
                        zIndex: 0
                    }}
                />
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                                Transaction History
                            </Typography>
                            <Typography sx={{ opacity: 0.9, color: '#fafafa' }}>
                                View and manage all your financial transactions
                            </Typography>
                        </Box>
                        <Chip
                            icon={<AccountBalanceIcon />}
                            label={`${transactions.length} Transactions`}
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.15)',
                                color: 'white',
                                fontWeight: 500,
                                mt: { xs: 2, sm: 0 },
                                '& .MuiChip-icon': { color: 'white' }
                            }}
                        />
                    </Stack>
                </Box>
            </Paper>

            {/* Search */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        placeholder="Search by transaction ID, customer name, or order ID"
                        variant="outlined"
                        value={searchQuery}
                        onChange={handleSearch}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                            sx: { borderRadius: 2 }
                        }}
                    />
                </Grid>
            </Grid>

            {/* Transactions - Table for Desktop, Cards for Mobile */}
            <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
                        <CircularProgress />
                    </Box>
                ) : filteredTransactions.length === 0 ? (
                    <Box sx={{
                        py: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        px: 3,
                        textAlign: 'center'
                    }}>
                        <Avatar
                            sx={{
                                width: 80,
                                height: 80,
                                mb: 2,
                                bgcolor: alpha(muiTheme.palette.primary.main, 0.1),
                                color: muiTheme.palette.primary.main
                            }}
                        >
                            <ReceiptLongIcon sx={{ fontSize: 40 }} />
                        </Avatar>
                        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                            No Transactions Found
                        </Typography>
                        <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 500 }}>
                            {searchQuery
                                ? "No transactions match your search criteria. Try adjusting your search terms."
                                : "You don't have any transactions yet. Transactions will appear here when payments are processed."}
                        </Typography>
                    </Box>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        {!isMobile && (
                            <>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Transaction ID</TableCell>
                                                <TableCell>Customer</TableCell>
                                                <TableCell>Order ID</TableCell>
                                                <TableCell>Date</TableCell>
                                                <TableCell>Amount</TableCell>
                                                <TableCell>Net Amount</TableCell>
                                                <TableCell>Status</TableCell>
                                                <TableCell align="center">Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {paginatedTransactions.map((transaction) => (
                                                <TableRow key={transaction.transactionId} hover>
                                                    <TableCell>
                                                        <Typography variant="body2" fontWeight={500}>
                                                            {transaction.transactionId}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2">
                                                            {transaction.customerName}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {transaction.customerEmail}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" noWrap>
                                                            {transaction.orderId}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2">
                                                            {formatDate(transaction.transactionDate)}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" fontWeight={500}>
                                                            {formatCurrency(transaction.transactionAmount)}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2">
                                                            {formatCurrency(transaction.netAmount)}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Fee: {formatCurrency(transaction.platformFee)}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            size="small"
                                                            label={transaction.transactionStatus.charAt(0).toUpperCase() + transaction.transactionStatus.slice(1)}
                                                            icon={getStatusIcon(transaction.transactionStatus)}
                                                            sx={{
                                                                bgcolor: alpha(getStatusColor(transaction.transactionStatus), 0.1),
                                                                color: getStatusColor(transaction.transactionStatus),
                                                                fontWeight: 500,
                                                                '& .MuiChip-icon': { color: getStatusColor(transaction.transactionStatus) }
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Button
                                                            href={transaction.invoiceUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            sx={{
                                                                color: '#333',
                                                                borderColor: '#ccc',
                                                                borderRadius: '12px',
                                                                '&:hover': {
                                                                    borderColor: '#999',
                                                                    backgroundColor: alpha('#ccc', 0.1)
                                                                },
                                                            }}
                                                        >
                                                            <ListItemIcon>
                                                                <VisibilityIcon fontSize="small" />
                                                            </ListItemIcon>
                                                            View Invoice
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25]}
                                    component="div"
                                    count={filteredTransactions.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </>
                        )}

                        {/* Mobile Card View */}
                        {isMobile && (
                            <Box sx={{ p: 2 }}>
                                {paginatedTransactions.map(transaction => (
                                    <MobileTransactionCard key={transaction.transactionId} transaction={transaction} />
                                ))}

                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                    <Pagination
                                        count={Math.ceil(filteredTransactions.length / rowsPerPage)}
                                        page={page + 1}
                                        onChange={(e, newPage) => handleChangePage(e, newPage - 1)}
                                        color="primary"
                                    />
                                </Box>
                            </Box>
                        )}
                    </>
                )}
            </Paper>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

const ListItemIcon = ({ children }) => (
    <Box sx={{ minWidth: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {children}
    </Box>
);

export default SupplierTransaction;