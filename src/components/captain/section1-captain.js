import React from 'react'
import { Box, Typography, Button, styled, Container, Grid, Badge } from '@mui/material'
import collage from '../../assets/images/captain/section1.png'
import logo from '../../assets/images/captain/logo.png'
const Section1Captain = () => {
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
            src={collage} 
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
                            Lead With Confidence Using Your AI Assistant
                        </HeadingText>

                        <SecondarySubTextBlack variant='body1'>
                            As a captain, the AI Assistant is your co-pilot for success. Access navigation procedures, compliance resources, and crew management tools seamlessly. Keep your operations smooth and efficient with AI-powered organization and support tailored to your needs. Easily organize and access records, manage scheduling, and stay compliant with certifications and regulatory requirements. As a Yacht Captain, lead with confidence using your AI Agent. You are the leader and ambassador of every voyage. Whether ensuring compliance, coordinating with crew, or delivering exceptional guest experiences, we’ve got you covered.</SecondarySubTextBlack>
                        <SecondarySubTextBlack variant='body1'>
                            Your role demands expertise and precision. Yacht Crew Center, LLC is here to provide the resources and guidance you need to succeed in this dynamic profession.Submit your question to our AI Assistant, and include any helpful context for the most comprehensive advice possible.
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
export default Section1Captain