import { Box, Container } from "@mui/material";
import { Outlet, Navigate } from "react-router-dom";
import { useUser } from "../context/userContext";
const OnboardingPageLayout = () => {
  const { user } = useUser();

  if (!user) {
    return <Navigate to="/login" />;
  }
  return (
    <Box component="main" sx={{ maxWidth: "100vw" }}>
      <Container maxWidth="xl">
        {/* {(user?.role === "service_provider" || user?.role === "supplier") && <Outlet />} */}
        {user?.role === "admin" && <Navigate to="/admin/dashboard" />}
        <Outlet />
      </Container>
    </Box>
  );
};

export default OnboardingPageLayout;
