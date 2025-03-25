import React from 'react'
import { Container, Box, Typography, Button } from '@mui/material'
import { linearGradient } from '../landing-page-header'
import SectionImage from '../../assets/images/home-section3-image.png'
import { styled } from '@mui/material/styles'
import { Link } from 'react-router-dom'

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
                    flexDirection: { xs: "column", md: "row" },
                    justifyContent: { xs: "center", md: "space-between" },
                    alignItems: "center",
                    borderRadius: "20px",
                    marginBottom: { xs: "80px", md: "200px" },
                    padding: { xs: 0, md: 0 }, // Add padding for spacing on mobile
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
                        <Link to='/vendor-services'>
                        <CustomButton variant="contained" color="white">Learn More</CustomButton>
                        </Link>

                    </Box>

                </Box>

                <Box
                    component="img"
                    src={SectionImage}
                    alt="Section Image"
                    sx={{
                        width: { xs: "100%", md: "236px" },
                        height: { xs: "100%", md: "235px" },
                        maxWidth: { xs: "100%", md: "236px" },
                        maxHeight: { xs: "100%", md: "235px" },
                        borderBottomRightRadius: 20, 
                        borderBottomLeftRadius: { xs: 30, md: 0 }, // Bottom-left rounded only on mobile
                        borderTopLeftRadius: { xs: 30, md: 0 }, // Bottom-left rounded only on mobile
                        display: "block", 
                    }}
                />



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