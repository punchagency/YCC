import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../../assets/images/water.jpg";
import check from "../../assets/images/check1.png";
import yachtCrew from "../../assets/images/yacht.png"; // Add appropriate vendor image
import SupplierSignUpForm from "../../components/supplier.signup";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const StepInfo = ({ currentStep }) => {
  const stepData = {
    1: {
      step: "Step 1",
      info: "Business Information",
    },
    2: {
      step: "Step 2",
      info: "Company Verification",
    },
    3: {
      step: "Step 3",
      info: "Inventory & Order Processing Setup",
    },
    4: {
      step: "Step 4",
      info: "Contact Person",
    },
    5: {
      step: "Success",
      info: "Submission",
    },
  };

  return (
    <div
      className="logo_crew"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "15px",
        marginBottom: "18px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "39px",
          height: "39px",
        }}
      >
        <img
          src={check}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>
      <div>
        <p
          style={{
            margin: 0,
            fontSize: "15px",
            color: "#034D92",
          }}
        >
          {stepData[currentStep]?.step || ""}
        </p>
        <p
          className="personal_info"
          style={{
            margin: "0",
            fontSize: "14px",
            fontWeight: "bold",
            color: "#666",
          }}
        >
          {stepData[currentStep]?.info || ""}
        </p>
      </div>
    </div>
  );
};

function isMobile() {
  return typeof window !== "undefined" && window.innerWidth < 600;
}

const SupplierSignup = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Business Information
    businessName: "",
    businessType: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    inventorySource: "",
    serviceAreas: [],
    licenseSupplierFile: null,
    supplierVatTaxId: "",
    supplierLiabilityInsurance: null,
    spreadsheetFile: null,
    acceptFees: false,

    // Contact Person
    contactPerson: {
      fullName: "",
      role: "",
    },
  });

  const handleFormDataChange = (newData) => {
    setFormData(newData);
  };

  const navigate = useNavigate();

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        padding: window.innerWidth < 600 ? "0" : undefined,
      }}
    >
      {/* Back Button for mobile (fixed at top) */}
      {window.history.length > 1 && isMobile() && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 2000,
            background: "transparent",
            width: "100vw",
            padding: "16px 0 0 16px",
          }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#034D92",
              fontSize: 28,
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
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#034D92",
            margin: "16px 0 0 16px",
            position: "absolute",
            zIndex: 10,
          }}
          aria-label="Back"
        >
          <ArrowBackIcon />
        </button>
      )}
      <div className="check-bg">
        <div className="flex flex-column lg:flex-row align-content-start justify-content-center gap-0 login bg-inner">
          {/* Left Panel */}
          <div
            className="flex-1 flex-column bg-cover flex align-items-center justify-content-center left-panel bg-center"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              height: "100vh",
              width: "100%",
              backgroundAttachment: "fixed",
              backgroundPosition: "center",
              backgroundSize: "center",
              objectFit: "center",
            }}
          >
            <div className="login-content">
              <img src={yachtCrew} style={{ width: "200px" }} alt="" />
            </div>
          </div>

          {/* Right Panel */}
          <div
            className="flex-1 flex align-items-center justify-content-center right-panel"
            style={{ height: "100vh", minHeight: 0 }}
          >
            <div
              className="login-right-component"
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                className="logo-wraper"
                style={{ marginBottom: "5px", paddingTop: "30px" }}
              >
                {step !== 4 && <StepInfo currentStep={step} />}
              </div>
              <div
                className="login-form vendor-login-form"
                style={{
                  flex: 1,
                  overflowY: "auto",
                  maxHeight: "calc(100vh - 40px)", // adjust for header/step info
                  paddingBottom: 32,
                  minHeight: 0,
                }}
              >
                <div className="form-scroll-inner" style={{ paddingRight: 20 }}>
                  <SupplierSignUpForm
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
    </div>
  );
};

export default SupplierSignup;
