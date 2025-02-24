import React from 'react'
import { Box, Typography, styled } from '@mui/material'
import banner from '../../assets/images/YCC-home-banner2.png'
import Section1Home from '../../components/section1-home'
import Section2Home from '../../components/section2-home'
import Section3Home from '../../components/section3-home'
import LandingPageFooter from '../../components/landing-page-footer'
import Section4Home from '../../components/section4-home'
import LandingPageBanner from '../../components/landing-page-banner'


const HomeLandingPage = () => {
  
  const backgroundImage = banner
  const header = (
    <>
      Your Destination for Crew <GradientText>resources</GradientText> &{" "}
      <GradientText>Vessel</GradientText> Management
    </>
  );
  const subtext1 = 'Find local service providers and order your departments supplies. Through our AI supported Global Network. No matter the ask or the time Yacht Crew Center is here to help you succeed.'
  const subtext2 = 'Welcome to Yacht Crew Center, LLC —the trusted hub for Yachting professionals worldwide. Founded by yacht crew for yacht crew, our platform combines industry expertise, personalized support, and global reach to empower your career and simplify vessel management. Whatever your position, Yacht Crew Center is here to help you succeed on and off the water.'
  const button1 = {
    text: 'About Yacht Crew Center'
  }
  const button2 = {
    text: 'Onboard Vendors & Services'
  }
  const page = 'home'
  return (

    <Box sx={{
      display: "flex",
      flexDirection: "column",
      gap: "120px",
    }}>
      <LandingPageBanner
      backgroundImage={backgroundImage}
      header={header}
      subtext1={subtext1}
      subtext2={subtext2}
      button1={button1}
      button2={button2}
      page = {page}
      />

      <Section1Home />
      <Section2Home />
      <Section3Home />
      <Section4Home />
      <LandingPageFooter />
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
  fontSize: "55.96px",
  lineHeight: "60px",
  letterSpacing: "-2%",
  textTransform: "uppercase",
  display: "inline-block",
});


export default HomeLandingPage