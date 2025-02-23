import React from 'react'
import { Box, Typography, Button, styled, Container, Grid, Badge } from '@mui/material'
import yatch from '../assets/images/yatch-home.png'
import { GradientButton, ButtonTypography, linearGradient, linearGradient2 } from './landing-page-header'

const Section1Home = () => {
    return (

        <Box component="section" sx={{
            width: "100%",
        }}>

            <Container maxWidth="lg" sx={{
                display: "flex",
                flexDirection: "row",
                gap: "28px"
            }}>

                <Grid container spacing={4} sx={{
                    flexWrap: "wrap",
                }}>

                    <Grid item xs={12} md={6}>
                        <img src={yatch} alt="Yacht Crew Center"
                            style={{ width: "100%", height: "auto", maxWidth: "100%" }} />
                    </Grid>

                    <Grid item xs={12} md={6} sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "28px",
                        textAlign: { xs: "center", md: "left" },
                    }}>

                        <Box sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            flexDirection: "row",
                        }}>
                            <Badge variant='dot' sx={{
                                "& .MuiBadge-dot": {
                                    background: linearGradient,
                                },
                            }} />
                            <GradientText>
                                Explore The Future of Yachting
                            </GradientText>
                        </Box>
                        <HeadingText>
                            Meet Your AI Assistant for All Things Yachting
                        </HeadingText>

                        <SecondarySubTextBlack variant='body1'>
                            Welcome to the future of yachting support. This AI Assistant is designed to empower every Crew member, Captain, Engineer, Chef, Exterior and Interior teams alike. Whether you’re seeking answers to complex questions, service providers, suppliers or retrieving yacht-specific information.
                        </SecondarySubTextBlack>
                        <SecondarySubTextBlack variant='body1'>
                            Our AI Assistant delivers instant, accurate support tailored to your needs. Ready to experience the power of the AI Assistant? Ask a question now and get tailored solutions in seconds!
                        </SecondarySubTextBlack>
                    </Grid>
                </Grid>



            </Container>

        </Box>
    )
}


export const SecondarySubTextBlack = styled(Typography)({
    fontFamily: "Inter",
    fontWeight: 400,
    fontSize: "15.26px",
    lineHeight: "22.51px",
    letterSpacing: "0%",
    color: "#373737",
})

const HeadingText = styled(Typography)({
    color: "#131313",
    fontFamily: "Plus Jakarta Sans, sans-serif",
    fontWeight: 500,
    fontSize: "46px",
    lineHeight: "51px",
    letterSpacing: "-2%",
})

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
export default Section1Home