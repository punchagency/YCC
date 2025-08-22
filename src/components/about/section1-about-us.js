import collage from '../../assets/images/about-us/section1.png'
import { Box, Typography, styled, Container,Button, Grid } from '@mui/material'

const Section1AboutUs = () => {

    const data = {
        title:' Who We Are',
        image : collage,
        subText1: 'Yacht Crew Center, LLC is dedicated to empowering yachting professionals globally with innovative solutions that simplify life at sea and onshore. More than just a resource hub, we are your trusted partner in navigating the complexities of the yachting industry. Driven by our passion for excellence, we are committed to integrating cutting-edge AI support technology into our platform, redefining what’s possible for yachting professionals. ',
        // subText2: 'Our tools are designed to streamline tasks, enhance efficiency, and enable crew to focus on what truly matters. Whether it’s delivering exceptional service, growing professionally, or enjoying life’s meaningful moments. At Yacht Crew Center, we believe in transforming the yachting industry through innovation, collaboration, and a shared vision of success.'
    }
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

                    <Grid item xs={12} md={7}>

                            <img
                                src={data.image}
                                alt="Yacht Crew Center"
                                style={{ width: "100%", height: "auto", display: "block" }}
                            />

                    </Grid>


                    <Grid item xs={12} md={5} sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        textAlign: { xs: "center", md: "left" },
                        alignItems: "start",
                    }}>

                        <HeadingText>
                            {data.title}
                        </HeadingText>

                        <SecondarySubTextBlack variant='body1'>
                            {data.subText1}
                        </SecondarySubTextBlack>
                        {/* <SecondarySubTextBlack variant='body1'>
                            {data.subText2}
                        </SecondarySubTextBlack> */}
                    </Grid>
                </Grid>



            </Container>

        </Box>
    )
}
const linearGradient = "linear-gradient(90deg, #034D92, #0487D9)";
const linearGradient2 = "linear-gradient(90deg, #0487D9, #034D92)";

const SecondarySubTextBlack = styled(Typography)({
    fontFamily: "Inter",
    fontWeight: 400,
    fontSize: "18px",
    lineHeight: "26px",
    letterSpacing: "-0.03em",
    color: "#373737",
    textAlign: "justify",
})

const HeadingText = styled(Typography)({
    color: "#131313",
    fontFamily: "Plus Jakarta Sans, sans-serif",
    fontWeight: 500,
    fontSize: "45px",
    lineHeight: "51px",
    letterSpacing: "-0.02em",
})

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

export default Section1AboutUs
