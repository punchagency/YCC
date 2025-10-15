import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
  Box,
  Typography,
} from "@mui/material";
import {
  Close as CloseIcon,
  ShoppingCart as ShoppingCartIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../../../../services/crew/cartService";
import {
  searchProducts,
  getProductCategories,
} from "../../../../services/order/orderService";
import { useCart } from "../../../../context/cart/cartContext";
import { useToast } from "../../../../context/toast/toastContext";
import SearchInterface from "./SearchInterface";

const CreateOrderModal = ({ open, onClose, searchQuery, setSearchQuery }) => {
  const navigate = useNavigate();
  const { addToCart: addToCartContext } = useCart();
  const { toast } = useToast();

  // Search states
  // const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchLoading, setSearchLoading] = useState(false);

  // Pagination states
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  // Add to cart states
  const [addToCartLoadingId, setAddToCartLoadingId] = useState(null);

  // Fetch categories on modal open
  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open]);

  // Cleanup function to cancel pending requests
  useEffect(() => {
    return () => {
      if (currentSearchRef.current) {
        currentSearchRef.current.cancelled = true;
      }
    };
  }, []);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await getProductCategories();
      if (response.status) {
        setCategories(response.data);
      }
    } catch (error) {
      showNotification("Failed to load categories", "error");
    }
  };

  // Ref to track current search request
  const currentSearchRef = useRef(null);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query, category, page = 1) => {
      // Cancel previous request if exists
      if (currentSearchRef.current) {
        currentSearchRef.current.cancelled = true;
      }

      // Create new search request tracker
      const searchRequest = { cancelled: false };
      currentSearchRef.current = searchRequest;

      try {
        setSearchLoading(true);
        const response = await searchProducts({
          query: query.trim(),
          category: category === "all" ? undefined : category,
          page,
          limit: pagination.limit,
        });

        // Check if this request was cancelled
        if (searchRequest.cancelled) {
          return;
        }

        if (response.status) {
          setSearchResults(response.data.products);
          setPagination((prev) => ({
            ...prev,
            page: response.data.pagination.currentPage,
            total: response.data.pagination.totalItems,
            totalPages: response.data.pagination.totalPages,
          }));
        } else {
          showNotification(response.message || "Search failed", "error");
        }
      } catch (error) {
        // Check if this request was cancelled
        if (searchRequest.cancelled) {
          return;
        }
        showNotification("Failed to search products", "error");
        setSearchResults([]);
      } finally {
        // Only update loading state if request wasn't cancelled
        if (!searchRequest.cancelled) {
          setSearchLoading(false);
        }
      }
    }, 300),
    [pagination.limit]
  );

  // Handle search
  const handleSearch = (query, category, page = 1) => {
    setSearchQuery(query);
    setSelectedCategory(category);
    
    // Clear previous results immediately when category changes to prevent mixing
    if (page === 1) {
      setSearchResults([]);
      setPagination(prev => ({
        ...prev,
        page: 1,
        total: 0,
        totalPages: 0,
      }));
    }
    
    debouncedSearch(query, category, page);
  };

  // Handle add to cart
  const handleAddToCart = async (product, quantity = 1) => {
    try {
      setAddToCartLoadingId(product.inventoryId);

      const response = await addToCart({
        inventoryId: product.inventoryId,
        productId: product.productId, // Now required!
        quantity,
      });

      if (response.status) {
        addToCartContext(quantity);
        showNotification("Product added to cart successfully", "success");
      } else {
        showNotification(response.message || "Failed to add to cart", "error");
      }
    } catch (error) {
      // Extract error message from server response if available
      let errorMessage = "Failed to add product to cart";
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showNotification(errorMessage, "error");
    } finally {
      setAddToCartLoadingId(null);
    }
  };

  // Handle view cart
  const handleViewCart = () => {
    onClose();
    navigate("/crew/cart");
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    handleSearch(searchQuery, selectedCategory, newPage);
  };

  // Show notification using toast with higher z-index to appear above modal
  const showNotification = (message, severity = "success") => {
    toast.current.show({
      severity: severity,
      summary: severity === "success" ? "Success" : "Error",
      detail: message,
      life: 3000,
      styleClass: "toast-above-modal", // Custom CSS class for higher z-index
      style: { zIndex: 1300 }, // Inline style as backup
    });
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
            maxHeight: "90vh",
          },
        }}
        sx={{
          // Reduce z-index to allow toast to appear above
          zIndex: 1200,
          '& .MuiBackdrop-root': {
            zIndex: 1200,
          },
          '& .MuiDialog-paper': {
            zIndex: 1201,
          }
        }}
      >
        <DialogTitle sx={{ p: 0 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: { xs: 2, md: 3 },
              borderBottom: "1px solid",
              borderColor: "divider",
              background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 2, md: 0 },
            }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: "text.primary",
                  mb: 0.5,
                  fontSize: { xs: "1.5rem", md: "1.875rem" },
                }}
              >
                Search Products
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  fontSize: { xs: "0.875rem", md: "1rem" },
                }}
              >
                Find and add products to your cart
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                width: { xs: "100%", md: "auto" },
                justifyContent: { xs: "space-between", md: "flex-end" },
              }}
            >
              <Button
                variant="outlined"
                startIcon={<ShoppingCartIcon />}
                onClick={handleViewCart}
                sx={{
                  borderColor: "#0387D9",
                  color: "#0387D9",
                  "&:hover": {
                    borderColor: "#0277bd",
                    backgroundColor: "rgba(3, 135, 217, 0.04)",
                  },
                }}
              >
                View Cart
              </Button>
              <IconButton
                onClick={onClose}
                sx={{
                  color: "text.secondary",
                  "&:hover": {
                    backgroundColor: "rgba(107, 114, 128, 0.04)",
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: { xs: 1, md: 0 } }}>
          <SearchInterface
            searchQuery={searchQuery}
            searchResults={searchResults}
            categories={categories}
            selectedCategory={selectedCategory}
            loading={false}
            searchLoading={searchLoading}
            pagination={pagination}
            onSearch={handleSearch}
            onAddToCart={handleAddToCart}
            onPageChange={handlePageChange}
            addToCartLoadingId={addToCartLoadingId}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateOrderModal;
