import * as React from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Button,
} from "@mui/material";
import Check from "@mui/icons-material/Check";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import VideoLabelIcon from "@mui/icons-material/VideoLabel";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VendorOnboardingStep1 from "../../components/onboarding/vendor/vendor-onboarding-step1";
import VendorOnboardingStep2 from "../../components/onboarding/vendor/vendor-onboarding-step2";
import VendorOnboardingStep3 from "../../components/onboarding/vendor/vendor-onboarding-step3";
import { useUser } from "../../context/userContext";

const QontoStepIconRoot = styled("div")(({ theme }) => ({
  color: "#eaeaf0",
  display: "flex",
  height: 22,
  alignItems: "center",
  "& .QontoStepIcon-completedIcon": {
    color: "#784af4",
    zIndex: 1,
    fontSize: 18,
  },
  "& .QontoStepIcon-circle": {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "currentColor",
  },
  ...theme.applyStyles("dark", {
    color: theme.palette.grey[700],
  }),
  variants: [
    {
      props: ({ ownerState }) => ownerState.active,
      style: {
        color: "#784af4",
      },
    },
  ],
}));

function QontoStepIcon(props) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Check className="QontoStepIcon-completedIcon" />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}

QontoStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
};

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: "#eaeaf0",
    borderRadius: 1,
    ...theme.applyStyles("dark", {
      backgroundColor: theme.palette.grey[800],
    }),
  },
}));

const ColorlibStepIconRoot = styled("div")(({ theme }) => ({
  backgroundColor: "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...theme.applyStyles("dark", {
    backgroundColor: theme.palette.grey[700],
  }),
  variants: [
    {
      props: ({ ownerState }) => ownerState.active,
      style: {
        backgroundImage:
          "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
        boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
      },
    },
    {
      props: ({ ownerState }) => ownerState.completed,
      style: {
        backgroundImage:
          "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
      },
    },
  ],
}));

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    1: <SettingsIcon />,
    2: <GroupAddIcon />,
    3: <VideoLabelIcon />,
    4: <CheckCircleIcon />,
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

ColorlibStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
  /**
   * The label displayed in the step icon.
   */
  icon: PropTypes.node,
};

const steps = [
  "Upload all Services",
  "Complete Stripe Onboarding",
  "Confirm Service Data",
  "Complete!",
];

const VendorOnboarding = () => {
  const { stripeAccount } = useUser();
  const [activeStep, setActiveStep] = React.useState(0);

  const canAdvanceToStep = (stepIndex) => {
    //console.log('VendorOnboarding - canAdvanceToStep called with:', stepIndex);
    //console.log('VendorOnboarding - Current stripeAccount:', stripeAccount);
    
    switch (stepIndex) {
      case 0: // Step 1 - Always accessible
        return true;
      case 1: // Step 2 - Always accessible after step 1
        return true;
      case 2: // Step 3 - Only if Stripe account is fully set up
        const canAdvance = stripeAccount && 
                          stripeAccount?.chargesEnabled && 
                          stripeAccount?.transfersEnabled && 
                          stripeAccount?.detailsSubmitted;
        //console.log('VendorOnboarding - Can advance to Step 3:', canAdvance);
        return canAdvance;
      case 3: // Final step
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    //console.log('VendorOnboarding - handleNext called, current step:', activeStep);
    
    const nextStep = activeStep + 1;
    
    if (canAdvanceToStep(nextStep)) {
      //console.log('VendorOnboarding - Advancing to step:', nextStep);
      setActiveStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
    } else {
      //console.log('VendorOnboarding - Cannot advance to step:', nextStep, 'Requirements not met');
    }
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  React.useEffect(() => {
    //console.log('VendorOnboarding - Step validation check, activeStep:', activeStep);
    //console.log('VendorOnboarding - stripeAccount state:', stripeAccount);
    
    if (activeStep === 2 && !canAdvanceToStep(2)) {
      //console.log('VendorOnboarding - Step 3 requirements no longer met, going back to Step 2');
      setActiveStep(1);
    }
  }, [stripeAccount, activeStep]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        gap: 3,
      }}
    >
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        connector={<ColorlibConnector />}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        {activeStep === steps.length ? (
          <>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Button onClick={handleReset}>Reset</Button>
          </>
        ) : (
          <>
            {activeStep === 0 && (
              <VendorOnboardingStep1 handleNext={handleNext} />
            )}

            {activeStep === 1 && (
              <VendorOnboardingStep2 handleNext={handleNext} />
            )}

            {activeStep === 2 && (
              <VendorOnboardingStep3 handleNext={handleNext} />
            )}

            {activeStep === 3 && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "grey.200",
                  borderRadius: 2,
                  p: 4,
                  textAlign: "center",
                  minWidth: 300,
                }}
              >
                <CheckCircleIcon
                  sx={{
                    fontSize: 80,
                    color: "success.main",
                    mb: 2,
                  }}
                />
                <Typography
                  variant="h5"
                  sx={{ mb: 2, color: "success.dark", fontWeight: "bold" }}
                >
                  Congratulations!
                </Typography>
                <Typography sx={{ mb: 3, color: "success.dark" }}>
                  You have successfully completed the services onboarding
                  process.
                </Typography>
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default VendorOnboarding;
