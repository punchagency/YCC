import React, { useState, useEffect } from 'react';
import { useTheme } from "../../context/theme/themeContext";
import { useLocation, useOutletContext, useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    Button,
    Grid,
    Chip,
    Divider,
    Alert,
    Snackbar,
    Paper,
    Stack,
    useMediaQuery,
    useTheme as useMuiTheme,
    alpha,
    Container,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    CircularProgress,
} from "@mui/material";
import {
    ArrowBack as ArrowBackIcon,
    CheckCircle as CheckCircleIcon,
    LocalShipping as LocalShippingIcon,
    Cancel as CancelIcon,
    Done as DoneIcon,
    ShoppingCart as ShoppingCartIcon,
    LocationOn as LocationOnIcon,
    CalendarToday as CalendarIcon,
    Person as PersonIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    Notes as NotesIcon,
    Business as BusinessIcon,
} from "@mui/icons-material";
import { format } from 'date-fns';

// Status chip component for consistent styling
const StatusChip = ({ status }) => {
    const getStatusConfig = (status) => {
        switch (status) {
            case "pending":
                return { color: "#856404", bg: "#fff3cd", icon: <ShoppingCartIcon fontSize="small" /> };
            case "confirmed":
                return { color: "#155724", bg: "#d4edda", icon: <CheckCircleIcon fontSize="small" /> };
            case "shipped":
                return { color: "#0c5460", bg: "#d1ecf1", icon: <LocalShippingIcon fontSize="small" /> };
            case "delivered":
                return { color: "#6f42c1", bg: "#e2d9f3", icon: <DoneIcon fontSize="small" /> };
            case "cancelled":
            case "declined":
                return { color: "#721c24", bg: "#f8d7da", icon: <CancelIcon fontSize="small" /> };
            default:
                return { color: "#6c757d", bg: "#f8f9fa", icon: null };
        }
    };

    const config = getStatusConfig(status);
    return (
        <Chip
            icon={config.icon}
            label={status.charAt(0).toUpperCase() + status.slice(1)}
            size="small"
            sx={{
                backgroundColor: config.bg,
                color: config.color,
                fontWeight: 600,
                fontSize: "0.75rem",
                borderRadius: 4,
                '& .MuiChip-icon': { color: config.color }
            }}
        />
    );
};

// Section header component
const SectionHeader = ({ title, icon }) => (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        {icon}
        <Typography variant="h6" fontWeight={600} color="#495057">
            {title}
        </Typography>
    </Stack>
);

// Product card component
const ProductCard = ({ product }) => {
    const muiTheme = useMuiTheme();
    
    return (
        <Paper 
            elevation={0} 
            sx={{ 
                p: 2.5, 
                borderRadius: 2, 
                border: '1px solid #e9ecef',
                mb: 2
            }}
        >
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" fontWeight={600} color="#212529" mb={1}>
                        {product.product?.name || "Unknown Product"}
                    </Typography>
                    {Array.isArray(product.product?.category) && product.product.category.length > 0 && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {product.product.category.map((cat, index) => (
                                <Chip
                                    key={index}
                                    label={cat}
                                    size="small"
                                    sx={{
                                        backgroundColor: '#e9ecef',
                                        color: '#495057',
                                        fontWeight: 500,
                                        fontSize: '0.75rem',
                                    }}
                                />
                            ))}
                        </Box>
                    )}
                </Grid>
                <Grid item xs={6} md={3}>
                    <Typography variant="body2" color="#6c757d">
                        Quantity: <strong>{product.quantity}</strong>
                    </Typography>
                    <Typography variant="body2" color="#6c757d">
                        Price: <strong>${product.price.toFixed(2)}</strong>
                    </Typography>
                </Grid>
                <Grid item xs={6} md={3} textAlign="right">
                    <Typography variant="subtitle1" fontWeight={600} color="primary">
                        ${(product.price * product.quantity).toFixed(2)}
                    </Typography>
                </Grid>
            </Grid>
        </Paper>
    );
};

