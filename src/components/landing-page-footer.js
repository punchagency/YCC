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
import { Link, useNavigate } from "react-router-dom";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TermsModal from "./TermsModal";
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import crewCenterAnchor from '../assets/images/crew-center-anchor.svg'

const LandingPageFooter = () => {
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const navigate = useNavigate();

  const footerData = [
    {
      title: "QUICK LINKS",
      links: [
        { name: "Home", path: "/" },
        { name: "Vendor & Services", path: "/vendor-services" },
        { name: "About Us", path: "/about-us" },
        { name: "Resource Center", path: "/resource-center" },
        { name: "Contact Us", path: "/contact-us" },
      ],
    },
    {
      title: "DEPARTMENTS",
      links: [
        { name: "Captain", path: "/captain" },
        { name: "Chef/Galley", path: "/chef-galley" },
        { name: "Engineering", path: "/engineering" },
        { name: "Crew", path: "/crew" },
        { name: "Interior", path: "/interior" },
        { name: "Exterior", path: "/exterior" },
      ],
    },
    {
      title: "AFFILIATE PROGRAM",
      links: [
        { name: "Join Our Affiliate Program", path: "https://affiliate.yachtcrewcenter.com/", external: true },
      ],
    }
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
        mt: "0",
        zIndex: 0,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3} sx={{ py: 4 }}>
          
          <Grid item xs={12} md={5}>
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
                  <img src={crewCenterAnchor} alt="Yacht Crew Center" style={{ marginLeft: "10px" }} />
                </GradientButton>
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} md={7}>
            <Grid container spacing={3}>
              {footerData.map((item, idx) => (
                <Grid item key={idx} xs={12} md={4}>
                  <Box>
                    <FooterHeadingTypography>{item.title}</FooterHeadingTypography>
                    <List>
                      {item.links.map((linkItem, idx) => (
                        <ListItem
                          key={idx}
                          component={linkItem.external ? "a" : Link}
                          {...(linkItem.external 
                            ? { 
                                href: linkItem.path, 
                                target: "_blank", 
                                rel: "noopener noreferrer",
                                style: { textDecoration: "none" }
                              } 
                            : { to: linkItem.path }
                          )}
                          sx={{ paddingLeft: "0px", paddingBlock: "5px" }}
                        >
                          <FooterTypography>{linkItem.name}</FooterTypography>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Grid>
              ))}
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
                      © {new Date().getFullYear()} SC Yacht Crew Center LLC . All Rights Reserved.
                    </CopyrightText>
                    <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' }, mx: 2, color: '#E0E0E0' }}>|</Box>
                    <FooterButton onClick={() => navigate("/terms-and-conditions")}>Terms and Conditions</FooterButton>
                    <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' }, mx: 2, color: '#E0E0E0' }}>|</Box>
                    <FooterButton onClick={() => navigate("/privacy-policy")}>Privacy Policy</FooterButton>
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
                    {/* <SocialIconLink href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                      <YouTubeIcon sx={{ color: "white" }} />
                    </SocialIconLink> */}
                    <SocialIconLink href="https://www.linkedin.com/company/106474229/dashboard/" target="_blank" rel="noopener noreferrer">
                      <LinkedInIcon sx={{ color: "white" }} />
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
        pdfUrl="/terms-and-conditions"
        title="Yacht Crew Center Terms and Conditions"
        fileName="YCC-Terms-and-Conditions.pdf"
      />

      {/* Privacy Policy Modal */}
      <TermsModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        pdfUrl="/privacy-policy"
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
  lineHeight: "120%",
  letterSpacing: "0%",
  color: "#FFFFFF",
  whiteSpace: "nowrap",
  textTransform: "uppercase",
  textAlign: "start"
});

const FooterTypography = styled(Typography)(({ theme }) => ({
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 400,
  fontSize: "16px",
  lineHeight: "24px",
  letterSpacing: "0%",
  color: "#fff",
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
  textAlign: "center",
  [theme.breakpoints.up("md")]: {
    whiteSpace: "nowrap",
  },
  [theme.breakpoints.down("sm")]: {
    whiteSpace: "normal",
  },
}));

export default LandingPageFooter;
