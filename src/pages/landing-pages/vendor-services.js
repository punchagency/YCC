import { Box, Typography, styled } from '@mui/material'
import banner from '../../assets/images/vendor-services/YCC-vendor-services-banner.png'
import LandingPageBanner from '../../components/landing-page-banner'
import LandingPageFooter from '../../components/landing-page-footer'
import Section2VendorServices from '../../components/vendor-services/section2-vendor-services'
import LandingPageChatbot from '../../components/chatbot/landing-page-chatbot'
import { useEffect } from 'react'

const VendorAndServices = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
    const backgroundImage = banner
    const header = (
        <>
            VendorS & Suppliers for Yachts: <GradientText>Trusted</GradientText>{" "}
            <GradientText>Solutions</GradientText> at Your Fingertips 
        </> 
    );
    const subtext2 = "Find and connect directly with Yacht Crew. Simplify your order & booking management with Yacht Crew Center's platform .Onboard your Yacht Services and Supplies to simplify Business Management.";
    const button1 = {
        text: 'Join A Comprehensive Global Marketplace',
        path: '/apply'
    }
    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            gap: {
                xs: "120px",
                md: "120px",
                lg: "60px"
            },
        }}>
            <LandingPageBanner
                backgroundImage={backgroundImage}
                header={header}
                subtext2={subtext2}
                button1={button1}
            />
            <Section2VendorServices />
            <LandingPageFooter />
            <LandingPageChatbot />
        </Box>
    )
}

const GradientText = styled(Typography)({
    fontWeight: 600,
    color: "#0487D9",
    fontFamily: "Plus Jakarta Sans, sans-serif",
    fontSize: "50px",
    lineHeight: "60px",
    letterSpacing: "-2%",
    textTransform: "uppercase",
    display: "inline-block",
});

export default VendorAndServices   
