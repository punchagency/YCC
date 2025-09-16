import React from 'react';
import { Box, Typography, styled, useTheme, useMediaQuery } from '@mui/material';
import checkIcon from '../assets/images/ckeckIcon.svg';

const SectionPointCard = ({
    image,
    icon,
    title = "Essential Maintenance",
    points = [
        "Discover expert techniques for teak care, hull cleaning, and polishing.",
        "Simplify your Exterior Department management with service bookings and a worldwide supply network."
    ]
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    return (
        <Box
            sx={{
                px: "36px",
                py: "46px",
                display: "flex",
                background: "#E6EFF28A",
                borderRadius: '13px',
                flexDirection: "column",
                gap: "10px",
                // justifyContent: "space-between",
                height: "100%", // Changed from "auto" to "100%" to fill grid item height
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                    transform: "translateY(-10px)",
                    boxShadow: "0 10px 20px rgba(4, 135, 217, 0.2)",
                    background: "#E6EFF2",
                },
                [theme.breakpoints.down("md")]: {
                    px: "20px",
                    py: "20px",
                    height: "auto", // Keep auto height on mobile for better mobile experience
                }
            }}
        >
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <AnimatedIcon>
                    {image ? <img src={image} alt={title} style={{ width: isMobile ? "50px" : "76px", height: isMobile ? "50px" : "76px" }} /> : (
                        <Box sx={{
                            width: isMobile ? "50px" : "76px",
                            height: isMobile ? "50px" : "76px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "#02214B",
                            borderRadius: "50%",
                        }}>
                            {icon}
                        </Box>
                    )}
                </AnimatedIcon>

                {/* Title */}
                <SecondaryHeadingText variant='h3'>
                    {title}
                </SecondaryHeadingText>
            </div>


            {/* Points List */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {points.map((point, index) => (
                    <Box
                        key={index}
                        sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 1.5
                        }}
                    >
                        <img src={checkIcon} alt="check" style={{ width: isMobile ? "20px" : "26px", height: isMobile ? "20px" : "26px" }} />
                        <SecondarySubTextBlack variant='body1'>
                            {point}
                        </SecondarySubTextBlack>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default SectionPointCard;

const AnimatedIcon = styled(Box)({
    transition: "transform 0.3s ease-in-out",
    // "&:hover": {
    //     transform: "scale(1.1) rotate(5deg)",
    // }
});

const SecondarySubTextBlack = styled(Typography)({
    fontFamily: "Inter",
    fontWeight: 400,
    fontSize: "18px",
    lineHeight: "26.55px",
    letterSpacing: "0%",
    color: "#373737",
});

const SecondaryHeadingText = styled(Typography)({
    color: "#131313",
    fontFamily: "Plus Jakarta Sans, sans-serif",
    fontWeight: 500,
    fontSize: "30px",
    lineHeight: "36.6px",
    letterSpacing: "1%",
    borderBottom: "1px solid #02214B59",
    paddingBottom: "10px",
    marginBottom: "10px",
});