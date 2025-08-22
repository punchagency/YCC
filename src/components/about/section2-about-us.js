import React from 'react'
import { Box, Typography, Button, styled, Container, Grid, useTheme, useMediaQuery } from '@mui/material'
import shipIcon from '../../assets/images/icons/home-page-ship.png'
import crewIcon from '../../assets/images/icons/home-page-crew.png'
import engineeringIcon from '../../assets/images/icons/home-page-engineering.png'
import { GradientText } from '../home/section1-home'
import { ButtonTypography, linearGradient } from '../landing-page-header'
import { useNavigate } from 'react-router-dom'

const Section2AboutUs = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const gridData = [
        {
            title: "Vendor & Service Connections",
            description: "A growing network of trusted vendors and service providers to meet your unique needs.",
            image: shipIcon,
            path: '/vendor-services'
        },
        {
            title: "Crew Support",
            description: "Resources for career advancement, certifications, and professional growth.",
            image: engineeringIcon,
            path: '/crew'
        },
        {
            title: "Community Engagement",
            description: "Opportunities to network, learn, and collaborate within a vibrant global yachting community.",
            image: shipIcon,
            path: '/about-us'
        },   
        {
            title: "Expert Guidance",
            description: "Insights and advice to help you make the most of your yachting journey.",
            image: crewIcon,
            path: '/resource-center'
        },
    ]

    return (
        <Box component="section" sx={{
            minHeight: "100vh",
            width: "100%",
            marginTop: isMobile ? "40px" : "80px",
        }}>
            <Container maxWidth="lg" sx={{
                display: "flex",
                flexDirection: "column",
                gap: "28px",
                justifyContent: "center",
                alignItems: "center",
            }}>
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "13px",
                    maxWidth: {
                        xs: "90%",  // Mobile - almost full width
                        sm: "75%",  // Small screens - slightly smaller
                        md: "60%",  // Medium screens - more controlled
                        lg: "50%",  // Large screens - original width
                    },
                }}>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "10px",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>

                        {/* <Badge variant='dot' sx={{
                            "& .MuiBadge-dot": {
                                background: linearGradient,
                            },
                        }} /> */}
                        {/* <GradientText>
                            Navigate to department-specific tools and resources
                        </GradientText> */}

                    </Box>

                    <HeadingText
                        sx={{
                            textAlign: "center",
                        }}
                    >
                        What We Offer
                    </HeadingText>
                </Box>

                <Grid container rowSpacing={{ xs: 3, sm: 4, md: 5 }} columnSpacing={{ xs: 3, sm: 4, md: 5 }} sx={{ width: "100%" }}>
                    {gridData.map((item, index) => (
                        <Grid
                            item
                            xs={12}
                            sm={12}
                            md={6}
                            lg={6}
                            key={index}
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                textAlign: "center",
                            }}
                        >
                            <AnimatedBox>
                                <Box sx={{ 
                                    px: "36px", 
                                    py: "46px", 
                                    display: "flex", 
                                    background: "#E6EFF28A", 
                                    borderRadius: '13px', 
                                    flexDirection: "column", 
                                    gap: "10px", 
                                    justifyContent: "space-between",
                                    height: "100%",
                                    transition: "all 0.3s ease-in-out",
                                    "&:hover": {
                                        transform: "translateY(-10px)",
                                        boxShadow: "0 10px 20px rgba(4, 135, 217, 0.2)",
                                        background: "#E6EFF2",
                                    }
                                }}>
                                    <Box sx={{ display: "flex", flexDirection: "column", gap: "28px" }}>
                                        <AnimatedIcon>
                                            <img src={item.image} alt={item.title} style={{ width: "76px", height: "76px" }}/>
                                        </AnimatedIcon>
                                        <Box>
                                            <SecondaryHeadingText>
                                                {item.title}
                                            </SecondaryHeadingText>
                                            <SecondarySubTextBlack>
                                                {item.description}
                                            </SecondarySubTextBlack>
                                        </Box>
                                    </Box>
                                    {/* <Box>
                                        <AnimatedButton onClick={() => navigate(item.path)}
                                            sx={{
                                                width: "171px",
                                                height: "48px",
                                                borderRadius: "6px"
                                            }}
                                            >
                                            <ButtonTypography sx={{ color: "white", fontWeight: 600, fontSize: '16px' }}>Learn More</ButtonTypography>
                                        </AnimatedButton>
                                    </Box> */}
                                </Box>
                            </AnimatedBox>
                        </Grid>
                    ))}
                </Grid>

                <Box>
                    <AnimatedGradientButton onClick={() => navigate('/resource-center')}>
                        <ButtonTypography sx={{ color: "white" }}>Resource Center</ButtonTypography>
                    </AnimatedGradientButton>
                </Box>
            </Container>
        </Box>
    )
}

