// Copied and adapted from crew order details page
import { useState, useEffect } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Chip,
  Divider,
  Grid,
  Card,
  CardContent,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  CopyIcon,
  CheckIcon,
  PackageIcon,
  CalendarIcon,
  MapPinIcon,
  FileTextIcon,
  TruckIcon,
  ClockIcon,
  DownloadIcon,
} from "lucide-react";
import { styled } from "@mui/material/styles";
import { getAdminOrderById } from "../../services/admin/adminOrderService";
import { formatCurrency } from "../../utils/formatters";
import { exportOrderToPDF } from "../../utils/pdfUtils";
import { useToast } from "../../context/toast/toastContext";
import OrderDetailsSkeleton from "../../components/CrewOrderSkeletons/OrderDetailsSkeleton";
import SelectedShipmentRates from "../crew/order/selectedShipmentRates";

const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  border: "none",
  backgroundColor: "rgba(255, 255, 255, 0.7)",
  backdropFilter: "blur(8px)",
  borderRadius: "12px",
}));

const StyledButton = styled(Button)(({ theme }) => ({
  height: "32px",
  width: "32px",
  minWidth: "32px",
  padding: 0,
  borderRadius: "6px",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "#e5e7eb",
    transform: "scale(1.1)",
  },
}));

const CopyIconStyled = styled(CopyIcon)(({ theme, copied }) => ({
  fontSize: "16px",
  color: copied ? "#16a34a" : "#6b7280",
  transition: "all 0.3s ease",
  "&:hover": {
    color: "#0387D9",
    transform: "rotate(12deg) scale(1.1)",
  },
}));

const CheckIconStyled = styled(CheckIcon)(({ theme }) => ({
  fontSize: "16px",
  color: "#16a34a",
  animation: "zoomIn 0.2s ease",
  "@keyframes zoomIn": {
    "0%": {
      transform: "scale(0)",
    },
    "100%": {
      transform: "scale(1)",
    },
  },
}));

const ProductCard = styled(Box)(({ theme }) => ({
  background: "linear-gradient(to right, #f8fafc, rgba(59, 130, 246, 0.05))",
  borderRadius: "8px",
  padding: "16px",
  border: "1px solid #e5e7eb",
}));

const AdminOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setPageTitle } = useOutletContext() || {};
  const { toast } = useToast();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    if (setPageTitle) setPageTitle("Order Details");
  }, [setPageTitle]);

  // Fetch order details (use admin endpoint)
  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAdminOrderById(id);
      if (response.status) {
        setOrder(response.data);
      } else {
        // Handle 401/403
        if (
          response.message &&
          (response.message.toLowerCase().includes("unauthorized") ||
            response.message.toLowerCase().includes("forbidden") ||
            response.message.toLowerCase().includes("token"))
        ) {
          navigate("/login", {
            replace: true,
            state: { message: "Session expired. Please log in again." },
          });
        } else {
          setError(
            response.message ||
              response.error ||
              "Failed to fetch order details"
          );
        }
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      delivered: {
        sx: {
          backgroundColor: "#ecfdf3",
          color: "#027a48",
          border: "1px solid #d1fae5",
          "&:hover": { backgroundColor: "#d1fae5" },
        },
        icon: CheckIcon,
      },
      confirmed: {
        sx: {
          backgroundColor: "rgba(3, 135, 217, 0.1)",
          color: "#0387D9",
          border: "1px solid rgba(3, 135, 217, 0.2)",
          "&:hover": { backgroundColor: "rgba(3, 135, 217, 0.2)" },
        },
        icon: CheckIcon,
      },
      shipped: {
        sx: {
          backgroundColor: "#fffaeb",
          color: "#b54708",
          border: "1px solid #fed7aa",
          "&:hover": { backgroundColor: "#fed7aa" },
        },
        icon: TruckIcon,
      },
      cancelled: {
        sx: {
          backgroundColor: "#fef3f2",
          color: "#b42318",
          border: "1px solid #fecaca",
          "&:hover": { backgroundColor: "#fecaca" },
        },
        icon: ClockIcon,
      },
      declined: {
        sx: {
          backgroundColor: "#fef3f2",
          color: "#b42318",
          border: "1px solid #fecaca",
          "&:hover": { backgroundColor: "#fecaca" },
        },
        icon: ClockIcon,
      },
      partially_confirmed: {
        sx: {
          backgroundColor: "rgba(3, 135, 217, 0.1)",
          color: "#0387D9",
          border: "1px solid rgba(3, 135, 217, 0.2)",
          "&:hover": { backgroundColor: "rgba(3, 135, 217, 0.2)" },
        },
        icon: ClockIcon,
      },
      default: {
        sx: {
          backgroundColor: "#f9fafb",
          color: "#374151",
          border: "1px solid #d1d5db",
          "&:hover": { backgroundColor: "#f3f4f6" },
        },
        icon: ClockIcon,
      },
    };
    return configs[status] || configs.default;
  };

  const copyOrderId = async () => {
    try {
      await navigator.clipboard.writeText(order.orderId || order._id);
      setCopied(true);
      setSnackbarMessage("Order ID copied to clipboard");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      setSnackbarMessage("Failed to copy Order ID");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleExportPDF = () => {
    try {
      exportOrderToPDF(order);
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "PDF exported successfully!",
      });
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to export PDF",
      });
    }
  };

  if (loading) {
    return <OrderDetailsSkeleton />;
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
          gap: 2,
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "#111827", mb: 1 }}
          >
            Error Loading Order Details
          </Typography>
          <Typography variant="body2" sx={{ color: "#6b7280" }}>
            {error}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          onClick={() => navigate("/admin/orders-management")}
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          Back to Orders
        </Button>
      </Box>
    );
  }

  if (!order) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
          gap: 2,
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "#111827", mb: 1 }}
          >
            Order Not Found
          </Typography>
          <Typography variant="body2" sx={{ color: "#6b7280" }}>
            The order you're looking for doesn't exist or you don't have
            permission to view it.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          onClick={() => navigate("/admin/orders-management")}
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          Back to Orders
        </Button>
      </Box>
    );
  }

  const totalProductCount =
    order.subOrders?.reduce((total, subOrder) => {
      return (
        total +
        (subOrder.products?.reduce(
          (subTotal, product) => subTotal + product.quantity,
          0
        ) || 0)
      );
    }, 0) || 0;

  return (
    <Box
      sx={{
        background:
          "linear-gradient(to bottom right, #f8fafc, rgba(59, 130, 246, 0.05))",
        minHeight: "100vh",
        p: { md: 3 },
      }}
    >
      {/* Order ID Section */}
      <Box sx={{ mb: 4, mt: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Order ID:
          </Typography>
          <Box
            component="code"
            sx={{
              px: 2,
              py: 1,
              backgroundColor: "#f3f4f6",
              borderRadius: "8px",
              fontSize: "14px",
              fontFamily: "monospace",
              color: "#374151",
              fontWeight: 600,
              border: "1px solid #e5e7eb",
            }}
          >
            {order.orderId || order._id}
          </Box>
          <StyledButton onClick={copyOrderId}>
            {copied ? <CheckIconStyled /> : <CopyIconStyled copied={copied} />}
          </StyledButton>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} lg={8}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {/* Order Summary */}
            <StyledCard>
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}
                >
                  <PackageIcon size={24} stroke="#0387D9" />
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: "#374151" }}
                  >
                    Order Summary
                  </Typography>
                </Box>

                <Grid container spacing={4}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: "#6b7280",
                          mb: 1,
                          textTransform: "uppercase",
                          fontSize: "12px",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Order Date
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#111827",
                          fontWeight: 500,
                          fontSize: "16px",
                        }}
                      >
                        {formatDate(order.createdAt)}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: "#6b7280",
                          mb: 1,
                          textTransform: "uppercase",
                          fontSize: "12px",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Total Amount
                      </Typography>
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 800,
                          color: "#0387D9",
                          fontSize: { xs: "24px", md: "28px" },
                        }}
                      >
                        {formatCurrency(order.totalPrice)}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: "#6b7280",
                          mb: 1,
                          textTransform: "uppercase",
                          fontSize: "12px",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Order Status
                      </Typography>
                      <Chip
                        icon={
                          <CheckIcon sx={{ fontSize: "14px !important" }} />
                        }
                        label={order.overallStatus || "pending"}
                        sx={{
                          ...getStatusConfig(order.overallStatus).sx,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          fontSize: "13px",
                          height: "28px",
                          fontWeight: 600,
                          px: 2,
                          width: "fit-content",
                          minWidth: "auto",
                        }}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: "#6b7280",
                          mb: 1,
                          textTransform: "uppercase",
                          fontSize: "12px",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Products Count
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#111827",
                          fontWeight: 500,
                          fontSize: "16px",
                        }}
                      >
                        {totalProductCount} products
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </StyledCard>

            {/* Order Items */}
            {order.subOrders && order.subOrders.length > 0 && (
              <StyledCard>
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 4,
                    }}
                  >
                    <PackageIcon size={24} stroke="#0387D9" />
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 700, color: "#374151" }}
                    >
                      Order Items ({order.subOrders.length})
                    </Typography>
                  </Box>

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 4 }}
                  >
                    {order.subOrders.map((subOrder, index) => {
                      const subStatusConfig = getStatusConfig(subOrder.status);
                      const SubStatusIcon = subStatusConfig.icon;

                      return (
                        <Box key={subOrder._id}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              mb: 3,
                            }}
                          >
                            <Box>
                              <Typography
                                variant="h6"
                                sx={{
                                  fontWeight: 700,
                                  color: "#3741517",
                                  mb: 1,
                                  fontSize: "18px",
                                }}
                              >
                                Item {index + 1}
                              </Typography>
                              {subOrder.supplier && (
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: "#6b7280",
                                    mb: 1,
                                    fontWeight: 500,
                                    fontSize: "14px",
                                  }}
                                >
                                  Supplier: {subOrder.supplier.businessName}
                                </Typography>
                              )}
                              <Typography
                                variant="h5"
                                sx={{
                                  fontWeight: 700,
                                  color: "#0387D9",
                                  fontSize: "20px",
                                }}
                              >
                                {formatCurrency(subOrder.subTotal)}
                              </Typography>
                            </Box>
                            <Chip
                              icon={
                                <SubStatusIcon
                                  sx={{ fontSize: "14px !important" }}
                                />
                              }
                              label={subOrder.status || "pending"}
                              sx={{
                                ...subStatusConfig.sx,
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                fontSize: "13px",
                                height: "28px",
                                fontWeight: 600,
                                px: 2,
                              }}
                            />
                          </Box>

                          {/* Products */}
                          {subOrder.products &&
                            subOrder.products.length > 0 && (
                              <Box sx={{ mb: 3 }}>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 700,
                                    color: "#374151",
                                    mb: 2,
                                    textTransform: "uppercase",
                                    fontSize: "12px",
                                    letterSpacing: "0.5px",
                                  }}
                                >
                                  Products:
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 2,
                                  }}
                                >
                                  {subOrder.products.map(
                                    (productItem, productIndex) => (
                                      <ProductCard
                                        key={productItem._id || productIndex}
                                      >
                                        <Box
                                          sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "flex-start",
                                            mb: 1.5,
                                          }}
                                        >
                                          <Typography
                                            variant="subtitle1"
                                            sx={{
                                              fontWeight: 600,
                                              color: "#111827",
                                              fontSize: "16px",
                                            }}
                                          >
                                            {productItem.product?.name ||
                                              "Product Name N/A"}
                                          </Typography>
                                          <Typography
                                            variant="h6"
                                            sx={{
                                              fontWeight: 700,
                                              color: "#0387D9",
                                              fontSize: "18px",
                                            }}
                                          >
                                            {formatCurrency(
                                              productItem.quantity *
                                                productItem.price
                                            )}
                                          </Typography>
                                        </Box>

                                        <Box
                                          sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            mb: 1,
                                          }}
                                        >
                                          <Typography
                                            variant="body2"
                                            sx={{
                                              color: "#6b7280",
                                              fontWeight: 500,
                                              fontSize: "14px",
                                            }}
                                          >
                                            Qty: {productItem.quantity} ×{" "}
                                            {formatCurrency(productItem.price)}
                                          </Typography>
                                        </Box>

                                        {productItem.product?.description && (
                                          <Typography
                                            variant="body2"
                                            sx={{
                                              color: "#6b7280",
                                              mt: 1.5,
                                              fontSize: "14px",
                                              lineHeight: 1.5,
                                            }}
                                          >
                                            {productItem.product.description}
                                          </Typography>
                                        )}
                                      </ProductCard>
                                    )
                                  )}
                                </Box>
                              </Box>
                            )}

                          {index < order.subOrders.length - 1 && (
                            <Divider sx={{ my: 4 }} />
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                </CardContent>
              </StyledCard>
            )}

            {/* Purchased Labels (Selected Shipments Only) */}
            {order.subOrders &&
              order.subOrders.some(
                (so) => so.shipment && so.shipment.selectedRate
              ) && <SelectedShipmentRates subOrders={order.subOrders} />}
          </Box>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {/* Order Information */}
            <StyledCard>
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}
                >
                  <FileTextIcon size={24} stroke="#0387D9" />
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: "#374151" }}
                  >
                    Order Information
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      mb: 1,
                    }}
                  >
                    <MapPinIcon size={18} stroke="#0387D9" />
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: "#374151",
                        textTransform: "uppercase",
                        fontSize: "12px",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Delivery Address
                    </Typography>
                  </Box>
                  {order.deliveryAddress ? (
                    <Box
                      sx={{
                        pl: 3.5,
                        py: 1.5,
                        backgroundColor: "#f3f4f6",
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb",
                        fontSize: "15px",
                        fontWeight: 500,
                        color: "#111827",
                        lineHeight: 1.7,
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                          color: "#111827",
                          fontSize: "15px",
                        }}
                      >
                        {order.deliveryAddress.recipientName}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#374151", fontSize: "14px" }}
                      >
                        {order.deliveryAddress.recipientStreet}
                        {order.deliveryAddress.recipientStreet2
                          ? `, ${order.deliveryAddress.recipientStreet2}`
                          : ""}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#374151", fontSize: "14px" }}
                      >
                        {order.deliveryAddress.recipientCity},{" "}
                        {order.deliveryAddress.recipientState}{" "}
                        {order.deliveryAddress.recipientZip}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#374151", fontSize: "14px" }}
                      >
                        {order.deliveryAddress.recipientCountry}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#374151", fontSize: "14px" }}
                      >
                        {order.deliveryAddress.recipientPhone}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#374151", fontSize: "14px" }}
                      >
                        {order.deliveryAddress.recipientEmail}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#111827",
                        pl: 3.5,
                        fontWeight: 500,
                        fontSize: "15px",
                        lineHeight: 1.5,
                      }}
                    >
                      Not specified
                    </Typography>
                  )}
                </Box>

                {order.additionalNotes && (
                  <Box sx={{ mb: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        mb: 1,
                      }}
                    >
                      <FileTextIcon size={18} stroke="#0387D9" />
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: "#6b7280",
                          textTransform: "uppercase",
                          fontSize: "12px",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Additional Notes
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        ml: 3.5,
                        p: 2,
                        backgroundColor: "rgba(3, 135, 217, 0.05)",
                        borderRadius: "8px",
                        border: "1px solid rgba(3, 135, 217, 0.1)",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#111827",
                          fontSize: "15px",
                          lineHeight: 1.6,
                        }}
                      >
                        {order.additionalNotes}
                      </Typography>
                    </Box>
                  </Box>
                )}

                <Divider sx={{ my: 3 }} />

                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <CalendarIcon size={18} stroke="#0387D9" />
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: "#6b7280",
                          textTransform: "uppercase",
                          fontSize: "12px",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Created
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#111827",
                        fontWeight: 500,
                        fontSize: "14px",
                      }}
                    >
                      {formatDate(order.createdAt)}
                    </Typography>
                  </Box>

                  {order.updatedAt && order.updatedAt !== order.createdAt && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <ClockIcon size={18} stroke="#0387D9" />
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: "#6b7280",
                            textTransform: "uppercase",
                            fontSize: "12px",
                            letterSpacing: "0.5px",
                          }}
                        >
                          Updated
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#111827",
                          fontWeight: 500,
                          fontSize: "14px",
                        }}
                      >
                        {formatDate(order.updatedAt)}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </StyledCard>

            {/* Quick Actions */}
            <StyledCard>
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    mb: 3,
                    color: "#111827",
                    fontSize: "18px",
                  }}
                >
                  Quick Actions
                </Typography>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    justifyContent: "flex-start",
                    backgroundColor: "transparent",
                    textTransform: "none",
                    py: 1.5,
                    px: 2,
                    fontSize: "15px",
                    fontWeight: 600,
                    borderColor: "#0387D9",
                    color: "#0387D9",
                    "&:hover": {
                      backgroundColor: "rgba(3, 135, 217, 0.05)",
                      borderColor: "#0387D9",
                    },
                  }}
                  startIcon={<DownloadIcon size={18} stroke="#0387D9" />}
                  onClick={handleExportPDF}
                >
                  Export to PDF
                </Button>
              </CardContent>
            </StyledCard>
          </Box>
        </Grid>
      </Grid>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminOrderDetails;
