import { Box, Typography, styled } from '@mui/material'
import banner from '../../assets/images/exterior/YCC-exterior-banner.png'
import LandingPageBanner from '../../components/landing-page-banner'
import LandingPageFooter from '../../components/landing-page-footer'
import Section2Exterior from '../../components/exterior/section2-exterior'
import Section3Exterior from '../../components/exterior/section3-exterior'
import { useEffect } from 'react'
import Chatbot from '../../components/chatbot/chatbot'
const ExteriorLandingPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
    const backgroundImage = banner
    const header = (
        <>
            Empowering <GradientText>Exterior</GradientText>{" "}
            <GradientText>Yacht</GradientText> crew with the Right Resources
        </>    
    );
    const subtext2 = 'Master the art of yacht maintenance, safety, and watersports with expert advice and trusted tools designed for exterior crew.'
    const button1 = {
        text: 'Join Our Crew Network',
        path: '/get-started'
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
            <Chatbot />
            <Section2Exterior />
            <Section3Exterior />
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
    letterSpacing: "-2%",
    textTransform: "uppercase",
    display: "inline-block",
});

export default ExteriorLandingPage