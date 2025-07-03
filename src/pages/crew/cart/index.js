import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Avatar,
  Badge,
  Alert,
  Snackbar,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Tooltip,
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  Clear as ClearIcon,
  ShoppingBag as ShoppingBagIcon,
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Notes as NotesIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { 
  getCart, 
  updateCartQuantity, 
  removeFromCart, 
  clearCart, 
  checkout 
} from '../../../services/crew/cartService';
import { useToast } from '../../../context/toast/toastContext';
import { useCart } from '../../../context/cart/cartContext';
import CartSkeleton from '../../../components/CartSkeleton';
import { keyframes } from '@mui/system';
import CheckoutDialog from './CheckoutDialog';

// Pulse animation for badge
const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(3,135,217,0.4); }
  70% { box-shadow: 0 0 0 8px rgba(3,135,217,0); }
  100% { box-shadow: 0 0 0 0 rgba(3,135,217,0); }
`;

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  border: 'none',
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(8px)',
  borderRadius: '12px',
  marginBottom: theme.spacing(2),
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    transform: 'translateY(-2px)',
  },
}));

const ProductImage = styled('img')(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: 8,
  objectFit: 'cover',
  border: '1px solid #e5e7eb',
}));

const ProductPlaceholder = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: 8,
  backgroundColor: '#f3f4f6',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid #e5e7eb',
  '& .MuiSvgIcon-root': {
    fontSize: 32,
    color: '#9ca3af',
  },
}));

const QuantityButton = styled(IconButton)(({ theme }) => ({
  width: 32,
  height: 32,
  border: '1px solid #d1d5db',
  '&:hover': {
    backgroundColor: '#f3f4f6',
    borderColor: '#9ca3af',
  },
}));

const CartPage = () => {
  const navigate = useNavigate();
  const { setPageTitle } = useOutletContext() || {};
  const { toast } = useToast();
  const { updateCart, clearCart: clearCartContext } = useCart();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // State management
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingItem, setUpdatingItem] = useState(null);
  const [removingItem, setRemovingItem] = useState(null);
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const [showClearCartDialog, setShowClearCartDialog] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [clearCartLoading, setClearCartLoading] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    street1: '',
    street2: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    deliveryDate: null,
    additionalNotes: ''
  });

  // Set page title when component mounts
  useEffect(() => {
    if (setPageTitle) setPageTitle('Shopping Cart');
  }, [setPageTitle]);

  // Fetch cart data on component mount
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getCart();
      
      if (response.status) {
        setCart(response.data);
      } else {
        setError(response.message || 'Failed to fetch cart');
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: response.message || 'Failed to fetch cart',
          life: 3000,
        });
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError('Failed to fetch cart data');
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to fetch cart data',
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (supplierIndex, productIndex, newQuantity) => {
    if (newQuantity < 1) return;

    const supplierGroup = cart.supplierGroups[supplierIndex];
    const product = supplierGroup.products[productIndex];
    
    try {
      setUpdatingItem(`${supplierIndex}-${productIndex}`);
      
      const response = await updateCartQuantity({
        inventoryId: product.inventoryId,
        quantity: newQuantity
      });

      if (response.status) {
        setCart(response.data);
        updateCart(response.data);
        toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Quantity updated successfully',
          life: 3000,
        });
      } else {
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: response.message || 'Failed to update quantity',
          life: 3000,
        });
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to update quantity',
        life: 3000,
      });
    } finally {
      setUpdatingItem(null);
    }
  };

  const handleRemoveItem = async (supplierIndex, productIndex) => {
    const supplierGroup = cart.supplierGroups[supplierIndex];
    const product = supplierGroup.products[productIndex];
    
    try {
      setRemovingItem(`${supplierIndex}-${productIndex}`);
      
      const response = await removeFromCart({
        inventoryId: product.inventoryId
      });

      if (response.status) {
        setCart(response.data);
        updateCart(response.data);
        toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Item removed from cart',
          life: 3000,
        });
      } else {
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: response.message || 'Failed to remove item',
          life: 3000,
        });
      }
    } catch (error) {
      console.error('Error removing item:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to remove item',
        life: 3000,
      });
    } finally {
      setRemovingItem(null);
    }
  };

  const handleClearCart = async () => {
    try {
      setClearCartLoading(true);
      const response = await clearCart();
      if (response.status) {
        setCart(response.data);
        updateCart(response.data);
        toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Cart cleared successfully',
          life: 3000,
        });
        setShowClearCartDialog(false);
      } else {
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: response.message || 'Failed to clear cart',
          life: 3000,
        });
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to clear cart',
        life: 3000,
      });
    } finally {
      setClearCartLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!checkoutData.street1 || !checkoutData.city || !checkoutData.state || !checkoutData.zip || !checkoutData.country || !checkoutData.deliveryDate) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill in all required fields',
        life: 3000,
      });
      return;
    }

    try {
      setCheckoutLoading(true);
      
      const response = await checkout({
        street1: checkoutData.street1,
        street2: checkoutData.street2,
        city: checkoutData.city,
        state: checkoutData.state,
        zip: checkoutData.zip,
        country: checkoutData.country,
        deliveryDate: checkoutData.deliveryDate.toISOString(),
        additionalNotes: checkoutData.additionalNotes
      });

      if (response.status) {
        toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Order placed successfully!',
          life: 3000,
        });
        setShowCheckoutDialog(false);
        setCheckoutData({
          street1: '',
          street2: '',
          city: '',
          state: '',
          zip: '',
          country: '',
          deliveryDate: null,
          additionalNotes: ''
        });
        clearCartContext();
        // Navigate to order details
        navigate(`/crew/orders-management/${response.data.orderId}`);
      } else {
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: response.message || 'Failed to place order',
          life: 3000,
        });
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to place order',
        life: 3000,
      });
    } finally {
      setCheckoutLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Loading state
  if (loading) {
    return <CartSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ p: { xs: 2, md: 3 }, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          onClick={fetchCart}
          startIcon={<ShoppingCartIcon />}
        >
          Retry
        </Button>
      </Box>
    );
  }

  // Empty cart state
  if (!cart || cart.supplierGroups.length === 0) {
    return (
      <Box sx={{ 
        p: { xs: 2, md: 3 }, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '60vh'
      }}>
        <Box sx={{ 
          textAlign: 'center', 
          maxWidth: 400,
          p: { xs: 3, md: 4 },
          borderRadius: 3,
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        }}>
          <ShoppingBagIcon sx={{ fontSize: 80, color: '#9ca3af', mb: 2 }} />
          <Typography variant="h4" sx={{ mb: 1, color: '#374151', fontWeight: 600 }}>
            Your cart is empty
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: '#6b7280' }}>
            Start shopping to add items to your cart and place orders with multiple suppliers
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<ShoppingCartIcon />}
            onClick={() => navigate('/crew/orders-management')}
            sx={{
              backgroundColor: '#0387D9',
              '&:hover': {
                backgroundColor: '#0277bd',
              },
              px: 4,
              py: 1.5,
              borderRadius: 2,
            }}
          >
            Browse Products
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, md: 3 } }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tooltip title={`You have ${cart.totalItems} item${cart.totalItems !== 1 ? 's' : ''} in your cart`} arrow>
            <Badge
              badgeContent={cart.totalItems}
              color="primary"
              sx={{
                '& .MuiBadge-badge': {
                  backgroundColor: '#0387D9',
                  color: 'white',
                  animation: cart.totalItems > 0 ? `${pulse} 1.2s infinite` : 'none',
                  boxShadow: cart.totalItems > 0 ? '0 0 0 4px rgba(3,135,217,0.15)' : 'none',
                }
              }}
            >
              <ShoppingCartIcon sx={{ color: '#0387D9' }} />
            </Badge>
          </Tooltip>
        </Box>
        
        <Button
          variant="outlined"
          startIcon={<ClearIcon />}
          onClick={() => setShowClearCartDialog(true)}
          disabled={cart.supplierGroups.length === 0}
          sx={{
            borderColor: '#ef4444',
            color: '#ef4444',
            '&:hover': {
              borderColor: '#dc2626',
              backgroundColor: 'rgba(239, 68, 68, 0.04)',
            }
          }}
        >
          Clear Cart
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Cart Items */}
        <Grid item xs={12} lg={8}>
          {cart.supplierGroups.map((supplierGroup, supplierIndex) => (
            <StyledCard key={supplierIndex}>
              <CardContent sx={{ p: 0 }}>
                {/* Supplier Header */}
                <Box sx={{ p: { xs: 2, md: 3 }, pb: { xs: 1, md: 2 } }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    mb: 2,
                    flexWrap: 'wrap',
                    gap: 2
                  }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: '#111827' }}>
                        {supplierGroup.supplierName}
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography variant="body2" sx={{ color: '#6b7280', display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationIcon sx={{ fontSize: 16 }} />
                          {supplierGroup.supplierEmail}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6b7280', display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ShippingIcon sx={{ fontSize: 16 }} />
                          {supplierGroup.supplierPhone}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      label={`Subtotal: ${formatCurrency(supplierGroup.subTotal)}`}
                      color="primary"
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                </Box>

                <Divider />

                {/* Products List */}
                <Box>
                  {supplierGroup.products.map((product, productIndex) => (
                    <Box key={productIndex}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        p: { xs: 1.5, md: 2 }, 
                        gap: 2,
                        flexWrap: 'wrap'
                      }}>
                        {/* Product Image */}
                        <Box>
                          {product.imageUrl ? (
                            <ProductImage src={product.imageUrl} alt={product.name} />
                          ) : (
                            <ProductPlaceholder>
                              <ShoppingBagIcon />
                            </ProductPlaceholder>
                          )}
                        </Box>

                        {/* Product Details */}
                        <Box sx={{ flex: 1, minWidth: 200 }}>
                          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: '#111827' }}>
                            {product.name}
                          </Typography>
                          <Chip 
                            label={product.category} 
                            size="small" 
                            sx={{ mb: 1, backgroundColor: '#f3f4f6' }}
                          />
                          {product.description && (
                            <Typography variant="body2" sx={{ color: '#6b7280', mb: 1 }}>
                              {product.description}
                            </Typography>
                          )}
                          <Typography variant="body1" sx={{ fontWeight: 600, color: '#0387D9' }}>
                            {formatCurrency(product.price)} each
                          </Typography>
                        </Box>

                        {/* Quantity Controls */}
                        <Box sx={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'center', 
                          gap: 1,
                          minWidth: 120
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <QuantityButton
                              onClick={() => handleQuantityChange(supplierIndex, productIndex, product.quantity - 1)}
                              disabled={updatingItem === `${supplierIndex}-${productIndex}`}
                            >
                              <RemoveIcon sx={{ fontSize: 16 }} />
                            </QuantityButton>
                            {updatingItem === `${supplierIndex}-${productIndex}` ? (
                              <CircularProgress size={20} sx={{ mx: 1 }} />
                            ) : (
                              <Typography variant="body1" sx={{ minWidth: 40, textAlign: 'center', fontWeight: 600 }}>
                                {product.quantity}
                              </Typography>
                            )}
                            <QuantityButton
                              onClick={() => handleQuantityChange(supplierIndex, productIndex, product.quantity + 1)}
                              disabled={updatingItem === `${supplierIndex}-${productIndex}`}
                            >
                              <AddIcon sx={{ fontSize: 16 }} />
                            </QuantityButton>
                          </Box>
                        </Box>

                        {/* Total Price */}
                        <Box sx={{ textAlign: 'center', minWidth: 100 }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827' }}>
                            {formatCurrency(product.totalPrice)}
                          </Typography>
                        </Box>

                        {/* Remove Button */}
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveItem(supplierIndex, productIndex)}
                          disabled={removingItem === `${supplierIndex}-${productIndex}`}
                          sx={{
                            '&:hover': {
                              backgroundColor: 'rgba(239, 68, 68, 0.04)',
                            }
                          }}
                        >
                          {removingItem === `${supplierIndex}-${productIndex}` ? (
                            <CircularProgress size={20} />
                          ) : (
                            <DeleteIcon />
                          )}
                        </IconButton>
                      </Box>
                      
                      {productIndex < supplierGroup.products.length - 1 && <Divider />}
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </StyledCard>
          ))}
        </Grid>

        {/* Cart Summary */}
        <Grid item xs={12} lg={4}>
          <StyledCard>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#111827' }}>
                Order Summary
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1" sx={{ color: '#6b7280' }}>
                    Total Items:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {cart.totalItems}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1" sx={{ color: '#6b7280' }}>
                    Subtotal:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {formatCurrency(cart.totalPrice)}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1" sx={{ color: '#6b7280' }}>
                    Platform Fee (5%):
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {formatCurrency(cart.platformFee)}
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827' }}>
                  Grand Total:
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#0387D9' }}>
                  {formatCurrency(cart.grandTotal)}
                </Typography>
              </Box>

              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={<PaymentIcon />}
                onClick={() => setShowCheckoutDialog(true)}
                disabled={cart.supplierGroups.length === 0}
                sx={{
                  backgroundColor: '#0387D9',
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#0277bd',
                  }
                }}
              >
                Proceed to Checkout
              </Button>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>

      {/* Checkout Dialog */}
      <CheckoutDialog
        open={showCheckoutDialog}
        onClose={() => setShowCheckoutDialog(false)}
        cart={cart}
        onCheckout={handleCheckout}
        loading={checkoutLoading}
        checkoutData={checkoutData}
        setCheckoutData={setCheckoutData}
      />

      {/* Clear Cart Confirmation Dialog */}
      <Dialog
        open={showClearCartDialog}
        onClose={() => setShowClearCartDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)',
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ClearIcon sx={{ color: '#ef4444', fontSize: 28 }} />
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#111827' }}>
              Clear Shopping Cart
            </Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" sx={{ color: '#374151', mb: 2 }}>
              Are you sure you want to clear your entire shopping cart? This action cannot be undone.
            </Typography>
            
            <Box sx={{ 
              backgroundColor: '#fef3f2', 
              border: '1px solid #fecaca', 
              borderRadius: 2, 
              p: 2,
              mb: 2 
            }}>
              <Typography variant="body2" sx={{ color: '#dc2626', fontWeight: 500 }}>
                ⚠️ This will remove all {cart?.totalItems || 0} items from your cart
              </Typography>
            </Box>
            
            <Typography variant="body2" sx={{ color: '#6b7280' }}>
              If you're not ready to place an order, you can also save items for later by keeping them in your cart.
            </Typography>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() => setShowClearCartDialog(false)}
            disabled={clearCartLoading}
            sx={{ color: '#6b7280' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleClearCart}
            loading={clearCartLoading}
            disabled={clearCartLoading}
            startIcon={clearCartLoading ? <CircularProgress size={20} /> : <ClearIcon />}
            sx={{
              backgroundColor: '#ef4444',
              '&:hover': {
                backgroundColor: '#dc2626',
              },
              '&:disabled': {
                backgroundColor: '#fca5a5',
              }
            }}
          >
            {clearCartLoading ? 'Clearing...' : 'Clear Cart'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CartPage; 