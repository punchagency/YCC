import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import inputLogo from "../assets/images/nameinput.png";
import emailLogo from "../assets/images/emailinput.png";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Select from "react-select";
import countryData from "../data/countries.json";
import whatsappLogo from "../assets/images/whatsapp.png";
import chatLogo from "../assets/images/mesLogo.png";
import { motion, AnimatePresence } from "framer-motion";
import mailLogo from "../assets/images/maillogo.png";

import captainLogo from "../assets/images/captain.png";
import exteriorLogo from "../assets/images/exterior.png";
import interiorLogo from "../assets/images/interior.png";
import chefLogo from "../assets/images/chef.png";
import engineeringLogo from "../assets/images/engineering.png";
import positionLogo from "../assets/images/positionLogo.png";
import experienceLogo from "../assets/images/experience.png";
import LocationLogo from "../assets/images/locationLogo.png";
import uploadLogo from "../assets/images/uploadLogo.png";
import searchLogo from "../assets/images/searchLogo.png";
import profileLogo from "../assets/images/profileUploadLogo.png";
import { certificationsList } from "../data/certificationList";
import cvUploadLogo from "../assets/images/cvUploadLogo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { signup } from "../services/authService";

const formattedCountries = countryData.map((country) => ({
  value: country.cca2,
  label: country.name.common,
  flag: `https://flagcdn.com/w40/${country.cca2.toLowerCase()}.png`,
}));

