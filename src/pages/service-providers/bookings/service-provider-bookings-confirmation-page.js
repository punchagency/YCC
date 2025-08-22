import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Divider,
    Alert,
    Grid,
    Chip,
    Container,
    Paper,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Stack,
    Avatar,
} from "@mui/material";
import {
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Pending as PendingIcon,
    RoomService as ServiceIcon,
    Person as PersonIcon,
    Business as BusinessIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useParams } from "react-router-dom";
import { format } from 'date-fns';

const PRIMARY = "#1976d2";
const COMPANY = "Yacht Crew Center";

const HeaderSection = styled(Box)(({ theme }) => ({
    background: "#f8f9fa",
    borderBottom: "1px solid #e9ecef",
    padding: theme.spacing(3, 0),
    marginBottom: theme.spacing(4),
}));

const MainCard = styled(Card)(({ theme }) => ({
    borderRadius: 8,
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12)",
    border: "1px solid #e9ecef",
}));

const ServiceCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2.5),
    borderRadius: 6,
    border: "1px solid #e9ecef",
    background: "#ffffff",
}));

const ActionButton = styled(Button)(({ theme }) => ({
    borderRadius: 6,
    padding: theme.spacing(1.25, 3),
    fontSize: "0.875rem",
    fontWeight: 600,
    textTransform: "none",
    transition: "all 0.2s ease",
}));

// Status chip component
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
                return { color: "#856404", bg: "#fff3cd", label: "Pending" };
            case "confirmed":
                return { color: "#155724", bg: "#d4edda", label: "Confirmed" };
            case "declined":
                return { color: "#721c24", bg: "#f8d7da", label: "Declined" };
            default:
                return { color: "#6c757d", bg: "#f8f9fa", label: status };
        }
    };

    const config = getStatusConfig(status, type);
    return (
        <Chip
            label={config.label || status.charAt(0).toUpperCase() + status.slice(1)}
            size="small"
            sx={{
                backgroundColor: config.bg,
                color: config.color,
                fontWeight: 600,
                fontSize: "0.75rem",
                borderRadius: 4,
            }}
        />
    );
};

const InfoSection = ({ title, icon, children }) => (
    <Box sx={{ mb: 4 }}>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
            {icon}
            <Typography variant="h6" fontWeight={600} color="#495057">
                {title}
            </Typography>
        </Box>
        {children}
    </Box>
);

