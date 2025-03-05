import collage from '../../assets/images/about-us/section3.png'
import { Box, Typography, styled, Container,Button, Grid } from '@mui/material'

const Section3AboutUs = () => {

    const data = {
        title:'Our Partnership with Global Yacht Services',
        image : collage,
        subText1: 'At Yacht Crew Center, LLC, we are proud to partner with Global Yacht Services, a well-established leader in the yachting industry. ',
        subText2: 'Through this collaboration, we gain access to an extensive network of industry connections, trusted suppliers, and vendors. This partnership enables us to enhance the services we provide, offering unparalleled resources and expertise .',
        subText3: 'Together with Global Yacht Services, we are committed to delivering innovative solutions that streamline yacht operations and empower the global yachting community.',
    }
    return (
        <Box component="section" sx={{
            width: "100%",
            background: "#011632",
            paddingBlock: { xs: 5, md: 0 }
        }}>

            <Container maxWidth="lg" sx={{
                display: "flex",
                flexDirection: "row",
                gap: "28px"
            }}>

                <Grid container spacing={4} sx={{
                    flexWrap: "wrap",
                    padding: { xs: 0, md: 5 }
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
                        <SecondarySubTextBlack variant='body1'>
                            {data.subText2}
                        </SecondarySubTextBlack>
                        <SecondarySubTextBlack variant='body1'>
                            {data.subText3}
                        </SecondarySubTextBlack>
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
    color: " #FFFFFFCC",
    textAlign: "justify",
})

const HeadingText = styled(Typography)({
    color: "white",
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
export default Section3AboutUs  
