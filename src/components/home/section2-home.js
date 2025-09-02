import React from 'react'
import { Box, Typography, Button, styled, Container, Grid, Badge, useTheme, useMediaQuery } from '@mui/material'
import shipIcon from '../../assets/images/icons/home-page-ship.png'
import crewIcon from '../../assets/images/icons/home-page-crew.png'
import engineeringIcon from '../../assets/images/icons/home-page-engineering.png'
import chefGalleryIcon from '../../assets/images/icons/home-page-chef.png'
import interiorIcon from '../../assets/images/icons/home-page-interior.png'
import { GradientText } from './section1-home'
import { ButtonTypography, linearGradient } from '../landing-page-header'
import { Link } from 'react-router-dom'

const Section2Home = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const gridData = [
        {
            title: "Captains",
            description: "Better manage your vessel and departments through AI. Explore the future of modern yacht management.",
            image: shipIcon,
            path: '/captain'
        },
        {
            title: "Crew",
            description: "Access resources for career training, local accommodation's, mental health and more. Feel supported in your life on and off the water.",
            image: crewIcon,
            path: '/crew'
        },
        {
            title: "Engineering",
            description: "Equipment troubleshooting, schedule services, order parts and develop additional skills.  Be able to simplify and focus on what is important in your department.",
            image: engineeringIcon,
            path: '/engineering'
        },
        {
            title: "Exterior",
            description: "Elevate your exterior skill set and per. Source your department needs, look for creative ideas to enhance guests experiences, and inquire about specific information wherever you are. ",
            image: shipIcon,
            path: '/exterior'
        },
        {
            title: "Chef/Galley",
            description: "Use our AI Assistant and management dashboards to better run your galley. Keeping everything in place and using your Assistant. Brings your focus back to your artwork.",
            image: chefGalleryIcon,
            path: '/chef-galley'
        },
        {
            title: "Interior",
            description: "Source your departments needs, look for creative ideas to enhance guests experiences,  and inquiry about specific information wherever you are. ",
            image: interiorIcon,
            path: '/interior'
        },
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
                        textAlign: "left",
                    }}>
                        <Badge variant='dot' sx={{
                            "& .MuiBadge-dot": {
                                background: linearGradient,
                            },
                        }} />
                        <GradientText>
                            Navigate to department-specific tools and resources
                        </GradientText>
                    </Box>

                    <HeadingText
                        sx={{
                            textAlign: "center",
                        }}
                    >
                        Explore Resources For Every Department
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
                                    // transition: "all 0.3s ease-in-out",
                                    // "&:hover": {
                                    //     transform: "translateY(-10px)",
                                    //     boxShadow: "0 10px 20px rgba(4, 135, 217, 0.2)",
                                    //     background: "#E6EFF2",
                                    // }
                                }}>
                                    <Box sx={{ display: "flex", flexDirection: "column", gap: "28px" }}>
                                        <AnimatedIcon>
                                            <img src={item.image} alt="yacht" style={{ width: isMobile ? '60px' : '76px', height: isMobile ? '60px' : '76px' }}/>
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
                                        <Link to={item.path} style={{ textDecoration: 'none' }}>
                                            <AnimatedButton
                                                sx={{
                                                    width: '171px',
                                                    height: '48px',
                                                    borderRadius: "6px",
                                                }}
                                            >
                                                <ButtonTypography sx={{ color: "white", fontWeight: 600, fontSize: '16px' }}>Learn More</ButtonTypography>
                                            </AnimatedButton>
                                        </Link>
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

const SecondarySubTextBlack = styled(Typography)({
    fontFamily: "Inter",
    fontWeight: 400,
    fontSize: "18px",
    lineHeight: "26.55px",
    letterSpacing: "0%",
    color: "#373737",
    marginTop: "10px",
});

const HeadingText = styled(Typography)(({ theme }) => ({
    color: "#131313",
    fontFamily: "Plus Jakarta Sans, sans-serif",
    fontWeight: 500,
    fontSize: "46px",
    lineHeight: "51px",
    letterSpacing: "-2%",
    [theme.breakpoints.down("md")]: {
        fontSize: "36px",
        lineHeight: "42px",
    },
    [theme.breakpoints.down("sm")]: {
        fontSize: "28px",
        lineHeight: "34px",
    },
    [theme.breakpoints.down("xs")]: {
        fontSize: "22px",
        lineHeight: "28px",
    },
}));

const SecondaryHeadingText = styled(Typography)({
    color: "#131313",
    fontFamily: "Plus Jakarta Sans, sans-serif",
    fontWeight: 500,
    fontSize: "30px",
    lineHeight: "36.6px",
    letterSpacing: "1%",
});

export default Section2Home