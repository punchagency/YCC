import { Box, Typography, Grid, Button, Pagination, useTheme, useMediaQuery } from '@mui/material'
import YachtIcon from '@mui/icons-material/DirectionsBoat'
import CaptainIcon from '@mui/icons-material/Person'
import EngineeringIcon from '@mui/icons-material/Build'
import ExteriorIcon from '@mui/icons-material/Deck'
import GalleyIcon from '@mui/icons-material/Restaurant'
import InteriorIcon from '@mui/icons-material/Weekend'
import CrewIcon from '@mui/icons-material/Groups'
import React, { useState, useEffect } from 'react'
import { getAllServices } from '../../services/service/serviceService'
import ServiceCard from './service-card'
import ServiceCardSkeleton from './service-card-skeleton'
import './resource-center.css'

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

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getAllServices(type);
      
      if (response.status && response.data) {
        setServices(response.data);
        setFilteredServices(response.data);
      } else {
        setError('Invalid response format from server');
      }
    } catch (error) {
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

  return (
    <div className="resource-center-main-container">
      <Box sx={{ width: '100%' }}>
        {isLoading ? (
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
            {Array.from({ length: itemsPerPage }).map((_, index) => (
              <Grid 
                item 
                xs={12} 
                sm={6} 
                md={4} 
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <Box sx={{ width: '100%', maxWidth: '100%' }}>
                  <ServiceCardSkeleton />
                </Box>
              </Grid>
            ))}
          </Grid>
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
