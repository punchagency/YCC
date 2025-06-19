import collage from '../../assets/images/about-us/section3.png'
import { Box, Typography, styled, Container, Button, Grid } from '@mui/material'
import { useInView } from 'react-intersection-observer';

const Section3AboutUs = () => {
    const [ref, inView] = useInView({
        threshold: 0.3,
        triggerOnce: true
    });

    const data = {
        title: 'Our Partnership with Global Yacht Services',
        image: collage,
        subText1: 'At Yacht Crew Center, LLC, we are proud to partner with Global Yacht Services, a well-established leader in the yachting industry. ',
        subText2: 'Through this collaboration, we gain access to an extensive network of industry connections, trusted suppliers, and vendors. This partnership enables us to enhance the services we provide, offering unparalleled resources and expertise .',
        subText3: 'Together with Global Yacht Services, we are committed to delivering innovative solutions that streamline yacht operations and empower the global yachting community.',
    }

    return (
        <Box component="section" sx={{
            width: "100%",
            background: "#011632",
            paddingBlock: { xs: 5, md: 0 },
            overflow: "hidden"
        }}>
            <Container maxWidth="lg" sx={{
                display: "flex",
                flexDirection: "row",
                gap: "28px"
            }}>
                <Grid container spacing={4} sx={{
                    flexWrap: "wrap",
                    padding: { xs: 0, md: 5 }
                }} ref={ref}>
                    <Grid item xs={12} md={7}>
                        <AnimatedBox
                            sx={{
                                transform: inView ? 'translateX(0)' : 'translateX(-100px)',
                                opacity: inView ? 1 : 0,
                                transition: 'all 0.8s ease-out',
                            }}
                        >
                            <img
                                src={data.image}
                                alt="Yacht Crew Center"
                                style={{ 
                                    width: "100%", 
                                    height: "auto", 
                                    display: "block",
                                    borderRadius: "13px",
                                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)"
                                }}
                            />
                        </AnimatedBox>
                    </Grid>

                    <Grid item xs={12} md={5} sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                        textAlign: { xs: "center", md: "left" },
                        alignItems: "start",
                    }}>
                        <AnimatedBox
                            sx={{
                                transform: inView ? 'translateX(0)' : 'translateX(100px)',
                                opacity: inView ? 1 : 0,
                                transition: 'all 0.8s ease-out',
                            }}
                        >
                            <HeadingText>
                                {data.title}
                            </HeadingText>

                            <Box sx={{ mt: 3 }}>
                                {[data.subText1, data.subText2, data.subText3].map((text, index) => (
                                    <AnimatedText
                                        key={index}
                                        sx={{
                                            transform: inView ? 'translateY(0)' : 'translateY(20px)',
                                            opacity: inView ? 1 : 0,
                                            transition: `all 0.8s ease-out ${0.2 * (index + 1)}s`,
                                        }}
                                    >
                                        {text}
                                    </AnimatedText>
                                ))}
                            </Box>
                        </AnimatedBox>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}

const linearGradient = "linear-gradient(90deg, #034D92, #0487D9)";
const linearGradient2 = "linear-gradient(90deg, #0487D9, #034D92)";

const AnimatedBox = styled(Box)({
    display: 'block',
    width: '100%',
});

const AnimatedText = styled(Typography)({
    fontFamily: "Inter",
    fontWeight: 400,
    fontSize: "18px",
    lineHeight: "26px",
    letterSpacing: "-0.03em",
    color: " #FFFFFFCC",
    textAlign: "justify",
    marginBottom: "15px",
});

const HeadingText = styled(Typography)({
    color: "white",
    fontFamily: "Plus Jakarta Sans, sans-serif",
    fontWeight: 500,
    fontSize: "45px",
    lineHeight: "51px",
    letterSpacing: "-0.02em",
    marginBottom: "10px",
    background: linearGradient,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
});

export const ButtonTypography = styled(Typography)({
    fontSize: "16px",
    fontFamily: "Inter, sans-serif",
    lineHeight: "19px",
    fontWeight: 600,
});

export const GradientButton = styled(Button)({
    background: linearGradient,
    fontSize: "16px",
    fontFamily: "Inter, sans-serif",
    textTransform: "none",
    "&:hover": {
        background: linearGradient2,
    },
    padding: "12px 14px",
});

export default Section3AboutUs  
