import logo from '../assets/images/logo.png'
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { AppBar, Toolbar, Button, Menu, MenuItem } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LandingPageHeader = () => {

  const navItems = [
    { title: "Home", link: "/home" },
    { 
      title: "Departments", 
      link: "/departments", 
      options: ["HR", "Finance", "IT", "Operations"] // Only "Departments" has options
    },
    { title: "Vendor & Services", link: "/vendors-services" },
    { title: "About Us", link: "/about" },
    { title: "Resource Center", link: "/resources" },
    { title: "Contact", link: "/contact" }
  ]

  const [anchorEl, setAnchorEl] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {  // Change background when scrolled down 50px
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (event, title) => {
    setAnchorEl(event.currentTarget);
    setOpenDropdown(title);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpenDropdown(null);
  };


  return (
    <TransparentAppBar position="fixed" sx={{zIndex: 1300,
      transition: "0.3s ease-in-out",
      backgroundColor: scrolled ? "rgba(0, 0, 0, 0.8)" : "transparent", // Change color on scroll
      boxShadow: scrolled ? "0px 4px 10px rgba(0, 0, 0, 0.3)" : "none",
    }}>
      <Toolbar sx={{ width: "100%", display: "flex", justifyContent: "center", gap: "30px" }}>

        <Box display="flex" alignItems="center">
          <img src={logo} alt="Logo" style={{ width: 50, height: 50, marginRight: 10 }} />
        </Box>

        {/* Menu Items */}

      {/*  <Box sx={{ display: "flex", gap: "50px", alignItems: "center" }}>
          {navItems.map(
            (item) => (
              <Typography key={item} sx={{ cursor: "pointer", color: "white", alignText: "center", letterSpacing: "-2%" }}>
                {item.title}
              </Typography>
            )
          )}

        </Box>
      */}
        <Box sx={{ display: "flex", gap: "50px", alignItems: "center" }}>
          
        {navItems.map((item) => (
            item.options ? (
              <Box key={item.title}>
                <Button
                  color="inherit"
                  onClick={(event) => handleClick(event, item.title)}
                  sx={{
                    textTransform: "none",
                  }}
                >
                    <Typography sx={{ fontSize: "14px", cursor: "pointer", color: "white", alignText: "center", letterSpacing: "-2%" }}>
                {item.title}
              </Typography>
              <KeyboardArrowDownIcon sx={{ color: "white" }} />
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={openDropdown === item.title}
                  onClose={handleClose}
                >
                  {item.options.map((option) => (
                    <MenuItem key={option} onClick={handleClose}>
                      {option}
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            ) : (
              <Button key={item.title} color="inherit" component={Link} to={item.link} sx={{
                textTransform: "none",
              }}
 >
              <Typography sx={{ fontSize: "14px", cursor: "pointer", color: "white", alignText: "center", letterSpacing: "-2%" }}>
                {item.title}
              </Typography>
              </Button>
            )
          ))}
        </Box>


        {/* Buttons */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <GradientButton variant="contained">
            <ButtonTypography sx={{ color: "white" }}>Join Now</ButtonTypography></GradientButton>
          <Button variant="contained" sx={{ backgroundColor: "white", textTransform: "none" }}>
            <ButtonTypography sx={{
              background: "linear-gradient(90deg, #034D92, #0487D9)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>Sign In</ButtonTypography>
          </Button>
        </Box>

      </Toolbar>
    </TransparentAppBar>
  )
}
export const linearGradient = "linear-gradient(90deg, #034D92, #0487D9)";
export const linearGradient2 = "linear-gradient(90deg, #0487D9, #034D92)";

const TransparentAppBar = styled(AppBar)({
  backgroundColor: "transparent",
  boxShadow: "none",
  padding: "20px 130px",
  color: "white",
  fontSize: "16px",
  fontFamily: "Manrope, sans-serif",
  fontWeight: 400,
});

export const ButtonTypography = styled(Typography)({
  fontSize: "16px",
  fontFamily: "Inter, sans-serif",
  lineHeight: "19px",
  fontWeight: 600,
});

export const GradientButton = styled(Button)({
  background: linearGradient,
  fontSize: "16px",
  fontFamily: "Inter, sans-serif",
  textTransform: "none",
  "&:hover": {
    background: linearGradient2,
  },
  padding: "12px 14px",
});


export default LandingPageHeader