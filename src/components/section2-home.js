import React from 'react'
import { Box, Typography, Button, styled, Container, Grid, Badge } from '@mui/material'
import shipIcon from '../assets/images/icons/home-page-ship.png'
import crewIcon from '../assets/images/icons/home-page-crew.png'
import engineeringIcon from '../assets/images/icons/home-page-engineering.png'
import chefGalleryIcon from '../assets/images/icons/home-page-chef.png'
import interiorIcon from '../assets/images/icons/home-page-interior.png'
import { GradientText } from './section1-home'
import { ButtonTypography, linearGradient } from './landing-page-header'
import { Link } from 'react-router-dom'

const Section2Home = () => {
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
            description: "Search suggestions for recipes based on diet restrictions and what you have on hand.  Assistance with sourcing for local provisions. Focus on your art and leave the suggestions and sourcing to us.",
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

                        <Badge variant='dot' sx={{
                            "& .MuiBadge-dot": {
                                background: linearGradient,
                            },
                        }} />
                        <GradientText>
                            Navigate to department-specific tools and resources
                        </GradientText>

                    </Box>

                    <HeadingText>
                        Explore Resources For Every Department
                    </HeadingText>
                </Box>

                <Grid container rowSpacing={{ xs: 3, sm: 4, md: 5 }} columnSpacing={{ xs: 3, sm: 4, md: 5 }} sx={{ width: "100%" }}>
                    {gridData.map((item, index) => (
                        <Grid
                            item
                            xs={12}  // Full width on extra-small screens (mobile)
                            sm={6}   // 2-column layout on small screens (600px+)
                            key={index}
                            sx={{
                                display: "flex",
                                justifyContent: "start",
                                textAlign: "left",
                            }}
                        >
                            <Box sx={{ px: 4, py: 7, display: "flex", background: "#E6EFF28A", borderRadius: '13px', flexDirection: "column", gap: "28px", justifyContent: "space-between" }}>

                                <Box sx={{ display: "flex", flexDirection: "column", gap: "28px" }}>
                                    <Box>
                                        <img src={item.image} alt="yacht" />
                                    </Box>
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
                                    <Link to={item.path}>
                                    <GradientButton>
                                        <ButtonTypography sx={{ color: "white" }}>Learn More</ButtonTypography>
                                    </GradientButton>
                                    </Link>
                                </Box>
                            </Box>
                        </Grid>
                    ))}
                </Grid>



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

const GradientButton = styled(Button)({
    background: linearGradient,
    fontSize: "16px",
    fontFamily: "Inter, sans-serif",
    textTransform: "none",
    "&:hover": {
        background: linearGradient2,
    },
    padding: "15px 41px",
});

export default Section2Home