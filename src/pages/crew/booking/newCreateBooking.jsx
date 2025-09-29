import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  Button,
  Chip,
  Skeleton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Alert,
  InputAdornment,
  Rating,
  Paper,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Search,
  FilterList,
  LocationOn,
  Business,
  ArrowForward,
  Close,
} from '@mui/icons-material';
import { fetchServicesForCrew } from '../../../services/crew/crewBookingService';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Pagination } from "../../../components/pagination";
import { ServiceCategories } from '../../../constants/ServiceCategories';

// Debounce hook for search functionality
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Service Card Component
const ServiceCard = ({ service, onBookNow }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const handleBookNow = () => {
    onBookNow(service);
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.shadows[8],
        },
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <Box sx={{ position: 'relative', height: 200 }}>
        {imageLoading && (
          <Skeleton
            variant="rectangular"
            width="100%"
            height="100%"
            sx={{ position: 'absolute', top: 0, left: 0 }}
          />
        )}
        {!imageError && (
          <CardMedia
            component="img"
            height="200"
            image={service.image || '/placeholder-service.jpg'}
            alt={service.name}
            onLoad={handleImageLoad}
            onError={handleImageError}
            sx={{
              display: imageLoading ? 'none' : 'block',
              objectFit: 'cover',
            }}
          />
        )}
        {imageError && (
          <Box
            sx={{
              height: '100%',
              bgcolor: 'grey.200',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            <Business sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
            <Typography variant="caption" color="text.secondary">
              Service Image
            </Typography>
          </Box>
        )}

        {/* <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
          <IconButton
            size="small"
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 1)' }
            }}
          >
            <FavoriteBorder fontSize="small" />
          </IconButton>
        </Box> */}
        {!!service.category && (
          <Chip
            label={service.category}
            size="small"
            sx={{
              position: 'absolute',
              bottom: 12,
              left: 12,
              bgcolor: 'primary.main',
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: 500,
            }}
          />
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Typography
          variant="h6"
          component="h3"
          sx={{
            mb: 1,
            fontWeight: 600,
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {service.name}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            minHeight: '4.5em',
          }}
        >
          {service.description || 'Professional service provided by experienced crew members.'}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <Business sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              {service.vendor?.businessName || 'Service Provider'}
            </Typography>
          </Box>
          <Rating
            value={service.vendor?.customerSatisfaction?.averageScore || 0}
            size="small"
            readOnly
            precision={0.5}
          />
          <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
            ({service.vendor?.customerSatisfaction?.totalRatings || 0})
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LocationOn sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {service.vendor?.address?.city || 'Location'}, {service.vendor?.address?.country || 'Country'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h5" color="primary.main" sx={{ fontWeight: 700 }}>
              ${service.price}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              per service
            </Typography>
          </Box>
          <Chip
            label={service.vendor?.bookingMethod || 'Booking Required'}
            size="small"
            variant="outlined"
            color={service.vendor?.bookingMethod === 'instant booking' ? 'success' : 'default'}
          />
        </Box>

        <Button
          variant="contained"
          fullWidth
          onClick={handleBookNow}
          sx={{
            mt: 'auto',
            py: 1.5,
            fontWeight: 600,
            textTransform: 'none',
            borderRadius: 2,
          }}
        >
          Book Now
          <ArrowForward sx={{ ml: 1, fontSize: 18 }} />
        </Button>
      </CardContent>
    </Card>
  );
};

// Skeleton Loading Component
const ServiceCardSkeleton = () => (
  <Card sx={{ height: '100%', borderRadius: 2 }}>
    <Skeleton variant="rectangular" height={200} />
    <Box sx={{ p: 3 }}>
      <Skeleton variant="text" width="80%" height={32} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />
      <Skeleton variant="text" width="90%" height={16} sx={{ mb: 0.5 }} />
      <Skeleton variant="text" width="70%" height={16} sx={{ mb: 0.5 }} />
      <Skeleton variant="text" width="85%" height={16} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" height={36} width="100%" />
    </Box>
  </Card>
);

const NewCreateBooking = () => {
  const outletContext = useOutletContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const navigate = useNavigate();

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('random');
  const [currentPage, setCurrentPage] = useState(1);

  // Debounced search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Component state
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalServices: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: isMobile ? 10 : 12
  });

  // Use ref to store current limit for fetchServices callback
  const currentLimitRef = useRef(pagination.limit);
  currentLimitRef.current = pagination.limit;

  // Available categories for filter
  const [availableCategories] = useState(ServiceCategories);

  // Filter state
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Fetch services function
  const fetchServices = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const fetchQuery = {
        page: params.page || currentPage,
        limit: currentLimitRef.current,
        sortBy,
        search: debouncedSearchTerm || null,
        category: selectedCategory !== 'all' ? selectedCategory : null,
        minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
        maxPrice: priceRange[1] < 1000 ? priceRange[1] : undefined,
      };

      const response = await fetchServicesForCrew(fetchQuery);

      if (response.success) {
        setServices(response.data.services || []);
        setPagination(prevPagination => ({
          ...prevPagination,
          ...response.data.pagination
        }));
      } else {
        setServices([]);
        setError(response.message || "Failed to fetch services.");
      }
    } catch (error) {
      setError(error.message || "Failed to fetch services.");
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, sortBy, debouncedSearchTerm, selectedCategory, priceRange]);

  // Handle booking action
  const handleBookNow = useCallback((service) => {
    navigate("/crew/booking/confirm-booking", { state: { service } });
  }, [navigate]);

  // Handle search change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Handle category change
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Handle price range change
  const handlePriceRangeChange = (event, newValue) => {
    setPriceRange(newValue);
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Handle sort change
  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setCurrentPage(1); // Reset to first page on sort change
  };


  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setPriceRange([0, 1000]);
    setSortBy('random');
    setCurrentPage(1);
  };

  // Filter count for display
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchTerm) count++;
    if (selectedCategory !== 'all') count++;
    if (priceRange[0] > 0 || priceRange[1] < 1000) count++;
    if (sortBy !== 'random') count++;
    return count;
  }, [searchTerm, selectedCategory, priceRange, sortBy]);

  // Effect to fetch services when dependencies change
  useEffect(() => {
    fetchServices();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchServices, currentPage, sortBy, debouncedSearchTerm, selectedCategory, priceRange]);

  // Set page title
  useEffect(() => {
    if (outletContext && outletContext.setPageTitle) {
      outletContext.setPageTitle("New Booking");
    }
  }, [outletContext]);

  return (
    <Box sx={{ py: 4, px: {xs: 0, md: 4} }}>
      {/* Header Section */}
      <Box sx={{ mb: 2, textAlign: 'left' }}>
        <Typography variant="h6" component="h1" sx={{ fontWeight: 600, mb: 1 }}>
          Find Your Perfect Service
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{}}>
          Discover professional crew services from verified providers worldwide
        </Typography>
      </Box>

      {/* Search and Filters Section */}
      <Paper elevation={0} sx={{ p: 2, mb: 2, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
        <Grid container spacing={3} alignItems="center">
          {/* Search Bar */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search services..."
              value={searchTerm}
              onChange={handleSearchChange}
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  backgroundColor: "#F9FAFB",
                  "& fieldset": {
                    borderColor: "#E5E7EB",
                  },
                  "&:hover fieldset": {
                    borderColor: "#D1D5DB",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#0387D9",
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                },
              }}
            />
          </Grid>

          {/* Category Filter */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  backgroundColor: "#F9FAFB",
                  "& fieldset": {
                    borderColor: "#E5E7EB",
                  },
                  "&:hover fieldset": {
                    borderColor: "#D1D5DB",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#0387D9",
                  },
                },
              }}
            >
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                label="Category"
                onChange={handleCategoryChange}
                size="small"
              >
                <MenuItem value="all">All Categories</MenuItem>
                {availableCategories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Sort Options */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  backgroundColor: "#F9FAFB",
                  "& fieldset": {
                    borderColor: "#E5E7EB",
                  },
                  "&:hover fieldset": {
                    borderColor: "#D1D5DB",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#0387D9",
                  },
                },
              }}
            >
              <InputLabel>Sort by</InputLabel>
              <Select
                value={sortBy}
                label="Sort by"
                onChange={handleSortChange}
                size="small"
              >
                <MenuItem value="random">Featured</MenuItem>
                <MenuItem value="name">Name A-Z</MenuItem>
                <MenuItem value="price_asc">Price: Low to High</MenuItem>
                <MenuItem value="price_desc">Price: High to Low</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Filter Toggle Button */}
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant={filtersOpen ? "contained" : "outlined"}
              onClick={() => setFiltersOpen(!filtersOpen)}
              startIcon={<FilterList />}
              size="small"
              sx={{
                borderRadius: "10px",
                height: 40,
                position: 'relative',
                backgroundColor: filtersOpen ? "primary.main" : "#F9FAFB",
                borderColor: filtersOpen ? "primary.main" : "#E5E7EB",
                color: filtersOpen ? "white" : "primary.main",
              }}
            >
              Filters
              {activeFilterCount > 0 && (
                <Chip
                  label={activeFilterCount}
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    height: 20,
                    width: 20,
                    fontSize: '0.75rem',
                  }}
                />
              )}
            </Button>
          </Grid>
        </Grid>

        {/* Advanced Filters */}
        {filtersOpen && (
          <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', color: 'primary.main' }}>
              <FilterList sx={{ mr: 1 }} />
              Advanced Filters
            </Typography>

            <Grid container spacing={4}>
              {/* Price Range */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Price Range: ${priceRange[0]} - ${priceRange[1]}
                </Typography>
                <Slider
                  value={priceRange}
                  onChange={handlePriceRangeChange}
                  valueLabelDisplay="auto"
                  min={0}
                  max={1000}
                  step={25}
                  marks={[
                    { value: 0, label: '$0' },
                    { value: 500, label: '$500' },
                    { value: 1000, label: '$1000+' },
                  ]}
                />
              </Grid>

              {/* Clear Filters */}
              <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <Button
                  onClick={clearFilters}
                  startIcon={<Close />}
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                  }}
                >
                  Clear All Filters
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Results Summary */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          {loading ? (
            <Skeleton width={200} />
          ) : (
            `${pagination.totalServices || 0} Services Found`
          )}
        </Typography>
        {activeFilterCount > 0 && (
          <Typography variant="body2" color="text.secondary">
            {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} applied
          </Typography>
        )}
      </Box>

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <Grid container spacing={3}>
          {Array.from({ length: 9 }).map((_, index) => (
            <Grid item key={index} xs={12} sm={6} lg={4} xl={3}>
              <ServiceCardSkeleton />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Empty State */}
      {!loading && services.length === 0 && !error && (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            px: 2,
          }}
        >
          <Search sx={{ fontSize: 80, color: 'text.disabled', mb: 3 }} />
          <Typography variant="h5" sx={{ mb: 2 }}>
            No services found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
            We couldn't find any services matching your criteria. Try adjusting your search terms or filters.
          </Typography>
          <Button
            variant="contained"
            onClick={clearFilters}
            sx={{ borderRadius: 2, px: 4 }}
          >
            Clear All Filters
          </Button>
        </Box>
      )}

      {/* Services Grid */}
      {!loading && services.length > 0 && (
        <Grid container spacing={3}>
          {services.map((service) => (
            <Grid item key={service._id} xs={12} sm={6} lg={4} xl={3}>
              <ServiceCard service={service} onBookNow={handleBookNow} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination */}
      {!loading && services.length > 0 && pagination.totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 2 }}>
          <Pagination
            currentPage={currentPage}
            itemsPerPage={pagination.limit}
            onPageChange={(newPage) => {
              setCurrentPage(newPage);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalServices}
            isMobile={isMobile}
            isTablet={isTablet}
          />
        </Box>
      )}
    </Box>
  );
};

export default NewCreateBooking;
