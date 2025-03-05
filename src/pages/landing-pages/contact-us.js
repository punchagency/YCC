import { Box, Typography } from '@mui/material'
import banner from '../../assets/images/contact-us/YCC-contact-us-banner.png'
import LandingPageBanner from '../../components/landing-page-banner'
import LandingPageFooter from '../../components/landing-page-footer'
import Section1ContactUs from '../../components/contact-us/section1-contact-us'


const ContactUs = () => {
    
    const backgroundImage = banner
    const header = (
        <>
        Contact Yacht<br />  <GradientText>Crew</GradientText>{" "}
            <GradientText>Center</GradientText> – We're here for you
        </> 
    );
    const subtext2 = "Have questions or need specialized assistance? Connect with our dedicated team for personalized support. Tailored specifically for the Yachting community."
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
            <Section1ContactUs />
            
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
export default ContactUs;
