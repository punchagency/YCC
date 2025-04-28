import { Box, Container } from "@mui/material";
import { Outlet, Navigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import { ToastProvider } from "../context/toast/toastContext";
import { ServiceProvider } from "../context/service/serviceContext";
import { InventoryProvider } from "../context/inventory/inventoryContext";
const OnboardingPageLayout = () => {
  const { user } = useUser();

  if (!user) {
    return <Navigate to="/login" />;
  } 
  return (
    <Box component="main" sx={{ maxWidth: "100vw" }}>
      <ToastProvider>
        <ServiceProvider>
        <InventoryProvider>
          <Container maxWidth="xl">
            {(user?.role === "service_provider" || user?.role === "supplier") && <Outlet />}
            {user?.role === "admin" && <Navigate to="/admin/dashboard" />}
          </Container>
        </InventoryProvider>
        </ServiceProvider>
      </ToastProvider>
    </Box>
  );
};

export default OnboardingPageLayout;
