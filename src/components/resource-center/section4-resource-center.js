import { Box, Typography, styled, Container, Grid, Card, CardContent, CardActions, Button, Stack, Avatar, Chip, Pagination, useTheme, useMediaQuery } from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import StarIcon from '@mui/icons-material/Star'
import EmailIcon from '@mui/icons-material/Email'
import YachtIcon from '@mui/icons-material/DirectionsBoat'
import CaptainIcon from '@mui/icons-material/Person'
import EngineeringIcon from '@mui/icons-material/Build'
import ExteriorIcon from '@mui/icons-material/Deck'
import GalleyIcon from '@mui/icons-material/Restaurant'
import InteriorIcon from '@mui/icons-material/Weekend'
import CrewIcon from '@mui/icons-material/Groups'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/authContext'
import { getAllServices } from '../../services/service/serviceService'
import ServiceCard from './service-card'
import { FaSearch, FaFilter } from 'react-icons/fa'
import './resource-center.css'

const suppliesData = [
  {
    logo: '',
    product: 'Marine-Grade Engine Oil',
    description: 'High-performance synthetic engine oil designed for marine engines. Provides excellent protection against rust, corrosion, and high-temperature wear.',
    location: 'Fort Lauderdale, FL',
    price: '$45.00',
    unit: '(1-gallon container)',
    supplier: 'Nautical Engine Supplies',
    avatarBg: '#e3f2fd',
    avatarIcon: <YachtIcon sx={{ color: '#0487D9', fontSize: 32 }} />,
    categories: ['Engineering', 'Captain'],
  },
  {
    logo: '',
    product: 'Premium Deck Cleaner',
    description: 'Eco-friendly cleaner for teak and composite decks. Removes stains and salt residue safely.',
    location: 'Miami, FL',
    price: '$30.00',
    unit: '(1-liter bottle)',
    supplier: 'DeckPro Supplies',
    avatarBg: '#e3f2fd',
    avatarIcon: <ExteriorIcon sx={{ color: '#0487D9', fontSize: 32 }} />,
    categories: ['Exterior'],
  },
  {
    logo: '',
    product: "Chef's Knife Set",
    description: 'Professional-grade stainless steel knives for galley chefs. Includes 5 essential blades.',
    location: 'West Palm Beach, FL',
    price: '$120.00',
    unit: '(5-piece set)',
    supplier: 'Galley Essentials',
    avatarBg: '#e3f2fd',
    avatarIcon: <GalleyIcon sx={{ color: '#0487D9', fontSize: 32 }} />,
    categories: ['Galley/Chefs'],
  },
  {
    logo: '',
    product: 'Luxury Linen Set',
    description: 'High-thread-count linens for guest cabins. Soft, durable, and easy to clean.',
    location: 'Fort Lauderdale, FL',
    price: '$200.00',
    unit: '(Queen size set)',
    supplier: 'Interior Comforts',
    avatarBg: '#e3f2fd',
    avatarIcon: <InteriorIcon sx={{ color: '#0487D9', fontSize: 32 }} />,
    categories: ['Interior'],
  },
  {
    logo: '',
    product: 'Crew Uniform Package',
    description: 'Custom-branded uniforms for all crew roles. Breathable and quick-dry fabric.',
    location: 'Fort Lauderdale, FL',
    price: '$350.00',
    unit: '(10 uniforms)',
    supplier: 'CrewWear Solutions',
    avatarBg: '#e3f2fd',
    avatarIcon: <CrewIcon sx={{ color: '#0487D9', fontSize: 32 }} />,
    categories: ['Crew'],
  },
  {
    logo: '',
    product: 'Navigation Software Suite',
    description: 'Advanced navigation and route planning software for captains. Includes weather overlays.',
    location: 'Fort Lauderdale, FL',
    price: '$999.00',
    unit: '(lifetime license)',
    supplier: 'CaptainTech',
    avatarBg: '#e3f2fd',
    avatarIcon: <CaptainIcon sx={{ color: '#0487D9', fontSize: 32 }} />,
    categories: ['Captain'],
  },
];

const servicesData = [
  {
    logo: '',
    company: 'Oceanic Yacht Services',
    categories: ['Captain', 'Engineering'],
    description: 'Premium yacht maintenance, navigation and crew services for luxury vessels worldwide.',
    location: 'Fort Lauderdale, FL',
    email: 'info@oceanic.yacht.com',
    avatarBg: '#e3f2fd',
    avatarIcon: <YachtIcon sx={{ color: '#0487D9', fontSize: 32 }} />,
  },
  {
    logo: '',
    company: 'DeckPro Cleaning',
    categories: ['Exterior'],
    description: 'Specialized exterior cleaning and detailing for superyachts. Teak, hull, and brightwork experts.',
    location: 'Miami, FL',
    email: 'info@deckpro.com',
    avatarBg: '#e3f2fd',
    avatarIcon: <ExteriorIcon sx={{ color: '#0487D9', fontSize: 32 }} />,
  },
  {
    logo: '',
    company: 'Galley Masters',
    categories: ['Galley/Chefs'],
    description: 'Onboard chef placement and galley management consulting. Michelin-trained chef network.',
    location: 'West Palm Beach, FL',
    email: 'contact@galleymasters.com',
    avatarBg: '#e3f2fd',
    avatarIcon: <GalleyIcon sx={{ color: '#0487D9', fontSize: 32 }} />,
  },
  {
    logo: '',
    company: 'Interior Harmony',
    categories: ['Interior'],
    description: 'Interior design, cleaning, and guest service training for yacht stews and hosts.',
    location: 'Fort Lauderdale, FL',
    email: 'hello@interiorharmony.com',
    avatarBg: '#e3f2fd',
    avatarIcon: <InteriorIcon sx={{ color: '#0487D9', fontSize: 32 }} />,
  },
  {
    logo: '',
    company: 'CrewCare Wellness',
    categories: ['Crew'],
    description: 'Mental health, wellness, and team-building services for yacht crew. Confidential and global.',
    location: 'Fort Lauderdale, FL',
    email: 'support@crewcare.com',
    avatarBg: '#e3f2fd',
    avatarIcon: <CrewIcon sx={{ color: '#0487D9', fontSize: 32 }} />,
  },
  {
    logo: '',
    company: "Captain's Choice Training",
    categories: ['Captain'],
    description: 'Leadership, compliance, and navigation training for yacht captains. MCA and USCG certified.',
    location: 'Fort Lauderdale, FL',
    email: 'info@captainschoice.com',
    avatarBg: '#e3f2fd',
    avatarIcon: <CaptainIcon sx={{ color: '#0487D9', fontSize: 32 }} />,
  },
];

