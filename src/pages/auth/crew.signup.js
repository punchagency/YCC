import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../../assets/images/crew/back.png";
import check from "../../assets/images/check1.png";
// import yachtCrew from "../../assets/images/yacht.png";
import CrewSignUpForm from "../../components/crew.signup";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Select } from "react-select";
import LandingPageChatbot from "../../components/chatbot/landing-page-chatbot";

const StepInfo = ({ currentStep, onBack }) => {
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
      step: "Step 4",
      info: "Upload CV & Profile Picture",
    },
    5: {
      step: "Step 5",
      info: "Create Password",
    },
  };

  return (
    <div
      className="logo_crew"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        width: "100%",
      }}
    >
      {/* Back button for mobile only */}
      <div
        className="mobile-back-btn"
        style={{ display: "none", position: "absolute", left: 0, top: 0 }}
      >
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#034D92",
            margin: 0,
            padding: 0,
            fontSize: 24,
          }}
          aria-label="Back"
        >
          <ArrowBackIcon />
        </button>
      </div>
      <div>
        <img src={check} className="checkImg" alt="" />
      </div>
      <div style={{ textAlign: "center", width: "100%" }}>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 22,
            fontWeight: 600,
            margin: 0,
          }}
        >
          {stepData[currentStep].step}
        </p>
        <p
          className="personal_info"
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 18,
            fontWeight: 400,
            margin: 0,
          }}
        >
          {stepData[currentStep].info}
        </p>
      </div>
      <style>{`
        @media (max-width: 600px) {
          .logo_crew { align-items: center !important; justify-content: center !important; }
          .mobile-back-btn { display: block !important; }
        }
      `}</style>
    </div>
  );
};

function isMobile() {
  return typeof window !== "undefined" && window.innerWidth < 600;
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
      return updated;
    });
  };

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        maxHeight: "100vh",
        overflow: "hidden",
        padding: window.innerWidth < 600 ? "0" : undefined,
      }}
    >
      <div className="check-bg">
        <div className="flex flex-column lg:flex-row align-content-start justify-content-center gap-0 login bg-inner testing">
          <div
            className="flex-1 flex-column bg-cover flex align-items-center justify-content-center left-panel bg-center"
            style={{
              backgroundImage: `url(${backgroundImage})`
            }}
          >
            <div className="login-content">
              {/* Removed yachtCrew image */}
            </div>
          </div>

          <div
            className="flex-1 flex align-items-center justify-content-center right-panel"
            style={{
              padding: 0,
              margin: 0,
              width: "100%",
              height: "100%",
              alignItems: "flex-start",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {/* Back Button for desktop (absolute in right panel) */}
            {window.history.length > 1 && !isMobile() && (
              <button
                onClick={() => navigate(-1)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#034D92",
                  margin: "16px 0 0 16px",
                  position: "absolute",
                  zIndex: 10,
                  top: 0,
                  left: 0,
                }}
                aria-label="Back"
              >
                <ArrowBackIcon />
              </button>
            )}
            <div
              className="login-right-component"
              style={{
                flex: "1 1 0%",
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                margin: 0,
              }}
            >
              <div
                className="login-form captain-login-form"
                style={{
                  width: "100%",
                  maxWidth: 600,
                  margin: "0 auto",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "stretch",
                  flex: 1,
                  height: "80vh",
                  overflowY: "auto",
                  scrollbarWidth: "thin",
                  scrollbarColor: "#034D92 #f0f0f0",
                  position: "relative",
                  paddingTop: 0,
                }}
              >
                {/* StepInfo in its own card */}
                <div
                  style={{
                    width: "100%",
                    maxWidth: 600,
                    margin: "0 auto",
                    background: "#fff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    borderRadius: 12,
                    padding: 24,
                    marginBottom: 16,
                  }}
                >
                  <StepInfo currentStep={step} onBack={() => navigate(-1)} />
                </div>
                {/* Form content in a separate scrollable card */}
                <div
                  style={{
                    width: "100%",
                    maxWidth: 600,
                    margin: "0 auto",
                    background: "#fff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    borderRadius: 12,
                    height: "70vh",
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "stretch",
                    padding: 24,
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
            {/* Chatbot - Fixed Position */}
            <div
              style={{ position: "fixed", bottom: 20, right: 20, zIndex: 1000 }}
            >
              <LandingPageChatbot />
            </div>
          </div>
        </div>
      </div>
      <style>{`
@media (max-width: 600px) {
  .left-panel {
    display: none !important;
  }
}
`}</style>
    </div>
  );
};

export default Signup;
