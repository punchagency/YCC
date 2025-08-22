import React from 'react'
import { Box, Typography, styled, Container, Grid, Badge } from '@mui/material'
import shipIcon from '../../assets/images/icons/home-page-ship.png'
import crewIcon from '../../assets/images/icons/home-page-crew.png'
import engineeringIcon from '../../assets/images/icons/home-page-engineering.png'
import { linearGradient } from '../landing-page-header'
import SectionPointCard from '../section-point-card'

const Section2ChefGallery = () => {
    const gridData = [
        {
            title: "Provisioning Resources for Gourmet Creations",
            points: [
                "Find trusted suppliers for fresh produce, specialty foods, and premium meats.",
                "Join the Preferred Crew Network to connect with Chefs, secure new opportunities, and grow in your profession."
            ],
            image: shipIcon,
        },
        {
            title: "AI Support for Yacht Chefs and Galley Management",
            points: [
                "Transform your culinary workflow with GPT-powered assistance. Instantly retrieve yacht-specific recipes, provisioning checklists, and food safety guidelines.",
                "AI auto-classifies new galley documents and enhances your ability to deliver exceptional meals while staying organized in the most demanding kitchens."
            ],
            image: crewIcon,
        },
        {
            title: "Advance Your Career as a Yacht Chef",
            points: [
                "Access training programs and resources to enhance your skills in culinary arts, food presentation, and dietary customization.",
                "Find & book recommended suppliers for cleaning products, décor and organizational tools tailored for yachts."
            ],
            image: shipIcon,
        },
        {
            title: "Food Safety and Hygiene Best Practices",
            points: [
                "Learn guidelines for safe storage and handling of ingredients in marine environments.",
                "Stay up to date with food safety certifications and onboard hygiene standards."
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
                            Culinary Excellence at Sea
                        </GradientText>
                    </Box>

                    <HeadingText>
                        Elevate Your Yacht Dining Experience
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

export default Section2ChefGallery  
