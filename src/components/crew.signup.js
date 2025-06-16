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
  const [certificationFiles, setCertificationFiles] = useState([]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    // MutationObserver workaround for phone dropdown direction
    const observer = new MutationObserver(() => {
      const dropdown = document.querySelector(
        ".phone-input-container .country-list"
      );
      if (dropdown) {
        dropdown.style.bottom = "100%";
        dropdown.style.top = "auto";
        dropdown.style.marginBottom = "4px";
        dropdown.style.marginTop = "0";
        dropdown.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

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
        position: formData.position?.value || "",
        yearsOfExperience: formData.yearsOfExperience?.value || "",
        certifications: formData.certification ? [formData.certification] : [],
      };

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
      if (certificationFiles.length < 3) {
        setError('Please upload at least 3 certifications.');
        setIsSubmitting(false);
        return;
      }
      certificationFiles.forEach((file, idx) => {
        formDataObj.append(`certificationFiles`, file);
      });
      for (let pair of formDataObj.entries()) {
        console.log(pair[0], pair[1]);
      }

      console.log("Submitting form data:", {
        crewDetails,
        files: {
          profilePicture: selectedFiles[0]?.name,
          cv: selectedCV?.name,
          certificationFiles: certificationFiles.map((file) => file.name),
        },
      });

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

  const handleCertificationFilesChange = (e) => {
    const files = Array.from(e.target.files);
    if (certificationFiles.length + files.length > 15) {
      setError('You can upload a maximum of 15 certifications.');
      return;
    }
    setCertificationFiles((prev) => [...prev, ...files]);
  };

  const removeCertificationFile = (index) => {
    setCertificationFiles((prev) => prev.filter((_, i) => i !== index));
  };

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
    { value: '0-2', label: '0-2 Years' },
    { value: '2-4', label: '2-4 Years' },
    { value: '4-10', label: '4-10 Years' },
    { value: '10+', label: '10+ Years' },
  ];

  const handleChange = (selectedOption) => {
    setSelectedCountry(selectedOption);
    setFormData((prev) => ({
      ...prev,
      selectedCountry: selectedOption,
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
    <div className="form-container" style={{ width: "100%" }}>
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
                  <div className="inputBorder" style={{ marginBottom: 16 }}>
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
                      style={{ minHeight: 44, fontFamily: "Inter, sans-serif" }}
                    />
                  </div>
                </div>
                <div className="input-field">
                  <div>
                    <label htmlFor="lastName">Last Name</label>
                  </div>
                  <div className="inputBorder" style={{ marginBottom: 16 }}>
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
                      style={{ minHeight: 44, fontFamily: "Inter, sans-serif" }}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group2">
                <div className="input-field">
                  <div>
                    <label htmlFor="lastName">Email</label>
                  </div>
                  <div className="inputBorder" style={{ marginBottom: 16 }}>
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
                      style={{ minHeight: 44, fontFamily: "Inter, sans-serif" }}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group1">
                <div className="input-field">
                  <div>
                    <label htmlFor="phone">Phone Number</label>
                  </div>
                  <div className="inputBorder" style={{ marginBottom: 16 }}>
                    <PhoneInput
                      country={"us"}
                      className="phone-input"
                      value={phone}
                      onChange={(value) => setPhone(value)}
                      inputStyle={{
                        width: "100%",
                        minHeight: 44,
                        border: "none",
                        boxShadow: "none",
                        background: "transparent",
                      }}
                      buttonStyle={{
                        border: "none",
                        background: "transparent",
                        paddingRight: 8,
                      }}
                      dropdownStyle={{
                        minWidth: 350,
                        width: 350,
                        zIndex: 9999,
                      }}
                      containerStyle={{
                        width: "100%",
                      }}
                      enableSearch={true}
                      dropdownClass="phone-dropdown-up"
                    />
                  </div>
                </div>
                <div className="input-field">
                  <div>
                    <label htmlFor="country">Country/Region</label>
                  </div>
                  <div className="inputBorder" style={{ marginBottom: 16 }}>
                    <Select
                      id="country"
                      options={formattedCountries}
                      menuPlacement="top"
                      isSearchable={true}
                      placeholder={
                        <span style={{ display: "flex", alignItems: "center" }}>
                          <img
                            src="https://flagcdn.com/w40/gb.png"
                            alt=""
                            style={{ width: 20, height: 15, marginRight: 10 }}
                          />
                          Select...
                        </span>
                      }
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          width: "100%",
                          minHeight: 44,
                          background: "transparent",
                          border: "none",
                          boxShadow: "none",
                        }),
                        menu: (provided) => ({
                          ...provided,
                          minWidth: 350,
                          width: 350,
                          zIndex: 9999,
                        }),
                        menuList: (provided) => ({
                          ...provided,
                          maxHeight: "300px",
                          scrollbarWidth: "thin",
                          scrollbarColor: "#034D92 #f0f0f0",
                          "&::-webkit-scrollbar": {
                            width: "6px",
                          },
                          "&::-webkit-scrollbar-track": {
                            background: "#f0f0f0",
                            borderRadius: "3px",
                          },
                          "&::-webkit-scrollbar-thumb": {
                            background: "#034D92",
                            borderRadius: "3px",
                          },
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
                  <div className="inputBorder" style={{ marginBottom: 16 }}>
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
                          width: "100%",
                          minHeight: 44,
                          input: (provided) => ({ ...provided, fontFamily: 'Inter, sans-serif', fontSize: 14, paddingLeft: 36 }),
                          placeholder: (provided) => ({ ...provided, fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#888', paddingLeft: 36 }),
                        }),
                        container: (provided) => ({
                          ...provided,
                          width: "100%",
                        }),
                        menu: (provided) => ({
                          ...provided,
                          width: "100%",
                        }),
                        menuList: (provided) => ({
                          ...provided,
                          maxHeight: "200px",
                          scrollbarWidth: "thin",
                          scrollbarColor: "#034D92 #f0f0f0",
                          "&::-webkit-scrollbar": {
                            width: "6px",
                          },
                          "&::-webkit-scrollbar-track": {
                            background: "#f0f0f0",
                            borderRadius: "3px",
                          },
                          "&::-webkit-scrollbar-thumb": {
                            background: "#034D92",
                            borderRadius: "3px",
                          },
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
                  <div className="inputBorder" style={{ marginBottom: 16 }}>
                    <Select
                      options={experienceOptions}
                      value={formData.yearsOfExperience}
                      onChange={(option) => handleInputChange('yearsOfExperience', option)}
                      placeholder={
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <img
                            src={experienceLogo}
                            alt=""
                            style={{ width: '12px', height: '12px', marginRight: '8px' }}
                          />
                          <span>Years of Experience</span>
                        </div>
                      }
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          background: 'transparent',
                          border: 'none',
                          boxShadow: 'none',
                          width: '100%',
                          minHeight: 44,
                        }),
                        container: (provided) => ({
                          ...provided,
                          width: '100%',
                        }),
                        menu: (provided) => ({
                          ...provided,
                          width: '100%',
                        }),
                        menuList: (provided) => ({
                          ...provided,
                          maxHeight: '200px',
                          scrollbarWidth: 'thin',
                          scrollbarColor: '#034D92 #f0f0f0',
                          '&::-webkit-scrollbar': {
                            width: '6px',
                          },
                          '&::-webkit-scrollbar-track': {
                            background: '#f0f0f0',
                            borderRadius: '3px',
                          },
                          '&::-webkit-scrollbar-thumb': {
                            background: '#034D92',
                            borderRadius: '3px',
                          },
                        }),
                        singleValue: (provided) => ({
                          ...provided,
                          display: 'flex',
                          alignItems: 'center',
                        }),
                        option: (provided) => ({
                          ...provided,
                          display: 'flex',
                          alignItems: 'center',
                        }),
                        valueContainer: (provided) => ({
                          ...provided,
                          width: '100%',
                        }),
                      }}
                      components={{ IndicatorSeparator: () => null }}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group1">
                <div className="input-field" style={{ width: "100%" }}>
                  <div>
                    <label>Location</label>
                  </div>
                  <div className="inputBorder" style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <img
                        src={LocationLogo}
                        alt=""
                        style={{ width: '12px', height: '12px', marginRight: '8px' }}
                      />
                      <input
                        type="text"
                        placeholder="Enter your location"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          width: '100%',
                          outline: 'none',
                          fontSize: '14px',
                          minHeight: 44,
                          fontFamily: 'Inter, sans-serif',
                          color: formData.location ? '#222' : '#888',
                          '::placeholder': {
                            color: '#888',
                            fontFamily: 'Inter, sans-serif',
                            fontSize: 14,
                            opacity: 1,
                          },
                        }}
                      />
                    </div>
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
                    <label>Upload Certifications (min 3, max 15)</label>
                  </div>
                  <div className="inputBorder" style={{ position: "relative", marginBottom: 16 }}>
                    <input
                      id="certification-upload"
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      multiple
                      onChange={handleCertificationFilesChange}
                      disabled={certificationFiles.length >= 15}
                      style={{ display: 'block', marginBottom: 8 }}
                    />
                    <div style={{ fontSize: 12, color: '#666' }}>
                      {certificationFiles.length} file(s) selected
                    </div>
                    <ul style={{ fontSize: 12, color: '#666', margin: 0, padding: 0 }}>
                      {certificationFiles.map((file, idx) => (
                        <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {file.name}
                          <button type="button" onClick={() => removeCertificationFile(idx)} style={{ border: 'none', background: 'none', color: '#999', cursor: 'pointer' }}>×</button>
                        </li>
                      ))}
                    </ul>
                    {certificationFiles.length < 3 && (
                      <div style={{ color: 'red', fontSize: 12 }}>Please upload at least 3 certifications.</div>
                    )}
                    {certificationFiles.length > 15 && (
                      <div style={{ color: 'red', fontSize: 12 }}>You can upload a maximum of 15 certifications.</div>
                    )}
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
            <div
              style={{
                maxWidth: 420,
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: "#fff",
                borderRadius: 16,
                boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
                padding: "32px 24px 32px 24px",
                position: "relative",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginBottom: 32,
                }}
              >
                <span
                  style={{ fontSize: 32, color: "#0487D9", marginBottom: 8 }}
                >
                  ✔️
                </span>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 18,
                    color: "#034d92",
                    marginBottom: 4,
                  }}
                >
                  Step 4
                </div>
                <div style={{ fontSize: 14, color: "#888" }}>
                  Upload CV & Profile Picture
                </div>
              </div>
              <div
                className="file-upload-container"
                style={{ marginBottom: 32, width: "100%" }}
              >
                <div className="profile-upload-box" style={{
                  cursor: "pointer",
                  width: "100%",
                  height: "160px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  border: "2px dashed #b3e0fc",
                  borderRadius: 12,
                  background: "#f8fbfd",
                  boxShadow: "0 2px 8px rgba(4,135,217,0.04)",
                  marginBottom: 16,
                  position: "relative"
                }}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/jpeg,image/png,image/svg+xml"
                    style={{ display: "none" }}
                  />
                  {isProfileUploading ? (
                    <div className="loading-spinner"><div className="spinner"></div></div>
                  ) : selectedFiles.length > 0 ? (
                    <>
                      <img
                        src={URL.createObjectURL(selectedFiles[0])}
                        className="profileLogo"
                        style={{ width: "40px", height: "40px", borderRadius: 8, marginBottom: 8, objectFit: 'cover' }}
                        alt="profile"
                      />
                      <button
                        className="browse-button"
                        onClick={e => { e.stopPropagation(); setSelectedFiles([]); }}
                        type="button"
                        style={{ marginTop: 12, background: "#fff", color: "#034D92", border: "1px solid #034D92", borderRadius: 6, padding: "4px 14px", fontWeight: 500, fontSize: 13, cursor: "pointer" }}
                      >Remove Photo</button>
                    </>
                  ) : (
                    <>
                      <img
                        src={profileLogo}
                        className="profileLogo"
                        style={{ width: "40px", height: "40px", borderRadius: 8, marginBottom: 8 }}
                        alt="profile"
                      />
                      <p style={{ fontSize: 13, fontWeight: 500, color: "#0487D9", margin: 0, textAlign: 'center' }}>Upload Photo</p>
                      <button
                        className="browse-button"
                        onClick={triggerFileInput}
                        type="button"
                        style={{ marginTop: 12, background: "linear-gradient(to right, #034d92, #0487d9)", color: "#fff", border: "none", borderRadius: 6, padding: "6px 18px", fontWeight: 500, fontSize: 14, cursor: "pointer" }}
                      >Browse Files</button>
                    </>
                  )}
                </div>
              </div>
              <div
                className="cv-upload-container"
                style={{ marginBottom: 32, width: "100%" }}
              >
                <div
                  className="cv-upload-box"
                  onDragOver={handleDragOver}
                  onDrop={handleCVDrop}
                  onClick={triggerCVInput}
                  style={{
                    cursor: "pointer",
                    width: "100%",
                    height: "160px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    border: "2px dashed #b3e0fc",
                    borderRadius: 12,
                    boxShadow: "0 2px 8px rgba(4,135,217,0.04)",
                    background: "#f9f9f9",
                    position: "relative",
                  }}
                >
                  <input
                    type="file"
                    ref={cvFileInputRef}
                    onChange={handleCVSelect}
                    accept=".pdf,.doc,.docx"
                    className="hidden-file-input"
                    style={{ display: "none" }}
                  />
                  {isCVUploading ? (
                    <div className="loading-spinner">
                      <div className="spinner"></div>
                    </div>
                  ) : selectedCV ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                      <i className="fas fa-file-alt" style={{ fontSize: 40, color: '#0487D9', marginBottom: 8 }}></i>
                      <p className="file-name" style={{ fontSize: 13, marginBottom: 2, marginTop: 8, color: "#222", textAlign: "center" }}>
                        {selectedCV.name.length > 20 ? selectedCV.name.substring(0, 20) + "..." : selectedCV.name}
                      </p>
                      <span className="file-size" style={{ fontSize: 11, color: "#888" }}>
                        ({(selectedCV.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                      <button
                        className="change-cv"
                        onClick={e => { e.stopPropagation(); setSelectedCV(null); }}
                        style={{
                          marginTop: 12,
                          background: "#fff",
                          color: "#034D92",
                          border: "1px solid #034D92",
                          borderRadius: 6,
                          padding: "4px 14px",
                          fontWeight: 500,
                          fontSize: 13,
                          cursor: "pointer",
                        }}
                      >
                        Remove File
                      </button>
                    </div>
                  ) : (
                    <>
                      <img
                        src={cvUploadLogo}
                        style={{ width: "40px", height: "40px", marginBottom: 8 }}
                        alt="cv"
                      />
                      <div style={{ width: "100%", textAlign: "center" }}>
                        <div className="upload-icon">
                          <i className="fas fa-file-alt"></i>
                        </div>
                        <p style={{ fontSize: 13, fontWeight: 500, color: "#0487D9", margin: 0 }}>
                          Upload CV
                        </p>
                        <span style={{ fontSize: 11, color: "#888" }}>(PDF, DOC, DOCX)</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div
                className="button-group"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 16,
                  width: "100%",
                }}
              >
                <button
                  className="prev-button"
                  onClick={() => setStep(3)}
                  style={{
                    width: "48%",
                    background: "#f0f0f0",
                    border: "none",
                    borderRadius: 6,
                    padding: "10px 0",
                    fontWeight: 500,
                    fontSize: 15,
                    cursor: "pointer",
                  }}
                >
                  Previous
                </button>
                <button
                  className="next-button nextbtn"
                  onClick={() => setStep(5)}
                  disabled={false}
                  style={{
                    width: "48%",
                    background: "linear-gradient(to right, #034d92, #0487d9)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    padding: "10px 0",
                    fontWeight: 500,
                    fontSize: 15,
                    cursor: "pointer",
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
                    style={{ minHeight: 44, fontFamily: "Inter, sans-serif" }}
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
                    style={{ minHeight: 44, fontFamily: "Inter, sans-serif" }}
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

              <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0' }}>
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={() => setAcceptTerms(!acceptTerms)}
                  style={{ marginRight: 8 }}
                />
                <span style={{ fontSize: 14, color: '#333', fontFamily: 'Inter, sans-serif' }}>
                  By signing up, you acknowledge that you have read and agree to our
                  <a href="#" style={{ color: '#034D92', textDecoration: 'underline', margin: '0 4px', cursor: 'pointer' }} onClick={e => e.preventDefault()}>Privacy Policy</a>
                  and
                  <a href="#" style={{ color: '#034D92', textDecoration: 'underline', margin: '0 4px', cursor: 'pointer' }} onClick={e => e.preventDefault()}>Terms & Conditions</a>.
                </span>
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

<style>{`
.phone-dropdown-up .country-list {
  bottom: 100% !important;
  top: auto !important;
  margin-bottom: 4px;
}`}</style>;
