import React from 'react'
import { Box, Typography, Container, styled, Grid } from '@mui/material'
import { GradientButton, ButtonTypography, linearGradient } from '../landing-page-header'
import yatch from '../../assets/images/YCC-yatch.png'
import banner from '../../assets/images/water-wide.png'
import { Link } from 'react-router-dom'

const Section4Home = () => {
    return (
        <Box sx={{
            paddingBottom: { xs: "710px", md: "288px" },
        }}>
            <Box
                sx={{
                    // backgroundImage: `url(${banner})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundColor: "#02214B",
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: { xs: "500px", sm: "700px", md: "900px", lg: "1032px" },
                    width: '100%',
                    position: 'relative',
                    overflow: 'visible',
                    padding: { xs: "20px", md: "0" },
                }}
            >
                <Container maxWidth="lg" sx={{
                    justifyContent: 'center',
                    display: 'flex',
                }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        width: { xs: "100%", sm: "90%", md: "80%", lg: "944px" },
                        gap: { xs: "20px", sm: "25px", md: "30px" },
                    }}>
                        <Box>
                            <HeadingText>Join Our Crew Network</HeadingText>
                        </Box>

                        <Box>
                            <SecondarySubText>Become part of a safer, better managed and transparent yachting community. By joining our Crew Network, you'll connect with verified industry professionals. Access management tools, personalized AI assistants and a worldwide network. Join our journey and help shape the future of Yachting today.</SecondarySubText>
                        </Box>

                        <Box>
                            <Link to='/get-started'>
                                <GradientButton>
                                    <ButtonTypography
                                        sx={{ fontSize: "14px", fontWeight: "600", color: "white" }}
                                    >
                                        Join Now
                                    </ButtonTypography>
                                </GradientButton>
                            </Link>
                        </Box>
                    </Box>

                    <Box sx={{
                        position: 'absolute',
                        bottom: '0',
                        left: '50%',
                        transform: {
                            xs: "translate(-50%, 100%)",
                            sm: "translate(-50%, 30%)",
                            md: "translate(-50%, 45%)",
                            lg: "translate(-50%, 60%)",
                        },
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: {
                            xs: "90%",
                            sm: "80%",
                            md: "70%",
                            lg: "1180px",
                        },
                        height: {
                            xs: "300px",
                            sm: "400px",
                            md: "480px",
                        },
                        flexWrap: { xs: "wrap", md: "nowrap" },
                    }}>
                        <Grid container rowSpacing={{ xs: 3, md: 0 }} columnSpacing={{ xs: 0, md: 4 }} sx={{
                            flexWrap: "wrap",
                            backgroundColor: "white",
                            borderRadius: '9px',
                            boxShadow: "0px 4px 10.2px 0px #0000001A"
                        }}>
                            <Grid item xs={12} md={6} sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "28px",
                                textAlign: { xs: "center", md: "left" },
                                alignItems: { xs: "center", md: "flex-start" },
                            }}>
                                <Box sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "12px",
                                }}>
                                    <Box sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        flexDirection: "row",
                                        padding: { xs: "20px 20px 0 20px", md: "40px 0 0 0" },
                                    }}>
                                        <Box
                                            sx={{
                                                width: 8,
                                                height: 8,
                                                display: "inline-block",
                                                backgroundColor: "#295FD1",
                                                borderRadius: '20px',
                                            }}
                                        />
                                        <BadgeText>
                                            Resources
                                        </BadgeText>
                                    </Box>

                                    <HeadingTextBlack>
                                        Access our Resource Center and see our Yachting Marketplace
                                    </HeadingTextBlack>
                                </Box>
                                {/* <SecondarySubTextBlack>
                                    Gain access to valuable knowledge, practical tips, and industry updates tailored for yacht crew. Whether you're managing operations or advancing your career, our blog is your resource for success.
                                </SecondarySubTextBlack> */}

                                <Box sx={{ padding: { xs: "0 20px 0 20px", md: "0 0 0 0" } }}>
                                    <Link to='/resource-center' style={{ textDecoration: 'none' }}>
                                        <GradientButton>
                                            <ButtonTypography sx={{ color: "white" }}>Resource Center</ButtonTypography>
                                        </GradientButton>
                                    </Link>
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Box
                                    sx={{
                                        position: 'relative',
                                        height: '100%'
                                    }}>
                                    <img src={yatch} alt="Yacht Crew Center"
                                        style={{ width: "100%", height: "100%", maxWidth: "100%", borderTopRightRadius: "8px", borderBottomRightRadius: "8px" }} />
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            background: "linear-gradient(90deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%)",
                                            height: "100%",
                                            width: "35%",
                                            zIndex: 1,
                                        }}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            </Box>
        </Box>
    )
}

const SecondarySubText = styled(Typography)({
    fontFamily: "Inter",
    fontWeight: 400,
    fontSize: "15.26px",
    lineHeight: "22.51px",
    letterSpacing: "0%",
    color: "white",
})

const SecondarySubTextBlack = styled(Typography)(({ theme }) => ({
    fontFamily: "Inter",
    fontWeight: 400,
    fontSize: "18px",
    lineHeight: "148%",
    letterSpacing: "0%",
    color: "#373737",
    textAlign: { xs: "center", md: "left" },
}))

const HeadingText = styled(Typography)({
    fontFamily: "Plus Jakarta Sans",
    fontWeight: 600,
    fontSize: "46px",
    lineHeight: "51px",
    letterSpacing: "-2%",
    color: "white",
    textAlign: "center",
})

const HeadingTextBlack = styled(Typography)({
    fontFamily: "Plus Jakarta Sans",
    fontWeight: 600,
    fontSize: "30px",
    lineHeight: "40px",
    letterSpacing: "0%",
    color: "#131313",
})

const BadgeText = styled(Typography)({
    fontFamily: "Inter",
    fontWeight: 600,
    fontSize: "14px",
    lineHeight: "16.94px",
    letterSpacing: "-2%",
    color: "#295FD1",
    textTransform: "uppercase",
})

export default Section4Home