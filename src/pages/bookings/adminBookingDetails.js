import { useState, useEffect } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  Button,
  Link as MuiLink,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { getAdminBookingById } from "../../services/admin/adminBookingsService";
import { formatDate } from "../../utils/formatters";
import LaunchIcon from "@mui/icons-material/Launch";
import {
  CopyIcon,
  CheckIcon,
  PackageIcon,
  FileTextIcon,
  MapPinIcon,
  ClockIcon,
  UserIcon,
} from "lucide-react";

const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  border: "none",
  backgroundColor: "rgba(255, 255, 255, 0.7)",
  backdropFilter: "blur(8px)",
  borderRadius: "12px",
}));

const AdminBookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setPageTitle } = useOutletContext() || {};

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    if (setPageTitle) setPageTitle("Booking Details");
  }, [setPageTitle]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAdminBookingById(id);
        if (response.status) {
          setBooking(response.data);
        } else {
          const msg =
            response.message || response.error || "Failed to fetch booking";
          if (
            msg &&
            (msg.toLowerCase().includes("unauthorized") ||
              msg.toLowerCase().includes("forbidden") ||
              msg.toLowerCase().includes("token"))
          ) {
            navigate("/login", {
              replace: true,
              state: { message: "Session expired. Please log in again." },
            });
          } else {
            setError(msg);
          }
        }
      } catch (e) {
        setError(e.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetails();
  }, [id, navigate]);

  const getStatusChip = (status) => {
    const map = {
      confirmed: {
        bg: "rgba(3, 135, 217, 0.1)",
        color: "#0387D9",
        border: "1px solid rgba(3, 135, 217, 0.2)",
      },
      completed: {
        bg: "#ecfdf3",
        color: "#027a48",
        border: "1px solid #d1fae5",
      },
      pending: { bg: "#fffaeb", color: "#b54708", border: "1px solid #fed7aa" },
      cancelled: {
        bg: "#fef3f2",
        color: "#b42318",
        border: "1px solid #fecaca",
      },
      default: { bg: "#f9fafb", color: "#374151", border: "1px solid #d1d5db" },
    };
    const cfg = map[status] || map.default;
    return (
      <Chip
        size="small"
        label={status || "pending"}
        sx={{
          backgroundColor: cfg.bg,
          color: cfg.color,
          border: cfg.border,
          fontWeight: 600,
        }}
      />
    );
  };

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

  const CopyIconStyled = styled(CopyIcon)(({ theme, copied: isCopied }) => ({
    fontSize: "16px",
    color: isCopied ? "#16a34a" : "#6b7280",
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
      "0%": { transform: "scale(0)" },
      "100%": { transform: "scale(1)" },
    },
  }));

  const copyBookingId = async () => {
    try {
      await navigator.clipboard.writeText(booking.bookingId || booking._id);
      setCopied(true);
      setSnackbarMessage("Booking ID copied to clipboard");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      setSnackbarMessage("Failed to copy Booking ID");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="body1" sx={{ color: "#6b7280" }}>
          Loading booking details...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ color: "#b42318", fontWeight: 600 }}>
          {error}
        </Typography>
      </Box>
    );
  }

  if (!booking) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ color: "#111827", fontWeight: 600 }}>
          Booking not found
        </Typography>
      </Box>
    );
  }

  const servicesFromQuote = booking.quote?.services || [];
  const servicesFromBooking = booking.services || [];
  const providerName =
    booking.vendorName || booking.vendorAssigned?.businessName || "N/A";
  const crewName = booking.crew
    ? `${booking.crew.firstName || ""} ${booking.crew.lastName || ""}`.trim()
    : "N/A";

  return (
    <>
      <Box
        sx={{
          background:
            "linear-gradient(to bottom right, #f8fafc, rgba(59, 130, 246, 0.05))",
          minHeight: "100vh",
          p: { md: 3 },
        }}
      >
        <Box
          sx={{ mb: 3, mt: 1, display: "flex", alignItems: "center", gap: 2 }}
        >
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: "#374151" }}
          >
            Booking ID:
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
            {booking.bookingId || booking._id}
          </Box>
          <StyledButton onClick={copyBookingId}>
            {copied ? <CheckIconStyled /> : <CopyIconStyled copied={copied} />}
          </StyledButton>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Summary */}
              <StyledCard>
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 1,
                    }}
                  >
                    <PackageIcon size={24} stroke="#0387D9" />
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 700, color: "#374151" }}
                    >
                      Summary
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="body2"
                        sx={{ color: "#6b7280", fontWeight: 600, mb: 0.5 }}
                      >
                        Date
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ color: "#111827", fontWeight: 500 }}
                      >
                        {formatDate(booking.dateTime)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="body2"
                        sx={{ color: "#6b7280", fontWeight: 600, mb: 0.5 }}
                      >
                        Status
                      </Typography>
                      {getStatusChip(booking.bookingStatus)}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="body2"
                        sx={{ color: "#6b7280", fontWeight: 600, mb: 0.5 }}
                      >
                        Payment Status
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ color: "#111827", fontWeight: 500 }}
                      >
                        {booking.paymentStatus || "pending"}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </StyledCard>

              {/* Services */}
              <StyledCard>
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 1,
                    }}
                  >
                    <PackageIcon size={24} stroke="#0387D9" />
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 700, color: "#374151" }}
                    >
                      Services
                    </Typography>
                  </Box>
                  {servicesFromQuote.length > 0 ? (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.5,
                      }}
                    >
                      {servicesFromQuote.map((s, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            borderBottom: "1px solid #eef2f7",
                            py: 1,
                          }}
                        >
                          <Typography
                            sx={{ color: "#111827", fontWeight: 500 }}
                          >
                            {s.service?.name || s.item || "Service"} ×{" "}
                            {s.quantity || 1}
                          </Typography>
                          <Typography
                            sx={{ color: "#0387D9", fontWeight: 700 }}
                          >
                            {typeof s.totalPrice === "number"
                              ? `$${s.totalPrice.toFixed(2)}`
                              : "—"}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  ) : servicesFromBooking.length > 0 ? (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.5,
                      }}
                    >
                      {servicesFromBooking.map((s, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            borderBottom: "1px solid #eef2f7",
                            py: 1,
                          }}
                        >
                          <Typography
                            sx={{ color: "#111827", fontWeight: 500 }}
                          >
                            {s.service?.name || "Service"} × {s.quantity || 1}
                          </Typography>
                          <Typography
                            sx={{ color: "#0387D9", fontWeight: 700 }}
                          >
                            —
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Typography sx={{ color: "#6b7280" }}>
                      No services listed.
                    </Typography>
                  )}
                </CardContent>
              </StyledCard>

              {/* Quote */}
              <StyledCard>
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 1,
                    }}
                  >
                    <FileTextIcon size={24} stroke="#0387D9" />
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 700, color: "#374151" }}
                    >
                      Quote
                    </Typography>
                  </Box>
                  {booking.quote ? (
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="body2"
                          sx={{ color: "#6b7280", fontWeight: 600, mb: 0.5 }}
                        >
                          Status
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ color: "#111827", fontWeight: 500 }}
                        >
                          {booking.quote.status}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="body2"
                          sx={{ color: "#6b7280", fontWeight: 600, mb: 0.5 }}
                        >
                          Amount
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ color: "#111827", fontWeight: 700 }}
                        >
                          {typeof booking.quote.amount === "number"
                            ? `$${booking.quote.amount.toFixed(2)}`
                            : "—"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="body2"
                          sx={{ color: "#6b7280", fontWeight: 600, mb: 0.5 }}
                        >
                          Deposit
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ color: "#111827", fontWeight: 500 }}
                        >
                          {typeof booking.quote.depositAmount === "number"
                            ? `$${booking.quote.depositAmount.toFixed(2)}`
                            : "—"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="body2"
                          sx={{ color: "#6b7280", fontWeight: 600, mb: 0.5 }}
                        >
                          Balance
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ color: "#111827", fontWeight: 500 }}
                        >
                          {typeof booking.quote.balanceAmount === "number"
                            ? `$${booking.quote.balanceAmount.toFixed(2)}`
                            : "—"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="body2"
                          sx={{ color: "#6b7280", fontWeight: 600, mb: 0.5 }}
                        >
                          Valid Until
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ color: "#111827", fontWeight: 500 }}
                        >
                          {booking.quote.validUntil
                            ? formatDate(booking.quote.validUntil)
                            : "—"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Divider sx={{ my: 1 }} />
                        <Box sx={{ display: "flex", gap: 1 }}>
                          {booking.quote.invoiceUrl && (
                            <Button
                              variant="outlined"
                              size="small"
                              endIcon={<LaunchIcon />}
                              component={MuiLink}
                              href={booking.quote.invoiceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                textTransform: "none",
                                borderColor: "#0387D9",
                                color: "#0387D9",
                              }}
                            >
                              Open Invoice
                            </Button>
                          )}
                          {booking.quote.invoicePdfUrl && (
                            <Button
                              variant="outlined"
                              size="small"
                              endIcon={<LaunchIcon />}
                              component={MuiLink}
                              href={booking.quote.invoicePdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{ textTransform: "none" }}
                            >
                              Open Invoice PDF
                            </Button>
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                  ) : (
                    <Typography sx={{ color: "#6b7280" }}>
                      Quote not available yet.
                    </Typography>
                  )}
                </CardContent>
              </StyledCard>
            </Box>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} lg={4}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Service Provider */}
              <StyledCard>
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      mb: 1,
                    }}
                  >
                    <UserIcon size={20} stroke="#0387D9" />
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, color: "#374151" }}
                    >
                      Service Provider
                    </Typography>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{ color: "#111827", fontWeight: 600 }}
                  >
                    {providerName}
                  </Typography>
                  {booking.vendorAssigned?.phone && (
                    <Typography
                      variant="body2"
                      sx={{ color: "#6b7280", mt: 0.5 }}
                    >
                      {booking.vendorAssigned.phone}
                    </Typography>
                  )}
                </CardContent>
              </StyledCard>

              {/* Crew */}
              <StyledCard>
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      mb: 1,
                    }}
                  >
                    <UserIcon size={20} stroke="#0387D9" />
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, color: "#374151" }}
                    >
                      Crew
                    </Typography>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{ color: "#111827", fontWeight: 600 }}
                  >
                    {crewName}
                  </Typography>
                  {booking.crew?.phone && (
                    <Typography
                      variant="body2"
                      sx={{ color: "#6b7280", mt: 0.5 }}
                    >
                      {booking.crew.phone}
                    </Typography>
                  )}
                </CardContent>
              </StyledCard>

              {/* Location & Contact */}
              <StyledCard>
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      mb: 1,
                    }}
                  >
                    <MapPinIcon size={20} stroke="#0387D9" />
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, color: "#374151" }}
                    >
                      Location & Contact
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{ color: "#6b7280", fontWeight: 600 }}
                  >
                    Service Location
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: "#111827", fontWeight: 500, mb: 1 }}
                  >
                    {booking.serviceLocation || "—"}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#6b7280", fontWeight: 600 }}
                  >
                    Contact Phone
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: "#111827", fontWeight: 500 }}
                  >
                    {booking.contactPhone || "—"}
                  </Typography>
                </CardContent>
              </StyledCard>

              {/* Notes & Attachments */}
              {(booking.internalNotes ||
                (booking.attachments && booking.attachments.length > 0)) && (
                <StyledCard>
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        mb: 1,
                      }}
                    >
                      <FileTextIcon size={20} stroke="#0387D9" />
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, color: "#374151" }}
                      >
                        Notes & Attachments
                      </Typography>
                    </Box>
                    {booking.internalNotes && (
                      <Typography
                        variant="body2"
                        sx={{ color: "#111827", mb: 1.5 }}
                      >
                        {booking.internalNotes}
                      </Typography>
                    )}
                    {booking.attachments && booking.attachments.length > 0 && (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                        }}
                      >
                        {booking.attachments.map((att, idx) => (
                          <MuiLink
                            key={idx}
                            href={att}
                            target="_blank"
                            rel="noopener noreferrer"
                            underline="hover"
                          >
                            Attachment {idx + 1}
                          </MuiLink>
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </StyledCard>
              )}

              {/* Status History */}
              {booking.statusHistory && booking.statusHistory.length > 0 && (
                <StyledCard>
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        mb: 1,
                      }}
                    >
                      <ClockIcon size={20} stroke="#0387D9" />
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, color: "#374151" }}
                      >
                        Status History
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.5,
                      }}
                    >
                      {booking.statusHistory.map((h, idx) => (
                        <Box
                          key={idx}
                          sx={{ borderBottom: "1px solid #eef2f7", pb: 1 }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ color: "#111827", fontWeight: 600 }}
                          >
                            {h.fromStatus} → {h.toStatus}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "#6b7280" }}
                          >
                            {formatDate(h.changedAt)}{" "}
                            {h.reason ? `• ${h.reason}` : ""}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </StyledCard>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
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
    </>
  );
};

export default AdminBookingDetails;
