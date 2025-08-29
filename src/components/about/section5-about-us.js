import React, { useState } from 'react'
import { Box, Typography, Container, styled, Grid, Modal, IconButton } from '@mui/material'
import { GradientButton, ButtonTypography, linearGradient } from '../landing-page-header'
import yatch from '../../assets/images/YCC-yatch.png'
import banner from '../../assets/images/water-wide.png'
import playIcon from '../../assets/images/icons/play-button.png'
import CloseIcon from '@mui/icons-material/Close'
import { Link } from 'react-router-dom'

const Section5AboutUs = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <Box sx={{
            paddingBottom: { xs: "510px", md: "288px" },
        }}>
            <Box
                sx={{
                    // backgroundImage: `url(${banner})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    display: 'flex',
                    backgroundColor: "#02214B",
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: { xs: "500px", sm: "700px", md: "650px", lg: "718px" },
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
                        {/* <Box 
                            onClick={handleOpen}
                            sx={{ 
                                cursor: 'pointer',
                                animation: 'pulse 2s infinite',
                                '@keyframes pulse': {
                                    '0%': {
                                        transform: 'scale(1)',
                                        opacity: 1
                                    },
                                    '50%': {
                                        transform: 'scale(1.1)',
                                        opacity: 0.8
                                    },
                                    '100%': {
                                        transform: 'scale(1)',
                                        opacity: 1
                                    }
                                }
                            }}
                        >
                            <img src={playIcon} alt="play" width='91px' height='91px' />
                        </Box> */}

                        <Box>
                            <HeadingText>Our Mission</HeadingText>
                        </Box>

                        <Box>
                            <SecondarySubText>To inspire and support yachting professionals by providing access to the best resources, services, and connections, ensuring their success both on and off the water.</SecondarySubText>
                        </Box>
                    </Box>

                    {/* Video Modal */}
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="video-modal"
                        aria-describedby="company-mission-video"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Box sx={{
                            position: 'relative',
                            width: { xs: '90%', sm: '80%', md: '70%', lg: '60%' },
                            height: { xs: '50vh', sm: '60vh', md: '70vh' },
                            bgcolor: 'black',
                            borderRadius: '10px',
                            overflow: 'hidden',
                            '& iframe': {
                                width: '100%',
                                height: '100%',
                                border: 'none',
                            }
                        }}>
                            <IconButton
                                onClick={handleClose}
                                sx={{
                                    position: 'absolute',
                                    right: 8,
                                    top: 8,
                                    color: 'white',
                                    zIndex: 1,
                                    bgcolor: 'rgba(0,0,0,0.5)',
                                    '&:hover': {
                                        bgcolor: 'rgba(0,0,0,0.7)',
                                    }
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                            <iframe
                                src="https://www.youtube.com/embed/6RYeNFtDJds?autoplay=1"
                                title="Company Mission"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </Box>
                    </Modal>

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
                                padding: { xs: '16px', sm: '24px', md: '32px', lg: '40px' },
                                justifyContent: 'center'
                            }}>
                                <Box sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "12px",
                                }}>
                                    <HeadingTextBlack>
                                    Ready To Enhance Your Yachting Career?
                                    </HeadingTextBlack>
                                </Box>
                                <SecondarySubTextBlack >
                                Connect with us and explore the resources that can make a difference in your career.
                                </SecondarySubTextBlack>

                                <Box sx={{ display: "flex", gap: "15px" }}>
                                    <Link to="/get-started">
                                        <GradientButton>
                                            <ButtonTypography sx={{ color: "white" }}>Join Our Crew Network</ButtonTypography>
                                        </GradientButton>
                                    </Link>
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Box >
                                    <img src={yatch} alt="Yacht Crew Center"
                                        style={{ width: "100%", height: "100%", maxWidth: "100%", borderTopRightRadius: "8px", borderBottomRightRadius: "8px" }} />
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

export const SecondarySubTextBlack = styled(Typography)(({ theme }) => ({
    fontFamily: "Inter",
    fontWeight: 400,
    fontSize: "15.26px",
    lineHeight: "22.51px",
    letterSpacing: "0%",
    color: "#373737",
    display: "inline-block",
    width: "100%",

    [theme.breakpoints.down("md")]: {
        fontSize: "14px",
        lineHeight: "20px",
        width: "500px",
    },
    [theme.breakpoints.down("sm")]: {
        fontSize: "13px",
        lineHeight: "18px",
        width: "100%",
        padding: "0 20px 0 20px"
    },
}));

export const HeadingText = styled(Typography)(({ theme }) => ({
    color: "white",
    fontFamily: "Plus Jakarta Sans, sans-serif",
    fontWeight: 500,
    fontSize: "46px",
    lineHeight: "51px",
    letterSpacing: "-2%",

    [theme.breakpoints.down("lg")]: {
        fontSize: "42px",
        lineHeight: "48px",
    },
    [theme.breakpoints.down("md")]: {
        fontSize: "36px",
        lineHeight: "44px",
    },
    [theme.breakpoints.down("sm")]: {
        fontSize: "28px",
        lineHeight: "36px",
    },
}));
export const HeadingTextBlack = styled(Typography)(({ theme }) => ({
    color: "#131313",
    fontFamily: "Plus Jakarta Sans, sans-serif",
    fontWeight: 500,
    fontSize: "46px",
    lineHeight: "51px",
    letterSpacing: "-2%",

    [theme.breakpoints.down("lg")]: {
        fontSize: "42px",
        lineHeight: "48px",
    },
    [theme.breakpoints.down("md")]: {
        fontSize: "36px",
        lineHeight: "44px",
    },
    [theme.breakpoints.down("sm")]: {
        fontSize: "28px",
        lineHeight: "36px",
    },
}));

export const GradientText = styled(Typography)({
    background: linearGradient,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontFamily: "Inter",
    fontWeight: 600,
    fontSize: "14px",
    lineHeight: "16.94px",
    letterSpacing: "-2%",
    textTransform: "uppercase",
    display: "inline-block",
});
export default Section5AboutUs;
