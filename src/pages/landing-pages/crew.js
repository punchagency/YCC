import React from 'react'
import banner from '../../assets/images/crew/YCC-crew-banner.png'
import LandingPageBanner from '../../components/landing-page-banner'
import LandingPageFooter from '../../components/landing-page-footer'
import { styled,Typography, Box } from '@mui/material'

const CrewLandingPage = () => {

    const backgroundImage = banner
  const header = (
    <>
     Supporting <GradientText>yatch</GradientText>{" "}
      <GradientText>crew</GradientText> at every step of their journey
    </>
  );
  const subtext2 = 'From recruitment to mental health and off-duty resources, access everything you need to thrive in your yachting career.'
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
    letterSpacing: "-2%",
    textTransform: "uppercase",
    display: "inline-block",
  });

export default CrewLandingPage