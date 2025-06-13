import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import backgroundImage from "../../assets/images/water.jpg";
import check from "../../assets/images/check1.png";
import yachtCrew from "../../assets/images/yacht.png";
import CrewSignUpForm from "../../components/crew.signup";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const StepInfo = ({ currentStep }) => {
  const stepData = {
    1: {
      step: "Step 1",
      info: "Personal Information",
    },
    2: {
      step: "Step 2",
      info: "Work and Experience",
    },
    3: {
      step: "Step 3",
      info: "Certifications and training",
    },
    4: {
      step: "step 4",
      info: "Upload CV & Profile Picture",
    },
    5: {
      step: "step 5",
      info: "Create Password",
    },
  };

  return (
    <div className="logo_crew">
      <div>
        <img src={check} className="checkImg" alt="" />
      </div>
      <div>
        <p>{stepData[currentStep].step}</p>
        <p className="personal_info">{stepData[currentStep].info}</p>
      </div>
    </div>
  );
};

function isMobile() {
  return typeof window !== 'undefined' && window.innerWidth < 600;
}

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    selectedCountry: null,
    preferredCommunication: "",
    position: null,
    yearsOfExperience: null,
    location: "",
    certification: "",
    certificationFile: null,
    password: "",
    confirmPassword: "",
  });

  const handleFormDataChange = (newData) => {
    setFormData((prev) => {
      const updated = { ...prev, ...newData };
      console.log("Updated Form Data:", updated);
      return updated;
    });
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', padding: window.innerWidth < 600 ? '0' : undefined }}>
      {/* Back Button for mobile (fixed at top) */}
      {window.history.length > 1 && isMobile() && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 2000,
          background: 'transparent',
          width: '100vw',
          padding: '16px 0 0 16px',
        }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#034D92',
              fontSize: 28
            }}
            aria-label="Back"
          >
            <ArrowBackIcon />
          </button>
        </div>
      )}
      {/* Back Button for desktop (absolute in container) */}
      {window.history.length > 1 && !isMobile() && (
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#034D92',
            margin: '16px 0 0 16px',
            position: 'absolute',
            zIndex: 10
          }}
          aria-label="Back"
        >
          <ArrowBackIcon />
        </button>
      )}
      <div className="check-bg">
        <div className="flex flex-column lg:flex-row align-content-start justify-content-center gap-0 login bg-inner testing">
          <div
            className="flex-1 flex-column bg-cover flex align-items-center justify-content-center left-panel bg-center bgImage"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              height: "100vh",
              width: "100%",
              backgroundAttachment: "fixed",
              backgroundPosition: "center",
              backgroundSize: "center",
              objectFit: "center",
              overflow: "hidden",
            }}
          >
            <div className="login-content">
              <img src={yachtCrew} style={{ width: "200px" }} alt="" />
            </div>
          </div>

          <div className="flex-1 flex align-items-center justify-content-center right-panel">
            <div
              className="login-right-component"
              style={{ width: "100%", paddingTop: "0px" }}
            >
              <div className="logo-wraper">
                <StepInfo currentStep={step} />
              </div>
              <div
                className="login-form captain-login-form"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CrewSignUpForm
                  setStep={setStep}
                  currentStep={step}
                  formData={formData}
                  setFormData={handleFormDataChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
