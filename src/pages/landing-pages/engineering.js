import { Box, Typography, styled } from '@mui/material'
import banner from '../../assets/images/engineering/YCC-engineering-banner.png'
import LandingPageBanner from '../../components/landing-page-banner'
import LandingPageFooter from '../../components/landing-page-footer'
import Section2Engineering from '../../components/engineering/section2-engineering'
import Section3Engineering from '../../components/engineering/section3-engineering'
import { useEffect } from 'react'
import Chatbot from '../../components/chatbot/chatbot'

const EngineeringLandingPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
    const backgroundImage = banner
    const header = (
        <>
            Supporting <GradientText>Yatch</GradientText>{" "}
            <GradientText>Engineers</GradientText> with Tools for Success
        </>    
    );
    const subtext2 = 'From maintenance resources to technical training, find everything you need to keep yachts running at peak performance.'
    const button1 = {
        text: 'Join Our Crew Network',
        path: '/get-started'
    }

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
                gap: {
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
            <Section2Engineering />
            <Section3Engineering />
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
})

export default EngineeringLandingPage      