const gradientButton = {
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
};

export const getCategoryIcon = (category) => {
  switch (category?.toLowerCase()) {
    case 'captain':
      return <CaptainIcon sx={{ color: '#0487D9', fontSize: 32 }} />;
    case 'crew':
      return <CrewIcon sx={{ color: '#0487D9', fontSize: 32 }} />;
    case 'engineering':
      return <EngineeringIcon sx={{ color: '#0487D9', fontSize: 32 }} />;
    case 'exterior':
      return <ExteriorIcon sx={{ color: '#0487D9', fontSize: 32 }} />;
    case 'galley/chefs':
      return <GalleyIcon sx={{ color: '#0487D9', fontSize: 32 }} />;
    case 'interior':
      return <InteriorIcon sx={{ color: '#0487D9', fontSize: 32 }} />;
    default:
      return <YachtIcon sx={{ color: '#0487D9', fontSize: 32 }} />;
  }
};

const ResourceCenterSection4 = ({ type, category, search }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  // Responsive items per page
  let itemsPerPage = 9;
  if (isMobile) itemsPerPage = 3;
  else if (isTablet) itemsPerPage = 6;
  else itemsPerPage = 9;
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Fetching services...');
      const response = await getAllServices();
      console.log('Services response:', response);
      
      if (response.status && response.data) {
        setServices(response.data);
        setFilteredServices(response.data);
      } else {
        console.error('Invalid response format:', response);
        setError('Invalid response format from server');
      }
    } catch (error) {
      console.error('Error in fetchServices:', error);
      setError(error.message || 'Failed to fetch services');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    filterServices();
  }, [category, search, services]);

  const filterServices = () => {
    let filtered = [...services];

    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(service =>
        service.name?.toLowerCase().includes(searchLower) ||
        service.description?.toLowerCase().includes(searchLower) ||
        service.category?.toLowerCase().includes(searchLower)
      );
    }

    // Filter by category
    if (category && category !== 'all') {
      filtered = filtered.filter(service =>
        service.category?.toLowerCase() === category.toLowerCase()
      );
    }

    console.log('Filtered services:', filtered);
    setFilteredServices(filtered);
    setPage(1); // Reset to first page when filters change
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedServices = filteredServices.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleServiceClick = (service) => {
    if (!isAuthenticated) {
      // If not authenticated, show login prompt
      if (window.confirm('Please log in to view service details. Would you like to log in now?')) {
        navigate('/login');
      }
    } else {
      // If authenticated, navigate to service details
      navigate(`/service/${service._id}`);
    }
  };

  return (
    <div className="resource-center-main-container">
      <Box sx={{ width: '100%' }}>
        {isLoading ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '400px' 
          }}>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </Box>
        ) : error ? (
          <Box sx={{ 
            textAlign: 'center', 
            color: 'error.main', 
            p: 4 
          }}>
            <Typography variant="body1" gutterBottom>Error: {error}</Typography>
            <Button 
              variant="contained" 
              onClick={fetchServices}
              sx={{ 
                mt: 2,
                background: 'linear-gradient(90deg, #0487D9 0%, #034D92 100%)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #034D92 0%, #0487D9 100%)',
                }
              }}
            >
              Retry
            </Button>
          </Box>
        ) : filteredServices.length === 0 ? (
          <Box sx={{ 
            textAlign: 'center', 
            color: 'text.secondary', 
            py: 8 
          }}>
            <Typography variant="h6">
              No services found matching your criteria.
            </Typography>
          </Box>
        ) : (
          <>
            <Grid 
              container
              spacing={{ xs: 0, sm: 2, md: 3 }}
              sx={{ 
                width: '100%',
                margin: 0,
                '& .MuiGrid-item': {
                  padding: { xs: 1, sm: 1.5, md: 1.5 }
                }
              }}
            >
              {paginatedServices.map((service) => (
                <Grid 
                  item 
                  xs={12} 
                  sm={6} 
                  md={4} 
                  key={service._id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                >
                  <Box sx={{ width: '100%', maxWidth: '100%' }}>
                    <ServiceCard service={service} />
                  </Box>
                </Grid>
              ))}
            </Grid>
            {totalPages > 1 && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                mt: { xs: 3, sm: 4, md: 4 },
                mb: { xs: 2, sm: 3, md: 3 },
                '& .MuiPaginationItem-root': {
                  fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                  fontWeight: 500,
                  '&.Mui-selected': {
                    backgroundColor: '#0487D9',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#034D92',
                    },
                  },
                },
              }}>
                <Pagination 
                  count={totalPages} 
                  page={page} 
                  onChange={handlePageChange}
                  color="primary"
                  size={isMobile ? "medium" : "large"}
                  showFirstButton={!isMobile}
                  showLastButton={!isMobile}
                  siblingCount={isMobile ? 0 : 1}
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </div>
  );
};

export default ResourceCenterSection4;
