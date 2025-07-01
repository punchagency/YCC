import React from 'react';
import { Card, CardContent, Box } from '@mui/material';

const ProductCardSkeleton = () => {
  return (
    <Card
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden',
        background: 'background.paper',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Image placeholder skeleton */}
      <Box
        sx={{
          height: 120,
          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
          '@keyframes shimmer': {
            '0%': {
              backgroundPosition: '200% 0',
            },
            '100%': {
              backgroundPosition: '-200% 0',
            },
          },
        }}
      />
      
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
        {/* Product name skeleton */}
        <Box
          sx={{
            height: 24,
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            borderRadius: 1,
            mb: 1,
            width: '100%',
          }}
        />
        
        {/* Category skeleton */}
        <Box
          sx={{
            height: 20,
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            borderRadius: 1,
            mb: 2,
            width: '60%',
          }}
        />
        
        {/* Description skeleton */}
        <Box
          sx={{
            height: 16,
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            borderRadius: 1,
            mb: 1,
            width: '100%',
          }}
        />
        <Box
          sx={{
            height: 16,
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            borderRadius: 1,
            mb: 2,
            width: '80%',
          }}
        />
        
        {/* Supplier info skeleton */}
        <Box
          sx={{
            height: 16,
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            borderRadius: 1,
            mb: 1,
            width: '70%',
          }}
        />
        <Box
          sx={{
            height: 14,
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            borderRadius: 1,
            mb: 2,
            width: '50%',
          }}
        />
        
        {/* Price skeleton */}
        <Box
          sx={{
            height: 28,
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            borderRadius: 1,
            mb: 1,
            width: '40%',
          }}
        />
        
        {/* Quantity controls skeleton */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            mb: 2,
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
            }}
          />
          <Box
            sx={{
              width: 20,
              height: 20,
              background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
              borderRadius: 1,
            }}
          />
          <Box
            sx={{
              width: 32,
              height: 32,
              background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
            }}
          />
        </Box>
        
        {/* Button skeleton */}
        <Box
          sx={{
            height: 40,
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            borderRadius: 2,
            width: '100%',
          }}
        />
      </CardContent>
    </Card>
  );
};

export default ProductCardSkeleton; 