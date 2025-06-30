import React, { useState, useEffect, useCallback } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  IconButton, 
  Button,
  Snackbar,
  Alert,
  Box,
  Typography
} from '@mui/material';
import { Close as CloseIcon, ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { searchProducts, addToCart, getProductCategories } from '../../../../services/crew/cartService';
import SearchInterface from './SearchInterface';

const CreateOrderModal = ({ open, onClose, onOrderCreated }) => {
  const navigate = useNavigate();
  
  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  
  // Pagination states
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  // Notification states
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch categories on modal open
  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open]);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await getProductCategories();
      if (response.status) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      showNotification('Failed to load categories', 'error');
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query, category, page = 1) => {
      if (!query.trim() && category === 'all') {
        setSearchResults([]);
        setPagination(prev => ({ ...prev, page: 1, total: 0, totalPages: 0 }));
        return;
      }

      try {
        setSearchLoading(true);
        const response = await searchProducts({
          query: query.trim(),
          category: category === 'all' ? undefined : category,
          page,
          limit: pagination.limit,
        });

        if (response.status) {
          setSearchResults(response.data.products);
          setPagination(prev => ({
            ...prev,
            page: response.data.pagination.currentPage,
            total: response.data.pagination.totalItems,
            totalPages: response.data.pagination.totalPages,
          }));
        } else {
          showNotification(response.message || 'Search failed', 'error');
        }
      } catch (error) {
        console.error('Search error:', error);
        showNotification('Failed to search products', 'error');
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300),
    [pagination.limit]
  );

  // Handle search
  const handleSearch = (query, category, page = 1) => {
    setSearchQuery(query);
    setSelectedCategory(category);
    debouncedSearch(query, category, page);
  };

  // Handle add to cart
  const handleAddToCart = async (product, quantity = 1) => {
    try {
      setLoading(true);
      const response = await addToCart({
        inventoryId: product.inventoryId,
        quantity,
      });

      if (response.status) {
        showNotification('Product added to cart successfully', 'success');
        // You can emit an event to update cart badge in header
        if (window.updateCartBadge) {
          window.updateCartBadge();
        }
      } else {
        showNotification(response.message || 'Failed to add to cart', 'error');
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      showNotification('Failed to add product to cart', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle view cart
  const handleViewCart = () => {
    onClose();
    navigate('/crew/cart');
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    handleSearch(searchQuery, selectedCategory, newPage);
  };

  // Show notification
  const showNotification = (message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  // Close notification
  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  // Debounce utility function
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle sx={{ p: 0 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: { xs: 2, md: 3 },
              borderBottom: '1px solid',
              borderColor: 'divider',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              flexDirection: { xs: 'column', md: 'row' },
              gap: { xs: 2, md: 0 }
            }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                  mb: 0.5,
                  fontSize: { xs: '1.5rem', md: '1.875rem' }
                }}
              >
                Search Products
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  fontSize: { xs: '0.875rem', md: '1rem' }
                }}
              >
                Find and add products to your cart
              </Typography>
            </Box>
            
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                width: { xs: '100%', md: 'auto' },
                justifyContent: { xs: 'space-between', md: 'flex-end' }
              }}
            >
              <Button
                variant="outlined"
                startIcon={<ShoppingCartIcon />}
                onClick={handleViewCart}
                sx={{
                  borderColor: '#0387D9',
                  color: '#0387D9',
                  '&:hover': {
                    borderColor: '#0277bd',
                    backgroundColor: 'rgba(3, 135, 217, 0.04)'
                  }
                }}
              >
                View Cart
              </Button>
              <IconButton
                onClick={onClose}
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    backgroundColor: 'rgba(107, 114, 128, 0.04)'
                  }
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ p: 0 }}>
          <SearchInterface
            searchQuery={searchQuery}
            searchResults={searchResults}
            categories={categories}
            selectedCategory={selectedCategory}
            loading={loading}
            searchLoading={searchLoading}
            pagination={pagination}
            onSearch={handleSearch}
            onAddToCart={handleAddToCart}
            onPageChange={handlePageChange}
          />
        </DialogContent>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CreateOrderModal; 