import { Box, Typography, styled } from '@mui/material'
import banner from '../../assets/images/chef-gallery/YCC-chef-gallery-banner.png'
import LandingPageBanner from '../../components/landing-page-banner'
import LandingPageFooter from '../../components/landing-page-footer'
import Section1ChefGallery from '../../components/chef-gallery/section1-chef-gallery'
import Section2ChefGallery from '../../components/chef-gallery/section2-chef-gallery'
import Section3ChefGallery from '../../components/chef-gallery/section3-chef-gallery'   
import { useEffect } from 'react'
import Chatbot from '../../components/chatbot/chatbot'
const ChefGalleryLandingPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
    const backgroundImage = banner
    const header = (
        <>
            Empowering <GradientText>Yacht</GradientText>{" "}
            <GradientText>Chefs</GradientText> to Create Culinary Excellence
        </>  
    );
    const subtext2 = 'From gourmet provisioning to top-tier galley equipment, discover everything you need to elevate onboard dining.'
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
            <Section1ChefGallery />
            <Chatbot />
            <Section2ChefGallery />
            <Section3ChefGallery />
            <LandingPageFooter />
        </Box>
    )

}

const GradientText = styled(Typography)({
    fontWeight: 600,
    color: "#0487D9",
    fontFamily: "Plus Jakarta Sans, sans-serif",
    fontSize: "50px",
    lineHeight: "60px",
    letterSpacing: "-0.02em",
    textTransform: "uppercase",
    display: "inline-block",
});
export default ChefGalleryLandingPage       
