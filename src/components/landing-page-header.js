import logo from '../assets/images/icons/YCC-navbar-icon.png'
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import {
  AppBar, Toolbar, Button, Menu, MenuItem, Drawer,  Collapse,
  IconButton
} from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MenuIcon from "@mui/icons-material/Menu";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from "react-router-dom";




const LandingPageHeader = () => {

  const location = useLocation();
  const navItems = [
    { title: "Home", link: "/home" },
    {
      title: "Departments",
      link: "/departments",
      options: [
        { title: 'Captain', route: '/captain' },
        { title: 'Crew', route: '/crew' },
        { title: 'Engineering', route: '/engineering' },
        { title: 'Exterior', route: '/exterior' },
        { title: 'Chef/Gallery', route: '/chef-gallery' },
        { title: 'Interior', route: '/interior' }
      ]
    },
    { title: "Vendor & Services", link: "/vendor-services" },
    { title: "About Us", link: "/about-us" },
    { title: "Resource Center", link: "/resource-center" },
    { title: "Contact", link: "/contact-us" }
  ]

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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

  const toggleDrawer = () => setMobileOpen(!mobileOpen);


  return (
    <TransparentAppBar
      position="fixed"
      sx={{
        zIndex: 1300,
        transition: "0.3s ease-in-out",
        backgroundColor: {
          xs: 'white',
          md:  scrolled ? "rgba(0, 0, 0, 0.8)" : "transparent", // Change color on scroll
        },
        boxShadow: scrolled ? "0px 4px 10px rgba(0, 0, 0, 0.3)" : "none",
        maxWidth: '100%'
      }}>


      <Toolbar sx={{ width: "100%", display: "flex", justifyContent: { xs: 'space-between', md: 'center' }, gap: "30px" }}>

        {/* Hamburger Menu - Always on the Left */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleDrawer}
          sx={{ 
            display: { xs: "flex", md: "none"},
            background: "linear-gradient(90deg, #034D92, #0487D9)",
            width: 50,
            height: 50,
            minWidth: 50,   // Ensures the button does not shrink
            minHeight: 50,  // Ensures the button does not shrink
            padding: 0,
            color: 'white',
            borderRadius: '8px', 
            alignContent: "center",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MenuIcon/>
        </IconButton>

        {/* Logo */}
        <Box display="flex" alignItems="center">
          <img src={logo} alt="Logo" style={{ width: 50, height: 50, marginRight: 10 }} />
        </Box>

        {/* Desktop Navigation */}
        <Box sx={{ display: { xs: "none", sm: "flex" }, gap: {sm: '5px', lg: '40px'}, alignItems: "center" }}>

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
                  disablePortal
                  disableScrollLock
                  sx={{
                    "& .MuiPaper-root": { padding: 0, boxShadow: "none", minWidth: "200px", borderRadius: '13px', }, // Remove padding from Paper
                    "& .MuiList-root": { padding: 0, },
                  }}
                >
                  {item.options.map((option) => (
                    <MenuItem key={option}
                      onClick={handleClose}
                      component={Link}
                      to={option.route}
                      sx={{
                        borderRadius: 0, // Default no border radius
                        "&:first-of-type": { borderTopLeftRadius: "13px", borderTopRightRadius: "13px" }, // ✅ Rounded top
                        "&:last-of-type": { borderBottomLeftRadius: "13px", borderBottomRightRadius: "13px" }, // ✅ Rounded bottom
                        width: "100%", // ✅ Ensure it spans full width
                        height: "100%", // ✅ Ensures full height
                        display: "flex", // ✅ Makes sure it fills the container properly
                        alignItems: "center", // Aligns text vertically
                        justifyContent: "flex-start", // Aligns text to the left
                        padding: "12px 16px", // Adjust padding to remove unnecessary space
                        color: location.pathname === option.route ? "white" : "#131313",
                        backgroundImage: location.pathname === option.route ? linearGradient : "none", // ✅ Use backgroundImage for gradients
                        backgroundColor: location.pathname === option.route ? "transparent" : "white", // ✅ Ensure white background for non-active items
                        "&:hover": {
                          backgroundColor: '#f5f5f5', // ✅ Apply gradient on hover
                        },
                      }}
                    >
                      {option.title}
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            ) : (
              <Button key={item.title} color="inherit" component={Link} to={item.link} sx={{
                textTransform: "none",
              }}
              >
                <Typography sx={{
                  fontSize: "14px",
                  cursor: "pointer",
                  color: "white",
                  alignText: "center",
                  letterSpacing: "-2%",
                  //color: location.pathname === item.link ? "blue" : "white",
                  fontWeight: location.pathname === item.link ? "bold" : "normal",

                }}>
                  {item.title}
                </Typography>
              </Button>
            )
          ))}
        </Box>


        {/* Desktop Buttons */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
          <Link to='/get-started' >
          <GradientButton variant="contained">
            <ButtonTypography sx={{ color: "white" }}>Join Now</ButtonTypography></GradientButton>
            </Link>
          <Button variant="contained" component={Link} to='/login' sx={{ backgroundColor: "white", textTransform: "none" }}>
            <ButtonTypography sx={{
              background: "linear-gradient(90deg, #034D92, #0487D9)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>Sign In</ButtonTypography>
          </Button>
        </Box>

      </Toolbar>


      {/* Mobile Drawer */}
      <Drawer anchor="left" open={mobileOpen} onClose={toggleDrawer} sx={{
        zIndex: 1301,
      }}>









        <Box sx={{ width: 250, display: "flex", flexDirection: "column", height: "100%",background: "linear-gradient(90deg, #034D92, #0487D9)", paddingBlock: '40px' }}>


          <Box sx={{ flex: 1, padding: "20px" }}>
            {/* Nav Item with dropdown */}
            {navItems.map((item) =>
              item.options ? (

                <Box key={item.title}>
                {/* Parent Item (Clickable) */}
                <Button
                  onClick={() => setOpen(!open)}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    textAlign: "left",
                    width: "100%",
                    padding: "10px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "white",
                    textTransform: 'none'
                  }}
                >
                    <Typography sx={{
                        fontSize: "14px",
                        cursor: "pointer",
                        color: location.pathname === item.link ? "white" : "rgba(255, 255, 255, 0.8)",
                        textAlign: "center", // Correct property for text alignment
                        letterSpacing: "-2%",
                        display: "flex", // Enables flexbox
                        alignItems: "center", // Vertically centers text & icon
                        justifyContent: "center", // Horizontally centers content
                        gap: "4px",
                    }}>
                    {item.title} {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </Typography>
                  
                </Button>
          
                {/* Child Dropdown Menu */}
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <Box sx={{ paddingLeft: "20px" }}>
                    {item.options.map((option) => (
                      <Button
                        key={option.title}
                        component={Link}
                        to={option.route}
                        onClick={toggleDrawer}
                        sx={{
                          display: "block",
                          textAlign: "left",
                          width: "100%",
                          padding: "8px 0",
                          fontSize: "14px",
                          color: "white",
                          textTransform: 'none'
                        }}
                      >
                           <Typography sx={{fontWeight: location.pathname === option.route ? "bold" : "normal", fontSize: "14px", cursor: "pointer", color: location.pathname === option.route ? "white" : "rgba(255, 255, 255, 0.8)", alignText: "center", letterSpacing: "-2%" }}>
                    {option.title}
                  </Typography>
                      </Button>
                    ))}
                  </Box>
                </Collapse>
              </Box>  

              ) : (
                <Button key={item.title} component={Link} to={item.link} onClick={toggleDrawer} sx={{ display: "block", textAlign: "left", width: "100%", padding: "10px", textTransform: 'none' }}>
                  <Typography sx={{fontWeight: location.pathname === item.link ? "bold" : "normal", fontSize: "14px", cursor: "pointer", color: location.pathname === item.link ? "white" : "rgba(255, 255, 255, 0.8)", alignText: "center", letterSpacing: "-2%" }}>
                    {item.title}
                  </Typography>
                </Button>
              )
            )}
          </Box>

          {/* Mobile Buttons at Bottom */}
          <Box sx={{ padding: "20px", borderTop: "1px solid #ddd", textAlign: "center" }}>
            <Button component={Link} to='/get-started' fullWidth variant="contained" sx={{ background: "linear-gradient(90deg, #034D92, #0487D9)", textTransform: 'none', color: "white", marginBottom: "10px" }}>
            <Typography sx={{ fontSize: "14px", cursor: "pointer", color: "white", alignText: "center", letterSpacing: "-2%" }}>
                   Join Now
                  </Typography>
            </Button>
            <Button component={Link} to='/login' fullWidth variant="contained" sx={{ backgroundColor: "white", textTransform: 'none' }}>
              <Typography sx={{ background: "linear-gradient(90deg, #034D92, #0487D9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",fontSize: "15px", cursor: "pointer",alignText: "center", letterSpacing: "-2%" }}>
                Sign In
              </Typography>
            </Button>
          </Box>




        </Box>








      </Drawer>

    </TransparentAppBar>
  )
}
export const linearGradient = "linear-gradient(90deg, #034D92, #0487D9)";
export const linearGradient2 = "linear-gradient(90deg, #0487D9, #034D92)";

const TransparentAppBar = styled(AppBar)({
  backgroundColor: "transparent",
  boxShadow: "none",
  padding: {
    xs: "20px 20px",  // Small screens (mobile)
    sm: "20px 40px",  // Small tablets
    md: "20px 80px",  // Medium screens (larger tablets, small laptops)
    lg: "20px 110px", // Large screens (desktops)
  },
  color: "white",
  fontSize: "16px",
  fontFamily: "Manrope, sans-serif",
  fontWeight: 400,
});

export const ButtonTypography = styled(Typography)(({ theme }) => ({
  fontFamily: "Inter, sans-serif",
  fontWeight: 600,
  lineHeight: "19px",
  fontSize: "16px", // Default for large screens

  [theme.breakpoints.down("sm")]: { // Mobile (xs)
    fontSize: "14px",
    lineHeight: "17px",
  },

  [theme.breakpoints.between("sm", "md")]: { // Tablets (sm - md)
    fontSize: "15px",
    lineHeight: "18px",
  },

  [theme.breakpoints.up("md")]: { // Medium+ screens
    fontSize: "16px",
    lineHeight: "19px",
  }
}));

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