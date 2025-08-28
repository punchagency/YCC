import { Box, Typography, Card, CardContent, CardActions, Button, Stack, Avatar, Chip, useTheme, useMediaQuery } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
// import StarIcon from '@mui/icons-material/Star';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { getCategoryIcon } from './section4-resource-center';

const ServiceCard = ({ service }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleAction = () => {
    const token = localStorage.getItem('token');
    if (!isAuthenticated || !token) {
      navigate('/login', {
        state: {
          from: '/resource-center'  // Redirect back to resource center after login
        }
      });
      return;
    }
    // If already authenticated, go to crew dashboard
    navigate('/crew/dashboard');
  };

  if (!service) {
    return null;
  }

  return (
    <Card
      className="service-card-hover"
      sx={{
        borderRadius: 4,
        boxShadow: 0,
        background: '#f5f8fa',
        p: 2,
        height: '400px',
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 0.2s, transform 0.2s',
      }}
    >
      <CardContent
        sx={{
          p: 0,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          '&:last-child': { pb: 0 }
        }}
      >
        <Stack direction="row" alignItems="flex-start" spacing={2} mb={2}>
          <Avatar sx={{ width: isMobile ? 56 : 76, height: isMobile ? 56 : 76, bgcolor: '#e3f2fd' }}>
            {getCategoryIcon(service.category)}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, fontSize: "24px", color: "#131313", textTransform: 'capitalize' }}>
              {service.name}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {Array.isArray(service?.categories) ? (
                service.categories.map((cat, index) => (
                  <Chip
                    key={index}
                    label={cat}
                    size="small"
                    sx={{ bgcolor: '#0487D91A', color: '#0487D9', fontWeight: 500, fontSize: "16px", padding: "8px 12px" }}
                  />
                ))
              ) : service?.categories ? (
                <Chip
                  label={service.categories}
                  size="small"
                  sx={{ bgcolor: '#0487D91A', color: '#0487D9', fontWeight: 500, fontSize: "16px", padding: "8px 12px" }}
                />
              ) : service?.category ? (
                <Chip
                  label={service.category}
                  size="small"
                  sx={{ bgcolor: '#0487D91A', color: '#0487D9', fontWeight: 500, fontSize: "16px", padding: "8px 12px" }}
                />
              ) : null}
            </Stack>
          </Box>
        </Stack>

        <Typography 
          sx={{ 
            color: '#222', 
            fontSize: 16, 
            mb: 2, 
            mt: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            flex: 1
          }}
        >
          {service.description}
        </Typography>

        <Stack spacing={1} mb={2}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <LocationOnIcon sx={{ color: '#0487D9', fontSize: 20 }} />
            <Typography sx={{ color: '#666', fontSize: 14 }}>
              {service.supplier?.location || service.location || 'Location not specified'}
            </Typography>
          </Stack>

          {/* <Stack direction="row" alignItems="center" spacing={1}>
            <StarIcon sx={{ color: '#FFD700', fontSize: 20 }} />
            <Typography sx={{ color: '#333', fontSize: 14, fontWeight: 600 }}>
              {service.rating || '4.9'}
            </Typography>
            <Typography sx={{ color: '#666', fontSize: 14 }}>
              ({service.reviewCount || '86'} reviews)
            </Typography>
          </Stack> */}

          <Stack direction="row" alignItems="center" spacing={1}>
            <EmailIcon sx={{ color: '#0487D9', fontSize: 20 }} />
            <Typography sx={{ color: '#666', fontSize: 14, wordBreak: 'break-all' }}>
              {service.supplier?.email || service.email || service.vendor?.email || 'Email not specified'}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
      <CardActions sx={{ pt: 0, mt: 'auto' }}>
        <Button 
          fullWidth 
          variant="contained" 
          sx={{
            background: 'linear-gradient(90deg, #0487D9 0%, #034D92 100%)',
            color: '#fff',
            fontWeight: 600,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: 16,
            boxShadow: 'none',
            mt: 2,
            '&:hover': {
              background: 'linear-gradient(90deg, #034D92 0%, #0487D9 100%)',
              boxShadow: 'none',
            },
          }}
          onClick={handleAction}
        >
          Request Quote
        </Button>
      </CardActions>
    </Card>
  );
};

export default ServiceCard; 