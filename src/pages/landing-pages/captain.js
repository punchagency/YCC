import React from 'react'
import { Box, Typography, Button, styled, Container, Grid, Badge } from '@mui/material'
import banner from '../../assets/images/YCC-home-banner2.png'
import { GradientButton, ButtonTypography, linearGradient,linearGradient2 } from '../../components/landing-page-header'
import Section1Home from '../../components/section1-home'
import Section2Home from '../../components/section2-home'
import Section3Home from '../../components/section3-home'
import LandingPageFooter from '../../components/landing-page-footer'


const CaptainLandingPage = () => {
  return (
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      gap: "120px",
    }}>
      <Box
        component="section"
        sx={{
          position: "relative",
          backgroundImage: `url(${banner})`,
          backgroundSize: "cover",
          height: "100vh",
          width: "100%",
        }}
      >


        {/* First Box - 75% of the parent, starting from the left */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "70.3%",
            height: "100%",
            background: "radial-gradient(circle at bottom right, rgba(0, 0, 0, 0.9) 20%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0) 100%)",
            filter: "blur(30.8px)",
          }}
        />

        {/* Second Box - Covers 50% of the parent width */}
        <Box
          sx={{
            position: "absolute",
            top: "0", // Adjust this so it doesn’t overlap
            left: 0,
            width: "55%", // Covers 50% of the parent
            height: "95%",
            background: "radial-gradient(ellipse at bottom right, rgba(0, 0, 0, 0.9) 70%, rgba(0, 0, 0, 0.3) 100%, rgba(0, 0, 0, 0) 100%)",
            filter: "blur(30.8px)",
            alignItems: "center",
            justifyContent: "center",
          }}
        />


        <Box sx={{
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          gap: "28px",
          position: "absolute",
          top: "60%",
          left: "30%",
          transform: "translate(-50%, -50%)",
          textAlign: "left",
          maxWidth: "690px",

        }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <Typography  sx={{
              color: "white",
              fontFamily: "Plus Jakarta Sans, sans-serif",
              fontWeight: 600,
              fontSize: "55.96px",
              lineHeight: "60px",
              letterSpacing: "-2%",
              textTransform: "uppercase",
            }}>
              Your Destination for Crew <GradientText>resources</GradientText> & <GradientText>Vessel </GradientText>Management
            </Typography>

            <PrimarySubText>
              Find local service providers and order your departments supplies. Through our AI supported Global Network. No matter the ask or the time Yacht Crew Center is here to help you succeed.
            </PrimarySubText>
          </Box>
          <SecondarySubText>
            Welcome to Yacht Crew Center, LLC —the trusted hub for Yachting professionals worldwide. Founded by yacht crew for yacht crew, our platform combines industry expertise, personalized support, and global reach to empower your career and simplify vessel management. Whatever your position, Yacht Crew Center is here to help you succeed on and off the water.
          </SecondarySubText>

          <Box sx={{ display: "flex", gap: "15px" }}>
            <GradientButton>
              <ButtonTypography sx={{ color: "white" }}>About Yacht Crew Center</ButtonTypography></GradientButton>
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
              <ButtonTypography sx={{ color: "white" }}>Onboard Vendors & Services</ButtonTypography></Button>
          </Box>
        </Box>

      </Box >

            <Section1Home/>
            <Section2Home/>
            <Section3Home/>
            <LandingPageFooter/>
    </Box>
  );
};


const linearGradientLight =  `linear-gradient(86.8deg, #FFFFFF -51.91%, #209DEB 84.68%)`;

const GradientText = styled(Typography)({
  background: linearGradientLight,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  fontWeight: 600,
  color: "white",
  fontFamily: "Plus Jakarta Sans, sans-serif",
  fontWeight: 600,
  fontSize: "55.96px",
  lineHeight: "60px",
  letterSpacing: "-2%",
  textTransform: "uppercase",
  display: "inline-block",
});

const PrimarySubText = styled(Typography)({
  fontFamily: "Inter",
  fontWeight: 500,
  fontSize: "18.65px",
  lineHeight: "27.52px",
  letterSpacing: "0%",
  color: "white",
})

const SecondarySubText = styled(Typography)({
  fontFamily: "Inter",
  fontWeight: 400,
  fontSize: "15.26px",
  lineHeight: "22.51px",
  letterSpacing: "0%",
  color: "white",
})

export default CaptainLandingPage