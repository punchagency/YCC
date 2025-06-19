import { Box, Typography, styled } from '@mui/material'
import banner from '../../assets/images/interior/YCC-interior-banner.png'
import LandingPageBanner from '../../components/landing-page-banner'
import LandingPageFooter from '../../components/landing-page-footer'
import Section2Interior from '../../components/interior/section2-interior'
import Section3Interior from '../../components/interior/section3-interior'
import { useEffect } from 'react'
import Chatbot from '../../components/chatbot/chatbot'

const InteriorLandingPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
    const backgroundImage = banner
    const header = (
        <>
            Empowering <GradientText>Interior</GradientText>{" "}
            <GradientText>Yatch</GradientText> Crew for Excellence
        </>   
    );
    const subtext2 = 'From décor to hospitality, discover resources designed to help stewards and stewardesses create luxurious onboard experiences.'
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
            <Section2Interior />
            <Section3Interior />
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

export default InteriorLandingPage  
