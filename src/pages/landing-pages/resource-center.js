import { Box, Typography, styled, Paper, Stack, Avatar } from "@mui/material";
import banner from "../../assets/images/resource-center/YCC-resource-center-banner.png";
import LandingPageBanner from "../../components/landing-page-banner";
import LandingPageFooter from "../../components/landing-page-footer";
import Section1ResourceCenter from "../../components/resource-center/section1-resource-center";
import Section3ResourceCenter from "../../components/resource-center/section3-resource-center";
import ResourceCenterSection4 from "../../components/resource-center/section4-resource-center";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useEffect, useState } from "react";
import { LandingPageAIProvider } from "../../context/AIAssistant/landingPageAIContext";
import LandingPageChatbot from "../../components/chatbot/landing-page-chatbot";

const ResourceCenter = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const backgroundImage = banner;
  const header = (
    <>
      <GradientText>Resource</GradientText> <GradientText>Center</GradientText>{" "}
      <br /> Yacht Crew Center
    </>
  );

  // LIFTED STATE
  const [toggle, setToggle] = useState("Supplies");
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");

  return (
    <LandingPageAIProvider>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: { xs: 3, md: 4 },
          width: { xs: "100vw", md: "100%" },
          maxWidth: { xs: "100vw", md: "none" },
          margin: 0,
          boxSizing: "border-box",
        }}
      >
        <LandingPageBanner backgroundImage={backgroundImage} header={header} />
        <Section1ResourceCenter
          toggle={toggle}
          setToggle={setToggle}
          category={category}
          setCategory={setCategory}
          search={search}
          setSearch={setSearch}
        />
        <Section3ResourceCenter />
        <Box sx={{ mt: 1 }}>
          {toggle === "Supplies" && (
            <ResourceCenterSection4
              type="supplies"
              category={category}
              search={search}
            />
          )}
          {toggle === "Services" && (
            <ResourceCenterSection4
              type="services"
              category={category}
              search={search}
            />
          )}
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            mb: 6,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              background: "#0487D9",
              color: "#fff",
              borderRadius: "24px",
              px: { xs: 2, md: 6 },
              py: { xs: 2, md: 3 },
              maxWidth: 1000,
              width: "100%",
              display: "flex",
              alignItems: "center",
              boxShadow: "none",
            }}
          >
            <Stack
              direction="row"
              spacing={3}
              alignItems="flex-start"
              width="100%"
            >
              <Avatar
                sx={{
                  bgcolor: "rgba(0,0,0,0.10)",
                  width: 40,
                  height: 40,
                  mt: 0.5,
                }}
              >
                <InfoOutlinedIcon sx={{ color: "#fff" }} />
              </Avatar>
              <Box>
                <Typography
                  component="span"
                  sx={{ fontWeight: 700, fontSize: 18 }}
                >
                  Guest Access:
                </Typography>
                <Typography
                  component="span"
                  sx={{ fontWeight: 400, fontSize: 18, ml: 1 }}
                >
                  Browse all vendors & supplies freely. Place supply orders as a
                  guest.
                  <br />
                  <b>Sign in</b> to request quotes or book services.
                </Typography>
                <Typography
                  sx={{
                    fontStyle: "italic",
                    fontSize: 16,
                    mt: 1,
                    color: "rgba(255,255,255,0.85)",
                  }}
                >
                  AI Chat Support available for all users (basic access for
                  guests)
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Box>
        <LandingPageFooter />
      </Box>
      <LandingPageChatbot />
    </LandingPageAIProvider>
  );
};

const GradientText = styled(Typography)({
  fontWeight: 600,
  color: "#0487D9",
  fontFamily: "Plus Jakarta Sans, sans-serif",
  fontSize: "50px",
  lineHeight: "60px",
  letterSpacing: "-2%",
  textTransform: "uppercase",
  display: "inline-block",
});

export default ResourceCenter;
