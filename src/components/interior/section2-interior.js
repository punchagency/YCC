import React from 'react'
import { Box, Typography, styled, Container, Grid, Badge } from '@mui/material'
import shipIcon from '../../assets/images/icons/home-page-ship.png'
import crewIcon from '../../assets/images/icons/home-page-crew.png'
import engineeringIcon from '../../assets/images/icons/home-page-engineering.png'
import { linearGradient } from '../landing-page-header'
import SectionPointCard from '../section-point-card'

const Section2Interior = () => {
    const gridData = [
        {
            title: "Master the Art of Luxury Hospitality",
            points: [
                "Access resources for fine dining service, table settings, and personalized guest care.",
                "Discover how to create luxurious spaces with the right lighting, flowers and bespoke table settings."
            ],
            image: shipIcon,
        },
        {
            title: "Interior Maintenance Made Simple",
            points: [
                "Learn best practices for cleaning and caring for delicate materials like linens, carpets, and furniture.",
                "Find & book recommended suppliers for cleaning products, décor and organizational tools tailored for yachts."
            ],
            image: crewIcon,
        },
        {
            title: "Simplify your Department Management",
            points: [
                "Manage your service bookings with our worldwide Interior dedicated network.",
                "Order your every Interior department needs through our network & platform."
            ],
            image: shipIcon,
        },
        {
            title: "Advance Your Career In Yacht Interior Management",
            points: [
                "Access training resources focused on leadership, inventory management and guest services.",
                "Join the Preferred Crew Network to access department managing tools, grow your professional network and simplify your life."
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
                            Interior Excellence & Luxury Service
                        </GradientText>
                    </Box>

                    <HeadingText>
                        Elevate Your Interior Department
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

export default Section2Interior 