const linearGradient2 = "linear-gradient(90deg, #0487D9, #034D92)";
const SecondarySubTextBlack = styled(Typography)({
    fontFamily: "Inter",
    fontWeight: 400,
    fontSize: "18px",
    lineHeight: "26.55px",
    letterSpacing: "0%",
    color: "#373737",
    marginTop: "10px",
})

const HeadingText = styled(Typography)(({ theme }) => ({
    color: "#131313",
    fontFamily: "Plus Jakarta Sans, sans-serif",
    fontWeight: 500,
    fontSize: theme.breakpoints.values.xs ? "36px" :
        theme.breakpoints.values.sm ? "40px" :
            theme.breakpoints.values.md ? "42px" :
                "46px", // Default for large screens
    lineHeight: theme.breakpoints.values.xs ? "36px" :
        theme.breakpoints.values.sm ? "40px" :
            theme.breakpoints.values.md ? "46px" :
                "51px", // Default for large screens
    letterSpacing: "-2%",
}));

const SecondaryHeadingText = styled(Typography)({
    color: "#131313",
    fontFamily: "Plus Jakarta Sans, sans-serif",
    fontWeight: 500,
    fontSize: "30px",
    lineHeight: "36.6px",
    letterSpacing: "1%",

})

const AnimatedGradientButton = styled(Button)({
    background: linearGradient,
    fontSize: "16px",
    fontFamily: "Inter, sans-serif",
    textTransform: "none",
    padding: "15px 41px",
    transition: "all 0.3s ease-in-out",
    animation: "pulse 2s infinite",
    "@keyframes pulse": {
        "0%": {
            transform: "scale(1)",
            boxShadow: "0 0 0 0 rgba(4, 135, 217, 0.4)",
        },
        "70%": {
            transform: "scale(1.05)",
            boxShadow: "0 0 0 10px rgba(4, 135, 217, 0)",
        },
        "100%": {
            transform: "scale(1)",
            boxShadow: "0 0 0 0 rgba(4, 135, 217, 0)",
        }
    },
    "&:hover": {
        background: linearGradient2,
        transform: "translateY(-3px)",
        boxShadow: "0 5px 15px rgba(4, 135, 217, 0.3)",
    },
});

const AnimatedBox = styled(Box)({
    width: "100%",
    transition: "transform 0.3s ease-in-out",
});

const AnimatedIcon = styled(Box)({
    transition: "transform 0.3s ease-in-out",
    // "&:hover": {
    //     transform: "scale(1.1) rotate(5deg)",
    // }
});

const AnimatedButton = styled(Button)({
    background: linearGradient,
    fontSize: "16px",
    fontFamily: "Inter, sans-serif",
    textTransform: "none",
    padding: "15px 41px",
    transition: "all 0.3s ease-in-out",
    "&:hover": {
        background: linearGradient2,
        transform: "translateY(-3px)",
        boxShadow: "0 5px 15px rgba(4, 135, 217, 0.3)",
    },
});

export default Section2AboutUs      
