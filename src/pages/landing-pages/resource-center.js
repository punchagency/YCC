import { Box, Typography, styled } from '@mui/material'
import banner from '../../assets/images/resource-center/YCC-resource-center-banner.png'
import LandingPageBanner from '../../components/landing-page-banner'
import LandingPageFooter from '../../components/landing-page-footer'
import Section1ResourceCenter from '../../components/resource-center/section1-resource-center'
import Section2ResourceCenter from '../../components/resource-center/section2-resource-center'
import Section3ResourceCenter from '../../components/resource-center/section3-resource-center'
import ResourceCenterSection4 from '../../components/resource-center/section4-resource-center'
import { useEffect } from 'react'
const ResourceCenter = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
    const backgroundImage = banner
    const header = (
        <>
           <GradientText>Resource</GradientText>{" "}
            <GradientText>Center</GradientText> <br /> Yacht Crew Center
        </> 
    );
    const subtext2 = "Explore the Yacht Crew Center Resource Hub for expert yachting tips, tools and insights. To help Crew, Captains and Department Heads streamline operations and enhance guest experiences."

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            gap: {xs: "90px", md: "120px"},
        }}>
            <LandingPageBanner
                backgroundImage={backgroundImage}
                header={header}
                subtext2={subtext2}
            />
            <Section1ResourceCenter />
            <Section2ResourceCenter />
            <Section3ResourceCenter />
            <ResourceCenterSection4 />
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
export default ResourceCenter   
