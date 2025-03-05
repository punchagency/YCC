
import { Box, Typography, styled } from '@mui/material'
import banner from '../../assets/images/engineering/YCC-engineering-banner.png'
import LandingPageBanner from '../../components/landing-page-banner'
import LandingPageFooter from '../../components/landing-page-footer'
import Section1Engineering from '../../components/engineering/section1-engineering'
import Section2Engineering from '../../components/engineering/section2-engineering'
import Section3Engineering from '../../components/engineering/section3-engineering'

const EngineeringLandingPage = () => {
    const backgroundImage = banner
    const header = (
        <>
            Empowering <GradientText>Exterior</GradientText>{" "}
            <GradientText>Yatch</GradientText> crew with the Right Resources
        </>    
    );
    const subtext2 = 'Master the art of yacht maintenance, safety, and watersports with expert advice and trusted tools designed for exterior crew'
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
            <Section1Engineering /> 
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
