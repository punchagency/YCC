import React, { useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import banner from '../../assets/images/YCC-home-banner-new.png'
import Section1Home from '../../components/section1-home'
import Section2Home from '../../components/section2-home'
import Section3Home from '../../components/section3-home'
import LandingPageFooter from '../../components/landing-page-footer'
import Section4Home from '../../components/section4-home'
import LandingPageBanner from '../../components/landing-page-banner'
import Chatbot from '../../components/chatbot/chatbot'

const HomeLandingPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
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
    text: 'About Yacht Crew Center',
    path: '/about-us'
  }
  const button2 = {
    text: 'Onboard Vendors & Services',
    path: '/vendor-services'
  }
  const page = 'home'
  return (

    <Box sx={{
      display: "flex",
      flexDirection: "column",
      gap: {
        xs: "47px",  // Smaller gap on mobile
        sm: "60px",  // Medium gap on small screens
        md: "90px",  // Larger gap on tablets
        lg: "120px", // Default gap for large screens
      },    
      maxWidth: '100vw'
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
         <Chatbot />
         <Section2Home />
         <Section3Home />
         <Section4Home />
         <LandingPageFooter />
      {/*

   

            
    
       */}
      {/* <Section4Home />*/}
      {/*  <LandingPageFooter />*/}

    </Box>

  );
};

const linearGradientLight =  `linear-gradient(86.8deg, #FFFFFF -51.91%, #209DEB 84.68%)`;
const GradientText = (props) => (
  <Typography
    component="span"
    sx={{
      background: linearGradientLight,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      fontWeight: 600,
      fontFamily: "Plus Jakarta Sans, sans-serif",
      fontSize: {
        xs: "30px",  // Smaller font for mobile
        sm: "35px",  // Slightly bigger for small tablets
        md: "40px",  // Medium screens
        lg: "50px",  // Default for large screens
      },
      lineHeight: {
        xs: "38px", // Smaller line height for mobile
        sm: "45px", // Medium screens
        md: "52px", // Larger screens
        lg: "60px", // Default for large screens
      },
      letterSpacing: "-2%",
      textTransform: "uppercase",
      display: "inline-block",
    }}
  >
    {props.children}
  </Typography>
);


export default HomeLandingPage