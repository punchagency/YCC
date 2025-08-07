import React, { useState, useEffect } from 'react';
// import { useUser } from "../../../context/userContext";
// import { useTheme } from "../../../context/theme/themeContext";
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
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    CircularProgress,
} from "@mui/material";
import {
    ArrowBack as ArrowBackIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Done as DoneIcon,
    Pending as PendingIcon,
    RoomService as ServiceIcon,
    LocationOn as LocationOnIcon,
    CalendarToday as CalendarIcon,
    Person as PersonIcon,
    Phone as PhoneIcon,
    // Email as EmailIcon,
    AttachMoney as MoneyIcon,
    Business as BusinessIcon,
    Schedule as ScheduleIcon,
    Payment as PaymentIcon,
} from "@mui/icons-material";
import { format } from 'date-fns';
import { updateStatusOfBooking } from '../../../services/bookings/bookingService';

// Status chip component for consistent styling
const StatusChip = ({ status, type = 'booking' }) => {
    const getStatusConfig = (status, type) => {
        if (type === 'payment') {
            switch (status) {
                case "paid":
                    return { color: "#155724", bg: "#d4edda", icon: <CheckCircleIcon fontSize="small" /> };
                case "pending":
                    return { color: "#856404", bg: "#fff3cd", icon: <PendingIcon fontSize="small" /> };
                case "failed":
                    return { color: "#721c24", bg: "#f8d7da", icon: <CancelIcon fontSize="small" /> };
                default:
                    return { color: "#6c757d", bg: "#f8f9fa", icon: null };
            }
        }
        
        switch (status) {
            case "pending":
                return { color: "#856404", bg: "#fff3cd", icon: <PendingIcon fontSize="small" /> };
            case "confirmed":
                return { color: "#155724", bg: "#d4edda", icon: <CheckCircleIcon fontSize="small" /> };
            case "completed":
                return { color: "#6f42c1", bg: "#e2d9f3", icon: <DoneIcon fontSize="small" /> };
            case "cancelled":
            case "declined":
                return { color: "#721c24", bg: "#f8d7da", icon: <CancelIcon fontSize="small" /> };
            default:
                return { color: "#6c757d", bg: "#f8f9fa", icon: null };
        }
    };

    const config = getStatusConfig(status, type);
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

// Service card component
const ServiceCard = ({ service }) => {
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
                        {service.service?.name || "Unknown Service"}
                    </Typography>
                    {service.service?.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {service.service.description}
                        </Typography>
                    )}
                </Grid>
                <Grid item xs={6} md={3}>
                    <Typography variant="body2" color="#6c757d">
                        Quantity: <strong>{service.quantity}</strong>
                    </Typography>
                    <Typography variant="body2" color="#6c757d">
                        Price: <strong>${service.service?.price?.toFixed(2) || '0.00'}</strong>
                    </Typography>
                </Grid>
                <Grid item xs={6} md={3} textAlign="right">
                    <Typography variant="subtitle1" fontWeight={600} color="primary">
                        ${service.totalPrice?.toFixed(2) || '0.00'}
                    </Typography>
                </Grid>
            </Grid>
        </Paper>
    );
};

