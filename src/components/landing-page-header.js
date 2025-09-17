import logo from "../assets/images/icons/YCC-navbar-icon.png";
import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import {
  AppBar,
  Toolbar,
  Button,
  Menu,
  MenuItem,
  Drawer,
  Collapse,
  IconButton,
  Avatar,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./SignInButton.css";
import LogoutIcon from "@mui/icons-material/Logout";

const LandingPageHeader = () => {
  const location = useLocation();
  const { user } = useUser();
  const navigate = useNavigate();
  const navItems = [
    { title: "Home", link: "/" },
    // {
    //   title: "Departments",
    //   link: "/departments",
    //   options: [
    //     { title: "Captain", route: "/captain" },
    //     { title: "Crew", route: "/crew" },
    //     { title: "Engineering", route: "/engineering" },
    //     { title: "Exterior", route: "/exterior" },
    //     { title: "Chef/Galley", route: "/chef-galley" },
    //     { title: "Interior", route: "/interior" },
    //   ],
    // },
    { title: "Vendor & Services", link: "/vendor-services" },
    { title: "About Us", link: "/about-us" },
    { title: "Resource Center", link: "/resource-center" },
    { title: "Contact", link: "/contact-us" },
    { title: "Affiliate Signup", link: "https://affiliate.yachtcrewcenter.com/", external: true },
  ];

  const [mobileOpen, setMobileOpen] = useState(false);
  const [departmentsAnchorEl, setDepartmentsAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const landingPages = [
    "/",
    "/resource-center",
    "/about-us",
    "/contact-us",
    "/crew",
    "/captain",
    "/exterior",
    "/interior",
    "/engineering",
    "/chef-galley",
    "/vendor-services",
  ];
  const isLandingPage = landingPages.includes(location.pathname);

  // Detect scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        // Change background when scrolled down 50px
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDepartmentsClick = (event) => {
    setDepartmentsAnchorEl(event.currentTarget);
  };

  const handleDepartmentsClose = () => {
    setDepartmentsAnchorEl(null);
  };

  const handleProfileClick = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  const toggleDrawer = () => setMobileOpen(!mobileOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <TransparentAppBar
      position="fixed"
      sx={{
        zIndex: 1300,
        transition: "0.3s ease-in-out",
        backgroundColor: {
          xs: "white",
          md: scrolled ? "rgba(0, 0, 0, 0.8)" : "transparent", // Change color on scroll
        },
        boxShadow: scrolled ? "0px 4px 10px rgba(0, 0, 0, 0.3)" : "none",
        maxWidth: "100%",
      }}
    >
      <Toolbar
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: { xs: "space-between", md: "space-between" },
          gap: "30px",
          paddingLeft: {
            xs: "20px",
            sm: "40px",
            md: "max(0px, calc(40% - 345px))",
            lg: "max(0px, calc(27% - 345px))"
          },
          paddingRight: {
            xs: "20px",
            sm: "40px",
            md: "80px",
            lg: "110px"
          }
        }}
      >
        {/* Back Button */}
        {window.history.length > 1 && !isLandingPage && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="back"
            onClick={() => navigate(-1)}
            sx={{ color: "white", mr: 1 }}
          >
            <ArrowBackIcon />
          </IconButton>
        )}
        {/* Hamburger Menu - Always on the Left */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleDrawer}
          sx={{
            display: { xs: "flex", md: "none" },
            background: "linear-gradient(90deg, #034D92, #0487D9)",
            width: 50,
            height: 50,
            minWidth: 50, // Ensures the button does not shrink
            minHeight: 50, // Ensures the button does not shrink
            padding: 0,
            color: "white",
            borderRadius: "8px",
            alignContent: "center",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo */}
        <Link display="flex" alignItems="center"
          to='/'
        >
          <img
            src={logo}
            alt="Logo"
            style={{ width: 50, height: 50, marginRight: 10 }}
          />
        </Link>

        {/* Desktop Navigation */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            gap: { sm: "5px", lg: "40px" },
            alignItems: "center",
          }}
        >
          {navItems.map((item) =>
            item.options ? (
              <Box key={item.title}>
                <Button
                  color="inherit"
                  onClick={handleDepartmentsClick}
                  sx={{
                    textTransform: "none",
                    position: "relative",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: -2,
                      left: 0,
                      width: "100%",
                      height: "2px",
                      background: linearGradient,
                      opacity: item.options.some(opt => opt.route === location.pathname) ? 1 : 0,
                      transition: "opacity 0.3s ease-in-out",
                    },
                    "&:hover::after": {
                      opacity: 1,
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "14px",
                      cursor: "pointer",
                      color: "white",
                      alignText: "center",
                      letterSpacing: "-2%",
                      transition: "color 0.3s ease-in-out",
                      "&:hover": {
                        color: "#0487D9",
                      },
                    }}
                  >
                    {item.title}
                  </Typography>
                  <KeyboardArrowDownIcon sx={{
                    color: "white",
                    transition: "color 0.3s ease-in-out",
                    "&:hover": {
                      color: "#0487D9",
                    },
                  }} />
                </Button>
                <Menu
                  anchorEl={departmentsAnchorEl}
                  open={Boolean(departmentsAnchorEl)}
                  onClose={handleDepartmentsClose}
                  disablePortal
                  disableScrollLock
                  sx={{
                    "& .MuiPaper-root": {
                      padding: 0,
                      boxShadow: "none",
                      minWidth: "200px",
                      borderRadius: "13px",
                    },
                    "& .MuiList-root": { padding: 0 },
                  }}
                >
                  {item.options.map((option) => (
                    <MenuItem
                      key={option.title}
                      onClick={handleDepartmentsClose}
                      component={Link}
                      to={option.route}
                      sx={{
                        borderRadius: 0,
                        "&:first-of-type": {
                          borderTopLeftRadius: "13px",
                          borderTopRightRadius: "13px",
                        },
                        "&:last-of-type": {
                          borderBottomLeftRadius: "13px",
                          borderBottomRightRadius: "13px",
                        },
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        padding: "12px 16px",
                        color: location.pathname === option.route ? "#0487D9" : "#131313",
                        background: location.pathname === option.route ? "#E6EFF2" : "transparent",
                        "&:hover": {
                          background: "#E6EFF2",
                        },
                      }}
                    >
                      {option.title}
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            ) : item.external ? (
              <Link to={item.link} target="_blank" rel="noopener noreferrer">
                <GradientButton
                  variant="contained"
                  sx={{
                    textTransform: "none",
                    height: 40,
                    minWidth: 120,
                    fontSize: 16,
                    padding: "8px 24px",
                  }}
                >
                  <ButtonTypography sx={{ color: "white" }}>
                    {item.title}
                  </ButtonTypography>
                </GradientButton>
              </Link>
            ) : (
              <Button
                key={item.title}
                component={item.external ? "a" : Link}
                {...(item.external
                  ? {
                    href: item.link,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    style: { textDecoration: "none" }
                  }
                  : { to: item.link }
                )}
                sx={{
                  textTransform: "none",
                  position: "relative",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: -2,
                    left: 0,
                    textWrap: item.external ? "nowrap" : "wrap",
                    width: "100%",
                    height: "2px",
                    background: linearGradient,
                    opacity: location.pathname === item.link ? 1 : 0,
                    transition: "opacity 0.3s ease-in-out",
                  },
                  "&:hover::after": {
                    opacity: 1,
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: "14px",
                    cursor: "pointer",
                    color: "white",
                    alignText: "center",
                    letterSpacing: "-2%",
                    transition: "color 0.3s ease-in-out",
                    "&:hover": {
                      color: "#0487D9",
                    },
                  }}
                >
                  {item.title}
                </Typography>
              </Button>
            )
          )}
        </Box>

        {/* Desktop Buttons/User Info */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            gap: 2,
            alignItems: "center",
          }}
        >
          {user ? (
            <>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton
                  onClick={handleProfileClick}
                  sx={{ p: 0, display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Avatar
                    src={user.crewProfile?.profilePicture || "/default-avatar.png"}
                    alt={user.crewProfile ? `${user.crewProfile.firstName} ${user.crewProfile.lastName}` : user.name}
                    sx={{
                      width: 40,
                      height: 40,
                    }}
                  />
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Typography
                        sx={{
                          color: "white",
                          fontWeight: 600,
                          fontSize: 16,
                          lineHeight: 1,
                          fontFamily: "Plus Jakarta Sans, Inter, Roboto, system-ui, -apple-system, Segoe UI, Arial, sans-serif",
                        }}
                      >
                        {user.crewProfile ? `${user.crewProfile.firstName} ${user.crewProfile.lastName}` : user.email || user.fullName || "User"}
                      </Typography>
                      <KeyboardArrowDownIcon sx={{ color: "white", fontSize: 20 }} />
                    </Box>
                    <Typography
                      sx={{
                        color: "white",
                        fontSize: 13,
                        opacity: 0.85,
                        lineHeight: 1,
                        fontFamily: "Plus Jakarta Sans, Inter, Roboto, system-ui, -apple-system, Segoe UI, Arial, sans-serif",
                      }}
                    >
                      {user.role?.name
                        ? user.role.name.charAt(0).toUpperCase() + user.role.name.slice(1).replace("_", " ")
                        : user.crewProfile?.position || ""}
                    </Typography>
                  </Box>
                </IconButton>
              </Box>
              <Menu
                anchorEl={profileAnchorEl}
                open={Boolean(profileAnchorEl)}
                onClose={handleProfileClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{
                  sx: {
                    mt: 1,
                    minWidth: 160,
                    borderRadius: 2,
                    boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
                    p: 0.5,
                  },
                }}
                MenuListProps={{
                  sx: {
                    p: 0,
                    "& .MuiMenuItem-root": {
                      borderRadius: 1,
                      px: 2,
                      py: 1.2,
                      fontSize: 15,
                      "&:hover": {
                        backgroundColor: "#f5f8fa",
                        color: "#0487D9",
                      },
                    },
                  },
                }}
              >
                <MenuItem
                  onClick={() => {
                    handleProfileClose();
                    if (user.role.name === "crew_member") {
                      navigate("/crew/dashboard");
                    } else if (user.role.name === "admin") {
                      navigate("/admin/dashboard");
                    } else if (user.role.name === "supplier") {
                      navigate("/supplier/dashboard");
                    } else if (user.role.name === "service_provider") {
                      navigate("/service-provider/dashboard");
                    }
                  }}
                >
                  Dashboard
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button
                variant="contained"
                component={Link}
                to="/login"
                sx={{
                  backgroundColor: "transparent",
                  color: "#fff",
                  border: "2px solid #0487D9",
                  borderRadius: 2,
                  fontWeight: 700,
                  fontSize: 16,
                  textTransform: "none",
                  height: 40,
                  minWidth: 120,
                  padding: "8px 24px",
                  position: "relative",
                  overflow: "hidden",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  "&:hover": {
                    // backgroundColor: "",
                    color: linearGradient,
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 12px rgba(4, 135, 217, 0.3)",
                  },
                }}
              >
                Sign In
              </Button>
              <Link to="/get-started">
                <GradientButton
                  variant="contained"
                  sx={{
                    textTransform: "none",
                    height: 40,
                    minWidth: 120,
                    fontSize: 16,
                    padding: "8px 24px",
                  }}
                >
                  <ButtonTypography sx={{ color: "white" }}>
                    Join Now
                  </ButtonTypography>
                </GradientButton>
              </Link>
            </>
          )}
        </Box>
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={toggleDrawer}
        sx={{
          zIndex: 1301,
        }}
      >
        <Box
          sx={{
            width: 250,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            background: "linear-gradient(90deg, #034D92, #0487D9)",
            paddingBlock: "40px",
          }}
        >
          <Box sx={{ flex: 1, padding: "20px" }}>
            {/* If user is logged in, show avatar, name, and role above menu */}
            {user && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mb: 3,
                  mt: -2,
                  gap: 1,
                }}
              >
                <Avatar
                  src={user.crewProfile?.profilePicture || "/default-avatar.png"}
                  alt={user.crewProfile ? `${user.crewProfile.firstName} ${user.crewProfile.lastName}` : user.name}
                  sx={{
                    width: 56,
                    height: 56,
                    border: "2px solid #000",
                    background: "#fff",
                    color: "#000",
                    fontWeight: 700,
                    fontSize: 24,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  }}
                >
                  {!user.crewProfile && user.name
                    ? user.name[0].toUpperCase()
                    : null}
                </Avatar>
                <Typography
                  sx={{ color: "white", fontWeight: 700, fontSize: 16, mt: 1 }}
                >
                  {user.crewProfile ? `${user.crewProfile.firstName} ${user.crewProfile.lastName}` : user.name || user.fullName || "User"}
                </Typography>
                <Typography
                  sx={{ color: "#000", fontSize: 13, fontWeight: 500 }}
                >
                  {user.role?.name
                    ? user.role.name.charAt(0).toUpperCase() + user.role.name.slice(1).replace("_", " ")
                    : user.crewProfile?.position || ""}
                </Typography>
              </Box>
            )}
            {/* Nav Item with dropdown */}
            {navItems.map((item) =>
              item.options ? (
                <Box key={item.title}>
                  {/* Parent Item (Clickable) */}
                  <Button
                    onClick={() => setOpen(!open)}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      textAlign: "left",
                      width: "100%",
                      padding: "10px",
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "white",
                      textTransform: "none",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "14px",
                        cursor: "pointer",
                        color:
                          location.pathname === item.link
                            ? "white"
                            : "rgba(255, 255, 255, 0.8)",
                        textAlign: "center", // Correct property for text alignment
                        letterSpacing: "-2%",
                        display: "flex", // Enables flexbox
                        alignItems: "center", // Vertically centers text & icon
                        justifyContent: "center", // Horizontally centers content
                        gap: "4px",
                      }}
                    >
                      {item.title}{" "}
                      {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </Typography>
                  </Button>

                  {/* Child Dropdown Menu */}
                  <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box sx={{ paddingLeft: "20px" }}>
                      {item.options.map((option) => (
                        <Button
                          key={option.title}
                          component={Link}
                          to={option.route}
                          onClick={toggleDrawer}
                          sx={{
                            display: "block",
                            textAlign: "left",
                            width: "100%",
                            padding: "8px 0",
                            fontSize: "14px",
                            color: "white",
                            textTransform: "none",
                          }}
                        >
                          <Typography
                            sx={{
                              fontWeight:
                                location.pathname === option.route
                                  ? "bold"
                                  : "normal",
                              fontSize: "14px",
                              cursor: "pointer",
                              color:
                                location.pathname === option.route
                                  ? "white"
                                  : "rgba(255, 255, 255, 0.8)",
                              alignText: "center",
                              letterSpacing: "-2%",
                            }}
                          >
                            {option.title}
                          </Typography>
                        </Button>
                      ))}
                    </Box>
                  </Collapse>
                </Box>
              ) : (
                <Button
                  key={item.title}
                  component={item.external ? "a" : Link}
                  to={item.link}
                  {...(item.external
                    ? {
                      href: item.link,
                      target: "_blank",
                      rel: "noopener noreferrer",
                      style: { textDecoration: "none" }
                    }
                    : { to: item.link }
                  )}
                  onClick={toggleDrawer}
                  sx={{
                    display: "block",
                    textAlign: "left",
                    width: "100%",
                    padding: "10px",
                    textTransform: "none",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight:
                        location.pathname === item.link ? "bold" : "normal",
                      fontSize: "14px",
                      cursor: "pointer",
                      color:
                        location.pathname === item.link
                          ? "white"
                          : "rgba(255, 255, 255, 0.8)",
                      alignText: "center",
                      letterSpacing: "-2%",
                    }}
                  >
                    {item.title}
                  </Typography>
                </Button>
              )
            )}
          </Box>

          {/* Mobile Buttons at Bottom */}
          <Box
            sx={{
              padding: "20px",
              borderTop: "1px solid #ddd",
              textAlign: "center",
            }}
          >
            {/* If user is not logged in, show Join Now and Sign In */}
            {!user ? (
              <>
                <Button
                  component={Link}
                  to="/get-started"
                  fullWidth
                  variant="contained"
                  sx={{
                    background: "linear-gradient(90deg, #034D92, #0487D9)",
                    color: "white",
                    borderRadius: 2,
                    fontWeight: 700,
                    fontSize: 16,
                    textTransform: "none",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    mb: 1,
                    "&:hover": {
                      background: "linear-gradient(90deg, #023A6B, #0366A3)",
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 12px rgba(4, 135, 217, 0.3)",
                    },
                  }}
                >
                  Join Now
                </Button>
                <Button
                  component={Link}
                  to="/login"
                  fullWidth
                  variant="contained"
                  sx={{
                    backgroundColor: "white",
                    color: "#0487D9",
                    border: "2px solid #0487D9",
                    borderRadius: 2,
                    fontWeight: 700,
                    fontSize: 16,
                    textTransform: "none",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    "&:hover": {
                      backgroundColor: "#0487D9",
                      color: "#fff",
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 12px rgba(4, 135, 217, 0.3)",
                    },
                  }}
                >
                  Sign In
                </Button>
              </>
            ) : (
              // If user is logged in, show Dashboard and Logout buttons
              <>
                <Button
                  onClick={() => {
                    toggleDrawer();
                    if (user.role.name === "crew_member") {
                      navigate("/crew/dashboard");
                    } else if (user.role.name === "admin") {
                      navigate("/admin/dashboard");
                    } else if (user.role.name === "supplier") {
                      navigate("/supplier/dashboard");
                    } else if (user.role.name === "service_provider") {
                      navigate("/service-provider/dashboard");
                    }
                  }}
                  fullWidth
                  variant="contained"
                  sx={{
                    backgroundColor: "white",
                    color: "#0487D9",
                    borderRadius: 2,
                    fontWeight: 700,
                    fontSize: 16,
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    mb: 1,
                    "&:hover": {
                      backgroundColor: "#f0f8ff",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  Dashboard
                </Button>
                <Button
                  onClick={handleLogout}
                  fullWidth
                  variant="outlined"
                  sx={{
                    backgroundColor: "transparent",
                    color: "#FF4B4B",
                    border: "2px solid #FF4B4B",
                    borderRadius: 2,
                    fontWeight: 700,
                    fontSize: 16,
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    "&:hover": {
                      backgroundColor: "#FF4B4B",
                      color: "#fff",
                    },
                  }}
                >
                  <LogoutIcon sx={{ mr: 1 }} />
                  Logout
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Drawer>
    </TransparentAppBar>
  );
};
export const linearGradient = "linear-gradient(90deg, #034D92, #0487D9)";
export const linearGradient2 = "linear-gradient(90deg, #0487D9, #034D92)";

const TransparentAppBar = styled(AppBar)({
  backgroundColor: "transparent",
  boxShadow: "none",
  padding: "0px 0",
  color: "white",
  fontSize: "16px",
  fontFamily: "Manrope, sans-serif",
  fontWeight: 400,
});

export const ButtonTypography = styled(Typography)(({ theme }) => ({
  fontFamily: "Inter, sans-serif",
  fontWeight: 600,
  lineHeight: "19px",
  fontSize: "16px", // Default for large screens

  [theme.breakpoints.down("sm")]: {
    // Mobile (xs)
    fontSize: "14px",
    lineHeight: "17px",
  },

  [theme.breakpoints.between("sm", "md")]: {
    // Tablets (sm - md)
    fontSize: "15px",
    lineHeight: "18px",
  },

  [theme.breakpoints.up("md")]: {
    // Medium+ screens
    fontSize: "16px",
    lineHeight: "19px",
  },
}));

export const GradientButton = styled(Button)({
  position: "relative",
  background: linearGradient,
  fontSize: "16px",
  fontFamily: "Inter, sans-serif",
  textTransform: "none",
  padding: "12px 14px",
  overflow: "hidden",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    background: linearGradient,
    transform: "translateY(-3px)",
    boxShadow: "0 4px 12px rgba(4, 135, 217, 0.3)",
    "&::after": {
      transform: "translateX(100%)",
    }
  },
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "linear-gradient(120deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)",
    transform: "translateX(-100%)",
    transition: "transform 0.6s ease-in-out",
  }
});

export default LandingPageHeader;
