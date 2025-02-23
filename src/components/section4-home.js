import React from 'react'
import { Box, Typography, Container, Button, styled, Grid, Badge } from '@mui/material'
import { GradientButton, ButtonTypography, linearGradient } from './landing-page-header'
import yatch from '../assets/images/YCC-yatch.png'
import banner from '../assets/images/YCC-home-banner.png'
import playIcon from '../assets/images/icons/play-button.png'
const Section4Home = () => {
    return (
        <Box sx={{
            paddingBottom: '288px',// must be exactly 60% of the overflowing box at the end
            //backgroundColor: 'pink',
        }}>
            <Box
                sx={{
                    backgroundImage: `url(${banner})`,
                    backgroundSize: "cover",
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '1032px',
                    width: '100%',
                    position: 'relative',
                    overflow: 'visible',
                }}
            >
                <Container maxWidth="lg" sx={{
                    justifyContent: 'center',
                    display: 'flex'
                }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        width: '944px',
                        gap: '30px'
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
                            <GradientButton>
                                <ButtonTypography
                                    sx={{ fontSize: "14px", fontWeight: "600", color: "white" }}
                                >
                                    Join Our Network Now
                                </ButtonTypography>
                            </GradientButton>
                        </Box>
                    </Box>

                    <Box sx={{
                        position: 'absolute', // Position it relative to the red box
                        bottom: '0', // Aligns to the bottom
                        left: '50%', // Center it horizontally
                        transform: 'translate(-50%, 60%)', // Shift left by 50% of width and down by 50% of height
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '1180px', // Adjust width as needed
                        height: '480px', // Adjust height as needed
                    }}>


                        <Grid container rowSpacing={0} columnSpacing={4} sx={{
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
                                    paddingTop: "40px",

                                }}>
                                        <Box
                                            sx={{
                                                width: 8, // Controls the size of the badge anchor
                                                height: 8,
                                                display: "inline-block",
                                                backgroundColor: "#295FD1", // Keeps it invisible but structured
                                                borderRadius: '20px'
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

                                <Box sx={{ display: "flex", gap: "15px" }}>
                                    <GradientButton>
                                        <ButtonTypography sx={{ color: "white" }}>Resource Center</ButtonTypography></GradientButton>
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
                                <Box>
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

const SecondarySubTextBlack = styled(Typography)({
    fontFamily: "Inter",
    fontWeight: 400,
    fontSize: "15.26px",
    lineHeight: "22.51px",
    letterSpacing: "0%",
    color: "#373737",
    display: 'inline-block',
    width: '500px'
})


export const HeadingText = styled(Typography)({
    color: "white",
    fontFamily: "Plus Jakarta Sans, sans-serif",
    fontWeight: 500,
    fontSize: "46px",
    lineHeight: "51px",
    letterSpacing: "-2%",
})

export const HeadingTextBlack = styled(Typography)({
    color: "#131313",
    fontFamily: "Plus Jakarta Sans, sans-serif",
    fontWeight: 500,
    fontSize: "46px",
    lineHeight: "51px",
    letterSpacing: "-2%",
})


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