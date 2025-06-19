import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  List,
  ListItem,
} from "@mui/material";
import { GradientButton } from "./landing-page-header";
import { styled } from "@mui/material/styles";
import logo from "../assets/images/icons/plain-white-icon.png";
import { Link } from "react-router-dom";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";

const LandingPageFooter = () => {
  const footerData = [
    {
      title: "Quick Links",
      links: [
        { name: "Home", path: "/" },
        { name: "Vendor & Services", path: "/vendor-services" },
        { name: "About Us", path: "/about-us" },
        { name: "Resource Center", path: "/resource-center" },
        { name: "Contact Us", path: "/contact-us" },
      ],

      size: 2.5,
    },
    {
      title: "Departments",
      links: [
        { name: "Captain", path: "/captain" },
        { name: "Chef/Galley", path: "/chef-galley" },
        { name: "Engineering", path: "/engineering" },
        { name: "Crew", path: "/crew" },
        { name: "Interior", path: "/interior" },
        { name: "Exterior", path: "/exterior" },
      ],
      size: 2.5,
    },
    // {
    //     title: "Contacts",
    //     links: [
    //         { name: "contact@yachtcrewcenter.com", path: "mailto:contact@yachtcrewcenter.com" },
    //         { name: "+1 954 532 0550", path: "tel:+19545320550" },
    //     ],
    //     size: 3,
    // },
  ];
  return (
    <Box
      sx={{
        background: "#011632",
        width: "100%",
        minHeight: "40vh", // Use minHeight instead of height for flexibility
        display: "flex",
        justifyContent: "center",
        alignItems: "center", // Center content
        flexDirection: "column",
        maxWidth: "100vw",
      }}
    >
      <Container
        maxWidth="lg"
        disableGutters
        sx={{
          py: 4, // Padding instead of margin
          px: { xs: 2, sm: 4, md: 8 }, // Responsive padding
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: "31px",
        }}
      >
        <Grid container spacing={1}>
          {/* First column (2x wider, but responsive) */}
          <Grid item xs={12} sm={6} md={4}>
            <Box
              sx={{
                textAlign: "left",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              <Box>
                <img
                  src={logo}
                  alt="logo"
                  style={{ width: "70px", height: "65px" }}
                />
              </Box>
              <Box>
                <Link to="/contact-us" style={{ textDecoration: "none" }}>
                  <GradientButton>
                    <ButtonTypography
                      sx={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "white",
                      }}
                    >
                      Contact Yacht Crew Center, LLC
                    </ButtonTypography>
                  </GradientButton>
                </Link>
              </Box>
            </Box>
          </Grid>

          {/* Remaining 3 columns (equal width, responsive) */}
          {footerData.map((link, index) => (
            <Grid item xs={12} sm={3} md={link.size} key={index}>
              <Box sx={{ textAlign: "left" }}>
                <FooterHeadingTypography>{link.title}</FooterHeadingTypography>
                <List>
                  {link.links.map((linkItem, idx) => (
                    <ListItem
                      key={idx}
                      component={Link}
                      to={linkItem.path}
                      sx={{ paddingLeft: "0px", paddingBlock: "5px" }}
                    >
                      <FooterTypography>{linkItem.name}</FooterTypography>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12} md={12} lg={9}>
            <Box sx={{ 
              textAlign: { xs: 'center', md: 'left' },
              marginBottom: { xs: '20px', md: '0' }
            }}>
              <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'center', sm: 'flex-start' },
                gap: { xs: '10px', sm: '0' },
                justifyContent: { xs: 'center', sm: 'flex-start' }
              }}>
                <CopyrightText>
                  © 2025 SC Yacht Crew Center LLC . All Rights Reserved.
                </CopyrightText>
                <Box component="span" sx={{ 
                  display: { xs: 'none', sm: 'inline' },
                  mx: 2,
                  color: '#E0E0E0'
                }}>|</Box>
                <FooterLink href="/terms-and-conditions">Terms and Conditions</FooterLink>
                <Box component="span" sx={{ 
                  display: { xs: 'none', sm: 'inline' },
                  mx: 2,
                  color: '#E0E0E0'
                }}>|</Box>
                <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={12} lg={3}>
            <Box
              sx={{
                textAlign: { xs: 'center', lg: 'right' },
                display: 'flex',
                justifyContent: { xs: 'center', lg: 'flex-end' },
                gap: '10px',
                marginTop: { xs: '20px', md: '0' }
              }}
            >
              <SocialIconLink href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FacebookIcon sx={{ color: "white" }} />
              </SocialIconLink>
              <SocialIconLink href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <InstagramIcon sx={{ color: "white" }} />
              </SocialIconLink>
              <SocialIconLink href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                <YouTubeIcon sx={{ color: "white" }} />
              </SocialIconLink>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

const ButtonTypography = styled(Typography)({
  fontSize: "16px",
  fontFamily: "Inter, sans-serif",
  lineHeight: "19px",
  fontWeight: 600,
  display: "flex",
  justifyContent: "center",
});

const FooterHeadingTypography = styled(Typography)({
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 600,
  fontSize: "20px",
  lineHeight: "24px",
  letterSpacing: "0%",
  color: "#FFFFFF",
  whiteSpace: "nowrap"
});

const FooterTypography = styled(Typography)(({ theme }) => ({
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 400,
  fontSize: "16px",
  lineHeight: "21px",
  letterSpacing: "0%",
  color: "#E0E0E0",
  transition: "all 0.3s ease-in-out",
  position: "relative",
  "&:hover": {
    color: "#0487D9",
    transform: "translateX(5px)",
  },
  "&:after": {
    content: '""',
    position: "absolute",
    width: "0",
    height: "2px",
    bottom: -2,
    left: 0,
    background: "#0487D9",
    transition: "width 0.3s ease-in-out",
  },
  "&:hover:after": {
    width: "100%",
  },

  [theme.breakpoints.up("md")]: {
    whiteSpace: "nowrap",
  },

  [theme.breakpoints.down("sm")]: {
    whiteSpace: "normal",
  },
}));

const FooterLink = styled(Link)({
  color: "#E0E0E0",
  textDecoration: "none",
  transition: "all 0.3s ease-in-out",
  position: "relative",
  "&:hover": {
    color: "#0487D9",
    transform: "translateX(5px)",
  },
  "&:after": {
    content: '""',
    position: "absolute",
    width: "0",
    height: "2px",
    bottom: -2,
    left: 0,
    background: "#0487D9",
    transition: "width 0.3s ease-in-out",
  },
  "&:hover:after": {
    width: "100%",
  }
});

const SocialIconLink = styled('a')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px) scale(1.1)',
    '& svg': {
      color: '#0487D9 !important',
    }
  },
  '& svg': {
    fontSize: '24px',
    transition: 'all 0.3s ease-in-out',
  }
});

const CopyrightText = styled(Typography)(({ theme }) => ({
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 400,
  fontSize: "16px",
  lineHeight: "21px",
  letterSpacing: "0%",
  color: "#E0E0E0",
  [theme.breakpoints.up("md")]: {
    whiteSpace: "nowrap",
  },
  [theme.breakpoints.down("sm")]: {
    whiteSpace: "normal",
  },
}));

export default LandingPageFooter;
