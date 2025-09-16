import { Box, Typography, Button, Skeleton, CircularProgress, useTheme, useMediaQuery } from "@mui/material";
import ServicesWrapper from "./serviceswrapper";
import { useUser } from "../../../context/userContext";
import { useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { useParams, useLocation } from 'react-router-dom';

const VendorOnboardingStep3 = ({ handleNext, userId, suppressAutoAdvance }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { id: userIdFromParams } = useParams();
  const actualUserId = userId || userIdFromParams;
  const location = useLocation();
  const { verifyOnboardingStep1, completeOnboarding, checkOnboardingStatus } = useUser();
  const hasRunRef = useRef(false);
  const toast = useRef(null);
  const [servicesData, setServicesData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Determine role based on URL path
  const role = location.pathname.includes('/services/onboarding/') ? 'service_provider' : 'supplier';

  useEffect(() => {
    if (suppressAutoAdvance) {
      // If user navigated back, do not auto redirect forward
      return;
    }
    
    const verifyInventoryUpload = async () => {
      if (hasRunRef.current) return;
      hasRunRef.current = true;

      try {
        // console.log('Step 3 - Current actualUserId:', actualUserId);
        // console.log('Step 3 - Current role:', role);
        // console.log('Step 3 - Current path:', location.pathname);

        //check onboarding status
        const status = await checkOnboardingStatus(actualUserId, role);
        //console.log('Step 3 - checkOnboardingStatus response:', status);
        
        if(status === true){
          handleNext();
          return;
        }

        const data = await verifyOnboardingStep1(actualUserId, role);
        //console.log('Step 3 - verifyOnboardingStep1 response:', data);
        
        if (data.data.length > 0) {
          setServicesData(data.data);
        }
      } catch (error) {
        //console.error('Step 3 - Error:', error);
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
  }, [checkOnboardingStatus, handleNext, verifyOnboardingStep1, actualUserId, role, suppressAutoAdvance]);

  const handleFinish = async () => {
    try {
      //console.log('Step 3 - Completing onboarding with:', { actualUserId, role });
      const status = await completeOnboarding(actualUserId, role);
      //console.log('Step 3 - completeOnboarding response:', status);
      
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
      //console.error('Step 3 - Error completing onboarding:', error);
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
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      p: { xs: 0.8, sm: 1, md: 2, lg: 3 },
      overflow: 'hidden',
      gap: 2
    }}>
      <Toast ref={toast} />
      <Box
        display="flex"
        flexDirection={{ xs: 'column', sm: 'row' }}
        justifyContent={{ xs: 'flex-start', sm: 'space-between' }}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        gap={{ xs: 2, sm: 0 }}
        sx={{ 
          width: '100%',
          px: { sm: 2 },
          flexShrink: 0
        }}
      >
        <Typography 
          sx={{ 
            fontSize: { xs: "20px", sm: "24px" }, 
            fontWeight: "bold",
            width: { xs: '100%', sm: 'auto' },
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
            fontWeight: 'bold',
            boxShadow: 2,
            '&:hover': {
              boxShadow: 4
            }
          }}
        >
          {isLoading ? <CircularProgress size={20} color="inherit"/> : "Finish"}
        </Button>
      </Box>
      {servicesData && servicesData.length > 0 && (
        <Box sx={{ 
          minHeight: '100px',
          maxHeight: { xs: '350px', sm: '450px' },
          overflow: 'hidden',
          borderRadius: 1,
          '& .MuiTableContainer-root': {
            boxShadow: 'none',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            height: '100%'
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
            minHeight: '100px',
            maxHeight: { xs: '350px', sm: '450px' },
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: '100%',
            borderRadius: 1
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