const ServiceProviderBookingsConfirmationPage = () => {
    const [action, setAction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [bookingData, setBookingData] = useState(null);
    const [statusDialog, setStatusDialog] = useState({ open: false, action: null, title: "" });
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateFormData, setUpdateFormData] = useState({
        status: '',
        notes: '',
        reason: ''
    });

    const { token } = useParams();

    const fetchBookings = async () => {
        try {
            setLoading(true);
            setError(null);
            const queryParams = new URLSearchParams();
            queryParams.append("token", token);
            const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:7000/api";
            const cleanBaseUrl = baseUrl.endsWith("/api")
                ? baseUrl.slice(0, -4)
                : baseUrl;
            const apiUrl = `${cleanBaseUrl}/api/bookings/confirm?${queryParams.toString()}`;
            
            const response = await fetch(apiUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error(
                    `Expected JSON response but got ${contentType}. Please check if the API server is running.`
                );
            }

            const data = await response.json();
            if (!response.ok) {
                throw new Error(
                    data.message ||
                    `HTTP ${response.status}: Failed to fetch booking details`
                );
            }

            if (!data.status) {
                throw new Error(data.message || "Failed to fetch booking details");
            }

            setBookingData(data.data);
        } catch (error) {
            console.error("Error fetching booking details:", error);
            setError(error.message || "Failed to load booking details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchBookings();
        } else {
            setError("No token provided");
            setLoading(false);
        }
    }, [token]);

    const handleStatusAction = (actionType) => {
        const actionTitles = {
            confirmed: "Confirm Booking",
            declined: "Decline Booking"
        };
        
        setStatusDialog({
            open: true,
            action: actionType,
            title: actionTitles[actionType] || "Update Status"
        });
        setUpdateFormData({ status: actionType, reason: "", notes: "" });
    };

    const handleUpdateStatus = async () => {
        setIsUpdating(true);
        try {
            const queryParams = new URLSearchParams();
            queryParams.append("token", token);
            const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:7000/api";
            const cleanBaseUrl = baseUrl.endsWith("/api")
                ? baseUrl.slice(0, -4)
                : baseUrl;
            const apiUrl = `${cleanBaseUrl}/api/bookings/confirm?${queryParams.toString()}`;
            
            const response = await fetch(apiUrl, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    status: updateFormData.status, 
                    notes: updateFormData.notes, 
                    reason: updateFormData.reason 
                }),
            });
            
            const data = await response.json();
            if (!response.ok || !data.status) {
                throw new Error(data.message || "Failed to update status");
            }
            
            setAction(updateFormData.status);
            setStatusDialog({ open: false, action: null, title: "" });
        } catch (error) {
            console.error("Error updating status:", error);
            setError(error.message || "Failed to update status");
        } finally {
            setIsUpdating(false);
        }
    };

    const formatDateTime = (dateString) => {
        try {
            return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
        } catch (error) {
            return "Invalid Date";
        }
    };

    if (loading) {
        return (
            <Box
                minHeight="100vh"
                sx={{
                    background: "#ffffff",
                    py: 5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Container maxWidth="lg">
                    <Box textAlign="center">
                        <CircularProgress size={60} sx={{ color: PRIMARY, mb: 2 }} />
                        <Typography variant="h6" color="#495057">
                            Loading booking details...
                        </Typography>
                    </Box>
                </Container>
            </Box>
        );
    }

    if (error) {
        return (
            <Box minHeight="100vh" sx={{ background: "#ffffff", py: 5 }}>
                <Container maxWidth="lg">
                    <MainCard>
                        <CardContent sx={{ p: 4, textAlign: "center" }}>
                            <Alert
                                severity="error"
                                sx={{
                                    fontSize: "1rem",
                                    fontWeight: 500,
                                    background: "#f8d7da",
                                    color: "#721c24",
                                    borderRadius: 6,
                                }}
                            >
                                {error}
                            </Alert>
                            <Typography variant="body2" color="#6c757d" mt={2}>
                                Please check the confirmation link and try again.
                            </Typography>
                        </CardContent>
                    </MainCard>
                </Container>
            </Box>
        );
    }

    if (!bookingData) {
        return (
            <Box minHeight="100vh" sx={{ background: "#ffffff", py: 5 }}>
                <Container maxWidth="lg">
                    <MainCard>
                        <CardContent sx={{ p: 4, textAlign: "center" }}>
                            <Alert
                                severity="warning"
                                sx={{
                                    fontSize: "1rem",
                                    fontWeight: 500,
                                    background: "#fff3cd",
                                    color: "#856404",
                                    borderRadius: 6,
                                }}
                            >
                                No booking data found
                            </Alert>
                        </CardContent>
                    </MainCard>
                </Container>
            </Box>
        );
    }

    const { booking, crew, vendor } = bookingData;

    return (
        <Box minHeight="100vh" sx={{ background: "#ffffff", py: 5 }}>
            <Container maxWidth="lg">
                {/* Header */}
                <HeaderSection sx={{ background: "#0387D9", borderRadius: "12px" }}>
                    <Container maxWidth="lg">
                        <Typography variant="h4" fontWeight={600} color="white" mb={1}>
                            {COMPANY}
                        </Typography>
                        <Typography variant="body1" color="white">
                            Service Booking Confirmation
                        </Typography>
                    </Container>
                </HeaderSection>

                {/* Main Content */}
                <Grid container spacing={4}>
                    {/* Left Column - Booking Details */}
                    <Grid item xs={12} lg={8}>
                        <MainCard>
                            <CardContent sx={{ p: 4 }}>
                                {/* Booking Header */}
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                                    <Box>
                                        <Typography variant="h5" fontWeight={600} color="#212529">
                                            Booking #{booking.bookingId}
                                        </Typography>
                                        <Typography variant="body2" color="#6c757d" mt={0.5}>
                                            Please review and confirm this booking
                                        </Typography>
                                    </Box>
                                    <Stack spacing={1}>
                                        <StatusChip status={booking.bookingStatus} />
                                        <StatusChip status={booking.paymentStatus} type="payment" />
                                    </Stack>
                                </Box>

                                <Divider sx={{ mb: 4 }} />

                                {/* Services Section */}
                                <InfoSection
                                    title="Services"
                                    icon={<ServiceIcon sx={{ color: "#0387D9", fontSize: 20 }} />}
                                >
                                    <Grid container spacing={2}>
                                        {booking.services?.map((service, index) => (
                                            <Grid item xs={12} key={index}>
                                                <ServiceCard>
                                                    <Grid container spacing={2} alignItems="center">
                                                        <Grid item xs={12} md={6}>
                                                            <Typography variant="subtitle1" fontWeight={600} color="#212529" mb={1}>
                                                                {service.name || "Unknown Service"}
                                                            </Typography>
                                                            {service.description && (
                                                                <Typography variant="body2" color="#6c757d" mb={1}>
                                                                    {service.description}
                                                                </Typography>
                                                            )}
                                                        </Grid>
                                                        <Grid item xs={12} md={3}>
                                                            <Typography variant="body2" color="#6c757d">
                                                                Quantity: <strong>{service.quantity}</strong>
                                                            </Typography>
                                                            <Typography variant="body2" color="#6c757d">
                                                                Price: <strong>${service.price?.toFixed(2) || '0.00'}</strong>
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={12} md={3} textAlign="right">
                                                            <Typography variant="subtitle1" fontWeight={600} color="#0387D9">
                                                                ${service.subtotal?.toFixed(2) || '0.00'}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </ServiceCard>
                                            </Grid>
                                        ))}
                                    </Grid>

                                    {/* Total */}
                                    <Box sx={{ mt: 3, p: 3, background: "#f8f9fa", borderRadius: 6, border: "1px solid #e9ecef" }}>
                                        <Typography variant="h6" fontWeight={600} textAlign="right" color="#0387D9">
                                            Total: ${booking.totalAmount?.toFixed(2) || '0.00'}
                                        </Typography>
                                    </Box>
                                </InfoSection>

                                {/* Customer & Service Information */}
                                <InfoSection
                                    title="Customer & Service Information"
                                    icon={<PersonIcon sx={{ color: "#0387D9", fontSize: 20 }} />}
                                >
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="subtitle2" fontWeight={600} mb={2} color="#495057">
                                                Customer Details
                                            </Typography>
                                            <Box sx={{ p: 2.5, background: "#f8f9fa", borderRadius: 6, border: "1px solid #e9ecef" }}>
                                                <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                                                    <Avatar sx={{ width: 50, height: 50 }}>
                                                        {crew?.firstName?.charAt(0) || 'C'}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="body1" fontWeight={600} color="#212529">
                                                            {`${crew?.firstName || ""} ${crew?.lastName || ""}`}
                                                        </Typography>
                                                        <Typography variant="body2" color="#6c757d">
                                                            Customer
                                                        </Typography>
                                                    </Box>
                                                </Stack>
                                                <Typography variant="body2" color="#6c757d" mb={0.5}>
                                                    Email: {crew?.email || "N/A"}
                                                </Typography>
                                                <Typography variant="body2" color="#6c757d" mb={0.5}>
                                                    Phone: {crew?.phone || "N/A"}
                                                </Typography>
                                                <Typography variant="body2" color="#6c757d">
                                                    Contact: {booking.contactPhone || "N/A"}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="subtitle2" fontWeight={600} mb={2} color="#495057">
                                                Service Details
                                            </Typography>
                                            <Box sx={{ p: 2.5, background: "#f8f9fa", borderRadius: 6, border: "1px solid #e9ecef" }}>
                                                <Typography variant="body2" mb={1} color="#6c757d">
                                                    <strong>Service Date:</strong> {formatDateTime(booking.dateTime)}
                                                </Typography>
                                                <Typography variant="body2" mb={1} color="#6c757d">
                                                    <strong>Location:</strong> {booking.serviceLocation || "N/A"}
                                                </Typography>
                                                <Typography variant="body2" color="#6c757d">
                                                    <strong>Booking Type:</strong> {bookingData.bookingType || "N/A"}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </InfoSection>
                            </CardContent>
                        </MainCard>
                    </Grid>

                    {/* Right Column - Actions & Info */}
                    <Grid item xs={12} lg={4}>
                        <Box sx={{ position: "sticky", top: 24 }}>
                            {/* Vendor Info */}
                            <MainCard sx={{ mb: 3 }}>
                                <CardContent sx={{ p: 3 }}>
                                    <InfoSection
                                        title="Vendor Information"
                                        icon={<BusinessIcon sx={{ color: "#0387D9", fontSize: 20 }} />}
                                    >
                                        <Box sx={{ p: 2.5, background: "#f8f9fa", borderRadius: 6, border: "1px solid #e9ecef" }}>
                                            <Typography variant="subtitle1" fontWeight={600} mb={1} color="#212529">
                                                {vendor?.businessName || "Vendor Name Not Available"}
                                            </Typography>
                                            <Typography variant="body2" mb={0.5} color="#6c757d">
                                                Contact: {vendor?.contactPerson?.fullName || "N/A"} <span>{vendor?.contactPerson?.role}</span>
                                            </Typography>
                                            <Typography variant="body2" mb={0.5} color="#6c757d">
                                                Address: {(() => {
                                                    const address = vendor?.address;
                                                    if (address && typeof address === "object") {
                                                        const parts = [];
                                                        if (address.street) parts.push(address.street);
                                                        if (address.city) parts.push(address.city);
                                                        if (address.state) parts.push(address.state);
                                                        if (address.zip) parts.push(address.zip);
                                                        return parts.length > 0 ? parts.join(", ") : "Address not provided";
                                                    }
                                                    return "Address not provided";
                                                })()}
                                            </Typography>
                                            <Typography variant="body2" color="#6c757d">
                                                Phone: {vendor?.phone || "N/A"}
                                            </Typography>
                                        </Box>
                                    </InfoSection>
                                </CardContent>
                            </MainCard>

                            {/* Action Buttons */}
                            {!action && booking.bookingStatus === 'pending' && (
                                <MainCard>
                                    <CardContent sx={{ p: 3 }}>
                                        <Typography variant="subtitle1" fontWeight={600} mb={3} textAlign="center" color="#495057">
                                            Confirm or Decline Booking
                                        </Typography>
                                        <Box display="flex" flexDirection="column" gap={2}>
                                            <ActionButton
                                                variant="contained"
                                                fullWidth
                                                size="large"
                                                startIcon={<CheckCircleIcon />}
                                                onClick={() => handleStatusAction('confirmed')}
                                                sx={{ background: PRIMARY, "&:hover": { background: "#1565c0" } }}
                                            >
                                                Confirm Booking
                                            </ActionButton>
                                            <ActionButton
                                                variant="outlined"
                                                fullWidth
                                                size="large"
                                                startIcon={<CancelIcon />}
                                                onClick={() => handleStatusAction('declined')}
                                                sx={{
                                                    borderColor: "#dc3545",
                                                    color: "#dc3545",
                                                    "&:hover": { borderColor: "#c82333", backgroundColor: "#f8f9fa" },
                                                }}
                                            >
                                                Decline Booking
                                            </ActionButton>
                                        </Box>
                                    </CardContent>
                                </MainCard>
                            )}

                            {/* Result Feedback */}
                            {action && (
                                <MainCard>
                                    <CardContent sx={{ p: 3, textAlign: "center" }}>
                                        {action === "confirmed" ? (
                                            <Alert
                                                icon={<CheckCircleIcon fontSize="inherit" />}
                                                severity="success"
                                                sx={{
                                                    fontSize: "0.875rem",
                                                    fontWeight: 500,
                                                    background: "#d4edda",
                                                    color: "#155724",
                                                    borderRadius: 6,
                                                }}
                                            >
                                                Booking Confirmed Successfully
                                            </Alert>
                                        ) : (
                                            <Alert
                                                icon={<CancelIcon fontSize="inherit" />}
                                                severity="error"
                                                sx={{
                                                    fontSize: "0.875rem",
                                                    fontWeight: 500,
                                                    background: "#f8d7da",
                                                    color: "#721c24",
                                                    borderRadius: 6,
                                                }}
                                            >
                                                Booking Declined
                                            </Alert>
                                        )}
                                        <Typography variant="body2" color="#6c757d" mt={2}>
                                            Thank you for your response.
                                        </Typography>
                                    </CardContent>
                                </MainCard>
                            )}
                        </Box>
                    </Grid>
                </Grid>

                {/* Status Update Dialog */}
                <Dialog
                    open={statusDialog.open}
                    onClose={() => setStatusDialog({ open: false, action: null, title: "" })}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle sx={{ fontWeight: 700, color: statusDialog.action === 'declined' ? "#dc3545" : PRIMARY }}>
                        {statusDialog.title}
                    </DialogTitle>
                    <DialogContent>
                        <Typography mb={2} color="#495057">
                            Are you sure you want to {statusDialog.action} this booking?
                            {statusDialog.action === 'declined' && <><br /><b>This action cannot be reversed.</b></>}
                        </Typography>
                        <TextField
                            label="Reason"
                            fullWidth
                            multiline
                            rows={3}
                            value={updateFormData.reason}
                            onChange={(e) => setUpdateFormData(prev => ({ ...prev, reason: e.target.value }))}
                            sx={{ mb: 2 }}
                            placeholder="Please provide a reason for this action..."
                        />
                        <TextField
                            label="Additional Notes (Optional)"
                            fullWidth
                            multiline
                            rows={2}
                            value={updateFormData.notes}
                            onChange={(e) => setUpdateFormData(prev => ({ ...prev, notes: e.target.value }))}
                            placeholder="Any additional notes or comments..."
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => setStatusDialog({ open: false, action: null, title: "" })}
                            disabled={isUpdating}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpdateStatus}
                            variant="contained"
                            color={statusDialog.action === 'declined' ? "error" : "primary"}
                            disabled={isUpdating || !updateFormData.reason.trim()}
                            startIcon={isUpdating ? <CircularProgress size={20} /> : 
                                statusDialog.action === 'confirmed' ? <CheckCircleIcon /> : <CancelIcon />}
                        >
                            {isUpdating ? "Updating..." : `Yes, ${statusDialog.action === 'confirmed' ? 'Confirm' : 'Decline'} Booking`}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

export default ServiceProviderBookingsConfirmationPage;
