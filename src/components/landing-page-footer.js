import React from 'react'
import { Box, Container, Typography, Grid, List, ListItem } from '@mui/material'
import { GradientButton } from './landing-page-header'
import { ButtonTypography } from './landing-page-header'
import { styled } from '@mui/material/styles'
import logo from '../assets/images/logo.png'
import { Link } from 'react-router-dom'
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';

const LandingPageFooter = () => {
    const footerLinks = [
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
                                    Contact Yacht Crew Center, LLC
                                </ButtonTypography>
                            </GradientButton>
                        </Box>
                    </Box>
                </Grid>

                {/* Remaining 3 columns (equal width, responsive) */}
                {footerLinks.map((link, index) => (
                    <Grid item xs={12} sm={3} md={link.size} key={index}>
                        <Box sx={{ textAlign: "left" }}>
                            <FooterHeadingTypography>{link.title}</FooterHeadingTypography>
                            <List>
                                {link.links.map((linkItem, idx) => (
                                    <ListItem key={idx} sx={{ paddingLeft: "0px" , paddingBlock: "5px"}}>
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
                            Copyright © 2025 Yacht Crew Center, LLC. All rights reserved.  | <Link href="/terms-and-conditions">Terms and Conditions</Link> |  <Link href="/privacy-policy">Privacy Policy</Link>
                        </FooterTypography>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={3}>
                    <Box sx={{ textAlign: "right", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                        
                            <FacebookIcon />
                            <InstagramIcon />
                            <YouTubeIcon />
                    </Box>
                </Grid> 
            </Grid>
        </Container>
    </Box>

    )
}


const FooterHeadingTypography = styled(Typography)({
    fontFamily: "Plus Jakarta Sans",
    fontWeight: 600,
    fontSize: "20px",
    lineHeight: "24px",
    letterSpacing: "0%",
    color: "#FFFFFF",
    whiteSpace: "nowrap",
})

const FooterTypography = styled(Typography)({
    fontFamily: "Plus Jakarta Sans",
    fontWeight: 400,
    fontSize: "16px",
    lineHeight: "21px",
    letterSpacing: "0%",
    color: "#FFFFFF",
    whiteSpace: "nowrap",
})

export default LandingPageFooter