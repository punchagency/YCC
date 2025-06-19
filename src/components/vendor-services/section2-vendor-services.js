import React from 'react'
import { Box, Typography, Button, styled, Container, Grid, Badge } from '@mui/material'
import shipIcon from '../../assets/images/icons/home-page-ship.png'
import crewIcon from '../../assets/images/icons/home-page-crew.png'
import engineeringIcon from '../../assets/images/icons/home-page-engineering.png'
import { ButtonTypography, linearGradient } from '../landing-page-info-section'

const Section2VendorServices = () => {
    const gridData = [
        {
            title: "Let Yacht Crew Center Propel Your Business",
            description: 'Expand your business by connecting directly with yacht crew and managers through our global platform. Showcase your inventory and secure order requests with ease while becoming part of a trusted network serving the Luxury Yachting Industry.',
            image: shipIcon,
        },
        {
            title: "Join A Comprehensive Vendor Marketplace",
            description: "Join a global network of yacht crew and vessel managers actively searching for top-tier service providers like you. Showcase your business and be easily found by those who need your expertise. Confirm bookings directly with crew, manage your invoices seamlessly, and elevate your business by connecting with a worldwide yachting audience.",
            image: crewIcon,
        },
        {
            title: "Get Direct Bookings and Orders",
            description: "Receive and respond to quote requests, Confirm bookings & manage orders effortlessly through our seamless platform. Yacht Crew Center empowers your business to build a strong reputation. Connecting you directly to a global network of yachting professionals actively seeking trusted service providers.",
            image: shipIcon,
        },
        {
            title: "Let Our AI Platform do the Heavy Lifting",
            description: "By onboarding your inventory & services you'll receive direct orders and booking requests tailored to real-time needs. Our AI handles the heavy lifting matching you to customers so you can focus on growing your business.",
            image: engineeringIcon,
        }
    ]

    return (
        <Box component="section" sx={{
            width: "100%",
            pb: { xs: 6, sm: 8, md: 10 },
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
                        xs: "90%",
                        sm: "75%",
                        md: "60%",
                        lg: "50%",
                    },
                }}>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "10px",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                        <Badge variant='dot' sx={{
                            "& .MuiBadge-dot": {
                                background: linearGradient,
                            },
                        }} />
                        <GradientText>
                            Grow Your Maritime Business
                        </GradientText>
                    </Box>

                    <HeadingText>
                        Connect with the Global Yachting Network
                    </HeadingText>
                </Box>

                <Grid container spacing={4} sx={{
                    flexWrap: "wrap",
                    backgroundColor: "transparent",
                    width: "100%",
                    mt: 2,
                    mb: 8
                }}>
                    {gridData.map((item, index) => (
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            key={index}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                height: "100%"
                            }}
                        >
                            <AnimatedBox sx={{ height: "100%" }}>
                                <Box sx={{ 
                                    px: 4, 
                                    py: 7, 
                                    display: "flex", 
                                    background: "#E6EFF28A", 
                                    borderRadius: '13px', 
                                    flexDirection: "column", 
                                    gap: "28px", 
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
                                            <img src={item.image} alt={item.title} style={{ width: "48px", height: "48px" }}/>
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
                                    <Box>
                                        <AnimatedButton>
                                            <ButtonTypography sx={{ color: "white" }}>Learn More</ButtonTypography>
                                        </AnimatedButton>
                                    </Box>
                                </Box>
                            </AnimatedBox>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    )
}

const linearGradient2 = "linear-gradient(90deg, #0487D9, #034D92)";

const AnimatedBox = styled(Box)({
    width: "100%",
    transition: "transform 0.3s ease-in-out",
});

const AnimatedIcon = styled(Box)({
    transition: "transform 0.3s ease-in-out",
    "&:hover": {
        transform: "scale(1.1) rotate(5deg)",
    }
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

const SecondarySubTextBlack = styled(Typography)({
    fontFamily: "Inter",
    fontWeight: 400,
    fontSize: "18px",
    lineHeight: "26.55px",
    letterSpacing: "0%",
    color: "#373737",
});

const HeadingText = styled(Typography)(({ theme }) => ({
    color: "#131313",
    fontFamily: "Plus Jakarta Sans, sans-serif",
    fontWeight: 500,
    fontSize: theme.breakpoints.values.xs ? "36px" :
        theme.breakpoints.values.sm ? "40px" :
            theme.breakpoints.values.md ? "42px" :
                "46px",
    lineHeight: theme.breakpoints.values.xs ? "36px" :
        theme.breakpoints.values.sm ? "40px" :
            theme.breakpoints.values.md ? "46px" :
                "51px",
    letterSpacing: "-2%",
    textAlign: "center",
}));

const SecondaryHeadingText = styled(Typography)({
    color: "#131313",
    fontFamily: "Plus Jakarta Sans, sans-serif",
    fontWeight: 500,
    fontSize: "30px",
    lineHeight: "36.6px",
    letterSpacing: "1%",
});

const GradientText = styled(Typography)({
    background: linearGradient,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontFamily: "Inter",
    fontWeight: 500,
    fontSize: "14px",
    lineHeight: "19.6px",
    letterSpacing: "5%",
    textTransform: "uppercase",
});

export default Section2VendorServices       
