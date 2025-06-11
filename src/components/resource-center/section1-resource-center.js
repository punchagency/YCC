import { Box, Container, Typography, styled, ToggleButton, ToggleButtonGroup, TextField, InputAdornment, Button } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import CaptainIcon from '@mui/icons-material/Person';
import CrewIcon from '@mui/icons-material/Groups';
import EngineeringIcon from '@mui/icons-material/Build';
import ExteriorIcon from '@mui/icons-material/Deck';
import GalleyIcon from '@mui/icons-material/Restaurant';
import InteriorIcon from '@mui/icons-material/Weekend';
import { useState } from 'react';
import React from 'react';

const categories = [
  { label: 'Captain', icon: <img src="/RescourceIcon/captain.png" alt="Captain" style={{ width: 28, height: 28 }} /> },
  { label: 'Crew', icon: <img src="/RescourceIcon/crew.png" alt="Crew" style={{ width: 28, height: 28 }} /> },
  { label: 'Engineering', icon: <img src="/RescourceIcon/Engineering.png" alt="Engineering" style={{ width: 28, height: 28 }} /> },
  { label: 'Exterior', icon: <ExteriorIcon /> },
  { label: 'Galley/Chefs', icon: <img src="/RescourceIcon/chef.png" alt="Galley/Chefs" style={{ width: 28, height: 28 }} /> },
  { label: 'Interior', icon: <img src="/RescourceIcon/Extiorior.png" alt="Interior" style={{ width: 28, height: 28 }} /> },
];

const Section1ResourceCenter = ({ toggle, setToggle, category, setCategory, search, setSearch }) => {
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
        {categories.map(cat => {
          const isSelected = category === cat.label;
          return (
            <Button
              key={cat.label}
              variant={isSelected ? 'contained' : 'outlined'}
              startIcon={React.cloneElement(cat.icon, { sx: { color: isSelected ? '#fff' : '#1976d2', fontSize: 28 } })}
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