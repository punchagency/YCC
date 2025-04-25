import { Box, Typography, Button, Skeleton, CircularProgress } from "@mui/material";
import ServicesWrapper from "./serviceswrapper";
import { useUser } from "../../../context/userContext";
import { useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
const VendorOnboardingStep3 = ({ handleNext }) => {
  const { user, verifyOnboardingStep1, completeOnboarding, checkOnboardingStatus } = useUser();
  const hasRunRef = useRef(false);
  const toast = useRef(null);
  const [servicesData, setServicesData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (hasRunRef.current) return; // prevent second run
    hasRunRef.current = true;

    const verifyInventoryUpload = async () => {
      //check onboardiing status
      const status = await checkOnboardingStatus();
      if(status === true){
        handleNext();
      }

      const data = await verifyOnboardingStep1();
      if (data.data.length > 0) {
        setServicesData(data.data);
      }
      setIsLoading(false);
    };

    verifyInventoryUpload();
  }, []);

  const handleFinish = async () => {
    const status = await completeOnboarding();
    if (status) {
      handleNext();
    } else {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error completing onboarding",
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
