import React from 'react'
import { Container, Box, Typography, Button } from '@mui/material'
import { linearGradient } from './landing-page-header'
import SectionImage from '../assets/images/home-section3-image.png'
import { styled } from '@mui/material/styles'

const Section3Home = () => {
  return (
    <Container disableGutters component="section" maxWidth="md" sx={{
        display: "flex",  
        padding: 0,
    }}>
        <Box
        sx={{
            background: linearGradient,
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: "20px",
            marginBottom: "200px",
        }}
        >

            <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                padding: "40px",
                gap: "20px",
                textAlign: "left",
            }}
            >
            <Box>
            <HeadingText>Book the Best Vendors & Suppliers Instantly with Our AI Agent!</HeadingText>
            </Box>

            <Box>
            <CustomButton variant="contained" color="white">Learn More</CustomButton>

            </Box>

            </Box>

            <Box>
            <img src={SectionImage} alt="Section Image" style={{width: "236",
            height: "235px",
            borderTopRightRadius: "20px",
            borderBottomRightRadius: "20px",
            }} />
            </Box>
           

            
        </Box>
    </Container>
  )
}

const HeadingText = styled(Typography)({
    fontFamily: "Plus Jakarta Sans",
    fontWeight: 600,
    fontSize: "30px",
    lineHeight: "40px",
    letterSpacing: "0%",
    color: "#FFFFFF",
})

export const CustomButton = styled(Button)({
    background: "white",
    fontSize: "16px",
    fontFamily: "Inter, sans-serif",
    textTransform: "none",
    color: "black",
    padding: "13px 40px",
    borderRadius: "8px",
  });
  

export default Section3Home