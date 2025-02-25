import React from 'react'
import { Box, Typography, Container, Button, styled, Grid } from '@mui/material'
import { ButtonTypography, linearGradient } from './landing-page-header'
import yatch from '../assets/images/YCC-yatch.png'
import banner from '../assets/images/water.png'
const LandingPageExitCard = ({sectionData}) => {

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
                    height: '50vh',
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
                        transform: 'translate(-50%, 60%)', // Shift left by 50% of width and down by 50% of height
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


                        <Grid container rowSpacing={0} columnSpacing={4} sx={{
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

                                <Box sx={{ display: "flex", gap: "15px" }}>
                                    <GradientButton>
                                        <ButtonTypography sx={{ color: "white" }}>{sectionData.button.text}</ButtonTypography></GradientButton>
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


export const linearGradient2 = "linear-gradient(90deg, #0487D9, #034D92)";

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