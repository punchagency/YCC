import { Box, Typography, Button } from '@mui/material';
import { useUser } from '../../../context/userContext';
import { useEffect, useState } from 'react';
import { Payments as StripeIcon } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';

const SupplierOnboardingStep2 = ({ handleNext }) => {
  const { stripeAccount, getStripeAccount, createStripeAccount, refreshStripeAccountLink } = useUser();
  const [showContinueButton, setShowContinueButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getStripeAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (stripeAccount?.chargesEnabled && stripeAccount?.transfersEnabled && stripeAccount?.detailsSubmitted) {
      handleNext();
    }else if(stripeAccount){
      setShowContinueButton(true);    
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stripeAccount]);

  const handleCreateStripeAccount = async () => {
    setIsLoading(true);
    if(stripeAccount){
      await refreshStripeAccountLink();
    }else{
      await createStripeAccount();
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Connect Your Payment Account
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
        To receive payments, you'll need to set up your Stripe account. This secure process typically takes 5-10 minutes. You'll need to provide:
      </Typography>

      <Box sx={{ mb: 4, pl: 2 }}>
        <Typography component="ul" sx={{ listStyleType: 'disc' }}>
          <Typography component="li" sx={{ mb: 1 }}>Basic business information</Typography>
          <Typography component="li" sx={{ mb: 1 }}>Bank account details for receiving payments</Typography>
          <Typography component="li" sx={{ mb: 1 }}>A form of identification</Typography>
        </Typography>
      </Box>

      <Button 
        variant="contained" 
        size="large"
        onClick={handleCreateStripeAccount}
        startIcon={<StripeIcon />}
        sx={{ 
          minWidth: 250,
          py: 1.5,
          fontWeight: 600,
          backgroundColor: "primary.main",
          color: "white",
          "&:hover": {
            backgroundColor: "primary.dark",
          },
          borderRadius: "10px",
          textTransform: "none",
        }}
      >
        {isLoading ? <CircularProgress size={20} color="white" /> : showContinueButton ? 'Continue Setup' : 'Set Up Stripe Account'}
      </Button>
    </Box>
  );
};

export default SupplierOnboardingStep2;