const BookingDetails = () => {
    // const { user } = useUser();
    const navigate = useNavigate();
    // const { theme } = useTheme();
    const muiTheme = useMuiTheme();
    const { state } = useLocation();
    const { booking } = state || {};
    const { setPageTitle } = useOutletContext() || {};
    const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });
    const [updateFormData, setUpdateFormData] = React.useState({
        bookingId: booking?.id,
        status: booking?.status,
        reason: "",
        notes: "",
    });
    const [statusDialog, setStatusDialog] = useState({
        open: false,
        action: null,
        title: "",
    });
    const [isUpdating, setIsUpdating] = useState(false);
    const [quoteDialog, setQuoteDialog] = useState({ open: false });
    const [quoteItems, setQuoteItems] = useState(
        booking?.services?.map(service => ({
            serviceId: service.service?._id,
            serviceName: service.service?.name,
            items: [{ item: '', unitPrice: '', quantity: 1 }]
        })) || []
    );
    console.log({ quoteItems });
    console.log({ booking });
    const [requiresQuote, setRequiresQuote] = useState(false);

    useEffect(() => {
        if (setPageTitle) setPageTitle("Booking Details");
    }, [setPageTitle]);


    if (!booking) {
        return (
            <Box sx={{ p: 4, paddingTop: "80px", textAlign: "center" }}>
                <Alert severity="warning" sx={{ mb: 2 }}>
                    No booking details found. Please select a booking from the bookings list.
                </Alert>
                <Button 
                    variant="contained" 
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/service-provider/bookings')}
                >
                    Back to Bookings
                </Button>
            </Box>
        );
    }

    const handleStatusAction = (action) => {
        if (action === 'quote') {
            setQuoteDialog({ open: true });
            return;
        }
        
        const actionTitles = {
            confirmed: "Confirm Booking",
            declined: "Decline Booking",
            completed: "Complete Booking",
            cancelled: "Cancel Booking"
        };
        
        setStatusDialog({
            open: true,
            action,
            title: actionTitles[action] || "Update Status"
        });
        setUpdateFormData(prev => ({ ...prev, status: action, reason: "", notes: "" }));
    };

    const handleUpdateStatus = async () => {
        setIsUpdating(true);
        try {
            const requestData = {
                bookingId: booking.id,
                status: updateFormData.status,
                reason: updateFormData.reason,
                notes: updateFormData.notes
            };

            if (requiresQuote && quoteItems.length > 0) {
                requestData.requiresQuote = true;
                requestData.quoteItems = quoteItems.flatMap(service => 
                    service.items.map(item => ({
                        item: item.item,
                        serviceId: service.serviceId,
                        unitPrice: parseFloat(item.unitPrice),
                        quantity: parseInt(item.quantity)
                    }))
                );
            } else {
                requestData.requiresQuote = false;
            }
            console.log({ requestData });
            const response = await updateStatusOfBooking(requestData);

            if (response.status) {
                setSnackbar({
                    open: true,
                    message: requiresQuote ? "Quote sent successfully" : "Booking status updated successfully",
                    severity: "success",
                });
                setStatusDialog({ open: false, action: null, title: "" });
                setQuoteDialog({ open: false });
                setRequiresQuote(false);
                setQuoteItems(
                    booking?.services?.map(service => ({
                        serviceId: service.service?.id,
                        serviceName: service.service?.name,
                        items: [{ item: '', unitPrice: '', quantity: 1 }]
                    })) || []
                );
                // Update local booking status
                booking.bookingStatus = updateFormData.status;
            } else {
                setSnackbar({
                    open: true,
                    message: response.error || "Failed to update booking status",
                    severity: "error",
                });
            }
        } catch (error) {
            setSnackbar({
                open: true,
                message: "An error occurred while updating booking status",
                severity: "error",
            });
        } finally {
            setIsUpdating(false);
        }
    };

    const getAvailableActions = (status) => {
        switch (status) {
            case "pending":
                return [
                    { action: "quote", label: "Send Quote", color: "info" },
                    { action: "confirmed", label: "Confirm Booking", color: "success" },
                    { action: "declined", label: "Decline Booking", color: "error" }
                ];
            case "confirmed":
                return [
                    { action: "completed", label: "Mark as Completed", color: "primary" },
                    { action: "cancelled", label: "Cancel Booking", color: "error" }
                ];
            default:
                return [];
        }
    };

    const addQuoteItem = (serviceIndex) => {
        const updated = [...quoteItems];
        updated[serviceIndex].items.push({ item: '', unitPrice: '', quantity: 1 });
        setQuoteItems(updated);
    };

    const removeQuoteItem = (serviceIndex, itemIndex) => {
        const updated = [...quoteItems];
        updated[serviceIndex].items = updated[serviceIndex].items.filter((_, i) => i !== itemIndex);
        setQuoteItems(updated);
    };

    const updateQuoteItem = (serviceIndex, itemIndex, field, value) => {
        const updated = [...quoteItems];
        updated[serviceIndex].items[itemIndex][field] = value;
        setQuoteItems(updated);
    };

    const handleSendQuote = async () => {
        setRequiresQuote(true);
        setIsUpdating(true);
        try {
            const requestData = {
                bookingId: booking.id,
                status: 'confirmed',
                reason: 'Quote sent',
                notes: '',
                requiresQuote: true,
                quoteItems: quoteItems.flatMap(service => 
                    service.items.map(item => ({
                        item: item.item,
                        serviceId: service.serviceId,
                        unitPrice: parseFloat(item.unitPrice),
                        quantity: parseInt(item.quantity)
                    }))
                )
            };

            console.log({ requestData });
            const response = await updateStatusOfBooking(requestData);

            if (response.status) {
                setSnackbar({
                    open: true,
                    message: "Quote sent successfully",
                    severity: "success",
                });
                setQuoteDialog({ open: false });
                setRequiresQuote(false);
                setQuoteItems(
                    booking?.services?.map(service => ({
                        serviceId: service.service?.id,
                        serviceName: service.service?.name,
                        items: [{ item: '', unitPrice: '', quantity: 1 }]
                    })) || []
                );
                booking.bookingStatus = 'confirmed';
            } else {
                setSnackbar({
                    open: true,
                    message: response.error || "Failed to send quote",
                    severity: "error",
                });
            }
        } catch (error) {
            setSnackbar({
                open: true,
                message: "An error occurred while sending quote",
                severity: "error",
            });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleConfirmWithoutQuote = async () => {
        setRequiresQuote(false);
        setIsUpdating(true);
        try {
            const requestData = {
                bookingId: booking.id,
                status: 'confirmed',
                reason: 'Confirmed without quote',
                notes: '',
                requiresQuote: false
            };

            const response = await updateStatusOfBooking(requestData);

            if (response.status) {
                setSnackbar({
                    open: true,
                    message: "Booking confirmed successfully",
                    severity: "success",
                });
                setQuoteDialog({ open: false });
                booking.bookingStatus = 'confirmed';
            } else {
                setSnackbar({
                    open: true,
                    message: response.error || "Failed to confirm booking",
                    severity: "error",
                });
            }
        } catch (error) {
            setSnackbar({
                open: true,
                message: "An error occurred while confirming booking",
                severity: "error",
            });
        } finally {
            setIsUpdating(false);
        }
    };

    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'MMM dd, yyyy');
        } catch (error) {
            return "Invalid Date";
        }
    };

    const formatDateTime = (dateString) => {
        try {
            return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
        } catch (error) {
            return "Invalid Date";
        }
    };

    return (
        <Box sx={{ p: {xs: 1, sm: 1.4, lg: 4}, paddingTop: "70px !important" }}>
            {/* Back button and booking status */}
            <Stack 
                direction="row" 
                justifyContent="space-between" 
                alignItems="center" 
                sx={{ mb: 3 }}
                flexWrap="wrap"
                gap={1}
            >
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/service-provider/bookings')}
                    sx={{ mb: { xs: 1, sm: 0 } }}
                >
                    Back to Bookings
                </Button>
                <Stack direction="row" spacing={1}>
                    <StatusChip status={booking.bookingStatus} />
                    <StatusChip status={booking.paymentStatus} type="payment" />
                </Stack>
            </Stack>

            {/* Main content */}
            <Grid container spacing={4}>
                {/* Left column - Booking details */}
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
                        {/* Booking header */}
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h5" fontWeight={700} color="#212529">
                                Booking #{booking.bookingId || "N/A"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                Created on {formatDate(booking.createdAt)}
                            </Typography>
                        </Box>

                        <Divider sx={{ mb: 3 }} />

                        {/* Services section */}
                        <Box sx={{ mb: 4 }}>
                            <SectionHeader 
                                title="Services" 
                                icon={<ServiceIcon sx={{ color: muiTheme.palette.primary.main }} />} 
                            />
                            
                            {booking.services?.map((service, index) => (
                                <ServiceCard key={index} service={service} />
                            ))}

                            {/* Booking total */}
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
                                    Total: ${booking.totalAmount?.toFixed(2) || '0.00'}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Customer and Service information */}
                        <Box>
                            <SectionHeader 
                                title="Customer & Service Information" 
                                icon={<PersonIcon sx={{ color: muiTheme.palette.primary.main }} />} 
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
                                            Customer Details
                                        </Typography>
                                        
                                        <Stack spacing={2}>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Avatar 
                                                    src={booking.crew?.profilePicture}
                                                    sx={{ width: 50, height: 50 }}
                                                >
                                                    {booking.crew?.firstName?.charAt(0) || 'U'}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="body1" fontWeight={500}>
                                                        {`${booking.crew?.firstName || ""} ${booking.crew?.lastName || ""}`}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Customer
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                            
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <PhoneIcon fontSize="small" color="action" />
                                                <Typography variant="body2">
                                                    {booking.crew?.phone || "N/A"}
                                                </Typography>
                                            </Stack>
                                            
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <PhoneIcon fontSize="small" color="action" />
                                                <Box>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Contact Phone
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        {booking.contactPhone || "N/A"}
                                                    </Typography>
                                                </Box>
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
                                            Service Details
                                        </Typography>
                                        
                                        <Stack spacing={2}>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <BusinessIcon fontSize="small" color="action" />
                                                <Box>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Vendor
                                                    </Typography>
                                                    <Typography variant="body1" fontWeight={500}>
                                                        {booking.vendorName || "N/A"}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                            
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <LocationOnIcon fontSize="small" color="action" />
                                                <Box>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Vendor Location
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        {booking.vendorLocation || "N/A"}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                            
                                            <Stack direction="row" spacing={1} alignItems="flex-start">
                                                <LocationOnIcon fontSize="small" color="action" sx={{ mt: 0.5 }} />
                                                <Box>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Service Location
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        {booking.serviceLocation || "N/A"}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                            
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <CalendarIcon fontSize="small" color="action" />
                                                <Box>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Service Date & Time
                                                    </Typography>
                                                    <Typography variant="body1" fontWeight={500}>
                                                        {formatDateTime(booking.dateTime)}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </Stack>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                </Grid>

                {/* Right column - Booking timeline and info */}
                <Grid item xs={12} md={4}>
                    {/* Booking information */}
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
                            Booking Information
                        </Typography>
                        
                        <Stack spacing={2}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <BusinessIcon fontSize="small" color="action" />
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Booking ID
                                    </Typography>
                                    <Typography variant="body1" fontWeight={500}>
                                        {booking.bookingId || "N/A"}
                                    </Typography>
                                </Box>
                            </Stack>
                            
                            <Stack direction="row" spacing={1} alignItems="center">
                                <CalendarIcon fontSize="small" color="action" />
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Created Date
                                    </Typography>
                                    <Typography variant="body1" fontWeight={500}>
                                        {formatDate(booking.createdAt)}
                                    </Typography>
                                </Box>
                            </Stack>
                            
                            <Stack direction="row" spacing={1} alignItems="center">
                                <ScheduleIcon fontSize="small" color="action" />
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Last Updated
                                    </Typography>
                                    <Typography variant="body1" fontWeight={500}>
                                        {formatDate(booking.updatedAt)}
                                    </Typography>
                                </Box>
                            </Stack>
                            
                            <Stack direction="row" spacing={1} alignItems="center">
                                <PaymentIcon fontSize="small" color="action" />
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Payment Status
                                    </Typography>
                                    <StatusChip status={booking.paymentStatus} type="payment" />
                                </Box>
                            </Stack>
                        </Stack>
                    </Paper>

                    {/* Payment information */}
                    <Paper 
                        elevation={0} 
                        sx={{ 
                            p: 3, 
                            borderRadius: 2, 
                            border: '1px solid #e9ecef'
                        }}
                    >
                        <Typography variant="h6" fontWeight={600} mb={2}>
                            Payment Summary
                        </Typography>
                        
                        <Stack spacing={2}>
                            {booking.services?.map((service, index) => (
                                <Stack key={index} direction="row" justifyContent="space-between">
                                    <Typography variant="body2">
                                        {service.quantity}x {service.service?.name}
                                    </Typography>
                                    <Typography variant="body2" fontWeight={500}>
                                        ${service.totalPrice?.toFixed(2) || '0.00'}
                                    </Typography>
                                </Stack>
                            ))}
                            
                            <Divider />
                            
                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="subtitle1" fontWeight={600}>
                                    Total Amount
                                </Typography>
                                <Typography variant="subtitle1" fontWeight={700} color="primary">
                                    ${booking.totalAmount?.toFixed(2) || '0.00'}
                                </Typography>
                            </Stack>
                        </Stack>
                    </Paper>

                    {/* Status Update Actions */}
                    {getAvailableActions(booking.bookingStatus).length > 0 && (
                        <Paper 
                            elevation={0} 
                            sx={{ 
                                p: 3, 
                                borderRadius: 2, 
                                border: '1px solid #e9ecef',
                                mt: 3
                            }}
                        >
                            <Typography variant="h6" fontWeight={600} mb={2}>
                                Booking Actions
                            </Typography>
                            
                            <Stack direction={isMobile ? "column" : "column"} spacing={2}>
                                {getAvailableActions(booking.bookingStatus).map((actionItem, index) => (
                                    <Button
                                        key={index}
                                        variant="contained"
                                        color={actionItem.color}
                                        onClick={() => handleStatusAction(actionItem.action)}
                                        sx={{ 
                                            borderRadius: 2,
                                            minWidth: 140
                                        }}
                                        startIcon={
                                            actionItem.action === "quote" ? <MoneyIcon /> :
                                            actionItem.action === "confirmed" ? <CheckCircleIcon /> :
                                            actionItem.action === "declined" ? <CancelIcon /> :
                                            actionItem.action === "completed" ? <DoneIcon /> :
                                            actionItem.action === "cancelled" ? <CancelIcon /> :
                                            null
                                        }
                                    >
                                        {actionItem.label}
                                    </Button>
                                ))}
                            </Stack>
                        </Paper>
                    )}
                </Grid>
            </Grid>

            {/* Status Update Dialog */}
            <Dialog 
                open={statusDialog.open} 
                onClose={() => setStatusDialog({ open: false, action: null, title: "" })}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                        overflow: 'hidden'
                    }
                }}
            >
                <DialogTitle sx={{ 
                    pb: 1,
                    pt: 2.5,
                    px: 3,
                    fontWeight: 600,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.03),
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}>
                    {statusDialog.action === "confirmed" && <CheckCircleIcon color="success" />}
                    {statusDialog.action === "declined" && <CancelIcon color="error" />}
                    {statusDialog.action === "completed" && <DoneIcon color="primary" />}
                    {statusDialog.action === "cancelled" && <CancelIcon color="error" />}
                    {statusDialog.title}
                </DialogTitle>
                <DialogContent sx={{ p: 3, pt: 3 }}>
                    <Typography variant="body1" sx={{ mb: 3, fontWeight: 500 }}>
                        Are you sure you want to {statusDialog.action === "declined" || statusDialog.action === "cancelled" 
                            ? <span style={{ color: '#d32f2f' }}>{statusDialog.action}</span> 
                            : <span style={{ color: '#1976d2' }}>{statusDialog.action}</span>} this booking?
                    </Typography>
                    
                    <TextField
                        label="Reason"
                        fullWidth
                        multiline
                        rows={3}
                        value={updateFormData.reason}
                        onChange={(e) => setUpdateFormData(prev => ({ ...prev, reason: e.target.value }))}
                        sx={{ 
                            mb: 2.5,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 1.5,
                                '&:hover fieldset': {
                                    borderColor: 'primary.light',
                                },
                                '&.Mui-focused fieldset': {
                                    borderWidth: '1px',
                                }
                            }
                        }}
                        placeholder="Please provide a reason for this action..."
                        required
                        InputLabelProps={{
                            shrink: true,
                            sx: { fontWeight: 500 }
                        }}
                    />
                    
                    <TextField
                        label="Additional Notes (Optional)"
                        fullWidth
                        multiline
                        rows={2}
                        value={updateFormData.notes}
                        onChange={(e) => setUpdateFormData(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Any additional notes or comments..."
                        sx={{ 
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 1.5,
                                '&:hover fieldset': {
                                    borderColor: 'primary.light',
                                },
                                '&.Mui-focused fieldset': {
                                    borderWidth: '1px',
                                }
                            }
                        }}
                        InputLabelProps={{
                            shrink: true,
                            sx: { fontWeight: 500 }
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Button 
                        onClick={() => setStatusDialog({ open: false, action: null, title: "" })}
                        disabled={isUpdating}
                        sx={{ 
                            borderRadius: 1.5,
                            px: 2,
                            fontWeight: 500,
                            textTransform: 'none'
                        }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleUpdateStatus}
                        variant="contained"
                        color={statusDialog.action === "declined" || statusDialog.action === "cancelled" ? "error" : "primary"}
                        disabled={isUpdating || !updateFormData.reason.trim()}
                        startIcon={isUpdating ? <CircularProgress size={20} /> : null}
                        sx={{ 
                            borderRadius: 1.5,
                            px: 2.5,
                            fontWeight: 500,
                            textTransform: 'none',
                            boxShadow: (theme) => `0 2px 8px ${alpha(
                                statusDialog.action === "declined" || statusDialog.action === "cancelled" 
                                    ? theme.palette.error.main 
                                    : theme.palette.primary.main, 
                                0.25
                            )}`
                        }}
                    >
                        {isUpdating ? "Updating..." : "Confirm"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Quote Dialog */}
            <Dialog 
                open={quoteDialog.open} 
                onClose={() => setQuoteDialog({ open: false })}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                        overflow: 'hidden'
                    }
                }}
            >
                <DialogTitle sx={{ 
                    pb: 1.5,
                    pt: 2.5,
                    px: 3,
                    fontWeight: 600,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.03),
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5
                }}>
                    <MoneyIcon color="primary" />
                    Send Quote for Booking #{booking.bookingId}
                </DialogTitle>
                <DialogContent sx={{ p: 3, pt: 3 }}>
                    <Box sx={{ 
                        p: 2, 
                        mb: 3, 
                        bgcolor: (theme) => alpha(theme.palette.info.main, 0.08),
                        borderRadius: 1.5,
                        border: '1px solid',
                        borderColor: 'info.light'
                    }}>
                        <Typography variant="body2" sx={{ color: 'info.dark', fontWeight: 500 }}>
                            Add quote items for this booking or confirm without quote. All fields marked with * are required.
                        </Typography>
                    </Box>
                    
                    {quoteItems.map((service, serviceIndex) => (
                        <Box key={serviceIndex} sx={{ mb: 4, pb: 3, borderBottom: serviceIndex < quoteItems.length - 1 ? '1px dashed' : 'none', borderColor: 'divider' }}>
                            <Typography variant="h6" sx={{ 
                                mb: 2.5, 
                                color: 'primary.main', 
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}>
                                <ServiceIcon fontSize="small" />
                                {service.serviceName}
                            </Typography>
                            {service.items.map((item, itemIndex) => (
                                <Paper 
                                    key={itemIndex} 
                                    elevation={0}
                                    sx={{ 
                                        p: 2.5, 
                                        mb: 2, 
                                        borderRadius: 2,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            borderColor: 'primary.light',
                                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                                        }
                                    }}
                                >
                                    <Grid container spacing={2.5} alignItems="center">
                                        <Grid item xs={12} sm={4}>
                                            <TextField
                                                label="Item/Service *"
                                                fullWidth
                                                value={item.item}
                                                onChange={(e) => updateQuoteItem(serviceIndex, itemIndex, 'item', e.target.value)}
                                                placeholder="e.g., Labor, Materials"
                                                required
                                                sx={{ 
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 1.5,
                                                        '&:hover fieldset': {
                                                            borderColor: 'primary.light',
                                                        },
                                                        '&.Mui-focused fieldset': {
                                                            borderWidth: '1px',
                                                        }
                                                    }
                                                }}
                                                InputLabelProps={{
                                                    shrink: true,
                                                    sx: { fontWeight: 500 }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={6} sm={3}>
                                            <TextField
                                                label="Unit Price *"
                                                type="number"
                                                fullWidth
                                                value={item.unitPrice}
                                                onChange={(e) => updateQuoteItem(serviceIndex, itemIndex, 'unitPrice', e.target.value)}
                                                placeholder="0.00"
                                                required
                                                InputProps={{
                                                    startAdornment: <Typography sx={{ mr: 0.5, color: 'text.secondary' }}>$</Typography>
                                                }}
                                                sx={{ 
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 1.5,
                                                        '&:hover fieldset': {
                                                            borderColor: 'primary.light',
                                                        },
                                                        '&.Mui-focused fieldset': {
                                                            borderWidth: '1px',
                                                        }
                                                    }
                                                }}
                                                InputLabelProps={{
                                                    shrink: true,
                                                    sx: { fontWeight: 500 }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={6} sm={3}>
                                            <TextField
                                                label="Quantity *"
                                                type="number"
                                                fullWidth
                                                value={item.quantity}
                                                onChange={(e) => updateQuoteItem(serviceIndex, itemIndex, 'quantity', e.target.value)}
                                                inputProps={{ min: 1 }}
                                                required
                                                sx={{ 
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 1.5,
                                                        '&:hover fieldset': {
                                                            borderColor: 'primary.light',
                                                        },
                                                        '&.Mui-focused fieldset': {
                                                            borderWidth: '1px',
                                                        }
                                                    }
                                                }}
                                                InputLabelProps={{
                                                    shrink: true,
                                                    sx: { fontWeight: 500 }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={2}>
                                            <Button
                                                color="error"
                                                variant="outlined"
                                                onClick={() => removeQuoteItem(serviceIndex, itemIndex)}
                                                disabled={service.items.length === 1}
                                                sx={{ 
                                                    minWidth: 'auto', 
                                                    p: 1,
                                                    borderRadius: 1.5,
                                                    textTransform: 'none',
                                                    fontWeight: 500
                                                }}
                                                size="small"
                                            >
                                                Remove
                                            </Button>
                                        </Grid>
                                        {item.item && item.unitPrice && item.quantity && (
                                            <Grid item xs={12}>
                                                <Box sx={{ 
                                                    display: 'flex', 
                                                    justifyContent: 'flex-end', 
                                                    mt: 1,
                                                    p: 1.5,
                                                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
                                                    borderRadius: 1
                                                }}>
                                                    <Typography variant="body2" fontWeight={600} color="primary.dark">
                                                        Item Total: ${(parseFloat(item.unitPrice || 0) * parseInt(item.quantity || 0)).toFixed(2)}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        )}
                                    </Grid>
                                </Paper>
                            ))}
                            <Button
                                variant="outlined"
                                onClick={() => addQuoteItem(serviceIndex)}
                                sx={{ 
                                    mb: 2,
                                    borderRadius: 1.5,
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    px: 2
                                }}
                                startIcon={<span>+</span>}
                            >
                                Add Item to {service.serviceName}
                            </Button>
                        </Box>
                    ))}
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Button 
                        onClick={() => setQuoteDialog({ open: false })}
                        disabled={isUpdating}
                        sx={{ 
                            borderRadius: 1.5,
                            px: 2,
                            fontWeight: 500,
                            textTransform: 'none'
                        }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleConfirmWithoutQuote}
                        variant="outlined"
                        disabled={isUpdating}
                        sx={{ 
                            borderRadius: 1.5,
                            px: 2,
                            fontWeight: 500,
                            textTransform: 'none'
                        }}
                    >
                        Confirm Without Quote
                    </Button>
                    <Button 
                        onClick={handleSendQuote}
                        variant="contained"
                        disabled={isUpdating || quoteItems.some(service => service.items.some(item => !item.item || !item.unitPrice))}
                        startIcon={isUpdating ? <CircularProgress size={20} /> : <MoneyIcon />}
                        sx={{ 
                            borderRadius: 1.5,
                            px: 2.5,
                            fontWeight: 500,
                            textTransform: 'none',
                            boxShadow: (theme) => `0 2px 8px ${alpha(theme.palette.primary.main, 0.25)}`
                        }}
                    >
                        {isUpdating ? "Sending..." : "Send Quote & Confirm"}
                    </Button>
                </DialogActions>
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
};

export default BookingDetails;
