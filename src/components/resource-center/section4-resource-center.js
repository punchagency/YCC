import { Box, Typography, Grid, styled, Button } from '@mui/material'
import image1 from '../../assets/images/resource-center/section3.1.png'
import image2 from '../../assets/images/resource-center/section3.2.png'
import image3 from '../../assets/images/resource-center/section3.3.png'

const ResourceCenterSection4 = () => {
    const gridItems = [
        {
            image: image1,
            heading: "The Best Seasons for Yachting: Finding Work as a Yacht Crew Member",
            author: "Alex Siegars",
        },
        {
            image: image2,
            heading: "Love Couple Boats: The Soap Opera in 7 Acts",
            author: "Alex Siegars",
        },
        {
            image: image3,
            heading: "Life After Yachting: Planning for a Secure Financial Future",
            author: "Alex Siegars",
        },
        {
            image: image1,
            heading: "The Best Seasons for Yachting: Finding Work as a Yacht Crew Member",
            author: "Alex Siegars",
        },
        {
            image: image2,
            heading: "Love Couple Boats: The Soap Opera in 7 Acts",
            author: "Alex Siegars",
        },
        {
            image: image3,
            heading: "Life After Yachting: Planning for a Secure Financial Future",
            author: "Alex Siegars",
        },
        {
            image: image1,
            heading: "The Best Seasons for Yachting: Finding Work as a Yacht Crew Member",
            author: "Alex Siegars",
        },
        {
            image: image2,
            heading: "Love Couple Boats: The Soap Opera in 7 Acts",
            author: "Alex Siegars",
        },
        {
            image: image3,
            heading: "Life After Yachting: Planning for a Secure Financial Future",
            author: "Alex Siegars",
        },
        {
            image: image1,
            heading: "The Best Seasons for Yachting: Finding Work as a Yacht Crew Member",
            author: "Alex Siegars",
        }

    ]

    return (<Box
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: { xs: 5, md: 10 },
          color: "black",
          gap: { xs: 5, md: 10 },
        }}
      >
        <HeadingText>Recently Published Resources</HeadingText>
      
        <Grid container spacing={3} sx={{ overflow: "hidden" }}>
          {gridItems.map((item, index) => (
            <Grid
              item
              xs={12}
              md={4}
              key={index}
              sx={{ minHeight: { md: "43vh" }, display: "flex", flexDirection: "column" }} // Use minHeight instead of height
            >
              <Box
                sx={{
                  width: "100%",
                  borderTopLeftRadius: "20px",
                  borderTopRightRadius: "20px",
                  flexGrow: 1, // Ensures the card expands naturally
                }}
              >
                <img
                  src={item.image}
                  alt="Your Description"
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                    borderTopLeftRadius: "20px",
                    borderTopRightRadius: "20px",
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  padding: { xs: "20px", md: "40px" },
                  gap: "20px",
                  textAlign: "left",
                  justifyContent: "space-between",
                  flexGrow: 1, // Prevents height inconsistencies
                  border: "1px solid #E0E0E0",
                  borderBottomLeftRadius: "20px",
                  borderBottomRightRadius: "20px",
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <Box sx={{ display: "flex", gap: "10px", justifyContent: "space-between" }}>
                    <AuthorText>{item.author}</AuthorText>
                    <DateText>August 11, 2024</DateText>
                  </Box>
                  <Box>
                    <SubHeadingText>{item.heading}</SubHeadingText>
                  </Box>
                </Box>
      
                <Box>
                  <GradientButton variant="contained" color="white">
                    Read More
                  </GradientButton>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
      
    )
}

const linearGradient = "linear-gradient(90deg, #034D92, #0487D9)";
const linearGradient2 = "linear-gradient(90deg, #0487D9, #034D92)";


const HeadingText = styled(Typography)(({ theme }) => ({
    color: "#000000",
    fontFamily: "Plus Jakarta Sans, sans-serif",
    fontWeight: 500,
    fontSize: "46px", // Updated base font size
    lineHeight: "51.06px",
    letterSpacing: "-2%",
  
    [theme.breakpoints.down("lg")]: {
      fontSize: "40px",
      lineHeight: "45px",
    },
    [theme.breakpoints.down("md")]: {
      fontSize: "34px",
      lineHeight: "40px",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "28px",
      lineHeight: "34px",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: "24px",
      lineHeight: "30px",
    },
  }));
const SubHeadingText = styled(Typography)(({ theme }) => ({
    color: "#000000",
    fontFamily: "Plus Jakarta Sans, sans-serif",
    fontWeight: 500,
    fontSize: "29px", // Default for large screens
    lineHeight: "35.09px",
    letterSpacing: "-0.02em",

  
    [theme.breakpoints.down("lg")]: {
      fontSize: "25px",
      lineHeight: "25px",
    },
    [theme.breakpoints.down("md")]: {
      fontSize: "22px",
      lineHeight: "25px",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "19px",
      lineHeight: "25px",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: "18px",
      lineHeight: "25px",
    },
  }));

const DateText = styled(Typography)({
    fontFamily: "Manrope, sans-serif",
    fontWeight: 500,
    fontSize: "16px",
    lineHeight: "24px",
    letterSpacing: "0%",
    color: "#636363",
})

const AuthorText = styled(Typography)({
    fontFamily: "Inter, sans-serif",
    fontWeight: 500,
    fontSize: "16px",
    lineHeight: "19.36px",
    letterSpacing: "0%",
    color: '#000000'
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
export default ResourceCenterSection4;
