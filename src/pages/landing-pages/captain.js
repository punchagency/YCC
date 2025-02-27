import React from 'react'
import banner from '../../assets/images/captain/YCC-captain-banner.png'
import LandingPageBanner from '../../components/landing-page-banner'
import LandingPageFooter from '../../components/landing-page-footer'
import { Typography, Box } from '@mui/material'
import Section1Captain from '../../components/captain/section1-captain'
import Section2Captain from '../../components/captain/section2-captain'
import Section3Captain from '../../components/captain/section3-captain'
const CaptainLandingPage = () => {

const backgroundImage = banner
  const header = (
    <>
     Supporting <GradientText>yatch</GradientText>{" "}
      <GradientText>captains</GradientText> in leadership and excellence
    </>
  );
  const subtext2 = 'From compliance to guest experiences, access the resources you need to master every aspect of yacht operations.'
  const button1 = {
    text: 'Join Our Crew Network',
    path: '/get-started'

  }

  return (
    <Box sx={{
        display: "flex",
        flexDirection: "column",
        gap: "120px",
      }}>
        <LandingPageBanner
        backgroundImage={backgroundImage}
        header={header}
        subtext2={subtext2}
        button1={button1}
        />
        <Section1Captain />
        <Section2Captain />
        <Section3Captain />

        <LandingPageFooter />
      </Box>
  )
}

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
        xs: "32px", // Smaller font for mobile
        sm: "40px",
        md: "48px",
        lg: "55.96px",
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

export default CaptainLandingPage