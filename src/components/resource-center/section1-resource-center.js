import { Box, Container, Typography, styled, TextField, InputAdornment, Button } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import ExteriorIcon from '@mui/icons-material/Deck';
import React, { useEffect, useMemo } from 'react';

const categories = [
  { label: 'Captain', icon: <img src="/RescourceIcon/captain.png" alt="Captain" style={{ width: 28, height: 28 }} /> },
  { label: 'Crew', icon: <img src="/RescourceIcon/crew.png" alt="Crew" style={{ width: 28, height: 28 }} /> },
  { label: 'Engineering', icon: <img src="/RescourceIcon/Engineering.png" alt="Engineering" style={{ width: 28, height: 28 }} /> },
  { label: 'Exterior', icon: <ExteriorIcon /> },
  { label: 'Galley/Chefs', icon: <img src="/RescourceIcon/chef.png" alt="Galley/Chefs" style={{ width: 28, height: 28 }} /> },
  { label: 'Interior', icon: <img src="/RescourceIcon/Extiorior.png" alt="Interior" style={{ width: 28, height: 28 }} /> },
];

const serviceOptions = [
  'Vessel Management & Administration',
  'Maritime Legal & Compliance Assistance',
  'Crew Recruitment & Placement Services',
  'Customs & Immigration Assistance',
  'Insurance & Risk Management',
  'Security & Anti-Piracy Training',
  'Safety Equipment Inspections & Compliance',
  'IT & Cybersecurity Services for Yachts',
  'Charter & Itinerary Planning Assistance',
  'Satellite & Internet Connectivity Solutions',
  'Fresh Produce & Gourmet Food Provisioning',
  'Butcher & Seafood Supply Services',
  'Specialty Ingredient Sourcing',
  'Custom Catering & Onboard Chef Services',
  'Galley Equipment Maintenance & Repair',
  'Wine, Spirits & Specialty Beverages Supply',
  'Specialty Coffee & Tea Provisioning',
  'Dry & Frozen Goods Supply',
  'Galley Deep Cleaning & Sanitation Services',
  'Kitchenware & Culinary Equipment Supply',
  'Marine Engine Servicing & Repairs',
  'Generator Installation & Maintenance',
  'HVAC & Refrigeration Services',
  'Watermaker Installation & Repairs',
  'Fuel System Cleaning & Maintenance',
  'Electrical System Troubleshooting',
  'Navigation & Communication System Setup',
  'Hydraulic System Servicing',
  'Welding & Metal Fabrication Services',
  'Spare Parts Sourcing & Logistics',
  'Yacht Interior Cleaning & Housekeeping',
  'Laundry & Dry Cleaning Services',
  'Custom Interior Design & Refurbishment',
  'Florist & Fresh Flower Arrangements',
  'Carpet & Upholstery Cleaning',
  'Event & Party Planning Services',
  'Provisioning for Guest Supplies',
  'Bar & Beverage Supply Services',
  'AV & Entertainment System Installation',
  'Crew Uniform Tailoring & Embroidery',
  'Yacht Detailing & Washdowns',
  'Teak Deck Sanding & Restoration',
  'Varnishing & Paintwork Services',
  'Fiberglass & Gelcoat Repairs',
  'Docking & Line Handling Assistance',
  'Diving & Underwater Hull Cleaning',
  'Fender & Rope Supply & Maintenance',
  'Tender & Jet Ski Servicing',
  'Watersports Equipment Rental & Repairs',
  'Exterior Upholstery & Canvas Work',
  'Mental Health Support',
  'Confidential Therapy',
  'Career Guidance',
  'Legal Consultation',
  'Financial Advisory',
];

