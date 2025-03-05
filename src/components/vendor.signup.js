import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Select from "react-select";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import inputLogo from "../assets/images/nameinput.png";
import emailLogo from "../assets/images/emailinput.png";
import location from "../assets/images/location.png";
import departmentLogo from "../assets/images/departmentLogo.png";
import websiteLogo from "../assets/images/websiteLogo.png";
import uploadVat from "../assets/images/uploadVat.png";
import uploadLicense from "../assets/images/uploadLicense.png";
import crewDepartmentLogo from "../assets/images/crewDepartmentLogo.png";
import hourlyLogo from "../assets/images/hourlyLogo.png";
import availabilityLogo from "../assets/images/availablityLogo.png";
import prefferedLogo from "../assets/images/preferredLogo.png";
import areaLogo from "../assets/images/areaLogo.png";
import roleLogo from "../assets/images/roleLogo.png";
import uploadfileLogo from "../assets/images/uploadfileLogo.png";
import serviceLogo from "../assets/images/serviceLogo.png";
import { signup } from "../services/authService";
import thumbsLogo from "../assets/images/thumbsLogo.png";

const VendorSignUpForm = ({ setStep, currentStep, formData, setFormData }) => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSignup = async () => {
    if (!formData.acceptFees) {
      setError("Please accept the platform fees to continue.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formDataObj = new FormData();
      formDataObj.append("email", formData.email);
      formDataObj.append("role", "service_provider");
      formDataObj.append("businessName", formData.businessName);
      formDataObj.append("businessAddress", formData.businessAddress);
      formDataObj.append("department", formData.department);
      formDataObj.append("phone", formData.phone);

      const tempPassword = Math.random().toString(36).slice(-8);
      formDataObj.append("password", tempPassword);
      formDataObj.append("confirmPassword", tempPassword);

      // Append files if they exist
      if (formData.licenseFile) {
        formDataObj.append("licenseFile", formData.licenseFile);
      }
      if (formData.taxId) {
        formDataObj.append("taxId", formData.taxId);
      }
      if (formData.liabilityInsurance) {
        formDataObj.append("liabilityInsurance", formData.liabilityInsurance);
      }
      if (formData.pricingStructure) {
        formDataObj.append("pricingStructure", formData.pricingStructure);
      }

      const vendorDetails = {
        businessName: formData.businessName,
        businessAddress: formData.businessAddress,
        phone: formData.phone,
        businessWebsite: formData.businessWebsite,
        department: formData.department?.value,
        services: formData.services?.value,
        availability: formData.availability,
        bookingMethod: formData.bookingMethod?.value,
        serviceArea: formData.serviceArea?.value,
        contactPerson: {
          fullName: formData.contactPerson?.fullName,
          role: formData.contactPerson?.role,
        },
      };

      formDataObj.append("vendorDetails", JSON.stringify(vendorDetails));
      console.log("Email is being sent", formDataObj.email);

      console.log("Submitting vendor application with data:", {
        email: formDataObj.email,
        role: "service_provider",
        vendorDetails,
      });

      for (let pair of formDataObj.entries()) {
        console.log("Form Data:", pair[0], pair[1]);
      }

      const response = await signup(formDataObj);

      if (response.token) {
        setSuccess(true);
        setIsSubmitting(false);
        // Move to step 6 after successful signup
        setTimeout(() => {
          setStep(6);
        }, 2000);
      } else {
        setError("Failed to sign up. Please try again.");
      }
    } catch (error) {
      setError(error.message || "Failed to sign up. Please try again.");
      console.error("Signup error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const bookingMethodOptions = [
    { value: "instant meeting", label: "Instant Meeting" },
    { value: "request to book", label: "Request to Book" },
    { value: "quote request", label: "Quote Request" },
  ];

  const serviceAreaOptions = [
    { value: "caribbean", label: "Caribbean" },
    { value: "mediterranean", label: "Mediterranean" },
    { value: "usa", label: "USA" },
  ];

  const departmentOptions = [
    { value: "captain", label: "Captain" },
    { value: "crew", label: "Crew" },
    { value: "exterior", label: "Exterior" },
    { value: "engineering", label: "Engineering" },
    { value: "interior", label: "Interior" },
    { value: "galley", label: "Galley" },
  ];
  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleContactPersonChange = (field, value) => {
    setFormData({
      ...formData,
      contactPerson: {
        ...formData.contactPerson,
        [field]: value,
      },
    });
  };

  const [licenseFile, setLicenseFile] = useState(null);
  const [taxIdFile, setTaxIdFile] = useState(null);
  const [insuranceFile, setInsuranceFile] = useState(null);
  const [isUploading, setIsUploading] = useState(null);
  const [pricingFile, setPricingFile] = useState(null);
  const [fileUploading, setFileUploading] = useState({
    licenseFile: false,
    taxIdFile: false,
    insuranceFile: false,
    pricingFile: false,
  });

  const [fileErrors, setFileErrors] = useState({
    licenseFile: '',
    taxIdFile: '',
    insuranceFile: '',
    pricingFile: '',
  });

  // File upload handlers
  const handleFileUpload = async (file, type) => {
    if (!file) return;

    // Validate file size (e.g., max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("File size should not exceed 10MB");
      return;
    }

    // Validate file type
    const validTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a PDF, JPG, or PNG file");
      return;
    }

    setError("");

    setIsUploading(true);
    try {
      // Simulate upload delay (remove in production)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      switch (type) {
        case "pricing":
          setPricingFile(file);
          handleInputChange("pricingStructure", file);
          break;
        case "license":
          setLicenseFile(file);
          handleInputChange("licenseFile", file);
          break;
        case "taxId":
          setTaxIdFile(file);
          handleInputChange("taxId", file);
          break;
        case "insurance":
          setInsuranceFile(file);
          handleInputChange("liabilityInsurance", file);
          break;
        default:
          setError("Invalid file type. Please try again.");
          return;
      }
    } catch (error) {
      setError("File upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const renderStep1 = () => (
    <motion.div
      key="step1"
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Business Name */}
      <div className="form-group1">
        <div className="input-field">
          <div>
            <label htmlFor="businessName">Business Name</label>
          </div>
          <div className="inputBorder">
            <img src={inputLogo} style={{ width: "12px", height: "12px" }} />
            <input
              type="text"
              id="businessName"
              placeholder="Enter Business Name"
              value={formData.businessName || ""}
              onChange={(e) =>
                handleInputChange("businessName", e.target.value)
              }
            />
          </div>
        </div>
      </div>

      {/* Business Address */}
      <div className="form-group2">
        <div className="input-field">
          <div>
            <label htmlFor="businessAddress">Business Address</label>
          </div>
          <div className="inputBorder">
            <img src={location} style={{ width: "12px", height: "12px" }} />
            <input
              type="text"
              id="businessAddress"
              placeholder="Enter Business Address"
              value={formData.businessAddress}
              onChange={(e) =>
                handleInputChange("businessAddress", e.target.value)
              }
            />
          </div>
        </div>
      </div>

      {/* Department */}
      {/* Department */}
      <div className="form-group-department">
        <div className="input-field">
          <div>
            <label>Department</label>
          </div>
          <div className="inputBorder">
            <Select
              options={[
                { label: "Captain", value: "captain" },
                { label: "Crew", value: "crew" },
                { label: "Exterior", value: "exterior" },
                { label: "Interior", value: "interior" },
                { label: "Engineering", value: "engineering" },
                { label: "Galley", value: "galley" },
              ]}
              value={formData.department}
              onChange={(option) => handleInputChange("department", option)}
              placeholder={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={departmentLogo}
                    alt=""
                    style={{
                      width: "12px",
                      height: "12px",
                      marginRight: "8px",
                    }}
                  />
                  <span>Select Department</span>
                </div>
              }
              classNamePrefix="select"
              styles={{
                control: (provided) => ({
                  ...provided,
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  boxShadow: "none",
                  minHeight: "35px",
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
            />
          </div>
        </div>
      </div>

      {/* Phone Number */}
      <div
        className="form-row"
        style={{
          display: "flex",
          gap: "16px",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          paddingLeft: "10px",
        }}
      >
        {/* Phone Number */}
        <div className="form-group4" style={{ flex: "1" }}>
          <div className="input-field">
            <div>
              <label htmlFor="phone">Phone Number</label>
            </div>
            <div
              className="inputBorder"
              style={{
                display: "flex",
                alignItems: "center",
                padding: "8px 12px",
                backgroundColor: "#f5f5f5",
                borderRadius: "5px",
                width: "100%",
                height: "40px",
              }}
            >
              <PhoneInput
                country={"us"}
                value={formData.phone}
                onChange={(value) => handleInputChange("phone", value)}
                inputStyle={{
                  width: "100%",
                  height: "100%",
                  background: "transparent",
                  border: "none",
                  fontSize: "16px", // Same size for consistency
                }}
                containerStyle={{ width: "100%" }}
              />
            </div>
          </div>
        </div>

        {/* Email */}
        <div
          className="form-group5"
          style={{ flex: "1", marginBottom: "27px" }}
        >
          <div className="input-field">
            <div>
              <label htmlFor="email">Email</label>
            </div>
            <div
              className="inputBorder"
              style={{
                display: "flex",
                alignItems: "center",
                padding: "8px 12px",
                backgroundColor: "#f5f5f5",
                borderRadius: "5px",
                width: "100%",
                height: "40px",
              }}
            >
              <img
                src={emailLogo}
                style={{ width: "16px", height: "16px", marginRight: "8px" }}
              />
              <input
                type="email"
                id="email"
                placeholder="Enter Business Email"
                value={formData.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                style={{
                  width: "100%",
                  height: "100%",
                  background: "transparent",
                  border: "none",
                  fontSize: "16px", // Same as phone input
                  outline: "none",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Website */}
      {/* <div className="form-group6">
        <div className="input-field">
          <div>
            <label htmlFor="website">Website</label>
          </div>
          <div className="inputBorder">
            <img src={websiteLogo} style={{ width: "12px", height: "12px" }} />
            <input
              type="url"
              id="website"
              placeholder="Enter Business Website"
              value={formData.website}
              onChange={(e) => handleInputChange("website", e.target.value)}
            />
          </div>
        </div>
      </div> */}

      {/* Website */}
      {/* Business Website */}
      <div className="website-group">
        <div className="input-field">
          <div>
            <label htmlFor="businessWebsite">Business Website</label>
          </div>
          <div className="website-input">
            <img src={websiteLogo} style={{ width: "12px", height: "12px" }} />
            <input
              type="url"
              id="businessWebsite"
              placeholder="Enter Business Website"
              value={formData.businessWebsite}
              onChange={(e) =>
                handleInputChange("businessWebsite", e.target.value)
              }
            />
          </div>
        </div>
      </div>

      {/* Next Button */}
      <div className="button-group">
        <button
          className="next-button"
          onClick={() => setStep(2)}
          style={{
            width: "100%",
            background: "linear-gradient(to right, #034d92, #0487d9)",
          }}
        >
          Next
        </button>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      key="step2"
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* <div className="login-heading" style={{ marginTop: "0px" }}>
        <h2 className="font-medium mb-10">Document Upload</h2>
        <p className="text-sm text-gray-600">
          Please upload the required documents below
        </p>
      </div> */}

      {/* License Upload */}
      <div className="upload-group">
        <div className="input-field">
          <label>Business License</label>
          <div className="upload-input">
            <input
              type="text"
              placeholder="Upload Business License"
              value={licenseFile ? licenseFile.name : ""}
              readOnly
            />
            <img
              src={uploadfileLogo}
              alt="Upload"
              className="upload-icon"
              onClick={() => document.getElementById("licenseInput").click()}
            />
            <input
              type="file"
              id="licenseInput"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileUpload(e.target.files[0], "license")}
              style={{ display: "none" }}
            />
          </div>
        </div>
      </div>

      {/* Tax ID Upload */}
      <div className="upload-group">
        <div className="input-field">
          <label>Tax ID Document</label>
          <div className="upload-input">
            <input
              type="text"
              placeholder="Upload Tax ID Document"
              value={taxIdFile ? taxIdFile.name : ""}
              readOnly
            />
            <img
              src={uploadfileLogo}
              alt="Upload"
              className="upload-icon"
              onClick={() => document.getElementById("taxIdInput").click()}
            />
            <input
              type="file"
              id="taxIdInput"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileUpload(e.target.files[0], "taxId")}
              style={{ display: "none" }}
            />
          </div>
        </div>
      </div>

      {/* Liability Insurance Upload */}
      <div className="upload-group">
        <div className="input-field">
          <label>Liability Insurance</label>
          <div className="upload-input">
            <input
              type="text"
              placeholder="Upload Liability Insurance"
              value={insuranceFile ? insuranceFile.name : ""}
              readOnly
            />
            <img
              src={uploadfileLogo}
              alt="Upload"
              className="upload-icon"
              onClick={() => document.getElementById("insuranceInput").click()}
            />
            <input
              type="file"
              id="insuranceInput"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileUpload(e.target.files[0], "insurance")}
              style={{ display: "none" }}
            />
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="button-group">
        <button
          className="prev-button"
          onClick={() => setStep(1)}
          style={{ width: "48%", background: "#f0f0f0" }}
        >
          Previous
        </button>
        <button
          className="next-button"
          onClick={() => setStep(3)}
          style={{
            width: "48%",
            background: "linear-gradient(to right, #034d92, #0487d9)",
          }}
        >
          Next
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div
          className="error-message"
          style={{ color: "red", marginTop: "10px" }}
        >
          {error}
        </div>
      )}
    </motion.div>
  );

  // Step 3: Services and Pricing
  const renderStep3 = () => (
    <motion.div
      key="step3"
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* <div className="login-heading" style={{ marginTop: "0px" }}>
        <h2 className="font-medium mb-10">Service Details</h2>
        <p className="text-sm text-gray-600">
          Tell us about your services and pricing
        </p>
      </div> */}

      {/* Services Offered */}
      <div className="form-group-department">
        <div className="input-field">
          <div>
            <label>Services Offered</label>
          </div>
          <div className="inputBorder">
            <Select
              options={[
                {
                  value: "Mental Health Support",
                  label: "Mental Health Support",
                },
                {
                  value: "Confidential Therapy",
                  label: "Confidential Therapy",
                },
                { value: "Career Guidance", label: "Career Guidance" },
                { value: "Legal Consultation", label: "Legal Consultation" },
                { value: "Financial Advisory", label: "Financial Advisory" },
              ]}
              value={formData.services}
              onChange={(selectedOption) =>
                handleInputChange("services", selectedOption)
              }
              placeholder={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={serviceLogo} // Use the correct service icon here
                    alt="Service Icon"
                    style={{
                      width: "12px",
                      height: "12px",
                      marginRight: "8px",
                    }}
                  />
                  <span>Select a Service</span>
                </div>
              }
              classNamePrefix="select"
              isSearchable={false}
              styles={{
                control: (provided) => ({
                  ...provided,
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  boxShadow: "none",
                  minHeight: "35px",
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
            />
          </div>
        </div>
      </div>

      {/* Pricing Structure */}
      {/* Pricing Structure */}
      <div className="upload-group">
        <div className="input-field">
          <label>Pricing Structure</label>
          <div className="upload-input">
            <input
              type="text"
              placeholder="Upload Pricing Structure"
              value={pricingFile ? pricingFile.name : ""}
              readOnly
            />
            <img
              src={uploadfileLogo}
              alt="Upload"
              className="upload-icon"
              onClick={() => document.getElementById("pricingInput").click()}
            />
            <input
              type="file"
              id="pricingInput"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileUpload(e.target.files[0], "pricing")}
              style={{ display: "none" }}
            />
          </div>
        </div>
      </div>
      {/* Availability */}
      {/* Availability */}
      <div className="form-group1">
        <div className="input-field">
          <div>
            <label htmlFor="availability">Availability</label>
          </div>
          <div className="inputBorder">
            <img
              src={availabilityLogo}
              style={{ width: "12px", height: "12px" }}
            />
            <input
              type="text"
              id="availability"
              placeholder="e.g., Mon-Fri 9AM-5PM"
              value={formData.availability}
              onChange={(e) =>
                handleInputChange("availability", e.target.value)
              }
            />
          </div>
        </div>
      </div>
      {/* Booking Method */}
      {/* Booking Method */}
      <div className="form-group-department">
        <div className="input-field">
          <div>
            <label>Booking Method</label>
          </div>
          <div className="inputBorder">
            <Select
              options={bookingMethodOptions}
              value={formData.bookingMethod}
              onChange={(option) => handleInputChange("bookingMethod", option)}
              placeholder={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={departmentLogo}
                    alt=""
                    style={{
                      width: "12px",
                      height: "12px",
                      marginRight: "8px",
                    }}
                  />
                  <span>Select Booking Method</span>
                </div>
              }
              classNamePrefix="select"
              styles={{
                control: (provided) => ({
                  ...provided,
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  boxShadow: "none",
                  minHeight: "35px",
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
            />
          </div>
        </div>
      </div>

      {/* Service Area */}
      <div className="form-group-department">
        <div className="input-field">
          <div>
            <label>Service Area</label>
          </div>
          <div className="inputBorder">
            <Select
              options={serviceAreaOptions}
              value={formData.serviceArea}
              onChange={(option) => handleInputChange("serviceArea", option)}
              placeholder={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={areaLogo}
                    alt=""
                    style={{
                      width: "12px",
                      height: "12px",
                      marginRight: "8px",
                    }}
                  />
                  <span>Select Service Area</span>
                </div>
              }
              classNamePrefix="select"
              styles={{
                control: (provided) => ({
                  ...provided,
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  boxShadow: "none",
                  minHeight: "35px",
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
            />
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="button-group">
        <button
          className="prev-button"
          onClick={() => setStep(2)}
          style={{ width: "48%", background: "#f0f0f0" }}
        >
          Previous
        </button>
        <button
          className="next-button"
          onClick={() => setStep(4)}
          style={{
            width: "48%",
            background: "linear-gradient(to right, #034d92, #0487d9)",
          }}
        >
          Next
        </button>
      </div>
    </motion.div>
  );
  const renderStep4 = () => (
    <motion.div
      key="step4"
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Full Name */}
      <div className="form-group1">
        <div className="input-field">
          <div>
            <label htmlFor="fullName">Full Name</label>
          </div>
          <div className="inputBorder">
            <img
              src={inputLogo}
              alt="Input Icon"
              style={{ width: "12px", height: "12px", marginRight: "8px" }}
            />
            <input
              type="text"
              id="fullName"
              placeholder="Enter Full Name"
              value={formData.contactPerson?.fullName || ""}
              onChange={(e) =>
                handleInputChange("contactPerson", {
                  ...formData.contactPerson,
                  fullName: e.target.value,
                })
              }
            />
          </div>
        </div>
      </div>

      {/* Role */}
      <div className="form-group1">
        <div className="input-field">
          <div>
            <label htmlFor="role">Role/Position</label>
          </div>
          <div className="inputBorder">
            <img
              src={roleLogo}
              alt="Role Icon"
              style={{ width: "12px", height: "12px", marginRight: "8px" }}
            />
            <input
              type="text"
              id="role"
              placeholder="Enter Role/Position"
              value={formData.contactPerson?.role || ""}
              onChange={(e) =>
                handleInputChange("contactPerson", {
                  ...formData.contactPerson,
                  role: e.target.value,
                })
              }
            />
          </div>
        </div>
      </div>

      {/* Email */}

      {/* Navigation Buttons */}
      <div className="button-group">
        <button
          className="prev-button"
          onClick={() => setStep(3)}
          style={{ width: "48%", background: "#f0f0f0" }}
        >
          Previous
        </button>
        <button
          className="next-button"
          onClick={() => setStep(5)}
          style={{
            width: "48%",
            background: "linear-gradient(to right, #034d92, #0487d9)",
          }}
        >
          Next
        </button>
      </div>
    </motion.div>
  );

  const renderStep5 = () => (
    <motion.div
      key="step5"
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="platform-fee-container"
    >
      <div>
        <div>
          <h3>Platform Fees</h3>
        </div>

        <div className="fees">
          <ul>
            <li>
              Vendors may be charged either a 2% transaction fee per invoice or
              5% per invoice fee for premium visibility.
            </li>
            <li>Your fee structure will be finalized during onborading.</li>
            <li>
              Bookings and your order are processed through our AI-powered
              system.
            </li>
          </ul>
        </div>

        {/* Added Checkbox */}
        <div
          className="terms-checkbox"
          style={{
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <input
            type="checkbox"
            id="acceptFees"
            checked={formData.acceptFees}
            onChange={(e) => handleInputChange("acceptFees", e.target.checked)}
            style={{
              width: "16px",
              height: "16px",
              cursor: "pointer",
            }}
          />
          <label
            htmlFor="acceptFees"
            style={{
              cursor: "pointer",
              fontSize: "14px",
              color: "#666",
            }}
          >
            I understand and accept the platform fees structure
          </label>
        </div>

        <div className="button-group">
          <button
            className="prev-button"
            onClick={() => setStep(4)}
            style={{ width: "48%", background: "#f0f0f0" }}
          >
            Previous
          </button>
          <button
            className="next-button"
            onClick={handleSignup}
            disabled={!formData.acceptFees || isSubmitting}
            style={{
              width: "48%",
              background:
                formData.acceptFees && !isSubmitting
                  ? "linear-gradient(to right, #034d92, #0487d9)"
                  : "#ccc",
              cursor:
                formData.acceptFees && !isSubmitting
                  ? "pointer"
                  : "not-allowed",
              opacity: formData.acceptFees && !isSubmitting ? 1 : 0.7,
              transition: "all 0.3s ease",
            }}
          >
            {isSubmitting ? "Submitting..." : "Accept & Continue"}
          </button>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="error-message"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              style={{
                position: "fixed",
                bottom: 20,
                right: 20,
                background: "#ffdddd",
                padding: "10px 20px",
                borderRadius: "5px",
                color: "red",
              }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );

  // Add renderStep6 for success message
  const renderStep6 = () => (
    <motion.div
      key="step7"
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="success-container"
    >
      <div
        style={{
          backgroundColor: "#0487D9",
          padding: "30px 0px",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "20px",
          borderRadius: "10px",
          color: "white",
        }}
      >
        <img src={thumbsLogo} alt="thumbsLogo" />
        <h2 style={{ fontSize: "18px", color: "white" }}>
          Thank You For Applying! We are reviewing your application.
        </h2>
      </div>
    </motion.div>
  );

  return (
    <div className="form-container">
      <AnimatePresence mode="wait" initial={false}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
        {currentStep === 5 && renderStep5()}
        {currentStep === 6 && renderStep6()}
        {/* Other steps will be added here */}
      </AnimatePresence>
      <AnimatePresence>
        {error && (
          <motion.div
            className="error-message"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            style={{
              position: "fixed",
              bottom: 20,
              right: 20,
              background: "#ffdddd",
              padding: "10px 20px",
              borderRadius: "5px",
              color: "red",
            }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VendorSignUpForm;
