import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Inventory as InventoryIcon,
} from "@mui/icons-material";

const ProductCard = ({ product, onAddToCart, loading }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [quantity, setQuantity] = useState(1);

  // Handle quantity change
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.quantity) {
      setQuantity(newQuantity);
    }
  };

  // Handle add to cart
  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setQuantity(1); // Reset quantity after adding
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        overflow: "hidden",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        background: "background.paper",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        },
      }}
    >
      {/* Product Image Placeholder */}
      <Box
        sx={{
          height: 120,
          background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <InventoryIcon sx={{ fontSize: 48, color: "text.secondary" }} />
      </Box>

      <CardContent
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          p: 2,
        }}
      >
        {/* Product Name */}
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 600,
            color: "text.primary",
            mb: 1,
            fontSize: isMobile ? "1rem" : "1.125rem",
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {product.name}
        </Typography>

        {/* Category - handle both array and string formats */}
        {Array.isArray(product.category) ? (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 2 }}>
            {product.category.map((cat, index) => (
              <Chip
                key={index}
                label={cat}
                size="small"
                sx={{
                  backgroundColor: "grey.100",
                  color: "text.primary",
                  fontSize: "0.75rem",
                  "& .MuiChip-label": {
                    px: 1,
                  },
                }}
              />
            ))}
          </Box>
        ) : (
          <Chip
            label={product.category}
            size="small"
            sx={{
              backgroundColor: "grey.100",
              color: "text.primary",
              fontSize: "0.75rem",
              mb: 2,
              "& .MuiChip-label": {
                px: 1,
              },
            }}
          />
        )}

        {/* Description */}
        {product.description && (
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              mb: 2,
              fontSize: "0.875rem",
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {product.description}
          </Typography>
        )}

        {/* Supplier Info */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            sx={{
              color: "text.primary",
              fontWeight: 500,
              fontSize: "0.875rem",
            }}
          >
            {product.supplier.name}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontSize: "0.75rem",
            }}
          >
            Stock: {product.quantity}
          </Typography>
        </Box>

        {/* Price and Actions */}
        <Box sx={{ mt: "auto" }}>
          <Typography
            variant="h6"
            component="span"
            sx={{
              color: "primary.main",
              fontWeight: 700,
              fontSize: isMobile ? "1.125rem" : "1.25rem",
              display: "block",
              mb: 1,
            }}
          >
            {formatPrice(product.price)}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              mb: 2,
            }}
          >
            <IconButton
              size="small"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1 || loading}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                p: 0.5,
                "&:hover": {
                  backgroundColor: "grey.50",
                },
                "&:disabled": {
                  opacity: 0.5,
                },
              }}
            >
              <RemoveIcon sx={{ fontSize: 16 }} />
            </IconButton>

            <Typography
              variant="body1"
              sx={{
                mx: 1,
                minWidth: 20,
                textAlign: "center",
                fontWeight: 600,
                color: "text.primary",
              }}
            >
              {quantity}
            </Typography>

            <IconButton
              size="small"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= product.quantity || loading}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                p: 0.5,
                "&:hover": {
                  backgroundColor: "grey.50",
                },
                "&:disabled": {
                  opacity: 0.5,
                },
              }}
            >
              <AddIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>

          <Button
            variant="contained"
            onClick={handleAddToCart}
            disabled={loading || product.quantity === 0}
            startIcon={<AddIcon />}
            fullWidth
            sx={{
              backgroundColor: "primary.main",
              color: "white",
              borderRadius: 2,
              py: 1,
              px: 2,
              fontWeight: 600,
              textTransform: "none",
              fontSize: "0.875rem",
              "&:hover": {
                backgroundColor: "primary.dark",
                transform: "translateY(-1px)",
                boxShadow: theme.shadows[2],
              },
              "&:disabled": {
                backgroundColor: "grey.300",
                color: "grey.500",
                transform: "none",
                boxShadow: "none",
              },
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {loading
              ? "Adding..."
              : product.quantity === 0
              ? "Out of Stock"
              : "Add to Cart"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