const categoryOptions = [
  {
    label: "Navigation Equipment",
    value: "Navigation Equipment",
    icon: process.env.PUBLIC_URL + "/RescourceIcon/navigation1.png",
  },
  {
    label: "Safety Gear",
    value: "Safety Gear",
    icon: process.env.PUBLIC_URL + "/RescourceIcon/safety1.png",
  },
  {
    label: "Marine Electronics",
    value: "Marine Electronics",
    icon: process.env.PUBLIC_URL + "/RescourceIcon/electronics1.png",
  },
  {
    label: "Deck Equipment",
    value: "Deck_Equipment",
    icon: process.env.PUBLIC_URL + "/RescourceIcon/deck1.png",
  },
  {
    label: "Engine & Propulsion",
    value: "Engine & Propulsion",
    icon: process.env.PUBLIC_URL + "/RescourceIcon/engine1.png",
  },
  {
    label: "Anchoring System",
    value: "Anchoring System",
    icon: process.env.PUBLIC_URL + "/RescourceIcon/anchor1.png",
  },
  {
    label: "Sailing Equipment",
    value: "Sailing Equipment",
    icon: process.env.PUBLIC_URL + "/RescourceIcon/sailing1.png",
  },
  {
    label: "Water Sports Gear",
    value: "Water Sports Gear",
    icon: process.env.PUBLIC_URL + "/RescourceIcon/sports1.png",
  },
  {
    label: "Fishing Equipment",
    value: "Fishing Equipment",
    icon: process.env.PUBLIC_URL + "/RescourceIcon/fishing1.png",
  },
  {
    label: "Marine Furniture",
    value: "Marine Furniture",
    icon: process.env.PUBLIC_URL + "/RescourceIcon/furniture1.png",
  },
  {
    label: "Galley Equipment",
    value: "Galley Equipment",
    icon: process.env.PUBLIC_URL + "/RescourceIcon/galley1.png",
  },
  {
    label: "Refrigeration",
    value: "Refrigeration",
    icon: process.env.PUBLIC_URL + "/RescourceIcon/refrigeration1.png",
  },
  {
    label: "Water Systems",
    value: "Water Systems",
    icon: process.env.PUBLIC_URL + "/RescourceIcon/water1.png",
  },
  {
    label: "Electrical Systems",
    value: "Electrical Systems",
    icon: process.env.PUBLIC_URL + "/RescourceIcon/electrical1.png",
  },
  {
    label: "Hull Maintenance",
    value: "Hull Maintenance",
    icon: process.env.PUBLIC_URL + "/RescourceIcon/maintenance1.png",
  },
  {
    label: "Mooring Equipment",
    value: "Mooring Equipment",
    icon: process.env.PUBLIC_URL + "/RescourceIcon/mooring1.png",
  },
  {
    label: "Communication Systems",
    value: "Communication Systems",
    icon: process.env.PUBLIC_URL + "/RescourceIcon/communication1.png",
  },
  {
    label: "Sea Food Storage",
    value: "Sea Food Storage",
    icon: process.env.PUBLIC_URL + "/RescourceIcon/food_storage1.png",
  },
  {
    label: "Bilge Systems",
    value: "Bilge Systems",
    icon: process.env.PUBLIC_URL + "/RescourceIcon/bilge1.png",
  },
  {
    label: "HVAC Systems",
    value: "HVAC Systems",
    icon: process.env.PUBLIC_URL + "/RescourceIcon/hvac1.png",
  },
];

