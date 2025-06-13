import { Box,Button, Typography, Container, styled } from '@mui/material'
import SectionImage from '../../assets/images/resource-center/section2.png'
const Section2ResourceCenter = () => {
    return (
        <Container disableGutters component="section" maxWidth="lg" sx={{
            display: "flex",
            padding: 0,
        }}>
            <Box
                sx={{
                    width: "100%",
                    height: { xs: "100%", md: "387px" },
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    justifyContent: { xs: "center", md: "space-between" },
                    alignItems: "center",
                    borderRadius: "20px",
                    //marginBottom: { xs: "80px", md: "200px" },
                    margin: { xs: '10px', md: 0 }, // Add padding for spacing on mobile
                    border: "1px solid #E0E0E0",
                }}
            >

                <Box
                    component="img"
                    src={SectionImage}
                    alt="Section Image"
                    sx={{
                        width: { xs: "100%"},
                        height: { xs: "100%"},
                        borderBottomLeftRadius: { xs: 0, md: '20px' }, // Bottom-left rounded only on mobile
                        borderTopLeftRadius: { xs: '20px', md: '20px' }, // Bottom-left rounded only on mobile
                        borderTopRightRadius: { xs: '20px', md: 0 }, // Bottom-left rounded only on mobile
                        display: "block",
                    }}
                />


                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        padding: { xs: "20px", md: "40px" },
                        gap: "20px",
                        textAlign: "left",
                    }}
                >
                    <Box sx={{ display: "flex", gap: "10px", justifyContent: "space-between" }}>
                        <FeaturedText>
                            FEATURED
                        </FeaturedText>

                        <DateText>
                            August 11, 2024
                        </DateText>
                    </Box>

                    <Box>
                        <HeadingText>Charter vs. Private Yachts: Understanding the Differences and Benefits for Yacht Crew</HeadingText>
                    </Box>

                    <Box>
                        <GradientButton variant="contained" color="white">Read More</GradientButton>

                    </Box>

                </Box>



            </Box>
        </Container>
    )
}


const linearGradient = "linear-gradient(90deg, #034D92, #0487D9)";
const linearGradient2 = "linear-gradient(90deg, #0487D9, #034D92)";
const HeadingText = styled(Typography)(({ theme }) => ({
    color: "#000000",
    fontFamily: "Plus Jakarta Sans, sans-serif",
    fontWeight: 500,
    fontSize: "40px", // Default for large screens
    lineHeight: "48.4px",
    letterSpacing: "-0.02em",
  
    [theme.breakpoints.down("lg")]: {
      fontSize: "36px",
      lineHeight: "44px",
    },
    [theme.breakpoints.down("md")]: {
      fontSize: "32px",
      lineHeight: "40px",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "28px",
      lineHeight: "36px",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: "24px",
      lineHeight: "32px",
    },
  }));
  const FeaturedText = styled(Typography)({
    fontFamily: "Inter, sans-serif",
    fontWeight: 500,
    fontSize: "16px",
    lineHeight: "36.4px",
    letterSpacing: "0%",
    color:  "#0487D9B8",
})

const DateText = styled(Typography)({
    fontFamily: "Manrope, sans-serif",
    fontWeight: 500,
    fontSize: "16px",
    lineHeight: "24px",
    letterSpacing: "0%",
    color: "#636363",
})
const GradientButton = styled(Button)(({ theme }) => ({
    background: linearGradient,
    fontSize: "16px", // Default for larger screens
    fontFamily: "Inter, sans-serif",
    textTransform: "none",
    padding: "15px 41px", // Default padding for large screens
    color: "#FFFFFF",
  
    "&:hover": {
      background: linearGradient2,
    },
  
    [theme.breakpoints.down("md")]: {
      fontSize: "14px",
      padding: "12px 32px",
    },
    
    [theme.breakpoints.down("sm")]: {
      fontSize: "13px",
      padding: "10px 24px",
    },
  }));
export default Section2ResourceCenter