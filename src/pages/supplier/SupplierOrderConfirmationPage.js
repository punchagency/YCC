import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { styled } from "@mui/material/styles";
import { useParams } from "react-router-dom";

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

const ProductCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  borderRadius: 6,
  border: "1px solid #e9ecef",
  background: "#ffffff",
}));

const ActionButton = styled(Button)(({ theme, variant }) => ({
  borderRadius: 6,
  padding: theme.spacing(1.25, 3),
  fontSize: "0.875rem",
  fontWeight: 600,
  textTransform: "none",
  transition: "all 0.2s ease",
  "&:hover": {
    transform: "none",
  },
}));

const StatusChip = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case "pending":
        return { color: "#856404", bg: "#fff3cd", label: "Pending" };
      case "confirmed":
        return { color: "#155724", bg: "#d4edda", label: "Confirmed" };
      case "declined":
        return { color: "#721c24", bg: "#f8d7da", label: "Declined" };
      case "shipped":
        return { color: "#0c5460", bg: "#d1ecf1", label: "Shipped" };
      case "delivered":
        return { color: "#6f42c1", bg: "#e2d9f3", label: "Delivered" };
      default:
        return { color: "#6c757d", bg: "#f8f9fa", label: status };
    }
  };

  const config = getStatusConfig(status);
  return (
    <Chip
      label={config.label}
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

const SupplierOrderConfirmationPage = () => {
  const [action, setAction] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [declineModalOpen, setDeclineModalOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [declineLoading, setDeclineLoading] = useState(false);
  const [declineError, setDeclineError] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmError, setConfirmError] = useState(null);

  const { subOrderId, token } = useParams();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const baseUrl =
          process.env.REACT_APP_API_URL || "http://localhost:7000/api";
        // Ensure baseUrl doesn't end with /api to avoid double /api/
        const cleanBaseUrl = baseUrl.endsWith("/api")
          ? baseUrl.slice(0, -4)
          : baseUrl;
        const apiUrl = `${cleanBaseUrl}/api/suborders/${subOrderId}/${token}/details`;
        console.log("Fetching from:", apiUrl);

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("Response status:", response.status);
        console.log("Response headers:", response.headers);

        // Check if response is JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error(
            `Expected JSON response but got ${contentType}. Please check if the API server is running.`
          );
        }

        const data = await response.json();
        console.log("Response data:", data);

        if (!response.ok) {
          throw new Error(
            data.message ||
              `HTTP ${response.status}: Failed to fetch order details`
          );
        }

        if (!data.status) {
          throw new Error(data.message || "Failed to fetch order details");
        }

        setOrderData(data.data);
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError(err.message || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    if (subOrderId && token) {
      fetchOrderDetails();
    } else {
      setError("Missing sub-order ID or token");
      setLoading(false);
    }
  }, [subOrderId, token]);

  const handleAction = (type) => {
    setAction(type);
    setTimeout(() => setShowResult(true), 300);
  };

  // Decline modal handlers
  const openDeclineModal = () => {
    setDeclineModalOpen(true);
    setDeclineReason("");
    setDeclineError(null);
  };
  const closeDeclineModal = () => {
    setDeclineModalOpen(false);
    setDeclineReason("");
    setDeclineError(null);
  };

  const handleDeclineConfirm = async () => {
    setDeclineLoading(true);
    setDeclineError(null);
    try {
      const baseUrl =
        process.env.REACT_APP_API_URL || "http://localhost:7000/api";
      const apiUrl = `${baseUrl}/suborders/${subOrderId}/${token}/confirm`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "decline", declineReason }),
      });
      const data = await response.json();
      if (!response.ok || !data.status) {
        throw new Error(data.message || "Failed to decline order");
      }
      setDeclineModalOpen(false);
      setAction("decline");
      setTimeout(() => setShowResult(true), 300);
    } catch (err) {
      setDeclineError(err.message || "Failed to decline order");
    } finally {
      setDeclineLoading(false);
    }
  };

  const handleConfirm = async () => {
    setConfirmLoading(true);
    setConfirmError(null); // Clear any previous errors
    try {
      const baseUrl =
        process.env.REACT_APP_API_URL || "http://localhost:7000/api";
      const apiUrl = `${baseUrl}/suborders/${subOrderId}/${token}/confirm`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "confirm" }),
      });
      const data = await response.json();
      if (!response.ok || !data.status) {
        // Store the full error response for better error display
        const errorData = {
          message: data.message || "Failed to confirm order",
          supportMessage: data.supportMessage,
          supportContact: data.supportContact,
          nextSteps: data.nextSteps,
        };
        throw new Error(JSON.stringify(errorData));
      }
      setAction("confirm");
      setTimeout(() => setShowResult(true), 300);
    } catch (err) {
      // Try to parse structured error, fallback to simple message
      try {
        const errorData = JSON.parse(err.message);
        setConfirmError(errorData);
      } catch {
        setConfirmError({ message: err.message || "Failed to confirm order" });
      }
    } finally {
      setConfirmLoading(false);
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
              Loading order details...
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        minHeight="100vh"
        sx={{
          background: "#ffffff",
          py: 5,
        }}
      >
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

  if (!orderData) {
    return (
      <Box
        minHeight="100vh"
        sx={{
          background: "#ffffff",
          py: 5,
        }}
      >
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
                No order data found
              </Alert>
            </CardContent>
          </MainCard>
        </Container>
      </Box>
    );
  }

  const { subOrder, supplier, order } = orderData;

  // Debug logging
  console.log("Supplier data:", supplier);
  console.log("Order data:", order);
  console.log("SubOrder data:", subOrder);

  return (
    <Box
      minHeight="100vh"
      sx={{
        background: "#ffffff",
        py: 5,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <HeaderSection sx={{ background: "#0387D9", borderRadius: "12px" }}>
          <Container maxWidth="lg">
            <Typography variant="h4" fontWeight={600} color="white" mb={1}>
              {COMPANY}
            </Typography>
            <Typography variant="body1" color="white">
              Supplier Order Confirmation
            </Typography>
          </Container>
        </HeaderSection>

        {/* Main Content */}
        <Grid container spacing={4}>
          {/* Left Column - Order Details */}
          <Grid item xs={12} lg={8}>
            <MainCard>
              <CardContent sx={{ p: 4 }}>
                {/* Order Header */}
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={3}
                >
                  <Box>
                    <Typography variant="h5" fontWeight={600} color="#212529">
                      Order #{order.orderId}
                    </Typography>
                    <Typography variant="body2" color="#6c757d" mt={0.5}>
                      Please review and confirm this order
                    </Typography>
                  </Box>
                  <StatusChip status={subOrder.status} />
                </Box>

                <Divider sx={{ mb: 4 }} />

                {/* Products Section */}
                <InfoSection
                  title="Products"
                  icon={
                    <ShoppingCartIcon sx={{ color: "#0387D9", fontSize: 20 }} />
                  }
                >
                  <Grid container spacing={2}>
                    {subOrder.products.map((product, index) => (
                      <Grid item xs={12} key={product.id}>
                        <ProductCard>
                          <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={6}>
                              <Typography
                                variant="subtitle1"
                                fontWeight={600}
                                color="#212529"
                                mb={1}
                              >
                                {product.name}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="#6c757d"
                                mb={1}
                              >
                                {product.description}
                              </Typography>
                              <Chip
                                label={product.category}
                                size="small"
                                sx={{
                                  backgroundColor: "#e9ecef",
                                  color: "#495057",
                                  fontWeight: 500,
                                  fontSize: "0.75rem",
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} md={3}>
                              <Typography variant="body2" color="#6c757d">
                                Quantity: <strong>{product.quantity}</strong>
                              </Typography>
                              <Typography variant="body2" color="#6c757d">
                                Price:{" "}
                                <strong>${product.price.toFixed(2)}</strong>
                              </Typography>
                            </Grid>
                            <Grid item xs={12} md={3} textAlign="right">
                              <Typography
                                variant="subtitle1"
                                fontWeight={600}
                                color="#0387D9"
                              >
                                ${product.subtotal.toFixed(2)}
                              </Typography>
                            </Grid>
                          </Grid>
                        </ProductCard>
                      </Grid>
                    ))}
                  </Grid>

                  {/* Total */}
                  <Box
                    sx={{
                      mt: 3,
                      p: 3,
                      background: "#f8f9fa",
                      borderRadius: 6,
                      border: "1px solid #e9ecef",
                    }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight={600}
                      textAlign="right"
                      color="#0387D9"
                    >
                      Total: ${subOrder.subTotal.toFixed(2)}
                    </Typography>
                  </Box>
                </InfoSection>

                {/* Delivery Information */}
                <InfoSection
                  title="Delivery Information"
                  icon={
                    <LocationOnIcon sx={{ color: "#0387D9", fontSize: 20 }} />
                  }
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        mb={2}
                        color="#495057"
                      >
                        Delivery Address
                      </Typography>
                      <Box
                        sx={{
                          p: 2.5,
                          background: "#f8f9fa",
                          borderRadius: 6,
                          border: "1px solid #e9ecef",
                        }}
                      >
                        <Typography
                          variant="body1"
                          fontWeight={600}
                          color="#212529"
                          mb={1}
                        >
                          {order.deliveryAddress.recipientName}
                        </Typography>
                        <Typography variant="body2" color="#6c757d" mb={0.5}>
                          {order.deliveryAddress.recipientStreet}
                          {order.deliveryAddress.recipientStreet2 &&
                            `, ${order.deliveryAddress.recipientStreet2}`}
                        </Typography>
                        <Typography variant="body2" color="#6c757d" mb={0.5}>
                          {order.deliveryAddress.recipientCity},{" "}
                          {order.deliveryAddress.recipientState}{" "}
                          {order.deliveryAddress.recipientZip}
                        </Typography>
                        <Typography variant="body2" color="#6c757d" mb={0.5}>
                          {order.deliveryAddress.recipientCountry}
                        </Typography>
                        <Typography variant="body2" color="#6c757d" mb={0.5}>
                          Phone: {order.deliveryAddress.recipientPhone}
                        </Typography>
                        <Typography variant="body2" color="#6c757d">
                          Email: {order.deliveryAddress.recipientEmail}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        mb={2}
                        color="#495057"
                      >
                        Delivery Details
                      </Typography>
                      <Box
                        sx={{
                          p: 2.5,
                          background: "#f8f9fa",
                          borderRadius: 6,
                          border: "1px solid #e9ecef",
                        }}
                      >
                        <Typography variant="body2" mb={1} color="#6c757d">
                          <strong>Delivery Date:</strong>{" "}
                          {new Date(order.deliveryDate).toLocaleDateString()}
                        </Typography>
                        {order.additionalNotes && (
                          <Typography variant="body2" color="#6c757d">
                            <strong>Notes:</strong> {order.additionalNotes}
                          </Typography>
                        )}
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
              {/* Supplier Info */}
              <MainCard sx={{ mb: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <InfoSection
                    title="Supplier Information"
                    icon={
                      <BusinessIcon sx={{ color: "#0387D9", fontSize: 20 }} />
                    }
                  >
                    <Box
                      sx={{
                        p: 2.5,
                        background: "#f8f9fa",
                        borderRadius: 6,
                        border: "1px solid #e9ecef",
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        mb={1}
                        color="#212529"
                      >
                        {supplier?.businessName ||
                          "Supplier Name Not Available"}
                      </Typography>
                      <Typography variant="body2" mb={0.5} color="#6c757d">
                        {supplier?.email || "Email not available"}
                      </Typography>
                      <Typography variant="body2" color="#6c757d">
                        {supplier?.phone || "Phone not available"}
                      </Typography>
                    </Box>
                  </InfoSection>
                </CardContent>
              </MainCard>

              {/* Action Buttons */}
              {!action && (
                <MainCard>
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      mb={3}
                      textAlign="center"
                      color="#495057"
                    >
                      Confirm or Decline Order
                    </Typography>
                    {confirmError && (
                      <Alert severity="error" sx={{ mb: 2 }}>
                        <Typography variant="body2" fontWeight={600} mb={1}>
                          {typeof confirmError === "string"
                            ? confirmError
                            : confirmError.message}
                        </Typography>

                        {confirmError.supportMessage && (
                          <Typography variant="body2" color="#721c24" mb={1}>
                            {confirmError.supportMessage}
                          </Typography>
                        )}

                        {confirmError.supportContact && (
                          <Box
                            sx={{
                              mt: 1,
                              p: 2,
                              backgroundColor: "rgba(114, 28, 36, 0.1)",
                              borderRadius: 1,
                            }}
                          >
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              color="#721c24"
                              mb={1}
                            >
                              📞 Support Contact:
                            </Typography>
                            <Typography variant="body2" color="#721c24">
                              📧 {confirmError.supportContact.email}
                            </Typography>
                            {confirmError.supportContact.phone && (
                              <Typography variant="body2" color="#721c24">
                                📞 {confirmError.supportContact.phone}
                              </Typography>
                            )}
                            {confirmError.supportContact.instructions && (
                              <Typography
                                variant="body2"
                                color="#721c24"
                                mt={0.5}
                                fontStyle="italic"
                              >
                                {confirmError.supportContact.instructions}
                              </Typography>
                            )}
                          </Box>
                        )}

                        {confirmError.nextSteps &&
                          confirmError.nextSteps.length > 0 && (
                            <Box sx={{ mt: 1 }}>
                              <Typography
                                variant="body2"
                                fontWeight={600}
                                color="#721c24"
                                mb={1}
                              >
                                Next Steps:
                              </Typography>
                              <Box component="ol" sx={{ pl: 2, m: 0 }}>
                                {confirmError.nextSteps.map((step, index) => (
                                  <Typography
                                    key={index}
                                    component="li"
                                    variant="body2"
                                    color="#721c24"
                                    sx={{ mb: 0.5 }}
                                  >
                                    {step}
                                  </Typography>
                                ))}
                              </Box>
                            </Box>
                          )}
                      </Alert>
                    )}
                    <Box display="flex" flexDirection="column" gap={2}>
                      <ActionButton
                        variant="contained"
                        fullWidth
                        size="large"
                        startIcon={<CheckCircleIcon />}
                        onClick={handleConfirm}
                        sx={{
                          background: PRIMARY,
                          "&:hover": { background: "#1565c0" },
                        }}
                        disabled={confirmLoading}
                      >
                        {confirmLoading ? "Confirming..." : "Confirm Order"}
                      </ActionButton>
                      <ActionButton
                        variant="outlined"
                        fullWidth
                        size="large"
                        startIcon={<CancelIcon />}
                        onClick={openDeclineModal}
                        sx={{
                          borderColor: "#dc3545",
                          color: "#dc3545",
                          "&:hover": {
                            borderColor: "#c82333",
                            backgroundColor: "#f8f9fa",
                          },
                        }}
                      >
                        Decline Order
                      </ActionButton>
                    </Box>
                  </CardContent>
                </MainCard>
              )}

              {/* Decline Modal */}
              <Dialog
                open={declineModalOpen}
                onClose={closeDeclineModal}
                maxWidth="xs"
                fullWidth
              >
                <DialogTitle sx={{ fontWeight: 700, color: "#dc3545" }}>
                  Decline Order
                </DialogTitle>
                <DialogContent>
                  <Typography mb={2} color="#495057">
                    Are you sure you want to decline this order? <br />
                    <b>This action cannot be reversed.</b>
                  </Typography>
                  <TextField
                    label="Reason for declining (optional)"
                    multiline
                    minRows={2}
                    maxRows={4}
                    fullWidth
                    value={declineReason}
                    onChange={(e) => setDeclineReason(e.target.value)}
                    variant="outlined"
                  />
                  {declineError && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      {declineError}
                    </Alert>
                  )}
                </DialogContent>
                <DialogActions>
                  <Button onClick={closeDeclineModal} disabled={declineLoading}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDeclineConfirm}
                    color="error"
                    variant="contained"
                    disabled={declineLoading}
                    startIcon={<CancelIcon />}
                  >
                    {declineLoading ? "Declining..." : "Yes, Decline Order"}
                  </Button>
                </DialogActions>
              </Dialog>

              {/* Result Feedback */}
              {action && (
                <MainCard>
                  <CardContent sx={{ p: 3, textAlign: "center" }}>
                    {action === "confirm" ? (
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
                        Order Confirmed Successfully
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
                        Order Declined
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
      </Container>
    </Box>
  );
};

export default SupplierOrderConfirmationPage;
