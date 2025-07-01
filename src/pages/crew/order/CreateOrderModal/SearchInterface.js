import React, { useState } from 'react';
import { 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Button, 
  Box, 
  Typography,
  useMediaQuery,
  useTheme,
  Grid
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { Pagination } from '../../../../components/pagination';
import ProductCard from './ProductCard';
import ProductCardSkeleton from '../../../../components/ProductCardSkeleton';

const SearchInterface = ({
  searchQuery,
  searchResults,
  categories,
  selectedCategory,
  loading,
  searchLoading,
  pagination,
  onSearch,
  onAddToCart,
  onPageChange,
  addToCartLoadingId,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // Handle search input change
  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setLocalSearchQuery(query);
    onSearch(query, selectedCategory, 1);
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    const category = e.target.value;
    onSearch(localSearchQuery, category, 1);
  };

  // Handle clear search
  const handleClearSearch = () => {
    setLocalSearchQuery('');
    onSearch('', 'all', 1);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    onPageChange(newPage);
  };

  // Category options for dropdown
  const categoryOptions = [
    { label: 'All Categories', value: 'all' },
    ...categories.map(cat => ({
      label: cat.label,
      value: cat.value
    }))
  ];

  // Loading skeleton for products
  const renderLoadingSkeleton = () => (
    <Grid container spacing={3}>
      {Array.from({ length: 8 }).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <ProductCardSkeleton />
        </Grid>
      ))}
    </Grid>
  );

  // Empty state
  const renderEmptyState = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 3,
        textAlign: 'center',
        minHeight: 300
      }}
    >
      <Box
        sx={{
          mb: 2,
          p: 3,
          backgroundColor: 'grey.50',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <SearchIcon sx={{ fontSize: 48, color: 'grey.400' }} />
      </Box>
      <Typography variant="h6" sx={{ mb: 1, color: 'text.primary' }}>
        No products found
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 400 }}>
        {localSearchQuery 
          ? `No products matching "${localSearchQuery}" found. Try adjusting your search terms.`
          : 'Start typing to search for products or select a category to browse.'
        }
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, minHeight: 400 }}>
      {/* Search and Filter Section */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mb: 3,
          flexDirection: { xs: 'column', lg: 'row' },
          alignItems: { xs: 'stretch', lg: 'flex-end' }
        }}
      >
        <Box sx={{ flex: 1 }}>
          <TextField
            value={localSearchQuery}
            onChange={handleSearchInputChange}
            placeholder="Search products by name, description, or supplier..."
            variant="outlined"
            fullWidth
            disabled={loading}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
              endAdornment: localSearchQuery && (
                <Button
                  onClick={handleClearSearch}
                  disabled={loading}
                  sx={{ minWidth: 'auto', p: 0.5 }}
                >
                  <ClearIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                </Button>
              ),
              sx: {
                borderRadius: 2,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'divider',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                },
              }
            }}
          />
        </Box>

        <Box sx={{ minWidth: { xs: '100%', lg: 200 } }}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={handleCategoryChange}
              label="Category"
              disabled={loading}
              sx={{
                borderRadius: 2,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'divider',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                },
              }}
            >
              {categoryOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Search Results Section */}
      <Box>
        {/* Results Header */}
        {searchResults.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: 2,
              borderBottom: '1px solid',
              borderColor: 'divider',
              mb: 3
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {searchLoading ? 'Searching...' : `${pagination.total} products found`}
              </Typography>
              {localSearchQuery && (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  for "{localSearchQuery}"
                </Typography>
              )}
            </Box>
          </Box>
        )}

        {/* Products Grid */}
        <Box sx={{ minHeight: 200 }}>
          {searchLoading ? (
            renderLoadingSkeleton()
          ) : searchResults.length > 0 ? (
            <Grid container spacing={3}>
              {searchResults.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.inventoryId}>
                  <ProductCard
                    product={product}
                    onAddToCart={onAddToCart}
                    loading={addToCartLoadingId === product.inventoryId}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            renderEmptyState()
          )}
        </Box>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              py: 3,
              borderTop: '1px solid',
              borderColor: 'divider',
              mt: 3
            }}
          >
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              totalItems={pagination.total}
              itemsPerPage={pagination.limit}
              onPageChange={handlePageChange}
              isMobile={isMobile}
              isTablet={isTablet}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SearchInterface; 