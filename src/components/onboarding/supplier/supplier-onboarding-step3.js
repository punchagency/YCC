import { Box, Typography, Button, Skeleton } from "@mui/material";
import InventoryWrapper from "./inventorywrapper";
import { useUser } from "../../../context/userContext";
import { useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { useParams, useLocation } from "react-router-dom";

const SupplierOnboardingStep3 = ({ handleNext, suppressAutoAdvance }) => {
  const { id: userId } = useParams();
  const location = useLocation();
  const { verifyOnboardingStep1, completeOnboarding, checkOnboardingStatus } =
    useUser();
  //const hasRunRef = useRef(false);
  const toast = useRef(null);
  const [inventoryData, setInventoryData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Determine role based on URL path
  const role = location.pathname.includes("/vendors/onboarding/")
    ? "supplier"
    : "service_provider";

  useEffect(() => {
    if (suppressAutoAdvance) {
      // If user navigated back, do not auto redirect forward
      return;
    }
    // if (hasRunRef.current) return; // prevent second run
    // hasRunRef.current = true;

    const verifyInventoryUpload = async () => {
      try {
        //check onboarding status
        const status = await checkOnboardingStatus(userId, role);
        if (status === true) {
          //console.log('Step 3 - Onboarding status is true');
          handleNext();
          return;
        }

        if (!userId) {
          //console.error('Missing userId:', { userId });
          return;
        }

        const data = await verifyOnboardingStep1(userId, role);
        //console.log('Step 3 - Verification response:', data);

        // --- Transform inventory data to flat product array ---
        let flatProducts = [];
        if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
          const inventory = data.data[0];
          if (inventory.products && Array.isArray(inventory.products)) {
            flatProducts = inventory.products
              .filter((p) => p.product) // filter out any missing products
              .map((p) => ({
                ...p,
                inventoryId: inventory._id,
                // Optionally, add supplier or other info if needed
              }));
          }
        }
        setInventoryData(flatProducts);
        // --- End transformation ---
      } catch (error) {
        //console.error('Step 3 - Verification error:', error);
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
  }, [checkOnboardingStatus, handleNext, verifyOnboardingStep1, userId, role, suppressAutoAdvance]);

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
      //console.error('Step 3 - Complete onboarding error:', error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error completing onboarding",
      });
    }
  };

  const handleInventoryUpdate = (updatedInventory) => {
    setInventoryData((prevData) =>
      prevData.map((item) =>
        item._id === updatedInventory._id ? updatedInventory : item
      )
    );
  };

  return (
    <Box sx={{ maxHeight: "100%", overflow: "auto" }}>
      <Toast ref={toast} />
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: { xs: 2, sm: 0 },
          mb: 3,
          width: "100%",
          maxWidth: "1200px",
          mx: "auto",
          px: { xs: 2, sm: 3 },
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "20px", sm: "24px" },
            fontWeight: "bold",
          }}
        >
          Confirm Inventory Data
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleFinish}
          sx={{
            minWidth: { xs: "100%", sm: "120px" },
            height: "40px",
          }}
        >
          Finish
        </Button>
      </Box>
      {inventoryData && inventoryData.length > 0 && (
        <Box
          sx={{
            height: "100%",
            maxHeight: { xs: "50vh", sm: "60vh" },
            overflowY: "auto",
            mb: { xs: 2, sm: 0 },
          }}
        >
          <InventoryWrapper
            inventoryData={inventoryData}
            onInventoryUpdate={handleInventoryUpdate}
          />
        </Box>
      )}
      {isLoading && (
        <Box
          sx={{
            display: "flex",
            height: "100%",
            maxHeight: { xs: "50vh", sm: "60vh" },
            flexDirection: "column",
            gap: 2,
            mb: { xs: 0, sm: 0 },
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
