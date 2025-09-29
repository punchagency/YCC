import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Stack,
  Chip,
  useTheme,
  Tooltip
} from '@mui/material';
import { LocationOn, Email } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { getCategoryIcon } from './section4-resource-center';

// Constants
const CARD_HEIGHT = 400;
const GRADIENT_COLORS = {
  primary: 'linear-gradient(90deg, #0487D9 0%, #034D92 100%)',
  hover: 'linear-gradient(90deg, #034D92 0%, #0487D9 100%)'
};

// State for image error handling
const useImageError = () => {
  const [imageError, setImageError] = React.useState(false);

  const handleImageError = React.useCallback(() => {
    setImageError(true);
  }, []);

  const handleImageLoad = React.useCallback(() => {
    setImageError(false);
  }, []);

  const resetImageError = React.useCallback(() => {
    setImageError(false);
  }, []);

  return {
    imageError,
    handleImageError,
    handleImageLoad,
    resetImageError
  };
};

// Custom hook for navigation logic
const useServiceNavigation = (type) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleAction = useCallback((service) => {
    const token = localStorage.getItem('token');

    if ((!isAuthenticated || !token) && type === 'service') {
        navigate(`/service-checkout/${service._id}`, {
        state: { service }
        });
      return;
    } else if ((!isAuthenticated || !token) && type === 'product') {
        navigate(`/product-checkout/${service._id}`, {
        state: { product: service }
        });
      return;
    }

    // Navigate based on type
    if (type === 'service') {
      navigate("/crew/booking/confirm-booking", {
        state: { service }
      });
    } else {
      navigate("/crew/orders-management", {
        state: { service }
      });
    }
  }, [navigate, isAuthenticated, type]);

  return { handleAction };
};

// Helper function to get display categories
const getDisplayCategories = (service) => {
  if (Array.isArray(service?.categories)) {
    return service.categories;
  }
  if (service?.categories) {
    return [service.categories];
  }
  if (service?.category) {
    return [typeof service.category === 'string' ? service.category : service.category[0]];
  }
  return [];
};

// Helper function to get contact info
const getContactInfo = (service) => {
  return {
    location: service.supplier?.location || service.location || 'Location not specified',
    email: service.supplier?.email || service.email || service.vendor?.email || 'Email not specified'
  };
};

