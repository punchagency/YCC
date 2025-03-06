import { Box, Typography, Grid } from '@mui/material'
import image1 from '../../assets/images/about-us/section4.1.png'
import image2 from '../../assets/images/about-us/section4.2.png'
import image3 from '../../assets/images/about-us/section4.3.png'
import { styled } from '@mui/material/styles';
const Section4AboutUs = () => {
    const gridItems = [
        {
            image: image1,
            heading: "Global Reach",
            subText: "Using AI to connect yachting professionals with service & suppliers across all major hubs.",
        },
        {
            image: image2,
            heading: "Tailored Support",
            subText: "Stepping into the future of simplified Yacht management. Join us as we revolutionize the industry.",
        },
        {
            image: image3,
            heading: "Passion for Excellence",
            subText: "A commitment to raising standards and empowering success in the yachting industry.",
        },

    ]

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            padding: { xs: 5, md: 10 },
            color: "black",
            gap: { xs: 5, md: 10 },
        }}>
            <HeadingText>
                Why Yacht Crew Center
            </HeadingText>

            <Grid container spacing={2}>
                {gridItems.map((item, index) => (
                    <Grid item xs={12} md={4} key={index}>
                        <Box sx={{ width: "100%", height: "auto" }}>
                            <img
                                src={item.image}
                                alt="Your Description"
                                style={{ width: "100%", height: "auto", display: "block" }}
                            />
                        </Box>
                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            textAlign: "left",
                            height: { xs: "200px", md: "300px", lg: "200px" },
                            width: "100%",
                            gap: '17.8px',
                            padding: "20px",
                            borderBottomLeftRadius: "15.7px",
                            borderBottomRightRadius: "15.7px",
                            boxShadow: "0px 4.19px 4.19px 0px #0000001A"

                        }}>
                            <SecondaryHeadingText>
                                {item.heading}
                            </SecondaryHeadingText>

                            <SecondarySubTextBlack>
                                {item.subText}
                            </SecondarySubTextBlack>

                        </Box>
                    </Grid>
                ))}

            </Grid>



        </Box>
    )
}

const HeadingText = styled(Typography)({
    color: "#000000",
    fontFamily: "Plus Jakarta Sans, sans-serif",
    fontWeight: 500,
    fontSize: "45px",
    lineHeight: "51px",
    letterSpacing: "-0.02em",
})
const SecondaryHeadingText = styled(Typography)({
    color: "#000000",
    fontFamily: "Plus Jakarta Sans, sans-serif",
    fontWeight: 500,
    fontSize: "30px",
    lineHeight: "36.6px",
    letterSpacing: "1%",

})
const SecondarySubTextBlack = styled(Typography)({
    fontFamily: "Inter",
    fontWeight: 400,
    fontSize: "18px",
    lineHeight: "26.55px",
    letterSpacing: "0%",
    color: "#373737",
})

export default Section4AboutUs