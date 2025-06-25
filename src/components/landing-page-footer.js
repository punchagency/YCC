import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  List,
  ListItem,
} from "@mui/material";
import { GradientButton } from "./landing-page-header";
import { styled } from "@mui/material/styles";
import logo from "../assets/images/icons/plain-white-icon.png";
import { Link } from "react-router-dom";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import TermsModal from "./TermsModal";

const LandingPageFooter = () => {
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const footerData = [
    {
      title: "Quick Links",
      links: [
        { name: "Home", path: "/" },
        { name: "Vendor & Services", path: "/vendor-services" },
        { name: "About Us", path: "/about-us" },
        { name: "Resource Center", path: "/resource-center" },
        { name: "Contact Us", path: "/contact-us" },
      ],
    },
    {
      title: "Departments",
      links: [
        { name: "Captain", path: "/captain" },
        { name: "Chef/Galley", path: "/chef-galley" },
        { name: "Engineering", path: "/engineering" },
        { name: "Crew", path: "/crew" },
        { name: "Interior", path: "/interior" },
        { name: "Exterior", path: "/exterior" },
      ],
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        background: "#011632",
        width: "100%",
        position: "relative",
        bottom: 0,
        left: 0,
        minHeight: "40vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        mt: "auto",
        zIndex: 0,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3} sx={{ py: 4 }}>
          <Grid item xs={12} md={4}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: { xs: 'center', md: 'flex-start' },
              gap: 2
            }}>
              <img src={logo} alt="logo" style={{ width: "70px", height: "65px" }} />
              <Link to="/contact-us" style={{ textDecoration: "none" }}>
                <GradientButton>
                  <ButtonTypography sx={{ color: "white" }}>
                    Contact Yacht Crew Center, LLC
                  </ButtonTypography>
                </GradientButton>
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Box>
                  <FooterHeadingTypography>{footerData[0].title}</FooterHeadingTypography>
                  <List>
                    {footerData[0].links.map((linkItem, idx) => (
                      <ListItem
                        key={idx}
                        component={Link}
                        to={linkItem.path}
                        sx={{ paddingLeft: "0px", paddingBlock: "5px" }}
                      >
                        <FooterTypography>{linkItem.name}</FooterTypography>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box>
                  <FooterHeadingTypography>{footerData[1].title}</FooterHeadingTypography>
                  <List>
                    {footerData[1].links.map((linkItem, idx) => (
                      <ListItem
                        key={idx}
                        component={Link}
                        to={linkItem.path}
                        sx={{ paddingLeft: "0px", paddingBlock: "5px" }}
                      >
                        <FooterTypography>{linkItem.name}</FooterTypography>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ 
              borderTop: '1px solid rgba(255,255,255,0.1)',
              mt: 3,
              pt: 3,
            }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  <Box sx={{ 
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'center', md: 'flex-start' },
                    gap: { xs: '10px', sm: '0' },
                  }}>
                    <CopyrightText>
                      © 2025 SC Yacht Crew Center LLC . All Rights Reserved.
                    </CopyrightText>
                    <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' }, mx: 2, color: '#E0E0E0' }}>|</Box>
                    <FooterButton onClick={() => setIsTermsModalOpen(true)}>Terms and Conditions</FooterButton>
                    <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' }, mx: 2, color: '#E0E0E0' }}>|</Box>
                    <FooterButton onClick={() => setIsPrivacyModalOpen(true)}>Privacy Policy</FooterButton>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{
                    display: 'flex',
                    justifyContent: { xs: 'center', md: 'flex-end' },
                    gap: '10px',
                    mt: { xs: 2, md: 0 },
                  }}>
                    <SocialIconLink href="https://www.facebook.com/groups/yachtiesnameshameandfame" target="_blank" rel="noopener noreferrer">
                      <FacebookIcon sx={{ color: "white" }} />
                    </SocialIconLink>
                    <SocialIconLink href=" https://www.instagram.com/yachtcrewcenter" target="_blank" rel="noopener noreferrer">
                      <InstagramIcon sx={{ color: "white" }} />
                    </SocialIconLink>
                    <SocialIconLink href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                      <YouTubeIcon sx={{ color: "white" }} />
                    </SocialIconLink>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Terms and Conditions Modal */}
      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        pdfUrl="/Terms-and-Conditions.pdf"
        title="Yacht Crew Center Terms and Conditions"
        fileName="YCC-Terms-and-Conditions.pdf"
      />

      {/* Privacy Policy Modal */}
      <TermsModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        pdfUrl="/Privacy-Policy.pdf"
        title="Yacht Crew Center Privacy Policy"
        fileName="YCC-Privacy-Policy.pdf"
      />
    </Box>
  );
};

const ButtonTypography = styled(Typography)({
  fontSize: "16px",
  fontFamily: "Inter, sans-serif",
  lineHeight: "19px",
  fontWeight: 600,
  display: "flex",
  justifyContent: "center",
});

const FooterHeadingTypography = styled(Typography)({
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 600,
  fontSize: "20px",
  lineHeight: "24px",
  letterSpacing: "0%",
  color: "#FFFFFF",
  whiteSpace: "nowrap"
});

const FooterTypography = styled(Typography)(({ theme }) => ({
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 400,
  fontSize: "16px",
  lineHeight: "21px",
  letterSpacing: "0%",
  color: "#E0E0E0",
  transition: "all 0.3s ease-in-out",
  position: "relative",
  "&:hover": {
    color: "#0487D9",
    transform: "translateX(5px)",
  },
  "&:after": {
    content: '""',
    position: "absolute",
    width: "0",
    height: "2px",
    bottom: -2,
    left: 0,
    background: "#0487D9",
    transition: "width 0.3s ease-in-out",
  },
  "&:hover:after": {
    width: "100%",
  },

  [theme.breakpoints.up("md")]: {
    whiteSpace: "nowrap",
  },

  [theme.breakpoints.down("sm")]: {
    whiteSpace: "normal",
  },
}));

const FooterButton = styled('button')({
  background: "none",
  border: "none",
  padding: 0,
  font: "inherit",
  cursor: "pointer",
  outline: "inherit",
  color: "#E0E0E0",
  textDecoration: "none",
  transition: "all 0.3s ease-in-out",
  position: "relative",
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 400,
  fontSize: "14px",
  lineHeight: "18px",
  letterSpacing: "0%",
  whiteSpace: "nowrap",
  "&:hover": {
    color: "#0487D9",
    transform: "translateX(5px)",
  },
  "&:after": {
    content: '""',
    position: "absolute",
    width: "0",
    height: "2px",
    bottom: -2,
    left: 0,
    background: "#0487D9",
    transition: "width 0.3s ease-in-out",
  },
  "&:hover:after": {
    width: "100%",
  }
});

const SocialIconLink = styled('a')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px) scale(1.1)',
    '& svg': {
      color: '#0487D9 !important',
    }
  },
  '& svg': {
    fontSize: '24px',
    transition: 'all 0.3s ease-in-out',
  }
});

const CopyrightText = styled(Typography)(({ theme }) => ({
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 400,
  fontSize: "16px",
  lineHeight: "21px",
  letterSpacing: "0%",
  color: "#E0E0E0",
  [theme.breakpoints.up("md")]: {
    whiteSpace: "nowrap",
  },
  [theme.breakpoints.down("sm")]: {
    whiteSpace: "normal",
  },
}));

export default LandingPageFooter;
