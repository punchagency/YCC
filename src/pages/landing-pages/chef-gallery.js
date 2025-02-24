import { Box, Typography, styled } from '@mui/material'
import banner from '../../assets/images/exterior/YCC-exterior-banner.png'
import LandingPageBanner from '../../components/landing-page-banner'
import LandingPageFooter from '../../components/landing-page-footer'

const ChefGalleryLandingPage = () => {
    const backgroundImage = banner
    const header = (
        <>
            Empowering <GradientText>Yacht</GradientText>{" "}
            <GradientText>Chefs</GradientText> to Create Culinary Excellence
        </>  
    );
    const subtext2 = 'From gourmet provisioning to top-tier galley equipment, discover everything you need to elevate onboard dining.'
    const button1 = {
        text: 'Join Our Crew Network'
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
            <LandingPageFooter />
        </Box>
    )

}

const GradientText = styled(Typography)({
    fontWeight: 600,
    color: "#0487D9",
    fontFamily: "Plus Jakarta Sans, sans-serif",
    fontSize: "55.96px",
    lineHeight: "60px",
    letterSpacing: "-0.02em",
    textTransform: "uppercase",
    display: "inline-block",
});
export default ChefGalleryLandingPage       
