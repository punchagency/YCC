import React, { useState } from "react";
// import { Link, useLocation } from "react-router-dom";
import backgroundImage from "../../assets/images/water.jpg";
import check from "../../assets/images/check1.png";
import yachtCrew from "../../assets/images/yacht.png"; // Add appropriate vendor image
import VendorSignUpForm from "../../components/vendor.signup";

const StepInfo = ({ currentStep }) => {
  const stepData = {
    1: {
      step: "Step 1",
      info: "Business Information",
    },
    // 2: {
    //   step: "Step 2",
    //   info: "Company Verification",
    // },
    3: {
      step: "Step 2",
      info: "Service & Pricing Information",
    },
    4: {
      step: "Step 3",
      info: "Company Representative Information & Terms",
    },
    // 5: {
    //   step: "Step 5",
    //   info: "Platform Fees",
    // },
    6: {
      step: "Success",
      info: "Application Submitted",
    },
  };

  return (
    <div className="logo_crew" style={{
      display: "flex",
      alignItems: "center",
      gap: "15px",
      marginBottom: "18px"
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "39px",
        height: "39px"
      }}>
        <img src={check} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </div>
      <div>
        <p style={{ 
          margin: 0,
          fontSize: "15px",
          color: "#034D92"
        }}>{stepData[currentStep]?.step || ""}</p>
        <p className="personal_info" style={{ 
          margin: "0",
          fontSize: "14px",
          fontWeight: "bold",
          color: "#666"
        }}>{stepData[currentStep]?.info || ""}</p>
      </div>
    </div>
  );
};

const VendorSignup = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Business Information
    businessName: "",
    businessAddress: "",
    department: null,
    phone: "",
    businessWebsite: "",
    email: "",
    taxId: "",

    // Service Details
    services: null,
    pricingStructure: "",
    availability: "",
    bookingMethod: null,
    serviceArea: null,

    // Documents
    licenseFile: null,
    liabilityInsurance: null,
    role: "",

    // Contact Person
    contactPerson: {
      fullName: "",
      role: "",
    },
  });

  const handleFormDataChange = (newData) => {
    setFormData(newData);
  };

  return (
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
        <div className="flex-1 flex align-items-center justify-content-center right-panel">
          <div className="login-right-component">
            <div
              className="logo-wraper"
              style={{ marginBottom: "5px", paddingTop: "30px" }}
            >
              <StepInfo currentStep={step} />
            </div>
            <div
              className="login-form vendor-login-form"
              style={{
               
                minHeight: "700px",
                height: "auto",
                padding: "0px",
              }}
            >
              <VendorSignUpForm
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
  );
};

export default VendorSignup;
