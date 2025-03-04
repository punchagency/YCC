import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import backgroundImage from "../../assets/images/water.jpg";
import check from "../../assets/images/check1.png";
// import logo from "../../assets/images/logo-login.png";
// import SignupForm from "../../components/signup";
import yachtCrew from "../../assets/images/yacht.png";
import CrewSignUpForm from "../../components/crew.signup";

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
    4:{
      step: "step 4",
      info: "Upload CV & Profile Picture"
    },
    5:{
      step:"step 5",
      info:"Create Password"
    }
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

const Signup = () => {
  const location = useLocation();
  const role = location.state?.role || "Guest";
  const [step, setStep] = useState(1);

  // Add formData state here in the parent
  const [formData, setFormData] = useState({
    // Step 1
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    selectedCountry: null,
    preferredCommunication: "",

    // Step 2
    position: null,
    yearsOfExperience: null,
    location: "",
    certification: "",
    certificationFile: null,
    password: "",
    confirmPassword: "",

    // Step 3
    // Add any step 3 fields here
  });

  

const handleFormDataChange = (newData) => {
  setFormData((prev) => {
    const updated = { ...prev, ...newData };
    console.log("Updated Form Data:", updated); // Debug log
    return updated;
  });
};

  return (
    <div className="check-bg">
      <div className="flex flex-column lg:flex-row align-content-start justify-content-center gap-0 login bg-inner">
        <div
          className="flex-1 flex-column bg-cover flex align-items-center justify-content-center left-panel bg-center"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            height: "100vh", // Sets the height of the background to 12vh
            width: "100%", // Ensures it takes full width
            backgroundAttachment: "fixed", // Keeps the background fixed in place while scrolling
            backgroundPosition: "center",
            backgroundSize: "center",
            objectFit: "center",
          }}
        >
          <div className="login-content">
            <img src={yachtCrew} style={{ width: "200px" }} alt="" />
          </div>
        </div>

        <div className="flex-1 flex align-items-center justify-content-center right-panel">
          <div className="login-right-component">
            <div
              className="logo-wraper"
              style={{ marginBottom: "5px", paddingTop: "30px" }}
            >
              {" "}
              {/* Added negative margin to reduce space */}
              {/* <div className="logo_crew">
                <div>
                  <img src={check} className="checkImg" alt="" />
                </div>
                <div>
                  <p>Step 1</p>
                  <p className="personal_info">Personal Information</p>
                </div>
              </div> */}
              <StepInfo currentStep={step} />
            </div>
            {/* <div className="login-heading" style={{ marginTop: "0px" }}>
              
              <h2 className="font-medium mb-10">Sign Up</h2>
              <p>
                Have an account? <Link to="/login">Sign in!</Link>
              </p>
            </div> */}
            <div className="login-form captain-login-form">
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
  );
};

export default Signup;