const OrderDetails = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const muiTheme = useMuiTheme();
    const { state } = useLocation();
    const { selectedOrder } = state || {};
    const { setPageTitle } = useOutletContext() || {};
    const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
    const [isLoading, setIsLoading] = useState(false);
    const [actionDialogOpen, setActionDialogOpen] = useState(false);
    const [currentAction, setCurrentAction] = useState(null);
    const [actionReason, setActionReason] = useState('');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    useEffect(() => {
        if (setPageTitle) setPageTitle("Order Details");
    }, [setPageTitle]);

    if (!selectedOrder) {
        return (
            <Box sx={{ p: 4, paddingTop: "80px", textAlign: "center" }}>
                <Alert severity="warning" sx={{ mb: 2 }}>
                    No order details found. Please select an order from the orders list.
                </Alert>
                <Button 
                    variant="contained" 
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/supplier/orders')}
                >
                    Back to Orders
                </Button>
            </Box>
        );
    }

    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'MMM dd, yyyy');
        } catch (error) {
            return "Invalid Date";
        }
    };

    const getAvailableActions = (status) => {
        switch (status) {
            case "confirmed":
                return [{ action: "shipped", label: "Mark as Shipped", color: "secondary" }];
            case "shipped":
                return [{ action: "delivered", label: "Mark as Delivered", color: "success" }];
            case "pending":
            case "delivered":
            case "cancelled":
            case "declined":
            default:
                return [];
        }
    };

    const handleActionClick = (action) => {
        setCurrentAction(action);
        setActionReason('');
        setActionDialogOpen(true);
    };

    // const handleActionConfirm = async () => {
    //     if (!currentAction) return;
        
    //     setIsLoading(true);
    //     try {
    //         const response = await updateOrderStatus(selectedOrder._id, currentAction.action);
    //         if (response.success) {
    //             setSnackbar({
    //                 open: true,
    //                 message: `Order ${currentAction.action} successfully`,
    //                 severity: "success",
    //             });
    //             // Update the local order status
    //             selectedOrder.status = currentAction.action;
    //         } else {
    //             setSnackbar({
    //                 open: true,
    //                 message: response.error || `Failed to update order status`,
    //                 severity: "error",
    //             });
    //         }
    //     } catch (error) {
    //         console.error(`Error updating order status:`, error);
    //         setSnackbar({
    //             open: true,
    //             message: `An error occurred while updating the order status`,
    //             severity: "error",
    //         });
    //     } finally {
    //         setIsLoading(false);
    //         setActionDialogOpen(false);
    //     }
    // };

    const availableActions = getAvailableActions(selectedOrder.status);

    return (
        <Box sx={{ p: {xs: 1, sm: 1.4, lg: 4}, paddingTop: "80px" }}>
            {/* Back button and order status */}
            <Stack 
                direction="row" 
                justifyContent="end" 
                alignItems="center" 
                sx={{ mb: 3 }}
                flexWrap="wrap"
                gap={1}
            >
                {/* <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/supplier/orders')}
                    sx={{ mb: { xs: 1, sm: 0 } }}
                >
                    Back to Orders
                </Button> */}
                <StatusChip status={selectedOrder.status} />
            </Stack>

            {/* Main content */}
            <Grid container spacing={4}>
                {/* Left column - Order details */}
                <Grid item xs={12} md={8}>
                    <Paper 
                        elevation={0} 
                        sx={{ 
                            p: 3, 
                            borderRadius: 2, 
                            border: '1px solid #e9ecef',
                            mb: 3
                        }}
                    >
                        {/* Order header */}
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h5" fontWeight={700} color="#212529">
                                Order #{selectedOrder.order?.orderId || "N/A"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                Placed on {formatDate(selectedOrder.order?.orderDate)}
                            </Typography>
                        </Box>

                        <Divider sx={{ mb: 3 }} />

                        {/* Products section */}
                        <Box sx={{ mb: 4 }}>
                            <SectionHeader 
                                title="Products" 
                                icon={<ShoppingCartIcon sx={{ color: muiTheme.palette.primary.main }} />} 
                            />
                            
                            {selectedOrder.products.map((product, index) => (
                                <ProductCard key={index} product={product} />
                            ))}

                            {/* Order total */}
                            <Box 
                                sx={{ 
                                    mt: 2, 
                                    p: 2, 
                                    bgcolor: alpha(muiTheme.palette.primary.main, 0.05),
                                    borderRadius: 2,
                                    display: 'flex',
                                    justifyContent: 'flex-end'
                                }}
                            >
                                <Typography variant="h6" fontWeight={700} color="primary">
                                    Total: ${selectedOrder.subTotal.toFixed(2)}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Delivery information */}
                        <Box>
                            <SectionHeader 
                                title="Delivery Information" 
                                icon={<LocationOnIcon sx={{ color: muiTheme.palette.primary.main }} />} 
                            />
                            
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Paper 
                                        elevation={0} 
                                        sx={{ 
                                            p: 2.5, 
                                            borderRadius: 2, 
                                            border: '1px solid #e9ecef',
                                            height: '100%'
                                        }}
                                    >
                                        <Typography variant="subtitle2" fontWeight={600} mb={2} color="#495057">
                                            Delivery Address
                                        </Typography>
                                        
                                        <Stack spacing={1}>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <PersonIcon fontSize="small" color="action" />
                                                <Typography variant="body1" fontWeight={500}>
                                                    {selectedOrder.order?.deliveryAddress?.recipientName || "N/A"}
                                                </Typography>
                                            </Stack>
                                            
                                            <Stack direction="row" spacing={1} alignItems="flex-start">
                                                <LocationOnIcon fontSize="small" color="action" sx={{ mt: 0.5 }} />
                                                <Box>
                                                    <Typography variant="body2">
                                                        {selectedOrder.order?.deliveryAddress?.recipientStreet || ""}
                                                        {selectedOrder.order?.deliveryAddress?.recipientStreet2 && 
                                                            `, ${selectedOrder.order.deliveryAddress.recipientStreet2}`}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        {selectedOrder.order?.deliveryAddress?.recipientCity || ""}, {selectedOrder.order?.deliveryAddress?.recipientState || ""} {selectedOrder.order?.deliveryAddress?.recipientZip || ""}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        {selectedOrder.order?.deliveryAddress?.recipientCountry || ""}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                            
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <PhoneIcon fontSize="small" color="action" />
                                                <Typography variant="body2">
                                                    {selectedOrder.order?.deliveryAddress?.recipientPhone || "N/A"}
                                                </Typography>
                                            </Stack>
                                            
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <EmailIcon fontSize="small" color="action" />
                                                <Typography variant="body2">
                                                    {selectedOrder.order?.deliveryAddress?.recipientEmail || "N/A"}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </Paper>
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                    <Paper 
                                        elevation={0} 
                                        sx={{ 
                                            p: 2.5, 
                                            borderRadius: 2, 
                                            border: '1px solid #e9ecef',
                                            height: '100%'
                                        }}
                                    >
                                        <Typography variant="subtitle2" fontWeight={600} mb={2} color="#495057">
                                            Delivery Details
                                        </Typography>
                                        
                                        <Stack spacing={2}>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <CalendarIcon fontSize="small" color="action" />
                                                <Box>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Delivery Date
                                                    </Typography>
                                                    <Typography variant="body1" fontWeight={500}>
                                                        {formatDate(selectedOrder.deliveryDate)}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                            
                                            {selectedOrder.order?.additionalNotes && (
                                                <Stack direction="row" spacing={1} alignItems="flex-start">
                                                    <NotesIcon fontSize="small" color="action" sx={{ mt: 0.5 }} />
                                                    <Box>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Additional Notes
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            {selectedOrder.order.additionalNotes}
                                                        </Typography>
                                                    </Box>
                                                </Stack>
                                            )}
                                        </Stack>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                </Grid>

                {/* Right column - Order timeline and actions */}
                <Grid item xs={12} md={4}>
                    {/* Order actions */}
                    {/* {availableActions.length > 0 && (
                        <Paper 
                            elevation={0} 
                            sx={{ 
                                p: 3, 
                                borderRadius: 2, 
                                border: '1px solid #e9ecef',
                                mb: 3
                            }}
                        >
                            <Typography variant="h6" fontWeight={600} mb={2}>
                                Order Actions
                            </Typography>
                            
                            <Stack spacing={2}>
                                {availableActions.map((action, index) => (
                                    <Button
                                        key={index}
                                        variant="contained"
                                        color={action.color}
                                        fullWidth
                                        onClick={() => handleActionClick(action)}
                                        startIcon={
                                            action.action === "shipped" ? <LocalShippingIcon /> :
                                            action.action === "delivered" ? <DoneIcon /> :
                                            null
                                        }
                                        sx={{ borderRadius: 2 }}
                                    >
                                        {action.label}
                                    </Button>
                                ))}
                            </Stack>
                        </Paper>
                    )} */}

                    {/* Order timeline */}
                    <Paper 
                        elevation={0} 
                        sx={{ 
                            p: 3, 
                            borderRadius: 2, 
                            border: '1px solid #e9ecef'
                        }}
                    >
                        <Typography variant="h6" fontWeight={600} mb={2}>
                            Order Information
                        </Typography>
                        
                        <Stack spacing={2}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <BusinessIcon fontSize="small" color="action" />
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Order ID
                                    </Typography>
                                    <Typography variant="body1" fontWeight={500}>
                                        {selectedOrder.order?.orderId || "N/A"}
                                    </Typography>
                                </Box>
                            </Stack>
                            
                            <Stack direction="row" spacing={1} alignItems="center">
                                <CalendarIcon fontSize="small" color="action" />
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Order Date
                                    </Typography>
                                    <Typography variant="body1" fontWeight={500}>
                                        {formatDate(selectedOrder.order?.orderDate)}
                                    </Typography>
                                </Box>
                            </Stack>
                            
                            <Stack direction="row" spacing={1} alignItems="center">
                                <CalendarIcon fontSize="small" color="action" />
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Last Updated
                                    </Typography>
                                    <Typography variant="body1" fontWeight={500}>
                                        {formatDate(selectedOrder.updatedAt)}
                                    </Typography>
                                </Box>
                            </Stack>
                            
                            {selectedOrder.status === "confirmed" && selectedOrder.usedAt && (
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <CheckCircleIcon fontSize="small" color="success" />
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Confirmed On
                                        </Typography>
                                        <Typography variant="body1" fontWeight={500}>
                                            {formatDate(selectedOrder.usedAt)}
                                        </Typography>
                                    </Box>
                                </Stack>
                            )}
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>

            {/* Action confirmation dialog */}
            <Dialog open={actionDialogOpen} onClose={() => setActionDialogOpen(false)}>
                <DialogTitle>
                    {currentAction?.label || "Update Order Status"}
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Are you sure you want to {currentAction?.label.toLowerCase()}?
                    </Typography>
                    {(currentAction?.action === "cancelled" || currentAction?.action === "declined") && (
                        <TextField
                            label="Reason (optional)"
                            fullWidth
                            multiline
                            rows={3}
                            value={actionReason}
                            onChange={(e) => setActionReason(e.target.value)}
                            sx={{ mt: 2 }}
                        />
                    )}
                </DialogContent>
                {/* <DialogActions>
                    <Button onClick={() => setActionDialogOpen(false)} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleActionConfirm} 
                        variant="contained" 
                        color={currentAction?.color || "primary"}
                        disabled={isLoading}
                    >
                        {isLoading ? "Processing..." : "Confirm"}
                    </Button>
                </DialogActions> */}
            </Dialog>

            {/* Snackbar for notifications */}
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
}

export default OrderDetails
