import React from 'react'
import { Box, Container, Typography, Grid, List, ListItem, Icon } from '@mui/material'
import { GradientButton } from './landing-page-header'
import { styled } from '@mui/material/styles'
import logo from '../assets/images/icons/plain-white-icon.png'
import anchor from '../assets/images/icons/anchor.png'
import { Link } from 'react-router-dom'
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';

const LandingPageFooter = () => {
    const footerData = [
        {
            title: "Quick Links",
            links: ["Home", "Departments", "Vendors & Services", "About Us", "Resource Center"],
            size: 2,
        },
        {
            title: "Departments",
            links: ["Captains", "Chef Gallery", "Engineering", "Crew", "Interior", "Exterior"],
            size: 2,
        },
        {
            title: "Contacts",
            links: ["contact@yachtcrewcenter.com", "+1 954 532 0550t"],
            size: 2.3,
        },
    ]
    return (<Box
        sx={{
            background: "#011632",
            width: "100%",
            minHeight: "40vh", // Use minHeight instead of height for flexibility
            display: "flex",
            justifyContent: "center",
            alignItems: "center", // Center content
            flexDirection: "column",
        }}
    >

        <Box
            sx={{
                p: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "31px",
                width: "100%",
                backgroundColor: "white",

            }}>
            <FooterGradientHeadingTypography>
                CREW CENTER</FooterGradientHeadingTypography>

        </Box>

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
            <Grid container spacing={2}>
                {/* First column (2x wider, but responsive) */}
                <Grid item xs={12} sm={6} md={5.7}>
                    <Box sx={{ textAlign: "left" }}>
                        <Box>
                            <img
                                src={logo}
                                alt="logo"
                                style={{ width: "53px", height: "45px" }}
                            />
                        </Box>
                        <Box>
                            <GradientButton>
                                <ButtonTypography
                                    sx={{ fontSize: "14px", fontWeight: "600", color: "white" }}
                                >
                                    Contact Yacht Crew Center, LLC &nbsp; <img
                                src={anchor}
                                alt="logo"
                            
                            />
                                </ButtonTypography>
                            </GradientButton>
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
                                    <ListItem key={idx} sx={{ paddingLeft: "0px", paddingBlock: "5px" }}>
                                        <FooterTypography

                                        >
                                            {linkItem}
                                        </FooterTypography>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={9}>
                    <Box sx={{ textAlign: "left" }}>
                        <FooterTypography>
                            © 2025 SC Yacht Crew Center  LLC . All Rights Reserved.&nbsp;&nbsp;|&nbsp;&nbsp;
                            <FooterLink href="/terms-and-conditions">Terms and Conditions</FooterLink>&nbsp;&nbsp;|&nbsp;&nbsp;
                            <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
                        </FooterTypography>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={3}>
                    <Box sx={{ textAlign: "right", display: "flex", justifyContent: "flex-end", gap: "10px" }}>

                        <FacebookIcon sx={{ color: "white" }} />
                        <InstagramIcon sx={{ color: "white" }} />
                        <YouTubeIcon sx={{ color: "white" }} />
                    </Box>
                </Grid>
            </Grid>
        </Container>
    </Box>

    )
}

const ButtonTypography = styled(Typography)({
    fontSize: "16px",
    fontFamily: "Inter, sans-serif",
    lineHeight: "19px",
    fontWeight: 600,
    display: 'flex',
    justifyContent: 'center'
  });

const FooterGradientHeadingTypography = styled(Typography)(({ theme }) => ({
    fontFamily: "Plus Jakarta Sans",
    fontWeight: 600,
    fontSize: "13.5vw",
    lineHeight: "1",
    letterSpacing: "-2%",
    background: "linear-gradient(1.04deg, rgba(19, 19, 19, 0.1) 0.89%, rgba(255, 255, 255, 0.1) 73.3%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    whiteSpace: "nowrap",
    display: "inline-block",
    textAlign: "center",
    padding: 0,
    width: "100%",
    margin: 0,
    padding: 0,


    // 🔹 Responsive Adjustments for Smaller Screens
    [theme.breakpoints.down("md")]: {
        fontSize: "12vw",
    },
    [theme.breakpoints.down("sm")]: {
        fontSize: "14vw",
    },
    [theme.breakpoints.down("xs")]: {
        fontSize: "16vw",
    },

}))

const FooterHeadingTypography = styled(Typography)({
    fontFamily: "Plus Jakarta Sans",
    fontWeight: 600,
    fontSize: "20px",
    lineHeight: "24px",
    letterSpacing: "0%",
    color: "#FFFFFF",
    whiteSpace: "nowrap",
})

const FooterTypography = styled(Typography)(({ theme }) => ({
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 400,
  fontSize: "16px",
  lineHeight: "21px",
  letterSpacing: "0%",
  color: "#E0E0E0",

  [theme.breakpoints.up("md")]: { // No wrap on larger screens (md+)
    whiteSpace: "nowrap",
  },

  [theme.breakpoints.down("sm")]: { // Wrap on small screens
    whiteSpace: "normal",
  },
}))

const FooterLink = styled(Link)({
    color: "#E0E0E0",
    textDecoration: "none",
})


export default LandingPageFooter