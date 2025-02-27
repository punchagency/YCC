import React from 'react'
import { Box, Typography, Container, Button, styled, Grid } from '@mui/material'
import { GradientButton, ButtonTypography, linearGradient } from './landing-page-header'
import yatch from '../assets/images/YCC-yatch.png'
import banner from '../assets/images/water-wide.png'
import playIcon from '../assets/images/icons/play-button.png'
import { Link } from 'react-router-dom'
const Section4Home = () => {
    return (
        <Box sx={{
            paddingBottom: { xs: "710px", md: "288px" },// must be exactly 60% of the overflowing box at the end
            //backgroundColor: 'pink',
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
                            <HeadingText>Join Our Crew Network</HeadingText>
                        </Box>

                        <Box>
                            <SecondarySubText>Become part of a safer, better managed and transparent yachting community. By joining our Crew Network, you'll connect with verified industry professionals. Access management tools, personalized AI assistants and a worldwide network. Join our journey and help shape the future of Yachting today.</SecondarySubText>
                        </Box>

                        <Box>
                            <Link to='/get-started'>
                                <GradientButton>
                                    <ButtonTypography
                                        sx={{ fontSize: "14px", fontWeight: "600", color: "white" }}
                                    >
                                        Join Our Network Now
                                    </ButtonTypography>
                                </GradientButton>
                            </Link>
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
                                alignItems: { xs: "center", md: "flex-start" },

                            }}>
                                <Box sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "12px",

                                }}>
                                    <Box sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        flexDirection: "row",
                                        padding: { xs: "20px 20px 0 20px", md: "40px 0 0 0" },
                                    }}>
                                        <Box
                                            sx={{
                                                width: 8, // Controls the size of the badge anchor
                                                height: 8,
                                                display: "inline-block",
                                                backgroundColor: "#295FD1", // Keeps it invisible but structured
                                                borderRadius: '20px',
                                            }}
                                        />
                                        <BadgeText>
                                            Resources
                                        </BadgeText>
                                    </Box>


                                    <HeadingTextBlack>
                                        Expert Advice, Tips, And Trends for Yachting Professionals
                                    </HeadingTextBlack>
                                </Box>
                                <SecondarySubTextBlack >
                                    Gain access to valuable knowledge, practical tips, and industry updates tailored for yacht crew. Whether you’re managing operations or advancing your career, our blog is your resource for success.
                                </SecondarySubTextBlack>

                                <Box sx={{ display: "flex", gap: "15px", padding: { xs: "0 20px 0 20px", md: "0 0 0 0" } }}>
                                    <Link to='/resource-center' >
                                        <GradientButton>
                                            <ButtonTypography sx={{ color: "white" }}>Resource Center</ButtonTypography>
                                        </GradientButton>
                                    </Link>
                                    <Button variant='outlined'

                                        sx={{
                                            position: "relative",
                                            overflow: "hidden",
                                            border: "none", // Remove the border since we use background trick
                                            borderRadius: "8px",
                                            padding: "10px 20px",
                                            background: "transparent",
                                            textTransform: "none",
                                            "&::before": {
                                                content: '""',
                                                position: "absolute",
                                                inset: 0,
                                                padding: "2px", // Controls the border thickness
                                                borderRadius: "inherit",
                                                background: linearGradient, // Use your gradient here
                                                WebkitMask:
                                                    "linear-gradient(white, white) content-box, linear-gradient(white, white)",
                                                WebkitMaskComposite: "destination-out",
                                            }
                                        }}

                                    >
                                        <ButtonTypography sx={{ color: "#000005C" }}>Enter Your Email  For Weekly Article</ButtonTypography></Button>
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Box
                                    sx={{
                                        position: 'relative',
                                        height: '100%'
                                    }} >
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
export default Section4Home