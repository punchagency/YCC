import React, { useState, useEffect } from 'react';
import { useUser } from "../../context/userContext";
import { useTheme } from "../../context/theme/themeContext";
import { useOutletContext } from "react-router-dom";
import {
    Box,
    Card,
    CardContent,
    CardActions,
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
    Tabs,
    Tab,
    Badge,
    Pagination,
} from "@mui/material";
import {
    Search as SearchIcon,
    MoreVert as MoreVertIcon,
    CheckCircle as CheckCircleIcon,
    LocalShipping as LocalShippingIcon,
    Cancel as CancelIcon,
    Visibility as VisibilityIcon,
    Done as DoneIcon,
    Close as CloseIcon,
    ShoppingCart as ShoppingCartIcon,
    Inventory as InventoryIcon,
    Person as PersonIcon,
    CalendarToday as CalendarIcon,
    AttachMoney as MoneyIcon,
    Schedule as ScheduleIcon,
} from "@mui/icons-material";
import { getSupplierOrders } from '../../services/order/orderService';
import { format } from 'date-fns';
import { useNavigate } from "react-router-dom";

const SupplierOrder = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const muiTheme = useMuiTheme();
    const [supplierOrders, setSupplierOrders] = useState([]);
    const [orderCounts, setOrderCounts] = useState({
        pending: 0,
        confirmed: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
        total: 0
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [orderStatus, setOrderStatus] = useState("all");
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [anchorEl, setAnchorEl] = useState(null);
    const [actionOrderId, setActionOrderId] = useState(null);
    const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const { setPageTitle } = useOutletContext() || {};
    useEffect(() => {
        if (setPageTitle) setPageTitle("Orders");
    }, [setPageTitle]);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const response = await getSupplierOrders(orderStatus !== "all" ? orderStatus : "all");
            if (response.success) {
                setSupplierOrders(response.data.data.result || []);
                setOrderCounts(response.data.data.orderCounts || {
                    pending: 0,
                    confirmed: 0,
                    shipped: 0,
                    delivered: 0,
                    cancelled: 0,
                    total: 0
                });
            } else {
                setSnackbar({
                    open: true,
                    message: response.error || "Failed to fetch orders",
                    severity: "error",
                });
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            setSnackbar({
                open: true,
                message: "An error occurred while fetching orders",
                severity: "error",
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [orderStatus]);

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleStatusChange = (event, newValue) => {
        setOrderStatus(newValue);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleMenuOpen = (event, orderId) => {
        setAnchorEl(event.currentTarget);
        setActionOrderId(orderId);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setActionOrderId(null);
    };

    const handleOrderAction = async ({ action, order }) => {
        if (!actionOrderId) return;

        setIsLoading(true);
        try {
            if (action === 'confirmed') {
                navigate(`/supplier/orders/confirm/${order._id}/${order.confirmationToken}`);
            }
        } catch (error) {
            console.error(`Error ${action} order:`, error);
            setSnackbar({
                open: true,
                message: `An error occurred while ${action} the order`,
                severity: "error",
            });
        } finally {
            setIsLoading(false);
            handleMenuClose();
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "pending":
                return "#ff9800";
            case "confirmed":
                return "#2196f3";
            case "shipped":
                return "#9c27b0";
            case "delivered":
                return "#4caf50";
            case "cancelled":
            case "declined":
                return "#f44336";
            default:
                return "#757575";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "pending":
                return <ShoppingCartIcon fontSize="small" />;
            case "confirmed":
                return <CheckCircleIcon fontSize="small" />;
            case "shipped":
                return <LocalShippingIcon fontSize="small" />;
            case "delivered":
                return <DoneIcon fontSize="small" />;
            case "cancelled":
            case "declined":
                return <CancelIcon fontSize="small" />;
            default:
                return null;
        }
    };

    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'MMM dd, yyyy');
        } catch (error) {
            return "Invalid Date";
        }
    };

    const getAvailableActions = (status) => {
        switch (status) {
            case "pending":
                return ["confirmed", "declined"];
            case "confirmed":
                return ["shipped", "cancelled"];
            case "shipped":
                return ["delivered"];
            default:
                return [];
        }
    };

    const getActionLabel = (action) => {
        switch (action) {
            case "confirmed":
                return "Confirm Order";
            case "declined":
                return "Decline Order";
            case "shipped":
                return "Mark as Shipped";
            case "delivered":
                return "Mark as Delivered";
            case "cancelled":
                return "Cancel Order";
            default:
                return action.charAt(0).toUpperCase() + action.slice(1);
        }
    };

    const filteredOrders = supplierOrders.filter(order => {
        if (!searchQuery) return true;

        const searchLower = searchQuery.toLowerCase();
        return (
            order.order?.orderId?.toLowerCase().includes(searchLower) ||
            order.order?.deliveryAddress?.recipientName?.toLowerCase().includes(searchLower) ||
            order.products.some(p => p.product?.name?.toLowerCase().includes(searchLower))
        );
    });

    const paginatedOrders = filteredOrders
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    // Mobile order card component
    const MobileOrderCard = ({ order }) => {
        const availableActions = getAvailableActions(order.status);

        return (
            <Card sx={{ mb: 2, borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{
                    height: '8px',
                    bgcolor: getStatusColor(order.status),
                    width: '100%'
                }} />
                <CardContent sx={{ p: 2 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Typography variant="subtitle1" fontWeight={600}>
                            {order.order?.orderId || "N/A"}
                        </Typography>
                        <Chip
                            size="small"
                            label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            icon={getStatusIcon(order.status)}
                            sx={{
                                bgcolor: alpha(getStatusColor(order.status), 0.1),
                                color: getStatusColor(order.status),
                                fontWeight: 500,
                                '& .MuiChip-icon': { color: getStatusColor(order.status) }
                            }}
                        />
                    </Stack>

                    <Stack spacing={2} sx={{ mt: 2 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <PersonIcon fontSize="small" color="action" />
                            <Box>
                                <Typography variant="body2">
                                    {order.order?.deliveryAddress?.recipientName || "N/A"}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {order.order?.deliveryAddress?.recipientPhone || ""}
                                </Typography>
                            </Box>
                        </Stack>

                        <Stack direction="row" spacing={1} alignItems="center">
                            <MoneyIcon fontSize="small" color="action" />
                            <Typography variant="body2" fontWeight={500}>
                                ${order.subTotal.toFixed(2)}
                            </Typography>
                        </Stack>

                        <Stack direction="row" spacing={1} alignItems="flex-start">
                            <ShoppingCartIcon fontSize="small" color="action" sx={{ mt: 0.5 }} />
                            <Box>
                                {order.products.map((item, idx) => (
                                    <Typography key={idx} variant="body2">
                                        {item.quantity}x {item.product?.name || "Unknown Product"}
                                    </Typography>
                                ))}
                            </Box>
                        </Stack>

                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <CalendarIcon fontSize="small" color="action" />
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Order Date</Typography>
                                        <Typography variant="body2">
                                            {formatDate(order.order?.orderDate)}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Grid>
                            <Grid item xs={6}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <ScheduleIcon fontSize="small" color="action" />
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Delivery Date</Typography>
                                        <Typography variant="body2">
                                            {formatDate(order.deliveryDate)}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Stack>
                </CardContent>

                {availableActions.length > 0 && (
                    <>
                        <Divider />
                        <CardActions sx={{ p: 2, pt: 1, display: 'flex', justifyContent: 'end' }}>
                            <Button
                                key={order._id}
                                onClick={() => {
                                    if (order.status === 'pending') {
                                        navigate(`/supplier/orders/confirm/${order._id}/${order.confirmationToken}`);
                                    } else {
                                        navigate('/supplier/orders-details', { state: { selectedOrder: order } });
                                    }
                                }}
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
                                View Details
                            </Button>
                        </CardActions>
                    </>
                )}
            </Card>
        );
    };

    return (
        <Box sx={{ p: 4, paddingTop: "80px" }}>
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
                                Manage Orders
                            </Typography>
                            <Typography sx={{ opacity: 0.9, color: '#fafafa' }}>
                                View and manage all your customer orders
                            </Typography>
                        </Box>
                        <Chip
                            icon={<ShoppingCartIcon />}
                            label={`${orderCounts.total || 0} Total Orders`}
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

            {/* Search and Filter */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        placeholder="Search orders by ID, customer name, or product"
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

            {/* Status Tabs */}
            <Paper sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
                <Tabs
                    value={orderStatus}
                    onChange={handleStatusChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        '& .MuiTab-root': {
                            minWidth: 120,
                            py: 2
                        }
                    }}
                >
                    <Tab
                        value="all"
                        label={
                            <Badge badgeContent={orderCounts.total || 0} color="primary">
                                <Box sx={{ pr: 2 }}>All Orders</Box>
                            </Badge>
                        }
                    />
                    <Tab
                        value="pending"
                        label={
                            <Badge badgeContent={orderCounts.pending || 0} color="warning">
                                <Box sx={{ pr: 2 }}>Pending</Box>
                            </Badge>
                        }
                    />
                    <Tab
                        value="confirmed"
                        label={
                            <Badge badgeContent={orderCounts.confirmed || 0} color="info">
                                <Box sx={{ pr: 2 }}>Confirmed</Box>
                            </Badge>
                        }
                    />
                    <Tab
                        value="shipped"
                        label={
                            <Badge badgeContent={orderCounts.shipped || 0} color="secondary">
                                <Box sx={{ pr: 2 }}>Shipped</Box>
                            </Badge>
                        }
                    />
                    <Tab
                        value="delivered"
                        label={
                            <Badge badgeContent={orderCounts.delivered || 0} color="success">
                                <Box sx={{ pr: 2 }}>Delivered</Box>
                            </Badge>
                        }
                    />
                    <Tab
                        value="cancelled"
                        label={
                            <Badge badgeContent={orderCounts.cancelled || 0} color="error">
                                <Box sx={{ pr: 2 }}>Cancelled</Box>
                            </Badge>
                        }
                    />
                </Tabs>
            </Paper>

            {/* Orders - Table for Desktop, Cards for Mobile */}
            <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
                        <CircularProgress />
                    </Box>
                ) : filteredOrders.length === 0 ? (
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
                            <InventoryIcon sx={{ fontSize: 40 }} />
                        </Avatar>
                        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                            No Orders Found
                        </Typography>
                        <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 500 }}>
                            {searchQuery
                                ? "No orders match your search criteria. Try adjusting your search terms."
                                : orderStatus !== "all"
                                    ? `You don't have any ${orderStatus} orders at the moment.`
                                    : "You don't have any orders yet. Orders will appear here when customers place them."}
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
                                                <TableCell>Order ID</TableCell>
                                                <TableCell>Customer</TableCell>
                                                <TableCell>Products</TableCell>
                                                <TableCell>Total</TableCell>
                                                <TableCell>Order Date</TableCell>
                                                <TableCell>Delivery Date</TableCell>
                                                <TableCell>Status</TableCell>
                                                <TableCell align="center">Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {paginatedOrders.map((order) => {

                                                return (
                                                    <TableRow key={order._id} hover>
                                                        <TableCell>
                                                            <Typography variant="body2" fontWeight={500}>
                                                                {order.order?.orderId || "N/A"}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2">
                                                                {order.order?.deliveryAddress?.recipientName || "N/A"}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {order.order?.deliveryAddress?.recipientPhone || ""}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Stack spacing={1}>
                                                                {order.products.map((item, idx) => (
                                                                    <Typography key={idx} variant="body2" noWrap>
                                                                        {item.quantity}x {item.product?.name || "Unknown Product"}
                                                                    </Typography>
                                                                ))}
                                                            </Stack>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2" fontWeight={500}>
                                                                ${order.subTotal.toFixed(2)}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2">
                                                                {formatDate(order.order?.orderDate)}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2">
                                                                {formatDate(order.deliveryDate)}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                size="small"
                                                                label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                                icon={getStatusIcon(order.status)}
                                                                sx={{
                                                                    bgcolor: alpha(getStatusColor(order.status), 0.1),
                                                                    color: getStatusColor(order.status),
                                                                    fontWeight: 500,
                                                                    '& .MuiChip-icon': { color: getStatusColor(order.status) }
                                                                }}
                                                            />
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <Button
                                                                key={order._id}
                                                                onClick={() => {
                                                                    if (order.status === 'pending') {
                                                                        navigate(`/supplier/orders/confirm/${order._id}/${order.confirmationToken}`);
                                                                    } else {
                                                                        navigate('/supplier/orders-details', { state: { selectedOrder: order } });
                                                                    }
                                                                }}
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
                                                                View Details
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25]}
                                    component="div"
                                    count={filteredOrders.length}
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
                                {paginatedOrders.map(order => (
                                    <MobileOrderCard key={order._id} order={order} />
                                ))}

                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                    <Pagination
                                        count={Math.ceil(filteredOrders.length / rowsPerPage)}
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
export default SupplierOrder;
