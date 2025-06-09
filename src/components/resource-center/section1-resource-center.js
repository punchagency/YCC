import { Box, Container, Typography, styled, ToggleButton, ToggleButtonGroup, TextField, InputAdornment, Button } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import CaptainIcon from '@mui/icons-material/Person';
import CrewIcon from '@mui/icons-material/Groups';
import EngineeringIcon from '@mui/icons-material/Build';
import ExteriorIcon from '@mui/icons-material/Deck';
import GalleyIcon from '@mui/icons-material/Restaurant';
import InteriorIcon from '@mui/icons-material/Weekend';
import { useState } from 'react';

const categories = [
  { label: 'Captain', icon: <CaptainIcon /> },
  { label: 'Crew', icon: <CrewIcon /> },
  { label: 'Engineering', icon: <EngineeringIcon /> },
  { label: 'Exterior', icon: <ExteriorIcon /> },
  { label: 'Galley/Chefs', icon: <GalleyIcon /> },
  { label: 'Interior', icon: <InteriorIcon /> },
];

const Section1ResourceCenter = () => {
  const [toggle, setToggle] = useState('Supplies');
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');

  return (
    <Container maxWidth="lg" sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 3,
      py: { xs: 6, md: 10 },
    }}>
      <Typography variant="h4" sx={{ fontWeight: 600, textAlign: 'center', fontSize: { xs: 28, md: 36 } }}>
        Navigate The Yachting World With<br />Confidence And Ease
      </Typography>
      <Typography sx={{ color: '#555', textAlign: 'center', maxWidth: 700, mb: 2 }}>
        Explore verified service providers and supplies tailored to the Yachting industry. Search by department, region or keyword or ask our assistant for help.
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <ToggleButtonGroup
          value={toggle}
          exclusive
          onChange={(_, v) => v && setToggle(v)}
          sx={{ background: '#f5f5f5', borderRadius: 2 }}
        >
          <ToggleButton value="Services" sx={{ px: 4, fontWeight: 600 }}>Services</ToggleButton>
          <ToggleButton value="Supplies" sx={{ px: 4, fontWeight: 600 }}>Supplies</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', mb: 2 }}>
        {categories.map(cat => (
          <Button
            key={cat.label}
            variant={category === cat.label ? 'contained' : 'outlined'}
            startIcon={cat.icon}
            onClick={() => setCategory(cat.label)}
            sx={{ borderRadius: 2, minWidth: 120, fontWeight: 500 }}
          >
            {cat.label}
          </Button>
        ))}
      </Box>
      <Box sx={{ width: '100%', maxWidth: 600, mb: 2 }}>
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
            sx: { borderRadius: 2, background: '#fff' },
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