const ServiceCard = React.memo(({ service, type }) => {
  const theme = useTheme();
  const { imageError, handleImageError, handleImageLoad, resetImageError } = useImageError();
  const { handleAction } = useServiceNavigation(type);

  const displayCategories = useMemo(() => getDisplayCategories(service), [service]);
  const contactInfo = useMemo(() => getContactInfo(service), [service]);

  // Reset image error when service changes
  React.useEffect(() => {
    resetImageError();
  }, [service?.image, resetImageError]);

  const handleCardClick = useCallback(() => {
    handleAction(service);
  }, [handleAction, service]);

  const handleKeyPress = useCallback((event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCardClick();
    }
  }, [handleCardClick]);

  if (!service) {
    return null;
  }

  return (
    <Tooltip title={`Click to ${type === 'service' ? 'request quote for' : 'order'} ${service.name}`} placement="top">
    <Card
        component="article"
        role="button"
        tabIndex={0}
      className="service-card-hover"
        onClick={handleCardClick}
        onKeyDown={handleKeyPress}
        aria-label={`${type === 'service' ? 'Service' : 'Product'} card for ${service.name}`}
      sx={{
          borderRadius: theme.spacing(2),
          boxShadow: theme.shadows[1],
          backgroundColor: theme.palette.grey[50],
          height: CARD_HEIGHT,
        display: 'flex',
        flexDirection: 'column',
          transition: theme.transitions.create(['box-shadow', 'transform'], {
            duration: theme.transitions.duration.short,
          }),
          cursor: 'pointer',
          '&:hover': {
            boxShadow: theme.shadows[4],
            transform: 'translateY(-2px)',
          },
          '&:focus': {
            outline: `2px solid ${theme.palette.primary.main}`,
            outlineOffset: 2,
          },
          position: 'relative',
        }}
      >
        {/* Image Section */}
        <Box sx={{ position: 'relative', height: 200, overflow: 'hidden' }}>
          {!imageError ? (
            <CardMedia
              key={service._id}
              component="img"
              src={service.image || '/placeholder-service.jpg'}
              alt={`${service.name} - ${type} image`}
              loading="lazy"
              onError={handleImageError}
              onLoad={handleImageLoad}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: theme.transitions.create('opacity'),
              }}
            />
          ) : (
        <Box
          sx={{
            width: '100%',
            height: '100%',
                bgcolor: theme.palette.grey[100],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
                color: theme.palette.text.secondary,
          }}
              role="img"
              aria-label={`${type} placeholder image`}
        >
              <Box sx={{ fontSize: 48, mb: 1 }}>
                {getCategoryIcon(displayCategories[0] || '')}
              </Box>
          <Typography variant="caption" color="text.secondary">
            {type === 'service' ? 'Service Image' : 'Product Image'}
          </Typography>
        </Box>
      )}
        </Box>

      <CardContent
        sx={{
            p: theme.spacing(2),
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
            gap: theme.spacing(1),
          }}
        >
          {/* Header Section */}
          <Box>
            <Typography
              variant="h6"
              component="h3"
              sx={{
                fontWeight: 600,
                fontSize: '1.25rem',
                color: theme.palette.common.black,
                textTransform: 'capitalize',
                mb: 1,
                lineHeight: 1.2,
              }}
            >
              {service.name}
            </Typography>

            {/* Categories */}
            {displayCategories.length > 0 && (
              <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                {displayCategories.map((category, index) => (
                  <Chip
                    key={index}
                    label={category}
                    size="small"
                    sx={{
                      bgcolor: theme.palette.primary.light + '1A',
                      color: theme.palette.primary.main,
                      fontWeight: 500,
                      fontSize: '0.875rem',
                      height: 'auto',
                      py: 0.5,
                      '& .MuiChip-label': {
                        px: 1.5,
                      },
                    }}
                  />
                ))}
            </Stack>
            )}
          </Box>

          {/* Description */}
        <Typography
            component="p"
          sx={{
              color: theme.palette.text.primary,
              fontSize: '1rem',
              lineHeight: 1.4,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
              flex: 1,
          }}
        >
          {service.description}
        </Typography>

          {/* Contact Information */}
          <Stack spacing={1.5}>
          <Stack direction="row" alignItems="center" spacing={1}>
              <LocationOn
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: '1.25rem',
                  flexShrink: 0
                }}
                aria-hidden="true"
              />
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: '1rem',
                  fontWeight: 500,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                title={contactInfo.location}
              >
                {contactInfo.location}
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
              <Email
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: '1.25rem',
                  flexShrink: 0
                }}
                aria-hidden="true"
              />
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: '1rem',
                  fontWeight: 500,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                title={contactInfo.email}
              >
                {contactInfo.email}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>

        {/* Action Button */}
        <CardActions
          sx={{
            p: theme.spacing(2),
            pt: 0,
            mt: 'auto',
            justifyContent: 'stretch',
          }}
        >
        <Button
          fullWidth
          variant="contained"
            size="large"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
          sx={{
              background: GRADIENT_COLORS.primary,
              color: theme.palette.common.white,
            fontWeight: 600,
              borderRadius: theme.spacing(1.5),
            textTransform: 'none',
              fontSize: '1rem',
              py: 1.5,
              boxShadow: 'none',
              transition: theme.transitions.create(['background-color', 'transform']),
              '&:hover': {
                background: GRADIENT_COLORS.hover,
                boxShadow: theme.shadows[2],
                transform: 'translateY(-1px)',
              },
              '&:focus': {
                boxShadow: theme.shadows[2],
              },
            }}
            aria-label={`${type === 'service' ? 'Request quote for' : 'Order'} ${service.name}`}
        >
          {type === 'service' ? 'Request Quote' : 'Order Now'}
        </Button>
      </CardActions>
    </Card>
    </Tooltip>
  );
});

// PropTypes validation
ServiceCard.propTypes = {
  service: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string,
    categories: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string)
    ]),
    category: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string)
    ]),
    location: PropTypes.string,
    email: PropTypes.string,
    supplier: PropTypes.shape({
      location: PropTypes.string,
      email: PropTypes.string,
    }),
    vendor: PropTypes.shape({
      email: PropTypes.string,
    }),
  }).isRequired,
  type: PropTypes.oneOf(['service', 'product']).isRequired,
};

// Display name for debugging
ServiceCard.displayName = 'ServiceCard';

// Error Boundary Component
class ServiceCardErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ServiceCard Error:', error, errorInfo);
    // Here you could send error to logging service
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card
          sx={{
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
            bgcolor: 'error.light',
            color: 'error.contrastText',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Something went wrong with this service card
          </Typography>
          <Typography variant="body2">
            Please try refreshing the page or contact support if the problem persists.
          </Typography>
          {process.env.NODE_ENV === 'development' && (
            <Typography variant="caption" sx={{ mt: 2, display: 'block' }}>
              {this.state.error?.message}
            </Typography>
          )}
        </Card>
      );
    }

    return this.props.children;
  }
}

ServiceCardErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

// Higher-order component that wraps ServiceCard with error boundary
const ServiceCardWithErrorBoundary = ({ service, type }) => (
  <ServiceCardErrorBoundary>
    <ServiceCard service={service} type={type} />
  </ServiceCardErrorBoundary>
);

ServiceCardWithErrorBoundary.propTypes = {
  service: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string,
    categories: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string)
    ]),
    category: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string)
    ]),
    location: PropTypes.string,
    email: PropTypes.string,
    supplier: PropTypes.shape({
      location: PropTypes.string,
      email: PropTypes.string,
    }),
    vendor: PropTypes.shape({
      email: PropTypes.string,
    }),
  }).isRequired,
  type: PropTypes.oneOf(['service', 'product']).isRequired,
};

ServiceCardWithErrorBoundary.displayName = 'ServiceCardWithErrorBoundary';

export default ServiceCardWithErrorBoundary; 