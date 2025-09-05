import { Box, Typography, styled } from '@mui/material'
import banner from '../../assets/images/vendor-services/YCC-vendor-services-banner.png'
import LandingPageBanner from '../../components/landing-page-banner'
import LandingPageFooter from '../../components/landing-page-footer'
import Section2VendorServices from '../../components/vendor-services/section2-vendor-services'
import LandingPageChatbot from '../../components/chatbot/landing-page-chatbot'
import { useEffect } from 'react'
import Section1VendorServices from '../../components/vendor-services/section1-vendor-services'
import crewCenterWatermark from "../../assets/images/crew-center-watermark.svg";
const VendorAndServices = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
    const backgroundImage = banner
    const header = (
        <>
            VendorS & Services for Yachts: <GradientText>Trusted</GradientText>{" "}
            <GradientText>Solutions</GradientText> at Your Fingertips 
        </> 
    );
    const subtext2 = "Find and connect directly with Yacht Crew. Simplify your order & booking management with Yacht Crew Center's platform .Onboard your Yacht Services and Supplies to simplify Business Management.";
    const button1 = {
        text: 'Join A Comprehensive Global Marketplace',
        path: '/apply'
    }
    return (
        <>
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            gap: {
                xs: "120px",
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
            <Section1VendorServices />
            <Section2VendorServices />
            <LandingPageChatbot />
        </Box>
        <img src={crewCenterWatermark} alt="Yacht Crew Center" style={{ width: "100%", height: "auto" }} />
        <LandingPageFooter />
        </>
    )
}

const GradientText = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    color: "#0487D9",
    fontFamily: "Plus Jakarta Sans, sans-serif",
    fontSize: "50px",
    lineHeight: "60px",
    letterSpacing: "-2%",
    textTransform: "uppercase",
    display: "inline-block",
    [theme.breakpoints.down("md")]: {
        fontSize: "36px",
        lineHeight: "42px",
    },
    [theme.breakpoints.down("sm")]: {
        fontSize: "28px",
        lineHeight: "34px",
    },
    [theme.breakpoints.down("xs")]: {
        fontSize: "22px",
        lineHeight: "28px",
    },
}));

export default VendorAndServices   
