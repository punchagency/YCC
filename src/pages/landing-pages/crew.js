import React from 'react'
import banner from '../../assets/images/crew/YCC-crew-banner.png'
import LandingPageBanner from '../../components/landing-page-banner'
import LandingPageFooter from '../../components/landing-page-footer'
import { styled, Typography, Box } from '@mui/material'
import Section2Crew from '../../components/crew/section2-crew'
import Section3Crew from '../../components/crew/section3-crew'
import { useEffect } from 'react'
import Chatbot from '../../components/chatbot/chatbot'
import crewCenterWatermark from "../../assets/images/crew-center-watermark.svg";
const CrewLandingPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const backgroundImage = banner
    const header = (
        <>
            Supporting <GradientText>yacht</GradientText>{" "}
            <GradientText>crew</GradientText> at every step of their journey
        </>
    );
    const subtext2 = 'From recruitment to mental health and off-duty resources, access everything you need to thrive in your yachting career.'
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
                    xs: "120px",
                    md: "120px",
                    lg: "60px"
                },
                marginBottom: { xs: "45px", sm: "23px", md: "60px" },
            }}>
                <LandingPageBanner
                    backgroundImage={backgroundImage}
                    header={header}
                    subtext2={subtext2}
                    button1={button1}
                />
                <Chatbot />
                <Section2Crew />
                <Section3Crew />
            </Box>
            <img src={crewCenterWatermark} alt="Yacht Crew Center" style={{ width: "100%", height: "auto" }} />
            <LandingPageFooter />
        </>
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

export default CrewLandingPage