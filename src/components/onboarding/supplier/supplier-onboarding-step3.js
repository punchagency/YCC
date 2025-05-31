import { Box, Typography, Button, Skeleton } from "@mui/material";
import InventoryWrapper from "./inventorywrapper";
import { useUser } from "../../../context/userContext";
import { useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { useParams, useLocation } from "react-router-dom";

const SupplierOnboardingStep3 = ({ handleNext }) => {
  const { id: userId } = useParams();
  const location = useLocation();
  const { verifyOnboardingStep1, completeOnboarding, checkOnboardingStatus } = useUser();
  //const hasRunRef = useRef(false);
  const toast = useRef(null);
  const [inventoryData, setInventoryData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Determine role based on URL path
  const role = location.pathname.includes('/supplier/onboarding/') ? 'supplier' : 'service_provider';

  useEffect(() => {
    // if (hasRunRef.current) return; // prevent second run
    // hasRunRef.current = true;

    const verifyInventoryUpload = async () => {
      try {
        //check onboarding status
        const status = await checkOnboardingStatus(userId, role);
        if(status === true){
          console.log('Step 3 - Onboarding status is true');
          handleNext();
          return;
        }

        if (!userId) {
          console.error('Missing userId:', { userId });
          return;
        }

        const data = await verifyOnboardingStep1(userId, role);
        console.log('Step 3 - Verification response:', data);
        
        if (data?.data?.length > 0) {
          setInventoryData(data.data);
        }
      } catch (error) {
        console.error('Step 3 - Verification error:', error);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Error verifying inventory",
        });
      } finally {
        setIsLoading(false);
      }
    };

    verifyInventoryUpload();
  }, [checkOnboardingStatus, handleNext, verifyOnboardingStep1, userId, role]);

  const handleFinish = async () => {
    try {
      const status = await completeOnboarding(userId, role);
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
      console.error('Step 3 - Complete onboarding error:', error);
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
          Confirm Inventory Data
        </Typography>
        <Button variant="contained" color="primary" onClick={handleFinish}>
          finish
        </Button>
      </Box>
      {inventoryData && inventoryData.length > 0 && (
        <Box sx={{ height: "100%", maxHeight: "60vh", overflowY: "auto" }}>
          <InventoryWrapper inventoryData={inventoryData} />
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

export default SupplierOnboardingStep3;
