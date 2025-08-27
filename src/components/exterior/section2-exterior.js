import React from 'react'
import { Box, Typography, styled, Container, Grid, Badge, useMediaQuery, useTheme } from '@mui/material'
import shipIcon from '../../assets/images/icons/home-page-ship.png'
import engineeringIcon from '../../assets/images/icons/home-page-engineering.png'
import { linearGradient } from '../landing-page-header'
import SectionPointCard from '../section-point-card'
import { MdHealthAndSafety } from "react-icons/md";

const Section2Exterior = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const gridData = [
        {
            title: "Essential Maintenance",
            points: [
                "Discover expert techniques for teak care, hull cleaning, and polishing.",
                "Simplify your Exterior Department management with service bookings and a worldwide supply network."
            ],
            image: shipIcon,
        },
        {
            title: "Safety and Compliance",
            points: [
                "Maintain stock of essential safety gear, including life jackets, EPIRB's, PLB's and fire suppression with services available worldwide.",
                "Access resources on flag state regulations and maritime safety standards to ensure safety and compliance."
            ],
            image: undefined,
            icon: <MdHealthAndSafety size={isMobile ? "25px" : "37.57px"} color='#fff' />,
        },
        {
            title: "Advance Your Career",
            points: [
                "Build your skills with training resources, on deck maintenance, safety procedures and access to career advancing resources.",
                "Join our Network to connect with service providers. Access department management tools wherever you are.",
            ],
            image: shipIcon,
        },
        {
            title: "Access your personal AI assistant",
            points: [
                "Let our system streamline your operations on a daily basis. ",
                "Your AI Assistant improves on every interaction. So it becomes personally tailored to you and your department.",
            ],
            image: engineeringIcon,
        }
    ]

    return (
        <Box component="section" sx={{
            minHeight: "100vh",
            width: "100%",
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
                            Exterior Excellence & Maintenance
                        </GradientText>
                    </Box>

                    <HeadingText>
                        Master Your Exterior Operations
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
                                justifyContent: "start",
                                textAlign: "left",
                            }}
                        >
                            <AnimatedBox>
                                <SectionPointCard
                                    image={item.image}
                                    title={item.title}
                                    points={item.points}
                                    icon={item.icon}
                                />
                            </AnimatedBox>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    )
}

const AnimatedBox = styled(Box)({
    width: "100%",
    height: "100%", // Ensure the box stretches to fill grid item height
    transition: "transform 0.3s ease-in-out",
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

export default Section2Exterior
