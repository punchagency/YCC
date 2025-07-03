import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Divider,
  CircularProgress,
} from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import { default as ReactSelect } from 'react-select';
import countryList from 'react-select-country-list';

const countryOptions = countryList().getData();

const CheckoutDialog = ({
  open,
  onClose,
  cart,
  onCheckout,
  loading,
  checkoutData,
  setCheckoutData,
}) => {
  // Validation
  const isFormValid =
    checkoutData.street1 &&
    checkoutData.city &&
    checkoutData.state &&
    checkoutData.zip &&
    checkoutData.country &&
    checkoutData.deliveryDate &&
    !loading;

  // Format currency
  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow:
            '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#111827' }}>
          Complete Your Order
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ p: { xs: 1, md: 3 } }}>
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Street Address 1"
            value={checkoutData.street1 || ''}
            onChange={(e) => setCheckoutData({ ...checkoutData, street1: e.target.value })}
            required
            sx={{ mb: 3 }}
          />
          <TextField
            fullWidth
            label="Street Address 2 (optional)"
            value={checkoutData.street2 || ''}
            onChange={(e) => setCheckoutData({ ...checkoutData, street2: e.target.value })}
            sx={{ mb: 3 }}
            placeholder="Apartment, suite, unit, etc. (optional)"
          />
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <TextField
              label="City"
              value={checkoutData.city || ''}
              onChange={(e) => setCheckoutData({ ...checkoutData, city: e.target.value })}
              required
              sx={{ flex: 1, minWidth: 120 }}
            />
            <TextField
              label="State/Province/Region"
              value={checkoutData.state || ''}
              onChange={(e) => setCheckoutData({ ...checkoutData, state: e.target.value })}
              required
              sx={{ flex: 1, minWidth: 120 }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <TextField
              label="Zip/Postal Code"
              value={checkoutData.zip || ''}
              onChange={(e) => setCheckoutData({ ...checkoutData, zip: e.target.value })}
              required
              sx={{ flex: 1, minWidth: 120 }}
            />
            <Box sx={{ flex: 1, minWidth: 120 }}>
              <Typography variant="body2" sx={{ mb: 0.5, color: '#374151', fontWeight: 500 }}>
                Country <span style={{ color: '#ef4444' }}>*</span>
              </Typography>
              <ReactSelect
                options={countryOptions}
                value={countryOptions.find((c) => c.value === checkoutData.country) || null}
                onChange={(option) => setCheckoutData({ ...checkoutData, country: option.value })}
                placeholder="Select country..."
                isSearchable
                styles={{
                  control: (base, state) => ({
                    ...base,
                    borderRadius: 8,
                    borderColor: state.isFocused ? '#0387D9' : '#d1d5db',
                    boxShadow: 'none',
                    minHeight: 40,
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isSelected
                      ? '#0387D9'
                      : state.isFocused
                      ? '#e0f2fe'
                      : 'white',
                    color: state.isSelected ? 'white' : '#111827',
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
            value={checkoutData.deliveryDate ? checkoutData.deliveryDate.toISOString().split('T')[0] : ''}
            onChange={(e) =>
              setCheckoutData({
                ...checkoutData,
                deliveryDate: e.target.value ? new Date(e.target.value) : null,
              })
            }
            required
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 3 }}
          />
          <TextField
            fullWidth
            label="Additional Notes (optional)"
            multiline
            rows={3}
            value={checkoutData.additionalNotes || ''}
            onChange={(e) => setCheckoutData({ ...checkoutData, additionalNotes: e.target.value })}
            placeholder="Any special instructions or notes..."
          />
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#111827' }}>
            Order Summary
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1" sx={{ color: '#6b7280' }}>
                Total Items:
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {cart?.totalItems || 0}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1" sx={{ color: '#6b7280' }}>
                Subtotal:
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {formatCurrency(cart?.totalPrice || 0)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1" sx={{ color: '#6b7280' }}>
                Platform Fee:
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {formatCurrency(cart?.platformFee || 0)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827' }}>
                Grand Total:
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#0387D9' }}>
                {formatCurrency(cart?.grandTotal || 0)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={onClose} sx={{ color: '#6b7280' }} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onCheckout}
          disabled={!isFormValid}
          startIcon={loading ? <CircularProgress size={20} /> : <PaymentIcon />}
          sx={{
            backgroundColor: '#0387D9',
            '&:hover': {
              backgroundColor: '#0277bd',
            },
            fontWeight: 600,
          }}
        >
          {loading ? 'Processing...' : 'Place Order'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CheckoutDialog; 