import { Box, Typography } from '@mui/material'
import banner from '../../assets/images/about-us/YCC-about-us-banner.png'
import LandingPageBanner from '../../components/landing-page-banner'
import LandingPageFooter from '../../components/landing-page-footer'
import Section1AboutUs from '../../components/about/section1-about-us'
import Section2AboutUs from '../../components/about/section2-about-us'
import Section3AboutUs from '../../components/about/section3-about-us'
import Section4AboutUs from '../../components/about/section4-about-us'
import Section5AboutUs from '../../components/about/section5-about-us'
import LandingPageChatbot from '../../components/chatbot/landing-page-chatbot'
import { useEffect } from 'react'
const AboutUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const backgroundImage = banner
  const header = (
    <>
      Yacht Crew <br /> Center - Here To <br /> <GradientText>Assist</GradientText>{" "}
      <GradientText>You</GradientText>
    </>
  );
  const subtext2 = "Have questions or need assistance? Connect with our dedicated team for personalized support tailored to the yachting community."
  const button1 = {
    text: 'Join Now',
    path: '/get-started'
  }
  return (
    <>
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        gap: {
          xs: "0px",
          md: "120px",
          lg: "60px"
        },
        marginBottom: { xs: "45px", sm: "23px", md: "35px" },
      }}>
        <LandingPageBanner
          backgroundImage={backgroundImage}
          header={header}
          subtext2={subtext2}
          button1={button1}
        />

        <Section1AboutUs />
        <Section2AboutUs />
        <Section3AboutUs />
        <Section4AboutUs />
        <Section5AboutUs />
        <LandingPageChatbot />
        <LandingPageFooter />
      </Box>
    </>
  )
}

const linearGradientLight = `linear-gradient(86.8deg, #FFFFFF -51.91%, #209DEB 84.68%)`;
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

export default AboutUs  
