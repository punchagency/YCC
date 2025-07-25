"use client"

import { useState } from "react"
import { Card, CardContent, Typography, Button, Box, Chip, IconButton, useMediaQuery, useTheme } from "@mui/material"
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Inventory as InventoryIcon,
  LocalShipping as ShippingIcon,
} from "@mui/icons-material"

const ProductCard = ({ product, onAddToCart, loading }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [quantity, setQuantity] = useState(1)

  // Handle quantity change
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.quantity) {
      setQuantity(newQuantity)
    }
  }

  // Handle add to cart
  const handleAddToCart = () => {
    onAddToCart(product, quantity)
    setQuantity(1) // Reset quantity after adding
  }

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  // Get stock status
  const getStockStatus = () => {
    if (product.quantity === 0) return { label: "Out of Stock", color: "error" }
    if (product.quantity <= 5) return { label: "Low Stock", color: "warning" }
    return { label: "In Stock", color: "success" }
  }

  const stockStatus = getStockStatus()

  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        overflow: "hidden",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        background: "linear-gradient(145deg, #ffffff 0%, #fafbfc 100%)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.12)",
          "& .product-image": {
            transform: "scale(1.08)",
          },
          "& .product-overlay": {
            opacity: 1,
          },
        },
      }}
    >
      {/* Stock Badge */}
      <Box
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          zIndex: 2,
        }}
      >
        <Chip
          label={stockStatus.label}
          size="small"
          color={stockStatus.color}
          sx={{
            fontWeight: 600,
            fontSize: "0.7rem",
            height: 24,
            backdropFilter: "blur(10px)",
            backgroundColor: `${stockStatus.color}.light`,
            color: `${stockStatus.color}.dark`,
            "& .MuiChip-label": {
              px: 1.5,
            },
          }}
        />
      </Box>

      {/* Product Image Section */}
      <Box
        sx={{
          height: { xs: 200, sm: 220, md: 240 },
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {product.imageUrl ? (
          <>
            <Box
              component="img"
              src={product.imageUrl}
              alt={product.name}
              className="product-image"
              sx={{
                height: "90%",
                width: "90%",
                objectFit: "cover",
                borderRadius: 2,
                transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              }}
            />
            {/* Overlay for premium feel */}
            <Box
              className="product-overlay"
              sx={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(45deg, rgba(25, 118, 210, 0.05) 0%, rgba(25, 118, 210, 0.02) 100%)",
                opacity: 0,
                transition: "opacity 0.3s ease",
              }}
            />
          </>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            <InventoryIcon sx={{ fontSize: 64, color: "text.secondary", opacity: 0.6 }} />
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              No Image
            </Typography>
          </Box>
        )}
      </Box>

      <CardContent
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          p: { xs: 1.5, sm: 2 },
          gap: 1,
        }}
      >
        {/* Product Name */}
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 700,
            color: "text.primary",
            fontSize: { xs: "1rem", sm: "1.1rem" },
            lineHeight: 1.2,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: { xs: "2.2rem", sm: "2.4rem" },
          }}
        >
          {product.name}
        </Typography>

        {/* Category Tags - More Compact */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, minHeight: 24 }}>
          {Array.isArray(product.category) ? (
            product.category.slice(0, 2).map((cat, index) => (
              <Chip
                key={index}
                label={cat}
                size="small"
                sx={{
                  backgroundColor: "primary.50",
                  color: "primary.700",
                  fontSize: "0.7rem",
                  fontWeight: 500,
                  height: 20,
                  "& .MuiChip-label": {
                    px: 1,
                  },
                }}
              />
            ))
          ) : (
            <Chip
              label={product.category}
              size="small"
              sx={{
                backgroundColor: "primary.50",
                color: "primary.700",
                fontSize: "0.7rem",
                fontWeight: 500,
                height: 20,
                "& .MuiChip-label": {
                  px: 1,
                },
              }}
            />
          )}
        </Box>

        {/* Supplier Info - Single Line */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            p: 1,
            backgroundColor: "grey.50",
            borderRadius: 1.5,
            border: "1px solid",
            borderColor: "grey.100",
          }}
        >
          <ShippingIcon sx={{ fontSize: 16, color: "primary.main" }} />
          <Typography
            variant="body2"
            sx={{
              color: "text.primary",
              fontWeight: 600,
              fontSize: "0.8rem",
              flex: 1,
            }}
          >
            {product.supplier.name}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontSize: "0.7rem",
            }}
          >
            Stock: {product.quantity}
          </Typography>
        </Box>

        {/* Price and Actions - Compact */}
        <Box sx={{ mt: "auto" }}>
          <Typography
            variant="h5"
            component="div"
            sx={{
              color: "primary.main",
              fontWeight: 800,
              fontSize: { xs: "1.2rem", sm: "1.3rem" },
              mb: 1.5,
              textAlign: "center",
            }}
          >
            {formatPrice(product.price)}
          </Typography>

          {/* Quantity Selector - More Compact */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              mb: 1.5,
              p: 0.5,
              backgroundColor: "grey.50",
              borderRadius: 1.5,
              border: "1px solid",
              borderColor: "grey.200",
            }}
          >
            <IconButton
              size="small"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1 || loading}
              sx={{
                backgroundColor: "white",
                border: "1px solid",
                borderColor: "grey.300",
                borderRadius: 1,
                width: 28,
                height: 28,
                "&:hover": {
                  backgroundColor: "primary.50",
                  borderColor: "primary.main",
                  transform: "scale(1.05)",
                },
                "&:disabled": {
                  opacity: 0.5,
                  transform: "none",
                },
                transition: "all 0.2s ease",
              }}
            >
              <RemoveIcon sx={{ fontSize: 14 }} />
            </IconButton>

            <Typography
              variant="h6"
              sx={{
                mx: 1.5,
                minWidth: 20,
                textAlign: "center",
                fontWeight: 700,
                color: "text.primary",
                fontSize: "1rem",
              }}
            >
              {quantity}
            </Typography>

            <IconButton
              size="small"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= product.quantity || loading}
              sx={{
                backgroundColor: "white",
                border: "1px solid",
                borderColor: "grey.300",
                borderRadius: 1,
                width: 28,
                height: 28,
                "&:hover": {
                  backgroundColor: "primary.50",
                  borderColor: "primary.main",
                  transform: "scale(1.05)",
                },
                "&:disabled": {
                  opacity: 0.5,
                  transform: "none",
                },
                transition: "all 0.2s ease",
              }}
            >
              <AddIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>

          {/* Add to Cart Button - Compact */}
          <Button
            variant="contained"
            onClick={handleAddToCart}
            disabled={loading || product.quantity === 0}
            startIcon={<AddIcon />}
            fullWidth
            sx={{
              background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
              color: "white",
              borderRadius: 2,
              py: 1.2,
              px: 3,
              fontWeight: 700,
              textTransform: "none",
              fontSize: "0.9rem",
              boxShadow: "0 4px 14px rgba(25, 118, 210, 0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 20px rgba(25, 118, 210, 0.4)",
              },
              "&:active": {
                transform: "translateY(0px)",
              },
              "&:disabled": {
                background: "linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%)",
                color: "grey.600",
                transform: "none",
                boxShadow: "none",
              },
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {loading ? "Adding..." : product.quantity === 0 ? "Out of Stock" : "Add to Cart"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}

export default ProductCard

