import collage from "../../assets/images/vendor-services/section1.png";
import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  styled,
  Container,
  Grid,
} from "@mui/material";
import logo from "../../assets/images/captain/logo.png";

const Section1VendorServices = () => {
  const data = {
    title: "Managing Your Business Just Got Easier with the Yacht Crew Center.",
    image: collage,
    subText1:
      "Yacht Crew Center’s platform streamlines order and booking management. Ensuring you receive direct requests from those who need your expertise. By onboarding your business, you gain access to a global network, increased visibility, and secure consistent work. All while our system handles the heavy lifting.",
    subText2:
      "Our platform connects your services and inventory directly to a global network of yacht crew, professionals actively seeking trusted partners like you. With your business listed in a comprehensive directory, you’ll gain visibility across the yachting industry, driving growth and securing consistent orders.",
    button: {
      text: "Apply Now",
      link: "/apply",
    },
  };
  return (
    <Box
      component="section"
      sx={{
        width: "100%",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "28px",
        }}
      >
        <Grid
          container
          spacing={4}
          sx={{
            flexWrap: "wrap",
          }}
        >
          <Grid item xs={12} md={7}>
            {/* Wrapper for the first image */}
            <div
              style={{
                position: "relative",
                display: "inline-block",
                width: "100%",
              }}
            >
              {/* First Image */}
              <img
                src={data.image}
                alt="Yacht Crew Center"
                style={{ width: "100%", height: "auto", display: "block" }}
              />

              {/* Second Image (Icon) - Centered Inside `collage` */}
              <img
                src={logo}
                alt="Icon"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)", // Ensures proper centering
                  width: "100px", // Adjust size as needed
                  height: "auto",
                }}
              />
            </div>
          </Grid>

          <Grid
            item
            xs={12}
            md={5}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              textAlign: { xs: "center", md: "left" },
              alignItems: "start",
            }}
          >
            <HeadingText>{data.title}</HeadingText>

            <SecondarySubTextBlack variant="body1">
              {data.subText1}
            </SecondarySubTextBlack>
            <SecondarySubTextBlack variant="body1">
              {data.subText2}
            </SecondarySubTextBlack>

            {data.button?.link && data.button?.text && (
              <Link to={data.button.link}>
                <GradientButton >
                  <ButtonTypography sx={{ color: "white" }}>
                    {data.button.text}
                  </ButtonTypography>
                </GradientButton>
              </Link>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
const linearGradient = "linear-gradient(90deg, #034D92, #0487D9)";
export const linearGradient2 = "linear-gradient(90deg, #0487D9, #034D92)";

const SecondarySubTextBlack = styled(Typography)({
  fontFamily: "Inter",
  fontWeight: 400,
  fontSize: "18px",
  lineHeight: "26.55px",
  letterSpacing: "-0.03em",
  color: "#373737",
  textAlign: "justify",
});

const HeadingText = styled(Typography)({
  color: "#131313",
  fontFamily: "Plus Jakarta Sans, sans-serif",
  fontWeight: 500,
  fontSize: "43px",
  lineHeight: "51px",
  letterSpacing: "-0.04em",
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
  padding: "15px 41px",
});
export default Section1VendorServices;
