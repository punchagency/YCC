import { Box, Typography, Card, CardContent, CardActions, Button, Stack, Avatar, Chip } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { getCategoryIcon } from './section4-resource-center';

const ServiceCard = ({ service }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

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
        <Stack direction="row" alignItems="center" spacing={2} mb={1}>
          <Avatar sx={{ width: 56, height: 56, bgcolor: '#e3f2fd' }}>
            {getCategoryIcon(service.category)}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0 }}>
              {service.name}
            </Typography>
            <Stack direction="row" spacing={1} mt={0.5}>
              {service.category && (
                <Chip
                  label={service.category}
                  size="small"
                  sx={{ bgcolor: '#b3e0fc', color: '#034D92', fontWeight: 600, fontSize: 14 }}
                />
              )}
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
        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
          <LocationOnIcon sx={{ color: '#0487D9' }} />
          <Typography sx={{ color: '#222', fontWeight: 500, fontSize: 15 }}>
            {service.location || 'Location not specified'}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
          <EmailIcon sx={{ color: '#0487D9' }} />
          <Typography sx={{ color: '#222', fontSize: 15, wordBreak: 'break-all' }}>
            {service.email || 'Email not available'}
          </Typography>
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