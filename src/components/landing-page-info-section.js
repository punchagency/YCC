import React from 'react'
import { Box, Typography, Button, styled, Container, Grid } from '@mui/material'
import logo from '../assets/images/captain/logo.png'
const LandingPageInfoSection = ({ data }) => {
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

                    <Grid item xs={12} md={7}>
                        {/* Wrapper for the first image */}
                        <div style={{ position: "relative", display: "inline-block", width: "100%" }}>
                            {/* First Image */}
                            <img
                                src={data.image}
                                alt="Yacht Crew Center"
                                style={{ width: "100%", height: "auto", display: "block" }}
                            />

                            {/* Second Image (Icon) - Centered Inside `collage` */}
                            <img
                                src={logo}
                                alt="Icon"
                                style={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)", // Ensures proper centering
                                    width: "100px", // Adjust size as needed
                                    height: "auto",
                                }}
                            />
                        </div>
                    </Grid>


                    <Grid item xs={12} md={5} sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "28px",
                        textAlign: { xs: "center", md: "left" },
                        alignItems: "start",
                    }}>

                        <HeadingText>
                            {data.title}
                        </HeadingText>

                        <SecondarySubTextBlack variant='body1'>
                            {data.subText1}
                        </SecondarySubTextBlack>
                        <SecondarySubTextBlack variant='body1'>
                            {data.subText2}
                        </SecondarySubTextBlack>

                        {data.button && (
                            <GradientButton>
                                <ButtonTypography sx={{ color: "white" }}>{data.button.text}</ButtonTypography>
                            </GradientButton>
                        )}
                    </Grid>
                </Grid>



            </Container>

        </Box>
    )
}

export const linearGradient = "linear-gradient(90deg, #034D92, #0487D9)";
export const linearGradient2 = "linear-gradient(90deg, #0487D9, #034D92)";

const SecondarySubTextBlack = styled(Typography)({
    fontFamily: "Inter",
    fontWeight: 400,
    fontSize: "18px",
    lineHeight: "26.55px",
    letterSpacing: "-0.03em",
    color: "#373737",
    textAlign: "justify",
})

const HeadingText = styled(Typography)({
    color: "#131313",
    fontFamily: "Plus Jakarta Sans, sans-serif",
    fontWeight: 500,
    fontSize: "45px",
    lineHeight: "51px",
    letterSpacing: "-0.02em",
    paddingBottom: "31px", // Adds space between text and border
    borderBottom: "1px solid  #02214B59",
})

export const ButtonTypography = styled(Typography)({
    fontSize: "16px",
    fontFamily: "Inter, sans-serif",
    lineHeight: "19px",
    fontWeight: 600,
  });
  
  export const GradientButton = styled(Button)({
    background: linearGradient,
    fontSize: "16px",
    fontFamily: "Inter, sans-serif",
    textTransform: "none",
    "&:hover": {
      background: linearGradient2,
    },
    padding: "12px 14px",
  });
export default LandingPageInfoSection