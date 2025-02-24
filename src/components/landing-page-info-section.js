import React from 'react'
import { Box, Typography, Button, styled, Container, Grid, Badge } from '@mui/material'
import logo from '../assets/images/captain/logo.png'
const LandingPageInfoSection = ({data}) => {
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
                    }}>

                        <HeadingText>
                           {data.title}
                        </HeadingText>

                        <SecondarySubTextBlack variant='body1'>
                           {data.subText1}
                           </SecondarySubTextBlack>
                        <SecondarySubTextBlack variant='body1'>
                          { data.subText2}
                        </SecondarySubTextBlack>
                    </Grid>
                </Grid>



            </Container>

        </Box>
    )
}

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
export default LandingPageInfoSection