import React from 'react'
import { Box, Typography, Container, Button, styled, Grid } from '@mui/material'
import { ButtonTypography, linearGradient } from './landing-page-header'
import yatch from '../assets/images/YCC-yatch.png'
import banner from '../assets/images/water.png'
import { Link } from 'react-router-dom'
const LandingPageExitCard = ({ sectionData }) => {

    return (
        <Box sx={{
            paddingBottom: '288px',// must be exactly 60% of the overflowing box at the end
        }}>
            <Box
                sx={{
                    backgroundImage: `url(${banner})`,
                    backgroundSize: "cover",
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: { xs: '40vh', md: '30vh', lg: '50vh' },
                    width: '100%',
                    position: 'relative',
                    overflow: 'visible',
                }}
            >
                <Container maxWidth={{ xs: "xs", sm: "sm", md: "lg" }} sx={{
                    justifyContent: 'center',
                    display: 'flex',
                }}>

                    <Box sx={{
                        position: 'absolute', // Position it relative to the red box
                        bottom: '0', // Aligns to the bottom
                        left: '50%', // Center it horizontally     
                        transform: {
                            xs: "translate(-50%, 50%)", // Directly below for small screens
                            sm: "translate(-50%, 50%)", // Slight offset for tablets
                            md: "translate(-50%, 30%)", // Adjusted for medium screens
                            lg: "translate(-50%, 60%)", // Default large screen behavior
                        },
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: { xs: '90%', sm: '95%', md: '1000px', lg: '1180px' }, // Responsive width
                        height: { xs: 'auto', sm: '300px', md: '400px', lg: '480px' }, // Responsive height
                        flexWrap: 'wrap', // Prevents overflow on small screens
                        padding: { xs: '16px', sm: '24px', md: '32px', lg: '0px' }, // Adds padding for better spacing
                        gap: { xs: '8px', md: '16px' }, // Adds spacing between child elements
                    }}>


                        <Grid container rowSpacing={{ xs: 3, md: 0 }} columnSpacing={{ xs: 0, md: 4 }} sx={{
                            flexWrap: "wrap",
                            borderRadius: '9px',
                            backgroundColor: 'white',
                            boxShadow: "0px 4px 10.2px 0px #0000001A"
                        }}>


                            <Grid item xs={12} md={6} sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "28px",
                                textAlign: { xs: "center", md: "left" },
                                padding: { xs: '16px', sm: '24px', md: '32px', lg: '40px' }, // Adds padding for better spacing
                                justifyContent: 'center'

                            }}>
                                <Box sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "12px",

                                }}>

                                    <HeadingTextBlack>
                                        {sectionData.title}
                                    </HeadingTextBlack>
                                </Box>
                                <SecondarySubTextBlack >
                                    {sectionData.subText}
                                </SecondarySubTextBlack>

                                <Box sx={{ display: "flex", gap: "15px", justifyContent: 'center' }}>
                                    <Link to={sectionData.button.path}>
                                        <GradientButton>
                                            <ButtonTypography sx={{ color: "white" }}>{sectionData.button.text}</ButtonTypography>
                                        </GradientButton>
                                    </Link>
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Box sx={{
                                    position: 'relative',
                                    height: '100%'
                                }}>
                                    <img src={yatch} alt="Yacht Crew Center"
                                        style={{ width: "100%", height: "100%", maxWidth: "100%", borderTopRightRadius: "8px", borderBottomRightRadius: "8px" }} />

                                    <Box
                                        sx={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0, // Ensure it starts from the left
                                            background: "linear-gradient(90deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%)",
                                            height: "100%",
                                            width: "35%",
                                            zIndex: 1, // Ensure it appears above the image
                                        }}
                                    />


                                </Box>

                            </Grid>
                        </Grid>

                    </Box>
                </Container>
            </Box>
        </Box>
    )
}


export const linearGradient2 = "linear-gradient(90deg, #0487D9, #034D92)";


export const SecondarySubTextBlack = styled(Typography)(({ theme }) => ({
    fontFamily: "Inter",
    fontWeight: 400,
    fontSize: "15.26px", // Default for large screens
    lineHeight: "22.51px",
    letterSpacing: "0%",
    color: "#373737",
    display: "inline-block",
    width: "100%", // Makes it flexible

    [theme.breakpoints.down("md")]: {
        fontSize: "14px",
        lineHeight: "20px",
        width: "500px", // Reduce width on tablets
    },
    [theme.breakpoints.down("sm")]: {
        fontSize: "13px",
        lineHeight: "18px",
        width: "100%", // Full width on mobile
        padding: "0 20px 0 20px"
    },
}));

export const HeadingText = styled(Typography)(({ theme }) => ({
    color: "white",
    fontFamily: "Plus Jakarta Sans, sans-serif",
    fontWeight: 500,
    fontSize: "46px", // Default size

    lineHeight: "51px",
    letterSpacing: "-2%",

    [theme.breakpoints.down("lg")]: {
        fontSize: "42px",
        lineHeight: "48px",
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
export const HeadingTextBlack = styled(Typography)(({ theme }) => ({
    color: "#131313",
    fontFamily: "Plus Jakarta Sans, sans-serif",
    fontWeight: 500,
    fontSize: "46px", // Default for large screens
    lineHeight: "51px",
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




const GradientButton = styled(Button)({
    background: linearGradient,
    fontSize: "16px",
    fontFamily: "Inter, sans-serif",
    textTransform: "none",
    "&:hover": {
        background: linearGradient2,
    },
    padding: "17.5px 89px",
});


export const GradientText = styled(Typography)({
    background: linearGradient,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontFamily: "Inter",
    fontWeight: 600,
    fontSize: "14px",
    lineHeight: "16.94px",
    letterSpacing: "-2%",
    textTransform: "uppercase",
    display: "inline-block",
});

export default LandingPageExitCard