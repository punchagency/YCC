import React from 'react';
import {
    Box,
    Typography,
    Button,
    Container,
    Grid,
    styled
} from '@mui/material';
import { Link } from 'react-router-dom'
import { ButtonTypography, linearGradient } from '../landing-page-header';
import Section1A from '../../assets/images/vendor-services/Yacht-Crew-Center-09-10-2025_03_40_PM.png'

const Section1VendorServices = () => {
    return (
        <Box component="section" sx={{
            width: "100%",
            pb: { xs: 6, sm: 8, md: 10 },
        }}>
            <Container maxWidth="lg" sx={{
                display: "flex",
                flexDirection: "column",
                gap: "28px",
                justifyContent: "center",
                alignItems: "center",
            }}>
                <Grid container spacing={1} alignItems="center">
                    {/* Left Column - Images */}
                    <Grid item xs={12} md={6} sx={{
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "start",
                        width: "100%",
                        height: "100%",
                    }}>
                        <Box sx={{
                            width: "100%",
                            height: "500px", // Set fixed height for proper alignment
                            borderRadius: "10px",
                            overflow: "hidden",
                            display: "flex",
                            justifyContent: "start",
                            alignItems: "start",
                        }}>
                            <img 
                                src={Section1A} 
                                alt="Vendor Dashboard" 
                                style={{ 
                                    width: "100%", 
                                    height: "100%", 
                                    objectFit: "cover",
                                    borderRadius: "10px"
                                }} 
                            />
                        </Box>
                    </Grid>

                    {/* Right Column - Content */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{
                            pl: { md: 4 },
                            display: "flex",
                            flexDirection: "column",
                            gap: "28px"
                        }}>
                            <Box sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "12px",
                            }}>
                                <HeadingTextBlack>
                                    Managing your business just got easier with the Yacht Crew Center.
                                </HeadingTextBlack>
                            </Box>

                            <SecondarySubTextBlack>
                                Yacht Crew Center's platform streamlines order and booking management. Ensuring you receive direct requests from those who need your expertise. By onboarding your business, you gain access to a global network, with Global logistics and your personal AI Assistant.
                            </SecondarySubTextBlack>

                            <SecondarySubTextBlack>
                                Our platform connects your services and inventory directly to a global network of Yacht Crew. Professionals actively seeking trusted partners like you. With your business listed in a comprehensive directory, you'll gain visibility across the yachting industry, driving growth and securing consistent orders.
                            </SecondarySubTextBlack>

                            <Box sx={{ display: "flex", gap: "15px", justifyContent: 'start' }}>
                                <Link to={"/apply"}>
                                    <GradientButton
                                        sx={{
                                            width: "240px",
                                            height: "51px",
                                            borderRadius: "6.15px",
                                        }}
                                    >
                                        <ButtonTypography sx={{ color: "white" }}>Apply Now</ButtonTypography>
                                    </GradientButton>
                                </Link>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

// Styled components following LandingPageExitCard patterns
export const SecondarySubTextBlack = styled(Typography)(({ theme }) => ({
    fontFamily: "Inter",
    fontWeight: 400,
    fontSize: "18px", // Default for large screens
    lineHeight: "148%",
    letterSpacing: "0%",
    color: "#373737",
    display: "inline-block",
    width: "100%", // Makes it flexible

    [theme.breakpoints.down("md")]: {
        fontSize: "16px",
        lineHeight: "148%",
        width: "500px", // Reduce width on tablets
    },
    [theme.breakpoints.down("sm")]: {
        fontSize: "16px",
        lineHeight: "148%",
        width: "100%", // Full width on mobile
    },
}));

export const HeadingTextBlack = styled(Typography)(({ theme }) => ({
    color: "#131313",
    fontFamily: "Plus Jakarta Sans, sans-serif",
    fontWeight: 500,
    fontSize: "45px", // Default for large screens
    lineHeight: "111%",
    letterSpacing: "-2%",

    [theme.breakpoints.down("lg")]: {
        fontSize: "30px",
        lineHeight: "40px",
    },
    [theme.breakpoints.down("md")]: {
        fontSize: "36px",
        lineHeight: "44px",
    },
    [theme.breakpoints.down("sm")]: {
        fontSize: "28px",
        lineHeight: "36px",
    },
}));

const linearGradient2 = "linear-gradient(90deg, #0487D9, #034D92)";
const GradientButton = styled(Button)({
    background: linearGradient,
    fontSize: "16px",
    fontFamily: "Inter, sans-serif",
    textTransform: "none",
    "&:hover": {
        background: linearGradient2,
    },
});

export default Section1VendorServices;