const CrewSignUpForm = ({ setStep, currentStep, formData, setFormData }) => {
  const [phone, setPhone] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCommunication, setSelectedCommunication] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isProfileUploading, setIsProfileUploading] = useState(false);
  const [isCVUploading, setIsCVUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSignup = async () => {
    if (!acceptTerms) {
      setError("You must accept the Terms of Service.");
      return;
    }

    setSuccess(true);
    setIsSubmitting(true);

    try {
      await handleSubmit();
      setSuccess(false);
    } catch (err) {
      setError("Signup failed. Please try again.");
      setSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const formDataObj = new FormData();

      formDataObj.append("email", formData.email);
      formDataObj.append("password", formData.password);
      formDataObj.append("confirmPassword", formData.confirmPassword);
      formDataObj.append("role", "crew_member");

      const crewDetails = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: phone,
        country: selectedCountry?.label || "",
        currentLocation: formData.location || "",

        preferredCommunication:
          formData.preferredCommunication ||
          formData.selectedCommunication?.value ||
          "email",
        position: formData.position?.value || "",
        yearsOfExperience: formData.yearsOfExperience?.value || "",
        certifications: formData.certification ? [formData.certification] : [],
      };

      console.log(
        "Submitting with preferredCommunication:",
        formData.preferredCommunication
      );
      console.log("Complete crewDetails:", crewDetails);

      console.log("Submitting crew details:", crewDetails);

      formDataObj.append("crewDetails", JSON.stringify(crewDetails));

      if (selectedFiles[0]) {
        console.log("Appending profile picture:", selectedFiles[0]);
        formDataObj.append("profilePicture", selectedFiles[0]);
      }
      if (selectedCV) {
        console.log("Appending CV:", selectedCV);
        formDataObj.append("cv", selectedCV);
      }
      if (formData.certificationFile) {
        console.log("Appending certification:", formData.certificationFile);
        formDataObj.append("certificationFiles", formData.certificationFile);
      }
      for (let pair of formDataObj.entries()) {
        console.log(pair[0], pair[1]);
      }

      console.log("Submitting form data:", {
        crewDetails,
        files: {
          profilePicture: selectedFiles[0]?.name,
          cv: selectedCV?.name,
          certificationFiles: formData.certificationFile?.name,
        },
      });

      if (!crewDetails.preferredCommunication) {
        throw new Error("Please select a preferred communication methodsss");
      }

      if (
        !crewDetails.firstName ||
        !crewDetails.lastName ||
        !crewDetails.phone
      ) {
        throw new Error("First name, last name, and phone number are required");
      }

      if (!crewDetails.position || !crewDetails.yearsOfExperience) {
        throw new Error("Position and years of experience are required");
      }

      const response = await signup(formDataObj);

      if (response.status === "success") {
        navigate("/crew/inventory/dashboard");
      }
    } catch (err) {
      setError(err.message || "Failed to sign up. Please try again.");
      console.error("Signup error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsProfileUploading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setSelectedFiles([file]);
      } catch (error) {
        console.error("Upload failed:", error);
      } finally {
        setIsProfileUploading(false);
      }

      const validTypes = ["image/jpeg", "image/png", "image/svg+xml"];
      if (!validTypes.includes(file.type)) {
        alert("Please upload a JPG, PNG, or SVG file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("File size should not exceed 5MB");
        return;
      }

      setSelectedFiles([file]);
    }
  };

  const triggerFileInput = (e) => {
    e.stopPropagation();
    fileInputRef.current.click();
  };

  const handleCertificationSearch = (searchTerm) => {
    handleInputChange("certification", searchTerm);

    if (searchTerm.trim() === "") {
      setSearchResults([]);
      setShowResults(false);
      setNoResults(false);
      return;
    }

    const filteredResults = certificationsList.filter((cert) =>
      cert.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filteredResults.length === 0) {
      setNoResults(true);
      setShowResults(true);
    } else {
      setNoResults(false);
      setSearchResults(filteredResults.slice(0, 20));
      setShowResults(true);
    }
  };

  const communicationOptions = [
    {
      value: "email",
      label: "Email",
      icon: mailLogo,
    },
    {
      value: "whatsapp",
      label: "WhatsApp",
      icon: whatsappLogo,
    },
    {
      value: "chat",
      label: "Chat Platform",
      icon: chatLogo,
    },
  ];

  const handleInputChange = (name, value) => {
    setFormData({
      [name]: value,
    });
  };

  const positionOptions = [
    {
      value: "captain",
      label: "Captain",
      icon: captainLogo,
    },
    {
      value: "exterior",
      label: "Exterior",
      icon: exteriorLogo,
    },
    {
      value: "interior",
      label: "Interior",
      icon: interiorLogo,
    },
    {
      value: "chef",
      label: "Chef",
      icon: chefLogo,
    },
    {
      value: "engineering",
      label: "Engineering",
      icon: engineeringLogo,
    },
  ];

  const experienceOptions = [
    { value: "1", label: "1 Year" },
    { value: "2", label: "2 Years" },
    { value: "3", label: "3 Years" },
    { value: "4", label: "4 Years" },
    { value: "5", label: "5 Years and above" },
  ];

  const handleChange = (selectedOption) => {
    setSelectedCountry(selectedOption);
    setFormData((prev) => ({
      ...prev,
      selectedCountry: selectedOption,
    }));
  };

  const handleCommunicationChange = (selectedOption) => {
    setSelectedCommunication(selectedOption);
    setFormData((prev) => ({
      ...prev,
      selectedCommunication: selectedOption,
      preferredCommunication: selectedOption.value,
    }));
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const handleNext = () => {
    setStep(currentStep + 1);
  };

  const handlePrevious = () => {
    setStep(currentStep - 1);
  };

  const handleCVSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      validateAndSetCV(file);
      setIsCVUploading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setSelectedCV(file);
      } catch (error) {
        console.error("Upload failed:", error);
      } finally {
        setIsCVUploading(false);
      }
    }
  };

  const validateAndSetCV = (file) => {
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!validTypes.includes(file.type)) {
      alert("Please upload a PDF or Word document");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("File size should not exceed 10MB");
      return;
    }

    setSelectedCV(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleCVDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];
    if (file) {
      validateAndSetCV(file);
      setIsCVUploading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setSelectedCV(file);
      } catch (error) {
        console.error("Upload failed", error);
      } finally {
        setIsCVUploading(false);
      }
    }
  };

  const triggerCVInput = (e) => {
    e.stopPropagation();
    cvFileInputRef.current.click();
  };

  const [selectedCV, setSelectedCV] = useState(null);
  const cvFileInputRef = useRef(null);

  return (
    <div className="form-container">
      <AnimatePresence mode="wait" initial={false}>
        {currentStep === 1 && (
          <motion.div
            key="step1"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
          >
            <div className="step1">
              <div className="login-heading" style={{ marginTop: "0px" }}>
                <h2 className="font-medium mb-10">Sign Up</h2>
                <p>
                  Have an account? <Link to="/login">Sign in!</Link>
                </p>
              </div>

              <div className="form-group1">
                <div className="input-field">
                  <div>
                    <label htmlFor="firstName">First Name</label>
                  </div>
                  <div className="inputBorder">
                    <img
                      src={inputLogo}
                      alt="Name input icon"
                      style={{ width: "12px", height: "12px" }}
                    />
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="input-field">
                  <div>
                    <label htmlFor="lastName">Last Name</label>
                  </div>
                  <div className="inputBorder">
                    <img
                      src={inputLogo}
                      alt="Name input icon"
                      style={{ width: "12px", height: "12px" }}
                    />
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="form-group2">
                <div className="input-field">
                  <div>
                    <label htmlFor="lastName">Email</label>
                  </div>
                  <div className="inputBorder">
                    <img
                      src={emailLogo}
                      alt="Email icon"
                      style={{ width: "12px", height: "12px" }}
                    />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="form-group1">
                <div className="input-field">
                  <div>
                    <label htmlFor="phone">Phone Number</label>
                  </div>
                  <div className="inputBorder">
                    <PhoneInput
                      country={"us"}
                      className="phone-input"
                      value={phone}
                      onChange={(value) => setPhone(value)}
                      inputStyle={{
                        width: "100%",
                        height: "35px",
                        background: "transparent",
                        border: "none",
                      }}
                      containerStyle={{
                        width: "100%",
                      }}
                      buttonStyle={{
                        border: "none",
                        background: "transparent",
                      }}
                      dropdownStyle={{
                        "&::-webkit-scrollbar": {
                          display: "none",
                        },
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                        height: "300px",
                      }}
                      containerClass="phone-input-container"
                    />
                  </div>
                </div>
                <div className="input-field">
                  <div>
                    <label htmlFor="country">Country/Region</label>
                  </div>
                  <div className="inputBorder">
                    <Select
                      id="country"
                      options={formattedCountries}
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          background: "transparent",
                          border: "none",
                          boxShadow: "none",
                          width: "300%",
                        }),
                        menu: (provided) => ({
                          ...provided,
                          width: "300%",
                          zIndex: 999,
                        }),
                        menuList: (provided) => ({
                          ...provided,
                          maxHeight: "300px",
                          "&::-webkit-scrollbar": {
                            display: "none",
                          },
                          scrollbarWidth: "none",
                          msOverflowStyle: "none",
                        }),
                        dropdownIndicator: (provided) => ({
                          singleValue: (provided) => ({
                            ...provided,
                            fontSize: "14px",
                          }),
                        }),

                        singleValue: (provided) => ({
                          ...provided,
                          fontSize: "14px",
                        }),
                      }}
                      components={{
                        DropdownIndicator: () => null,
                        IndicatorSeparator: () => null,
                      }}
                      value={selectedCountry}
                      onChange={handleChange}
                      getOptionLabel={(e) => (
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <img
                            src={e.flag}
                            alt={e.label}
                            style={{ width: 20, height: 15, marginRight: 10 }}
                          />
                          {e.label}
                        </div>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group4">
                <div className="input-field">
                  <div>
                    <label htmlFor="preferredCommunication">
                      Preferred Communication
                    </label>
                  </div>
                  <div className="inputBorder">
                    <Select
                      id="preferredCommunication"
                      options={communicationOptions}
                      value={selectedCommunication}
                      onChange={handleCommunicationChange}
                      placeholder="Preferred Communication"
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          background: "transparent",
                          border: "none",
                          boxShadow: "none",
                          width: "310%",
                          minWidth: "310%",
                        }),
                        menu: (provided) => ({
                          ...provided,
                          width: "310%",
                          minWidth: "310%",
                          zIndex: 999,
                        }),
                        menuList: (provided) => ({
                          ...provided,
                          "&::-webkit-scrollbar": { display: "none" },
                          scrollbarWidth: "none",
                          msOverflowStyle: "none",
                        }),
                        singleValue: (provided) => ({
                          ...provided,
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                          whiteSpace: "nowrap",
                        }),
                        option: (provided) => ({
                          ...provided,
                          display: "flex",
                          alignItems: "center",
                          whiteSpace: "nowrap",
                        }),
                        valueContainer: (provided) => ({
                          ...provided,
                          width: "310%",
                          minWidth: "310%",
                        }),
                        container: (provided) => ({
                          ...provided,
                          width: "310%",
                          minWidth: "310%",
                        }),
                        dropdownIndicator: () => null,
                      }}
                      components={{
                        DropdownIndicator: () => null,
                        IndicatorSeparator: () => null,
                      }}
                      getOptionLabel={(e) => (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                            minWidth: "100%",
                          }}
                        >
                          <img
                            src={e.icon}
                            alt={e.label}
                            style={{
                              width: 15,
                              height: 15,
                              marginRight: 10,
                              flexShrink: 0,
                            }}
                          />
                          <p style={{ margin: 0, whiteSpace: "nowrap" }}>
                            {e.label}
                          </p>
                        </div>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group5"></div>

              <div className="form-group6">
                <button className="nextbtn" onClick={handleNext}>
                  Next
                </button>
              </div>
            </div>
          </motion.div>
        )}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
          >
            <div className="step2">
              <div className="form-group1">
                <div className="input-field" style={{ width: "100%" }}>
                  <div>
                    <label>Position/Department</label>
                  </div>
                  <div className="inputBorder">
                    <Select
                      options={positionOptions}
                      value={formData.position}
                      onChange={(option) =>
                        handleInputChange("position", option)
                      }
                      placeholder={
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <img
                            src={positionLogo}
                            alt=""
                            style={{
                              width: "12px",
                              height: "12px",
                              marginRight: "8px",
                            }}
                          />
                          <span>Position/Department</span>
                        </div>
                      }
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          background: "transparent",
                          border: "none",
                          boxShadow: "none",
                          width: "210%",
                        }),
                        container: (provided) => ({
                          ...provided,
                          width: "100%",
                        }),
                        menu: (provided) => ({
                          ...provided,
                          width: "210%",
                        }),
                        menuList: (provided) => ({
                          ...provided,
                          "&::-webkit-scrollbar": { display: "none" },
                          scrollbarWidth: "none",
                          msOverflowStyle: "none",
                        }),
                        singleValue: (provided) => ({
                          ...provided,
                          display: "flex",
                          alignItems: "center",
                        }),
                        option: (provided) => ({
                          ...provided,
                          display: "flex",
                          alignItems: "center",
                        }),
                        valueContainer: (provided) => ({
                          ...provided,
                          width: "100%",
                        }),
                      }}
                      getOptionLabel={(option) => (
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <img
                            src={option.icon}
                            alt={option.label}
                            style={{ width: 20, height: 20, marginRight: 10 }}
                          />
                          {option.label}
                        </div>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group1">
                <div className="input-field" style={{ width: "100%" }}>
                  <div>
                    <label>Years of Experience</label>
                  </div>
                  <div className="inputBorder">
                    <img
                      src={experienceLogo}
                      alt=""
                      style={{
                        width: "12px",
                        height: "12px",
                        marginRight: "8px",
                      }}
                    />
                    <Select
                      options={experienceOptions}
                      placeholder="Years of Experience"
                      value={formData.yearsOfExperience}
                      onChange={(option) =>
                        handleInputChange("yearsOfExperience", option)
                      }
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          background: "transparent",
                          border: "none",
                          boxShadow: "none",
                          width: "210%",
                        }),
                        container: (provided) => ({
                          ...provided,
                          width: "100%",
                        }),
                        menu: (provided) => ({
                          ...provided,
                          width: "210%",
                        }),
                        menuList: (provided) => ({
                          ...provided,
                          "&::-webkit-scrollbar": { display: "none" },
                          scrollbarWidth: "none",
                          msOverflowStyle: "none",
                        }),
                        singleValue: (provided) => ({
                          ...provided,
                          display: "flex",
                          alignItems: "center",
                        }),
                        option: (provided) => ({
                          ...provided,
                          display: "flex",
                          alignItems: "center",
                          padding: "8px 12px",
                        }),
                        valueContainer: (provided) => ({
                          ...provided,
                          width: "100%",
                        }),
                      }}
                      components={{
                        IndicatorSeparator: () => null,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group1">
                <div className="input-field" style={{ width: "100%" }}>
                  <div>
                    <label>Location</label>
                  </div>
                  <div className="inputBorder">
                    <img
                      src={LocationLogo}
                      alt=""
                      style={{
                        width: "12px",
                        height: "12px",
                        marginRight: "8px",
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Enter your location"
                      value={formData.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                      style={{
                        border: "none",
                        background: "transparent",
                        width: "210%",
                        outline: "none",
                        fontSize: "14px",
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group6">
                <button className="prevbtn" onClick={handlePrevious}>
                  Previous
                </button>
                <button className="nextbtn" onClick={handleNext}>
                  Next
                </button>
              </div>
            </div>
          </motion.div>
        )}
        {currentStep === 3 && (
          <motion.div
            key="step3"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
          >
            <div className="step3">
              <div className="form-group1">
                <div className="input-field" style={{ width: "100%" }}>
                  <div>
                    <label>Upload Certifications</label>
                  </div>
                  <div className="inputBorder" style={{ position: "relative" }}>
                    <div
                      style={{ display: "flex", alignItems: "center", flex: 1 }}
                    >
                      <img
                        src={searchLogo}
                        alt=""
                        style={{
                          width: "12px",
                          height: "12px",
                          marginRight: "8px",
                        }}
                      />
                      <input
                        type="text"
                        value={formData.certification}
                        onChange={(e) =>
                          handleCertificationSearch(e.target.value)
                        }
                        onFocus={() => {
                          if (formData.certification) setShowResults(true);
                        }}
                        placeholder="Search for certifications"
                        style={{
                          border: "none",
                          background: "transparent",
                          width: "100%",
                          outline: "none",
                          fontSize: "14px",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        borderLeft: "1px solid #e0e0e0",
                        paddingLeft: "10px",
                      }}
                    >
                      <label
                        htmlFor="file-upload"
                        style={{ cursor: "pointer" }}
                      >
                        <img
                          src={uploadLogo}
                          alt="Upload"
                          style={{
                            width: "20px",
                            height: "20px",
                          }}
                        />
                      </label>
                      <input
                        id="file-upload"
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          handleInputChange("certificationFile", file);
                        }}
                        style={{ display: "none" }}
                      />
                    </div>

                    {showResults && searchResults.length > 0 && (
                      <div
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          right: 0,
                          background: "white",
                          border: "1px solid #e0e0e0",
                          borderRadius: "4px",
                          marginTop: "4px",
                          maxHeight: "200px",
                          overflowY: "auto",
                          zIndex: 1000,
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          msOverflowStyle: "none",
                          scrollbarWidth: "none",
                          "&::-webkit-scrollbar": {
                            display: "none",
                          },
                        }}
                        className="no-scrollbar"
                      >
                        {searchResults.map((cert, index) => (
                          <div
                            key={index}
                            onClick={() => {
                              handleInputChange("certification", cert);
                              setShowResults(false);
                            }}
                            style={{
                              padding: "8px 12px",
                              cursor: "pointer",
                              borderBottom:
                                index < searchResults.length - 1
                                  ? "1px solid #e0e0e0"
                                  : "none",
                              ":hover": {
                                backgroundColor: "#f5f5f5",
                              },
                            }}
                            onMouseEnter={(e) =>
                              (e.target.style.backgroundColor = "#f5f5f5")
                            }
                            onMouseLeave={(e) =>
                              (e.target.style.backgroundColor = "white")
                            }
                          >
                            {cert}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {formData.certificationFile && (
                  <div
                    style={{
                      marginTop: "8px",
                      fontSize: "12px",
                      color: "#666",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <span>
                      Selected file: {formData.certificationFile.name}
                    </span>
                    <button
                      onClick={() =>
                        handleInputChange("certificationFile", null)
                      }
                      style={{
                        border: "none",
                        background: "none",
                        color: "#999",
                        cursor: "pointer",
                        padding: "0 5px",
                      }}
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>

              <div className="form-group6">
                <button className="prevbtn" onClick={handlePrevious}>
                  Previous
                </button>
                <button className="nextbtn" onClick={handleNext}>
                  Next
                </button>
              </div>
            </div>
          </motion.div>
        )}
        {currentStep === 4 && (
          <motion.div
            key="step4"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
          >
            <div className="signup-step">
              <div className="file-upload-container">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept=".jpg,.jpeg,.png,.svg"
                  className="hidden-file-input"
                />

                <div
                  className="upload-box"
                  onClick={triggerFileInput}
                  style={{
                    cursor: "pointer",
                    lineHeight: "60px",
                    width: "100%",
                    height: "180px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <div
                    className="upload-content"
                    style={{
                      borderRadius: "8px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      width: "100%",
                      padding: "0px",
                    }}
                  >
                    <div className="upload-icon">
                      {isProfileUploading ? (
                        <div className="loading-spinner">
                          <div className="spinner"></div>
                        </div>
                      ) : selectedFiles.length > 0 ? (
                        <img
                          src={URL.createObjectURL(selectedFiles[0])}
                          className="profileLogo"
                          alt="Selected profile"
                          style={{ width: "35px", height: "35px" }}
                        />
                      ) : (
                        <img
                          src={profileLogo}
                          className="profileLogo"
                          style={{ width: "35px", height: "35px" }}
                          alt="profile"
                        />
                      )}
                      <p
                        className="optional"
                        style={{
                          fontSize: "12px",
                          fontWeight: "bold",
                          color: "grey",
                        }}
                      >
                        Upload photo{" "}
                        <span
                          style={{ color: "lightgrey", fontWeight: "normal" }}
                        ></span>
                      </p>
                    </div>
                    <button
                      className="browse-button"
                      onClick={triggerFileInput}
                      type="button"
                      style={{ marginTop: "50px" }}
                    >
                      {selectedFiles.length > 0
                        ? "Change Photo"
                        : "Browse Files"}
                    </button>
                    <br />
                    <span className="file-types"></span>
                  </div>
                </div>
              </div>
              <div className="cv-upload-container">
                <div
                  className="cv-upload-box"
                  onDragOver={handleDragOver}
                  onDrop={handleCVDrop}
                  onClick={triggerCVInput}
                  style={{
                    cursor: "pointer",
                    lineHeight: "-30px",
                    width: "100%",
                    height: "180px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  {isCVUploading ? (
                    <div className="loading-spinner">
                      <div className="spinner"></div>
                    </div>
                  ) : (
                    <img
                      src={cvUploadLogo}
                      style={{ width: "40px", height: "40px" }}
                      alt="cv"
                    />
                  )}
                  <input
                    type="file"
                    ref={cvFileInputRef}
                    onChange={handleCVSelect}
                    accept=".pdf,.doc,.docx"
                    className="hidden-file-input"
                    style={{ display: "none" }}
                  />

                  <div className="upload-content">
                    <div className="upload-icon">
                      <i className="fas fa-file-alt"></i>
                    </div>
                    {selectedCV ? (
                      <>
                        <p
                          className="file-name"
                          style={{
                            fontSize: "10px",
                            lineHeight: "-20px",
                            marginBottom: "0px",
                          }}
                        >
                          {selectedCV.name.length > 20
                            ? selectedCV.name.substring(0, 20) + "..."
                            : selectedCV.name}
                        </p>
                        <span className="file-size">
                          ({(selectedCV.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                        <div
                          className="cv-actions"
                          style={{ marginTop: "100px" }}
                        >
                          <button
                            className="change-cv"
                            onClick={triggerCVInput}
                            type="button"
                          >
                            Browse Files
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p style={{ marginBottom: "15px", fontSize: "12px" }}>
                          Drag & drop your CV here or
                        </p>
                        <button
                          className="browse-button"
                          onClick={triggerCVInput}
                          type="button"
                          style={{
                            background:
                              "linear-gradient(to right, #034d92, #0487d9)",
                          }}
                        >
                          Browse Files
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="button-group">
                <button
                  className="prev-button"
                  onClick={() => setStep(3)}
                  style={{ width: "100%", background: "#f0f0f0" }}
                >
                  Previous
                </button>
                <button
                  className="next-button nextbtn"
                  onClick={() => setStep(5)}
                  disabled={false}
                  style={{
                    width: "100%",
                    marginLeft: "20px",
                    background: "linear-gradient(to right, #034d92, #0487d9)",
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === 5 && (
          <motion.div
            key="step5"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="form-groupPass">
              <div>
                <label htmlFor="password">Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Your Password"
                    className="confirm_password"
                    value={formData.password || ""}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                  />
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "20px",
                      top: "40%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      color: "#666",
                    }}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-Enter Your Password"
                    className="confirm_password"
                    value={formData.confirmPassword || ""}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                  />
                  <FontAwesomeIcon
                    icon={showConfirmPassword ? faEyeSlash : faEye}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: "absolute",
                      right: "20px",
                      top: "40%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      color: "#666",
                    }}
                  />
                </div>
              </div>

              <div className="form-group5">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  checked={acceptTerms}
                  onChange={() => setAcceptTerms(!acceptTerms)}
                />
                <label htmlFor="acceptTerms">
                  By creating an account, you agree to the
                  <a href="/privacy-policy" aria-label="Privacy Policy">
                    Privacy Policy
                  </a>
                  We'll occasionally send you account-related emails.
                </label>
              </div>

              <div className="button-group">
                <button
                  className="prev-button"
                  onClick={() => setStep(4)}
                  style={{ width: "100%", marginLeft: "20px" }}
                  disabled={isSubmitting}
                >
                  Previous
                </button>
                <button
                  className="next-button"
                  onClick={handleSignup}
                  disabled={isSubmitting}
                  style={{
                    width: "100%",
                    marginLeft: "20px",
                    background: isSubmitting
                      ? "#ccc"
                      : "linear-gradient(to right, #034d92, #0487d9)",
                  }}
                >
                  {isSubmitting ? "Signing up..." : "Sign up"}
                </button>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    className="error-message"
                    style={{
                      position: "absolute",
                      top: "20px",
                      right: "20px",
                      background: "#ffdddd",
                      padding: "10px 15px",
                      borderRadius: "5px",
                      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                      color: "red",
                      fontWeight: "bold",
                    }}
                    initial={{ x: "100%", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: "100%", opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {success && (
                  <motion.div
                    className="success-message"
                    style={{
                      position: "absolute",
                      top: "60px",
                      right: "20px",
                      background: "#d4edda",
                      padding: "10px 15px",
                      borderRadius: "5px",
                      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                      color: "green",
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                    initial={{ x: "100%", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: "100%", opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <span>Signing you in...</span>
                    <span className="loader"></span>
                  </motion.div>
                )}
              </AnimatePresence>

              <style>
                {`
              .loader {
                width: 10px;
                height: 10px;
                border: 2px solid white;
                border-top-color: transparent;
                border-radius: 50%;
                animation: spin 0.8s linear infinite;
              }
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
              </style>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CrewSignUpForm;
