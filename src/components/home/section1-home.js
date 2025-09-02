import { Box, Typography, styled, Container, Grid, Badge } from '@mui/material'
import yatch from '../../assets/images/yatch-home.png'
import { linearGradient } from '../landing-page-header'

const Section1Home = () => {
    return (

        <Box component="section" sx={{
            width: "100%",
        }}>

            <Container maxWidth="lg" sx={{
                display: "flex",
                flexDirection: "row",
                gap: "28px"
            }}>

                <Grid container spacing={4} sx={{
                    flexWrap: "wrap",
                }}>

                    {/* <Grid item xs={12} md={6}>
                        <img src={yatch} alt="Yacht Crew Center"
                            style={{ width: "100%", height: "auto", maxWidth: "100%" }} />
                    </Grid> */}

                    <Grid item xs={12} md={6} sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "28px",
                        textAlign: { xs: "center", md: "left" },
                        marginTop: { xs: "20px", md: "0px" },
                    }}>

                        <Box sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            flexDirection: "row",
                        }}>
                            <Badge variant='dot' sx={{
                                "& .MuiBadge-dot": {
                                    background: linearGradient,
                                },
                            }} />
                            <GradientText>
                                Explore The Future of Yachting
                            </GradientText>
                        </Box>
                        <HeadingText>
                            Meet Your AI Assistant for All Things Yachting
                        </HeadingText>

                        <SecondarySubTextBlack variant='body1'
                            sx={{
                                fontSize: "18px",
                            }}
                        >
                        Welcome to the future of yachting support. This AI Assistant is designed to empower all Crew member, Captain, Engineer, Chef, Exterior and Interior teams alike. Whether you’re seeking answers to complex questions, service providers, suppliers or retrieving yacht-specific information.
                        </SecondarySubTextBlack>
                        {/* <SecondarySubTextBlack variant='body1'
                            sx={{
                                fontSize: "18px",
                            }}
                        >
                            Our AI Assistant delivers instant, accurate support tailored to your needs. Ready to experience the power of the AI Assistant? Ask a question now and get tailored solutions in seconds!
                        </SecondarySubTextBlack> */}
                    </Grid>
                </Grid>



            </Container>

        </Box>
    )
}


export const SecondarySubTextBlack = styled(Typography)(({ theme }) => ({
    fontFamily: "Inter",
    fontWeight: 400,
    fontSize: "18px",
    lineHeight: "128%",
    letterSpacing: "0%",
    color: "#373737",
    textAlign: {xs: "justify", sm: "justify", md: "left"},
}))

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

export const GradientText = styled(Typography)(({ theme }) => ({
  background: linearGradient,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  fontFamily: "Inter",
  fontWeight: 600,
  fontSize:"14px",  // Smaller font on mobile
  lineHeight: theme.breakpoints.down("sm") ? "14px" : "16.94px",  // Adjusted line height
  letterSpacing: "-2%",
  textTransform: "uppercase",
  display: "inline-block",
}));
export default Section1Home