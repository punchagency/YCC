import React from 'react'
import { Box, Typography, Button, styled, Container, Grid, Badge } from '@mui/material'
import shipIcon from '../../assets/images/icons/home-page-ship.png'
import crewIcon from '../../assets/images/icons/home-page-crew.png'
import engineeringIcon from '../../assets/images/icons/home-page-engineering.png'
import { ButtonTypography, linearGradient } from '../landing-page-header'

const Section2Interior = () => {
    const gridData = [
        {
            title: "Master the Art of Luxury Hospitality",
            description: 'Access resources for fine dining service, table settings, and personalized guest care. Discover how to create luxurious spaces with the right lighting, flowers and bespoke table settings.',
            image: shipIcon,
        },
        {
            title: "Interior Maintenance Made Simple",
            description: "Learn best practices for cleaning and caring for delicate materials like linens, carpets, and furniture. Find & book recommended suppliers for cleaning products, décor and organizational tools tailored for yachts.",
            image: crewIcon,
        },
        {
            title: "Simplify your Department Management",
            description: "Manage your service bookings with our worldwide Interior dedicated network. Order your every Interior department needs through our network & platform.",
            image: shipIcon,
        },
        {
            title: "Advance Your Career In Yacht Interior Management",
            description: 'Access training resources focused on leadership, inventory management and guest services. Join the Preferred Crew Network to access department managing tools, grow your professional network and simplify your life.',
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
                            sm={6}
                            key={index}
                            sx={{
                                display: "flex",
                                justifyContent: "start",
                                textAlign: "left",
                            }}
                        >
                            <AnimatedBox>
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

export default Section2Interior 
