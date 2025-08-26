import React from 'react'
import { Box, Typography, styled, Container, Grid, Badge } from '@mui/material'
import shipIcon from '../../assets/images/icons/home-page-ship.png'
import crewIcon from '../../assets/images/icons/home-page-crew.png'
import engineeringIcon from '../../assets/images/icons/home-page-engineering.png'
import { linearGradient } from '../landing-page-header'
import SectionPointCard from '../section-point-card'

const Section2Captain = () => {
    const gridData = [
        {
            title: "Compliance And Certification for Captains",
            image: shipIcon,
            points: [
                "Access resources for flag state regulations, licensing, and certification renewals.",
                "Stay updated on international maritime laws and safety requirements for seamless operations."
            ]
        },
        {
            title: "Enhancing Guest Experiences at Sea",
            image: crewIcon,
            points: [
                "Discover connections for creating tailored itineraries, coordinating private events, and managing luxury guest services.",
                "Access resources for managing guest preferences, entertainment options, and VIP experiences."
            ]
        },
        {
            title: "Leadership and Crew Management",
            image: engineeringIcon,
            points: [
                "Learn techniques for recruiting, training, and leading a cohesive crew.",
                "Gain insights into conflict resolution, team-building, and maintaining morale onboard."
            ]
        },
        {
            title: "Stay Ahead of the Game",
            points: [
                "Follow how AI is poised to bring the next era of Yacht Management.",
                "Learn what AI can do for your vessel. Explore the future of a Globally Connected Network.",
            ],
            image: shipIcon,
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
                            Essential Resources for Modern Captains
                        </GradientText>
                    </Box>

                    <HeadingText>
                        Tools and Support for Excellence at Sea
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

export default Section2Captain