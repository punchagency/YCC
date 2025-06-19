import React from 'react'
import { Box, Typography, Button, styled, Container, Grid, Badge } from '@mui/material'
import shipIcon from '../../assets/images/icons/home-page-ship.png'
import crewIcon from '../../assets/images/icons/home-page-crew.png'
import engineeringIcon from '../../assets/images/icons/home-page-engineering.png'
import { ButtonTypography, linearGradient } from '../landing-page-header'

const Section2Crew = () => {
    const gridData = [
        {
            title: "Training and Certification Resources",
            description: 'Access courses and certifications to build your skills and meet industry standards. Explore training options for all crew roles, from deckhands to captains.',
            image: shipIcon,
        },
        {
            title: "Financial Planning and Career Development",
            description: 'Find tailored financial solutions for yacht crew, including retirement planning and asset protection. Access resources to help you manage your income and plan for the future.',
            image: crewIcon,
        },
        {
            title: "Legal and Compliance Support",
            description: 'Get help with visa requirements, wage disputes, and injury claims. Stay informed about international labor laws and flag state regulations.',
            image: shipIcon,
        },
        {
            title: "Mental Health and Wellness Services",
            description: 'Access resources for managing stress, staying connected, and maintaining a healthy work-life balance. Explore counseling options and support networks tailored to yacht crew.',
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
                            Comprehensive Support for Yacht Crew
                        </GradientText>
                    </Box>

                    <HeadingText>
                        Resources for Your Maritime Career
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

export default Section2Crew