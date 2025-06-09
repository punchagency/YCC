import { Box, Typography, Button } from '@mui/material';
import { useUser } from '../../../context/userContext';
import { useEffect, useState } from 'react';
import { Payments as StripeIcon } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import { useParams, useLocation, useSearchParams } from 'react-router-dom';

const SupplierOnboardingStep2 = ({ handleNext }) => {
  const { id: userId } = useParams();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { stripeAccount, getStripeAccount, createStripeAccount, refreshStripeAccountLink } = useUser();
  const [showContinueButton, setShowContinueButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Determine role based on URL path - more explicit check
  const role = location.pathname.includes('/vendor/onboarding/') ? 'supplier' : 'service_provider';

  useEffect(() => {
    const fetchStripeAccount = async () => {
      try {
        console.log('Stripe Step 2 - Current userId:', userId);
        console.log('Stripe Step 2 - Current role:', role);
        console.log('Stripe Step 2 - Current path:', location.pathname);
        console.log('Stripe Step 2 - Search params:', Object.fromEntries(searchParams.entries()));
        
        const response = await getStripeAccount(userId, role);
        console.log('Stripe Step 2 - getStripeAccount response:', response);
        
        if (!response.status) {
          setError(response.message);
        }
      } catch (error) {
        console.error('Stripe Step 2 - getStripeAccount error:', error);
        setError(error.message);
      }
    };

    fetchStripeAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, role]);

  useEffect(() => {
    console.log('Stripe Step 2 - stripeAccount updated:', stripeAccount);
    
    // If stripeAccount is null, we need to stay on this step and show setup button
    if (stripeAccount === null) {
      console.log('Stripe Step 2 - No Stripe account found, staying on step 2');
      setShowContinueButton(false); // Show "Set Up Stripe Account" button
      return; // Explicitly stay on this step
    }
    
    // If stripeAccount exists and is fully set up, move to next step
    if (stripeAccount && stripeAccount?.chargesEnabled && stripeAccount?.transfersEnabled && stripeAccount?.detailsSubmitted) {
      console.log('Stripe Step 2 - Stripe account fully set up, moving to next step');
      handleNext();
    } 
    // If stripeAccount exists but setup is incomplete, show continue button
    else if (stripeAccount) {
      console.log('Stripe Step 2 - Stripe account exists but setup incomplete, showing continue button');
      setShowContinueButton(true);
    }
  }, [stripeAccount]);

  const handleCreateStripeAccount = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Stripe Step 2 - Creating/Refreshing account with:', { userId, role });
      if (stripeAccount) {
        await refreshStripeAccountLink(userId, role);
      } else {
        await createStripeAccount(userId, role);
      }
    } catch (error) {
      console.error('Error handling Stripe account:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Connect Your Payment Account
      </Typography>
      
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      
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
        disabled={isLoading}
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

