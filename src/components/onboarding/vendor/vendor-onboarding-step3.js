import { Box, Typography, Button, Skeleton, CircularProgress } from "@mui/material";
import ServicesWrapper from "./serviceswrapper";
import { useUser } from "../../../context/userContext";
import { useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { useParams, useLocation } from 'react-router-dom';

const VendorOnboardingStep3 = ({ handleNext }) => {
  const { id: userId } = useParams();
  const location = useLocation();
  const { verifyOnboardingStep1, completeOnboarding, checkOnboardingStatus } = useUser();
  const hasRunRef = useRef(false);
  const toast = useRef(null);
  const [servicesData, setServicesData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Determine role based on URL path
  const role = location.pathname.includes('/vendor/onboarding/') ? 'service_provider' : 'supplier';

  useEffect(() => {
    const verifyInventoryUpload = async () => {
      if (hasRunRef.current) return;
      hasRunRef.current = true;

      try {
        console.log('Step 3 - Current userId:', userId);
        console.log('Step 3 - Current role:', role);
        console.log('Step 3 - Current path:', location.pathname);

        //check onboarding status
        const status = await checkOnboardingStatus(userId, role);
        console.log('Step 3 - checkOnboardingStatus response:', status);
        
        if(status === true){
          handleNext();
          return;
        }

        const data = await verifyOnboardingStep1(userId, role);
        console.log('Step 3 - verifyOnboardingStep1 response:', data);
        
        if (data.data.length > 0) {
          setServicesData(data.data);
        }
      } catch (error) {
        console.error('Step 3 - Error:', error);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: error.message || "Error verifying services",
        });
      } finally {
        setIsLoading(false);
      }
    };

    verifyInventoryUpload();
  }, [checkOnboardingStatus, handleNext, verifyOnboardingStep1, userId, role]);

  const handleFinish = async () => {
    try {
      console.log('Step 3 - Completing onboarding with:', { userId, role });
      const status = await completeOnboarding(userId, role);
      console.log('Step 3 - completeOnboarding response:', status);
      
      if (status) {
        handleNext();
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Error completing onboarding",
        });
      }
    } catch (error) {
      console.error('Step 3 - Error completing onboarding:', error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "Error completing onboarding",
      });
    }
  };

  return (
    <Box sx={{ maxHeight: "100%", overflow: "auto" }}>
      <Toast ref={toast} />
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ width: "50vw", mb: 3 }}
      >
        <Typography sx={{ fontSize: "24px", fontWeight: "bold" }}>
          Confirm Services Data
        </Typography>
        <Button variant="contained" color="primary" onClick={handleFinish} disabled={isLoading}>
           {isLoading ? <CircularProgress size={20} color="black"/> : "Finish"}
        </Button>
      </Box>
      {servicesData && servicesData.length > 0 && (
        <Box sx={{ height: "100%", maxHeight: "60vh", overflowY: "auto" }}>
          <ServicesWrapper servicesData={servicesData} />
        </Box>
      )}
      {isLoading && (
        <Box
          sx={{
            display: "flex",
            height: "100%",
            maxHeight: "60vh",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Skeleton variant="rectangular" height="30px" width="100%" />
          <Skeleton variant="rectangular" height="30px" width="100%" />
          <Skeleton variant="rectangular" height="30px" width="100%" />
        </Box>
      )}
    </Box>
  );
};

export default VendorOnboardingStep3;
