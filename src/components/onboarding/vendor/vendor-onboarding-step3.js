import { Box, Typography, Button, Skeleton, CircularProgress, useTheme, useMediaQuery } from "@mui/material";
import ServicesWrapper from "./serviceswrapper";
import { useUser } from "../../../context/userContext";
import { useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { useParams, useLocation } from 'react-router-dom';

const VendorOnboardingStep3 = ({ handleNext }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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

  const handleServiceUpdate = (updatedService) => {
    setServicesData(prevData => 
      prevData.map(service => 
        service._id === updatedService._id ? updatedService : service
      )
    );
  };

  return (
    <Box sx={{ 
      maxHeight: "100%", 
      overflow: "auto",
      p: { xs: 2, sm: 3 },
      width: '100%'
    }}>
      <Toast ref={toast} />
      <Box
        display="flex"
        flexDirection={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        gap={{ xs: 2, sm: 0 }}
        sx={{ 
          width: { xs: '100%', sm: '80%', md: '60%' },
          mb: 3
        }}
      >
        <Typography 
          sx={{ 
            fontSize: { xs: "20px", sm: "24px" }, 
            fontWeight: "bold",
            width: { xs: '100%', sm: 'auto' }
          }}
        >
          Confirm Services Data
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleFinish} 
          disabled={isLoading}
          fullWidth={isMobile}
          sx={{ 
            minWidth: { xs: '100%', sm: '120px' },
            height: { xs: '48px', sm: '40px' },
            fontWeight: 'bold'
          }}
        >
          {isLoading ? <CircularProgress size={20} color="inherit"/> : "Finish"}
        </Button>
      </Box>
      {servicesData && servicesData.length > 0 && (
        <Box sx={{ 
          height: "100%", 
          maxHeight: { xs: "calc(100vh - 200px)", sm: "60vh" }, 
          overflowY: "auto",
          width: '100%',
          '& .MuiTableContainer-root': {
            boxShadow: 'none',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1
          }
        }}>
          <ServicesWrapper 
            servicesData={servicesData} 
            onServiceUpdate={handleServiceUpdate}
          />
        </Box>
      )}
      {isLoading && (
        <Box
          sx={{
            display: "flex",
            height: "100%",
            maxHeight: { xs: "calc(100vh - 200px)", sm: "60vh" },
            flexDirection: "column",
            gap: 2,
            width: '100%'
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

