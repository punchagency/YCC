
import React from 'react'
import { Box, Typography, Button, styled } from '@mui/material'
import { GradientButton, ButtonTypography, linearGradient } from '../components/landing-page-header'
import { Link } from 'react-router-dom'

const LandingPageBanner = ({ page, backgroundImage, header, subtext1, subtext2, button1, button2 }) => {

    return (

        <Box
            component="section"
            sx={{
                position: "relative",
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: {
                    xs: "100vh", // Reduce height on smaller screens
                    sm: "100vh",
                    md: "100vh",
                  },
                maxHeight: '100vh',
                width: "100%",
                padding: {
                    xs: "0", // Add padding for mobile
                    md: "0", // Remove padding for desktop
                  },
                marginTop: {
                    xs: '0',
                    md: '0'
                },
            }}
        >
{

    page==='home'?(   
        <>
                 {/* First Box - 75% of the parent, starting from the left */}
        <Box
            sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "70.3%",
                height: "100%",
                background: "radial-gradient(circle at bottom right, rgba(0, 0, 0, 0.9) 20%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0) 100%)",
                filter: "blur(30.8px)",
            }}
        />

        {/* Second Box - Covers 50% of the parent width */}
        <Box
            sx={{
                position: "absolute",
                top: "0", // Adjust this so it doesn’t overlap
                left: 0,
                width: "55%", // Covers 50% of the parent
                height: "95%",
                background: "radial-gradient(ellipse at bottom right, rgba(0, 0, 0, 0.9) 70%, rgba(0, 0, 0, 0.3) 100%, rgba(0, 0, 0, 0) 100%)",
                filter: "blur(30.8px)",
                alignItems: "center",
                justifyContent: "center",
            }}
        />
        </>
): (

    <Box
    sx={{
        position: "absolute",
        top: 0, // Adjust this so it doesn’t overlap
        left: 0,
        width: "92%", // Covers 92% of the parent
        height: "100%",
        background: "linear-gradient(90deg, #000000 0%, rgba(0, 0, 0, 0) 100%);",
    }}
/>

)
}



            <Box sx={{
                zIndex: 2,
                display: "flex",
                flexDirection: "column",
                gap: "28px",
                position: "absolute",
                top: {
                    xs: "50%", // Adjust for better centering on small screens
                    md: "60%",
                  },
                  left: {
                    xs: "50%", // Center on mobile
                    md: "40%", // Keep original positioning for larger screens
                    lg: "30%",
                  },
                  transform: {
                    xs: "translate(-50%, -50%)", // Full centering on mobile
                    md: "translate(-50%, -50%)",
                  },
                  textAlign: {
                    xs: "center", // Center text on mobile
                    md: "left",
                  },
                  width: '90%',
                  maxWidth: {
                    xs: "100%", // Reduce width on small screens
                    sm: "80%",
                    md: "690px", // Keep original for larger screens
                  },
                  padding: {
                    xs: "10px", // Add padding on small screens
                    md: "0",
                  },

            }}>
                <Box sx={{ display: "flex",width: '100%', flexDirection: "column", gap: "14px"}}>
                    <Typography sx={{
                        color: "white",
                        fontFamily: "Plus Jakarta Sans, sans-serif",
                        fontWeight: 600,
                        fontSize: {
                            xs: "32px",  // Smaller font for mobile
                            sm: "40px",  // Slightly bigger for small tablets
                            md: "48px",  // Medium screens
                            lg: "55.96px",  // Default for large screens
                          },
                          lineHeight: {
                            xs: "38px", // Smaller line height for mobile
                            sm: "45px", // Medium screens
                            md: "52px", // Larger screens
                            lg: "60px", // Default for large screens
                          },
                        letterSpacing: "-2%",
                        textTransform: "uppercase",
                    }}>
                        { header }
                    </Typography>

                    <PrimarySubText sx={{ display: {xs: 'none', md: 'flex'} }} >
                        { subtext1 }
                    </PrimarySubText>
                </Box>
                {subtext2 && <SecondarySubText>
                    {subtext2}
                </SecondarySubText>}

                <Box sx={{ display: "flex",  gap: button2 ? "15px" : 0, justifyContent: {xs: 'center', md: 'start'} }}>
                    <Link to={button1.path}>
                    <GradientButton>
                        <ButtonTypography sx={{ color: "white" }}>{button1.text}</ButtonTypography></GradientButton>
                        </Link>
                  {button2 &&   <Button variant='outlined' component={Link} to={button2.path}

                        sx={{
                            position: "relative",
                            overflow: "hidden",
                            border: "none", // Remove the border since we use background trick
                            borderRadius: "8px",
                            padding: "10px 20px",
                            background: "transparent",
                            textTransform: "none",
                            "&::before": {
                                content: '""',
                                position: "absolute",
                                inset: 0,
                                padding: "2px", // Controls the border thickness
                                borderRadius: "inherit",
                                background: linearGradient, // Use your gradient here
                                WebkitMask:
                                    "linear-gradient(white, white) content-box, linear-gradient(white, white)",
                                WebkitMaskComposite: "destination-out",
                            }
                        }}

                    >
                        <ButtonTypography sx={{ color: "white" }}>{button2.text}</ButtonTypography>
                        </Button>
                        }
                </Box>
            </Box>

        </Box >


    )
}


const PrimarySubText = styled(Typography)({
    fontFamily: "Inter",
    fontWeight: 500,
    fontSize: "18.65px",
    lineHeight: "27.52px",
    letterSpacing: "0%",
    color: "white",
})

const SecondarySubText = styled(Typography)({
    fontFamily: "Inter",
    fontWeight: 400,
    fontSize: "15.26px",
    lineHeight: "22.51px",
    letterSpacing: "0%",
    color: "white",
})

export default LandingPageBanner