import { Box, Container, Typography, Grid, styled, TextField, Button } from '@mui/material'
import image from '../../assets/images/icons/home-page-chef.png'
import FormContactUs from './form-contact-us'
const Section1ContactUs = () => {

    const gridData = [
        {
            image: image,
            title: "Reach out",
            subtext: "Email : contact@yachtcrewcenter.com",
        },
        {
            image: image,
            title: "Yacht Crew Center, LLC",
            subtext: "Fort Lauderdale, FL",
        },
        {
            image: image,
            title: "Global Yacht Services",
            subtext: "+1 954 532 0550",
        },

    ]


    return (
        <Box sx={{
            height: "auto",
            padding: { xs: "20px", md: "40px" },

        }}>

            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                        gap: "55px",
                        padding: "20px",
                    }}>
                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "24px",
                            textAlign: "left",
                        }}>
                            <HeadingText>Get In Contact Today</HeadingText>
                            <SecondarySubTextBlack>Need Specialized Assistance? We're Here to Help. At Yacht Crew Center, we understand that urgent situations can arise onboard. Finding the right service or product quickly is crucial. If you’re facing an emergency, need specialized support. Can’t locate a specific item or vendor our team is ready to assist. Contact us for fast, personalized solutions tailored to your needs—we’ll connect you with the right resources to keep your operations running smoothly.</SecondarySubTextBlack>
                        </Box>

                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "36px",
                        }}>
                            {gridData.map((item, index) => (
                                <Box key={index} sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    gap: "15px",
                                }}>
                                    <Box>
                                        <img src={image} alt="yacht" style={{
                                            width: 69.5,
                                            height: 69.5,
                                        }} />
                                    </Box>
                                    <Box sx={{
                                        textAlign: "left",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "7px",
                                    }}>
                                        <SecondaryHeadingText>{item.title}</SecondaryHeadingText>
                                        <SecondarySubTextBlack>{item.subtext}</SecondarySubTextBlack>
                                    </Box>

                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <FormContactUs />
                </Grid>
            </Grid>

        </Box>
    )
}

const HeadingText = styled(Typography)({
    fontFamily: "Plus Jakarta Sans",
    fontWeight: 500,
    fontSize: "46px",
    lineHeight: "51.06px",
    letterSpacing: "-2%",
    color: "#131313",
})
const SecondaryHeadingText = styled(Typography)({
    fontFamily: "Plus Jakarta Sans",
    fontWeight: 500,
    fontSize: "30px",
    lineHeight: "36.6px",
    letterSpacing: "1%",
    color: "#131313",
})
const SecondarySubTextBlack = styled(Typography)({
    fontFamily: "Inter",
    fontWeight: 400,
    fontSize: "18px",
    lineHeight: "26px",
    letterSpacing: "-0.03em",
    color: "#373737",
    textAlign: "justify",
})


export default Section1ContactUs;
