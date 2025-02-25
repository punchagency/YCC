import React from 'react'
import { Box, Typography, Container, Button, styled, Grid } from '@mui/material'
import { GradientButton, ButtonTypography, linearGradient } from '../landing-page-header'
import yatch from '../../assets/images/YCC-yatch.png'
import banner from '../../assets/images/water-wide.png'
import playIcon from '../../assets/images/icons/play-button.png'
const Section5AboutUs = () => {

    return (
        <Box sx={{
            paddingBottom: { xs: "510px", md: "288px" },
        }}>
            <Box
                sx={{
                    backgroundImage: `url(${banner})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: { xs: "500px", sm: "700px", md: "900px", lg: "1032px" },
                    width: '100%',
                    position: 'relative',
                    overflow: 'visible',
                    padding: { xs: "20px", md: "0" },
                }}
            >
                <Container maxWidth="lg" sx={{
                    justifyContent: 'center',
                    display: 'flex',

                }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        width: { xs: "100%", sm: "90%", md: "80%", lg: "944px" },
                        gap: { xs: "20px", sm: "25px", md: "30px" },
                    }}>
                        <Box>
                            <img src={playIcon} alt="play" width='91px' height='91px' />
                        </Box>

                        <Box>
                            <HeadingText>Our Mission</HeadingText>
                        </Box>

                        <Box>
                            <SecondarySubText>To inspire and support yachting professionals by providing access to the best resources, services, and connections, ensuring their success both on and off the water.</SecondarySubText>
                        </Box>


                    </Box>

                    <Box sx={{
                        position: 'absolute', // Position it relative to the red box
                        bottom: '0', // Aligns to the bottom
                        left: '50%', // Center it horizontally
                        transform: {
                            xs: "translate(-50%, 100%)", // Directly below for small screens
                            sm: "translate(-50%, 30%)", // Slight offset for tablets
                            md: "translate(-50%, 45%)", // Adjusted for medium screens
                            lg: "translate(-50%, 60%)", // Default large screen behavior
                        },
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: {
                            xs: "90%", // Mobile: take almost full width
                            sm: "80%", // Tablets: slightly smaller
                            md: "70%", // Medium screens
                            lg: "1180px", // Large screens: fixed width
                        },
                        height: {
                            xs: "300px", // Smaller height on mobile
                            sm: "400px",
                            md: "480px", // Original height on larger screens
                        },
                        flexWrap: { xs: "wrap", md: "nowrap" },
                    }}>


                        <Grid container rowSpacing={{ xs: 3, md: 0 }} columnSpacing={{ xs: 0, md: 4 }} sx={{
                            flexWrap: "wrap",
                            backgroundColor: "white",
                            borderRadius: '9px',
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
                                    Ready To Enhance Your Yachting Career?
                                    </HeadingTextBlack>
                                </Box>
                                <SecondarySubTextBlack >
                                Connect with us and explore the resources that can make a difference in your career.
                                </SecondarySubTextBlack>

                                <Box sx={{ display: "flex", gap: "15px" }}>
                                    <GradientButton>
                                        <ButtonTypography sx={{ color: "white" }}>Join Our Crew Network</ButtonTypography></GradientButton>
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Box >
                                    <img src={yatch} alt="Yacht Crew Center"
                                        style={{ width: "100%", height: "100%", maxWidth: "100%", borderTopRightRadius: "8px", borderBottomRightRadius: "8px" }} />
                                </Box>

                            </Grid>
                        </Grid>

                    </Box>
                </Container>
            </Box>
        </Box>
    )
}

const SecondarySubText = styled(Typography)({
    fontFamily: "Inter",
    fontWeight: 400,
    fontSize: "15.26px",
    lineHeight: "22.51px",
    letterSpacing: "0%",
    color: "white",
})


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


const BadgeText = styled(Typography)({
    color: '#295FD1',
    fontFamily: "Inter",
    fontWeight: 600,
    fontSize: "14px",
    lineHeight: "16.94px",
    letterSpacing: "-2%",
    textTransform: "uppercase",
    display: "inline-block",
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
export default Section5AboutUs;