// Helper function to get random items from an array
const getRandomItems = (array, count) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const Section1ResourceCenter = ({ toggle, setToggle, category, setCategory, search, setSearch, type }) => {
  // Get 6 random categories based on the type
  const displayCategories = useMemo(() => {
    if (type === 'product') {
      // For products, use categoryOptions
      return getRandomItems(categoryOptions, 6);
    } else {
      // For services, use serviceOptions keys
      return getRandomItems(serviceOptions, 6).map(key => ({
        label: key.charAt(0).toUpperCase() + key.slice(1),
        value: key,
        icon: categories.find(cat => cat.label.toLowerCase() === key)?.icon || categories[0].icon
      }));
    }
  }, [type]);

  // Reset category when type changes to avoid invalid selections
  useEffect(() => {
    setCategory('');
  }, [type, setCategory]);


  return (
    <Container maxWidth="lg" sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 1,
      py: { xs: 2, md: 2 },
      fontFamily: 'Inter, sans-serif',
    }}>
      <Typography variant="h4" sx={{ fontWeight: 600, textAlign: 'center', fontSize: { xs: 28, md: 36 }, mb: 0.5, fontFamily: 'Inter, sans-serif' }}>
        Navigate The Yachting World With<br />Confidence And Ease
      </Typography>
      <Typography sx={{ color: '#555', textAlign: 'center', maxWidth: 700, mb: 2.5, fontFamily: 'Inter, sans-serif', fontSize: 16, fontWeight: 400 }}>
        Explore verified service providers and supplies tailored to the Yachting industry. Search by department, region or keyword or ask our assistant for help.
      </Typography>
      <Box sx={{ display: 'flex', gap: 3, mb: 2.5, justifyContent: 'center' }}>
        <Button
          variant={toggle === 'Services' ? 'contained' : 'outlined'}
          onClick={() => setToggle('Services')}
          sx={{
            px: 4,
            fontWeight: 500,
            fontFamily: 'Inter, sans-serif',
            fontSize: 16,
            height: 44,
            borderRadius: 2,
            minWidth: 120,
            color: toggle === 'Services' ? 'white' : '#222',
            backgroundColor: toggle === 'Services' ? '#1976d2' : '#fff',
            border: '1px solid #e3f2fd',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: toggle === 'Services' ? '#1565c0' : '#f5f5f5',
              boxShadow: 'none',
            },
          }}
        >
          Services
        </Button>
        <Button
          variant={toggle === 'Supplies' ? 'contained' : 'outlined'}
          onClick={() => setToggle('Supplies')}
          sx={{
            px: 4,
            fontWeight: 500,
            fontFamily: 'Inter, sans-serif',
            fontSize: 16,
            height: 44,
            borderRadius: 2,
            minWidth: 120,
            color: toggle === 'Supplies' ? 'white' : '#222',
            backgroundColor: toggle === 'Supplies' ? '#1976d2' : '#fff',
            border: '1px solid #e3f2fd',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: toggle === 'Supplies' ? '#1565c0' : '#f5f5f5',
              boxShadow: 'none',
            },
          }}
        >
          Supplies
        </Button>
      </Box>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center', mb: 2.5 }}>
        {displayCategories.map(cat => {
          const isSelected = category === cat.label;
          return (
            <Button
              key={cat.label}
              variant={isSelected ? 'contained' : 'outlined'}
              // startIcon={React.cloneElement(cat.icon, { sx: { color: isSelected ? '#fff' : '#1976d2', fontSize: 28 } })}
              onClick={() => setCategory(isSelected ? '' : cat.label)}
              sx={{
                borderRadius: 2,
                minWidth: 120,
                fontWeight: 500,
                fontFamily: 'Inter, sans-serif',
                fontSize: 16,
                height: 44,
                px: 2,
                py: 0,
                color: isSelected ? 'white' : '#222',
                backgroundColor: isSelected ? '#1976d2' : '#fff',
                border: '1px solid #e3f2fd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '&.MuiButton-contained': {
                  backgroundColor: '#1976d2',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#1565c0',
                  }
                },
                '& .MuiButton-startIcon': {
                  mr: 1,
                }
              }}
            >
              {cat.label}
            </Button>
          );
        })}
      </Box>
      <Box sx={{ width: '100%', maxWidth: 600, mb: 0 }}>
        <TextField
          fullWidth
          placeholder="Search by service, product or keyword..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            sx: {
              borderRadius: 4,
              background: '#fff',
              fontFamily: 'Inter, sans-serif',
              fontSize: 16,
              height: 56,
              px: 2
            },
          }}
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 16,
            borderRadius: 4,
            height: 56,
            px: 2
          }}
        />
      </Box>
    </Container>
  )
}

const HeadingText = styled(Typography)({
  color: "#131313",
  fontFamily: "Plus Jakarta Sans, sans-serif",
  fontWeight: 500,
  fontSize: "45px",
  lineHeight: "51px",
  letterSpacing: "-0.02em",
})

const SecondarySubTextBlack = styled(Typography)({
  fontFamily: "Inter",
  fontWeight: 400,
  fontSize: "18px",
  lineHeight: "26px",
  letterSpacing: "-0.03em",
  color: "#373737",
  textAlign: "justify",
})

export default Section1ResourceCenter