import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import { default as ReactSelect } from "react-select";
import countryList from "react-select-country-list";

const countryOptions = countryList().getData();

const CheckoutDialog = ({
  open,
  onClose,
  cart,
  onCheckout,
  loading,
  checkoutData = {}, // Default to empty object
  setCheckoutData,
}) => {
  // Defensive: If checkoutData is ever undefined/null, fallback to empty object
  // (Redundant with default param, but extra safe)
  const safeCheckoutData = checkoutData || {};

  // Validation
  const isFormValid =
    safeCheckoutData.street1 &&
    safeCheckoutData.city &&
    safeCheckoutData.state &&
    safeCheckoutData.zip &&
    safeCheckoutData.country &&
    safeCheckoutData.deliveryDate &&
    !loading;

  // Format currency
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const fieldStyles = {
    mb: 2.5,
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      backgroundColor: '#f8fafc',
      transition: 'all 0.2s',
      '& fieldset': {
        borderColor: '#e2e8f0',
        borderWidth: 1.5
      },
      '&:hover fieldset': {
        borderColor: '#cbd5e1'
      },
      '&.Mui-focused': {
        backgroundColor: '#fff',
        '& fieldset': {
          borderColor: '#0387D9',
          borderWidth: 2
        }
      }
    },
    '& .MuiInputLabel-root': {
      color: '#64748b',
      fontWeight: 500,
      '&.Mui-focused': {
        color: '#0387D9'
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden'
        },
      }}
    >
      <DialogTitle sx={{
        background: 'linear-gradient(135deg, #0387D9 0%, #0277bd 100%)',
        color: '#fff',
        py: 3,
        px: 4
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <PaymentIcon sx={{ fontSize: 32 }} />
          <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.5px' }}>
            Complete Your Order
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: 4, backgroundColor: '#fafbfc' }}>
        <Box sx={{
          backgroundColor: '#fff',
          borderRadius: 3,
          p: 3,
          mb: 3,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
        }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 4, height: 24, backgroundColor: '#0387D9', borderRadius: 1 }} />
            Shipping Address
          </Typography>
          <TextField
            fullWidth
            label="Street Address 1"
            value={safeCheckoutData.street1 || ""}
            onChange={(e) =>
              setCheckoutData({ ...safeCheckoutData, street1: e.target.value })
            }
            required
            sx={fieldStyles}
          />
          <TextField
            fullWidth
            label="Street Address 2 (optional)"
            value={safeCheckoutData.street2 || ""}
            onChange={(e) =>
              setCheckoutData({ ...safeCheckoutData, street2: e.target.value })
            }
            sx={fieldStyles}
            placeholder="Apartment, suite, unit, etc."
          />
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2.5 }}>
            <TextField
              label="City"
              value={safeCheckoutData.city || ""}
              onChange={(e) =>
                setCheckoutData({ ...safeCheckoutData, city: e.target.value })
              }
              required
              sx={fieldStyles}
            />
            <TextField
              label="State/Province/Region"
              value={safeCheckoutData.state || ""}
              onChange={(e) =>
                setCheckoutData({ ...safeCheckoutData, state: e.target.value })
              }
              required
              sx={fieldStyles}
            />
          </Box>
          <Box sx={{ display: "grid", alignItems: "end", gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2.5 }}>
            <TextField
              label="Zip/Postal Code"
              value={safeCheckoutData.zip || ""}
              onChange={(e) =>
                setCheckoutData({ ...safeCheckoutData, zip: e.target.value })
              }
              required
              sx={fieldStyles}
            />

            <Box>
              <Typography
                variant="body2"
                sx={{ mb: 1, color: "#64748b", fontWeight: 500, fontSize: '0.875rem' }}
              >
                Country <span style={{ color: "#ef4444" }}>*</span>
              </Typography>
              <ReactSelect
                options={countryOptions}
                value={
                  countryOptions.find(
                    (c) => c.value === safeCheckoutData.country
                  ) || null
                }
                onChange={(option) =>
                  setCheckoutData({
                    ...safeCheckoutData,
                    country: option.value,
                  })
                }
                placeholder="Select country..."
                isSearchable
                styles={{
                  control: (base, state) => ({
                    ...base,
                    borderRadius: 8,
                    backgroundColor: '#f8fafc',
                    borderColor: state.isFocused ? "#0387D9" : "#e2e8f0",
                    borderWidth: state.isFocused ? 2 : 1.5,
                    boxShadow: "none",
                    minHeight: 56,
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: '#cbd5e1'
                    }
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isSelected
                      ? "#0387D9"
                      : state.isFocused
                        ? "#e0f2fe"
                        : "white",
                    color: state.isSelected ? "white" : "#1e293b",
                    cursor: 'pointer'
                  }),
                }}
                required
              />
            </Box>
          </Box>
          <TextField
            fullWidth
            label="Delivery Date"
            type="date"
            value={
              safeCheckoutData.deliveryDate
                ? safeCheckoutData.deliveryDate.toISOString().split("T")[0]
                : ""
            }
            onChange={(e) =>
              setCheckoutData({
                ...safeCheckoutData,
                deliveryDate: e.target.value ? new Date(e.target.value) : null,
              })
            }
            required
            InputLabelProps={{ shrink: true }}
            sx={fieldStyles}
          />
          <TextField
            fullWidth
            label="Additional Notes (optional)"
            multiline
            rows={3}
            value={safeCheckoutData.additionalNotes || ""}
            onChange={(e) =>
              setCheckoutData({
                ...safeCheckoutData,
                additionalNotes: e.target.value,
              })
            }
            placeholder="Any special instructions or notes..."
            sx={{ ...fieldStyles, mb: 0 }}
          />
        </Box>
        <Box sx={{
          backgroundColor: '#fff',
          borderRadius: 3,
          p: 3,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
        }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 4, height: 24, backgroundColor: '#0387D9', borderRadius: 1 }} />
            Order Summary
          </Typography>
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, py: 1.5, borderBottom: '1px solid #f1f5f9' }}>
              <Typography variant="body1" sx={{ color: "#64748b", fontWeight: 500 }}>
                Total Items:
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                {cart?.totalItems || 0}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, py: 1.5, borderBottom: '1px solid #f1f5f9' }}>
              <Typography variant="body1" sx={{ color: "#64748b", fontWeight: 500 }}>
                Subtotal:
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                {formatCurrency(cart?.totalPrice || 0)}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, py: 1.5, borderBottom: '1px solid #f1f5f9' }}>
              <Typography variant="body1" sx={{ color: "#64748b", fontWeight: 500 }}>
                Platform Fee:
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                {formatCurrency(cart?.platformFee || 0)}
              </Typography>
            </Box>
            <Box sx={{
              display: "flex",
              justifyContent: "space-between",
              p: 2,
              backgroundColor: '#f0f9ff',
              borderRadius: 2,
              border: '2px solid #0387D9'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b" }}>
                Grand Total:
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#0387D9" }}>
                {formatCurrency(cart?.grandTotal || 0)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{
        p: 3,
        backgroundColor: '#f8fafc',
        borderTop: '1px solid #e2e8f0',
        gap: 2
      }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            color: "#64748b",
            fontWeight: 600,
            px: 3,
            py: 1,
            borderRadius: 2,
            '&:hover': {
              backgroundColor: '#f1f5f9'
            }
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onCheckout}
          disabled={!isFormValid}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PaymentIcon />}
          sx={{
            background: 'linear-gradient(135deg, #0387D9 0%, #0277bd 100%)',
            boxShadow: '0 4px 12px rgba(3, 135, 217, 0.3)',
            fontWeight: 600,
            px: 4,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem',
            '&:hover': {
              background: 'linear-gradient(135deg, #0277bd 0%, #01579b 100%)',
              boxShadow: '0 6px 16px rgba(3, 135, 217, 0.4)',
            },
            '&:disabled': {
              background: '#cbd5e1',
              color: '#94a3b8'
            }
          }}
        >
          {loading ? "Processing..." : "Place Order"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CheckoutDialog;