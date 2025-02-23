
import React from 'react'
import { Box, Typography, Button, styled, Container, Grid, Badge } from '@mui/material'
import banner from '../assets/images/YCC-home-banner2.png'
import { GradientButton, ButtonTypography, linearGradient, linearGradient2 } from '../components/landing-page-header'

const LandingPageBanner = ({ page, backgroundImage, header, subtext1, subtext2, button1, button2 }) => {

    return (

        <Box
            component="section"
            sx={{
                position: "relative",
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                height: "100vh",
                width: "100%",
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
                top: "60%",
                left: "30%",
                transform: "translate(-50%, -50%)",
                textAlign: "left",
                maxWidth: "690px",

            }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <Typography sx={{
                        color: "white",
                        fontFamily: "Plus Jakarta Sans, sans-serif",
                        fontWeight: 600,
                        fontSize: "55.96px",
                        lineHeight: "60px",
                        letterSpacing: "-2%",
                        textTransform: "uppercase",
                    }}>
                        { header }
                    </Typography>

                    <PrimarySubText>
                        { subtext1 }
                    </PrimarySubText>
                </Box>
                {subtext2 && <SecondarySubText>
                    {subtext2}
                </SecondarySubText>}

                <Box sx={{ display: "flex", gap: "15px" }}>
                    <GradientButton>
                        <ButtonTypography sx={{ color: "white" }}>{button1.text}</ButtonTypography></GradientButton>
                  {button2 &&   <Button variant='outlined'

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
                        <ButtonTypography sx={{ color: "white" }}>{button2.text}</ButtonTypography></Button>
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